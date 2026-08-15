#!/usr/bin/env node
/* ═══ ZESTAW PRODUKCYJNY — zgodność AKTUALNEJ instalacji ═══
 *
 * PO CO. Fixture `recovery-input-synthetic` zamraża stan wejściowy recovery i dzięki temu testy
 * recovery/deploy są powtarzalne. Ale zamrożony stan z definicji nie mówi nic o tym, czy DZISIEJSZY
 * kanon jest spójny i czy writer działa na dzisiejszych danych. Ten zestaw pilnuje właśnie tego.
 *
 * Pracuje na KOPII kanonu w katalogu tymczasowym. Kanon jest tylko czytany; na koniec sprawdzamy
 * jego hash drzewa i hash samych danych.
 *
 *   node run-canon-tests.js
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

/* Korzeń Genome po cechach katalogu — ten sam plik działa z proposals i z `<genome>/test`. */
function __genomeRoot(start) {
  let d = start;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(d, 'build.js')) && fs.existsSync(path.join(d, 'ledger')) && fs.existsSync(path.join(d, 'records'))) return d;
    const up = path.dirname(d); if (up === d) break; d = up;
  }
  throw new Error('nie znaleziono korzenia Genome od: ' + start);
}
const GENOME = __genomeRoot(__dirname);

let pass = 0, fail = 0; const res = [];
const ok = (n, c, d) => { c ? pass++ : fail++; res.push({ n, c, d: c ? '' : String(d || '').slice(0, 400) }); };
const sha = b => crypto.createHash('sha256').update(b).digest('hex');

/* Dwa niezależne odciski: całe drzewo oraz SAME DANE Genome (Ledger + karty + snapshoty).
   Rozdzielone świadomie — zmiana w kodzie testów nie może być mylona ze zmianą danych. */
function treeHash(root, skip = /(^|\/)(dist|node_modules|\.genome-txn|\.genome-write\.lock)(\/|$)/) {
  const out = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const q = path.join(d, e.name);
      if (skip.test(q.slice(root.length))) continue;
      e.isDirectory() ? walk(q) : out.push(q.slice(root.length) + ':' + sha(fs.readFileSync(q)));
    }
  })(root);
  return sha(out.sort().join('\n'));
}
const DATA_DIRS = ['ledger', 'records', 'projects', 'mechanisms', 'axioms', 'principles', 'workflows',
  'rules', 'guards', 'benchmarks', 'capabilities', 'agents', 'components', 'clients', 'decisions',
  'experiments', 'signals', 'sops'];
function dataHash(root) {
  const acc = [];
  const walk = (d, rel) => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : 1)) {
      const p = path.join(d, e.name), r = rel + '/' + e.name;
      if (e.name === '.DS_Store') continue;   /* artefakt Findera, nie dane Genome */
      e.isDirectory() ? walk(p, r) : acc.push(r + ':' + sha(fs.readFileSync(p)));
    }
  };
  for (const d of DATA_DIRS) walk(path.join(root, d), d);
  const n = path.join(root, '.approval-nonces.jsonl');
  if (fs.existsSync(n)) acc.push('.approval-nonces.jsonl:' + sha(fs.readFileSync(n)));
  return sha(acc.join('\n'));
}

const TREE_BEFORE = treeHash(GENOME);
const DATA_BEFORE = dataHash(GENOME);

/* ── kopia robocza: kanon bez proposals/ i dist/ (writer i build ich nie potrzebują) ── */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'genome-canon-test-'));
const COPY = path.join(tmp, 'genome');
fs.cpSync(GENOME, COPY, {
  recursive: true,
  filter: src => {
    const rel = path.relative(GENOME, src);
    return !(rel === 'proposals' || rel.startsWith('proposals' + path.sep)
      || rel === 'dist' || rel.startsWith('dist' + path.sep));
  }
});

