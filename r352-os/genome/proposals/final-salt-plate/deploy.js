#!/usr/bin/env node
/* ═══ WDROŻENIE SALT/PLATE — jedna transakcja ═══
 *
 *   node deploy.js --dry-run [--target <repo>]   pełny przebieg na kopii, zero zapisu do kanonu
 *   node deploy.js --apply                       wdrożenie; wymaga recovery + podpisu Ed25519
 *   node deploy.js --fail-after <krok>           wymuszona awaria po kroku (testy rollbacku)
 *
 * Zastępuje `deploy.sh`, który NIE BYŁ jedną transakcją: ingest zapisywał karty, Ledger i nonce,
 * a dopiero potem szedł build i testy — rollback shellowy cofał wyłącznie 12 plików manifestu.
 * Tutaj manifest, skille, obiekty, Evidence, Ledger, nonce, build i viewer są pod JEDNĄ blokadą
 * i JEDNYM rollbackiem.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const HERE = __dirname;
const A = require(path.join(HERE, 'lib', 'approval.js'));
const { runTransaction, treeHash, sha256 } = require(path.join(HERE, 'lib', 'genome-txn.js'));
const EW = require(path.join(HERE, 'lib', 'evidence-writer.js'));

const STEPS = ['brama-recovery', 'manifest', 'skille', 'obiekty', 'evidence', 'ledger', 'build', 'viewer'];
const MANIFEST = [
  ['lib/approval.js', 'r352-os/genome/lib/approval.js'],
  ['lib/genome-txn.js', 'r352-os/genome/lib/genome-txn.js'],
  ['lib/evidence-writer.js', 'r352-os/genome/lib/evidence-writer.js'],
  ['lib/genome-common.js', 'r352-os/genome/lib/genome-common.js'],
  ['lib/canon-guard.js', 'r352-os/genome/lib/canon-guard.js'],
  ['lib/research-contract.js', 'r352-os/genome/lib/research-contract.js'],
  ['lib/strategy-frameworks.js', 'r352-os/genome/lib/strategy-frameworks.js'],
  ['genome/ingest.js', 'r352-os/genome/ingest.js'],
  ['genome/migrate.js', 'r352-os/genome/migrate.js'],
  ['ROUTER.md', 'r352-os/genome/ROUTER.md'],
  ['skills/mechanism-router/SKILL.md', '.claude/skills/mechanism-router/SKILL.md'],
  ['skills/research-benchmark/SKILL.md', '.claude/skills/research-benchmark/SKILL.md'],
  ['test/run-final-tests.js', 'r352-os/genome/test/run-final-tests.js'],
  ['test/run-e2e-tests.js', 'r352-os/genome/test/run-e2e-tests.js'],
  ['test/run-migration-tests.js', 'r352-os/genome/test/run-migration-tests.js'],
  ['test/run-gate-tests.js', 'r352-os/genome/test/run-gate-tests.js'],
  ['test/run-tests.js', 'r352-os/genome/test/run-tests.js'],
];
/* Bramka recovery — PEŁNY stan, nie dwa pola */
const RECOVERY_GATE = {
  archive_sha: '4806dd3da1a8b4d3c54fa60d3b93e8785fb8f17c587e6973b55ab3f5295281c3',
  archive_lines: 179,
  seed_event_count: 179,
  seed_tail_hash: '4f96034058f4c5fa',
  snapshot_records: 32,
  snapshot_sha: '3ae31e669984fc8746a7498ff770cdc0d382ff615a69e7d495d1053fcb146a91',
  incident_record: 'records/incydenty/2026-08-09-test-zapisal-do-kanonu.md',
  /* JEDNO konkretne zdarzenie, sprawdzane per LINIA JSONL — nie `includes()` po całym Ledgerze */
  recovery_event: { kind: 'knowledge.corrected', on: 'rec:F0-SEED-FREEZE',
    cause: 'rec:incydenty/2026-08-09-test-zapisal-do-kanonu' },
};

