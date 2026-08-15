#!/usr/bin/env node
/* ═══ KONTRAKTY JAKOŚCI: Research · Measurement · Doublecheck · Zgoda ═══  v3 (scalona)
 * Deterministyczne walidatory (ZERO LLM). Sesja produkuje dane, ten kod je ocenia.
 * ZERO PRAW ZAPISU. Czyta wyłącznie klucz akceptacji (read-only), żeby zweryfikować podpis.
 * NIE MA funkcji generującej podpis — agent nie może podpisać pakietu, którym sam się chwali.
 *
 * v3 zamyka blokery audytu 09.08 (runda 2):
 *   • odcisk zgody obejmuje CAŁY pakiet decyzyjny (claims, pełne rekordy researchu, routing,
 *     mechanizmy, frameworki, metryki, Project Contract, predykcje, baseline, zakres, NON-SCOPE,
 *     wersję schematu, nonce, termin ważności) — nie wybrane fragmenty,
 *   • strukturalny `direction: supports|contradicts|neutral` rozdzielony od `decision_impact`;
 *     jednostronność wykrywa się na kierunku dowodowym, nie na tym, że research coś zmienił.
 *
 * DOCELOWA LOKALIZACJA: r352-os/genome/lib/research-contract.js
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

/* ─────────── słowniki ─────────── */
const SOURCE_TYPES = ['strona-firmy', 'dokumentacja', 'raport-branzowy', 'artykul', 'social',
  'rozmowa', 'dokument-wewnetrzny', 'pomiar-wlasny', 'inne'];
const PUBLIC_TYPES = ['strona-firmy', 'dokumentacja', 'raport-branzowy', 'artykul', 'social'];
const NEEDS_PRIMARY_BASIS = ['raport-branzowy', 'artykul', 'social', 'inne'];
const PRIMARY_SECONDARY = ['primary', 'secondary'];
const CONFIDENCE = ['high', 'medium', 'low'];
const DATA_QUALITY = ['verified', 'partial', 'unverified', 'n/d'];
const IMPACT_KINDS = ['mechanism', 'scope', 'workflow', 'guard', 'prediction', 'metric', 'decision', 'none'];
/* kierunek dowodowy — CO rekord robi z tezą. Ortogonalny do decision_impact (CO ZMIENIA). */
const DIRECTIONS = ['supports', 'contradicts', 'neutral'];

const APPROVAL_SCHEMA_VERSION = 'genome-approval/1';
const VANITY = /^(wyświetlenia|impressions|odsłony|zasięg|reach|polubienia|likes|obserwujący|followers|kliknięcia|clicks|ruch|sessions|wizyty)$/i;

