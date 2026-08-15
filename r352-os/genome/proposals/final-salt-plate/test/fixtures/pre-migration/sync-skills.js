#!/usr/bin/env node
/* ═══ SYNC SKILLS — jedno kanoniczne źródło skilli, kopie generowane ═══
 * ŹRÓDŁO KANONICZNE:  .claude/skills/<nazwa>/SKILL.md
 * KOPIA PLATFORMOWA:  .agents/skills/<nazwa>/SKILL.md   (generowana, NIE edytować ręcznie)
 *
 * Powód: 08.2026 realny incydent — dwie wersje Learning Engine w jednym repo, .agents starsza
 * o Project Contract i zamrożone predykcje. Ręczna kopia zawsze się rozjedzie; dlatego kopia
 * jest generowana, a rozjazd jest BŁĘDEM testów (nie ostrzeżeniem).
 *
 *   node sync-skills.js           regeneruje kopie platformowe z kanonu
 *   node sync-skills.js --check   guard: exit 1 przy rozjeździe (używany w testach i build)
 *
 * Adapter platformowy: jeśli platforma NAPRAWDĘ wymaga innej treści, deklaruje się to jawnie
 * w ADAPTERS poniżej (transformacja deterministyczna). Domyślnie: kopia 1:1, zero wyjątków.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..', '..');
const CANON = path.join(ROOT, '.claude', 'skills');
const PLATFORMS = [{ name: '.agents', dir: path.join(ROOT, '.agents', 'skills') }];

/* Jawne adaptery per platforma — puste znaczy: kopia bajtowa.
   Każdy wyjątek musi mieć powód wpisany tutaj, inaczej nie istnieje. */
const ADAPTERS = {
  /* '.agents': { 'nazwa-skilla': (text) => text.replace(...)  // powód: ... */
};

const sha = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 12);
const CHECK = process.argv.includes('--check');

if (!fs.existsSync(CANON)) { console.error(`✗ brak kanonicznego katalogu ${CANON}`); process.exit(2); }
const names = fs.readdirSync(CANON).filter(n => fs.existsSync(path.join(CANON, n, 'SKILL.md')));
if (!names.length) { console.error('✗ brak skilli w kanonie'); process.exit(2); }

let drift = 0, synced = 0;
for (const p of PLATFORMS) {
  /* skille istniejące TYLKO w kopii platformowej = sierota po usunięciu z kanonu */
  if (fs.existsSync(p.dir))
    for (const n of fs.readdirSync(p.dir))
      if (!names.includes(n) && fs.existsSync(path.join(p.dir, n, 'SKILL.md'))) {
        console.log(`✗ ${p.name}/${n}: istnieje w kopii, NIE MA w kanonie (usuń albo przywróć do .claude/skills)`);
        drift++;
      }

  for (const n of names) {
    const src = fs.readFileSync(path.join(CANON, n, 'SKILL.md'), 'utf8');
    const adapt = (ADAPTERS[p.name] || {})[n];
    const want = adapt ? adapt(src) : src;
    const dstFile = path.join(p.dir, n, 'SKILL.md');
    const have = fs.existsSync(dstFile) ? fs.readFileSync(dstFile, 'utf8') : null;

    if (have === want) continue;
    if (CHECK) {
      console.log(`✗ ${n}: ROZJAZD ${p.name} (kanon ${sha(want)} ≠ kopia ${have === null ? 'BRAK' : sha(have)})`);
      drift++;
    } else {
      fs.mkdirSync(path.dirname(dstFile), { recursive: true });
      fs.writeFileSync(dstFile, want);
      console.log(`↻ ${p.name}/${n}: zsynchronizowane z kanonu (${sha(want)})${adapt ? ' [adapter]' : ''}`);
      synced++;
    }
  }
}

if (CHECK) {
  console.log(drift ? `\n✗ ${drift} rozjazdów — uruchom: node r352-os/genome/sync-skills.js` : `\n✓ skille spójne (${names.length} × ${PLATFORMS.length} kopii)`);
  process.exit(drift ? 1 : 0);
}
console.log(synced ? `\n✓ zsynchronizowano ${synced} plików z kanonu .claude/skills` : `\n✓ już spójne — nic do zrobienia`);