/* ═══ 1. BUILD ═══ */
{
  const r = spawnSync('node', [path.join(COPY, 'build.js'), '--check'], { encoding: 'utf8' });
  const out = (r.stdout || '') + (r.stderr || '');
  const m = out.match(/(\d+) obiektów · (\d+) zdarzeń · (\d+) błędów/);
  ok('C1. build --check na kopii kanonu kończy się kodem 0', r.status === 0, out.slice(-400));
  ok('C2. build raportuje ZERO błędów', !!m && m[3] === '0', m ? `błędów: ${m[3]}` : 'brak podsumowania w wyjściu');
  ok('C3. build widzi obiekty i zdarzenia (kanon nie jest pusty)',
    !!m && Number(m[1]) > 0 && Number(m[2]) > 0, m ? `${m[1]}/${m[2]}` : 'brak podsumowania');
}

/* ═══ 2. KOLEJKA `pending/` ═══
 * Po wdrożeniu pakiet ma iść do `pending/.applied/`. Zestaw NIE wymaga, żeby w kolejce coś
 * leżało — pusta kolejka to stan normalny, a nie awaria. Sprawdzamy natomiast dwie rzeczy,
 * które realnie psują pracę: czy to, co leży w kolejce, daje się jeszcze zaplanować, i czy
 * nie stoi tam pakiet z już zużytym nonce (czyli wdrożony, udający robotę do zrobienia). */
{
  const pend = path.join(COPY, 'pending');
  const queued = fs.existsSync(pend)
    ? fs.readdirSync(pend).filter(f => f.endsWith('.json')).sort() : [];

  const nonceFile = path.join(GENOME, '.approval-nonces.jsonl');
  const usedNonces = new Set(fs.existsSync(nonceFile)
    ? fs.readFileSync(nonceFile, 'utf8').split('\n').filter(Boolean)
        .map(l => { try { return JSON.parse(l).nonce; } catch { return null; } }).filter(Boolean)
    : []);

  const stale = queued.filter(f => {
    try {
      const b = JSON.parse(fs.readFileSync(path.join(pend, f), 'utf8'));
      const n = (b.approval && (b.approval.nonce || (b.approval.package || {}).nonce)) || null;
      return n && usedNonces.has(n);
    } catch { return false; }
  });
  ok('C4. w kolejce `pending/` nie stoi pakiet z już zużytym nonce (wdrożone idą do .applied/)',
    stale.length === 0, 'wdrożone, a wciąż w kolejce: ' + stale.join(', '));

  /* Dry-run NIE jest w stanie zaplanować pakietu, który tworzy typ chroniony (`mechanism`,
     `rule`, `guard`, `sop`) albo dokłada Evidence do karty powstającej w tym samym pakiecie:
     writer odrzuca to ZANIM cokolwiek zaplanuje, bo `--dry-run` z definicji nie ma approval.
     To poprawne zachowanie, nie awaria — więc test je rozpoznaje zamiast liczyć jako FAIL.
     Taki pakiet weryfikuje się pełnym ingestem na kopii, kluczem testowym (patrz sekcja 4b). */
  const GUARDED_DRYRUN = /typ "(mechanism|rule|guard|sop)" wymaga jawnego approval|karta [a-z:\-\/]+ nie istnieje/;

  for (const b of queued) {
    const r = spawnSync('node', [path.join(COPY, 'ingest.js'), path.join(pend, b), '--dry-run'], { encoding: 'utf8' });
    const out = (r.stdout || '') + (r.stderr || '');
    const guarded = r.status !== 0 && GUARDED_DRYRUN.test(out);
    ok(`C5. ${b}: writer albo planuje bez błędu, albo odrzuca z powodu typu chronionego`,
      r.status === 0 || guarded, out.slice(-500));
    ok(`C6. ${b}: dry-run nie zapisuje nic`,
      /Zero zmian na dysku/.test(out) || /nic nie zapisano/.test(out), out.slice(-300));
  }
  if (!queued.length) ok('C5. kolejka pusta — nie ma czego planować (stan normalny po wdrożeniu)', true);
}

