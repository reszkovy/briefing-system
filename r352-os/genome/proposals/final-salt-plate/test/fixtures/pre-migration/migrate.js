#!/usr/bin/env node
/* ═══ GENOME MIGRATION — JEDNA produkcyjna ścieżka ═══
 * Ten sam kod obsługuje: dry-run, symulację na kopii i zatwierdzony commit.
 * Nie istnieje żadna druga implementacja migracji.
 *
 *   node migrate.js --dry-run [--plan <plik>]     plan + pełny diff, zero zapisu
 *   node migrate.js --simulate [--keep]           kopia realnego Genome → ta sama funkcja → build --check
 *   node migrate.js --apply --approval <plik>     commit; wymaga artefaktu zgody z hashem planu
 *
 * ZASADY (wymuszone maszynowo, nie dyscypliną):
 *  • ID zmieniają WYŁĄCZNIE zdarzenia wadliwe (duplikaty). Nowe ID = powyżej maksimum danego dnia,
 *    nigdy przez inkrementację od zajętego numeru → zero efektu domina, zero ruszania poprawnych.
 *  • ZERO przestawiania kolejności. Naruszenia chronologii w seedzie F0 są znanym defektem
 *    objętym kartą freeze (ostrzeżenie), nie powodem do przepisywania historii.
 *  • Oryginalny Ledger zachowany jako artefakt z sha256 przed jakąkolwiek zmianą.
 *  • Jedna transakcja: karta freeze + Recordy + mechanizmy + Ledger. Błąd na dowolnym etapie
 *    lub czerwony build --check → rollback bajtowy WSZYSTKIEGO.
 *  • direction NIE jest nadawany. Brak decyzji = brak pola (żadnego "unclassified").
 *  • --approved-by to za mało: commit wymaga pliku zgody z hashem planu, którego agent nie generuje.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const { withGenomeWriteLock, independenceKey, evidenceStrength, sha256, sha16 } = require('./lib/genome-common.js');
const CANONICAL_ROOT = fs.realpathSync(__dirname);
const MIGRATION_ID = 'mig:2026-08-evidence-contract-v1';

/* ─────────────────────────── odczyt ─────────────────────────── */
function readCards(root) {
  const out = [];
  const walk = d => { if (!fs.existsSync(d)) return; for (const f of fs.readdirSync(d).sort()) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith('.md') && f !== 'INDEX.md') out.push(p); } };
  for (const dir of ['mechanisms', 'projects', 'records', 'rules', 'decisions', 'experiments', 'clients', 'principles', 'axioms', 'guards', 'benchmarks', 'capabilities', 'agents', 'components', 'signals', 'sops', 'workflows'])
    walk(path.join(root, dir));
  return out.map(file => {
    const raw = fs.readFileSync(file, 'utf8');
    const end = raw.indexOf('\n---', 4);
    const fm = {};
    for (const line of raw.slice(4, end).split('\n')) {
      if (!line.trim()) continue;
      const i = line.indexOf(': '); if (i < 0) continue;
      try { fm[line.slice(0, i)] = JSON.parse(line.slice(i + 2)); } catch { fm[line.slice(0, i)] = line.slice(i + 2); }
    }
    return { file, fm, body: raw.slice(end + 4), raw };
  });
}
const renderCard = (fm, body) => {
  const order = ['id', 'type', 'title', 'status', 'created', 'updated', 'version', 'owner'];
  const keys = [...order.filter(k => k in fm), ...Object.keys(fm).filter(k => !order.includes(k))];
  return '---\n' + keys.map(k => `${k}: ${JSON.stringify(fm[k])}`).join('\n') + '\n---\n' + body;
};

/* Hash planu — JEDNA definicja. Wyklucza materializację Ledgera (new_lines) oraz samo pole
   plan_hash, żeby hash nie liczył się z własnej poprzedniej wartości (samoreferencja). */
function planHash(plan) {
  const { new_lines, ...ledgerRest } = plan.ledger || {};
  const { plan_hash, ...rest } = plan;
  return sha256(JSON.stringify({ ...rest, ledger: ledgerRest }));
}

