#!/usr/bin/env node
/* ═══ RECOVERY INCYDENTU 2026-08-09 — jeden wykonawca transakcyjny ═══
 *
 *   node recover.js --dry-run [--target <kopia>]   plan + weryfikacja, zero zapisu
 *   node recover.js --apply                        wykonanie; wymaga podpisanego pakietu Ed25519
 *   node recover.js --fail-after <krok>            wymuszona awaria po kroku (testy rollbacku)
 *
 * Zastępuje `recover.sh`, który NIE BYŁ transakcyjny: kopiował archiwum i snapshot przed wzięciem
 * blokady i nie cofał ich, gdy dalszy krok padł. Tutaj wszystko dzieje się pod jedną blokadą,
 * a każdy błąd cofa bajtowo pliki, Ledger, rejestr nonce i artefakty.
 *
 * NIE wywołuje kanonicznego `ingest.js` — recovery poprzedza instalację nowego writera (bootstrap).
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const HERE = __dirname;
const LIB = path.resolve(HERE, '..', 'final-salt-plate', 'lib');
const A = require(path.join(LIB, 'approval.js'));
const { runTransaction, treeHash, sha256 } = require(path.join(LIB, 'genome-txn.js'));

/* ── PRECONDITIONS: dokładne hashe stanu uszkodzonego i materiału do przywrócenia ── */
const PRE = {
  damaged_archive: '61d3c8475ca88276a7a4c96f2ed5a15d5e26d32638eba1e456b260a33c84b15a',
  damaged_snapshot: 'eb660c38c84e4561a23d8b5b94621a43d5419bdbf4d85e2992ff8b2b05652a5b',
  damaged_freeze: 'b0c82c64ce3aa6a72b9b9edb75ac41d955cb894315486db75d9a6bf95ccf8cba',
  restore_archive: '4806dd3da1a8b4d3c54fa60d3b93e8785fb8f17c587e6973b55ab3f5295281c3',
  /* audyt rundy 5: sam kształt (recovered:true + 32 rekordy) NIE wystarcza — próba podmieniła
     zawartość snapshotu bez naruszenia kształtu i recovery ją przyjęło. */
  restore_snapshot: '3ae31e669984fc8746a7498ff770cdc0d382ff615a69e7d495d1053fcb146a91',
  seed_line: 179,
  seed_tail_hash: '4f96034058f4c5fa',
  incident_events: ['evt:2026-08-09-0226', 'evt:2026-08-09-0227'],
};
const REL = {
  archive: 'ledger/.archive/events-2026-08.pre-mig-2026-08-evidence-contract-v1.jsonl',
  snapshot: 'records/.snapshots/mig-2026-08-evidence-contract-v1-records.json',
  freeze: 'records/F0-SEED-FREEZE.md',
  ledger: 'ledger/events-2026-08.jsonl',
  incidentDir: 'records/incydenty/2026-08-09-artefakty',
  incidentRecord: 'records/incydenty/2026-08-09-test-zapisal-do-kanonu.md',
};
/* ═══ RECOVERY_MANIFEST — pełne domknięcie runtime ═══ (audyt rundy 9)
 * Podpis obejmował wcześniej tylko `recover.js`, archiwum i snapshot. Zmiana którejkolwiek
 * biblioteki wykonującej autoryzację, blokadę, transakcję albo rollback po podpisaniu pakietu
 * była NIEWYKRYWALNA. Manifest wymienia teraz KAŻDY lokalny moduł ładowany podczas recovery
 * plus oba artefakty danych; kontrola idzie przed pierwszym zapisem. */
const RECOVERY_MANIFEST = [
  'recover.js',
  '../final-salt-plate/lib/approval.js',
  '../final-salt-plate/lib/genome-txn.js',
  '../final-salt-plate/lib/genome-common.js',
  '../final-salt-plate/lib/canon-guard.js',
  'przywracane/events-2026-08.pre-mig-2026-08-evidence-contract-v1.jsonl',
  'przywracane/mig-2026-08-evidence-contract-v1-records.json',
];

const STEPS = ['preconditions', 'artefakty', 'archiwum', 'snapshot', 'freeze', 'record', 'ledger', 'build'];

const argv = process.argv.slice(2);
const has = f => argv.includes(f);
const val = f => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
const APPLY = has('--apply');
const FAIL_AFTER = val('--fail-after');
const KILL_AFTER = val('--kill-after');

