# RAPORT A — RECOVERY: stan uszkodzony → stan odzyskany (runda 5)

**`--apply` nie uruchomiony.** Kanon: 197 obiektów · 206 zdarzeń · 0 błędów · bajtowo nietknięty.
Wykonawca: `node recover.js --dry-run | --apply | --fail-after <krok> | --kill-after <krok>`

---

## 1. Cztery blokery audytu — co zrobione

### Kotwica zaufania: poza repo i niezależna od `HOME`

Runda 5 przeniosła klucz z repo do `~/.genome`. Runda 6 pokazała, że to nie wystarcza: `os.homedir()` respektuje `$HOME`, więc proces mógł wskazać katalog tymczasowy z własnym kluczem.

Teraz katalog zaufania pochodzi z **bazy użytkowników** — `os.userInfo().homedir` czyta `passwd` i `$HOME` go nie zmienia. Dodatkowo kotwica jest sprawdzana pod kątem **właściciela i praw**: klucz i katalog muszą należeć do uid procesu i nie mogą być zapisywalne dla grupy ani innych.

Zero klucza publicznego w repo (także w fixture). Wykonawcy **nie instalują klucza** — instalowanie zaufania, którym się właśnie zweryfikowało, jest cyrkularne. Rotacja przez `verifyKeyRotation()`: nowy klucz tylko z podpisem **poprzednim**.

Flaga `--trust` **usunięta ze wszystkich plików produkcyjnych**, a z `lib/approval.js` zniknął też argument `publicKeyPem` — deklaracja „brak punktu wstrzyknięcia" była wcześniej nieprawdziwa. Testy instalują wykonawcę w kopii i przepisują `trustDir()` **w tej kopii**.

**`--apply` nie przyjmuje już `--target`.** Dopóki przyjmował, każda kontrola musiała zgadywać, czy podany korzeń jest „bezpieczną kopią" — a to pytanie da się przekręcić (`TMPDIR`, symlink). Usunięte jest samo pytanie: przy `--apply` celem jest zawsze instalacja wykonawcy. `--target` zostaje wyłącznie dla `--dry-run`, gdzie dodatkowo działa guard kanonu (`lib/canon-guard.js`) porównujący **realne** ścieżki zapisu.

**`migrate.js`** przeszedł na wspólny `approval.js` i tę samą kotwicę: nie szuka już klucza w repo (`lib/approval-pubkey.pem`, którego manifest świadomie nie wdraża) i nie używa `os.tmpdir()` do oceny piaskownicy.

Instrukcja: [SETUP-KOTWICY.md](../final-salt-plate/SETUP-KOTWICY.md).

### Podpis obejmuje artefakty

`artifact_hashes` jest polem podpisywanym. Recovery weryfikuje `recover.js` **i sam siebie**, oraz materiał do przywrócenia. Pod blokadą każdy plik czytany **raz**, hash liczony z bufora, i **ten sam bufor** trafia na dysk — bez drugiego odczytu (TOCTOU).

### Snapshot z wymaganym hashem

`recovered: true` + 32 rekordy to kształt, nie tożsamość — audyt podmienił zawartość bez naruszania kształtu i recovery ją przyjęło. Dodany wymagany SHA-256 **`3ae31e669984fc8746a7498ff770cdc0d382ff615a69e7d495d1053fcb146a91`**, sprawdzany w preconditions (7/7 zamiast 6/6).

### Blokada bez okna i bez timeoutu

Runda 5 dała „grace 5 s" na zapisanie PID — audyt odtworzył: writer zwlekający 6 s tracił blokadę na rzecz drugiego i **obaj weszli do sekcji krytycznej**. Timer był tym samym błędem, tylko wolniejszym.

Teraz publikacja idzie przez **`link(2)`**: treść z PID powstaje obok, a `link` na docelową ścieżkę zawodzi z `EEXIST`, gdy blokada istnieje. Wpis nigdy nie jest widoczny pusty ani bez właściciela. `rename()` odrzucony świadomie — POSIX pozwala nadpisać **pusty katalog** docelowy, więc drugi writer podmieniłby cudzą blokadę.

**Zero automatycznego przejmowania po czasie.** Blokada bez czytelnego właściciela wymaga świadomego usunięcia przez człowieka, niezależnie od wieku. Jedyne automatyczne przejęcie: właściciel udokumentowany i udowodniono, że nie żyje.

### Dziennik: błąd odtwarzania NIE kasuje danych

Runda 5 dodała dziennik, ale brakujący blob dawał wpis „BŁĄD" i mimo to `.genome-txn` znikał, a funkcja zwracała `ok:true` — audyt potwierdził stan pośredni i utratę dziennika.

Teraz dziennik ma stan **PREPARED / COMMITTED**, a każdy wpis niesie **sha256 oryginału**:

