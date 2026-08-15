#!/usr/bin/env node
/* ═══ ZASTOSUJ KOLEJKĘ — jedna komenda zamiast sześciu ═══
 *
 * Bierze pakiety z `pending/` w podanej kolejności, przepuszcza przez `ingest.js` i przenosi
 * wykonane do `pending/.applied/`. Zatrzymuje się na pierwszym błędzie — nic dalszego nie wchodzi.
 *
 * Kolejność ma znaczenie: writer stosuje Evidence PRZED tworzeniem obiektów, więc pakiet
 * dokładający Evidence do karty musi iść po pakiecie, który tę kartę tworzy.
 *
 *   node proposals/tools/apply-pending.js --dry-run           plan dla wszystkich
 *   node proposals/tools/apply-pending.js a.json b.json       zapis w tej kolejności
 *   node proposals/tools/apply-pending.js --all               zapis wszystkich (kolejność z pliku ORDER)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const G = path.resolve(__dirname, '..', '..');
const PEND = path.join(G, 'pending');
const APPLIED = path.join(PEND, '.applied');
const DRY = process.argv.includes('--dry-run');
const ALL = process.argv.includes('--all');

/* Kolejność zależności: klucz musi wejść PO wartości. */
const AFTER = { 'evidence-price-anchor-2026-08-10.json': 'domkniecie-petli-demo-2026-08-10.json' };

let files = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (!files.length) {
  files = fs.readdirSync(PEND).filter(f => f.endsWith('.json')).sort();
  /* pakiety w starym formacie (bez approval.package) pomijamy — nie nasze */
  files = files.filter(f => {
    try { const b = JSON.parse(fs.readFileSync(path.join(PEND, f), 'utf8')); return !!(b.approval && b.approval.package); }
    catch { return false; }
  });
  for (const [dep, before] of Object.entries(AFTER)) {
    const i = files.indexOf(dep), j = files.indexOf(before);
    if (i >= 0 && j >= 0 && i < j) { files.splice(i, 1); files.splice(files.indexOf(before) + 1, 0, dep); }
  }
}
if (!files.length) { console.log('kolejka pusta'); process.exit(0); }
if (!DRY && !ALL && process.argv.slice(2).filter(a => !a.startsWith('--')).length === 0) {
  console.error('bez --all wymagam jawnej listy plików albo --dry-run'); process.exit(2);
}

console.log(`kolejka: ${files.length} pakietów\n`);
let done = 0;
for (const f of files) {
  const p = path.join(PEND, f);
  console.log('══', f);
  const r = spawnSync('node', [path.join(G, 'ingest.js'), p, ...(DRY ? ['--dry-run'] : [])],
    { encoding: 'utf8', env: process.env });
  const out = ((r.stdout || '') + (r.stderr || '')).split('\n')
    .filter(l => !/^⚠/.test(l)).join('\n');
  console.log(out.trim().split('\n').slice(-6).join('\n'));
  if (r.status !== 0) { console.error(`\n✗ ZATRZYMANE na ${f} — nic dalszego nie zostało zapisane`); process.exit(1); }
  if (!DRY) {
    fs.mkdirSync(APPLIED, { recursive: true });
    fs.renameSync(p, path.join(APPLIED, f));
    console.log(`   → przeniesione do pending/.applied/`);
  }
  done++;
  console.log('');
}
console.log(DRY ? `✓ plan dla ${done} pakietów, zero zapisu` : `✓ zastosowane: ${done}`);
