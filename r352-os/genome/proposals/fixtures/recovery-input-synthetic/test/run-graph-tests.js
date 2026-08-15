#!/usr/bin/env node
/* ═══ TESTY KOMPILATORA GRAFU Project–Mechanism (build.js) ═══
 * Każdy test dostaje świeżą kopię fixture-template w katalogu tymczasowym.
 * Nic nie dotyka kanonicznego Genome ani Ledgera.
 *   node test/run-graph-tests.js        wszystkie
 *   node test/run-graph-tests.js 5      pojedynczy numer
 */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const HERE = __dirname;
const GENOME = path.resolve(HERE, '..');
const TEMPLATE = path.join(HERE, 'fixture-template');
const TZ = 'Europe/Madrid';

let pass = 0, failCount = 0;
const results = [];

function sandbox() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'genome-graph-test-'));
  const cp = (src, dst) => {
    fs.mkdirSync(dst, { recursive: true });
    for (const f of fs.readdirSync(src)) {
      const s = path.join(src, f), d = path.join(dst, f);
      if (fs.statSync(s).isDirectory()) cp(s, d); else fs.copyFileSync(s, d);
    }
  };
  cp(TEMPLATE, dir);
  fs.copyFileSync(path.join(GENOME, 'build.js'), path.join(dir, 'build.js'));
  return dir;
}

function build(dir, extra = []) {
  try {
    const out = execFileSync('node', [path.join(dir, 'build.js'), ...extra],
      { env: { ...process.env, GENOME_DIR: dir, GENOME_TZ: TZ }, encoding: 'utf8', stdio: 'pipe' });
    return { code: 0, out };
  } catch (e) { return { code: e.status ?? 1, out: (e.stdout || '') + (e.stderr || '') }; }
}

/* ── zapis kart: WYŁĄCZNIE ustrukturyzowane pola, tak jak w prawdziwym Genome ── */
const fmLine = o => Object.entries(o).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n');

/* karty już obecne w fixture-template muszą być NADPISANE w swoim pliku,
   inaczej powstaje duplikat id i test bada co innego, niż deklaruje */
const FILE_OF = {
  'proj:test-one': 'projects/pr1.md', 'proj:test-two': 'projects/pr2.md',
  'mech:alpha': 'mechanisms/m1.md', 'mech:beta': 'mechanisms/m2.md',
  'rec:test/pm': 'records/r1.md',
};
const target = (dir, id, fallback) => path.join(dir, FILE_OF[id] || fallback);

function writeMech(dir, id, evidence = [], extra = {}) {
  const slug = id.replace('mech:', '');
  const fm = {
    id, type: 'mechanism', title: 'Mech ' + slug, status: 'emerging',
    created: '2026-01-01', updated: '2026-01-01', version: 1, owner: 'test',
    confidence: { value: 'emerging', evidence_strength: { n: evidence.length, projects: 0, types: {}, last_confirmed: '2026-01-01' }, recommendation: 'test-first' },
    category: 'Test', relations: { implements: ['prin:test'] },
    trigger: 't', context: 'c', anti_context: 'a', inputs: [], ai_tasks: [], human_tasks: [],
    expected_outcome: 'o', evidence, tags: [], ...extra,
  };
  fs.writeFileSync(target(dir, id, 'mechanisms/' + slug + '.md'), `---\n${fmLine(fm)}\n---\n\n## Problem\n\nTestowy.\n`);
}

function writeProj(dir, id, extra = {}) {
  const slug = id.replace('proj:', '');
  const fm = {
    id, type: 'project', title: 'Projekt ' + slug, status: 'archived',
    created: '2026-01-01', updated: '2026-01-01', version: 1, owner: 'test',
    relations: {}, tags: [], ...extra,
  };
  fs.writeFileSync(target(dir, id, 'projects/' + slug + '.md'), `---\n${fmLine(fm)}\n---\n\n## Problem\n\nTestowy.\n`);
}