/* ═══ 3. ROZPOZNAWANIE ŚCIEŻEK Z LOKALIZACJI KANONICZNEJ ═══ */
{
  const must = {
    'build.js': path.join(GENOME, 'build.js'),
    'ingest.js': path.join(GENOME, 'ingest.js'),
    'migrate.js': path.join(GENOME, 'migrate.js'),
    'lib/approval.js': path.join(GENOME, 'lib', 'approval.js'),
    'lib/genome-txn.js': path.join(GENOME, 'lib', 'genome-txn.js'),
    'test/fixture-template': path.join(GENOME, 'test', 'fixture-template'),
  };
  const missing = Object.entries(must).filter(([, p]) => !fs.existsSync(p)).map(([k]) => k);
  ok('C7. instalacja kanoniczna ma komplet modułów i katalogów, których szukają zestawy',
    missing.length === 0, 'brakuje: ' + missing.join(', '));

  ok('C8. korzeń Genome rozpoznaje się z katalogu testów bez liczenia „..”',
    __genomeRoot(path.join(GENOME, 'test')) === GENOME);

  const suites = ['run-tests.js', 'run-final-tests.js', 'run-e2e-tests.js', 'run-migration-tests.js', 'run-gate-tests.js'];
  const noDiscovery = suites.filter(f => {
    const p = path.join(GENOME, 'test', f);
    return !fs.existsSync(p) || !/__genomeRoot/.test(fs.readFileSync(p, 'utf8'));
  });
  ok('C9. zestawy w lokalizacji kanonicznej używają rozpoznawania ścieżek, nie stałej liczby „..”',
    noDiscovery.length === 0, 'bez rozpoznawania: ' + noDiscovery.join(', '));
}

/* ═══ 4. FIXTURE NIE ZOSTAŁ PO CICHU PRZEBUDOWANY ═══ */
{
  const gen = path.join(GENOME, 'proposals', 'fixtures', 'fixture-recovery-input.js');
  if (fs.existsSync(gen)) {
    const r = spawnSync('node', [gen, '--quiet'], { encoding: 'utf8' });
    ok('C10. syntetyczny fixture stanu wejściowego recovery zgadza się z zapisanym hashem',
      r.status === 0, ((r.stdout || '') + (r.stderr || '')).slice(-400));
  } else ok('C10. generator fixture\'u istnieje', false, 'brak ' + gen);
}

