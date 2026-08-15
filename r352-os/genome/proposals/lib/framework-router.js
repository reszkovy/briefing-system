#!/usr/bin/env node
/* ═══ ROZPOZNANIE WARSTWY STRATEGICZNEJ: SALT · PLATE ═══
 * JEDNO KANONICZNE ŹRÓDŁO tej logiki. Skill `/mechanism-router` i karty workflow OPISUJĄ
 * decyzję, ale jej NIE POWTARZAJĄ — wołają `routeFrameworks()`. Kopiowanie tych reguł
 * do promptu skilla jest błędem (jeden z warunków wdrożenia: bez duplikacji logiki).
 *
 * Zero LLM, zero sieci, zero zapisu. Reguły jawne, nie scoring — decyzja ma być audytowalna,
 * a nie „wyszło 68 punktów”.
 *
 * Relacja kierunkowa: Research/Benchmark → SALT → PLATE → wykonanie.
 */
'use strict';

const SALT = 'wf:salt-strategic-diagnosis';
const PLATE = 'wf:plate-communication-plan';
const PROBLEM_CLASSES = ['percepcyjny', 'produktowy', 'cenowy', 'dystrybucyjny', 'nieznany'];

/* Brief strukturalny — pola, na których podejmujemy decyzję.
   Każde nieznane pole ma być JAWNIE `null`, nie zgadywane. */
const BRIEF_FIELDS = [
  'audience_is_market',          /* bool  — czy odbiorcą wyniku jest rynek/człowiek, czy system */
  'audience_defined',            /* bool  — czy odbiorca docelowy jest zapisany (z wartością kontraktu) */
  'positioning_documented',      /* bool  — czy istnieje zapisane pozycjonowanie */
  'perception_change_named',     /* bool  — czy nazwano zmianę percepcji X→Y */
  'strategy_approved_ref',       /* str|null — referencja do ZATWIERDZONEJ strategii (SALT lub równoważnej) */
  'needs_ongoing_communication', /* bool  — czy projekt wymaga ciągłości: kalendarz, kanały, kampania, cross-sell */
  'scope_is_single_format',      /* bool  — pojedynczy format/artefakt w istniejącym systemie marki */
  'execution_capacity_days',     /* num|null — realne dni produkcyjne klienta w horyzoncie 90 dni */
  'known_problem_class',         /* str   — z PROBLEM_CLASSES; 'nieznany', jeśli nie wiemy (to normalne przed SALT) */
];

function validateBrief(b) {
  const errors = [];
  if (!b || typeof b !== 'object' || Array.isArray(b)) return { ok: false, errors: ['brief nie jest obiektem'] };
  for (const f of BRIEF_FIELDS) if (b[f] === undefined) errors.push(`brief bez pola "${f}" — użyj null, jeśli nie wiesz (zgadywanie jest gorsze niż luka)`);
  for (const f of ['audience_is_market', 'audience_defined', 'positioning_documented', 'perception_change_named', 'needs_ongoing_communication', 'scope_is_single_format'])
    if (b[f] !== undefined && b[f] !== null && typeof b[f] !== 'boolean') errors.push(`"${f}" musi być boolean albo null`);
  if (b.execution_capacity_days !== undefined && b.execution_capacity_days !== null && typeof b.execution_capacity_days !== 'number')
    errors.push('"execution_capacity_days" musi być liczbą albo null');
  if (b.known_problem_class !== undefined && !PROBLEM_CLASSES.includes(b.known_problem_class))
    errors.push(`"known_problem_class" spoza słownika (${PROBLEM_CLASSES.join('|')})`);
  return { ok: errors.length === 0, errors };
}