/* ─────────── pomocnicze ─────────── */
const isStr = v => typeof v === 'string';
const filled = v => isStr(v) && v.trim().length > 0;
function isRealDate(s) {
  if (!isStr(s) || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}
const todayISO = () => new Date().toISOString().slice(0, 10);

/* ═══════════ 1. RESEARCH RECORD ═══════════ */
const RESEARCH_FIELDS = ['claim', 'source_title', 'publisher', 'published_at', 'accessed_at',
  'source_type', 'primary_or_secondary', 'observation', 'interpretation', 'confidence',
  'contradicting_sources', 'direction', 'decision_impact', 'limitations'];

function normalizeImpact(v) {
  if (v === undefined || v === null) return { ok: false, why: 'brak pola decision_impact', kinds: [], targets: [], note: '' };
  if (isStr(v)) {
    if (v === 'NO_DECISION_IMPACT' || v === 'none' || v === 'n/d' || v.trim() === '')
      return { ok: true, kinds: ['none'], targets: [], note: '' };
    return { ok: false, why: 'decision_impact jako wolny tekst nie jest dopuszczalny — wymagane { changes:[…], targets:[…], note }', kinds: [], targets: [], note: v };
  }
  if (Array.isArray(v)) return normalizeImpact({ changes: v });
  if (typeof v !== 'object') return { ok: false, why: `decision_impact ma zły typ (${typeof v})`, kinds: [], targets: [], note: '' };

  const kinds = [].concat(v.changes || []).filter(isStr);
  if (!kinds.length) return { ok: false, why: 'decision_impact.changes puste — użyj ["none"], jeśli research niczego nie zmienia', kinds: [], targets: [], note: '' };
  const bad = kinds.filter(k => !IMPACT_KINDS.includes(k));
  if (bad.length) return { ok: false, why: `decision_impact.changes spoza słownika: ${bad.join(', ')} (${IMPACT_KINDS.join('|')})`, kinds: [], targets: [], note: '' };
  if (kinds.includes('none') && kinds.length > 1)
    return { ok: false, why: '"none" nie może występować razem z innymi rodzajami wpływu', kinds: [], targets: [], note: '' };
  const targets = [].concat(v.targets || []).filter(filled);
  if (!kinds.includes('none') && !targets.length)
    return { ok: false, why: 'decision_impact deklaruje zmianę, ale nie wskazuje targets (co konkretnie się zmienia)', kinds, targets, note: v.note || '' };
  return { ok: true, kinds, targets, note: isStr(v.note) ? v.note : '' };
}

function validateResearchRecord(r, opts = {}) {
  const errors = [], warnings = [];
  const today = opts.today || todayISO();
  if (!r || typeof r !== 'object' || Array.isArray(r))
    return { ok: false, errors: ['rekord researchu nie jest obiektem'], warnings: [], decision_impact: 'NO_DECISION_IMPACT', impact_kinds: [], impact_targets: [], direction: null };

  for (const f of RESEARCH_FIELDS) {
    if (r[f] === undefined) { errors.push(`brak pola "${f}"`); continue; }
    if (f === 'contradicting_sources') {
      if (!Array.isArray(r[f])) errors.push('contradicting_sources musi być tablicą (pustą, jeśli brak)');
      else if (r[f].some(x => !filled(x))) errors.push('contradicting_sources zawiera pusty wpis');
      continue;
    }
    if (f === 'decision_impact') continue;
    if (!isStr(r[f])) { errors.push(`pole "${f}" musi być tekstem (jest ${Array.isArray(r[f]) ? 'tablicą' : typeof r[f]})`); continue; }
    if (!filled(r[f])) errors.push(`pole "${f}" jest puste — sam klucz nie wystarcza`);
  }

  /* kierunek dowodowy */
  if (r.direction !== undefined && !DIRECTIONS.includes(r.direction))
    errors.push(`direction musi być supports|contradicts|neutral (jest: "${r.direction}")`);

  /* model źródła: URL tylko tam, gdzie źródło jest publiczne */
  const st = r.source_type;
  if (st !== undefined && !SOURCE_TYPES.includes(st))
    errors.push(`source_type spoza słownika: "${st}" (${SOURCE_TYPES.join('|')})`);
  if (PUBLIC_TYPES.includes(st)) {
    if (!filled(r.source_url)) errors.push(`źródło publiczne (${st}) wymaga source_url — bez niego nikt tego nie sprawdzi`);
    else if (!/^https?:\/\/[^\s]+$/.test(r.source_url)) errors.push(`source_url nie jest adresem: "${r.source_url}"`);
  } else if (SOURCE_TYPES.includes(st)) {
    if (!filled(r.source_ref))
      errors.push(`źródło niepubliczne (${st}) wymaga source_ref — kto/co/kiedy (np. "rozmowa z M. Kowalską 2026-08-05, notatka rec:…")`);
    if (!filled(r.verification_path))
      errors.push(`źródło niepubliczne (${st}) wymaga verification_path — jak INNA osoba to zweryfikuje`);
    if (filled(r.source_url) && !/^https?:\/\/[^\s]+$/.test(r.source_url))
      errors.push(`source_url podany, ale nie jest adresem: "${r.source_url}"`);
  }

  /* daty realne */
  if (r.accessed_at !== undefined) {
    if (!isRealDate(r.accessed_at)) errors.push(`accessed_at musi być realną datą YYYY-MM-DD (jest: "${r.accessed_at}")`);
    else if (r.accessed_at > today) errors.push(`accessed_at "${r.accessed_at}" jest w przyszłości — źródła nie da się odczytać przed dzisiaj (${today})`);
  }
  if (r.published_at !== undefined && r.published_at !== 'n/d') {
    if (!isRealDate(r.published_at)) errors.push(`published_at musi być realną datą YYYY-MM-DD albo dokładnie "n/d" (jest: "${r.published_at}")`);
    else {
      if (r.published_at > today) errors.push(`published_at "${r.published_at}" jest w przyszłości`);
      if (isRealDate(r.accessed_at) && r.published_at > r.accessed_at)
        errors.push(`published_at (${r.published_at}) jest późniejsze niż accessed_at (${r.accessed_at}) — nie da się odczytać źródła przed publikacją`);
    }
  }
  if (r.published_at === 'n/d') warnings.push('brak daty publikacji (n/d) — twierdzenie nie może być użyte jako dowód aktualności');

  /* primary/secondary jako relacja do KONKRETNEGO claimu */
  if (r.primary_or_secondary !== undefined && !PRIMARY_SECONDARY.includes(r.primary_or_secondary))
    errors.push(`primary_or_secondary musi być primary|secondary (jest: "${r.primary_or_secondary}")`);
  if (r.primary_or_secondary === 'primary' && NEEDS_PRIMARY_BASIS.includes(st) && !filled(r.primary_basis))
    errors.push(`"${st}" bywa pierwotne, ale nie z definicji: uzasadnij polem primary_basis, dlaczego jest pierwotne DLA TEGO claimu`);
  if (r.primary_or_secondary === 'secondary' && filled(r.primary_basis))
    warnings.push('primary_basis wypełnione przy źródle secondary — zignorowane');

  if (filled(r.observation) && filled(r.interpretation) && r.observation.trim() === r.interpretation.trim())
    errors.push('observation i interpretation są identyczne — fakt i wniosek muszą być rozdzielone');
  if (r.confidence !== undefined && !CONFIDENCE.includes(r.confidence))
    errors.push(`confidence musi być high|medium|low (jest: "${r.confidence}")`);

  const contra = Array.isArray(r.contradicting_sources) ? r.contradicting_sources.filter(filled) : [];
  if (contra.length) {
    if (r.confidence === 'high') errors.push(`confidence "high" przy ${contra.length} źródłach przeciwnych — obniż do medium/low albo rozstrzygnij sprzeczność`);
    if (!filled(r.limitations) || r.limitations === 'n/d') errors.push('są źródła przeciwne, a limitations puste — ograniczenie musi być nazwane');
  }

  const imp = normalizeImpact(r.decision_impact);
  if (!imp.ok) errors.push(imp.why);

  const ok = errors.length === 0;
  return {
    ok, errors, warnings,
    decision_impact: (ok && !imp.kinds.includes('none')) ? 'IMPACT' : 'NO_DECISION_IMPACT',
    impact_kinds: ok ? imp.kinds : [],
    impact_targets: ok ? imp.targets : [],
    direction: ok ? r.direction : null,
  };
}

function summarizeResearch(records, opts = {}) {
  const list = Array.isArray(records) ? records : [];
  const results = list.map(r => validateResearchRecord(r, opts));
  const valid = results.filter(r => r.ok);
  const impactful = valid.filter(r => r.decision_impact === 'IMPACT');
  const kinds = {}; for (const r of impactful) for (const k of r.impact_kinds) kinds[k] = (kinds[k] || 0) + 1;
  const dirs = { supports: 0, contradicts: 0, neutral: 0 };
  for (const r of valid) if (dirs[r.direction] !== undefined) dirs[r.direction]++;
  return {
    total: list.length, valid: valid.length, invalid: results.length - valid.length,
    impactful: impactful.length, no_decision_impact: valid.length - impactful.length,
    impact_kinds: kinds, directions: dirs, results,
  };
}

/* ═══════════ 2. MEASUREMENT READINESS ═══════════ */
const METRIC_FIELDS = ['decision_supported', 'metric', 'baseline', 'target', 'measurement_source',
  'measurement_method', 'measurement_date', 'resolution_owner', 'known_limitations',
  'data_quality', 'fallback_if_unavailable'];

function assessMetric(m) {
  const blockers = [], limits = [];
  if (!m || typeof m !== 'object' || Array.isArray(m))
    return { metric: '(nie-obiekt)', state: 'BLOCKED', blockers: ['metryka nie jest obiektem'], limits: [] };
  if (!filled(m.decision_supported) || m.decision_supported === 'n/d')
    blockers.push('metryka nie wspiera żadnej decyzji — nie zbieramy danych na wszelki wypadek');
  if (!filled(m.metric)) blockers.push('brak pola metric');
  if (!filled(m.measurement_source) || m.measurement_source === 'n/d') blockers.push('brak measurement_source (skąd wezmą się dane)');
  if (!isRealDate(m.measurement_date)) blockers.push(`measurement_date musi być realną datą YYYY-MM-DD (jest: "${m.measurement_date === undefined ? 'brak' : m.measurement_date}")`);
  if (!filled(m.resolution_owner) || m.resolution_owner === 'n/d') blockers.push('brak resolution_owner (kto rozliczy)');
  if (!filled(m.target) || m.target === 'n/d') blockers.push('brak target/kryterium rozstrzygnięcia — inaczej wyniku nie da się ocenić');
  if (m.baseline === undefined) blockers.push('brak pola baseline (użyj "n/d", jeśli danych nie ma)');
  else if (!isStr(m.baseline)) blockers.push(`baseline musi być tekstem (jest ${typeof m.baseline})`);
  else if (m.baseline === 'n/d') limits.push('brak baseline (n/d) — delty nie da się policzyć, tylko stan końcowy');
  else if (!filled(m.baseline)) blockers.push('baseline jest pusty — użyj "n/d", jeśli danych nie ma');
  if (!filled(m.measurement_method) || m.measurement_method === 'n/d') limits.push('brak measurement_method — sposób pomiaru niesprecyzowany');
  if (!filled(m.fallback_if_unavailable) || m.fallback_if_unavailable === 'n/d') limits.push('brak fallback_if_unavailable — nie wiadomo, co gdy źródło zawiedzie');
  if (m.data_quality === undefined) blockers.push('brak pola data_quality');
  else if (!DATA_QUALITY.includes(m.data_quality)) blockers.push(`data_quality spoza słownika: "${m.data_quality}" (${DATA_QUALITY.join('|')})`);
  else if (m.data_quality === 'unverified') limits.push('data_quality "unverified" — dashboard nie jest dowodem poprawności instrumentacji');
  if (filled(m.known_limitations) && m.known_limitations !== 'n/d') limits.push(`znane ograniczenia instrumentacji: ${String(m.known_limitations).slice(0, 80)}`);
  if (m.is_primary_outcome && VANITY.test(String(m.metric || '').trim()) && !filled(m.vanity_justification))
    blockers.push(`"${m.metric}" to metryka próżności — jako główny Outcome wymaga pola vanity_justification`);
  const state = blockers.length ? 'BLOCKED' : (limits.length ? 'PARTIAL' : 'READY');
  return { metric: filled(m.metric) ? m.metric : '(bez nazwy)', state, blockers, limits };
}

function measurementReadiness(metrics) {
  const list = Array.isArray(metrics) ? metrics : [];
  if (!list.length)
    return { measurement_readiness: 'BLOCKED', metrics: [], blockers: ['nie zdefiniowano ŻADNEJ metryki — projekt bez metryki nie może zamrozić predykcji'] };
  const per = list.map(assessMetric);
  const state = per.some(x => x.state === 'BLOCKED') ? 'BLOCKED' : per.some(x => x.state === 'PARTIAL') ? 'PARTIAL' : 'READY';
  return { measurement_readiness: state, metrics: per, blockers: per.flatMap(x => x.blockers) };
}

/* ═══════════ 3. ZGODA CZŁOWIEKA — PRZENIESIONA ═══════════
 * Weryfikacja zgody NIE ŻYJE JUŻ TUTAJ. Poprzednia wersja używała HMAC z możliwością wskazania
 * klucza (GENOME_APPROVAL_KEY / opts.keyPath / TMPDIR) — czyli każdy proces, który potrafił
 * wskazać klucz, potrafił też podpisać. Zastąpione podpisem asymetrycznym Ed25519:
 *
 *     lib/approval.js  →  verifyApproval(approval, input)
 *
 * Klucz prywatny wyłącznie u właściciela, writer ma tylko publiczny, zero override.
 * Ten moduł zajmuje się WYŁĄCZNIE jakością treści: research, metryki, Doublecheck, bramki fazowe.
 */
const APPROVAL_MOVED = 'lib/approval.js';

/* Kompletność Project Contract — sprawdzana OSOBNO od podpisu.
   Podpis chroni integralność; ta funkcja pilnuje, czy jest co chronić. */
const APPROVAL = require('./approval.js');
/* Delegacja: pełny schemat Project Contract żyje w lib/approval.js razem z podpisem,
   bo to on decyduje, CO jest podpisywane. Tu zostaje wyłącznie fasada dla bramek. */
function validateProjectContract(pc, opts = {}) { return APPROVAL.validateProjectContract(pc); }
function _unusedValidateProjectContract(pc, opts = {}) {
  const errors = [];
  if (!pc || typeof pc !== 'object' || Array.isArray(pc)) return { ok: false, errors: ['project_contract nie jest obiektem'] };
  for (const f of CONTRACT_FIELDS) {
    if (pc[f] === undefined || pc[f] === null) { errors.push(`Project Contract bez pola "${f}"`); continue; }
    if (['mechanisms', 'frameworks'].includes(f)) { if (!Array.isArray(pc[f])) errors.push(`"${f}" musi być tablicą`); continue; }
    if (!filled(pc[f])) errors.push(`Project Contract: pole "${f}" jest puste`);
  }
  if (pc.go_decision !== undefined && pc.go_decision !== null && !GO_DECISIONS.includes(pc.go_decision))
    errors.push(`go_decision musi być GO|REVISE|STOP (jest: "${pc.go_decision}")`);
  if (filled(pc.prepared_by) && filled(pc.decided_by)) {
    if (pc.prepared_by === pc.decided_by) errors.push('prepared_by === decided_by — ten sam podmiot nie może przygotować i zatwierdzić');
    if (/^(session|agent|migration|ingest)[:\-]/i.test(pc.decided_by)) errors.push(`decided_by "${pc.decided_by}" wygląda na agenta — decyzję GO podejmuje człowiek`);
  }
  for (const f of ['project_start', 'measurement_date'])
    if (filled(pc[f]) && !isRealDate(pc[f])) errors.push(`"${f}" musi być realną datą YYYY-MM-DD (jest: "${pc[f]}")`);
  if (isRealDate(pc.project_start) && isRealDate(pc.measurement_date) && pc.measurement_date <= pc.project_start)
    errors.push('measurement_date nie jest późniejsza niż project_start');
  return { ok: errors.length === 0, errors };
}

/* ═══════════ 4. DOUBLECHECK ═══════════ */
function doublecheck(report, opts = {}) {
  const findings = [];
  const r0 = report || {};
  const claims = r0.claims || [];
  const research = r0.research || [];
  const recommended = [].concat(r0.recommended_mechanisms || []).concat(r0.recommended_frameworks || []);
  const summary = summarizeResearch(research, opts);

  /* Warstwa 1 — ekstrakcja */
  const facts = claims.filter(c => c && c.kind === 'fact');
  if (!claims.length) findings.push({ level: 'REVISE', what: 'raport nie wyodrębnia żadnych weryfikowalnych twierdzeń (warstwa 1)' });
  for (const c of claims)
    if (!c || !['fact', 'recommendation', 'opinion'].includes(c.kind))
      findings.push({ level: 'REVISE', what: `twierdzenie "${String((c && c.text) || '').slice(0, 50)}" bez klasyfikacji fact|recommendation|opinion` });

  /* Warstwa 2 — źródła */
  for (const f of facts) {
    const idx = research.findIndex(r => r && r.claim === f.text);
    if (idx < 0) { findings.push({ level: 'REVISE', what: `fakt bez źródła: "${String(f.text).slice(0, 60)}"` }); continue; }
    const v = summary.results[idx];
    if (!v.ok) findings.push({ level: 'REVISE', what: `źródło do "${String(f.text).slice(0, 40)}" nie spełnia kontraktu: ${v.errors[0]}` });
    if ((research[idx].contradicting_sources || []).filter(filled).length)
      findings.push({ level: 'LIMIT', what: `twierdzenie ma źródło przeciwne — obowiązuje ograniczenie: "${String(f.text).slice(0, 50)}"` });
  }

  /* Warstwa 3 — adwersaryjna */
  const evidenceBacked = new Set([].concat(r0.evidence_backed || []));
  const targetsAll = new Set(summary.results.flatMap(r => r.impact_targets || []));
  for (const m of recommended)
    if (!targetsAll.has(m) && !evidenceBacked.has(m))
      findings.push({ level: 'LIMIT', what: `${m} bez oparcia: ani w researchu, ani w Evidence z Genome` });

  if (summary.valid > 0 && summary.impactful === 0)
    findings.push({ level: 'REVISE', what: `${summary.valid} poprawnych rekordów researchu i ŻADEN niczego nie zmienia (mechanizm, zakres, workflow, guard, predykcja, metryka, decyzja) — research jako ozdoba, nie przesłanka` });
  if (summary.invalid > 0)
    findings.push({ level: 'REVISE', what: `${summary.invalid} z ${summary.total} rekordów researchu nie spełnia kontraktu — nieważny rekord nie liczy się do niczego` });

  /* jednostronność MIERZY SIĘ KIERUNKIEM DOWODOWYM, nie tym, że research coś zmienił.
     Rekord `contradicts`, który zmienia decyzję, jest dowodem uczciwości, nie potwierdzeniem tezy. */
  const d = summary.directions;
  if (summary.valid >= 3 && d.supports === summary.valid && d.contradicts === 0 && d.neutral === 0)
    findings.push({ level: 'LIMIT', what: `wszystkie ${summary.valid} rekordy mają direction:"supports", zero contradicts i zero neutral — sprawdź, czy research nie był dobierany pod tezę` });

  /* Warstwa 4 — niezależność */
  const review = r0.approval_state ? { state: r0.approval_state, why: r0.approval_why || '' }
    : { state: 'unverified', why: 'nie przekazano wyniku weryfikacji podpisu (lib/approval.js)' };
  if (r0.author && r0.reviewer && r0.author === r0.reviewer)
    findings.push({ level: 'REVISE', what: 'ten sam podmiot napisał i zrecenzował raport — bramka nie może zatwierdzić własnego raportu' });
  if (review.state === 'invalid' || review.state === 'expired')
    findings.push({ level: 'REVISE', what: `zgoda nieważna (${review.state}): ${review.why}` });
  if (review.state !== 'verified')
    findings.push({ level: 'INFO', what: `niezależność review NIE jest potwierdzona (${review.state}): ${review.why}. Werdykt dotyczy wyłącznie jakości treści.` });

  const verdict = findings.some(f => f.level === 'REVISE') ? 'REVISE'
    : findings.some(f => f.level === 'LIMIT') ? 'PASS_WITH_LIMITATIONS' : 'PASS';
  return {
    verdict, findings, blocks_contract: verdict === 'REVISE',
    independent_review: review.state,
    research_summary: { total: summary.total, valid: summary.valid, invalid: summary.invalid, impactful: summary.impactful, impact_kinds: summary.impact_kinds, directions: summary.directions },
  };
}

/* ═══════════ 5. BRAMKI FAZOWE ═══════════
 * USUNIĘCIE CYRKULARNOŚCI: kontrakt startu wymagał podpisu, podpis wymagał metryk, a metryki
 * powstają dopiero po diagnozie — więc SALT nie mógł ruszyć. Bramki są teraz fazowe:
 *
 *   Research  →  researchGate    (jakość źródeł; ŻADNYCH metryk, ŻADNEGO podpisu)
 *   SALT draft→  foundationGate  (podpisany wynik SALT ALBO świeży, sprawdzalny ref strategii)
 *   PLATE     →  (na zatwierdzonym fundamencie)
 *   Contract  →  contractGate    (Doublecheck + Measurement + routing + podpisane GO)
 */
function researchGate({ doublecheck: dc }) {
  const blockers = [];
  if (!dc) blockers.push('brak wyniku Doublecheck');
  else if (dc.blocks_contract) blockers.push(`Doublecheck: ${dc.verdict}`);
  return { can_proceed: blockers.length === 0, blockers, phase: 'research' };
}

/* Fundament: albo PODPISANY wynik SALT (zgoda fazy "foundation"), albo świeży ref strategii. */
function foundationGate({ routing, salt_approval }) {
  const blockers = [];
  if (!routing) return { can_proceed: false, blockers: ['brak wyniku routingu'], phase: 'foundation' };
  if (routing.decision === 'INVALID_BRIEF') blockers.push('brief strukturalny nie spełnia kontraktu');
  if (routing.decision === 'UNRESOLVED') blockers.push(`warstwa strategiczna UNRESOLVED — ${(routing.unresolved || [])[0] || 'nierozstrzygnięte pole krytyczne'}`);
  if (routing.needs && routing.needs.plate) {
    const fromStrategy = routing.foundation === 'existing_strategy';
    const fromSalt = salt_approval && salt_approval.state === 'verified';
    if (!fromStrategy && !fromSalt)
      blockers.push('PLATE wymaga zatwierdzonego fundamentu: podpisanego wyniku SALT albo świeżego, sprawdzalnego ref strategii — nie ma żadnego z nich');
  }
  return { can_proceed: blockers.length === 0, blockers, phase: 'foundation' };
}

function contractGate({ doublecheck: dc, measurement, routing, project_contract, human_review_required = true }) {
  const blockers = [];
  if (!dc) blockers.push('brak wyniku Doublecheck');
  else {
    if (dc.blocks_contract) blockers.push(`Doublecheck: ${dc.verdict}`);
    if (human_review_required && dc.independent_review !== 'verified')
      blockers.push(`brak zweryfikowanej zgody człowieka (stan: ${dc.independent_review}) — kontrakt zamraża predykcje, więc wymaga śladu, którego agent nie umie wytworzyć`);
  }
  if (!measurement) blockers.push('brak oceny Measurement Readiness');
  else if (measurement.measurement_readiness === 'BLOCKED')
    blockers.push(`Measurement Readiness: BLOCKED — ${(measurement.blockers || [])[0] || 'brak szczegółu'}`);
  if (routing) {
    if (routing.decision === 'UNRESOLVED') blockers.push(`warstwa strategiczna UNRESOLVED — ${(routing.unresolved || [])[0] || 'nierozstrzygnięte pole krytyczne'}`);
    if (routing.decision === 'INVALID_BRIEF') blockers.push('brief strukturalny nie spełnia kontraktu');
    if (routing.blocked) blockers.push(`bramka warstwy strategicznej: ${(routing.gates || []).filter(g => g.status === 'BLOCKED').map(g => g.detail)[0] || 'PLATE bez fundamentu'}`);
  }
  if (project_contract !== undefined) {
    const v = validateProjectContract(project_contract);
    if (!v.ok) blockers.push(`Project Contract niekompletny: ${v.errors[0]}${v.errors.length > 1 ? ` (+${v.errors.length - 1})` : ''}`);
  }
  return { can_freeze: blockers.length === 0, blockers, phase: 'contract' };
}

module.exports = {
  RESEARCH_FIELDS, METRIC_FIELDS, SOURCE_TYPES, PUBLIC_TYPES, DATA_QUALITY, IMPACT_KINDS, DIRECTIONS,
  APPROVAL_MOVED,
  isRealDate, normalizeImpact,
  validateResearchRecord, summarizeResearch, assessMetric, measurementReadiness,
  validateProjectContract,
  doublecheck, researchGate, foundationGate, contractGate,
};
