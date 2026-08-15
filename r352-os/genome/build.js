#!/usr/bin/env node
/* Genome build.js — deterministyczny kompilator (F0, Część D spec).
   Zero AI. Zero sieci. Zero logiki biznesowej. Identyczne wejście → identyczne wyjście.
   Tryby: node build.js            (walidacja + emit dist/)
          node build.js --check    (tylko walidacja; exit 1 przy błędach)
          node build.js --find "fraza"  (wyszukiwarka pełnotekstowa po całym Genome) */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const G = process.env.GENOME_DIR || __dirname;

/* Rejestr typów mieszka w ontology/types.json i jest JEDYNYM źródłem prawdy — czytają go
   build.js, ingest.js i tablica. Wcześniej ta sama lista stała w trzech kopiach i dodanie
   typu wymagało znalezienia wszystkich trzech; to duplikacja czyniła rozszerzanie ontologii
   ryzykownym, nie samo rozszerzanie. Dodanie typu = jeden wpis w JSON-ie + katalog + Decision.
   Bramka: rules/rozszerzanie-ontologii.md. */
const TYPES = JSON.parse(fs.readFileSync(path.join(G, 'ontology', 'types.json'), 'utf8')).types;
const RELATION_KEYS = ['derives','implements','related','tests','uses','enforces','for','attached_to','supersedes','born_from','used_by'];
const REQUIRED = ['id','type','title','status','created','updated','version','owner'];
/* ZAMKNIĘTY słownik zdarzeń + wymagany payload (musi być zgodny z ingest.js) */
const EVENT_SCHEMA = {
  'prediction.registered':  ['prediction_id', 'p', 'claim', 'deadline', 'criterion', 'measurement_source', 'resolution_owner'],
  'prediction.resolved':    ['prediction_id', 'result', 'cause', 'resolution_source'],
  'prediction.voided':      ['prediction_id', 'cause'],
  'confidence.changed':     ['from', 'to', 'cause', 'supporting_evidence'],
  'evidence.added':         ['evidence_id', 'project', 'evidence_type', 'source', 'direction'],
  'evidence.retracted':     ['evidence_id', 'cause'],
  'knowledge.corrected':    ['from', 'to', 'cause'],
  'knowledge.reclassified': ['from', 'to', 'cause'],
  'project.closed':         ['cause', 'postmortem'],
  'project.routed': [], 'project.activated': [], 'project.status_changed': [],
  'project.iteration': [], 'project.artifact_created': [],
  'decision.recorded': [], 'decision.opened': [], 'decision.decided': [],
  'experiment.started': [], 'experiment.concluded': [],
  'evidence.observed': [], 'signal.observed': [],
  'object.created': [], 'object.patched': [], 'object.replaced': [], 'object.updated': [],
  'guard.armed': [], 'ontology.changed': [],
};
const EVIDENCE_TYPES = ['measurement', 'postmortem', 'narrative', 'backtest', 'intention'];
/* Evidence "żywe" = liczy się do progu validated. backtest/intention/narrative — NIE. */
const isBacktestEv = e => e.type === 'backtest' || String(e.source || '').startsWith('rec:backtests/');
const isLiveStrong = e => (e.type === 'measurement' || e.type === 'postmortem') && !isBacktestEv(e);
/* ── Granica seeda F0 — POZYCYJNA, nie leksykograficzna ──
   Karta rec:F0-SEED-FREEZE deklaruje: seed_event_count (ile PIERWSZYCH zdarzeń należy do seeda)
   oraz seed_tail_hash (hash ostatniej linii seeda po korekcie). Ulga dotyczy wyłącznie zdarzeń
   o indeksie < seed_event_count I wyłącznie gdy tail hash się zgadza — inaczej granica jest
   nieważna i cały Ledger przechodzi pełny kontrakt. ID zdarzenia NIE decyduje o niczym:
   zdarzenie nr 180 z datą 8 sierpnia podlega pełnemu kontraktowi. */
let SEED = { file: '', count: 0, tail: '', declared: false };
try {
  const f = path.join(process.env.GENOME_DIR || __dirname, 'records', 'F0-SEED-FREEZE.md');
  if (fs.existsSync(f)) {
    const raw = fs.readFileSync(f, 'utf8');
    const pf = /^seed_ledger_file: "([^"]+)"$/m.exec(raw);
    const c = /^seed_event_count: (\d+)$/m.exec(raw);
    const h = /^seed_tail_hash: "([0-9a-f]+)"$/m.exec(raw);
    if (pf && c && h) SEED = { file: pf[1], count: +c[1], tail: h[1], declared: true };
  }
} catch { /* brak karty = brak zwolnienia; kontrakt obowiązuje od pierwszego zdarzenia */ }
let seedValid = false;   // ustawiane po weryfikacji tail hash (patrz odczyt Ledgera)
/* okno seeda dotyczy WYŁĄCZNIE zadeklarowanej partycji — inne miesiące pod pełnym kontraktem */
const inSeedWindow = (file, idx) => seedValid && file === SEED.file && idx < SEED.count;

/* ── Granica bramki startu projektu (invariant 11) ──
   Projekty utworzone PRZED tą datą są grandfathered (ostrzeżenie zamiast błędu) — historii nie
   przepisujemy, ale każdy nowy projekt przechodzi pełny kontrakt startowy.
   Źródło kanoniczne: rec:PROJECT-GATE (pole gate_since). Brak karty = bramka nieaktywna. */
let GATE_SINCE = process.env.GENOME_GATE_SINCE || '';
try {
  if (!GATE_SINCE) {
    const gf = path.join(process.env.GENOME_DIR || __dirname, 'records', 'PROJECT-GATE.md');
    if (fs.existsSync(gf)) GATE_SINCE = (/^gate_since: "(\d{4}-\d{2}-\d{2})"$/m.exec(fs.readFileSync(gf, 'utf8')) || [])[1] || '';
  }
} catch { /* brak karty = bramka nieaktywna */ }

const errors = [], warnings = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const warn = (f, m) => warnings.push(`${f}: ${m}`);

/* ── frontmatter parser: klucz: wartość-JSON (spec B.2 — każda wartość to poprawny JSON/skalar) ── */
function parseFrontmatter(raw, file) {
  if (!raw.startsWith('---\n')) { err(file, 'brak frontmatter'); return [null, raw]; }
  const end = raw.indexOf('\n---', 4);
  if (end < 0) { err(file, 'niedomknięty frontmatter'); return [null, raw]; }
  const block = raw.slice(4, end);
  const body = raw.slice(end + 4);
  const fm = {};
  for (const line of block.split('\n')) {
    if (!line.trim()) continue;
    const i = line.indexOf(': ');
    if (i < 0) { err(file, `frontmatter: zła linia "${line.slice(0, 40)}"`); continue; }
    const key = line.slice(0, i).trim();
    const val = line.slice(i + 2).trim();
    try { fm[key] = JSON.parse(val); }
    catch { fm[key] = val; }
  }
  return [fm, body];
}