/* ═══ 4b. PEŁNY ZAPIS PRZEZ WRITERA — na kopii, pakietem zbudowanym TU I TERAZ ═══
 *
 * Dry-run nie jest obietnicą udanego zapisu: nie sprawdza podpisu, `proposal_hash`, artefaktów
 * runtime ani nonce. Ten blok domyka lukę, ale świadomie NIE używa żadnego pakietu z `pending/`:
 *   • pakiet historyczny po wdrożeniu nie przejdzie drugi raz (nonce zużyty, obiekty istnieją),
 *   • liczby wpisane na sztywno (205/218, 206/221) starzeją się z każdym zapisem.
 * Zamiast tego budujemy jednorazowy pakiet i sprawdzamy DELTĘ względem stanu zmierzonego przed
 * zapisem. Zestaw jest przez to niezależny od tego, ile Genome ma dziś obiektów. */
{
  const w = path.join(tmp, 'apply', 'genome');
  fs.cpSync(GENOME, w, {
    recursive: true,
    filter: src => {
      const rel = path.relative(GENOME, src);
      return !(rel === 'proposals' || rel.startsWith('proposals' + path.sep)
        || rel === 'dist' || rel.startsWith('dist' + path.sep));
    }
  });

  /* Kotwica testowa: moduły produkcyjne nie mają punktu wstrzyknięcia zaufania,
     więc przepisujemy `trustDir()` w KOPII. Kopia nigdzie nie trafia. */
  const anchor = path.join(tmp, 'apply', '.anchor');
  fs.mkdirSync(anchor, { recursive: true });
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
  fs.writeFileSync(path.join(anchor, 'approval-pubkey.pem'), publicKey.export({ type: 'spki', format: 'pem' }));
  const apPath = path.join(w, 'lib', 'approval.js');
  const apSrc = fs.readFileSync(apPath, 'utf8')
    .replace(/function trustDir\(\) \{[\s\S]*?\n\}/, `function trustDir() { return ${JSON.stringify(anchor)}; }   /* KOPIA TESTOWA */`);
  ok('C13. da się podstawić kotwicę testową w KOPII modułów', /KOPIA TESTOWA/.test(apSrc));
  fs.writeFileSync(apPath, apSrc);

  const A = require(apPath);

  /* stan PRZED — mierzony, nie zakładany */
  const before = spawnSync('node', [path.join(w, 'build.js'), '--check'], { encoding: 'utf8' });
  const mb = ((before.stdout || '') + (before.stderr || '')).match(/(\d+) obiektów · (\d+) zdarzeń/);
  const objBefore = mb ? Number(mb[1]) : NaN;
  const evtBefore = mb ? Number(mb[2]) : NaN;
  ok('C14. stan kopii przed zapisem daje się zmierzyć', Number.isFinite(objBefore) && Number.isFinite(evtBefore),
    ((before.stdout || '') + (before.stderr || '')).slice(-300));

  const PROBE_ID = 'rec:test/canon-suite-probe';
  const payload = {
    events: [],
    evidence: [],
    objects: [{
      op: 'object.create', id: PROBE_ID, type: 'record',
      title: 'Sonda zestawu produkcyjnego', status: 'created',
      created: '2026-01-01', owner: 'przemek', relations: {}, tags: ['test'],
      actor: 'test:canon-suite',
      ingest_note: 'Jednorazowa sonda run-canon-tests. Powstaje wylacznie na kopii w katalogu tymczasowym.',
      body: '\nSonda zestawu produkcyjnego. Nie powinna nigdy trafić do kanonu.\n',
    }],
  };
  const NONCE = 'canon-suite-' + crypto.randomBytes(6).toString('hex');
  const pkg = {
    schema_version: A.SCHEMA_VERSION, phase: 'contract', nonce: NONCE, expires_at: '2099-12-31',
    claims: [], research: [], routing: null, recommended_mechanisms: [], recommended_frameworks: [],
    metrics: [], predictions: [],
    project_contract: {
      client: 'r352 (test)', business_problem: 'Sprawdzenie, czy writer wykonuje pelny zapis na aktualnej instalacji.',
      project_start: '2026-01-01', scope: 'jedna karta sondujaca', non_scope: 'jakikolwiek zapis do kanonu',
      baseline: 'stan kopii zmierzony przed zapisem', mechanisms: [], frameworks: [],
      validation_plan: 'delta obiektow i zdarzen po zapisie plus zielony build', outcome_owner: 'przemek',
      measurement_date: '2099-12-31', go_decision: 'GO', go_rationale: 'Zestaw testowy na kopii.',
      prepared_by: 'test:canon-suite', decided_by: 'przemek', report_version: 'v1', contract_version: 'v1',
    },
    payload_hash: A.payloadHash(payload),
    artifact_hashes: Object.fromEntries(['ingest.js', 'lib/approval.js', 'lib/genome-common.js',
      'lib/research-contract.js', 'lib/evidence-writer.js'].map(rel => [rel, sha(fs.readFileSync(path.join(w, rel)))])),
  };
  const bundle = {
    ...payload,
    approval: {
      status: 'approved', approved_by: 'test:canon-suite', approved_at: new Date().toISOString(),
      nonce: NONCE, proposal_hash: pkg.payload_hash, package: pkg,
      signature: crypto.sign(null, A.signingBytes(pkg), privateKey).toString('hex'),
    },
  };
  const bp = path.join(tmp, 'apply', 'bundle-probe.json');
  fs.writeFileSync(bp, JSON.stringify(bundle, null, 1));

  const r = spawnSync('node', [path.join(w, 'ingest.js'), bp], { encoding: 'utf8' });
  const out = (r.stdout || '') + (r.stderr || '');
  const ingestOk = r.status === 0;
  ok('C15. pełny ingest podpisanego pakietu kończy się kodem 0', ingestOk, out.slice(-700));

  /* Bramka: bez udanego zapisu wyniki nie mają czego mierzyć. Sprawdzanie ich mimo wszystko
     dawało kaskadę FAIL-i maskujących jedną prawdziwą przyczynę. */
  if (!ingestOk) {
    ok('C16–C19. pominięte: ingest nie przeszedł, wyniki nie mają czego mierzyć', false,
      'przyczyna wyżej (C15)');
  } else {
    const rb = spawnSync('node', [path.join(w, 'build.js'), '--check'], { encoding: 'utf8' });
    const ma = ((rb.stdout || '') + (rb.stderr || '')).match(/(\d+) obiektów · (\d+) zdarzeń · (\d+) błędów/);
    ok('C16. po zapisie DELTA to dokładnie +1 obiekt i +1 zdarzenie, zero błędów',
      !!ma && Number(ma[1]) === objBefore + 1 && Number(ma[2]) === evtBefore + 1 && ma[3] === '0',
      ma ? `przed ${objBefore}/${evtBefore} · po ${ma[1]}/${ma[2]} · błędów ${ma[3]}` : 'brak podsumowania buildu');

    ok('C17. powstała karta sondująca', fs.existsSync(path.join(w, 'records', 'test', 'canon-suite-probe.md')));

    const nonces = path.join(w, '.approval-nonces.jsonl');
    ok('C18. nonce pakietu został zużyty i odnotowany',
      fs.existsSync(nonces) && fs.readFileSync(nonces, 'utf8').includes(NONCE));

    /* NEGATYW: podmiana pliku runtime PO podpisie musi zatrzymać zapis przed pierwszą zmianą.
       Bez tego `artifact_hashes` byłyby deklaracją w podpisie, a nie działającą bramką. */
    const w2 = path.join(tmp, 'apply2', 'genome');
    fs.cpSync(w, w2, { recursive: true });
    fs.appendFileSync(path.join(w2, 'lib', 'genome-common.js'), '\n/* podmiana po podpisie */\n');
    const NONCE2 = 'canon-suite-neg-' + crypto.randomBytes(6).toString('hex');
    const pkg2 = { ...pkg, nonce: NONCE2 };
    const b2 = { ...payload, objects: [{ ...payload.objects[0], id: PROBE_ID + '-2' }] };
    b2.approval = {
      status: 'approved', approved_by: 'test:canon-suite', approved_at: new Date().toISOString(),
      nonce: NONCE2, package: { ...pkg2, payload_hash: A.payloadHash(b2) },
    };
    b2.approval.proposal_hash = b2.approval.package.payload_hash;
    b2.approval.signature = crypto.sign(null, A.signingBytes(b2.approval.package), privateKey).toString('hex');
    const bp2 = path.join(tmp, 'apply2', 'bundle-neg.json');
    fs.mkdirSync(path.dirname(bp2), { recursive: true });
    fs.writeFileSync(bp2, JSON.stringify(b2, null, 1));
    const ledgerBefore = sha(fs.readFileSync(path.join(w2, 'ledger', 'events-2026-08.jsonl')));
    const r2 = spawnSync('node', [path.join(w2, 'ingest.js'), bp2], { encoding: 'utf8' });
    const out2 = (r2.stdout || '') + (r2.stderr || '');
    ok('C19. podmieniony plik runtime ZATRZYMUJE zapis (artifact_hashes są sprawdzane, nie tylko podpisane)',
      r2.status !== 0 && /RUNTIME NIE ODPOWIADA PODPISOWI/.test(out2), out2.slice(-400));
    ok('C20. po odrzuceniu Ledger kopii jest bajtowo nietknięty',
      sha(fs.readFileSync(path.join(w2, 'ledger', 'events-2026-08.jsonl'))) === ledgerBefore);
  }
}