const argv = process.argv.slice(2);
const val = f => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
const APPLY = argv.includes('--apply');
const FAIL_AFTER = val('--fail-after');
const KILL_AFTER = val('--kill-after');
   /* hak testowy: SIGKILL po kroku, bez rozwijania stosu */
const BUNDLE_PATH = val('--bundle') || path.join(HERE, 'deploy-bundle.json');
if (FAIL_AFTER && !STEPS.includes(FAIL_AFTER)) { console.error(`✗ --fail-after: nieznany krok (${STEPS.join('|')})`); process.exit(2); }

const CANON = path.resolve(HERE, '..', '..');
const CANON_REPO = path.resolve(CANON, '..', '..');
let REPO = val('--target');
let tmpDir = null;
if (!REPO) {
  if (APPLY) REPO = CANON_REPO;
  else {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'genome-deploy-'));
    REPO = path.join(tmpDir, 'repo');
    fs.mkdirSync(path.join(REPO, 'r352-os'), { recursive: true });
    execFileSync('cp', ['-R', CANON, path.join(REPO, 'r352-os', 'genome')]);
    fs.rmSync(path.join(REPO, 'r352-os', 'genome', 'proposals'), { recursive: true, force: true });
    fs.rmSync(path.join(REPO, 'r352-os', 'genome', 'dist'), { recursive: true, force: true });
    fs.mkdirSync(path.join(REPO, '.claude'), { recursive: true });
    execFileSync('cp', ['-R', path.join(CANON_REPO, '.claude', 'skills'), path.join(REPO, '.claude', 'skills')]);
    if (fs.existsSync(path.join(CANON_REPO, '.agents', 'skills'))) {
      fs.mkdirSync(path.join(REPO, '.agents'), { recursive: true });
      execFileSync('cp', ['-R', path.join(CANON_REPO, '.agents', 'skills'), path.join(REPO, '.agents', 'skills')]);
    }
  }
}
const G = path.join(REPO, 'r352-os', 'genome');
const cleanup = () => { if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true }); };
/* ── GUARD KANONU: żaden REALNY cel zapisu nie może dotykać kanonu, gdy podano --target.
 * Zamyka dwa obejścia z audytu: podmieniony TMPDIR (bo nie pytamy o „piaskownicę", tylko
 * o dotknięcie kanonu) i symlink r352-os/genome → kanon (bo sprawdzamy realpath KAŻDEGO celu). */
const CANON_GUARD = require(path.join(HERE, 'lib', 'canon-guard.js'));
const EXPLICIT_TARGET_GUARD = Boolean(val('--target'));
/* ── `--target` JEST WYŁĄCZNIE DLA DRY-RUN ──
 * Dopóki `--apply` przyjmował dowolny korzeń, każda kontrola musiała zgadywać, czy ten korzeń jest
 * „bezpieczną kopią" — a to pytanie da się przekręcić (TMPDIR, symlink). Usuwamy pytanie:
 * przy `--apply` celem jest ZAWSZE własna instalacja wykonawcy. Testy uruchamiają wykonawcę
 * skopiowanego do kopii repo, więc jego instalacją jest ta kopia — dokładnie jak w produkcji. */
if (APPLY && EXPLICIT_TARGET_GUARD) {
  console.log('✗ --target jest dozwolone WYŁĄCZNIE z --dry-run. Przy --apply celem jest instalacja wykonawcy;');
  console.log('  inaczej wywołujący wybierałby, gdzie zapisać, a każda kontrola „czy to kopia" jest do przekręcenia.');
  process.exit(3);
}
if (EXPLICIT_TARGET_GUARD) {
  const TGTS = [REPO, G, path.join(REPO, '.claude', 'skills'), path.join(REPO, '.agents', 'skills'), path.join(REPO, 'genome-os', 'js')];
  /* 1) żaden cel nie może dotykać kanonu (gdy wykonawca jest zainstalowany w Genome) */
  const chk = CANON_GUARD.checkTargetsAgainstCanon(TGTS, CANON_GUARD.canonRootsFor(CANON));
  if (!chk.ok) { console.log('✗ ' + CANON_GUARD.canonGuardError(chk.hits)); cleanup(); process.exit(3); }
  /* 2) żadna REALNA ścieżka zapisu nie może wyjść poza zadeklarowany --target (łapie symlinki) */
  const esc = CANON_GUARD.checkTargetsEscapeRoot(TGTS, REPO);
  if (!esc.ok) { console.log('✗ ' + CANON_GUARD.escapeGuardError(esc.hits)); cleanup(); process.exit(3); }
}