/* ── READ ── */
const objects = new Map(); // id -> {fm, body, file}
function readDir(dir, expectType) {
  const full = path.join(G, dir);
  if (!fs.existsSync(full)) return;
  for (const f of fs.readdirSync(full).sort()) {
    const p = path.join(full, f);
    if (fs.statSync(p).isDirectory()) { readDir(path.join(dir, f), expectType); continue; }
    if (!f.endsWith('.md') || f === 'INDEX.md') continue;
    const rel = path.join(dir, f);
    const [fm, body] = parseFrontmatter(fs.readFileSync(p, 'utf8'), rel);
    if (!fm) continue;
    if (!fm.id) { err(rel, 'brak id'); continue; }
    if (objects.has(fm.id)) err(rel, `duplikat id ${fm.id}`);
    objects.set(fm.id, { fm, body, file: rel });
  }
}
for (const t of Object.values(TYPES)) readDir(t.dir, t);

/* ── LEDGER read + hash chain ── */
const events = [];
const eventIds = new Map();       // id -> "plik:linia" (globalna unikalność)
const ledgerDir = path.join(G, 'ledger');
if (fs.existsSync(ledgerDir)) {
  let globalPrevTs = '';
  for (const f of fs.readdirSync(ledgerDir).sort()) {
    if (!f.endsWith('.jsonl')) continue;
    let prev = 'genesis';
    const lines = fs.readFileSync(path.join(ledgerDir, f), 'utf8').split('\n').filter(Boolean);
    /* weryfikacja granicy seeda — WYŁĄCZNIE dla zadeklarowanej partycji; inne pliki normalnie */
    if (SEED.declared && f === SEED.file) {
      if (lines.length >= SEED.count && SEED.count > 0) {
        const actualTail = crypto.createHash('sha256').update(lines[SEED.count - 1]).digest('hex').slice(0, 16);
        seedValid = actualTail === SEED.tail;
        if (!seedValid) err(`ledger/${f}`, `granica seeda NIEWAŻNA: seed_tail_hash=${SEED.tail} ≠ rzeczywisty ${actualTail} (linia ${SEED.count}) — cały Ledger podlega pełnemu kontraktowi`);
      } else {
        err(`ledger/${f}`, `granica seeda deklaruje ${SEED.count} zdarzeń w ${SEED.file}, plik ma ${lines.length} — granica nieważna`);
      }
    }
    lines.forEach((line, i) => {
      const where = `ledger/${f}:${i + 1}`;
      let e;
      try { e = JSON.parse(line); } catch { err(where, 'niepoprawny JSON'); return; }
      // hash-chain: pierwszy w pliku miesięcznym MUSI mieć genesis
      if (i === 0 && e.prev_hash !== 'genesis') err(where, `pierwsze zdarzenie miesiąca ma prev_hash "${e.prev_hash}" zamiast "genesis"`);
      if (e.prev_hash !== prev) err(where, `zerwany hash-łańcuch (oczekiwano ${prev}, jest ${e.prev_hash}) — możliwa edycja historii`);
      prev = crypto.createHash('sha256').update(line).digest('hex').slice(0, 16);
      // słownik zamknięty + wymagany payload
      if (!EVENT_SCHEMA[e.kind]) err(where, `kind spoza ZAMKNIĘTEGO słownika: ${e.kind}`);
      else {
        /* Wersjonowana walidacja: zdarzenia seeda F0 (do granicy z rec:F0-SEED-FREEZE) powstały
           przed zaostrzeniem kontraktu payloadu. Historia NIE jest przepisywana — braki są
           raportowane jako ostrzeżenia, nie błędy. Kontrakt obowiązuje od pierwszego zdarzenia
           PO granicy. Granica jest jawna, audytowalna i sama jest obiektem Genome. */
        const inSeed = inSeedWindow(f, i);
        for (const req of EVENT_SCHEMA[e.kind]) if (e[req] === undefined || e[req] === null || e[req] === '') {
          const msg = `${e.kind}: brak wymaganego pola "${req}"`;
          if (inSeed) warn(where, `[seed F0] ${msg} — zdarzenie ${i + 1}/${SEED.count} w oknie seeda`); else err(where, msg);
        }
      }
      if (!e.ts || !e.id || !e.on) err(where, 'brak ts/id/on');
      // unikalność ID
      if (eventIds.has(e.id)) err(where, `ZDUPLIKOWANY Event ID ${e.id} (pierwsze wystąpienie: ${eventIds.get(e.id)})`);
      else eventIds.set(e.id, where);
      // data w ID zgodna z timestampem
      const idDate = String(e.id).slice(4, 14);
      if (/^\d{4}-\d{2}-\d{2}$/.test(idDate) && e.ts && idDate !== String(e.ts).slice(0, 10)) err(where, `data w ID (${idDate}) ≠ data timestampu (${String(e.ts).slice(0, 10)})`);
      // plik miesięczny zgodny z datą
      const mon = f.replace(/^events-|\.jsonl$/g, '');
      if (/^\d{4}-\d{2}$/.test(mon) && e.ts && String(e.ts).slice(0, 7) !== mon) err(where, `zdarzenie z ${String(e.ts).slice(0, 7)} w pliku miesiąca ${mon}`);
      // chronologia globalna
      /* porównanie po WARTOŚCI czasu, nie po stringu — Ledger miesza offsety (+00:00 i +02:00),
         a leksykograficznie "12:54+00:00" wypada przed "14:40+02:00" mimo że jest późniejsze */
      if (globalPrevTs && e.ts && Date.parse(e.ts) < Date.parse(globalPrevTs)) {
        /* w seedzie F0 to znany defekt (ręczne timestampy sprzed automatycznego zapisu) —
           raportowany, nie naprawiany: kolejności historii się nie przestawia */
        const msg = `zdarzenie niechronologiczne: ts ${e.ts} < poprzedni ${globalPrevTs}`;
        if (inSeedWindow(f, i)) warn(where, `[seed F0] ${msg} — defekt objęty rec:F0-SEED-FREEZE`);
        else err(where, msg);
      }
      if (e.ts) globalPrevTs = e.ts;
      events.push(e);
    });
  }
}