function routeFrameworks(brief) {
  const v = validateBrief(brief);
  if (!v.ok) return { decision: 'INVALID_BRIEF', frameworks: [], reasons: v.errors, order: [], warnings: [], blockers: [] };

  const b = brief;
  const reasons = [], warnings = [], blockers = [];

  /* R1 — odbiorcą jest system, nie rynek: żaden z frameworków nie ma zastosowania */
  if (b.audience_is_market === false) {
    reasons.push('odbiorcą wyniku jest system, nie rynek — nie ma percepcji do zmiany ani ścieżki klienta do poprowadzenia (anti_context obu kart)');
    return { decision: 'NONE', frameworks: [], order: [], reasons, warnings, blockers };
  }
  if (b.audience_is_market === null) warnings.push('audience_is_market = null — rozstrzygnij, zanim zainwestujesz w warstwę strategiczną');

  /* R2 — fundament strategiczny: zatwierdzona strategia ALBO komplet trzech elementów */
  const equivalentFoundation = b.positioning_documented === true && b.audience_defined === true && b.perception_change_named === true;
  const foundation = Boolean(b.strategy_approved_ref) || equivalentFoundation;
  if (b.strategy_approved_ref) reasons.push(`fundament strategiczny istnieje: ${b.strategy_approved_ref}`);
  else if (equivalentFoundation) reasons.push('fundament równoważny: pozycjonowanie + odbiorca + nazwana zmiana percepcji są zapisane');

  /* R3 — pojedynczy format w istniejącym systemie, bez ciągłości: nic z tej warstwy */
  if (b.scope_is_single_format === true && b.needs_ongoing_communication !== true) {
    reasons.push('pojedynczy format w istniejącym systemie marki, bez ciągłości komunikacyjnej — warstwa strategiczna byłaby narzutem');
    return { decision: 'NONE', frameworks: [], order: [], reasons, warnings, blockers };
  }

  const needSalt = !foundation;
  const needPlate = b.needs_ongoing_communication === true;
  if (needSalt) reasons.push('brak zapisanego fundamentu (pozycjonowanie / odbiorca / zmiana percepcji) — bez SALT każda rekomendacja jest gustem');
  if (needPlate) reasons.push('projekt wymaga ciągłości komunikacyjnej (kanały, kalendarz, tematy per odbiorca) — to zakres PLATE');
  if (!needPlate && b.needs_ongoing_communication === null) warnings.push('needs_ongoing_communication = null — PLATE nierozstrzygnięty, domyślnie pominięty');

  /* R4 — twarda bramka kierunkowa: PLATE nie startuje bez fundamentu */
  if (needPlate && !foundation) reasons.push('PLATE bez fundamentu produkuje kalendarz bez tezy — SALT musi go poprzedzić (guard G1 karty PLATE)');

  /* R5 — zdolność wykonawcza urealnia PLATE */
  if (needPlate && typeof b.execution_capacity_days === 'number' && b.execution_capacity_days < 30)
    warnings.push(`zdolność wykonawcza ${b.execution_capacity_days} dni w horyzoncie 90 — kalendarz pełnego PLATE będzie fikcją; zejdź do quick winów (guard G4)`);
  if (needPlate && b.execution_capacity_days === null)
    warnings.push('nieznana zdolność wykonawcza klienta — zmierz ją przed zatwierdzeniem kalendarza (guard G4)');

  /* R6 — znany dominujący problem inny niż percepcyjny: SALT to nazwie, ale nie rozwiąże */
  if (b.known_problem_class && !['percepcyjny', 'nieznany'].includes(b.known_problem_class)) {
    const msg = `dominujący problem jest ${b.known_problem_class}, nie percepcyjny — powiedz to klientowi PRZED wydaniem budżetu; branding tego nie naprawi`;
    if (needSalt) { warnings.push(msg); reasons.push('SALT zostaje, żeby nazwać granicę tego, co branding rozwiązuje, a czego nie'); }
    else blockers.push(msg);
  }

  const frameworks = [];
  if (needSalt) frameworks.push(SALT);
  if (needPlate) frameworks.push(PLATE);
  const decision = needSalt && needPlate ? 'BOTH' : needSalt ? 'SALT' : needPlate ? 'PLATE' : 'NONE';
  if (decision === 'NONE') reasons.push('fundament istnieje i projekt nie wymaga ciągłości komunikacyjnej — obie karty poza kontekstem');

  /* kolejność jest częścią decyzji: Research → SALT → PLATE → wykonanie */
  const order = decision === 'BOTH' ? [SALT, PLATE] : frameworks.slice();
  return { decision, frameworks, order, reasons, warnings, blockers, foundation };
}

module.exports = { SALT, PLATE, BRIEF_FIELDS, PROBLEM_CLASSES, validateBrief, routeFrameworks };