const say = (...a) => console.log(...a);
const hr = () => say('─'.repeat(72));
const EXPLICIT = EXPLICIT_TARGET_GUARD;

say('═══ WDROŻENIE SALT/PLATE ═══');
say(`tryb: ${APPLY ? 'APPLY (kanon)' : 'DRY-RUN (kopia)'}${FAIL_AFTER ? `  · WYMUSZONA AWARIA PO: ${FAIL_AFTER}` : ''}`);
say(`cel:  ${REPO}`);
const canonBefore = EXPLICIT ? null : treeHash(CANON);
if (canonBefore) say(`hash drzewa kanonu PRZED: ${canonBefore.slice(0, 32)}…`);
hr();

let bundle;
try { bundle = JSON.parse(fs.readFileSync(BUNDLE_PATH, 'utf8')); }
catch (e) { say('✗ pakiet: ' + e.message); cleanup(); process.exit(2); }
const payload = { events: bundle.events || [], evidence: bundle.evidence || [], objects: bundle.objects || [] };
/* ZERO override zaufania. Klucz publiczny pochodzi wyłącznie z kotwicy wyprowadzonej z bazy
 * użytkowników (lib/approval.js). Nie ma flagi, zmiennej ani ścieżki, którą wywołujący mógłby
 * podstawić własne zaufanie — usunięta flaga była omijalna przez TMPDIR i przez symlinki. */
const rev = A.verifyApproval(bundle.approval, payload, { requireArtifacts: true });
say(`ZGODA: ${rev.state} — ${rev.why}`);
if (APPLY && rev.state !== 'verified') {
  say('\n✗ --apply ODRZUCONE: brak ważnego podpisu Ed25519 właściciela.');
  cleanup(); process.exit(3);
}
hr();

/* ── renderowanie karty z frontmatterem (JSON-in-YAML, jak w całym Genome) ── */
const renderCard = (fm, body) => '---\n' + Object.entries(fm).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n') + '\n---\n' + (body || '');
const parseCard = raw => {
  const end = raw.indexOf('\n---', 4); const fm = {};
  for (const l of raw.slice(4, end).split('\n')) { const i = l.indexOf(': '); if (i > 0) { try { fm[l.slice(0, i)] = JSON.parse(l.slice(i + 2)); } catch { fm[l.slice(0, i)] = l.slice(i + 2); } } }
  return { fm, body: raw.slice(end + 4) };
};
const TYPE_DIR = { workflow: 'workflows', mechanism: 'mechanisms', record: 'records', decision: 'decisions' };
const cardPath = (type, id) => {
  const segs = id.split(':').slice(1).join(':').split('/').map(s => s.replace(/[^a-zA-Z0-9._-]/g, '-')).filter(s => s && s !== '.' && s !== '..');
  return path.join('r352-os', 'genome', TYPE_DIR[type], ...segs.slice(0, -1), segs[segs.length - 1] + '.md');
};