const BUNDLE_PATH = val('--bundle') || path.join(HERE, 'recovery-bundle.json');

if (FAIL_AFTER && !STEPS.includes(FAIL_AFTER)) { console.error(`✗ --fail-after: nieznany krok "${FAIL_AFTER}" (${STEPS.join('|')})`); process.exit(2); }

/* ── cel ── */
const CANON = path.resolve(HERE, '..', '..');
let TARGET = val('--target');
let tmpDir = null;
if (!TARGET) {
  if (APPLY) TARGET = CANON;
  else { tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'genome-recover-')); TARGET = path.join(tmpDir, 'genome'); execFileSync('cp', ['-R', CANON, TARGET]); fs.rmSync(path.join(TARGET, 'proposals'), { recursive: true, force: true }); fs.rmSync(path.join(TARGET, 'dist'), { recursive: true, force: true }); }
}
const cleanup = () => { if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true }); };

/* ── GUARD KANONU: żaden REALNY cel zapisu nie może dotykać kanonu, gdy podano --target.
 * Zamyka dwa obejścia z audytu: podmieniony TMPDIR (bo nie pytamy o „piaskownicę", tylko
 * o dotknięcie kanonu) i symlink r352-os/genome → kanon (bo sprawdzamy realpath KAŻDEGO celu). */
const CANON_GUARD = require(path.join(LIB, 'canon-guard.js'));
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
  const TGTS = [TARGET, path.join(TARGET, 'ledger'), path.join(TARGET, 'records')];
  /* 1) żaden cel nie może dotykać kanonu (gdy wykonawca jest zainstalowany w Genome) */
  const chk = CANON_GUARD.checkTargetsAgainstCanon(TGTS, CANON_GUARD.canonRootsFor(CANON));
  if (!chk.ok) { console.log('✗ ' + CANON_GUARD.canonGuardError(chk.hits)); cleanup(); process.exit(3); }
  /* 2) żadna REALNA ścieżka zapisu nie może wyjść poza zadeklarowany --target (łapie symlinki) */
  const esc = CANON_GUARD.checkTargetsEscapeRoot(TGTS, TARGET);
  if (!esc.ok) { console.log('✗ ' + CANON_GUARD.escapeGuardError(esc.hits)); cleanup(); process.exit(3); }
}

const say = (...a) => console.log(...a);
const hr = () => say('─'.repeat(72));

say('═══ RECOVERY INCYDENTU 2026-08-09 ═══');
say(`tryb:   ${APPLY ? 'APPLY (kanon)' : 'DRY-RUN (kopia)'}${FAIL_AFTER ? `  · WYMUSZONA AWARIA PO: ${FAIL_AFTER}` : ''}`);
say(`cel:    ${TARGET}`);
/* Hash kanonu liczymy TYLKO wtedy, gdy działamy na własnym korzeniu. Przy --target skrypt
   bywa uruchamiany z kopii, której „..\.." nie jest Genome (np. katalog tymczasowy testów). */
const EXPLICIT_TARGET = EXPLICIT_TARGET_GUARD;
const canonBefore = EXPLICIT_TARGET ? null : treeHash(CANON);
if (canonBefore) say(`hash drzewa kanonu PRZED: ${canonBefore.slice(0, 32)}…`);
hr();

/* ── 1. ZGODA: weryfikacja PRZED wejściem w transakcję ── */
let bundle;
try { bundle = JSON.parse(fs.readFileSync(BUNDLE_PATH, 'utf8')); }
catch (e) { say('✗ nie można wczytać pakietu: ' + e.message); cleanup(); process.exit(2); }

const payload = { events: bundle.events || [], evidence: bundle.evidence || [], objects: bundle.objects || [] };
/* ZERO override zaufania. Klucz publiczny pochodzi wyłącznie z kotwicy wyprowadzonej z bazy
 * użytkowników (lib/approval.js). Nie ma flagi, zmiennej ani ścieżki, którą wywołujący mógłby
 * podstawić własne zaufanie — usunięta flaga była omijalna przez TMPDIR i przez symlinki. */
