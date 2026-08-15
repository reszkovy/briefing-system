# RAPORT B — SALT/PLATE: stan odzyskany → wdrożenie (runda 5)

**`--apply` nie uruchomiony.** Kanon bajtowo nietknięty. Warunek wstępny: RAPORT A wykonany.
Wykonawca: `node deploy.js --dry-run | --apply | --fail-after <krok> | --kill-after <krok>`

---

## 1. Pięć blokerów audytu — co zrobione

### 1. Zaufanie niezależne od agenta — także od `$HOME`

Klucz publiczny **usunięty z repo** (łącznie z fixture) i z manifestu wdrożeniowego. Katalog zaufania pochodzi z **bazy użytkowników** (`os.userInfo().homedir`), więc `$HOME` na niego nie wpływa — to była dziura rundy 6. Kotwica jest dodatkowo sprawdzana pod kątem właściciela i praw (uid procesu, brak zapisu dla grupy/innych).

Deploy nie instaluje klucza, którym się właśnie zweryfikował. Rotacja wymaga podpisu poprzednim kluczem. Patrz [SETUP-KOTWICY.md](SETUP-KOTWICY.md).

**`--trust` usunięty z produkcji, `publicKeyPem` usunięty z modułu, `--apply` bez `--target`.**
Bramka flagi była omijalna na dwa sposoby (`TMPDIR`, symlink `r352-os/genome` → kanon), a argument `publicKeyPem` przeczył deklaracji o braku wstrzyknięcia. Zamiast łatać: przy `--apply` celem jest **instalacja wykonawcy**, więc wywołujący nie wybiera już korzenia zapisu. `--target` działa tylko w `--dry-run`, gdzie chroni go `lib/canon-guard.js` (porównanie **realnych** ścieżek, dwie reguły: „nie dotykaj kanonu" i „nie wychodź poza zadeklarowany cel").

Próby z **WAŻNYM podpisem** (wykonawca zainstalowany w kopii, kotwica ufa kluczowi testowemu — bez tego atak odbijał się o podpis i nigdy nie docierał do guardu): **B9d** kontrola pozytywna · **B9e** `--apply --target` odrzucone · **B9f** symlink → kanon w dry-run odrzucony, kanon nietknięty · **B9g** `TMPDIR`=kanon nie czyni z kanonu piaskownicy.

### 2. Podpis obejmuje wdrażane pliki

`artifact_hashes` — SHA-256 **wszystkich 17 wdrażanych plików**: 6 bibliotek, `ingest.js`, `migrate.js`, `ROUTER.md`, 2 skille, 5 zestawów testów i **sam `deploy.js`**. Pole jest częścią podpisu (`SIGNED_FIELDS`), a `verifyApproval` z `requireArtifacts` odrzuca pakiet bez niego.

Pod blokadą: każdy plik czytany **raz**, hash liczony z bufora, porównywany z podpisanym, i **ten sam bufor** zapisywany. Bez drugiego odczytu, więc bez TOCTOU.

Próba audytu — zmiana `ROUTER.md` po podpisaniu — jest teraz testem **B4** i przechodzi dla **każdego** z 17 plików: odmowa przed jakimkolwiek zapisem, zero zmienionych bajtów.

### 3. Jeden writer Evidence

Ręczna implementacja w `deploy.js` **usunięta**. Powstał `lib/evidence-writer.js` — jedna funkcja `applyEvidence()`, z której korzystają **i deploy, i ingest**. Wspólne są: słowniki typów i kierunków, deduplikacja po **ID, fingerprint i independence_key**, `evidenceStrength()` z `independent_sources`, rozkład kierunków, przeliczenie confidence i generowanie `evidence.added`.

`confidenceFromEvidence()` sygnalizuje kwalifikację do `validated`, ale **nigdy jej nie nadaje** — deploy odmawia, gdyby przeliczenie do niej kwalifikowało.

Testy **B7a–B7d**: oba wykonawce wołają tę samą funkcję i żaden nie ma własnej kopii; writer jest deterministyczny; deduplikacja działa **także przy innym ID** (fingerprint/independence_key); `evidence_strength` niesie `independent_sources` i kierunki.

### 4. Blokada bez okna i bez timeoutu

Publikacja przez **`link(2)`** — wpis nigdy nie jest widoczny pusty ani bez właściciela. `rename()` odrzucony: POSIX pozwala nadpisać pusty katalog docelowy. **Zero przejmowania po czasie** — blokada bez czytelnego właściciela czeka na człowieka.

Test **B6** uruchamia A ze zwłoką publikacji i B w jej środku: **dokładnie jeden** wchodzi do sekcji krytycznej. Macierz zwłok 1 ms / 5 s / 30 s / 10 min jest w PRÓBIE A (**A8 ×4**).

### 5. Odporność na SIGKILL + dziennik, który nie kasuje danych

Trwały dziennik `.genome-txn/` ze stanem **PREPARED/COMMITTED** i sha256 każdego oryginału. Każdy błąd odtworzenia → `ok:false`, dziennik i bloby **nietknięte**, żadna kolejna transakcja. COMMITTED jest tylko sprzątany, nigdy rollbackowany. Test **B5 ×8** (SIGKILL po każdym kroku) + **A9a–A9g** (siedem trybów awarii dziennika).

### 6. Bramka recovery: dokładne wartości, nie `includes()`

Deploy sprawdza teraz **9 warunków**, w tym:

- **dokładny sha256 snapshotu** `3ae31e669984fc8746a7498ff770cdc0d382ff615a69e7d495d1053fcb146a91`,
- **dokładnie jedno** zdarzenie recovery — parsowane **per linia JSONL**, z dopasowaniem `kind` + `on` + `cause` w **tym samym** zdarzeniu (`includes()` po całym Ledgerze dawałby trafienie, gdy fragmenty leżą w różnych zdarzeniach),
- **integralność hash-chain** całego Ledgera po recovery.

Testy **B8a–B8d**: zmieniony bajt snapshotu · podmienione pole zdarzenia **przy przeliczonym hash-chain** · zerwany chain · statyczny dowód, że kod nie używa `includes()`. Każdy zatrzymuje deploy **przed pierwszym zapisem**, zero zmienionych bajtów.

## 2. PRÓBA B — 69 PASS · 0 FAIL · exit 0 · stderr pusty

| grupa | co dowodzi |
|---|---|
| **B0a–B0a3** | w repo nie ma klucza · kotwica z obcym kluczem odrzuca · zero bajtów |
| **B0b–B0e** | bramka recovery blokuje na stanie nieodzyskanym (7/8 warunków niespełnionych) · brak podpisu → exit 3 · zero bajtów |
| **B1a–B1k** | SUKCES: 8 kroków, build 0, **7 kart**, Evidence przez wspólny writer, `object.created` przed `evidence.added`, jawne `direction`, zero `object.updated` na karcie freeze, nonce, skille, graf bez fałszywej krawędzi `requires`, replay odrzucony |
| **B2 ×8** | awaria po każdym kroku → rollback: drzewo, Ledger, nonce, **skille obu platform**, archiwum, snapshot bajtowo identyczne |
| **B4 ×17** | **mutacja każdego pliku manifestu po podpisie** → odmowa przed zapisem, zero bajtów |
| **B5 ×8** | **SIGKILL po każdym kroku** → dziennik, restart, brak stanu pośredniego |
| **B6** | dwa writery nigdy jednocześnie pod blokadą (okno bez PID zamknięte) |
| **B7a–B7d** | deploy i ingest mają **identyczną** semantykę Evidence |
| **B8a–B8d** | bramka recovery: sha256 snapshotu · dokładnie 1 zdarzenie w jednej linii JSONL · hash-chain · brak `includes()` |
| **B9a–B9g** | atak przez `HOME` · zero bajtów · brak `--trust`/`publicKeyPem` w produkcji · kontrola pozytywna ważnego podpisu · `--apply --target` odrzucone · symlink → kanon · `TMPDIR`=kanon |
| **B3** | kanon bajtowo nietknięty |

## 3. Wszystkie zestawy

```
A recovery  64 · B deploy 69 · final 87 · e2e 24
migracja    39 · bramka   14 · writer 19 · graf 19
──────────────────────────────────────────────────
razem      335 PASS · 0 FAIL · exit 0 · stderr pusty w każdym zestawie
```

## 4. Ryzyka i świadome ograniczenia

**Granica kotwicy to konto użytkownika.** Kto potrafi zapisać do `<homedir>/.genome` jako ten użytkownik, ten podmieni zaufanie. Obie dziury aplikacyjne są zamknięte (`GENOME_APPROVAL_KEY` i `$HOME`), ale kryptografia nie zastępuje kontroli nad systemem. Twardsza wersja: Keychain/HSM albo zewnętrzny launcher.

**Klucz prywatny musi być poza zasięgiem agenta.** Warunek operacyjny przed wdrożeniem: w `<homedir>/.genome` zostaje **wyłącznie klucz publiczny**. Klucz prywatny w tym samym katalogu byłby czytelny dla każdego procesu tego użytkownika — czyli i dla agenta — co unieważnia rozdział uprawnień. Trzy dopuszczalne warianty (Keychain, podpis offline, osobne konto) opisane w [SETUP-KOTWICY.md](SETUP-KOTWICY.md). Kodu to nie egzekwuje i egzekwować nie może — to decyzja operacyjna właściciela.

**Dziennik chroni przed SIGKILL, nie przed uszkodzeniem dysku.** Zapisy są atomowe per plik (`tmp` + `rename`), ale nie ma `fsync` — awaria zasilania między `rename` a zrzutem cache może zostawić nowszy plik bez wpisu w dzienniku. Twardsza wersja wymaga `fsync` na pliku i katalogu.

**Rejestr nonce jest plikiem.** Wystarczające przy jednym pisarzu; przy wielu maszynach potrzebny wspólny magazyn.

**Dwie implementacje dopisywania do Ledgera.** `lib/genome-txn.js` (wykonawcy) i `ingest.js` (writer pakietów). Evidence już jest wspólne; Ledger jeszcze nie. **Nazywam to, zamiast udawać, że jest inaczej** — zwinięcie ingestu na `Txn` to osobna zmiana.

**`direction` jest oceną sesji.** Kontrakt sprawdza obecność i słownik, nie prawdziwość.

**`mech:strategy-before-execution` bez żywego dowodu.** `emerging`, backtesty `neutral` i `limits`. Karty `wf:salt`/`wf:plate` w `status: draft`.

## 5. Kolejność wykonania

1. właściciel zakłada kotwicę (`SETUP-KOTWICY.md`) — **jednorazowo, poza repo**,
2. przelicza `payload_hash` i `artifact_hashes`, podpisuje `recovery-bundle.json`,
3. `node recover.js --apply`,
4. audyt stanu po recovery,
5. podpisuje `deploy-bundle.json`,
6. `node deploy.js --apply`.

Kanon: `197 obiektów · 206 zdarzeń · 0 błędów` · `workflows/` pusty · zero dzienników i blokad · **zero `--apply`**.
