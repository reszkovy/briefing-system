#!/usr/bin/env node
/* ═══ WARSTWA STRATEGICZNA: wf:salt · wf:plate ═══  (scalenie dwóch implementacji)
 * Deterministyczny klasyfikator. ZERO LLM, zero sieci, zero praw zapisu.
 *
 * JEDNO ŹRÓDŁO PRAWDY: treść domenowa frameworków żyje WYŁĄCZNIE w kartach
 * `workflows/salt.md` i `workflows/plate.md`. Ten moduł odpowiada tylko na pytanie
 * KTÓRY framework jest potrzebny, DLACZEGO i W JAKIEJ KOLEJNOŚCI — oraz pilnuje bramek.
 * Skille i Router WOŁAJĄ ten moduł; nie odtwarzają jego reguł.
 *
 * Falsyfikowalny claim stojący za tą warstwą: `mech:strategy-before-execution`
 * (tam żyje confidence i Evidence; karty workflow ich nie mają — byłyby stanem niewalidowanym).
 *
 * Kierunek: Research/Benchmark → SALT → PLATE → wykonanie.
 * DOCELOWA LOKALIZACJA: r352-os/genome/lib/strategy-frameworks.js
 */
'use strict';

const SALT = 'wf:salt';
const PLATE = 'wf:plate';
const CLAIM = 'mech:strategy-before-execution';
const PROBLEM_TYPES = ['percepcyjny', 'produktowy', 'cenowy', 'dystrybucyjny', 'nieznany'];
const STRATEGY_FRESH_MONTHS = 12;
const CONTENT_SOURCE = 'r352-os/genome/workflows/{salt,plate}.md';
/* Jawna sekwencja faz. Bramka kontraktu obowiązuje DOPIERO w fazie 'contract' —
   wymaganie jej przed SALT było cyrkularne (metryki powstają po diagnozie). */
const PROCESS_PHASES = [
  { phase: 'research',   gate: 'researchGate',   produces: 'rekordy researchu' },
  { phase: 'salt_draft', gate: null,             produces: 'projekt diagnozy S/A/L/T + odkrycia' },
  { phase: 'foundation', gate: 'foundationGate', produces: 'ZATWIERDZONY fundament: podpisany SALT albo świeży ref strategii' },
  { phase: 'plate',      gate: null,             produces: 'ścieżka, blokady, cele, tematy, kalendarz' },
  { phase: 'contract',   gate: 'contractGate',   produces: 'Project Contract + predykcje' },
  { phase: 'go',         gate: 'podpis człowieka', produces: 'GO | REVISE | STOP' },
];

/* Pola briefu. `undefined` = brief niekompletny (INVALID_BRIEF).
   `null` = jawnie nie wiemy — dla pól KRYTYCZNYCH kończy się UNRESOLVED, nigdy cichym pominięciem. */
const BRIEF_FIELDS = [
  'audience_is_market',          /* bool|null  KRYTYCZNE — czy odbiorcą wyniku jest rynek, czy system */
  'positioning_stated',          /* bool|null  KRYTYCZNE — czy zespół potrafi 1 zdaniem: komu i czym wygrywa */
  'positioning_consequences',    /* bool|null  KRYTYCZNE — czy wynik zmienia pozycję rynkową */
  'needs_ongoing_communication', /* bool|null  KRYTYCZNE — czy trzeba zaplanować co/gdzie/kiedy komunikujemy */
  'single_artifact',             /* bool|null  — jednorazowy artefakt bez ciągłości */
  'existing_strategy',           /* obiekt|null — {ref, source, approved_at, challenged_by_brief} */
  'continuity_horizon_days',     /* number|null — horyzont komunikacji */
  'execution_capacity_days',     /* number|null — realne dni produkcyjne w horyzoncie 90 */
  'dominant_problem',            /* string — z PROBLEM_TYPES; 'nieznany' jest legalny przed SALT */
  'salt_approved',               /* bool — czy wynik SALT jest już zatwierdzony w tym przebiegu */
];
/* Pola, których brak wiedzy NIE może po cichu wyłączyć frameworku */
const CRITICAL_FIELDS = ['audience_is_market', 'positioning_stated', 'positioning_consequences', 'needs_ongoing_communication'];