const result = runTransaction(G, (txn) => {
  const trip = s => {
    if (KILL_AFTER === s) process.kill(process.pid, 'SIGKILL');   /* zabija BEZ rollbacku */
    if (FAIL_AFTER === s) throw new Error(`WYMUSZONA AWARIA PO KROKU "${s}" (--fail-after)`);
  };
  const done = [];
  const R = rel => path.join(REPO, rel);   /* ścieżki repo (poza korzeniem genome) */
  const today = new Date().toISOString().slice(0, 10);

  /* ── 1. BRAMKA RECOVERY: pełny stan, nie dwa pola ── */
  const gate = [];
  const arch = 'ledger/.archive/events-2026-08.pre-mig-2026-08-evidence-contract-v1.jsonl';
  if (txn.sha(arch) !== RECOVERY_GATE.archive_sha) gate.push(`archiwum sha256 ${txn.sha(arch)} ≠ ${RECOVERY_GATE.archive_sha}`);
  const archLines = (txn.read(arch) || Buffer.from('')).toString('utf8').split('\n').filter(Boolean).length;
  if (archLines !== RECOVERY_GATE.archive_lines) gate.push(`archiwum ${archLines} linii ≠ ${RECOVERY_GATE.archive_lines}`);
  const fz = (txn.read('records/F0-SEED-FREEZE.md') || Buffer.from('')).toString('utf8');
  if (!new RegExp(`seed_event_count: ${RECOVERY_GATE.seed_event_count}\\b`).test(fz)) gate.push(`freeze: brak seed_event_count ${RECOVERY_GATE.seed_event_count}`);
  if (!fz.includes(`"${RECOVERY_GATE.seed_tail_hash}"`)) gate.push(`freeze: brak tail hash ${RECOVERY_GATE.seed_tail_hash}`);
  /* SNAPSHOT: dokładny SHA-256, nie sam kształt */
  const snapRel = 'records/.snapshots/mig-2026-08-evidence-contract-v1-records.json';
  const snapSha = txn.sha(snapRel);
  if (snapSha !== RECOVERY_GATE.snapshot_sha) gate.push(`snapshot sha256 ${snapSha} ≠ ${RECOVERY_GATE.snapshot_sha}`);
  let snap = null;
  try { snap = JSON.parse((txn.read(snapRel) || Buffer.from('{}')).toString('utf8')); } catch { /* nieparsowalny */ }
  if (!snap || snap.recovered !== true || (snap.records || []).length !== RECOVERY_GATE.snapshot_records)
    gate.push(`snapshot: recovered=${snap && snap.recovered}, records=${snap && (snap.records || []).length} (oczekiwane true/${RECOVERY_GATE.snapshot_records})`);
  if (!fs.existsSync(path.join(G, RECOVERY_GATE.incident_record))) gate.push('brak Recordu incydentu');

  /* ZDARZENIE RECOVERY: parsujemy KAŻDĄ linię i szukamy JEDNEJ pasującej we wszystkich polach.
     `includes()` po całym pliku dawałby trafienie, gdy fragmenty leżą w różnych zdarzeniach. */
  const ledRaw = (txn.read('ledger/events-2026-08.jsonl') || Buffer.from('')).toString('utf8');
  const ledLines = ledRaw.split('\n').filter(Boolean);
  let recEvents = 0;
  for (const line of ledLines) {
    let ev; try { ev = JSON.parse(line); } catch { gate.push('Ledger zawiera nieparsowalną linię JSONL'); break; }
    if (ev.kind === RECOVERY_GATE.recovery_event.kind
      && ev.on === RECOVERY_GATE.recovery_event.on
      && ev.cause === RECOVERY_GATE.recovery_event.cause) recEvents++;
  }
  if (recEvents !== 1) gate.push(`zdarzenie recovery (kind=${RECOVERY_GATE.recovery_event.kind}, on=${RECOVERY_GATE.recovery_event.on}, cause=${RECOVERY_GATE.recovery_event.cause}): znaleziono ${recEvents}, oczekiwano dokładnie 1`);

  /* HASH-CHAIN: integralność całego Ledgera po recovery */
  {
    let prev = 'genesis', broken = 0;
    for (const line of ledLines) {
      let ev; try { ev = JSON.parse(line); } catch { break; }
      if (ev.prev_hash !== prev) broken++;
      prev = require('crypto').createHash('sha256').update(line).digest('hex').slice(0, 16);
    }
    if (broken) gate.push(`hash-chain Ledgera zerwany w ${broken} miejscach — recovery nie jest wiarygodne`);
  }

  let buildOk = false;
  try { execFileSync('node', [path.join(G, 'build.js'), '--check'], { env: { ...process.env, GENOME_DIR: G }, encoding: 'utf8', stdio: 'pipe' }); buildOk = true; } catch { /* czerwony */ }
  if (!buildOk) gate.push('build przed wdrożeniem nie jest zielony');
  if (gate.length) return { ok: false, stage: 'brama-recovery', problems: gate };
  say('✓ brama recovery: 9/9 (sha256 archiwum · 179 linii · freeze 179 + tail · sha256 snapshotu · snapshot recovered/32 · Record incydentu · DOKŁADNIE 1 zdarzenie recovery w jednej linii JSONL · spójny hash-chain · zielony build)');
  done.push('brama-recovery'); trip('brama-recovery');

  /* ── 2. MANIFEST: hash każdego pliku PORÓWNANY z podpisanym, zapis TEGO SAMEGO bufora ──
     Wcześniej manifest był kopiowany bez porównania z podpisem — próba audytu zmieniła ROUTER.md
     po podpisaniu i wdrożenie zainstalowało niezatwierdzony plik. */
  const art = A.verifyArtifacts(bundle.approval.package.artifact_hashes, rel => path.join(HERE, rel));
  if (!art.ok) return { ok: false, stage: 'manifest', problems: art.problems };
  const manifestSrc = new Set(MANIFEST.map(([s]) => s));
  const signedSrc = new Set(art.buffers.keys());
  const missing = [...manifestSrc].filter(s => !signedSrc.has(s));
  const extra = [...signedSrc].filter(s => !manifestSrc.has(s) && !s.startsWith('deploy.js') && !s.startsWith('recover'));
  if (missing.length) return { ok: false, stage: 'manifest', problems: [`pliki manifestu bez podpisanego hasha: ${missing.join(', ')}`] };
  for (const [src, dst] of MANIFEST) txn.write(R(dst), art.buffers.get(src));   /* TEN SAM bufor */
  say(`✓ manifest: ${MANIFEST.length} plików — każdy zweryfikowany hashem z podpisu i zapisany z tego samego bufora`
    + (extra.length ? ` (+${extra.length} podpisanych plików kontrolnych: ${extra.join(', ')})` : ''));
  done.push('manifest'); trip('manifest');

  /* ── 3. SKILLE (kopia platformowa generowana; snapshot PRZED uruchomieniem) ── */
  const agentsDir = R('.agents/skills');
  /* KLUCZOWE: snapshot PRZED sync, i to WSZYSTKICH docelowych ścieżek — także tych, które jeszcze
     nie istnieją (snapshot zapisuje wtedy null, więc rollback je skasuje). Snapshot po zapisie
     utrwaliłby stan POzmianowy i rollback nic by nie cofnął. */
  const skillNames = new Set(fs.readdirSync(R('.claude/skills')));
  if (fs.existsSync(agentsDir)) for (const n of fs.readdirSync(agentsDir)) skillNames.add(n);
  txn.expectDir(agentsDir);
  for (const n of skillNames) {
    txn.snapshot(path.join(R('.claude/skills'), n, 'SKILL.md'));
    txn.snapshot(path.join(agentsDir, n, 'SKILL.md'));
    txn.expectDir(path.join(agentsDir, n));      /* katalog tworzy sync-skills, nie Txn */
    txn.expectDir(path.join(R('.claude/skills'), n));
  }
  try { execFileSync('node', [path.join(G, 'sync-skills.js')], { encoding: 'utf8', stdio: 'pipe' }); }
  catch (e) { return { ok: false, stage: 'skille', problems: [String(e.stdout || e.message).slice(0, 200)] }; }
  try { execFileSync('node', [path.join(G, 'sync-skills.js'), '--check'], { encoding: 'utf8', stdio: 'pipe' }); }
  catch (e) { return { ok: false, stage: 'skille', problems: ['sync-skills --check: rozjazd'] }; }
  say('✓ skille: kanon i kopia platformowa spójne');
  done.push('skille'); trip('skille');

  /* ── 4. OBIEKTY (object.created) ── */
  const created = [];
  for (const o of bundle.objects) {
    if (o.op !== 'object.create') return { ok: false, stage: 'obiekty', problems: [`nieobsługiwana operacja ${o.op}`] };
    const rel = cardPath(o.type, o.id);
    if (fs.existsSync(R(rel))) return { ok: false, stage: 'obiekty', problems: [`${o.id} już istnieje`] };
    const fm = { ...o }; delete fm.op; delete fm.body; delete fm.actor; delete fm.ingest_note;
    fm.created = today; fm.updated = today; fm.version = 1;
    txn.write(R(rel), renderCard(fm, o.body || ''));
    created.push({ id: o.id, type: o.type, rel, note: o.ingest_note || `Utworzono ${o.type} ${o.id}.` });
  }
  say(`✓ obiekty: ${created.length} kart (${created.map(c => c.id).join(', ')})`);
  done.push('obiekty'); trip('obiekty');

  /* ── 5. EVIDENCE przez WSPÓLNY writer (lib/evidence-writer.js — ta sama funkcja co ingest.js) ──
     Wcześniej deploy miał własną, uproszczoną kopię: bez deduplikacji po fingerprint
     i independence_key, bez independent_sources. Dwie semantyki zapisu tego samego obiektu. */
  const evEvents = [];
  const byMech = new Map();
  for (const e of (bundle.evidence || [])) {
    const v = EW.validateEvidenceInput(e);
    if (!v.ok) return { ok: false, stage: 'evidence', problems: v.errors };
    if (!byMech.has(v.target)) byMech.set(v.target, []);
    byMech.get(v.target).push(e);
  }
  for (const [mechId, list] of byMech) {
    const rel = cardPath('mechanism', mechId);
    if (!fs.existsSync(R(rel))) return { ok: false, stage: 'evidence', problems: [`Evidence wskazuje nieistniejący mechanizm ${mechId}`] };
    let { fm, body } = parseCard(txn.read(R(rel)).toString('utf8'));
    for (const e of list) {
      const r = EW.applyEvidence(fm, e, { today, actor: bundle.approval.approved_by });
      if (r.status === 'error') return { ok: false, stage: 'evidence', problems: r.errors };
      if (r.status === 'skipped') return { ok: false, stage: 'evidence', problems: [`Evidence ${r.id}: ${r.reason} — pakiet wdrożeniowy nie może zawierać duplikatów`] };
      fm = r.fm; evEvents.push(r.event);
    }
    const c = EW.confidenceFromEvidence(fm.evidence);
    if (c.qualifiesValidated) return { ok: false, stage: 'evidence', problems: ['przeliczenie kwalifikuje do validated — awans wymaga osobnej decyzji, nie wdrożenia'] };
    fm.confidence = { ...fm.confidence, value: c.value, recommendation: 'test-first' };
    fm.status = c.value;
    txn.write(R(rel), renderCard(fm, body));
    say(`✓ evidence: ${list.length} wpisów → ${mechId} · confidence ${c.value} · v${fm.version}`
      + ` · n=${fm.confidence.evidence_strength.n} projects=${fm.confidence.evidence_strength.projects}`
      + ` independent_sources=${fm.confidence.evidence_strength.independent_sources}`
      + ` kierunki ${JSON.stringify(fm.confidence.evidence_strength.directions)}`);
  }
  done.push('evidence'); trip('evidence');

  /* ── 6. LEDGER + NONCE (object.created PRZED evidence.added) ── */
  const nres = txn.consumeNonce({ nonce: bundle.approval.package.nonce, fingerprint: rev.fingerprint || null,
    approved_by: bundle.approval.approved_by, consumed_at: new Date().toISOString(), phase: bundle.approval.package.phase, kind: 'deploy' });
  if (!nres.ok) return { ok: false, stage: 'ledger', problems: [nres.why] };
  const events = [
    ...created.map(c => ({ kind: 'object.created', on: c.id, actor: bundle.approval.approved_by, provenance: 'record', version_to: 1, note: c.note })),
    ...evEvents,
    ...(bundle.events || []),
  ];
  const emitted = txn.appendEvents(events);
  const iCre = emitted.findIndex(e => e.kind === 'object.created');
  const iEv = emitted.findIndex(e => e.kind === 'evidence.added');
  if (iEv >= 0 && iCre >= 0 && iEv < iCre) return { ok: false, stage: 'ledger', problems: ['evidence.added przed object.created'] };
  say(`✓ ledger: +${emitted.length} zdarzeń (${emitted.filter(e => e.kind === 'object.created').length}× object.created → ${emitted.filter(e => e.kind === 'evidence.added').length}× evidence.added) · nonce zużyty`);
  done.push('ledger'); trip('ledger');

  /* ── 7. BUILD ── */
  let out = '';
  try { out = execFileSync('node', [path.join(G, 'build.js'), '--check'], { env: { ...process.env, GENOME_DIR: G }, encoding: 'utf8', stdio: 'pipe' }); }
  catch (e) { return { ok: false, stage: 'build', problems: [((e.stdout || '') + (e.stderr || '')).split('\n').filter(l => l.startsWith('✗')).slice(0, 3).join(' | ') || e.message] }; }
  const stat = (out.match(/\d+ obiektów · \d+ zdarzeń · \d+ błędów · \d+ ostrzeżeń/) || [''])[0];
  say(`✓ build: ${stat}`);
  done.push('build'); trip('build');

  /* ── 8. VIEWER / dist ── */
  for (const rel of ['dist/graph.json', 'dist/genome-data.js', 'dist/INDEX.md', 'dist/METRICS.md']) txn.snapshot(path.join(G, rel));
  const viewer = path.join(REPO, 'genome-os', 'js', 'genome-f0-data.js');
  if (fs.existsSync(path.dirname(viewer))) txn.snapshot(viewer);
  try { execFileSync('node', [path.join(G, 'build.js')], { env: { ...process.env, GENOME_DIR: G }, encoding: 'utf8', stdio: 'pipe' }); }
  catch (e) { return { ok: false, stage: 'viewer', problems: ['emisja dist/viewer nieudana: ' + String(e.message).slice(0, 150)] }; }
  const g = JSON.parse(fs.readFileSync(path.join(G, 'dist', 'graph.json'), 'utf8'));
  const wf = g.nodes.filter(n => String(n.id).startsWith('wf:')).map(n => n.id).sort();
  const badEdge = g.edges.find(e => e.source === 'wf:plate' && e.target === 'wf:salt' && e.relation === 'requires');
  const pm = g.project_mechanism.filter(x => x.target === 'mech:strategy-before-execution');
  if (badEdge) return { ok: false, stage: 'viewer', problems: ['w grafie pojawiła się fałszywa krawędź requires → wf:salt'] };
  say(`✓ viewer/dist: workflow ${wf.join(', ')} · Project→Mechanism ${pm.map(x => x.source.replace('proj:', '') + ':' + x.relation).join(', ')}`);
  done.push('viewer'); trip('viewer');

  return { ok: true, steps: done, build: stat, events: emitted.length };
});

hr();
if (result.ok) { say('✓ WDROŻENIE WYKONANE'); say(`  kroki: ${result.steps.join(' → ')}`); say(`  ${result.build}`); }
else {
  say(`✗ WDROŻENIE PRZERWANE${result.stage ? ` na kroku "${result.stage}"` : ''}${result.error ? `: ${result.error}` : ''}`);
  for (const p of (result.problems || [])) say('   • ' + p);
  if (result.rolled_back) say(`↩ ROLLBACK: przywrócono ${result.restored.length} pozycji`);
}
hr();
if (canonBefore) {
  const after = treeHash(CANON);
  say(`hash drzewa kanonu PO:    ${after.slice(0, 32)}…`);
  if (!APPLY) say(canonBefore === after ? '✓ KANON BAJTOWO NIETKNIĘTY' : '✗ KANON ZMIENIONY PRZEZ DRY-RUN — błąd krytyczny');
}
cleanup();
process.exit(result.ok ? 0 : 1);
