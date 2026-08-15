---
id: "rec:incydenty/2026-08-09-test-zapisal-do-kanonu"
type: "record"
title: "Incydent 2026-08-09 — warstwa testowa zapisała do kanonicznego Genome"
status: "created"
owner: "przemek"
relations: {"attached_to":["rec:F0-SEED-FREEZE"]}
tags: ["incydent","recovery","walidacja"]
created: "2026-08-09"
updated: "2026-08-09"
version: 1
---

# Incydent 2026-08-09 — warstwa testowa zapisała do kanonicznego Genome

## Co się stało
Test migracji wywołał `applyPlan(root, plan, { simulation: true })` z korzeniem KANONICZNEGO Genome.
Guard migracji opierał się na porównaniu korzenia z `__dirname` modułu; ponieważ moduł był ładowany
z zamrożonego fixture, „kanonem" stał się dla niego fixture, a realny kanon przestał być chroniony.
Uruchomiło się dwukrotnie: 06:17:00 i 06:17:13 UTC.

## Szkoda (ustalona, nie oszacowana)
- Ledger: 204 → 206 zdarzeń. Dopisane `evt:2026-08-09-0226` i `-0227` — obie migracje NO-OP.
- `ledger/.archive/…pre-mig….jsonl`: prawdziwe archiwum sprzed migracji (179 linii) nadpisane stanem
  POmigracyjnym (205 linii).
- `records/.snapshots/mig-…-records.json`: 32 Recordy z `content_before` wyzerowane do `records: []`.
- `rec:F0-SEED-FREEZE`: granica przesunięta na 205 / `3eafbaef9cb6e223`.

Integralność zachowana: hash-chain spójny, `build --check` 0 błędów, żadna karta wiedzy nie zmieniona.

## Recovery
- archiwum przywrócone z zamrożonego fixture, sha256 `4806dd3da1a8b4d3c54fa60d3b93e8785fb8f17c587e6973b55ab3f5295281c3`,
- snapshot ODTWORZONY (nie bajtowa kopia oryginału) i oznaczony `recovered: true` ze wskazaniem źródeł,
- granica seeda przywrócona do **179 / `4f96034058f4c5fa`**,
- zdarzenia 0226/0227 POZOSTAJĄ — Ledger jest append-only, błędny fakt koryguje się nowym faktem.
- artefakty uszkodzone zachowane w `proposals/recovery-incydent/artefakty-incydentu/` wraz z hashami.

## Przyczyna usunięta
1. **Publiczne `applyPlan()` zawsze wymaga prawidłowego podpisu Ed25519 właściciela.** Nie ma
   trybu uprzywilejowanego: `simulation: true` jest odrzucane przed jakimkolwiek zapisem
   (`aborted_before_write: true`) — także wtedy, gdy towarzyszy mu poprawnie podpisany plan.
2. **CLI `--simulate` tworzy własną prywatną kopię** i wykonuje ją przez
   `applyPlanUnchecked()`, funkcję **nieeksportowaną** z modułu. Z zewnątrz jest nieosiągalna.
3. **Migracja z zerową deltą jest twardym NO-OP**: zero zdarzeń, zero zmian freeze, zero
   nadpisania archiwum, zero snapshotu, zero buildu produkcyjnego, wynik `noop: true`.
   Test bajtowy potwierdza identyczność całego drzewa.
4. **Wykonawca odłączony od kanonu nie zmienia niczego.** Odtworzona próba: `migrate.js` + `lib/`
   skopiowane do katalogu bez `ledger/` i `records/`, jako cel osobna kompletna instalacja Genome,
   bez podpisu → `ok: false`, `aborted_before_write: true`, Ledger, Recordy i `dist` bez zmian.
5. Żaden test nie wskazuje realnego korzenia; każdy zestaw porównuje pełny hash drzewa kanonu
   przed i po.

**Czego tu NIE MA — świadomie.** Naprawa NIE polega na rozpoznawaniu „bezpiecznej kopii": ani po
katalogu tymczasowym (`os.tmpdir()` zależy od `TMPDIR`), ani po lokalizacji modułu (`__dirname`
kopii nie wskazuje kanonu). Obie te reguły były w międzyczasie wdrożone i obie zostały obalone
niezależnymi próbami. Zostały usunięte z kodu.

## Lekcja
Guard, który próbuje odgadnąć, czy cel jest „bezpieczny", zawsze da się przekręcić — bo pyta
o cechę ustawianą przez wywołującego. Jedyna reguła, która się obroniła, jest inna:
**każde publiczne wywołanie funkcji zapisującej wymaga autoryzacji właściciela, bez wyjątku
testowego w produkcyjnym API.**