/* ─────────────────────── PLAN (czysta funkcja) ─────────────────────── */
function buildPlan(root) {
  const cards = readCards(root);
  const projectIds = new Set(cards.filter(c => c.fm.type === 'project').map(c => c.fm.id));
  const ledgerFile = path.join(root, 'ledger', 'events-2026-08.jsonl');
  const ledgerRaw = fs.readFileSync(ledgerFile, 'utf8');
  const lines = ledgerRaw.split('\n').filter(Boolean);
  const evs = lines.map((raw, i) => ({ line: i + 1, raw, e: JSON.parse(raw) }));

  /* ── A. Ledger: wyłącznie duplikaty ID. Zero przestawiania, zero zmian ts. ── */
  const seen = new Map(), idRenames = [], usedIds = new Set(evs.map(x => x.e.id));
  const maxPerDay = {};
  for (const { e } of evs) { const d = e.id.slice(4, 14), n = parseInt(e.id.slice(-4), 10); maxPerDay[d] = Math.max(maxPerDay[d] || 0, n); }
  for (const { line, e } of evs) {
    if (!seen.has(e.id)) { seen.set(e.id, line); continue; }
    const day = e.id.slice(4, 14);
    let n = maxPerDay[day];
    let cand; do { n++; cand = `evt:${day}-${String(n).padStart(4, '0')}`; } while (usedIds.has(cand));
    maxPerDay[day] = n; usedIds.add(cand);
    idRenames.push({ line, from: e.id, to: cand, kind: e.kind, on: e.on, ts: e.ts, first_occurrence_line: seen.get(e.id) });
  }
  const firstChangedLine = idRenames.length ? Math.min(...idRenames.map(r => r.line)) : null;

  /* nowy Ledger: te same zdarzenia, ta sama kolejność; zmiana wyłącznie w polu id wadliwych */
  const renameByLine = new Map(idRenames.map(r => [r.line, r.to]));
  let prevHash = 'genesis';
  const newLines = evs.map(({ line, e }) => {
    const fixed = { ...e };
    if (renameByLine.has(line)) { fixed.corrected_from_id = e.id; fixed.corrected_by = MIGRATION_ID; fixed.id = renameByLine.get(line); }
    fixed.prev_hash = prevHash;
    const s = JSON.stringify(fixed);
    prevHash = sha16(s);
    return s;
  });
  const rehashedFrom = firstChangedLine;
  const rehashedCount = firstChangedLine ? evs.length - firstChangedLine + 1 : 0;

  /* chronologia: raportowana, NIE naprawiana (objęta kartą freeze) */
  const chrono = [];
  let prevTs = '';
  for (const { line, e } of evs) {
    if (prevTs && e.ts && Date.parse(e.ts) < Date.parse(prevTs)) chrono.push({ line, id: e.id, ts: e.ts, prev: prevTs });
    if (e.ts) prevTs = e.ts;
  }

  /* ── B. granica seeda F0 ── */
  const REQ = {
    'prediction.resolved': ['prediction_id', 'result', 'cause', 'resolution_source'],
    'confidence.changed': ['from', 'to', 'cause', 'supporting_evidence'],
    'knowledge.corrected': ['from', 'to', 'cause'],
    'knowledge.reclassified': ['from', 'to', 'cause'],
    'prediction.registered': ['prediction_id', 'p', 'claim', 'deadline', 'criterion'],
    'project.closed': ['cause', 'postmortem'],
    'evidence.added': ['evidence_id', 'project', 'evidence_type', 'source', 'direction'],
  };
  const payloadGaps = [];
  for (const { line, e } of evs) for (const req of (REQ[e.kind] || [])) if (e[req] === undefined || e[req] === null || e[req] === '') payloadGaps.push({ line, id: e.id, kind: e.kind, field: req });
  const freezeThrough = payloadGaps.length ? evs[Math.max(...payloadGaps.map(g => g.line)) - 1].e.id : null;

  /* ── C. Recordy: attached_to (mapowanie id↔id) ── */
  const recordUpdates = [], programRecords = [];
  for (const c of cards.filter(x => x.fm.type === 'record')) {
    if (!/^rec:(backtests|postmortems)\//.test(c.fm.id)) continue;
    const cand = 'proj:' + c.fm.id.split('/')[1];
    const already = [].concat((c.fm.relations || {}).attached_to || []).includes(cand);
    if (projectIds.has(cand)) { if (!already) recordUpdates.push({ id: c.fm.id, file: path.relative(root, c.file), attach: cand, version_from: c.fm.version || 1 }); }
    else programRecords.push({ id: c.fm.id, reason: `brak projektu ${cand} — dokument programowy` });
  }
  const recProject = new Map(recordUpdates.map(r => [r.id, r.attach]));
  for (const c of cards.filter(x => x.fm.type === 'record')) {
    const at = [].concat((c.fm.relations || {}).attached_to || []).filter(x => String(x).startsWith('proj:'));
    if (at.length === 1) recProject.set(c.fm.id, at[0]);
  }

  /* ── D. Evidence ── */
  const mechUpdates = [];
  let stats = { type_narracja: 0, type_backtest: 0, project_filled: 0, key_filled: 0, unresolved: 0 };
  for (const c of cards.filter(x => x.fm.type === 'mechanism')) {
    const before = JSON.stringify(c.fm.evidence || []);
    const ev = (c.fm.evidence || []).map(e => {
      const o = { ...e };
      if (o.type === 'narracja') { o.type = 'narrative'; stats.type_narracja++; }
      const src = String(o.source || '');
      if (o.type === 'postmortem' && src.startsWith('rec:backtests/')) { o.type = 'backtest'; stats.type_backtest++; }
      if (!o.mechanism) o.mechanism = c.fm.id;
      if (!o.project) {
        const p = src.startsWith('proj:') ? src : recProject.get(src);
        if (p) { o.project = p; stats.project_filled++; } else stats.unresolved++;
      }
      if (!o.independence_key) { o.independence_key = independenceKey(o); stats.key_filled++; }
      return o; /* direction: świadomie NIE nadawany */
    });
    if (JSON.stringify(ev) === before) continue;
    mechUpdates.push({
      id: c.fm.id, file: path.relative(root, c.file), version_from: c.fm.version || 1,
      evidence: ev,
      /* liczniki: TEN SAM helper co ingest — jedna definicja independent_sources */
      evidence_strength: evidenceStrength(ev, (c.fm.confidence || {}).evidence_strength?.last_confirmed || '2026-08-09')
    });
  }

  const plan = {
    migration_id: MIGRATION_ID,
    genome_root: root,
    ledger: {
      file: path.relative(root, ledgerFile),
      original_sha256: sha256(ledgerRaw),
      events_total: evs.length,
      id_renames: idRenames,
      events_reordered: 0,
      rehash_from_line: rehashedFrom,
      rehash_count: rehashedCount,
      chronology_violations_left_as_seed_defect: chrono,
      payload_gaps: payloadGaps.length,
      new_lines: newLines,
    },
    freeze_card: payloadGaps.length || chrono.length ? {
      id: 'rec:F0-SEED-FREEZE',
      file: 'records/F0-SEED-FREEZE.md',
      /* granica POZYCYJNA: pierwsze N zdarzeń + hash ostatniej linii seeda PO korekcie ID.
         Zdarzenie N+1 (w tym event migracji) podlega pełnemu kontraktowi. */
      seed_ledger_file: 'events-2026-08.jsonl',
      seed_event_count: evs.length,
      seed_tail_hash: sha16(newLines[newLines.length - 1]),
      payload_gaps: payloadGaps.length,
      chronology_defects: chrono.length,
      last_seed_event_id: evs[evs.length - 1].e.id,
    } : null,
    records: recordUpdates,
    program_records_left_unattached: programRecords,
    mechanisms: mechUpdates,
    evidence_stats: stats,
  };
  /* odcisk WEJŚĆ: wszystko, co plan zakłada jako niezmienne między planowaniem a zapisem */
  const fileHash = f => fs.existsSync(f) ? sha256(fs.readFileSync(f, 'utf8')) : null;
  plan.inputs_fingerprint = {
    ledger_sha256: plan.ledger.original_sha256,
    records: Object.fromEntries(recordUpdates.map(r => [r.id, { version: r.version_from, sha256: sha256(cards.find(c => c.fm.id === r.id).raw) }])),
    mechanisms: Object.fromEntries(mechUpdates.map(m => [m.id, { version: m.version_from, sha256: sha256(cards.find(c => c.fm.id === m.id).raw) }])),
    code: {
      'migrate.js': fileHash(path.join(__dirname, 'migrate.js')),
      'build.js': fileHash(path.join(__dirname, 'build.js')),
    },
  };
  plan.nonce = crypto.randomBytes(16).toString('hex');
  plan.generated_at = new Date().toISOString();
  plan.valid_until = new Date(Date.now() + 60 * 60 * 1000).toISOString();   /* zgoda ważna 60 min */
  plan.plan_hash = planHash(plan);
  return plan;
}

/* ───────────────────── APPLY (atomowo, z rollbackiem) ───────────────────── */
function verifyInputsUnchanged(root, plan) {
  const diffs = [];
  const fp = plan.inputs_fingerprint;
  const ledgerNow = sha256(fs.readFileSync(path.join(root, plan.ledger.file), 'utf8'));
  if (ledgerNow !== fp.ledger_sha256) diffs.push(`Ledger zmieniony: ${fp.ledger_sha256.slice(0, 12)}… → ${ledgerNow.slice(0, 12)}…`);
  const cards = readCards(root);
  const byId = new Map(cards.map(c => [c.fm.id, c]));
  for (const [group, expected] of [['Record', fp.records], ['Mechanizm', fp.mechanisms]])
    for (const [id, exp] of Object.entries(expected)) {
      const c = byId.get(id);
      if (!c) { diffs.push(`${group} ${id}: zniknął`); continue; }
      if ((c.fm.version || 1) !== exp.version) diffs.push(`${group} ${id}: version ${exp.version} → ${c.fm.version}`);
      else if (sha256(c.raw) !== exp.sha256) diffs.push(`${group} ${id}: treść zmieniona po zaplanowaniu`);
    }
  /* kod: plan jest ważny tylko dla tej wersji migratora i buildu */
  for (const [f, expected] of Object.entries(fp.code)) {
    const now = fs.existsSync(path.join(__dirname, f)) ? sha256(fs.readFileSync(path.join(__dirname, f), 'utf8')) : null;
    if (now !== expected) diffs.push(`kod ${f} zmieniony po zaplanowaniu`);
  }
  return diffs;
}

/* ── Weryfikacja zgody: WSPÓLNY moduł `lib/approval.js` ──
 * Migrator miał własną kopię weryfikacji i szukał klucza publicznego w `lib/approval-pubkey.pem`,
 * czyli WEWNĄTRZ repo — a manifest wdrożeniowy świadomie tego pliku nie instaluje. Skutek byłby
 * jeden z dwóch: migracja niedostępna po wdrożeniu albo ktoś dokłada klucz do repo i odtwarza
 * lukę, którą właśnie zamknęliśmy. Teraz migrator używa tej samej kotwicy co reszta systemu:
 * katalog domowy z bazy użytkowników, poza repo, bez override.
 * Podpisywane jest: migration_id · plan_hash · nonce · approved_by · approved_at. */
const APPROVAL = require('./lib/approval.js');
function approvalPayload(a) { return [a.migration_id, a.plan_hash, a.nonce, a.approved_by, a.approved_at].join('|'); }
function verifyApproval(approval, plan) {
  for (const k of ['migration_id', 'plan_hash', 'nonce', 'approved_by', 'approved_at', 'signature'])
    if (!approval[k]) return { ok: false, reason: `zgoda niekompletna — brak pola "${k}"` };
  if (approval.migration_id !== MIGRATION_ID) return { ok: false, reason: 'zgoda dotyczy innej migracji' };
  if (approval.plan_hash !== plan.plan_hash) return { ok: false, reason: `hash zgody ≠ hash zatwierdzonego planu (${approval.plan_hash.slice(0, 12)}… vs ${plan.plan_hash.slice(0, 12)}…)` };
  if (approval.nonce !== plan.nonce) return { ok: false, reason: 'nonce zgody ≠ nonce planu (zgoda z innego przebiegu — ochrona przed replay)' };
  if (isNaN(Date.parse(approval.approved_at))) return { ok: false, reason: 'approved_at nie jest datą ISO 8601' };
  if (plan.valid_until && Date.now() > Date.parse(plan.valid_until)) return { ok: false, reason: `plan wygasł (valid_until ${plan.valid_until})` };
  const pk = APPROVAL.loadPublicKey();
  if (!pk.ok) return { ok: false, reason: pk.why };
  let okSig = false;
  try { okSig = crypto.verify(null, Buffer.from(approvalPayload(approval), 'utf8'), pk.key, Buffer.from(String(approval.signature), 'hex')); }
  catch (e) { return { ok: false, reason: 'podpis nie daje się zweryfikować: ' + e.message }; }
  if (!okSig) return { ok: false, reason: 'PODPIS NIEPRAWIDŁOWY — zgoda sfabrykowana albo podpisana innym kluczem' };
  return { ok: true };
}

/* ── WARSTWA WYKONAWCZA wymaga autoryzacji — nie tylko CLI ──
   auth = { approval, approvedPlan }  → podpis HMAC weryfikowany TUTAJ, przed blokadą.
   auth = { simulation: true }        → dozwolone WYŁĄCZNIE poza kanonicznym root.
   Bez ważnego auth zapis jest niemożliwy także przy bezpośrednim wywołaniu z Node. */
/* ═══ TWARDY NO-OP (przyczyna incydentu 09.08) ═══
 * Migracja z ZEROWĄ deltą nie ma prawa nic zapisać. Wcześniej i tak dopisywała zdarzenie,
 * nadpisywała archiwum Ledgera i snapshot Recordów oraz przesuwała granicę seeda —
 * czyli niszczyła prowieniencję poprzedniej, prawdziwej migracji. Guard piaskownicy ograniczał
 * jeden scenariusz wywołania; to usuwa przyczynę. */
function planDelta(plan) {
  const p = plan || {};
  const L = p.ledger || {};
  return {
    id_renames: (L.id_renames || []).length,
    events_reordered: L.events_reordered || 0,
    records: (p.records || []).length,
    mechanisms: (p.mechanisms || []).length,
    evidence: ((p.evidence || {}).changed) || 0,
  };
}
function isNoop(plan) {
  const d = planDelta(plan);
  return d.id_renames === 0 && d.events_reordered === 0 && d.records === 0 && d.mechanisms === 0 && d.evidence === 0;
}

/* ═══ PUBLICZNE applyPlan — ZAWSZE wymaga podpisu właściciela ═══ (audyt rundy 9)
 * `simulation: true` USUNIĘTE z publicznego API. Było niezaufaną drogą zapisu: wystarczyło
 * skopiować `migrate.js` + `lib/` do ODŁĄCZONEGO katalogu (bez `ledger/` i `records/`), załadować
 * stamtąd migrator i podać jako cel dowolną kompletną instalację Genome — guard oparty na
 * lokalizacji modułu nie miał czego rozpoznać i zapis przechodził.
 *
 * Reguła obowiązująca: **każde publiczne wywołanie funkcji zapisującej wymaga ważnej autoryzacji
 * właściciela.** Testowy wyjątek nie istnieje w produkcyjnym API. CLI `--simulate` robi własną
 * prywatną kopię i woła NIEWYEKSPORTOWANE `applyPlanUnchecked()`. */
function applyPlan(root, plan, auth) {
  /* NO-OP sprawdzany PRZED autoryzacją i PRZED blokadą: nie ma czego autoryzować ani blokować. */
  if (isNoop(plan)) return { ok: true, noop: true, delta: planDelta(plan),
    note: 'Zerowa delta — zero zdarzeń, zero zmian freeze, zero nadpisania archiwum, zero snapshotu, zero buildu produkcyjnego.' };
  if (auth && auth.simulation === true)
    return { ok: false, aborted_before_write: true, error:
      'AUTORYZACJA ODRZUCONA: `simulation: true` nie jest drogą zapisu. Każde publiczne wywołanie applyPlan '
      + 'wymaga podpisu właściciela (Ed25519). Symulację uruchamia CLI `--simulate`, które tworzy własną '
      + 'prywatną kopię i używa funkcji wewnętrznej, niedostępnej z zewnątrz.' };
  const v = verifyApproval((auth || {}).approval || {}, (auth || {}).approvedPlan || plan);
  if (!v.ok) return { ok: false, error: 'AUTORYZACJA ODRZUCONA NA WARSTWIE ZAPISU: ' + v.reason, aborted_before_write: true };
  return withGenomeWriteLock(root, () => applyPlanLocked(root, plan));
}

/* NIEWYEKSPORTOWANA — wyłącznie dla `--simulate`, które samo tworzy kopię. */
function applyPlanUnchecked(root, plan) {
  if (isNoop(plan)) return { ok: true, noop: true, delta: planDelta(plan) };
  return withGenomeWriteLock(root, () => applyPlanLocked(root, plan));
}

function applyPlanLocked(root, plan) {
  /* re-weryfikacja POD BLOKADĄ, przed pierwszym zapisem */
  const diffs = verifyInputsUnchanged(root, plan);
  if (diffs.length) return { ok: false, error: 'WEJŚCIA ZMIENIONE po zaplanowaniu — migracja przerwana przed jakimkolwiek zapisem:\n  • ' + diffs.join('\n  • '), aborted_before_write: true };
  if (plan.valid_until && Date.now() > Date.parse(plan.valid_until)) return { ok: false, error: `PLAN WYGASŁ (valid_until ${plan.valid_until}) — wygeneruj nowy`, aborted_before_write: true };

  const backups = new Map();   // file → oryginał (null = plik nie istniał)
  const write = (rel, content) => {
    const f = path.join(root, rel);
    if (!backups.has(f)) backups.set(f, fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    const tmp = f + '.tmp'; fs.writeFileSync(tmp, content); fs.renameSync(tmp, f);   // atomowy zapis
  };
  /* rollback musi przetrwać KAŻDY stan systemu plików — nieudany rollback jest gorszy
     niż nieudana migracja, więc każdy plik przywracamy niezależnie i raportujemy potknięcia */
  const rollback = () => {
    const failed = [];
    for (const [f, orig] of backups) {
      try { if (orig === null) { if (fs.existsSync(f)) fs.rmSync(f, { force: true, recursive: true }); } else { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, orig); } }
      catch (e) { failed.push(`${f}: ${e.code || e.message}`); }
    }
    return failed;
  };

  try {
    /* 1. artefakt: oryginalny Ledger z hashem — zapisany PRZED zmianą */
    write('ledger/.archive/events-2026-08.pre-' + MIGRATION_ID.replace(/[:]/g, '-') + '.jsonl',
      fs.readFileSync(path.join(root, plan.ledger.file), 'utf8'));

    /* 2. karta freeze — realny obiekt Genome, nie zmienna środowiskowa */
    if (plan.freeze_card) {
      const f = plan.freeze_card;
      write(f.file, renderCard({
        id: f.id, type: 'record', title: 'Granica seeda F0 — wersjonowana walidacja historii', status: 'created',
        created: '2026-08-09', updated: '2026-08-09', version: 1, owner: 'przemek',
        relations: {}, tags: ['governance', 'migracja'],
        seed_ledger_file: f.seed_ledger_file, seed_event_count: f.seed_event_count, seed_tail_hash: f.seed_tail_hash,
        last_seed_event_id: f.last_seed_event_id, migration: MIGRATION_ID,
      }, `\n## Po co ta granica\n\nPierwsze **${f.seed_event_count}** zdarzeń Ledgera (ostatnie: \`${f.last_seed_event_id}\`) powstało przed zaostrzeniem kontraktu payloadu i przed wprowadzeniem walidacji chronologii. Historia Ledgera jest niezmienna, więc braki NIE są uzupełniane wstecz — są raportowane jako ostrzeżenia. Kontrakt obowiązuje bezwzględnie od pierwszego zdarzenia PO tej granicy.\n\n## Znane defekty seeda (zaraportowane, nienaprawiane)\n\n- Braki wymaganych pól payloadu: **${f.payload_gaps}**\n- Naruszenia chronologii: **${f.chronology_defects}** — zdarzenia zapisane z ręcznym timestampem wyprzedzającym czas systemowy; kolejność w pliku NIE jest zmieniana.\n\n## Czego ta karta NIE robi\n\nNie zwalnia z kontraktu zdarzeń nowych: zdarzenie nr **${f.seed_event_count + 1}** i każde kolejne podlega pełnemu kontraktowi niezależnie od daty w ID. Granica jest POZYCYJNA (liczba zdarzeń + hash linii \`${f.seed_tail_hash}\`), nie leksykograficzna — dopisanie lub podmiana czegokolwiek w oknie seeda unieważnia ulgę i cały Ledger wraca pod pełny kontrakt. Nie legalizuje duplikatów Event ID — te są korygowane jawnie (\`corrected_from_id\`).\n`));
    }

    /* 3. Recordy — attached_to.
       DECYZJA WŁAŚCICIELA: jednorazowy wyjątek od immutability (zmiana wyłącznie strukturalnego
       attached_to). Warunek: snapshot pełnej treści + hash before/after każdego Recordu. */
    const snapshot = { migration: MIGRATION_ID, created: new Date().toISOString(), exception: 'jednorazowy wyjątek migracyjny dla 32 Recordów — zmiana wyłącznie relations.attached_to', records: [] };
    for (const r of plan.records) {
      const c0 = readCards(root).find(x => x.fm.id === r.id);
      snapshot.records.push({ id: r.id, file: path.relative(root, c0.file), version_before: c0.fm.version || 1, sha256_before: sha256(c0.raw), content_before: c0.raw });
    }
    for (const r of plan.records) {
      const c = readCards(root).find(x => x.fm.id === r.id);
      if (!c) throw new Error(`Record ${r.id} zniknął w trakcie transakcji`);
      const fm = { ...c.fm, relations: { ...(c.fm.relations || {}) } };
      fm.relations.attached_to = [...new Set([...[].concat(fm.relations.attached_to || []), r.attach])];
      fm.version = (fm.version || 1) + 1;
      fm.migrated_by = MIGRATION_ID;
      write(path.relative(root, c.file), renderCard(fm, c.body));
      const after = renderCard(fm, c.body);
      const snap = snapshot.records.find(x => x.id === r.id);
      snap.version_after = fm.version; snap.sha256_after = sha256(after);
    }
    write(`records/.snapshots/${MIGRATION_ID.replace(/:/g, '-')}-records.json`, JSON.stringify(snapshot, null, 1));

    /* 4. mechanizmy — Evidence */
    for (const m of plan.mechanisms) {
      const c = readCards(root).find(x => x.fm.id === m.id);
      if (!c) throw new Error(`Mechanizm ${m.id} zniknął w trakcie transakcji`);
      const fm = { ...c.fm, evidence: m.evidence, version: (c.fm.version || 1) + 1, migrated_by: MIGRATION_ID };
      fm.confidence = { ...(c.fm.confidence || {}), evidence_strength: m.evidence_strength };
      write(path.relative(root, c.file), renderCard(fm, c.body));
    }

    /* 5. Ledger — korekta ID + przeliczony hash-chain + zdarzenie migracji (append) */
    const migEvent = {
      id: nextEventId(plan.ledger.new_lines),
      ts: new Date().toISOString(),
      kind: 'knowledge.corrected',
      on: 'rec:F0-SEED-FREEZE',
      actor: 'migration',
      from: 'evidence: słownik narracja/postmortem, brak project i independence_key; 3 zduplikowane Event ID',
      to: `evidence: narrative/backtest + project + independence_key; ID skorygowane: ${plan.ledger.id_renames.map(r => r.from + '→' + r.to).join(', ')}`,
      cause: MIGRATION_ID,
      provenance: 'record',
      migration: MIGRATION_ID,
      plan_hash: plan.plan_hash,
      note: `Migracja ${MIGRATION_ID}: ${plan.records.length} Recordów, ${plan.mechanisms.length} mechanizmów, ${plan.ledger.id_renames.length} korekt ID. Kolejność zdarzeń niezmieniona.`,
      prev_hash: null,
    };
    const all = [...plan.ledger.new_lines];
    migEvent.prev_hash = sha16(all[all.length - 1]);
    all.push(JSON.stringify(migEvent));
    write(plan.ledger.file, all.join('\n') + '\n');

    /* 6. bramka: build --check musi być zielony */
    execFileSync('node', [path.join(__dirname, 'build.js'), '--check'], { env: { ...process.env, GENOME_DIR: root }, encoding: 'utf8', stdio: 'pipe' });

    /* 7. PEŁNY build: emisja dist/ + danych viewera — objęta tą samą transakcją.
       Sukces migracji musi znaczyć, że interfejs pokazuje nowy graf, nie stary. */
    for (const rel of ['dist/graph.json', 'dist/genome-data.js', 'dist/INDEX.md', 'dist/METRICS.md']) {
      const f = path.join(root, rel);
      if (!backups.has(f)) backups.set(f, fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null);
    }
    const viewerData = path.join(root, '..', '..', 'genome-os', 'js', 'genome-f0-data.js');
    if (fs.existsSync(path.dirname(viewerData)) && !backups.has(viewerData))
      backups.set(viewerData, fs.existsSync(viewerData) ? fs.readFileSync(viewerData, 'utf8') : null);
    execFileSync('node', [path.join(__dirname, 'build.js')], { env: { ...process.env, GENOME_DIR: root }, encoding: 'utf8', stdio: 'pipe' });
    const graph = JSON.parse(fs.readFileSync(path.join(root, 'dist/graph.json'), 'utf8'));
    const pmCount = (graph.project_mechanism || []).length;
    if (!pmCount) throw new Error('build wyemitował graf bez krawędzi Project–Mechanism — emisja uznana za nieudaną');
    return { ok: true, files: backups.size, pm_edges: pmCount };
  } catch (e) {
    const failed = rollback();
    return { ok: false, error: (e.stdout || '') + (e.message || ''), rolled_back: backups.size, rollback_failures: failed };
  }
}
function nextEventId(lines) {
  const today = new Date().toISOString().slice(0, 10);
  let max = 0;
  for (const l of lines) { const e = JSON.parse(l); if (e.id.slice(4, 14) === today) max = Math.max(max, parseInt(e.id.slice(-4), 10)); }
  return `evt:${today}-${String(max + 1).padStart(4, '0')}`;
}

/* ───────────────────────────── raport/diff ───────────────────────────── */
function renderPlanMd(plan) {
  const L = plan.ledger;
  let s = `# PLAN MIGRACJI ${plan.migration_id}\n\nWygenerowany z: \`${plan.genome_root}\`\nHash planu: \`${plan.plan_hash}\`\n\n`;
  s += `## 1. Ledger\n\n- Zdarzeń: **${L.events_total}**\n- Oryginał sha256: \`${L.original_sha256}\`\n- **Zmiana ID: ${L.id_renames.length}** (wyłącznie zdarzenia zduplikowane)\n- **Przestawionych zdarzeń: ${L.events_reordered}**\n- Hash-chain przeliczony od linii ${L.rehash_from_line ?? '—'} (${L.rehash_count} zdarzeń) — konsekwencja korekty ID, treść nietknięta\n\n`;
  if (L.id_renames.length) {
    s += `| linia | było | jest | powód | kind |\n|---|---|---|---|---|\n`;
    for (const r of L.id_renames) s += `| ${r.line} | \`${r.from}\` | \`${r.to}\` | duplikat ID (pierwsze wystąpienie: L${r.first_occurrence_line}) | ${r.kind} |\n`;
    s += `\n`;
  }
  s += `### Naruszenia chronologii — NIE naprawiane (defekt seeda, objęty kartą freeze)\n\n`;
  for (const c of L.chronology_violations_left_as_seed_defect) s += `- L${c.line} \`${c.id}\` ts ${c.ts} < poprzedni ${c.prev}\n`;
  s += `\n## 2. Karta freeze\n\n`;
  s += plan.freeze_card ? `- \`${plan.freeze_card.id}\` → \`${plan.freeze_card.file}\`\n- Partycja: \`${plan.freeze_card.seed_ledger_file}\` · pierwsze ${plan.freeze_card.seed_event_count} zdarzeń · tail hash \`${plan.freeze_card.seed_tail_hash}\`\n- Pokrywa ${plan.freeze_card.payload_gaps} braków payloadu i ${plan.freeze_card.chronology_defects} defektów chronologii\n` : `- brak (zero braków payloadu)\n`;
  s += `\n## 3. Recordy — attached_to (${plan.records.length})\n\n| # | Record | → Project | wersja |\n|---|---|---|---|\n`;
  plan.records.forEach((r, i) => { s += `| ${i + 1} | ${r.id} | ${r.attach} | ${r.version_from} → ${r.version_from + 1} |\n`; });
  s += `\n### Recordy programowe bez projektu (${plan.program_records_left_unattached.length})\n\n`;
  for (const r of plan.program_records_left_unattached) s += `- \`${r.id}\` — ${r.reason}\n`;
  s += `\n## 4. Mechanizmy — Evidence (${plan.mechanisms.length} kart)\n\n`;
  s += `- narracja → narrative: **${plan.evidence_stats.type_narracja}**\n- postmortem(źródło backtestowe) → backtest: **${plan.evidence_stats.type_backtest}**\n- project uzupełniony: **${plan.evidence_stats.project_filled}**\n- independence_key nadany: **${plan.evidence_stats.key_filled}**\n- bez project (wieloprojektowe): **${plan.evidence_stats.unresolved}**\n- direction: **nie nadawany** (brak decyzji = brak pola)\n\n`;
  s += `| karta | wersja | n | projekty | typy |\n|---|---|---|---|---|\n`;
  for (const m of plan.mechanisms) s += `| ${m.id} | ${m.version_from} → ${m.version_from + 1} | ${m.evidence_strength.n} | ${m.evidence_strength.projects} | ${JSON.stringify(m.evidence_strength.types)} |\n`;
  s += `\n## 5. Wymagana zgoda\n\nCommit wymaga pliku zgody:\n\n\`\`\`json\n{\n  "migration_id": "${plan.migration_id}",\n  "plan_hash": "${plan.plan_hash}",\n  "approved_by": "<imię>",\n  "approved_at": "<ISO8601>"\n}\n\`\`\`\n\nAgent nie może wygenerować tego pliku samodzielnie — hash musi zgadzać się z planem w chwili commitu.\n`;
  return s;
}


/* ───────────────────────────── CLI ───────────────────────────── */
if (require.main === module) {
  const args = process.argv.slice(2);
  const mode = args.find(a => ['--dry-run', '--simulate', '--apply'].includes(a)) || '--dry-run';
  const argOf = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
  const ROOT = path.resolve(__dirname);

  if (mode === '--dry-run') {
    const plan = buildPlan(ROOT);
    const out = argOf('--plan') || path.join(ROOT, 'dist', 'PLAN-MIGRACJI.md');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, renderPlanMd(plan));
    fs.writeFileSync(out.replace(/\.md$/, '.json'), JSON.stringify({ ...plan, ledger: { ...plan.ledger, new_lines: `<${plan.ledger.new_lines.length} linii>` } }, null, 1));
    console.log(`\n═══ DRY-RUN ${plan.migration_id} ═══\n`);
    console.log(`  Ledger: ${plan.ledger.id_renames.length} korekt ID · ${plan.ledger.events_reordered} przestawień · rehash od L${plan.ledger.rehash_from_line}`);
    console.log(`  Recordy: ${plan.records.length} · mechanizmy: ${plan.mechanisms.length}`);
    console.log(`  Evidence: ${JSON.stringify(plan.evidence_stats)}`);
    console.log(`  Hash planu: ${plan.plan_hash}`);
    console.log(`  Plan zapisany: ${out}\n  Zero zmian w Genome.\n`);
    process.exit(0);
  }

  if (mode === '--simulate') {
    /* pełny układ repo: <SIM>/r352-os/genome + <SIM>/genome-os/js — testuje też zapis viewera */
    const SIMBASE = fs.mkdtempSync(path.join(os.tmpdir(), 'genome-sim-'));
    const SIM = path.join(SIMBASE, 'r352-os', 'genome');
    fs.mkdirSync(path.dirname(SIM), { recursive: true });
    fs.cpSync(ROOT, SIM, { recursive: true, filter: s => !/(^|\/)(dist|node_modules|\.genome-write\.lock)$/.test(s) });
    const viewerSrc = path.join(ROOT, '..', '..', 'genome-os', 'js');
    if (fs.existsSync(viewerSrc)) fs.cpSync(viewerSrc, path.join(SIMBASE, 'genome-os', 'js'), { recursive: true });
    console.log(`\n═══ SYMULACJA na kopii realnego Genome (pełny układ repo) ═══\n  Kopia: ${SIM}\n`);
    const plan = buildPlan(SIM);                       // TA SAMA funkcja co produkcyjnie
    console.log(renderPlanMd(plan).split('\n').slice(0, 22).join('\n'));
    const res = applyPlanUnchecked(SIM, plan);   // kopia zrobiona wyżej PRZEZ NAS; funkcja niewyeksportowana
    console.log(`\n  applyPlan: ${res.ok ? '✓ transakcja zatwierdzona' : '✗ ROLLBACK — ' + String(res.error).slice(0, 600)}`);
    let check = '', code = 0;
    try { check = execFileSync('node', [path.join(ROOT, 'build.js'), '--check'], { env: { ...process.env, GENOME_DIR: SIM }, encoding: 'utf8' }); }
    catch (e) { check = (e.stdout || '') + (e.stderr || ''); code = e.status; }
    const errs = check.split('\n').filter(l => l.startsWith('✗'));
    console.log(`\n  build --check na kopii: ${check.trim().split('\n').slice(-2)[0]}`);
    if (errs.length) errs.slice(0, 8).forEach(l => console.log('   ' + l));
    let rel = '';
    try { rel = execFileSync('node', [path.join(ROOT, 'build.js'), '--relations-report'], { env: { ...process.env, GENOME_DIR: SIM }, encoding: 'utf8' }); } catch (e) { rel = e.stdout || ''; }
    console.log('\n  Relacje po migracji:');
    rel.split('\n').filter(l => /^[1-8]\./.test(l.trim())).forEach(l => console.log('   ' + l.trim()));
    const originalSha = sha256(fs.readFileSync(path.join(ROOT, 'ledger/events-2026-08.jsonl'), 'utf8'));
    console.log(`\n  Kanoniczny Ledger sha256: ${originalSha.slice(0, 32)}… (niezmieniony)`);
    const vf = path.join(SIMBASE, 'genome-os', 'js', 'genome-f0-data.js');
    if (fs.existsSync(vf)) {
      const vd = fs.readFileSync(vf, 'utf8');
      const fresh = vd.includes('project_mechanism');
      console.log(`  Plik viewera w kopii: ${fresh ? '✓ zaktualizowany (zawiera project_mechanism)' : '✗ NIEzaktualizowany'}`);
    }
    if (!args.includes('--keep')) { fs.rmSync(SIMBASE, { recursive: true, force: true }); console.log('  Kopia skasowana.'); }
    else console.log(`  Kopia zachowana: ${SIM}`);
    console.log(res.ok && !errs.length ? '\n  ✓ WERDYKT: ścieżka produkcyjna przechodzi end-to-end.\n' : '\n  ✗ WERDYKT: ścieżka NIE przechodzi.\n');
    process.exit(res.ok && !errs.length ? 0 : 1);
  }

  if (mode === '--apply') {
    const approvalFile = argOf('--approval');
    const planFile = argOf('--plan-json') || path.join(ROOT, 'dist', 'PLAN-MIGRACJI.json');
    if (!approvalFile || !fs.existsSync(approvalFile)) { console.error('✗ --apply wymaga --approval <plik zgody>'); process.exit(2); }
    if (!fs.existsSync(planFile)) { console.error(`✗ brak zatwierdzonego planu ${planFile} — uruchom --dry-run`); process.exit(2); }
    const approval = JSON.parse(fs.readFileSync(approvalFile, 'utf8'));
    const approvedPlan = JSON.parse(fs.readFileSync(planFile, 'utf8'));
    const v = verifyApproval(approval, approvedPlan);
    if (!v.ok) { console.error('✗ ZGODA ODRZUCONA: ' + v.reason); process.exit(2); }
    /* plan odtwarzany z bieżących danych; jego hash musi zgadzać się z zatwierdzonym */
    const plan = buildPlan(ROOT);
    plan.nonce = approvedPlan.nonce; plan.generated_at = approvedPlan.generated_at; plan.valid_until = approvedPlan.valid_until;
    plan.plan_hash = planHash(plan);
    if (plan.plan_hash !== approvedPlan.plan_hash) { console.error(`✗ dane zmieniły się od zatwierdzenia planu\n   zatwierdzony: ${approvedPlan.plan_hash}\n   bieżący:      ${plan.plan_hash}`); process.exit(2); }
    const res = applyPlan(ROOT, plan, { approval, approvedPlan });
    console.log(res.ok ? `✓ migracja zapisana (${res.files} plików), build zielony, graf: ${res.pm_edges} krawędzi Project–Mechanism` : `✗ ${res.aborted_before_write ? 'PRZERWANA PRZED ZAPISEM' : 'ROLLBACK'} — nic nie zapisano\n${res.error}`);
    process.exit(res.ok ? 0 : 1);
  }
}

module.exports = { planDelta, isNoop, buildPlan, applyPlan, planHash, renderPlanMd, verifyApproval, verifyInputsUnchanged, approvalPayload, MIGRATION_ID };
