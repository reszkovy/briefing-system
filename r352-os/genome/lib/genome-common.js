/* ═══ WSPÓLNE PRYMITYWY ZAPISU GENOME ═══
 * Jedno miejsce dla: blokady zapisu, klucza niezależności Evidence i liczników evidence_strength.
 * Używane przez migrate.js ORAZ ingest.js — żadnych dwóch definicji tej samej semantyki.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const sha256 = s => crypto.createHash('sha256').update(s).digest('hex');
const sha16 = s => sha256(s).slice(0, 16);

/* ── JEDNA blokada dla WSZYSTKICH zapisów Genome (migracja + ingest) ──
   Atomowość przez open(wx). Stale lock (proces nie żyje / >5 min) jest przejmowany. */
/* ── JEDNA blokada dla WSZYSTKICH zapisów Genome (migracja + ingest + wykonawcy) ──
 *
 * OKNO WYŚCIGU (audyt rundy 5, potwierdzone niezależną próbą): poprzednia wersja tworzyła
 * PUSTY plik przez open(wx), a PID dopisywała chwilę później. Drugi proces trafiający w to okno
 * czytał pusty plik, uznawał go za uszkodzony (brak dowodu życia właściciela) i PRZEJMOWAŁ
 * blokadę — dwa writery wchodziły do sekcji krytycznej jednocześnie.
 *
 * Naprawa, dwa niezależne mechanizmy:
 *   1. blokadą jest KATALOG (mkdir jest atomowy i albo się uda, albo nie — nie ma stanu „pusty"),
 *   2. brak/nieczytelny plik PID wewnątrz katalogu MŁODSZY niż LOCK_GRACE_MS jest traktowany
 *      jako blokada AKTYWNA (właściciel właśnie ją zakłada), nigdy jako uszkodzona.
 */
/* ── JEDNA blokada dla WSZYSTKICH zapisów Genome (migracja + ingest + wykonawcy) ──
 *
 * DWA okna wyścigu zamknięte (audyt rund 5 i 6):
 *   1. `open(wx)` tworzył PUSTY plik, PID dopisywany chwilę później — drugi proces trafiający
 *      w to okno uznawał blokadę za uszkodzoną i ją przejmował;
 *   2. „grace 5 s" na zapisanie PID był tym samym błędem z timerem: writer, który zwlekał 6 s,
 *      tracił blokadę na rzecz drugiego (audyt odtworzył: obaj weszli do sekcji krytycznej).
 *
 * Naprawa bez żadnego timeoutu:
 *   • blokadę BUDUJEMY najpierw w katalogu tymczasowym obok (`<lock>.prep-<pid>-<rnd>`),
 *     zapisujemy tam `owner.json`, a dopiero potem robimy ATOMOWY `rename` na docelową ścieżkę.
 *     Katalog blokady NIGDY nie istnieje bez właściciela — nie ma stanu „pusty".
 *   • blokada bez czytelnego `owner.json` NIE JEST przejmowana automatycznie, niezależnie od wieku.
 *     Wymaga świadomego usunięcia przez człowieka. Cisza jest lepsza niż zgadywanie.
 *   • blokada z PID martwego procesu jest przejmowana — to jedyny automatyczny przypadek.
 */
const LOCK_NAME = '.genome-write.lock';
const LOCK_STALE_MS = 5 * 60 * 1000;

function readLockOwner(lockFile) {
  try {
    const o = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
    return (o && typeof o.pid === 'number') ? o : null;
  } catch { return null; }
}

/* Publikacja blokady przez link(2).
   `rename()` na katalogu NIE nadaje się: POSIX pozwala nadpisać PUSTY katalog docelowy, więc
   drugi writer podmieniłby cudzą blokadę. `link()` zawodzi z EEXIST, gdy cel istnieje — i tworzy
   wpis od razu z pełną treścią. Blokada NIGDY nie jest widoczna pusta ani bez właściciela. */