/* ── VALIDATE objects ── */
const evidenceIds = new Map(); // globalna unikalność Evidence ID (invariant 10)
for (const [id, o] of objects) {
  const { fm, file } = o;
  for (const k of REQUIRED) if (fm[k] === undefined) err(file, `brak pola ${k}`);
  const tdef = TYPES[fm.type];
  if (!tdef) { err(file, `nieznany typ ${fm.type}`); continue; }
  if (!id.startsWith(tdef.prefix + ':')) err(file, `id ${id} nie pasuje do prefiksu ${tdef.prefix}:`);
  if (!tdef.statuses.includes(fm.status)) err(file, `status "${fm.status}" spoza słownika typu ${fm.type}`);
  const rels = fm.relations || {};
  for (const [rk, targets] of Object.entries(rels)) {
    if (!RELATION_KEYS.includes(rk)) err(file, `relacja spoza słownika: ${rk}`);
    for (const t of [].concat(targets)) {
      if (!objects.has(t)) err(file, `relacja ${rk} → nieistniejący obiekt ${t}`);
    }
  }
  if (fm.type === 'mechanism') {
    if (!rels.implements || rels.implements.length !== 1) err(file, 'mechanizm musi wskazywać dokładnie 1 principle (invariant 1)');
    const c = fm.confidence || {};
    if (c.value !== fm.status) err(file, `confidence.value (${c.value}) ≠ status (${fm.status})`);
    const ev = fm.evidence || [];
    const strength = (c.evidence_strength || {});
    if ((strength.n || 0) !== ev.length) err(file, `evidence_strength.n=${strength.n} ≠ liczba wpisów evidence=${ev.length} (liczniki są liczone)`);
    const fps = new Map();
    for (const e of ev) {
      if (!e.id || !e.type || !e.date || !e.source) err(file, `evidence bez pełnej prowieniencji: ${JSON.stringify(e).slice(0, 60)}`);
      if (e.source === 'analysis') err(file, 'evidence source:"analysis" jest NIELEGALNE (invariant 8)');
      if (e.source && e.source.startsWith('rec:') && !objects.has(e.source)) warn(file, `evidence source ${e.source} nie istnieje jako Record`);
      if (evidenceIds.has(e.id) && evidenceIds.get(e.id) !== id) err(file, `Evidence ID ${e.id} użyty w ≥2 mechanizmach (invariant 10: no double-counting)`);
      evidenceIds.set(e.id, id);
      if (!EVIDENCE_TYPES.includes(e.type)) err(file, `evidence.type "${e.type}" spoza słownika [${EVIDENCE_TYPES}]${e.type === 'narracja' ? ' — uruchom `node migrate.js --dry-run` (narracja→narrative)' : ''}`);
      if (e.type !== 'intention' && !e.project && !isBacktestEv(e)) warn(file, `evidence ${e.id} bez pola project — niezależność nie może być policzona`);
      if (e.fingerprint) {
        if (fps.has(e.fingerprint)) err(file, `duplikat Evidence: ${e.id} i ${fps.get(e.fingerprint)} mają ten sam fingerprint (ten sam fakt)`);
        fps.set(e.fingerprint, e.id);
      }
    }
    if (fm.status === 'validated') {
      const projects = new Set(ev.map(e => e.project).filter(Boolean));
      const live = ev.filter(isLiveStrong).length;
      const problems = [];
      if (ev.length < 3) problems.push(`n=${ev.length} < 3`);
      if (projects.size < 2) problems.push(`różnych project ID=${projects.size} < 2`);
      if (live < 1) problems.push('brak ≥1 ŻYWEGO measurement/postmortem (backtest/narrative/intention nie wystarczają)');
      if (problems.length) err(file, `status "validated" bez pokrycia (invariant 2): ${problems.join('; ')}`);
    }
  }
  if (fm.type === 'project') {
    if (fm.status === 'active' && !(rels.attached_to || fm.routing)) err(file, 'project active bez raportu routera (invariant 4)');
    if (fm.status === 'closed' && !fm.postmortem) err(file, 'project closed bez postmortem (invariant 4)');

    /* ── INVARIANT 11: BRAMKA STARTU (Project Contract + decyzja GO) ──
       Projekt nie przechodzi do realizacji na samym raporcie Routera. Wymagane:
       contract (Record z zamrożonym stanem wiedzy) · outcome_owner · measurement_date ·
       go_decision (Decision zatwierdzona przez CZŁOWIEKA, nie agenta).
       Projekty rozpoczęte przed wdrożeniem bramki (GATE_SINCE) są grandfathered: ostrzeżenie,
       nie błąd — historii nie przepisujemy, ale nowe projekty przechodzą pełny kontrakt. */
    /* bramka jest OPT-IN: bez karty rec:PROJECT-GATE nie waliduje niczego (stan zastany) */
    if (GATE_SINCE && (fm.status === 'active' || fm.status === 'closed')) {
      const grandfathered = String(fm.created || '') < GATE_SINCE;
      const report = grandfathered ? warn : err;
      const tag = grandfathered ? '[przed bramką] ' : '';
      if (!fm.contract) report(file, `${tag}project ${fm.status} bez Project Contract (invariant 11) — pole contract: rec:contracts/…`);
      else if (!objects.has(fm.contract)) err(file, `contract → nieistniejący Record ${fm.contract}`);
      if (!fm.outcome_owner) report(file, `${tag}project ${fm.status} bez outcome_owner (invariant 11) — kto odpowiada za wynik`);
      if (!fm.measurement_date) report(file, `${tag}project ${fm.status} bez measurement_date (invariant 11) — kiedy mierzymy`);
      if (!fm.go_decision) report(file, `${tag}project ${fm.status} bez decyzji GO (invariant 11) — pole go_decision: dec:…`);
      else if (!objects.has(fm.go_decision)) err(file, `go_decision → nieistniejąca Decision ${fm.go_decision}`);
      else {
        const d = objects.get(fm.go_decision).fm;
        if (d.type !== 'decision') err(file, `go_decision ${fm.go_decision} nie jest typu decision`);
        else {
          if (d.choice !== 'GO') err(file, `go_decision ${fm.go_decision} ma choice="${d.choice}" — realizację uruchamia wyłącznie GO (REVISE/STOP blokują)`);
          if (d.status !== 'decided') err(file, `go_decision ${fm.go_decision} ma status "${d.status}" — wymagane "decided"`);
          /* człowiek zatwierdza: agent nie może zatwierdzić własnego kontraktu */
          if (!d.decided_by) err(objects.get(fm.go_decision).file, 'decyzja GO bez pola decided_by (kto zatwierdził)');
          else if (/^(session|agent|migration|ingest)/i.test(String(d.decided_by))) err(objects.get(fm.go_decision).file, `decyzja GO zatwierdzona przez agenta "${d.decided_by}" — GO wymaga człowieka (invariant 11)`);
          if (d.prepared_by && d.decided_by && String(d.prepared_by) === String(d.decided_by)) err(objects.get(fm.go_decision).file, 'ten sam podmiot przygotował i zatwierdził kontrakt — wymagane rozdzielenie ról (invariant 11)');
        }
      }
    }
  }
}