function writeRec(dir, id, attachedTo, extra = {}) {
  const slug = id.replace('rec:', '').replace(/\//g, '-');
  const fm = {
    id, type: 'record', title: 'Record ' + slug, status: 'created',
    created: '2026-01-01', updated: '2026-01-01', version: 1, owner: 'test',
    relations: attachedTo ? { attached_to: [].concat(attachedTo) } : {}, tags: [], ...extra,
  };
  fs.writeFileSync(target(dir, id, 'records/' + slug + '.md'), `---\n${fmLine(fm)}\n---\n\nRecord testowy.\n`);
}

const ev = (id, o) => ({ id, type: 'measurement', date: '2026-01-01', source: 'rec:test/pm', ...o });

/* ── odczyt wyników buildu ── */
const graphJson = dir => JSON.parse(fs.readFileSync(path.join(dir, 'dist/graph.json'), 'utf8'));
const viewerData = dir => {
  const txt = fs.readFileSync(path.join(dir, 'dist/genome-data.js'), 'utf8');
  return JSON.parse(txt.slice(txt.indexOf('=') + 1).trim().replace(/;\s*$/, ''));
};
const pm = dir => graphJson(dir).edges.filter(e => e.source.startsWith('proj:') && e.target.startsWith('mech:'));
const findEdge = (dir, s, t, r) => pm(dir).find(e => e.source === s && e.target === t && e.relation === r);
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');

function test(n, name, fn) {
  if (process.argv[2] && +process.argv[2] !== n) return;
  const dir = sandbox();
  try {
    fn(dir);
    pass++; results.push(`  ✓ ${String(n).padStart(2)}. ${name}`);
  } catch (e) {
    failCount++; results.push(`  ✗ ${String(n).padStart(2)}. ${name}\n       ${e.message.split('\n')[0]}`);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
const assert = (c, m) => { if (!c) throw new Error(m); };

/* ════════ TESTY ════════ */

test(1, 'Project.mechanisms_planned → relacja "planned"', dir => {
  writeProj(dir, 'proj:test-one', { mechanisms_planned: ['mech:alpha'] });
  const r = build(dir);
  assert(r.code === 0, 'build nie przeszedł:\n' + r.out);
  const e = findEdge(dir, 'proj:test-one', 'mech:alpha', 'planned');
  assert(e, 'brak krawędzi planned; są: ' + JSON.stringify(pm(dir)));
  assert(e.evidence_count === 0, 'planned nie może mieć Evidence, ma ' + e.evidence_count);
  assert(e.provenance.includes('proj:test-one#mechanisms_planned'), 'brak prowieniencji pola źródłowego');
});

test(2, 'Project.mechanisms_confirmed → relacja "used"', dir => {
  writeProj(dir, 'proj:test-one', { mechanisms_confirmed: ['mech:alpha', 'mech:beta'] });
  assert(build(dir).code === 0, 'build nie przeszedł');
  assert(findEdge(dir, 'proj:test-one', 'mech:alpha', 'used'), 'brak used → alpha');
  assert(findEdge(dir, 'proj:test-one', 'mech:beta', 'used'), 'brak used → beta');
  assert(!findEdge(dir, 'proj:test-one', 'mech:alpha', 'planned'), 'confirmed nie może dawać planned');
});

test(3, 'Evidence direction=supports → relacja "supported"', dir => {
  writeRec(dir, 'rec:test/pm', 'proj:test-one');
  writeMech(dir, 'mech:alpha', [ev('ev:s1', { direction: 'supports' })]);
  const r = build(dir);
  assert(r.code === 0, 'build nie przeszedł:\n' + r.out);
  const e = findEdge(dir, 'proj:test-one', 'mech:alpha', 'supported');
  assert(e, 'brak krawędzi supported; są: ' + JSON.stringify(pm(dir)));
  assert(e.evidence_count === 1 && e.evidence_ids[0] === 'ev:s1', 'zła agregacja Evidence');
});

test(4, 'Evidence direction=contradicts → relacja "contradicted"', dir => {
  writeRec(dir, 'rec:test/pm', 'proj:test-one');
  writeMech(dir, 'mech:alpha', [ev('ev:c1', { direction: 'contradicts' })]);
  assert(build(dir).code === 0, 'build nie przeszedł');
  assert(findEdge(dir, 'proj:test-one', 'mech:alpha', 'contradicted'), 'brak contradicted');
  assert(!findEdge(dir, 'proj:test-one', 'mech:alpha', 'supported'), 'contradicts NIE może dać supported');
});

test(5, 'Evidence type=backtest → "backtested", NIGDY "supported"', dir => {
  writeRec(dir, 'rec:test/pm', 'proj:test-one');
  // celowo direction=supports: backtest ma nadpisać kierunek i nie udawać żywego dowodu
  writeMech(dir, 'mech:alpha', [ev('ev:b1', { type: 'backtest', direction: 'supports' })]);
  assert(build(dir).code === 0, 'build nie przeszedł');
  assert(findEdge(dir, 'proj:test-one', 'mech:alpha', 'backtested'), 'brak backtested');
  assert(!findEdge(dir, 'proj:test-one', 'mech:alpha', 'supported'), 'backtest UDAWAŁ żywy dowód (supported)');
  // ta sama zasada dla źródła rec:backtests/ (isBacktestEv), nie tylko dla type
  writeRec(dir, 'rec:backtests/x', 'proj:test-two');
  writeMech(dir, 'mech:beta', [ev('ev:b2', { type: 'postmortem', source: 'rec:backtests/x', direction: 'supports' })]);
  assert(build(dir).code === 0, 'build nie przeszedł (2)');
  assert(findEdge(dir, 'proj:test-two', 'mech:beta', 'backtested'), 'źródło rec:backtests/ nie dało backtested');
  assert(!findEdge(dir, 'proj:test-two', 'mech:beta', 'supported'), 'postmortem z backtestu udawał żywy dowód');
});

test(6, 'Evidence type=intention NIE tworzy relacji potwierdzającej', dir => {
  writeRec(dir, 'rec:test/pm', 'proj:test-one');
  writeMech(dir, 'mech:alpha', [ev('ev:i1', { type: 'intention', direction: 'supports' })]);
  assert(build(dir).code === 0, 'build nie przeszedł');
  const got = pm(dir).filter(e => e.target === 'mech:alpha');
  assert(got.length === 0, 'intention utworzyła relację: ' + JSON.stringify(got));
});

test(7, 'dwa dokumenty tego samego Evidence = JEDNA krawędź', dir => {
  writeRec(dir, 'rec:test/pm', 'proj:test-one');
  const d = ev('ev:dup', { direction: 'supports' });
  writeMech(dir, 'mech:alpha', [d, { ...d }]);   // ten sam Evidence ID w dwóch wpisach
  assert(build(dir).code === 0, 'build nie przeszedł');
  const got = pm(dir).filter(e => e.target === 'mech:alpha' && e.relation === 'supported');
  assert(got.length === 1, 'powstało ' + got.length + ' krawędzi zamiast 1');
  assert(got[0].evidence_count === 1, 'ten sam Evidence policzony ' + got[0].evidence_count + ' razy');
  assert(got[0].evidence_ids.length === 1, 'zduplikowane ID na liście');
});

test(8, 'dwa NIEZALEŻNE Evidence = jedna relacja z evidence_count:2', dir => {
  writeRec(dir, 'rec:test/pm', 'proj:test-one');
  writeMech(dir, 'mech:alpha', [ev('ev:a1', { direction: 'supports' }), ev('ev:a2', { direction: 'supports' })]);
  assert(build(dir).code === 0, 'build nie przeszedł');
  const got = pm(dir).filter(e => e.target === 'mech:alpha' && e.relation === 'supported');
  assert(got.length === 1, 'agregacja zawiodła — ' + got.length + ' krawędzi');
  assert(got[0].evidence_count === 2, 'evidence_count = ' + got[0].evidence_count + ', oczekiwano 2');
  assert(JSON.stringify(got[0].evidence_ids) === '["ev:a1","ev:a2"]', 'lista ID nieposortowana/niepełna: ' + JSON.stringify(got[0].evidence_ids));
});

test(9, 'brak możliwego do ustalenia projektu → ostrzeżenie, ZERO zgadywania', dir => {
  // Record BEZ attached_to; nazwa pliku sugeruje "test-one" — kompilator nie ma prawa jej użyć
  writeRec(dir, 'rec:backtests/test-one', null);
  writeMech(dir, 'mech:alpha', [ev('ev:u1', { source: 'rec:backtests/test-one', direction: 'supports', note: 'projekt test-one zrobił X' })]);
  const r = build(dir);
  assert(r.code === 0, 'build nie przeszedł:\n' + r.out);
  assert(pm(dir).length === 0, 'ZGADYWANIE: powstała krawędź mimo nierozstrzygalnego projektu: ' + JSON.stringify(pm(dir)));
  assert(/\[graf\].*ev:u1.*nie da się ustalić projektu/.test(r.out), 'brak ostrzeżenia o nierozstrzygalnym projekcie:\n' + r.out);
  assert(graphJson(dir).unresolved_evidence >= 1, 'licznik unresolved_evidence nie policzony');
});

test(10, 'viewer dostaje DOKŁADNIE ten sam zestaw co dist/graph.json', dir => {
  writeRec(dir, 'rec:test/pm', 'proj:test-one');
  writeProj(dir, 'proj:test-two', { mechanisms_planned: ['mech:beta'] });
  writeMech(dir, 'mech:alpha', [ev('ev:v1', { direction: 'supports' }), ev('ev:v2', { direction: 'limits' })]);
  assert(build(dir).code === 0, 'build nie przeszedł');
  const g = graphJson(dir), v = viewerData(dir);
  assert(v.graph, 'viewer nie dostał skompilowanego grafu (GENOME_DATA.graph)');
  assert(JSON.stringify(v.graph.edges) === JSON.stringify(g.edges), 'krawędzie viewera ≠ dist/graph.json');
  assert(JSON.stringify(v.graph.nodes) === JSON.stringify(g.nodes), 'węzły viewera ≠ dist/graph.json');
});

test(11, 'ponowny build = wynik BAJTOWO identyczny', dir => {
  writeRec(dir, 'rec:test/pm', 'proj:test-one');
  writeProj(dir, 'proj:test-two', { mechanisms_confirmed: ['mech:beta'], mechanisms_planned: ['mech:alpha'] });
  writeMech(dir, 'mech:alpha', [ev('ev:d2', { direction: 'supports' }), ev('ev:d1', { direction: 'supports' })]);
  assert(build(dir).code === 0, 'build 1 nie przeszedł');
  const a = [sha(path.join(dir, 'dist/graph.json')), sha(path.join(dir, 'dist/genome-data.js'))];
  assert(build(dir).code === 0, 'build 2 nie przeszedł');
  const b = [sha(path.join(dir, 'dist/graph.json')), sha(path.join(dir, 'dist/genome-data.js'))];
  assert(a[0] === b[0], 'dist/graph.json NIE jest bajtowo identyczny między buildami');
  assert(a[1] === b[1], 'dist/genome-data.js NIE jest bajtowo identyczny między buildami');
});

test(12, 'licznik relacji wynika WYŁĄCZNIE z danych kanonicznych', dir => {
  writeRec(dir, 'rec:test/pm', 'proj:test-one');
  // szum: `related` między mechanizmami, tekst w note i w body wymieniający mechanizm
  writeProj(dir, 'proj:test-two', { relations: {}, tags: ['mech:alpha', 'używa mech:beta'] });
  writeMech(dir, 'mech:alpha', [ev('ev:k1', { direction: 'supports', note: 'proj:test-two też tego użył — mech:beta również' })],
    { relations: { implements: ['prin:test'], related: ['mech:beta'] } });
  assert(build(dir).code === 0, 'build nie przeszedł');
  const got = pm(dir);
  assert(got.length === 1, 'z 1 kanonicznego faktu powstało ' + got.length + ' krawędzi: ' + JSON.stringify(got));
  assert(got[0].source === 'proj:test-one' && got[0].target === 'mech:alpha' && got[0].relation === 'supported', 'zła krawędź: ' + JSON.stringify(got[0]));

  // usunięcie kanonicznego pola musi usunąć DOKŁADNIE tę krawędź
  writeMech(dir, 'mech:alpha', []);
  assert(build(dir).code === 0, 'build 2 nie przeszedł');
  assert(pm(dir).length === 0, 'krawędź przeżyła usunięcie danych kanonicznych — istnieje drugie źródło prawdy');
});

test(13, 'relations.uses nadal działa (zgodność wstecz) i mapuje się na "used"', dir => {
  writeProj(dir, 'proj:test-one', { relations: { uses: ['mech:alpha'] } });
  assert(build(dir).code === 0, 'build nie przeszedł');
  const e = findEdge(dir, 'proj:test-one', 'mech:alpha', 'used');
  assert(e, 'relations.uses nie dało krawędzi used');
  assert(e.provenance.includes('proj:test-one#relations.uses'), 'brak prowieniencji relations.uses');
  // i NIE może być zdublowana w postaci surowej relacji "uses"
  assert(!graphJson(dir).edges.some(x => x.source === 'proj:test-one' && x.target === 'mech:alpha' && x.relation === 'uses'),
    'krawędź Project→Mechanism zdublowana poza kompilatorem (surowe "uses")');
});

test(14, '--dry-run niczego nie zapisuje i działa na Genome z błędami', dir => {
  writeRec(dir, 'rec:backtests/x', null);
  writeMech(dir, 'mech:alpha', [ev('ev:dr1', { source: 'rec:backtests/x' })]);
  fs.appendFileSync(path.join(dir, 'ledger', 'events-2026-01.jsonl'),
    JSON.stringify({ id: 'evt:2026-01-01-0001', ts: '2026-01-01T10:00:00+01:00', kind: 'kind-spoza-slownika', on: 'mech:alpha', prev_hash: 'genesis' }) + '\n');
  const before = fs.readFileSync(path.join(dir, 'ledger', 'events-2026-01.jsonl'));
  assert(build(dir, ['--check']).code === 1, 'fixture miał być czerwony');
  const r = build(dir, ['--dry-run']);
  assert(r.code === 0, '--dry-run nie może przerywać na czerwonym Genome:\n' + r.out);
  assert(/RAPORT MIGRACYJNY/.test(r.out), 'brak raportu migracyjnego');
  assert(/NIEROZSTRZYGNIĘTE/.test(r.out), 'raport nie podaje nierozstrzygniętych Evidence');
  assert(Buffer.compare(before, fs.readFileSync(path.join(dir, 'ledger', 'events-2026-01.jsonl'))) === 0, '--dry-run ZMIENIŁ Ledger');
});

test(15, '--check zgłasza błędy grafowe ODDZIELNIE od zastanych', dir => {
  writeProj(dir, 'proj:test-one', { mechanisms_confirmed: ['mech:nie-istnieje'] });
  const r = build(dir, ['--check']);
  assert(r.code === 1, '--check powinien odrzucić krawędź do nieistniejącego mechanizmu');
  assert(/\[graf\].*nieistniejący mechanizm mech:nie-istnieje/.test(r.out), 'brak błędu o nieistniejącym mechanizmie:\n' + r.out);
  assert(/warstwa grafu: \d+ błędów/.test(r.out), 'raport nie rozdziela błędów grafowych od zastanych:\n' + r.out);
});

test(16, 'Record backtestu/postmortemu bez attached_to jest zgłaszany', dir => {
  writeRec(dir, 'rec:backtests/bez-przypiecia', null);
  const r = build(dir, ['--check']);
  assert(/\[graf\].*bez relations.attached_to/.test(r.out), 'brak ostrzeżenia o Recordzie bez attached_to:\n' + r.out);
});

test(17, 'sprzeczne mapowanie tego samego Evidence do 2 projektów = błąd', dir => {
  writeRec(dir, 'rec:test/pm', 'proj:test-one');
  writeRec(dir, 'rec:test/pm2', 'proj:test-two');
  // ten sam Evidence ID rozwiązywany do dwóch różnych projektów
  writeMech(dir, 'mech:alpha', [
    ev('ev:konflikt', { direction: 'supports' }),
    ev('ev:konflikt', { direction: 'supports', source: 'rec:test/pm2' }),
  ]);
  const r = build(dir, ['--check']);
  assert(/\[graf\].*ev:konflikt.*2 różnych projektów/.test(r.out), 'sprzeczne mapowanie niewykryte:\n' + r.out);
  assert(r.code === 1, 'sprzeczne mapowanie musi być błędem, nie ostrzeżeniem');
});

test(18, 'nieznany kierunek Evidence = błąd, nie cicha krawędź', dir => {
  writeRec(dir, 'rec:test/pm', 'proj:test-one');
  writeMech(dir, 'mech:alpha', [ev('ev:zly', { direction: 'wzmacnia-troche' })]);
  const r = build(dir, ['--check']);
  assert(/\[graf\].*nieznany kierunek "wzmacnia-troche"/.test(r.out), 'nieznany kierunek nie zgłoszony:\n' + r.out);
  assert(r.code === 1, 'nieznany kierunek musi być błędem');
});

test(19, 'direction=neutral jest legalny i NIE tworzy krawędzi', dir => {
  writeRec(dir, 'rec:test/pm', 'proj:test-one');
  // ingest.js domyślnie ustawia direction:"neutral" — build nie może tego uznać za błąd…
  writeMech(dir, 'mech:alpha', [ev('ev:n1', { type: 'narrative', direction: 'neutral' })]);
  const r = build(dir, ['--check']);
  assert(r.code === 0, 'neutral potraktowany jako błąd — build --check czerwony:\n' + r.out);
  assert(build(dir).code === 0, 'build nie przeszedł');
  // …ani za potwierdzenie
  assert(pm(dir).length === 0, 'neutral utworzył krawędź: ' + JSON.stringify(pm(dir)));
});

/* ── raport ── */
console.log('\n═══ TESTY KOMPILATORA GRAFU Project–Mechanism ═══\n');
results.forEach(r => console.log(r));
console.log(`\n${pass} PASS · ${failCount} FAIL\n`);
process.exit(failCount ? 1 : 0);
