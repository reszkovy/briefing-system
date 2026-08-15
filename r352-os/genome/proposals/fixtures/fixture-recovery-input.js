#!/usr/bin/env node
/* ═══ SYNTETYCZNY FIXTURE STANU WEJŚCIOWEGO RECOVERY ═══
 *
 * CZYM TO JEST — i czym NIE JEST.
 * To NIE jest historyczny snapshot Genome z 09.08 sprzed recovery. Nikt takiego snapshotu nie
 * zrobił. To jest **stan wejściowy dla recovery**, złożony z dwóch warstw o różnym pochodzeniu:
 *
 *   • DANE odtworzone do stanu sprzed naprawy: trzy uszkodzone artefakty (archiwum Ledgera,
 *     snapshot Recordów, karta freeze) wzięte z `records/incydenty/2026-08-09-artefakty/`,
 *     Ledger obcięty do `evt:2026-08-09-0227`, usunięte wszystko, co powstało później,
 *   • KOD, karty wiedzy i cała reszta drzewa w wersji **dzisiejszej**, nie z 09.08.
 *
 * Czyli: dane wejściowe zgadzają się z preconditions recovery co do bajta, ale otoczenie jest
 * współczesne. Do testowania recovery to wystarcza i o to tu chodzi. Do odtwarzania historii
 * Genome ten fixture NIE służy i nie wolno go tak opisywać.
 *
 * DLACZEGO ISTNIEJE. Zestawy budowały cel przez `cp -R <kanon>`. Działało, dopóki kanon czekał
 * na naprawę. W chwili wykonania recovery preconditions przestały pasować i zestaw recovery
 * spadł z 68 PASS na 56 PASS / 12 FAIL. Kod był w porządku; testy pytały żywy świat o stan,
 * który już minął.
 *
 * TRYBY.
 *   node fixture-recovery-input.js              --check (DOMYŚLNIE): tylko weryfikacja, zero zapisu
 *   node fixture-recovery-input.js --regenerate  jawna, świadoma odbudowa z dzisiejszego kanonu
 *
 * Domyślnie skrypt **niczego nie tworzy i niczego nie nadpisuje** — ani fixture'u, ani zapisanego
 * hasha. Regeneracja jest osobną, jawną decyzją człowieka, bo wciąga do fixture'u dzisiejszy stan
 * kanonu. Testy wołają wyłącznie `--check`; gdyby wołały budowanie, każda zmiana kanonu po cichu
 * stawałaby się nową normą i test przestałby cokolwiek sprawdzać.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const HERE = __dirname;
const CANON = path.resolve(HERE, '..', '..');
const OUT = path.join(HERE, 'recovery-input-synthetic');
const HASHFILE = path.join(HERE, 'recovery-input-synthetic.HASH.txt');

const REGEN = process.argv.includes('--regenerate');
const QUIET = process.argv.includes('--quiet');

const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const shaFile = p => sha(fs.readFileSync(p));
const say = m => { if (!QUIET) console.log(m); };

/* Stan wejściowy recovery — te same liczby, których pilnuje `recover.js`. */
const EXPECT = {
  archive: '61d3c8475ca88276a7a4c96f2ed5a15d5e26d32638eba1e456b260a33c84b15a',
  snapshot: 'eb660c38c84e4561a23d8b5b94621a43d5419bdbf4d85e2992ff8b2b05652a5b',
  freeze: 'b0c82c64ce3aa6a72b9b9edb75ac41d955cb894315486db75d9a6bf95ccf8cba',
  last_event: 'evt:2026-08-09-0227',
  event_count: 206,
  seed_tail_179: '4f96034058f4c5fa',
};

const REL = {
  archive: 'ledger/.archive/events-2026-08.pre-mig-2026-08-evidence-contract-v1.jsonl',
  snapshot: 'records/.snapshots/mig-2026-08-evidence-contract-v1-records.json',
  freeze: 'records/F0-SEED-FREEZE.md',
  ledger: 'ledger/events-2026-08.jsonl',
  nonces: '.approval-nonces.jsonl',
  artefakty: 'records/incydenty/2026-08-09-artefakty',
};