/* ── INVARIANT 12: PREDYKCJE SĄ IMMUTABLE ──
   Po rejestracji predykcji nie wolno jej nadpisać ani zarejestrować ponownie pod tym samym ID.
   Korekta = prediction.voided + nowa predykcja z nowym ID (jawny ślad w historii). */
const predRegistered = new Map();   // prediction_id → {where, ts, claim}
for (const e of events) {
  if (e.kind !== 'prediction.registered') continue;
  const pid = e.prediction_id;
  if (predRegistered.has(pid)) {
    const first = predRegistered.get(pid);
    err('ledger', `predykcja ${pid} zarejestrowana PONOWNIE (${e.id}) — pierwsza: ${first.where}. Predykcje są immutable: korekta = prediction.voided + nowe ID (invariant 12)`);
  } else predRegistered.set(pid, { where: e.id, ts: e.ts, claim: e.claim });
}
/* predykcja rozstrzygnięta/unieważniona musi wcześniej istnieć */
for (const e of events) {
  if (!/^prediction\.(resolved|voided)$/.test(e.kind)) continue;
  if (!predRegistered.has(e.prediction_id)) err('ledger', `${e.kind} dla niezarejestrowanej predykcji ${e.prediction_id} (${e.id})`);
}

/* confidence ↔ ledger (invariant 3): ostatni confidence.changed musi zgadzać się ze stanem karty */
const lastConf = new Map();
for (const e of events) if (e.kind === 'confidence.changed') lastConf.set(e.on, e.to);
for (const [onId, to] of lastConf) {
  const o = objects.get(onId);
  if (!o) { warn('ledger', `confidence.changed dla nieistniejącego ${onId}`); continue; }
  if (o.fm.status !== to) err(o.file, `status ${o.fm.status} ≠ ostatni event confidence.changed→${to} (invariant 3)`);
}

/* zdarzenia → obiekty: referencje, version bump, awans validated */
const lastVersion = new Map();
for (const e of events) {
  const where = `ledger:${e.id}`;
  if (e.on && !objects.has(e.on)) warn(where, `zdarzenie ${e.kind} wskazuje nieistniejący obiekt ${e.on}`);
  if (e.cause && /^(rec|dec):/.test(e.cause) && !objects.has(e.cause)) warn(where, `cause → nieistniejący obiekt ${e.cause}`);
  if (e.version_to != null) lastVersion.set(e.on, e.version_to);
  if (e.kind === 'confidence.changed' && e.to === 'validated') {
    const o = objects.get(e.on);
    if (o) {
      const ev = o.fm.evidence || [];
      const projects = new Set(ev.map(x => x.project).filter(Boolean));
      if (ev.length < 3 || projects.size < 2 || !ev.some(isLiveStrong))
        err(where, `confidence.changed → validated dla ${e.on} ODRZUCONY: próg niespełniony (n=${ev.length}, projekty=${projects.size}, żywe=${ev.filter(isLiveStrong).length})`);
    }
  }
}
for (const [onId, v] of lastVersion) {
  const o = objects.get(onId);
  if (o && (o.fm.version || 1) !== v) err(o.file, `version karty=${o.fm.version} ≠ version_to ostatniego zdarzenia=${v} (zmiana wiedzy musi podnosić version)`);
}

/* project closed wymaga zatwierdzonego postmortemu (record w relacjach lub polu) */
for (const [, o] of objects) {
  if (o.fm.type !== 'project' || o.fm.status !== 'closed') continue;
  const pm = o.fm.postmortem || ((o.fm.relations || {}).attached_to || []).find(x => String(x).startsWith('rec:postmortems/'));
  if (!pm || !objects.has(pm)) err(o.file, 'project "closed" bez istniejącego Recordu postmortemu (invariant 4)');
}

/* ════════════════════════════════════════════════════════════════════════════
   GRAF — KANONICZNA KOMPILACJA KRAWĘDZI Project–Mechanism
   JEDYNE miejsce wyprowadzania relacji w systemie. Viewer czyta gotowy dataset
   (window.GENOME_DATA.graph) i NIE wyprowadza krawędzi sam.

   Źródła (wyłącznie USTRUKTURYZOWANE pola — zero zgadywania z `note`,
   z nazw plików, z dopasowań tekstowych/includes()):
     Project.mechanisms_planned[]    → planned
     Project.mechanisms_confirmed[]  → used
     Project.relations.uses[]        → used         (zgodność wstecz; NIE jedyne źródło)
     Evidence.direction = supports   → supported
     Evidence.direction = contradicts→ contradicted
     Evidence.direction = limits     → limited
     Evidence backtest (isBacktestEv)→ backtested   (NIGDY supported)
     Evidence.type = intention       → BRAK relacji potwierdzającej

   Rozwiązanie projektu dla Evidence (deterministyczne, w tej kolejności):
     1. jawne pole Evidence.project
     2. Evidence.source = "rec:…" → Record.relations.attached_to → dokładnie 1 proj:…
     3. Evidence.source = "proj:…" — jawne pole wskazujące wprost projekt
     inaczej → BRAK krawędzi + ostrzeżenie walidacyjne (nigdy domysł)

   Agregacja: para (project, mechanism, relation, evidence_id) daje maks. 1 wkład;
   wiele Evidence dla tej samej trójki → JEDNA krawędź z evidence_count i listą ID.
   Sortowanie bajtowo-stabilne (bez localeCompare) → ten sam build = ten sam plik.
   ════════════════════════════════════════════════════════════════════════════ */
const GRAPH_RELATIONS = ['planned', 'used', 'supported', 'contradicted', 'limited', 'backtested'];
/* słownik kierunków MUSI być zgodny z ingest.js (DIRECTIONS); "neutral" jest legalny
   i świadomie NIE tworzy krawędzi — dowód neutralny niczego nie potwierdza ani nie obala */
const DIRECTION_TO_RELATION = { supports: 'supported', contradicts: 'contradicted', limits: 'limited', neutral: null };
const RELATION_ORDER = Object.fromEntries(GRAPH_RELATIONS.map((r, i) => [r, i]));
const GRAPH_TAG = '[graf] ';
const gerr = (f, m) => errors.push(`${GRAPH_TAG}${f}: ${m}`);
const gwarn = (f, m) => warnings.push(`${GRAPH_TAG}${f}: ${m}`);
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