- **każdy** błąd odtworzenia → `ok:false`; dziennik i **wszystkie ocalałe bloby zostają nietknięte**; żadna kolejna transakcja nie ruszy,
- to samo dotyczy **rollbacku synchronicznego**: `Txn.rollback()` zwraca `{ok, restored, problems}`, a `runTransaction()` kasuje dziennik **wyłącznie** po pełnym, zweryfikowanym hashami rollbacku — w obu gałęziach (`{ok:false}` i `catch`),
- odtworzone pliki są **weryfikowane hashem** po zapisie (blob uszkodzony ≠ oryginał → błąd),
- dziennik **COMMITTED** jest **tylko sprzątany, nigdy rollbackowany** — cofanie udanej pracy byłoby gorsze niż jej zostawienie,
- dziennik żyjącego procesu jest nietykalny; nieczytelny manifest → `ok:false` i zero usunięć.

## 2. PRÓBA A — 64 PASS · 0 FAIL · exit 0 · stderr pusty

| grupa | co dowodzi |
|---|---|
| **A0a–A0d** | brak podpisu → exit 3, zero bajtów · kotwica z **obcym** kluczem odrzuca podpis, zero bajtów |
| **A1a** | w repo **nie ma** klucza publicznego; `PUBKEY_FILE` wskazuje `~/.genome/` |
| **A1b–A1i** | SUKCES: 8 kroków, build 0 błędów, archiwum 179 z wymaganym sha256, snapshot 32/`recovered:true`, freeze 179/`4f96034058f4c5fa`, Record incydentu, artefakty z hashami, 0226/0227 na miejscu, nonce zużyty |
| **A1j–A1k** | powtórzenie odrzucone (preconditions) · ten sam nonce drugi raz → odmowa + rollback |
| **A2 ×8** | awaria po każdym kroku → rollback; drzewo, Ledger, nonce, archiwum, snapshot, freeze **bajtowo identyczne** |
| **A3** | dryf hashu wejściowego → abort przed jakimkolwiek zapisem |
| **A5 ×3** | **mutacja każdego artefaktu po podpisie** (wykonawca, archiwum, snapshot) → odmowa przed zapisem, zero bajtów |
| **A6a–A6c** | **podmieniony snapshot z zachowanym kształtem** → odrzucony przez hash; zero bajtów; wymagany hash wpisany w kod |
| **A7 ×8** | **SIGKILL po każdym kroku** → dziennik, restart cofa transakcję, `.genome-txn` znika, brak stanu pośredniego |
| **A8 ×4** | zwłoki **1 ms, 5 s, 30 s, 10 min** przed publikacją blokady → **dokładnie jeden** writer w sekcji krytycznej |
| **A8.sierota** | blokada bez czytelnego właściciela **nie jest przejmowana automatycznie** (wymaga człowieka) · z martwym PID — jest |
| **A9a–A9g** | dziennik: brakujący blob · uszkodzony blob · brak uprawnień · COMMITTED tylko sprzątany · żyjący proces nietykalny · nieczytelny manifest · poprawny rollback z weryfikacją hashem |
| **A11a–A11e** | **nieudany rollback synchroniczny**: `rollback_failed` zamiast `rolled_back` · dziennik i bloby kompletne · stan pośredni zgłoszony jawnie · następny writer **odmawia** · dziennik po odmowie nadal istnieje |
| **A10a–A10g** | **atak przez `HOME`** → odmowa, zero bajtów · `TRUST_DIR` z `os.userInfo().homedir` · **brak `--trust` i `publicKeyPem` w kodzie produkcyjnym** · warstwa zaufania bez `process.env`, `os.tmpdir()` i `os.homedir()` · **`TMPDIR` = katalog kanonu** niczego nie autoryzuje · **`--apply` z `--target` odrzucone** |
| **A4** | kanon bajtowo nietknięty przez cały zestaw |

## 3. Stan po recovery

```
archiwum:  179 linii · sha256 4806dd3da1a8b4d3…  ✓
snapshot:  32 Recordy · recovered: true · sha256 3ae31e669984fc87…  ✓
freeze:    seed_event_count: 179 · seed_tail_hash: "4f96034058f4c5fa"
ledger:    208 zdarzeń — 0226/0227 POZOSTAJĄ (append-only)
build:     198 obiektów · 208 zdarzeń · 0 błędów · 244 ostrzeżenia
```

## 4. Do wykonania

`recovery-bundle.json` ma policzone `payload_hash` i `artifact_hashes`. Brakuje **nonce, terminu ważności i podpisu właściciela** kluczem prywatnym z `~/.genome/approval.ed25519`. `--apply` odmawia bez nich (exit 3). Nie ma trybu „usuń blok kodu".

## 5. Znane, nieblokujące ograniczenie (audyt rundy 9)

`TARGET/build.js` **nie jest** w `RECOVERY_MANIFEST`, choć wykonuje końcowy `--check`. Jest to
kontrola **read-only** — nie zapisuje do Genome — więc jej podmiana nie daje drogi zapisu, może
najwyżej zafałszować werdykt „build zielony". Audyt sprawdził go niezależnie: zielony.

Do dołożenia przy najbliższej okazji: hash `build.js` jako precondition recovery (obok siedmiu
elementów runtime). **Nie robię tego teraz**, bo pakiet jest gotowy do podpisu, a każda zmiana
runtime unieważnia policzone `artifact_hashes` i wymaga ponownego przeliczenia.