/* Powstało PO stanie wejściowym recovery — w fixture nie ma prawa być. */
const CREATED_AFTER = [
  'workflows/salt.md',
  'workflows/plate.md',
  'mechanisms/strategy-before-execution.md',
  'records/backtests/betterworkplace-salt-plate.md',
  'records/backtests/marka-tlumacz-salt-gap.md',
  'decisions/2026-08-09-wdrozenie-salt-plate.md',
  'records/proces/router-spec-2026-08-09.md',
  'records/incydenty',
];

/* Hash drzewa — definicja powtórzona tu świadomie, żeby generator nie zależał od modułu,
   który sam bywa przedmiotem testów. */
function treeHash(root) {
  const acc = [];
  (function walk(dir, rel) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : 1)) {
      const p = path.join(dir, e.name), r = rel ? rel + '/' + e.name : e.name;
      if (e.isDirectory()) walk(p, r);
      else if (e.isFile()) acc.push(r + ':' + shaFile(p));
    }
  })(root, '');
  return sha(acc.join('\n'));
}

function verifyData(root) {
  const problems = [];
  const h = k => { try { return shaFile(path.join(root, REL[k])); } catch { return 'BRAK PLIKU'; } };

  if (h('archive') !== EXPECT.archive) problems.push(`archiwum ${h('archive')} ≠ ${EXPECT.archive}`);
  if (h('snapshot') !== EXPECT.snapshot) problems.push(`snapshot ${h('snapshot')} ≠ ${EXPECT.snapshot}`);
  if (h('freeze') !== EXPECT.freeze) problems.push(`karta freeze ${h('freeze')} ≠ ${EXPECT.freeze}`);

  let lines = [];
  try { lines = fs.readFileSync(path.join(root, REL.ledger), 'utf8').trim().split('\n'); }
  catch { problems.push('brak Ledgera'); }
  if (lines.length !== EXPECT.event_count) problems.push(`Ledger ${lines.length} linii ≠ ${EXPECT.event_count}`);
  if (lines.length) {
    const last = JSON.parse(lines[lines.length - 1]).id;
    if (last !== EXPECT.last_event) problems.push(`ostatnie zdarzenie ${last} ≠ ${EXPECT.last_event}`);
    const tail179 = sha(Buffer.from(lines[178] || '')).slice(0, 16);
    if (tail179 !== EXPECT.seed_tail_179) problems.push(`hash linii 179 ${tail179} ≠ ${EXPECT.seed_tail_179}`);
  }
  for (const rel of CREATED_AFTER)
    if (fs.existsSync(path.join(root, rel))) problems.push(`w fixture jest coś z PÓŹNIEJSZEGO stanu: ${rel}`);
  if (fs.existsSync(path.join(root, REL.nonces))) problems.push('rejestr nonce nie powinien istnieć');

  return problems;
}

function recordedHash() {
  if (!fs.existsSync(HASHFILE)) return null;
  return fs.readFileSync(HASHFILE, 'utf8').trim().split(/\s+/)[0];
}

/* ═══ DOMYŚLNIE: --check ═══ */
if (!REGEN) {
  if (!fs.existsSync(OUT)) {
    console.error('✗ fixture nie istnieje: ' + OUT
      + '\n  odbuduj ŚWIADOMIE: node ' + path.relative(CANON, __filename) + ' --regenerate');
    process.exit(2);
  }
  const problems = verifyData(OUT);
  const th = treeHash(OUT);
  const rec = recordedHash();
  if (!rec) problems.push('brak zapisanego hasha drzewa — fixture bez punktu odniesienia');
  else if (rec !== th) problems.push(`hash drzewa ${th} ≠ zapisany ${rec} — fixture był ruszany po zamrożeniu`);

  if (problems.length) {
    console.error('✗ fixture NIEZGODNY:\n   ' + problems.join('\n   '));
    console.error('   NIE regeneruję automatycznie. Regeneracja jest jawną decyzją: --regenerate');
    process.exit(1);
  }
  say(`✓ fixture zgodny · ${EXPECT.event_count} zdarzeń · drzewo ${th.slice(0, 16)}…`);
  process.exit(0);
}