const graphStats = {
  projects: 0, mechanisms: 0,
  evidence_total: 0, evidence_with_project_field: 0, evidence_via_record: 0,
  evidence_via_source_project: 0, evidence_unresolved: 0,
  evidence_intention: 0, evidence_without_direction: 0, evidence_backtest: 0,
  unresolved_reasons: {}, unresolved_by_source: {},
  relations_by_type: {}, pairs: 0,
};

const pmAgg = new Map();       // "proj|mech|relation" → {source,target,relation,evidence_ids:Set,provenance:Set}
const pmTuples = new Set();    // "proj|mech|relation|evidence_id" — deduplikacja wkładu
const evidenceProjects = new Map(); // ev:id → Set(proj:id)  (wykrywanie sprzecznych mapowań)

function addPmEdge(file, project, mechanism, relation, evidenceId, provenance) {
  if (!GRAPH_RELATIONS.includes(relation)) { gerr(file, `nieznany typ relacji "${relation}" (dozwolone: ${GRAPH_RELATIONS.join('|')})`); return; }
  const po = objects.get(project), mo = objects.get(mechanism);
  if (!po || po.fm.type !== 'project') { gerr(file, `krawędź "${relation}" → nieistniejący projekt ${project}`); return; }
  if (!mo || mo.fm.type !== 'mechanism') { gerr(file, `krawędź "${relation}" → nieistniejący mechanizm ${mechanism}`); return; }
  const tuple = `${project}|${mechanism}|${relation}|${evidenceId || ''}`;
  if (evidenceId && pmTuples.has(tuple)) {
    gwarn(file, `duplikat krawędzi Evidence: ${evidenceId} już wnosi ${project} —${relation}→ ${mechanism} (liczone raz)`);
    return;
  }
  pmTuples.add(tuple);
  const key = `${project}|${mechanism}|${relation}`;
  let e = pmAgg.get(key);
  if (!e) { e = { source: project, target: mechanism, relation, evidence_ids: new Set(), provenance: new Set() }; pmAgg.set(key, e); }
  if (evidenceId) e.evidence_ids.add(evidenceId);
  if (provenance) e.provenance.add(provenance);
}

/* ── A. źródła z kart projektów ── */
for (const [pid, o] of objects) {
  if (o.fm.type !== 'project') continue;
  graphStats.projects++;
  for (const m of [].concat(o.fm.mechanisms_planned || []))
    addPmEdge(o.file, pid, m, 'planned', null, `${pid}#mechanisms_planned`);
  for (const m of [].concat(o.fm.mechanisms_confirmed || []))
    addPmEdge(o.file, pid, m, 'used', null, `${pid}#mechanisms_confirmed`);
  for (const m of [].concat((o.fm.relations || {}).uses || []))
    if (objects.has(m) && objects.get(m).fm.type === 'mechanism')
      addPmEdge(o.file, pid, m, 'used', null, `${pid}#relations.uses`);
}

/* ── B. źródła z Evidence kart mechanizmów ── */
for (const [mid, o] of objects) {
  if (o.fm.type !== 'mechanism') continue;
  graphStats.mechanisms++;
  for (const e of (o.fm.evidence || [])) {
    graphStats.evidence_total++;
    const src = String(e.source || '');
    const bt = isBacktestEv(e);
    if (bt) graphStats.evidence_backtest++;
    if (e.type === 'intention') graphStats.evidence_intention++;
    if (!e.direction) graphStats.evidence_without_direction++;

    /* mechanizm: Evidence osadzone w karcie dziedziczy jej id; jawne pole musi się zgadzać */
    const mech = e.mechanism || mid;
    if (!mech) { gerr(o.file, `Evidence ${e.id || '(bez id)'}: brak pola mechanism i brak karty-właściciela`); continue; }
    if (e.mechanism && e.mechanism !== mid) { gerr(o.file, `Evidence ${e.id}: pole mechanism="${e.mechanism}" ≠ karta właściciela ${mid}`); continue; }

    /* projekt: 1) jawne pole → 2) Record.attached_to → 3) source = proj:… */
    let project = null, reason = null;
    if (e.project) { graphStats.evidence_with_project_field++; project = e.project; }
    else if (src.startsWith('rec:')) {
      const r = objects.get(src);
      if (!r) reason = 'source rec:… nie istnieje jako Record';
      else {
        const at = [].concat((r.fm.relations || {}).attached_to || []).filter(x => String(x).startsWith('proj:'));
        if (at.length === 1) { graphStats.evidence_via_record++; project = at[0]; }
        else if (at.length === 0) reason = 'Record bez relations.attached_to → proj:';
        else reason = `Record wskazuje ${at.length} projektów przez attached_to (niejednoznaczne)`;
      }
    } else if (src.startsWith('proj:')) { graphStats.evidence_via_source_project++; project = src; }
    else reason = src ? 'source nie jest rec:… ani proj:…' : 'brak pola source';

    if (!project) {
      graphStats.evidence_unresolved++;
      graphStats.unresolved_reasons[reason] = (graphStats.unresolved_reasons[reason] || 0) + 1;
      const bucket = src.split('/')[0] || '(brak source)';
      graphStats.unresolved_by_source[bucket] = (graphStats.unresolved_by_source[bucket] || 0) + 1;
      gwarn(o.file, `Evidence ${e.id}: nie da się ustalić projektu (${reason}) — krawędź NIE powstaje (zgadywanie zabronione)`);
      continue;
    }
    if (e.id) {
      if (!evidenceProjects.has(e.id)) evidenceProjects.set(e.id, new Set());
      evidenceProjects.get(e.id).add(project);
    }

    /* typ relacji */
    const rels = [];
    if (e.type === 'intention') {
      /* intencja nie potwierdza niczego — świadomie zero krawędzi */
    } else if (bt) {
      rels.push('backtested');                                   // NIGDY "supported"
      if (e.direction === 'contradicts' || e.direction === 'limits') rels.push(DIRECTION_TO_RELATION[e.direction]);
      if (e.type === 'postmortem')
        gwarn(o.file, `Evidence ${e.id}: type="postmortem" ze źródła backtestowego (${src}) — skompilowane jako "backtested", NIE jako żywy postmortem`);
    } else if (e.direction) {
      if (!(e.direction in DIRECTION_TO_RELATION)) gerr(o.file, `Evidence ${e.id}: nieznany kierunek "${e.direction}" (dozwolone: ${Object.keys(DIRECTION_TO_RELATION).join('|')})`);
      else if (DIRECTION_TO_RELATION[e.direction]) rels.push(DIRECTION_TO_RELATION[e.direction]);
      /* neutral → świadomie brak krawędzi */
    } else {
      gwarn(o.file, `Evidence ${e.id}: brak pola direction — typ relacji nieokreślony, krawędź NIE powstaje`);
    }
    for (const r of rels) addPmEdge(o.file, project, mech, r, e.id, src || `${mid}#evidence`);
  }
}

