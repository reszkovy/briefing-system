---
id: "rec:governance/2026-08-10-dlugi-po-recovery"
type: "record"
title: "Trzy długi domknięte po recovery i wdrożeniu SALT/PLATE"
status: "created"
created: "2026-08-10"
updated: "2026-08-10"
version: 1
owner: "przemek"
relations: {}
tags: ["governance","postmortem","recovery"]
---

## Kontekst

09.08.2026 wykonano dwie operacje na kanonie: recovery incydentu (16:09) i wdrożenie warstwy
SALT/PLATE (16:15). Oba przeszły z podpisem Ed25519 właściciela. Po nich zostały trzy długi —
żaden nie zagrażał integralności, każdy fałszował obraz stanu. Ten Record je zamyka.

## 1. Karta freeze mówiła co innego niż jej własny frontmatter

`rec:F0-SEED-FREEZE` miała we frontmatterze `seed_event_count: 179` i `seed_tail_hash:
4f96034058f4c5fa`, a w treści „pierwsze **205** zdarzeń" i hash `3eafbaef9cb6e223`. Do tego
`last_seed_event_id` wskazywał `evt:2026-08-09-0226`, czyli zdarzenie nr 205, a nie nr 179.
Recovery poprawiło pola maszynowe i nie tknęło prozy.

**Naprawione:** treść doprowadzona do 179 / `evt:2026-08-08-0126` / `4f96034058f4c5fa`,
`last_seed_event_id` poprawiony. Liczby defektów seeda usunięte z karty — raportuje je `build.js`
przy każdym przebiegu. Duplikat rozjechał się przy pierwszej zmianie granicy; jedno źródło prawdy
jest tańsze niż dwa zgodne.

## 2. Testy pytały żywy kanon o stan, który minął

Zestawy budowały cel przez `cp -R <kanon>`. Działało, dopóki kanon czekał na naprawę. W chwili
wykonania recovery preconditions przestały pasować: zestaw recovery spadł z **68 PASS** na
**56 PASS / 12 FAIL**, zestaw deploy przestał się uruchamiać, e2e dał 5 FAIL, final crashował.
Kod był w porządku; zmienił się świat, o który testy pytały.

**Naprawione — trzy rzeczy, nie jedna.**

1. **Syntetyczny fixture stanu wejściowego recovery**
   (`proposals/fixtures/recovery-input-synthetic`). Nazwa jest dosłowna i celowa: to NIE jest
   historyczny snapshot Genome. Dane są odtworzone do stanu sprzed naprawy (trzy uszkodzone
   artefakty z `records/incydenty/2026-08-09-artefakty/`, Ledger obcięty do
   `evt:2026-08-09-0227`), ale kod i karty są w wersji dzisiejszej. Do testowania recovery to
   wystarcza; do odtwarzania historii nie służy.
   Generator domyślnie robi WYŁĄCZNIE `--check`: nie tworzy, nie nadpisuje fixture'u ani
   zapisanego hasha. Regeneracja to osobna, jawna operacja `--regenerate` i nie zachodzi podczas
   testów. Pierwsza wersja generatora wciągnęła do fixture'u pakiet leżący w `pending/` i hash
   zmienił się bez żadnej zmiany w danych Genome — dokładnie ten scenariusz jest powodem, dla
   którego domyślnym trybem jest kontrola, nie budowanie.

2. **Zestawy działają z lokalizacji produkcyjnej.** Ścieżki liczone jako stała liczba `..`
   działały tylko z `proposals/`; po wdrożeniu szukały `<genome>/genome/...` i wywalały się na
   ENOENT. Korzeń Genome i katalog modułów są teraz rozpoznawane po cechach katalogu.

3. **Zestaw produkcyjny `run-canon-tests.js`** — fixture historyczny nie zastępuje sprawdzenia
   dzisiejszej instalacji. Na kopii aktualnego kanonu potwierdza: `build --check` bez błędów,
   writer poprawnie planuje pakiety z `pending/`, wszystkie moduły i katalogi są tam, gdzie
   zestawy ich szukają, fixture zgadza się z zapisanym hashem, a kanon zostaje bajtowo nietknięty.


## 3. Historyczna autoryzacja recovery nie jest już weryfikowalna kryptograficznie

Stan faktyczny, rozdzielony na trzy osobne rzeczy, bo mieszanie ich było zarzutem audytu.

**Co zostało przyjęte w chwili wykonania.** Wykonawca zweryfikował podpis Ed25519 pakietu
recovery przed pierwszym zapisem i wypisał `ZGODA: verified` (09.08, 16:09). Ta weryfikacja
przebiegła wtedy i została przyjęta jako poprawna. Nie mamy dziś sposobu, by ją niezależnie
powtórzyć.

**Co dowodzi Ledger i rejestr nonce.** Że operacja się WYDARZYŁA i w jakiej KOLEJNOŚCI:
`evt:2026-08-09-0228` i `-0229`, spójny łańcuch hash na całej długości, nonce
`recovery-2026-08-09-001` odnotowany jako zużyty wraz z odciskiem pakietu. Ledger nie dowodzi
i nie może dowodzić, że autoryzował ją właściciel — jest zapisem faktu, nie dowodem zgody.

**Czego nie da się dziś zrobić.** Zweryfikować kryptograficznie, że pakiet recovery był podpisany
kluczem właściciela. Klucz prywatny K1 skasowano zaraz po podpisie zgodnie z przyjętym modelem
operacyjnym, a przy wdrożeniu SALT/PLATE para K2 nadpisała kotwicę
`~/.genome/approval-pubkey.pem`. **Publiczny klucz K1 nie został nigdzie zachowany**, więc
weryfikacja historyczna jest niemożliwa trwale, nie chwilowo.

**Mylący komunikat.** `verifyApproval` na pakiecie recovery zwraca dziś `invalid` z tekstem
„treść zmieniona po akceptacji albo podpis fałszywy". Treść nie została zmieniona; zmieniła się
kotwica. Kod nie odróżnia rotacji klucza od manipulacji pakietem. Nie naprawiamy tego teraz:
zmiana dotknęłaby pliku z manifestu wdrożenia i otwierała kolejną rundę na warstwie podpisów,
co jest wprost poza zakresem. Zapisane jako znane ograniczenie.

**Konsekwencja na przyszłość.** Każdy pakiet podpisany kluczem, który potem zniknął, jest
historycznie nieweryfikowalny. To cena modelu „klucz jednorazowy, kasowany po użyciu", przyjęta
świadomie. Weryfikowalność wstecz wymagałaby zachowywania publicznych kluczy poprzednich kotwic;
system tego nie robi i na razie nie będzie robił.


## Stan po zamknięciu

Infrastruktura zamrożona. Następny ruch to realne projekty i pionowy przepływ Konsoli, nie
kolejna warstwa bezpieczeństwa.