/* ═══ 4c. REWIZJA DANYCH — sygnał, po którym tablica poznaje, że jest nieaktualna ═══
 * Bez tego tablica po podpisanym ingeście pokazywała stan sprzed zapisu i nic tego nie
 * sygnalizowało. Sprawdzamy trzy własności: rewizja powstaje, NIE zmienia się bez zmiany
 * danych (inaczej tablica przeładowywałaby się w kółko) i zmienia się, gdy dane się zmienią. */
{
  const revFile = path.join(COPY, 'dist', 'REVISION.json');
  const readRev = () => { try { return JSON.parse(fs.readFileSync(revFile, 'utf8')); } catch { return null; } };

  spawnSync('node', [path.join(COPY, 'build.js')], { encoding: 'utf8' });
  const r1 = readRev();
  ok('C21. build zapisuje dist/REVISION.json z rewizją i licznikami',
    !!r1 && typeof r1.revision === 'string' && r1.revision.length >= 8
    && Number.isFinite(r1.objects) && Number.isFinite(r1.events),
    JSON.stringify(r1));

  spawnSync('node', [path.join(COPY, 'build.js')], { encoding: 'utf8' });
  const r2 = readRev();
  ok('C22. drugi build BEZ zmiany danych daje tę samą rewizję (tablica się nie przeładowuje bez powodu)',
    !!r2 && !!r1 && r2.revision === r1.revision, `${r1 && r1.revision} → ${r2 && r2.revision}`);

  const probe = path.join(COPY, 'records', 'test', 'revision-probe.md');
  fs.mkdirSync(path.dirname(probe), { recursive: true });
  fs.writeFileSync(probe, [
    '---',
    'id: "rec:test/revision-probe"',
    'type: "record"',
    'title: "Sonda rewizji"',
    'status: "created"',
    'created: "2026-01-01"',
    'updated: "2026-01-01"',
    'version: 1',
    'owner: "przemek"',
    'relations: {}',
    'tags: ["test"]',
    '---',
    '',
    'Sonda rewizji — powstaje wyłącznie na kopii.',
    ''].join('\n'));
  const rb = spawnSync('node', [path.join(COPY, 'build.js')], { encoding: 'utf8' });
  const r3 = readRev();
  ok('C23. zmiana danych → build → NOWA rewizja i większy licznik obiektów',
    rb.status === 0 && !!r3 && !!r1 && r3.revision !== r1.revision && r3.objects === r1.objects + 1,
    `${r1 && r1.revision}/${r1 && r1.objects} → ${r3 && r3.revision}/${r3 && r3.objects}`);

  const watcher = path.join(GENOME, '..', '..', 'genome-os', 'js', 'core', 'revision-watch.js');
  if (fs.existsSync(watcher)) {
    const src = fs.readFileSync(watcher, 'utf8');
    ok('C24. tablica odpytuje plik rewizji i ma stan błędu synchronizacji',
      /genome-revision\.json/.test(src) && /Błąd synchronizacji/.test(src)
      && /setInterval/.test(src) && /location\.reload/.test(src));
  } else ok('C24. tablica ma podpięty obserwator rewizji', false, 'brak ' + watcher);
}