/* sprzeczne mapowanie tego samego Evidence do kilku projektów */
for (const [evId, set] of evidenceProjects)
  if (set.size > 1) gerr('evidence', `Evidence ${evId} mapuje się do ${set.size} różnych projektów: ${[...set].sort(cmp).join(', ')} — mapowanie musi być jednoznaczne`);

/* Recordy backtestów/postmortemów bez attached_to = zerwane ogniwo Evidence → Record → Project */
for (const [rid, o] of objects) {
  if (o.fm.type !== 'record' || !/^rec:(backtests|postmortems)\//.test(rid)) continue;
  const at = [].concat((o.fm.relations || {}).attached_to || []).filter(x => String(x).startsWith('proj:'));
  if (!at.length) gwarn(o.file, 'Record backtestu/postmortemu bez relations.attached_to → proj: — Evidence z tego źródła nie da się przypisać do projektu');
}

/* ── C. materializacja: węzły + krawędzie (deterministycznie posortowane) ── */
const pmEdges = [...pmAgg.values()].map(e => ({
  source: e.source, target: e.target, relation: e.relation,
  evidence_ids: [...e.evidence_ids].sort(cmp),
  evidence_count: e.evidence_ids.size,
  provenance: [...e.provenance].sort(cmp),
}));
for (const e of pmEdges) graphStats.relations_by_type[e.relation] = (graphStats.relations_by_type[e.relation] || 0) + 1;
graphStats.pairs = new Set(pmEdges.map(e => `${e.source}|${e.target}`)).size;

const nodes = [], genericEdges = [];
for (const [id, o] of objects) {
  nodes.push({ id, label: o.fm.title, type: o.fm.type, status: o.fm.status });
  for (const [rk, targets] of Object.entries(o.fm.relations || {}))
    for (const t of [].concat(targets)) {
      const to = objects.get(t);
      if (!to) continue;
      /* krawędzie Project→Mechanism należą WYŁĄCZNIE do kompilatora powyżej */
      if (o.fm.type === 'project' && to.fm.type === 'mechanism') continue;
      genericEdges.push({ source: id, target: t, relation: rk, evidence_ids: [], evidence_count: 0, provenance: [`${id}#relations.${rk}`] });
    }
}
nodes.sort((a, b) => cmp(a.id, b.id));
const edges = genericEdges.concat(pmEdges).sort((a, b) =>
  cmp(a.source, b.source) || cmp(a.target, b.target) ||
  ((RELATION_ORDER[a.relation] ?? 99) - (RELATION_ORDER[b.relation] ?? 99)) || cmp(a.relation, b.relation));

/* ── modes ── */
const args = process.argv.slice(2);

/* --relations-report: audyt migracji krawędzi. Czysta diagnostyka, ZERO zapisu, exit 0. */
if (args[0] === '--relations-report') {
  const s = graphStats;
  const recNeeding = [...objects.values()].filter(o => o.fm.type === 'record'
    && /^rec:(backtests|postmortems)\//.test(o.fm.id)
    && ![].concat((o.fm.relations || {}).attached_to || []).some(x => String(x).startsWith('proj:')));
  console.log('\n═══ RAPORT MIGRACJI RELACJI PROJECT–MECHANISM (dry-run, zero zapisu) ═══\n');
  console.log(`1. Projekty:                          ${s.projects}`);
  console.log(`2. Evidence łącznie:                  ${s.evidence_total}`);
  console.log(`3. Evidence z jawnym polem project:   ${s.evidence_with_project_field}`);
  console.log(`4. Rozwiązywalne przez Record:        ${s.evidence_via_record} (+ ${s.evidence_via_source_project} przez source=proj:)`);
  console.log(`5. Nierozstrzygnięte:                 ${s.evidence_unresolved}`);
  console.log(`6. Unikalnych par Project–Mechanism:  ${s.pairs}  (krawędzi z typem relacji: ${pmEdges.length})`);
  console.log(`7. Rozkład wg relacji:                ${JSON.stringify(s.relations_by_type)}`);
  console.log(`8. Wymaga decyzji człowieka:          ${recNeeding.length} Recordów backtest/postmortem bez relations.attached_to`);
  if (recNeeding.length) console.log(`   ${recNeeding.slice(0, 5).map(o => o.fm.id).join(', ')}${recNeeding.length > 5 ? ` … +${recNeeding.length - 5}` : ''}`);
  console.log(`\n   Evidence typu backtest:            ${s.evidence_backtest}`);
  console.log(`   Evidence typu intention:           ${s.evidence_intention}`);
  console.log(`   Evidence bez pola direction:       ${s.evidence_without_direction}`);
  console.log(`   Powody nierozstrzygnięcia:         ${JSON.stringify(s.unresolved_reasons)}`);
  console.log(`   Nierozstrzygnięte wg źródła:       ${JSON.stringify(s.unresolved_by_source)}`);
  console.log(`\n   Błędy walidacji: ${errors.length} · ostrzeżenia: ${warnings.length}\n`);
  process.exit(0);
}

if (args[0] === '--find') {
  const q = (args[1] || '').toLowerCase();
  if (!q) { console.log('użycie: node build.js --find "fraza"'); process.exit(1); }
  let hits = 0;
  for (const [id, o] of objects) {
    const hay = (JSON.stringify(o.fm) + o.body).toLowerCase();
    if (hay.includes(q)) {
      hits++;
      const line = o.body.split('\n').find(l => l.toLowerCase().includes(q));
      console.log(`${id}  [${o.fm.type}/${o.fm.status}]  ${o.fm.title}`);
      if (line) console.log(`    …${line.trim().slice(0, 110)}…`);
    }
  }
  for (const e of events) {
    if (JSON.stringify(e).toLowerCase().includes(q)) { hits++; console.log(`${e.id}  [event/${e.kind}]  ${e.note || ''}`.slice(0, 130)); }
  }
  console.log(`\n${hits} trafień dla "${args[1]}"`);
  process.exit(0);
}

const isGraphMsg = m => m.startsWith(GRAPH_TAG);
const report = () => {
  for (const w of warnings) console.log('⚠ ' + w);
  for (const e of errors) console.log('✗ ' + e);
  const ge = errors.filter(isGraphMsg).length, gw = warnings.filter(isGraphMsg).length;
  console.log(`\n${objects.size} obiektów · ${events.length} zdarzeń · ${errors.length} błędów · ${warnings.length} ostrzeżeń`);
  console.log(`   z tego warstwa grafu: ${ge} błędów · ${gw} ostrzeżeń   |   zastane (poza grafem): ${errors.length - ge} błędów · ${warnings.length - gw} ostrzeżeń`);
};

/* ── tryb --dry-run: RAPORT MIGRACYJNY relacji. Czyta i liczy; ZERO zapisu do danych.
      Świadomie PRZED bramką błędów — musi działać także na czerwonym Genome. ── */
if (args[0] === '--dry-run' || args[0] === '--relations-report') {
  const pct = (n, d) => d ? ` (${(n / d * 100).toFixed(1)}%)` : '';
  const S = graphStats;
  console.log('\n═══ RAPORT MIGRACYJNY RELACJI Project–Mechanism (--dry-run · zero zapisu) ═══\n');
  console.log(`Projekty: ${S.projects} · Mechanizmy: ${S.mechanisms} · Evidence: ${S.evidence_total}`);
  console.log('\n— Rozwiązywanie projektu dla Evidence —');
  console.log(`  jawne pole Evidence.project ........... ${S.evidence_with_project_field}${pct(S.evidence_with_project_field, S.evidence_total)}`);
  console.log(`  przez Record.relations.attached_to .... ${S.evidence_via_record}${pct(S.evidence_via_record, S.evidence_total)}`);
  console.log(`  przez source = "proj:…" ............... ${S.evidence_via_source_project}${pct(S.evidence_via_source_project, S.evidence_total)}`);
  console.log(`  NIEROZSTRZYGNIĘTE (brak krawędzi) ..... ${S.evidence_unresolved}${pct(S.evidence_unresolved, S.evidence_total)}`);
  for (const [r, n] of Object.entries(S.unresolved_reasons).sort((a, b) => b[1] - a[1])) console.log(`      · ${r}: ${n}`);
  console.log('    wg prefiksu source:');
  for (const [s, n] of Object.entries(S.unresolved_by_source).sort((a, b) => b[1] - a[1])) console.log(`      · ${s}: ${n}`);
  console.log('\n— Cechy Evidence blokujące typ relacji —');
  console.log(`  bez pola direction .................... ${S.evidence_without_direction}${pct(S.evidence_without_direction, S.evidence_total)}`);
  console.log(`  backtest (→ backtested, NIGDY supported) ${S.evidence_backtest}`);
  console.log(`  intention (nie tworzy potwierdzenia) .. ${S.evidence_intention}`);
  console.log('\n— Wynik kompilacji —');
  console.log(`  unikalnych par Project–Mechanism ...... ${S.pairs}`);
  console.log(`  krawędzi Project–Mechanism ............ ${pmEdges.length}`);
  for (const r of GRAPH_RELATIONS) console.log(`      · ${r.padEnd(13)} ${S.relations_by_type[r] || 0}`);
  console.log('\n— Wymaga DECYZJI CZŁOWIEKA (migracja = osobny, zatwierdzany plan) —');
  const recNeed = [...objects.values()].filter(o => o.fm.type === 'record'
    && /^rec:(backtests|postmortems)\//.test(o.fm.id)
    && ![].concat((o.fm.relations || {}).attached_to || []).some(x => String(x).startsWith('proj:')));
  console.log(`  Recordy backtestów/postmortemów bez attached_to → proj: : ${recNeed.length}`);
  for (const o of recNeed.slice(0, 60)) console.log(`      · ${o.fm.id}`);
  if (recNeed.length > 60) console.log(`      … +${recNeed.length - 60}`);
  console.log('\nUWAGA: przypisania NIE są zgadywane z nazw plików ani z treści note.');
  console.log('Ten tryb niczego nie zapisuje. Żadne zdarzenie nie trafiło do Ledgera.');
  report();
  process.exit(0);
}

if (args[0] === '--check') { report(); process.exit(errors.length ? 1 : 0); }
/* Bramka błędów zostaje. --emit-despite-errors = JAWNA, głośna zgoda człowieka na
   regenerację artefaktów dist/ mimo ZASTANYCH błędów (czeka na osobną migrację).
   Niczego nie ukrywa: pełny raport błędów i tak leci na koniec. Nie dotyka danych źródłowych. */
const emitAnyway = args.includes('--emit-despite-errors');
if (errors.length && !emitAnyway) { report(); process.exit(1); }
if (errors.length) console.log(`\n⚠⚠ EMIT MIMO ${errors.length} BŁĘDÓW (--emit-despite-errors). Artefakty dist/ powstają ze stanu, który NIE jest zielony.\n`);

/* ── EMIT (deterministyczny; "data stanu" = ts ostatniego eventu) ── */
const stateTs = events.length ? events[events.length - 1].ts : 'brak-zdarzeń';
const byType = {};
for (const [, o] of objects) (byType[o.fm.type] = byType[o.fm.type] || []).push(o.fm);
for (const k of Object.keys(byType)) byType[k].sort((a, b) => a.id.localeCompare(b.id));

let idx = `# Genome INDEX (GENEROWANY — nie edytować)\n\nStan: ${stateTs} · obiektów: ${objects.size} · zdarzeń: ${events.length}\n\n`;
for (const [t, list] of Object.entries(byType).sort()) {
  const counts = {};
  for (const f of list) counts[f.status] = (counts[f.status] || 0) + 1;
  idx += `## ${t} (${list.length}) — ${Object.entries(counts).sort().map(([s, n]) => `${s}: ${n}`).join(' · ')}\n\n`;
  for (const f of list) idx += `- \`${f.id}\` ${f.title} [${f.status}]\n`;
  idx += '\n';
}
fs.mkdirSync(path.join(G, 'dist'), { recursive: true });
fs.writeFileSync(path.join(G, 'dist/INDEX.md'), idx);

/* graf kanoniczny: węzły + krawędzie (generyczne relacje + skompilowane Project↔Mechanism).
   Viewer NIE wyprowadza krawędzi samodzielnie — czyta ten dataset. */
fs.writeFileSync(path.join(G, 'dist/graph.json'), JSON.stringify({
  state: stateTs, nodes, edges,
  project_mechanism: pmEdges,
  unresolved_evidence: graphStats.evidence_unresolved,
  stats: graphStats
}, null, 1));

/* body kart wchodzi do danych — UI renderuje kanoniczną treść, nie kopię */
/* type_registry jedzie do tablicy razem z danymi: widok ma UCZYĆ SIĘ typów z ontologii,
   nie znać ich z zaszytej listy. Bez tego nowy typ jest w danych, ale niewidoczny w grafie —
   ta sama klasa awarii, która ukryła proj:thehermeticum przez zaszytą listę domen. */
const data = { state: stateTs, counts: Object.fromEntries(Object.entries(byType).map(([t, l]) => [t, l.length])), type_registry: TYPES, objects: Object.fromEntries([...objects].map(([id, o]) => [id, { ...o.fm, body: (o.body || '').trim() }])), events_count: events.length };

/* predykcje: zarejestrowane minus rozstrzygnięte/unieważnione (wyłącznie z Ledgera) */
const resolved = new Set(events.filter(e => /^prediction\.(resolved|voided)$/.test(e.kind)).map(e => e.prediction_id));
data.predictions = events.filter(e => e.kind === 'prediction.registered' && !resolved.has(e.prediction_id))
  .map(e => ({ id: e.prediction_id, on: e.on, p: e.p, claim: e.claim, deadline: e.deadline, criterion: e.criterion, registered: e.ts }));

/* graf dla viewera — TEN SAM dataset co dist/graph.json (viewer nie liczy krawędzi sam) */
data.graph = { nodes, edges, project_mechanism: pmEdges, stats: graphStats };

/* ostatnie zdarzenia — surowy stan pętli uczenia dla UI */
data.recent_events = events.slice(-30).reverse().map(e => ({ ts: e.ts, kind: e.kind, on: e.on, note: String(e.note || '').slice(0, 240) }));
fs.writeFileSync(path.join(G, 'dist/genome-data.js'), '// GENEROWANE przez build.js — nie edytować\nwindow.GENOME_DATA = ' + JSON.stringify(data) + ';\n');

/* ── METRICS (tablica 4 wskaźników — dec:2026-08-08-plan-90-dni; wyłącznie liczone) ── */
const trialsClosed = events.filter(e => e.kind === 'project.closed' && String(e.note || '').toLowerCase().includes('trial')).length;
/* UCZCIWOŚĆ (rule: reality over narrative): retro-backtest ≠ żywy dowód.
   Zweryfikowane LIVE = evidence measurement/postmortem NIE pochodzące z rec:backtests/. */
const isBacktest = ev2 => String(ev2.source || '').startsWith('rec:backtests/');
const mechVerified = [...objects.values()].filter(o => o.fm.type === 'mechanism' &&
  (o.fm.evidence || []).some(ev2 => (ev2.type === 'measurement' || ev2.type === 'postmortem') && !isBacktest(ev2))).length;
const mechBacktested = [...objects.values()].filter(o => o.fm.type === 'mechanism' &&
  (o.fm.evidence || []).some(ev2 => isBacktest(ev2))).length;
const routedTs = {}, decidedTs = {};
for (const e of events) {
  if (e.kind === 'project.routed') routedTs[e.on] = e.ts;
  if (e.kind === 'decision.decided' && e.on && e.project) decidedTs[e.project] = e.ts;
}
const iterEvents = events.filter(e => e.kind === 'project.iteration').length; // pomiar od Trial #001
let metricsMd = `# Genome — tablica 4 wskaźników (GENEROWANE)\n\nStan: ${stateTs} · źródło: Ledger (${events.length} zdarzeń). Definicje: dec:2026-08-08-plan-90-dni.\n\n`;
metricsMd += `| Wskaźnik | Wartość | Cel |\n|---|---|---|\n`;
metricsMd += `| Triale zakończone | **${trialsClosed}** / 3 | 3 |\n`;
metricsMd += `| Mechanizmy zweryfikowane ŻYWYM dowodem (measurement/postmortem spoza backtestów) | **${mechVerified}** / ${(byType.mechanism||[]).length} | rośnie |\n`;
metricsMd += `| Mechanizmy dotknięte retro-backtestem (nie liczy się jako żywy dowód) | ${mechBacktested} / ${(byType.mechanism||[]).length} | kontekst |\n`;
metricsMd += `| Śr. iteracji na projekt | **n/d** (pomiar od Trial #001: eventy project.iteration) | maleje |\n`;
metricsMd += `| Czas brief→decyzja | **n/d** (pomiar: ts routed → ts decyzji klienta per trial) | maleje |\n`;
metricsMd += `\nUczciwość: n/d znaczy n/d — wartości pojawią się wyłącznie z realnych zdarzeń, nigdy z ręki.\n`;
fs.writeFileSync(path.join(G, 'dist/METRICS.md'), metricsMd);
data.metrics = { trials_closed: trialsClosed, trials_target: 3, mech_verified: mechVerified, mech_backtested: mechBacktested, mech_total: (byType.mechanism||[]).length, iterations_avg: null, brief_to_decision: null };
const genomeDataJs = '// GENEROWANE przez build.js — nie edytować\nwindow.GENOME_DATA = ' + JSON.stringify(data) + ';\n';
fs.writeFileSync(path.join(G, 'dist/genome-data.js'), genomeDataJs);

/* ── REVISION: mały plik, po którym tablica poznaje, że dane się zmieniły ──
   Rewizja to hash WYEMITOWANYCH danych, nie czas — dwa buildy bez zmiany w Genome dają tę samą
   rewizję i tablica nie przeładowuje się bez powodu. Plik jest celowo malutki, bo tablica
   odpytuje go co kilka sekund; właściwe dane (1,3 MB) pobiera dopiero po zmianie rewizji. */
const revision = crypto.createHash('sha256').update(genomeDataJs).digest('hex').slice(0, 16);
const revisionJson = JSON.stringify({
  revision,
  generated_at: new Date().toISOString(),
  objects: Object.keys(data.objects || {}).length,
  events: data.events_count || 0,
  errors: errors.length,
}, null, 1) + '\n';
fs.writeFileSync(path.join(G, 'dist/REVISION.json'), revisionJson);

/* ── auto-sync viewera: każdy build nadpisuje dane Genome OS (żadnego ręcznego kopiowania) ── */
const viewerDir = path.join(G, '..', '..', 'genome-os', 'js');
const viewerData = path.join(viewerDir, 'genome-f0-data.js');
if (fs.existsSync(viewerDir)) {
  fs.writeFileSync(viewerData, genomeDataJs);
  /* Rewizja leci OSTATNIA i tylko wtedy, gdy dane już leżą na dysku. Odwrotna kolejność
     kazałaby tablicy pobrać nowe dane, zanim powstaną. */
  fs.writeFileSync(path.join(viewerDir, 'genome-revision.json'), revisionJson);
}

report();
console.log('✓ dist/INDEX.md · dist/graph.json · dist/genome-data.js · dist/METRICS.md · dist/REVISION.json · genome-os/js/');
console.log(`  rewizja danych: ${revision}`);