function publishLock(lock) {
  const prep = `${lock}.prep-${process.pid}-${crypto.randomBytes(4).toString('hex')}`;
  try { fs.writeFileSync(prep, JSON.stringify({ pid: process.pid, started: new Date().toISOString() }), { flag: 'wx' }); }
  catch { return false; }
  /* hak testowy: opóźnienie MIĘDZY przygotowaniem a publikacją. Nie tworzy okna bez właściciela —
     służy właśnie do udowodnienia, że takiego okna nie ma, niezależnie od długości zwłoki. */
  if (process.env.GENOME_TEST_LOCK_PID_DELAY_MS) {
    const until = Date.now() + Number(process.env.GENOME_TEST_LOCK_PID_DELAY_MS);
    while (Date.now() < until) { /* busy-wait: blokada jest synchroniczna */ }
  }
  let okLink = false;
  try { fs.linkSync(prep, lock); okLink = true; } catch { okLink = false; }
  try { fs.unlinkSync(prep); } catch { /* best effort */ }
  return okLink;
}

function withGenomeWriteLock(root, fn) {
  const lock = path.join(root, LOCK_NAME);

  if (!publishLock(lock)) {
    const info = readLockOwner(lock);
    let age = Infinity;
    try { age = Date.now() - fs.statSync(lock).mtimeMs; } catch { /* zniknęła */ }

    if (!info) {
      /* BEZ TIMEOUTU. Blokada bez czytelnego właściciela to sytuacja wymagająca człowieka. */
      return { ok: false, orphan: true, error:
        `ZAPIS GENOME ZABLOKOWANY: ${lock} istnieje, ale nie ma czytelnego właściciela.\n` +
        `   Blokada bez właściciela NIE jest przejmowana automatycznie — niezależnie od wieku (${Math.round(age / 1000)} s).\n` +
        `   Sprawdź, czy nie trwa zapis, a potem usuń ją świadomie: rm -f ${JSON.stringify(lock)}` };
    }
    let ownerAlive = false;
    try { process.kill(info.pid, 0); ownerAlive = true; } catch { ownerAlive = false; }
    if (ownerAlive) {
      const warnAge = age > LOCK_STALE_MS ? ` UWAGA: blokada żyje ${Math.round(age / 60000)} min — jeśli to zawieszony proces, zakończ go ręcznie (kill), sama nie wygaśnie.` : '';
      return { ok: false, error: `ZAPIS GENOME JUŻ TRWA (blokada ${lock}, właściciel PID ${info.pid} żyje) — migracja, ingest i wykonawcy współdzielą jedną blokadę.${warnAge}` };
    }
    /* jedyne automatyczne przejęcie: właściciel udokumentowany i UDOWODNIONO, że nie żyje */
    try { fs.rmSync(lock, { force: true }); } catch { /* wyścig */ }
    if (!publishLock(lock)) return { ok: false, error: `ZAPIS GENOME JUŻ TRWA (${lock})` };
  }

  try { return fn(); }
  finally { try { fs.rmSync(lock, { force: true }); } catch { /* best effort */ } }
}

/* ── Niezależność Evidence: JEDNA definicja ──
   Klucz = jawny independence_key albo project::source. Dwa wpisy z tym samym kluczem
   to jedno źródło wiedzy, nie dwa. */
const independenceKey = e => e.independence_key || `${e.project || 'multi'}::${e.source || 'unknown'}`;

/* ── evidence_strength: liczone zawsze tą samą funkcją, nigdy ręcznie ── */
function evidenceStrength(entries, lastConfirmed) {
  const types = {};
  for (const e of entries) types[e.type] = (types[e.type] || 0) + 1;
  return {
    n: entries.length,
    projects: new Set(entries.map(e => e.project).filter(Boolean)).size,
    independent_sources: new Set(entries.map(independenceKey)).size,
    types,
    last_confirmed: lastConfirmed,
  };
}

module.exports = { withGenomeWriteLock, independenceKey, evidenceStrength, sha256, sha16, LOCK_NAME };