const isStr = v => typeof v === 'string' && v.trim().length > 0;
const isBool = v => typeof v === 'boolean';
const isRealDate = s => {
  if (!isStr(s) || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
};
const monthsBetween = (a, b) => {
  const x = new Date(a + 'T00:00:00Z'), y = new Date(b + 'T00:00:00Z');
  if (isNaN(x) || isNaN(y)) return null;
  return (y.getUTCFullYear() - x.getUTCFullYear()) * 12 + (y.getUTCMonth() - x.getUTCMonth());
};
/* Referencja do strategii musi być SPRAWDZALNA, nie dowolnym truthy stringiem. */
const REF_PATTERN = /^(rec|proj|dec|wf|cli):[a-z0-9][a-z0-9\-\/_.]*$/i;

function validateBrief(b) {
  const errors = [];
  if (!b || typeof b !== 'object' || Array.isArray(b)) return { ok: false, errors: ['brief nie jest obiektem'] };
  for (const f of BRIEF_FIELDS) if (b[f] === undefined) errors.push(`brief bez pola "${f}" — użyj null, jeśli nie wiesz (pominięcie pola jest gorsze niż luka)`);
  for (const f of ['audience_is_market', 'positioning_stated', 'positioning_consequences', 'needs_ongoing_communication', 'single_artifact', 'salt_approved'])
    if (b[f] !== undefined && b[f] !== null && !isBool(b[f])) errors.push(`"${f}" musi być boolean albo null`);
  for (const f of ['continuity_horizon_days', 'execution_capacity_days'])
    if (b[f] !== undefined && b[f] !== null && typeof b[f] !== 'number') errors.push(`"${f}" musi być liczbą albo null`);
  if (b.dominant_problem !== undefined && !PROBLEM_TYPES.includes(b.dominant_problem))
    errors.push(`"dominant_problem" spoza słownika (${PROBLEM_TYPES.join('|')})`);
  if (b.existing_strategy !== undefined && b.existing_strategy !== null && (typeof b.existing_strategy !== 'object' || Array.isArray(b.existing_strategy)))
    errors.push('"existing_strategy" musi być obiektem {ref, source, approved_at, challenged_by_brief} albo null');
  return { ok: errors.length === 0, errors };
}

/* Ocena fundamentu — osobno, żeby dało się ją testować i cytować w raporcie. */
function assessFoundation(existing, today) {
  if (existing === null || existing === undefined)
    return { valid: false, fresh: false, why: 'brak wskazanej strategii' };
  const problems = [];
  if (!isStr(existing.ref)) problems.push('brak pola ref');
  else if (!REF_PATTERN.test(existing.ref)) problems.push(`ref "${existing.ref}" nie jest sprawdzalnym odniesieniem Genome (rec:|proj:|dec:|wf:|cli:)`);
  if (!isStr(existing.source)) problems.push('brak pola source (gdzie ta strategia fizycznie jest)');
  if (!isRealDate(existing.approved_at)) problems.push(`approved_at nie jest realną datą ("${existing.approved_at}") — bez daty nie da się ocenić świeżości`);
  if (problems.length) return { valid: false, fresh: false, why: `odniesienie do strategii nie jest sprawdzalne: ${problems.join('; ')}` };

  const age = monthsBetween(existing.approved_at, today);
  if (age === null || age < 0) return { valid: false, fresh: false, why: `approved_at (${existing.approved_at}) jest w przyszłości względem ${today}` };
  if (age > STRATEGY_FRESH_MONTHS) return { valid: true, fresh: false, age, why: `strategia ma ${age} mies. (> ${STRATEGY_FRESH_MONTHS}) — fundament wymaga odświeżenia` };
  if (existing.challenged_by_brief === true) return { valid: true, fresh: false, age, why: 'brief kwestionuje istniejącą strategię — diagnoza wraca na stół' };
  return { valid: true, fresh: true, age, why: `fundament: ${existing.ref} (${existing.source}, ${existing.approved_at}, ${age} mies.), brief go nie kwestionuje` };
}

function routeFrameworks(brief, opts = {}) {
  const today = opts.today || new Date().toISOString().slice(0, 10);
  const v = validateBrief(brief);
  if (!v.ok) return result('INVALID_BRIEF', false, false, v.errors, [], [], { blocked: true });

  const b = brief;
  const reasons = [], gates = [], unresolved = [];

  /* ── KRYTYCZNE null → UNRESOLVED. Brak wiedzy nie jest decyzją o braku potrzeby. ── */
  for (const f of CRITICAL_FIELDS)
    if (b[f] === null) unresolved.push(`"${f}" nierozstrzygnięte — brak wiedzy NIE jest decyzją o braku potrzeby; ustal to, zanim warstwa zostanie pominięta`);
  if (unresolved.length)
    return result('UNRESOLVED', false, false, reasons, gates, unresolved, { blocked: true });

  /* ── ODRZUCENIA (anti_context obu kart) ── */
  if (b.audience_is_market === false) {
    reasons.push('odbiorcą wyniku jest system, nie rynek — nie ma percepcji do zmiany ani ścieżki klienta do poprowadzenia (anti_context wf:salt i wf:plate)');
    return result('NONE', false, false, reasons, gates, unresolved);
  }
  if (b.single_artifact === true && b.positioning_consequences === false && b.needs_ongoing_communication === false) {
    reasons.push('pojedynczy artefakt bez ciągłości i bez konsekwencji pozycjonujących — diagnoza byłaby podatkiem, nie wartością');
    return result('NONE', false, false, reasons, gates, unresolved);
  }

  /* ── FUNDAMENT ── */
  const f = assessFoundation(b.existing_strategy, today);
  reasons.push(f.why);
  const foundationSource = f.fresh ? 'existing_strategy' : (b.salt_approved === true ? 'salt_approved' : null);
  const foundation = foundationSource !== null;
  if (foundationSource === 'salt_approved') reasons.push('fundament: zatwierdzony (podpisany) wynik wf:salt w tym przebiegu');

  /* ── SALT ── */
  let salt = false;
  if (!foundation) {
    if (b.positioning_stated === false) { salt = true; reasons.push('zespół nie potrafi jednym zdaniem powiedzieć, komu i czym klient wygrywa — trigger wf:salt'); }
    if (b.positioning_consequences === true) { salt = true; reasons.push('projekt ma konsekwencje pozycjonujące — zakres musi wynikać z diagnozy, nie z zamówienia'); }
    if (b.dominant_problem === 'nieznany') { salt = true; reasons.push('dominujący typ problemu nieustalony — bramka uczciwości wf:salt musi go nazwać przed wydaniem budżetu'); }
  }

  /* ── PLATE ── */
  const horizon = typeof b.continuity_horizon_days === 'number' ? b.continuity_horizon_days : 0;
  let plate = false;
  if (b.needs_ongoing_communication === true) { plate = true; reasons.push('brief wymaga planu komunikacji: co, gdzie, kiedy i czym mierzone — zakres wf:plate'); }
  else if (horizon >= 90) { plate = true; reasons.push(`horyzont komunikacji ${horizon} dni — wymaga planu (wf:plate), mimo że brief tego nie nazwał`); }

  /* ── BRAMKA WEJŚCIA PLATE (twarda, kierunkowa) ── */
  let blocked = false;
  if (plate) {
    if (foundation) {
      gates.push({ gate: 'PLATE_REQUIRES_FOUNDATION', status: 'OK', detail: f.fresh ? f.why : 'fundament: zatwierdzony wynik wf:salt' });
    } else if (salt) {
      gates.push({ gate: 'PLATE_REQUIRES_FOUNDATION', status: 'SEQUENCED', detail: 'wf:plate nie startuje przed zatwierdzeniem wyniku wf:salt — kolejność wymuszona, nie zalecana (relacja requires)' });
    } else {
      blocked = true;
      gates.push({ gate: 'PLATE_REQUIRES_FOUNDATION', status: 'BLOCKED', detail: 'żądany plan komunikacji bez fundamentu strategicznego i bez przesłanek do SALT — uzupełnij sprawdzalne odniesienie do strategii albo uruchom wf:salt' });
    }
    /* zdolność wykonawcza */
    if (b.execution_capacity_days === null)
      gates.push({ gate: 'PLATE_CAPACITY', status: 'LIMIT', detail: 'nieznana pojemność produkcyjna — kalendarz 90 dni grozi byciem listą życzeń (failure_condition wf:plate)' });
    else if (typeof b.execution_capacity_days === 'number' && b.execution_capacity_days < 30)
      gates.push({ gate: 'PLATE_CAPACITY', status: 'LIMIT', detail: `zdolność ${b.execution_capacity_days} dni w horyzoncie 90 — pełny kalendarz będzie fikcją; zejdź do quick winów (guard G4 wf:plate)` });
  }

  /* ── BRAMKA UCZCIWOŚCI: problem nie-percepcyjny ── */
  if (b.dominant_problem !== 'percepcyjny' && b.dominant_problem !== 'nieznany')
    gates.push({ gate: 'HONESTY_PROBLEM_TYPE', status: 'WARN', detail: `dominujący problem "${b.dominant_problem}" — branding tego nie naprawi; powiedzieć klientowi PRZED wydaniem budżetu i nazwać, co realnie pomoże` });

  const decision = salt && plate ? 'BOTH' : salt ? 'SALT' : plate ? 'PLATE' : 'NONE';
  if (decision === 'NONE') reasons.push('fundament istnieje i projekt nie wymaga ciągłości komunikacyjnej — obie karty poza kontekstem');
  return result(decision, salt, plate, reasons, gates, unresolved, { blocked, foundation: foundationSource });
}

function result(decision, salt, plate, reasons, gates, unresolved, extra = {}) {
  const cards = [salt ? SALT : null, plate ? PLATE : null].filter(Boolean);
  return {
    decision,                                   /* SALT | PLATE | BOTH | NONE | UNRESOLVED | INVALID_BRIEF */
    needs: { salt: Boolean(salt), plate: Boolean(plate) },
    order: decision === 'BOTH' ? [SALT, PLATE] : cards,   /* kolejność jest częścią decyzji */
    cards,
    claim_card: cards.length ? CLAIM : null,
    reasons, gates, unresolved,
    blocked: Boolean(extra.blocked),
    /* skąd fundament: 'existing_strategy' | 'salt_approved' | null.
       SALT i świeża strategia są ALTERNATYWĄ — dlatego karta PLATE nie ma relacji
       requires → wf:salt: taka krawędź fałszowałaby tę alternatywę w grafie. */
    foundation: extra.foundation === undefined ? null : extra.foundation,
    content_source: CONTENT_SOURCE,             /* treść frameworków NIE jest tutaj */
  };
}

/* ═══ ROZLICZENIE PO FAKCIE ═══
 * expected_outcome mech:strategy-before-execution: dokument bez zmiany decyzji jest kosztem,
 * nie sukcesem. Używane w postmortemie. */
function assessFrameworkPayoff(run) {
  const r = run || {};
  const changed = [].concat(r.decisions_changed || []).filter(isStr);
  const findings = [].concat(r.findings || []);
  const issues = [];
  if (!changed.length) issues.push('żadna decyzja nie zmieniła się względem pierwotnego briefu — framework był kosztem bez zwrotu (failure_condition)');
  if (findings.some(f => !f || !isStr(f.status)))
    issues.push('odkrycie bez statusu ZWALIDOWANE|HIPOTEZA — hipoteza podana jako fakt');
  const unvalidated = findings.filter(f => f && f.status === 'HIPOTEZA' && !isStr(f.validation_plan));
  if (unvalidated.length) issues.push(`${unvalidated.length} hipotez bez planu walidacji`);
  return {
    payoff: issues.length ? (changed.length ? 'PARTIAL' : 'NONE') : 'CONFIRMED',
    decisions_changed: changed, issues,
  };
}

module.exports = {
  SALT, PLATE, CLAIM, PROBLEM_TYPES, BRIEF_FIELDS, CRITICAL_FIELDS, STRATEGY_FRESH_MONTHS, CONTENT_SOURCE,
  PROCESS_PHASES, validateBrief, assessFoundation, routeFrameworks, assessFrameworkPayoff,
};