/* ═══ 4d. INBOX JEST POZA KANONEM — utrwalone testem, nie przeoczeniem ═══
 * `build.js` skanuje listę dozwolonych katalogów (TYPES) i `inbox` w niej nie występuje.
 * To działa, ale „niewidoczny przez przeoczenie" jest słabszy niż „niewidoczny przez regułę":
 * ktoś kiedyś dopisze `inbox` do TYPES i brudne wejście po cichu stanie się kanonem.
 * Sonda jest kartą wyglądającą 1:1 jak prawdziwa — gdyby build ją liczył, licznik urośnie. */
{
  const revFile = path.join(COPY, 'dist', 'REVISION.json');
  const readRev = () => { try { return JSON.parse(fs.readFileSync(revFile, 'utf8')); } catch { return null; } };

  spawnSync('node', [path.join(COPY, 'build.js')], { encoding: 'utf8' });
  const before = readRev();

  const inbox = path.join(COPY, 'inbox');
  fs.mkdirSync(inbox, { recursive: true });
  fs.writeFileSync(path.join(inbox, '2026-01-01-sonda.md'), [
    '---',
    'id: "rec:inbox/sonda-testowa"',
    'type: "record"',
    'title: "Sonda inboxa — wygląda 1:1 jak karta kanoniczna"',
    'status: "created"',
    'created: "2026-01-01"',
    'updated: "2026-01-01"',
    'version: 1',
    'owner: "przemek"',
    'relations: {}',
    'tags: ["test"]',
    '---',
    '',
    'Gdyby build to policzył, licznik obiektów by wzrósł.',
    ''].join('\n'));

  const rb = spawnSync('node', [path.join(COPY, 'build.js')], { encoding: 'utf8' });
  const after = readRev();

  ok('C25. karta położona w inbox/ NIE zmienia liczników buildu',
    rb.status === 0 && !!before && !!after
    && after.objects === before.objects && after.events === before.events,
    before && after ? `${before.objects}/${before.events} → ${after.objects}/${after.events}` : 'brak rewizji');

  ok('C26. inbox/ NIE zmienia rewizji danych (tablica się przez niego nie przeładuje)',
    !!before && !!after && after.revision === before.revision,
    before && after ? `${before.revision} → ${after.revision}` : 'brak rewizji');

  let inData = false;
  try {
    const g = fs.readFileSync(path.join(COPY, 'dist', 'genome-data.js'), 'utf8');
    inData = g.includes('rec:inbox/sonda-testowa');
  } catch { inData = true; }
  ok('C27. karta z inbox/ nie trafia do danych viewera', !inData);

  fs.rmSync(inbox, { recursive: true, force: true });
}

