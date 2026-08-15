#!/usr/bin/env node
/* ═══ TESTY BRAMKI STARTU PROJEKTU (invariant 11 + 12) ═══
 * Każdy test buduje minimalny, izolowany seed Genome i uruchamia PRODUKCYJNY build.js/ingest.js.
 * Zero wpływu na kanoniczne dane.
 *   node test/run-gate-tests.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const G = path.resolve(__dirname, '..');
const TZ = 'Europe/Madrid';
let pass = 0, fail = 0;
const results = [];
const ok = (name, cond, detail) => { cond ? pass++ : fail++; results.push({ name, cond, detail: cond ? '' : String(detail || '').slice(0, 260) }); };
const sha16 = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);

/* ── minimalny seed ── */
const card = (root, dir, fm, body = 'x') => {
  const d = path.join(root, dir);
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, fm.id.split(':')[1].replace(/\//g, '-') + '.md'),
    '---\n' + Object.entries(fm).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n') + '\n---\n\n' + body + '\n');
};
const base = (id, type, title, status) => ({ id, type, title, status, created: '2026-09-01', updated: '2026-09-01', version: 1, owner: 'przemek' });

function seed(opts = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-'));
  fs.mkdirSync(path.join(root, 'ledger'), { recursive: true });
  fs.writeFileSync(path.join(root, 'ledger/events-2026-09.jsonl'), (opts.events || []).map(e => JSON.stringify(e)).join('\n') + (opts.events || []).length ? (opts.events || []).map(e => JSON.stringify(e)).join('\n') + '\n' : '');
  /* bramka aktywna od 2026-09-01 */
  card(root, 'records', { ...base('rec:PROJECT-GATE', 'record', 'Bramka startu', 'created'), relations: {}, tags: [], gate_since: opts.gate_since || '2026-09-01' });
  card(root, 'records', { ...base('rec:routing/alpha', 'record', 'Raport routera Alpha', 'created'), relations: { attached_to: ['proj:alpha'] }, tags: [] });
  if (opts.contract !== false)
    card(root, 'records', { ...base('rec:contracts/alpha', 'record', 'Project Contract Alpha', 'created'), relations: { attached_to: ['proj:alpha'] }, tags: [] });
  if (opts.decision !== false)
    card(root, 'decisions', {
      ...base('dec:alpha-go', 'decision', 'Start Alpha', 'decided'),
      question: 'Startujemy?', options: ['GO', 'REVISE', 'STOP'],
      choice: opts.choice || 'GO', decided: '2026-09-02',
      prepared_by: opts.prepared_by || 'session:router',
      decided_by: opts.decided_by === undefined ? 'przemek' : opts.decided_by,
      relations: { attached_to: ['proj:alpha'] }, tags: [],
    });
  const proj = {
    ...base('proj:alpha', 'project', 'Alpha', opts.status || 'active'),
    created: opts.created || '2026-09-02',
    domain: 'sales-cases', relations: {}, tags: [],
    routing: 'rec:routing/alpha',
  };
  if (opts.contract !== false) proj.contract = 'rec:contracts/alpha';
  if (opts.owner !== false) proj.outcome_owner = 'przemek';
  if (opts.measurement !== false) proj.measurement_date = '2026-10-01';
  if (opts.decision !== false) proj.go_decision = 'dec:alpha-go';
  card(root, 'projects', proj);
  return root;
}
const check = root => { try { return { out: execFileSync('node', [path.join(G, 'build.js'), '--check'], { env: { ...process.env, GENOME_DIR: root }, encoding: 'utf8' }), code: 0 }; } catch (e) { return { out: (e.stdout || '') + (e.stderr || ''), code: e.status }; } };
const rm = r => fs.rmSync(r, { recursive: true, force: true });
const hasErr = (out, frag) => out.split('\n').some(l => l.startsWith('✗') && l.includes(frag));

/* 1. brak raportu Routera → blokada */
{
  const r = seed();
  const pf = path.join(r, 'projects/alpha.md');
  fs.writeFileSync(pf, fs.readFileSync(pf, 'utf8').replace(/^routing: .*$/m, 'x_routing: "usuniete"'));
  const { out } = check(r);
  ok('1. projekt bez raportu Routera nie dostaje GO', hasErr(out, 'invariant 4'), out.split('\n').filter(l => l[0] === '✗')[0]);
  rm(r);
}
/* 2. brak Project Contract → blokada */
{
  const r = seed({ contract: false });
  const { out } = check(r);
  ok('2. projekt bez Project Contract nie dostaje GO', hasErr(out, 'bez Project Contract'), out.split('\n').filter(l => l[0] === '✗')[0]);
  rm(r);
}
/* 3. brak właściciela wyniku → blokada */
{
  const r = seed({ owner: false });
  const { out } = check(r);
  ok('3. brak outcome_owner blokuje start', hasErr(out, 'bez outcome_owner'), out.split('\n').filter(l => l[0] === '✗')[0]);
  rm(r);
}
/* 4. predykcja bez terminu/źródła → odrzucona przez writera */
{
  const r = seed();
  const pkt = { events: [{ kind: 'prediction.registered', on: 'proj:alpha', prediction_id: 'pred:x', p: 0.6, claim: 'C', criterion: 'k' }] };
  let out = '';
  try { out = execFileSync('node', [path.join(G, 'ingest.js'), '-', '--dry-run'], { input: JSON.stringify(pkt), env: { ...process.env, GENOME_DIR: r, GENOME_TZ: TZ }, encoding: 'utf8' }); }
  catch (e) { out = (e.stdout || '') + (e.stderr || ''); }
  ok('4. brak deadline/measurement_source/resolution_owner blokuje predykcję',
    /deadline|measurement_source|resolution_owner/.test(out) && /brak wymaganego pola|✗/.test(out), out.slice(0, 200));
  rm(r);
}
/* 5. n/d pozostaje n/d */
{
  const r = seed();
  const cf = path.join(r, 'records/contracts-alpha.md');
  fs.writeFileSync(cf, fs.readFileSync(cf, 'utf8').replace(/\nx\n/, '\n## Baseline\n\n- konwersja: n/d\n- ruch: n/d\n'));
  const { out, code } = check(r);
  const still = fs.readFileSync(cf, 'utf8');
  ok('5. n/d pozostaje n/d (build niczego nie dopisuje)',
    code === 0 && (still.match(/n\/d/g) || []).length === 2, `code=${code}`);
  rm(r);
}
/* 6. predykcja immutable */
{
  const r = seed();
  const lf = path.join(r, 'ledger/events-2026-09.jsonl');
  let prev = 'genesis';
  const mk = (id, extra) => { const e = { id, ts: '2026-09-03T10:0' + id.slice(-1) + ':00+02:00', kind: 'prediction.registered', on: 'proj:alpha', actor: 'przemek', prediction_id: 'pred:dup', p: 0.5, claim: 'C', deadline: '2026-10-01', criterion: 'k', measurement_source: 'mail', resolution_owner: 'przemek', ...extra, prev_hash: prev }; const s = JSON.stringify(e); prev = sha16(s); return s; };
  fs.writeFileSync(lf, [mk('evt:2026-09-03-0001'), mk('evt:2026-09-03-0002')].join('\n') + '\n');
  const { out } = check(r);
  ok('6. predykcji nie można zmienić po rejestracji (invariant 12)', hasErr(out, 'immutable') || hasErr(out, 'PONOWNIE'), out.split('\n').filter(l => l[0] === '✗')[0]);
  rm(r);
}
/* 7. agent nie zatwierdza własnego kontraktu */
{
  const r1 = seed({ decided_by: 'session:router' });
  const a = check(r1).out;
  const r2 = seed({ prepared_by: 'przemek', decided_by: 'przemek' });
  const b = check(r2).out;
  ok('7. agent nie może sam zatwierdzić własnego kontraktu',
    hasErr(a, 'zatwierdzona przez agenta') && hasErr(b, 'rozdzielenie ról'),
    (a.split('\n').filter(l => l[0] === '✗')[0] || '') + ' | ' + (b.split('\n').filter(l => l[0] === '✗')[0] || ''));
  rm(r1); rm(r2);
}
/* 8. REVISE i STOP nie uruchamiają projektu */
{
  const rv = seed({ choice: 'REVISE' });
  const st = seed({ choice: 'STOP' });
  ok('8. REVISE i STOP nie uruchamiają projektu',
    hasErr(check(rv).out, 'realizację uruchamia wyłącznie GO') && hasErr(check(st).out, 'realizację uruchamia wyłącznie GO'));
  rm(rv); rm(st);
}
/* 9. zmiana zakresu po GO zostawia ślad (supersede) */
{
  const r = seed();
  card(r, 'decisions', {
    ...base('dec:alpha-scope2', 'decision', 'Zmiana zakresu Alpha', 'decided'),
    question: 'Rozszerzamy zakres?', options: ['GO', 'STOP'], choice: 'GO', decided: '2026-09-10',
    prepared_by: 'session:router', decided_by: 'przemek',
    relations: { attached_to: ['proj:alpha'], supersedes: ['dec:alpha-go'] }, tags: [],
  });
  const { out, code } = check(r);
  const d2 = fs.readFileSync(path.join(r, 'decisions/alpha-scope2.md'), 'utf8');
  ok('9. zmiana zakresu po GO = nowa decyzja z supersede (audytowalny ślad)',
    code === 0 && /supersedes/.test(d2) && /dec:alpha-go/.test(d2), `code=${code} ${out.split('\n').filter(l => l[0] === '✗')[0] || ''}`);
  rm(r);
}
/* 10. postmortem czyta ORYGINALNY baseline i predykcje */
{
  const r = seed();
  const lf = path.join(r, 'ledger/events-2026-09.jsonl');
  const e = { id: 'evt:2026-09-03-0001', ts: '2026-09-03T10:00:00+02:00', kind: 'prediction.registered', on: 'proj:alpha', actor: 'przemek', prediction_id: 'pred:orig', p: 0.7, claim: 'ORYGINALNY claim', deadline: '2026-10-01', criterion: 'oryginalne kryterium', measurement_source: 'mail klienta', resolution_owner: 'przemek', prev_hash: 'genesis' };
  fs.writeFileSync(lf, JSON.stringify(e) + '\n');
  execFileSync('node', [path.join(G, 'build.js')], { env: { ...process.env, GENOME_DIR: r }, encoding: 'utf8' });
  const s = fs.readFileSync(path.join(r, 'dist/genome-data.js'), 'utf8');
  const d = JSON.parse(s.slice(s.indexOf('=') + 1).trim().replace(/;\s*$/, ''));
  const p = (d.predictions || []).find(x => x.id === 'pred:orig');
  const contractVisible = !!d.objects['rec:contracts/alpha'];
  ok('10. postmortem dostaje zamrożone predykcje i kontrakt (bez rekonstrukcji)',
    p && p.claim === 'ORYGINALNY claim' && p.criterion === 'oryginalne kryterium' && contractVisible,
    JSON.stringify(p));
  rm(r);
}
/* 11. idempotencja: dwa buildy = ten sam wynik */
{
  const r = seed();
  execFileSync('node', [path.join(G, 'build.js')], { env: { ...process.env, GENOME_DIR: r }, encoding: 'utf8' });
  const a = fs.readFileSync(path.join(r, 'dist/graph.json'), 'utf8');
  execFileSync('node', [path.join(G, 'build.js')], { env: { ...process.env, GENOME_DIR: r }, encoding: 'utf8' });
  const b = fs.readFileSync(path.join(r, 'dist/graph.json'), 'utf8');
  ok('11. ponowne wykonanie jest idempotentne', a === b);
  rm(r);
}
/* 12. awaria zapisu nie zostawia częściowo rozpoczętego projektu */
{
  const r = seed({ status: 'routed', contract: false, decision: false, owner: false, measurement: false });
  const before = fs.readFileSync(path.join(r, 'projects/alpha.md'), 'utf8');
  /* pakiet aktywujący projekt BEZ kontraktu — musi zostać odrzucony w całości */
  const pkt = {
    approval: { status: 'approved', approved_by: 'przemek', approved_at: new Date().toISOString(), proposal_hash: 'zly' },
    objects: [{ op: 'object.patch', id: 'proj:alpha', status: 'active' }],
  };
  let out = '';
  try { out = execFileSync('node', [path.join(G, 'ingest.js'), '-'], { input: JSON.stringify(pkt), env: { ...process.env, GENOME_DIR: r, GENOME_TZ: TZ }, encoding: 'utf8' }); }
  catch (e) { out = (e.stdout || '') + (e.stderr || ''); }
  const after = fs.readFileSync(path.join(r, 'projects/alpha.md'), 'utf8');
  ok('12. awaria zapisu nie zostawia częściowo rozpoczętego projektu', before === after && /✗/.test(out), out.slice(0, 160));
  rm(r);
}
/* 13. projekt sprzed bramki = ostrzeżenie, nie błąd (grandfathering) */
{
  const r = seed({ created: '2026-08-01', contract: false, owner: false, measurement: false, decision: false });
  const { out, code } = check(r);
  ok('13. projekt sprzed gate_since jest grandfathered (warning, nie error)',
    code === 0 && /\[przed bramką\]/.test(out), `code=${code}`);
  rm(r);
}
/* 14. komplet spełniony → build zielony */
{
  const r = seed();
  const { out, code } = check(r);
  ok('14. kompletny kontrakt + GO → build zielony', code === 0, out.split('\n').filter(l => l[0] === '✗').slice(0, 2).join(' | '));
  rm(r);
}

console.log('\n═══ TESTY BRAMKI STARTU PROJEKTU ═══\n');
for (const r of results) console.log(`  ${r.cond ? '✓' : '✗'} ${r.name}${r.detail ? '\n      → ' + r.detail : ''}`);
console.log(`\n  ${pass} PASS · ${fail} FAIL\n`);
process.exit(fail ? 1 : 0);