const rev = A.verifyApproval(bundle.approval, payload, { requireArtifacts: true });
say(`ZGODA: ${rev.state} — ${rev.why}`);
if (rev.state === 'verified') say(`  klucz publiczny: ${rev.key_source}`);
if (APPLY && rev.state !== 'verified') {
  say('');
  say('✗ --apply ODRZUCONE: pakiet recovery nie ma ważnego podpisu Ed25519.');
  say(`  Podpisuje właściciel kluczem prywatnym ${A.PRIVKEY_HINT}; writer ma wyłącznie klucz publiczny.`);
  say('  Nie ma żadnego override — ani zmiennej środowiskowej, ani opcji, ani zależności od TMPDIR.');
  cleanup(); process.exit(3);
}

/* Artefakty recovery — wykonawca i materiał do przywrócenia — muszą zgadzać się z podpisem.
   Weryfikacja PRZED transakcją; pod blokadą hashe liczone są jeszcze raz z buforów. */
const signedArt = (bundle.approval.package || {}).artifact_hashes || {};
/* 1) manifest musi być POKRYTY podpisem — brak choćby jednego elementu zatrzymuje recovery */
const missingFromSig = RECOVERY_MANIFEST.filter(f => !(f in signedArt));
/* 2) podpis nie może zawierać elementów spoza manifestu (cichy dodatek to też zmiana runtime) */
const extraInSig = Object.keys(signedArt).filter(f => !RECOVERY_MANIFEST.includes(f));
const artR = A.verifyArtifacts(signedArt, rel => path.join(HERE, rel));
say(`ARTEFAKTY: ${artR.ok && !missingFromSig.length && !extraInSig.length ? `${artR.buffers.size}/${RECOVERY_MANIFEST.length} plików runtime zgodnych z podpisem` : 'NIEZGODNE'}`);
for (const f of missingFromSig) say(`   • ${f}: BRAK w artifact_hashes — podpis nie obejmuje tego elementu runtime`);
for (const f of extraInSig) say(`   • ${f}: element spoza RECOVERY_MANIFEST`);
for (const p2 of artR.problems) say('   • ' + p2);

/* 3) samokontrola domknięcia: każdy LOKALNY moduł faktycznie załadowany musi być w manifeście */
{
  const loaded = Object.keys(require.cache)
    .filter(f => f.endsWith('.js') && !f.includes('node_modules'))
    .filter(f => f !== __filename)
    .map(f => path.relative(HERE, f))
    .filter(f => !f.startsWith('..' + path.sep + '..'));
  const uncovered = loaded.filter(f => !RECOVERY_MANIFEST.includes(f));
  if (uncovered.length) {
    say('✗ DOMKNIĘCIE RUNTIME NIEPEŁNE — te moduły są ładowane, ale nie ma ich w RECOVERY_MANIFEST:');
    for (const f of uncovered) say('   • ' + f);
    cleanup(); process.exit(3);
  }
}
const artOk = artR.ok && !missingFromSig.length && !extraInSig.length;
if (APPLY && !artOk) { say('\n✗ --apply ODRZUCONE: runtime recovery różni się od podpisanego (kod autoryzacji, blokady, transakcji, rollbacku albo materiał).'); cleanup(); process.exit(3); }

hr();

