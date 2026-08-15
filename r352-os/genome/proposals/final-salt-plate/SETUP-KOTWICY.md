# Kotwica zaufania — czynność właściciela, poza repo

Wykonawcy (`recover.js`, `deploy.js`) i writer (`ingest.js`, `migrate.js`) czytają klucz publiczny
**wyłącznie** z katalogu domowego wyprowadzonego z **bazy użytkowników** (`os.userInfo().homedir`),
czyli `<homedir>/.genome/approval-pubkey.pem`.

Dwie rzeczy, których tam **nie ma**:

- **repo** — poprzednia wersja trzymała klucz w `lib/`, czyli w miejscu zapisywalnym przez agenta;
  audyt podmienił klucz publiczny, podpisał własnym prywatnym i wdrożenie przeszło,
- **`$HOME`** — `os.homedir()` respektuje zmienną środowiskową, więc proces mógł wskazać katalog
  tymczasowy z własnym kluczem. `os.userInfo().homedir` czyta `passwd` i `$HOME` go nie zmienia.

Dodatkowo kotwica jest sprawdzana pod kątem **właściciela i praw**: klucz i katalog muszą należeć
do uid procesu i nie mogą być zapisywalne dla grupy ani innych. Katalog świata-zapisywalny to nie
kotwica, tylko skrzynka na listy.

## Jednorazowe założenie kotwicy (robi właściciel, nie agent)

W `<homedir>/.genome` ląduje **wyłącznie klucz publiczny**. Klucz prywatny **nigdy** — patrz
„WARUNEK OPERACYJNY" niżej; katalog domowy jest czytelny dla każdego procesu tego użytkownika,
więc także dla agenta.

**Klucz prywatny nie może przejść przez plik ani przez argumenty procesu.** `security … -w "$(cat
priv.pem)"` wkłada sekret do `argv`, gdzie widzi go `ps` każdego procesu tego użytkownika — czyli
i agenta — oraz historia powłoki. Poniższa wersja nie zapisuje klucza prywatnego na dysk i nie
podaje go w argumentach; jedyną ekspozycją jest schowek między krokiem 1 a 2.

```bash
mkdir -p ~/.genome && chmod 700 ~/.genome
# 1) para kluczy: PUBLICZNY prosto do kotwicy, PRYWATNY (base64 DER) tylko do schowka
node -e '
const c=require("crypto"),fs=require("fs"),os=require("os"),p=require("path");
const {publicKey,privateKey}=c.generateKeyPairSync("ed25519");
const anchor=p.join(os.userInfo().homedir,".genome","approval-pubkey.pem");
fs.writeFileSync(anchor, publicKey.export({type:"spki",format:"pem"}), {mode:0o600});
process.stdout.write(privateKey.export({type:"pkcs8",format:"der"}).toString("base64"));
console.error("kotwica zapisana: "+anchor);
' | pbcopy
# 2) klucz PRYWATNY → Keychain. `-w` BEZ WARTOŚCI = pytaj; po znaku zachęty wklej ⌘V i Enter.
#    -T bez argumentu = żadna aplikacja nie ma cichego dostępu; każde użycie prosi o zgodę.
security add-generic-password -a "$USER" -s genome-approval -T "" -U -w
# 3) natychmiast wyczyść schowek
pbcopy < /dev/null
#    Ustaw też ACL „always allow: nie" w Dostępie do pęku kluczy (Keychain Access) dla tego wpisu.
```

**Warunek wykonania:** podczas kroków 1–3 nie mogą działać inne sesje agentów. Schowek jest
czytelny dla każdego procesu tego konta, więc jest to chwilowa, ale realna ekspozycja sekretu.
Kto chce jej uniknąć całkowicie, robi krok 1 na maszynie offline — patrz wariant B niżej.

Ścieżkę kotwicy wyprowadza `os.userInfo().homedir` (baza użytkowników), więc `$HOME` jej nie
zmienia. Sprawdzany jest też właściciel i prawa: klucz i katalog muszą należeć do uid procesu
i nie mogą być zapisywalne dla grupy ani innych.

## Podpisanie pakietu

```bash
node -e '
const c=require("crypto"),fs=require("fs"),os=require("os"),p=require("path");
const A=require("./r352-os/genome/proposals/final-salt-plate/lib/approval.js");
const f=process.argv[1];
const b=JSON.parse(fs.readFileSync(f,"utf8"));
b.approval.package.nonce   = process.argv[2];          // jednorazowy
b.approval.package.expires_at = process.argv[3];       // YYYY-MM-DD
b.approval.nonce = b.approval.package.nonce;
b.approval.status="approved"; b.approval.approved_by="przemek";
b.approval.approved_at=new Date().toISOString();
// klucz prywatny z Keychaina — NIE z ~/.genome. Zapisany jako base64 PKCS8 DER (patrz krok 1).
const {execFileSync}=require("child_process");
const b64=execFileSync("security",["find-generic-password","-a",process.env.USER,"-s","genome-approval","-w"],{encoding:"utf8"}).trim();
const priv=c.createPrivateKey({key:Buffer.from(b64,"base64"),format:"der",type:"pkcs8"});
b.approval.signature=c.sign(null, A.signingBytes(b.approval.package), priv).toString("hex");
fs.writeFileSync(f, JSON.stringify(b,null,1));
console.log("podpisano:", f);
' <ścieżka-do-bundle.json> <nonce> <expires_at>
```