/* ═══ 4e. ZAKAZ TREŚCI PRYWATNYCH W FIRMOWYM INBOKSIE ═══
 * `privacy` przyjmuje wyłącznie `firmowe` i `klienckie`. Ochrona oparta na dyscyplinie
 * („pamiętaj, żeby uważać") nie jest ochroną — więc sprawdza to test, na żywym katalogu. */
{
  const inbox = path.join(GENOME, 'inbox');
  const bad = [];
  if (fs.existsSync(inbox)) {
    const walk = d => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) { walk(p); continue; }
        if (!e.name.endsWith('.md')) continue;
        const head = fs.readFileSync(p, 'utf8').split('---')[1] || '';
        if (/privacy:\s*"?prywatne"?/.test(head)) bad.push(path.relative(GENOME, p));
      }
    };
    walk(inbox);
  }
  ok('C28. w inbox/ nie ma sygnału oznaczonego jako prywatny (te idą poza repo)',
    bad.length === 0, 'prywatne w repo: ' + bad.join(', '));

  ok('C29. inbox/ ma README i szablon — brudne wejście jest opisane, nie domyślne',
    !fs.existsSync(inbox) || (fs.existsSync(path.join(inbox, 'README.md')) && fs.existsSync(path.join(inbox, '_SZABLON.md'))));
}

/* ═══ 5. KANON NIETKNIĘTY ═══ */
{
  ok('C11. dane kanonu bajtowo nietknięte przez cały zestaw', dataHash(GENOME) === DATA_BEFORE,
    `przed ${DATA_BEFORE.slice(0, 16)} · po ${dataHash(GENOME).slice(0, 16)}`);
  ok('C12. całe drzewo kanonu bajtowo nietknięte przez cały zestaw', treeHash(GENOME) === TREE_BEFORE,
    `przed ${TREE_BEFORE.slice(0, 16)} · po ${treeHash(GENOME).slice(0, 16)}`);
}

fs.rmSync(tmp, { recursive: true, force: true });

console.log('\n═══ ZESTAW PRODUKCYJNY — AKTUALNA INSTALACJA ═══');
console.log('kanon: ' + GENOME);
console.log('dane:  ' + DATA_BEFORE.slice(0, 16) + '…\n');
for (const r of res) console.log(`  ${r.c ? '✓' : '✗'} ${r.n}${r.d ? '\n      → ' + r.d : ''}`);
console.log(`\n  ${pass} PASS · ${fail} FAIL\n`);
process.exit(fail ? 1 : 0);