/* ── 2. TRANSAKCJA ── */
const result = runTransaction(TARGET, (txn) => {
  const trip = (step) => {
    if (KILL_AFTER === step) process.kill(process.pid, 'SIGKILL');   /* zabija BEZ rollbacku */
    if (FAIL_AFTER === step) throw new Error(`WYMUSZONA AWARIA PO KROKU "${step}" (--fail-after)`);
  };
  const done = [];

  /* 2.1 preconditions — POD BLOKADĄ */
  const problems = [];
  const shaOf = rel => txn.sha(rel);
  if (shaOf(REL.archive) !== PRE.damaged_archive) problems.push(`archiwum: ${shaOf(REL.archive)} ≠ oczekiwane uszkodzone ${PRE.damaged_archive}`);
  if (shaOf(REL.snapshot) !== PRE.damaged_snapshot) problems.push(`snapshot: ${shaOf(REL.snapshot)} ≠ oczekiwane uszkodzone ${PRE.damaged_snapshot}`);
  if (shaOf(REL.freeze) !== PRE.damaged_freeze) problems.push(`karta freeze: ${shaOf(REL.freeze)} ≠ oczekiwane uszkodzone ${PRE.damaged_freeze}`);
  /* ODCZYT RAZ, POD BLOKADĄ — hash liczony z TEGO SAMEGO bufora, który potem trafi na dysk */
  const restoreSrc = path.join(HERE, 'przywracane', path.basename(REL.archive));
  const snapSrc = path.join(HERE, 'przywracane', path.basename(REL.snapshot));
  let archiveBuf = null, snapshotBuf = null;
  try { archiveBuf = fs.readFileSync(restoreSrc); } catch { problems.push(`brak materiału: ${restoreSrc}`); }
  try { snapshotBuf = fs.readFileSync(snapSrc); } catch { problems.push(`brak materiału: ${snapSrc}`); }
  const restoreSha = archiveBuf ? sha256(archiveBuf) : null;
  const snapSha = snapshotBuf ? sha256(snapshotBuf) : null;
  if (restoreSha !== PRE.restore_archive) problems.push(`archiwum do przywrócenia: ${restoreSha} ≠ ${PRE.restore_archive}`);
  if (snapSha !== PRE.restore_snapshot) problems.push(`snapshot do przywrócenia: ${snapSha} ≠ ${PRE.restore_snapshot}`);
  const ledLines = (txn.read(REL.ledger) || Buffer.from('')).toString('utf8').split('\n').filter(Boolean);
  for (const id of PRE.incident_events) if (!ledLines.some(l => l.includes(`"${id}"`))) problems.push(`brak zdarzenia incydentu ${id}`);
  const tail = ledLines[PRE.seed_line - 1] ? crypto.createHash('sha256').update(ledLines[PRE.seed_line - 1]).digest('hex').slice(0, 16) : null;
  if (tail !== PRE.seed_tail_hash) problems.push(`hash linii ${PRE.seed_line}: ${tail} ≠ ${PRE.seed_tail_hash}`);
  if (problems.length) return { ok: false, stage: 'preconditions', problems };
  say('✓ preconditions: 7/7 (3 hashe uszkodzonych artefaktów · 2 hashe materiału do przywrócenia · oba zdarzenia incydentu · tail linii 179)');
  done.push('preconditions'); trip('preconditions');

  /* 2.2 zachowanie uszkodzonych artefaktów w kanonicznym katalogu incydentu */
  const stamp = { archive: shaOf(REL.archive), snapshot: shaOf(REL.snapshot), freeze: shaOf(REL.freeze) };
  txn.write(`${REL.incidentDir}/USZKODZONE-archiwum-ledgera.jsonl`, txn.read(REL.archive));
  txn.write(`${REL.incidentDir}/USZKODZONY-snapshot-recordow.json`, txn.read(REL.snapshot));
  txn.write(`${REL.incidentDir}/USZKODZONA-karta-freeze.md.txt`, txn.read(REL.freeze));
  txn.write(`${REL.incidentDir}/HASHE.json`, JSON.stringify({ zachowano: new Date().toISOString(), uszkodzone: stamp, przywracane_archiwum: PRE.restore_archive }, null, 1));
  say(`✓ artefakty incydentu zachowane w ${REL.incidentDir}/ (4 pliki + hashe)`);
  done.push('artefakty'); trip('artefakty');

  /* 2.3 archiwum — zapis ZWERYFIKOWANEGO bufora, bez drugiego odczytu (TOCTOU) */
  txn.write(REL.archive, archiveBuf);
  say(`✓ archiwum przywrócone: 179 linii · sha256 ${PRE.restore_archive.slice(0, 16)}…`);
  done.push('archiwum'); trip('archiwum');

  /* 2.4 snapshot — hash już zweryfikowany w preconditions; kształt sprawdzamy dodatkowo */
  const snap = JSON.parse(snapshotBuf.toString('utf8'));
  if (snap.recovered !== true || snap.records.length !== 32) return { ok: false, stage: 'snapshot', problems: [`snapshot: recovered=${snap.recovered}, records=${snap.records.length} (oczekiwane true/32)`] };
  txn.write(REL.snapshot, snapshotBuf);
  say(`✓ snapshot odtworzony: 32 Recordy · recovered: true · sha256 ${PRE.restore_snapshot.slice(0, 16)}… zgodny`);
  done.push('snapshot'); trip('snapshot');

  /* 2.5 karta freeze */
  const freezeRaw = txn.read(REL.freeze).toString('utf8');
  const freezeNew = freezeRaw
    .replace(/^seed_event_count: \d+/m, `seed_event_count: ${PRE.seed_line}`)
    .replace(/^seed_tail_hash: "[^"]*"/m, `seed_tail_hash: "${PRE.seed_tail_hash}"`)
    .replace(/^updated: "[^"]*"/m, `updated: "${new Date().toISOString().slice(0, 10)}"`)
    .replace(/^version: (\d+)/m, (_, v) => `version: ${Number(v) + 1}`);
  if (freezeNew === freezeRaw) return { ok: false, stage: 'freeze', problems: ['karta freeze nie zmieniła się — wzorce nie trafiły'] };
  txn.write(REL.freeze, freezeNew);
  say(`✓ granica seeda: ${PRE.seed_line} / ${PRE.seed_tail_hash}`);
  done.push('freeze'); trip('freeze');

  /* 2.6 Record incydentu */
  const rec = bundle.objects.find(o => o.type === 'record' && String(o.id).startsWith('rec:incydenty/'));
  if (!rec) return { ok: false, stage: 'record', problems: ['pakiet nie zawiera Recordu incydentu'] };
  const d = new Date().toISOString().slice(0, 10);
  const fm = { ...rec }; delete fm.op; delete fm.body; delete fm.actor; delete fm.ingest_note;
  fm.created = d; fm.updated = d; fm.version = 1;
  const card = '---\n' + Object.entries(fm).map(([k, v]) => `${k}: ${typeof v === 'string' ? JSON.stringify(v) : JSON.stringify(v)}`).join('\n') + '\n---\n' + (rec.body || '');
  txn.write(REL.incidentRecord, card);
  say(`✓ Record incydentu: ${rec.id}`);
  done.push('record'); trip('record');

  /* 2.7 Ledger + nonce (atomowo, pod tą samą blokadą) */
  const nres = txn.consumeNonce({ nonce: bundle.approval.package.nonce, fingerprint: rev.fingerprint || null, approved_by: bundle.approval.approved_by, consumed_at: new Date().toISOString(), phase: bundle.approval.package.phase, kind: 'recovery' });
  if (!nres.ok) return { ok: false, stage: 'nonce', problems: [nres.why] };
  const evs = txn.appendEvents([
    { kind: 'object.created', on: rec.id, actor: bundle.approval.approved_by, provenance: 'record', version_to: 1, note: `Record incydentu 2026-08-09 (recovery).` },
    ...(bundle.events || []).map(e => ({ ...e })),
  ]);
  say(`✓ Ledger: +${evs.length} zdarzeń (${evs.map(e => e.id).join(', ')}) · nonce zużyty`);
  done.push('ledger'); trip('ledger');

  /* 2.8 build */
  let out = '';
  try { out = execFileSync('node', [path.join(TARGET, 'build.js'), '--check'], { env: { ...process.env, GENOME_DIR: TARGET }, encoding: 'utf8', stdio: 'pipe' }); }
  catch (e) { return { ok: false, stage: 'build', problems: [((e.stdout || '') + (e.stderr || '')).split('\n').filter(l => l.startsWith('✗')).slice(0, 3).join(' | ') || e.message] }; }
  const stat = (out.match(/\d+ obiektów · \d+ zdarzeń · \d+ błędów · \d+ ostrzeżeń/) || [''])[0];
  say(`✓ build: ${stat}`);
  done.push('build'); trip('build');

  return { ok: true, steps: done, build: stat, events: evs.map(e => e.id) };
});

hr();
if (result.ok) {
  say('✓ RECOVERY WYKONANE');
  say(`  kroki: ${result.steps.join(' → ')}`);
  say(`  ${result.build}`);
} else {
  say(`✗ RECOVERY PRZERWANE${result.stage ? ` na kroku "${result.stage}"` : ''}${result.error ? `: ${result.error}` : ''}`);
  for (const p of (result.problems || [])) say('   • ' + p);
  if (result.rolled_back) say(`↩ ROLLBACK: przywrócono ${result.restored.length} pozycji`);
  else if (result.error) say('   ' + result.error);
}
hr();
if (canonBefore) {
  const canonAfter = treeHash(CANON);
  say(`hash drzewa kanonu PO:    ${canonAfter.slice(0, 32)}…`);
  if (!APPLY) say(canonBefore === canonAfter ? '✓ KANON BAJTOWO NIETKNIĘTY' : '✗ KANON ZMIENIONY PRZEZ DRY-RUN — błąd krytyczny');
}
cleanup();
process.exit(result.ok ? 0 : 1);