/* ═══ --regenerate: jawna odbudowa ═══ */
console.log('REGENERACJA — wciągam dzisiejszy stan kanonu do fixture\'u.');
console.log('źródło: ' + CANON);
if (fs.existsSync(OUT)) console.log('UWAGA: istniejący fixture i jego hash zostaną nadpisane.');

const art = path.join(CANON, REL.artefakty);
if (!fs.existsSync(art)) {
  console.error('✗ brak zachowanych artefaktów incydentu (' + REL.artefakty + ') — bez nich stanu wejściowego nie da się złożyć');
  process.exit(2);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fixture-recovery-input-'));
const work = path.join(tmp, 'genome');

/* 1. baza: kanon bez katalogów, które nie są stanem wiedzy.
   `pending/` wypadło stąd po tym, jak pierwsza regeneracja wciągnęła do fixture'u leżący tam
   pakiet długu i hash drzewa zmienił się bez żadnej zmiany w danych Genome. Dokładnie ten
   scenariusz — regeneracja po cichu absorbuje późniejszy stan — jest powodem, dla którego
   domyślnym trybem jest `--check`. */
const SKIP_DIRS = ['proposals', 'dist', 'pending', '.genome-txn'];
const SKIP_FILES = ['.genome-write.lock', '.approval-nonces.jsonl'];
fs.cpSync(CANON, work, {
  recursive: true,
  filter: src => {
    const rel = path.relative(CANON, src);
    if (SKIP_FILES.includes(rel)) return false;
    return !SKIP_DIRS.some(d => rel === d || rel.startsWith(d + path.sep));
  }
});

/* 2. cofnięcie wszystkiego, co powstało po stanie wejściowym */
for (const rel of CREATED_AFTER) fs.rmSync(path.join(work, rel), { recursive: true, force: true });
fs.rmSync(path.join(work, REL.nonces), { force: true });

/* 3. trzy uszkodzone artefakty wracają na swoje miejsca */
const put = (from, toRel) => {
  const buf = fs.readFileSync(path.join(art, from));
  fs.mkdirSync(path.dirname(path.join(work, toRel)), { recursive: true });
  fs.writeFileSync(path.join(work, toRel), buf);
};
put('USZKODZONE-archiwum-ledgera.jsonl', REL.archive);
put('USZKODZONY-snapshot-recordow.json', REL.snapshot);
put('USZKODZONA-karta-freeze.md.txt', REL.freeze);

/* 4. Ledger obcięty do ostatniego zdarzenia sprzed naprawy */
const all = fs.readFileSync(path.join(work, REL.ledger), 'utf8').trim().split('\n');
const cut = all.findIndex(l => JSON.parse(l).id === EXPECT.last_event);
if (cut < 0) { console.error('✗ w Ledgerze nie ma ' + EXPECT.last_event); process.exit(2); }
fs.writeFileSync(path.join(work, REL.ledger), all.slice(0, cut + 1).join('\n') + '\n');

/* 5. weryfikacja PRZED zapisem */
const problems = verifyData(work);
if (problems.length) {
  console.error('✗ rekonstrukcja NIEZGODNA, nic nie zapisuję:\n   ' + problems.join('\n   '));
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(1);
}

const prev = recordedHash();
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(work, OUT, { recursive: true });
fs.rmSync(tmp, { recursive: true, force: true });

const th = treeHash(OUT);
fs.writeFileSync(HASHFILE,
  `${th}  drzewo syntetycznego fixture'u stanu wejściowego recovery\n` +
  `dane sprzed recovery + KOD I KARTY W WERSJI DZISIEJSZEJ (to nie jest snapshot historyczny)\n` +
  `${EXPECT.event_count} zdarzeń · ostatnie ${EXPECT.last_event}\n` +
  `archiwum ${EXPECT.archive}\nsnapshot ${EXPECT.snapshot}\nfreeze   ${EXPECT.freeze}\n`);

console.log(`✓ fixture przebudowany: ${path.relative(CANON, OUT)}`);
console.log(`  drzewo ${th.slice(0, 16)}…${prev && prev !== th ? ` (poprzednio ${prev.slice(0, 16)}…)` : ''}`);
if (prev && prev !== th) console.log('  Hash się zmienił. To NIE jest samo w sobie dowód poprawności — sprawdź, co w kanonie się ruszyło.');