`payload_hash` i `artifact_hashes` są już w pakiecie — przelicz je **przed** podpisem, jeśli
cokolwiek w plikach się zmieniło, inaczej wykonawca odrzuci pakiet przed zapisem.

## Rotacja klucza

Nowy klucz publiczny wchodzi wyłącznie z podpisem **poprzednim** kluczem
(`approval.verifyKeyRotation`). Utrata kontroli nad repozytorium nie wystarcza, żeby zmienić zaufanie.

## Jak testy podają własne zaufanie

**Nie przez flagę.** `--trust` został usunięty ze wszystkich plików produkcyjnych (`recover.js`,
`deploy.js`, `ingest.js`, `migrate.js`), bo jego bramka była omijalna dwoma drogami: `TMPDIR`
wskazujący katalog obok kanonu oraz symlink `r352-os/genome` → kanon w „tymczasowym" repo.

Testy budują **własną kopię drzewa modułów** i w tej kopii przepisują `trustDir()` na katalog
testowy. Kopia nie jest w manifeście wdrożeniowym — nic z niej nie trafia do kanonu, a pliki
produkcyjne nie mają żadnego punktu wstrzyknięcia. Sprawdzają to testy `A10d`, `A10e`, `B9c`
(brak flagi i brak `publicKeyPem` w kodzie produkcyjnym; warstwa zaufania bez `process.env`,
`os.tmpdir()` i `os.homedir()`) oraz `B9d`/`B9e` (atak przez `TMPDIR` i przez symlink).

## WARUNEK OPERACYJNY: klucz prywatny poza zasięgiem agenta

**W `<homedir>/.genome` zostaje wyłącznie klucz PUBLICZNY.** Klucz prywatny w tym samym katalogu
byłby czytelny dla każdego procesu działającego jako ten użytkownik — czyli także dla agenta,
co unieważnia cały rozdział uprawnień.

Trzy dopuszczalne warianty (do wyboru przez właściciela):

**A. Keychain (macOS) z wymuszonym potwierdzeniem** — klucz nie leży na dysku jako plik,
a każde pobranie wymaga interaktywnej zgody. **Bez `-T ""` i bez ACL „always allow: nie" zwykły
Keychain NIE chroni przed agentem** — proces działający jako Ty pobrałby sekret bez pytania:
```bash
# jednorazowo — patrz sekcja „Jednorazowe założenie kotwicy" wyżej; ZAWSZE z -T "" i z -w BEZ WARTOŚCI
security add-generic-password -a "$USER" -s genome-approval -T "" -U -w   # → prompt, wklej ⌘V
# przy podpisywaniu: każde pobranie prosi o zgodę, klucz idzie do pamięci procesu podpisującego
security find-generic-password -a "$USER" -s genome-approval -w   # → stdin skryptu podpisującego
```

`-T ""` jest obowiązkowe. Bez niego wpis dostaje pustą listę zaufanych aplikacji **z cichym
dostępem dla procesu, który go utworzył** — czyli dokładnie dla powłoki, w której działa agent.

`-w` **bez wartości** też jest obowiązkowe. `-w "$(cat priv.pem)"` umieszcza klucz prywatny
w `argv`, a `ps` pokazuje argumenty procesów każdemu procesowi tego użytkownika. Sekret ląduje
przy okazji w historii powłoki. Nie zapisuj go również do pliku (`/tmp`, `/dev/shm`) — plik `600`
jest czytelny dla agenta działającego jako Ty, a **`rm -P` na obecnym macOS nie kasuje bezpiecznie
i na SSD nie daje żadnej gwarancji**. Każdy klucz prywatny, który choć raz dotknął dysku
niezaszyfrowanego katalogu roboczego, traktuj jako ujawniony i wymień go przez rotację.

**B. Podpis offline** — pakiet przenoszony na maszynę bez agentów, podpisywany tam, wracany
z podpisem. Najmocniejszy wariant; klucz prywatny nigdy nie dotyka maszyny roboczej.

**C. Osobny launcher/konto** — podpisywanie działa jako inny użytkownik systemowy, którego
katalog domowy jest nieczytelny dla konta agenta.

Czego **nie** robić: `~/.genome/approval.ed25519` obok klucza publicznego, ani Keychain **bez**
wymuszonego potwierdzenia. Oba znoszą korzyść z Ed25519, bo agent działa jako ten sam użytkownik
i pobrałby sekret bez pytania.

## Granica, której to NIE przekracza

Kto potrafi zapisać do `<homedir>/.genome` jako ten użytkownik, ten podmieni **klucz publiczny**
i tym samym zaufanie. To granica konta, nie aplikacji. Wszystkie trzy dziury aplikacyjne są
zamknięte (`GENOME_APPROVAL_KEY`, `$HOME`, `--trust`), ale kryptografia nie zastępuje kontroli
nad systemem. Wariant twardszy: klucz publiczny wpisany w kod podpisany przy dystrybucji albo
weryfikacja przez zewnętrzny launcher.
