#!/usr/bin/env node
/* Guard: .claude/skills i .agents/skills muszą być identyczne.
   Rozjazd = dwa różne kontrakty Learning Engine w jednym repo (realny incydent 08.2026). */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const A = path.join(ROOT, '.claude', 'skills');
const B = path.join(ROOT, '.agents', 'skills');
const names = [...new Set([...fs.readdirSync(A), ...fs.readdirSync(B)])].filter(n => fs.existsSync(path.join(A, n)) || fs.existsSync(path.join(B, n)));
let bad = 0;
for (const n of names) {
  const fa = path.join(A, n, 'SKILL.md'), fb = path.join(B, n, 'SKILL.md');
  const ea = fs.existsSync(fa), eb = fs.existsSync(fb);
  if (!ea || !eb) { if (ea !== eb) { console.log(`✗ ${n}: istnieje tylko w ${ea ? '.claude' : '.agents'}`); bad++; } continue; }
  const ha = crypto.createHash('sha256').update(fs.readFileSync(fa)).digest('hex').slice(0, 12);
  const hb = crypto.createHash('sha256').update(fs.readFileSync(fb)).digest('hex').slice(0, 12);
  if (ha !== hb) { console.log(`✗ ${n}: ROZJAZD (.claude ${ha} ≠ .agents ${hb})`); bad++; }
  else console.log(`✓ ${n}: zgodne (${ha})`);
}
console.log(bad ? `\n${bad} rozjazdów — skille MUSZĄ mieć ten sam kontrakt` : '\nSkille spójne.');
process.exit(bad ? 1 : 0);
