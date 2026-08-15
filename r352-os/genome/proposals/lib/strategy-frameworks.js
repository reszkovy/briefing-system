#!/usr/bin/env node
/* ═══ ROZPOZNAWANIE WARSTWY STRATEGICZNEJ: SALT / PLATE ═══
 * Deterministyczny klasyfikator (ZERO LLM, zero praw zapisu).
 *
 * JEDNO ŹRÓDŁO PRAWDY (wymóg 8): treść frameworków żyje WYŁĄCZNIE w kartach
 * wf:salt / wf:plate (genome/workflows/). Ten moduł NIE powtarza ich treści —
 * odpowiada tylko na pytanie KTÓRY framework jest potrzebny i DLACZEGO,
 * oraz pilnuje bramki wejścia PLATE. Skill i Router wołają ten moduł,
 * a treść czytają z kart. Nigdzie indziej nie ma kopii tej logiki.
 *
 * DOCELOWA LOKALIZACJA KANONICZNA (po zatwierdzeniu): r352-os/genome/lib/strategy-frameworks.js
 *
 * Wejście: obiekt briefu (fakty, nie proza). Wyjście: {needs, reasons, gates, blocked}.
 */
'use strict';

const SALT_CARD = 'wf:salt';
const PLATE_CARD = 'wf:plate';
const CLAIM_CARD = 'mech:strategy-before-execution';

/* Typy problemu z bramki uczciwości SALT (warstwa S) */
const PROBLEM_TYPES = ['percepcyjny', 'produktowy', 'cenowy', 'dystrybucyjny', 'nieznany'];

const isStr = v => typeof v === 'string' && v.trim().length > 0;
const bool = v => v === true;

/* Ile miesięcy strategia pozostaje "świeża" (anti_context wf:salt) */
const STRATEGY_FRESH_MONTHS = 12;

function monthsBetween(fromISO, toISO) {
  const a = new Date(fromISO), b = new Date(toISO);
  if (isNaN(a) || isNaN(b)) return null;
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}

/**
 * @param {object} brief
 *  - has_external_audience {boolean}   czy projekt ma odbiorcę zewnętrznego
 *  - is_technical {boolean}            projekt infrastrukturalny/techniczny
 *  - single_artifact {boolean}         jednorazowy artefakt bez ciągłości
 *  - positioning_consequences {boolean} czy wynik zmienia pozycję rynkową
 *  - can_state_positioning {boolean}   czy zespół potrafi 1 zdaniem powiedzieć komu/czym wygrywa
 *  - existing_strategy {object|null}   {source, approved_at, challenged_by_brief}
 *  - needs_communication_plan {boolean} czy trzeba zaplanować co/gdzie/kiedy komunikujemy
 *  - continuity_horizon_days {number}  horyzont komunikacji
 *  - dominant_problem {string}         z PROBLEM_TYPES (jeśli już znany)
 *  - production_capacity_known {boolean}
 * @param {string} today ISO date
 */
function assessStrategyNeed(brief, today = new Date().toISOString().slice(0, 10)) {
  const b = brief || {};
  const reasons = [];
  const gates = [];
  let salt = false, plate = false;

  /* ── ODRZUCENIA (anti_context obu kart) ── */
  if (bool(b.is_technical) && !bool(b.has_external_audience)) {
    reasons.push('projekt techniczny/infrastrukturalny bez odbiorcy zewnętrznego — anti_context wf:salt i wf:plate');
    return verdict(false, false, reasons, gates, 'NONE');
  }
  if (bool(b.single_artifact) && !bool(b.positioning_consequences)) {
    reasons.push('pojedynczy artefakt bez ciągłości i bez konsekwencji pozycjonujących — diagnoza byłaby podatkiem');
    return verdict(false, false, reasons, gates, 'NONE');
  }

  /* ── SALT: czy potrzebna diagnoza? ── */
  const strat = b.existing_strategy;
  let freshStrategy = false;
  if (strat && isStr(strat.approved_at)) {
    const age = monthsBetween(strat.approved_at, today);
    freshStrategy = age !== null && age <= STRATEGY_FRESH_MONTHS && !bool(strat.challenged_by_brief);
    if (freshStrategy) reasons.push(`istnieje zatwierdzona strategia (${strat.source || 'źródło nieznane'}, ${strat.approved_at}, ${age} mies.) i brief jej nie kwestionuje — SALT zbędny`);
    else if (age !== null && age > STRATEGY_FRESH_MONTHS) reasons.push(`strategia starsza niż ${STRATEGY_FRESH_MONTHS} mies. (${age}) — fundament wymaga odświeżenia`);
    else if (bool(strat.challenged_by_brief)) reasons.push('brief kwestionuje istniejącą strategię — diagnoza wraca na stół');
  }

  if (!freshStrategy) {
    if (b.can_state_positioning === false) {
      salt = true;
      reasons.push('zespół nie potrafi jednym zdaniem powiedzieć komu i czym klient wygrywa — trigger wf:salt');
    }
    if (bool(b.positioning_consequences)) {
      salt = true;
      reasons.push('projekt ma konsekwencje pozycjonujące — zakres musi wynikać z diagnozy, nie z zamówienia');
    }
    if (b.dominant_problem === 'nieznany' || b.dominant_problem === undefined) {
      if (bool(b.has_external_audience)) {
        salt = true;
        reasons.push('dominujący typ problemu nieustalony — bramka uczciwości SALT musi go nazwać przed wydaniem budżetu');
      }
    }
  }

  /* ── PLATE: czy potrzebny plan komunikacji? ── */
  const wantsPlan = bool(b.needs_communication_plan) || (Number(b.continuity_horizon_days) || 0) >= 90;
  if (wantsPlan) {
    plate = true;
    reasons.push((Number(b.continuity_horizon_days) || 0) >= 90
      ? `horyzont komunikacji ${b.continuity_horizon_days} dni — wymaga planu (wf:plate)`
      : 'brief wymaga planu komunikacji: co, gdzie, kiedy i czym mierzone');
  }

  /* ── BRAMKA WEJŚCIA PLATE (twarda) ── */
  let blocked = false;
  if (plate) {
    const hasFoundation = freshStrategy || bool(b.salt_approved);
    if (!hasFoundation) {
      if (salt) {
        gates.push({ gate: 'PLATE_REQUIRES_FOUNDATION', status: 'SEQUENCED', detail: 'PLATE nie startuje przed zatwierdzeniem wyniku wf:salt — kolejność wymuszona, nie zalecana' });
      } else {
        blocked = true;
        gates.push({ gate: 'PLATE_REQUIRES_FOUNDATION', status: 'BLOCKED', detail: 'żądany plan komunikacji bez fundamentu strategicznego i bez przesłanek do SALT — uzupełnij fundament albo uruchom SALT' });
      }
    } else {
      gates.push({ gate: 'PLATE_REQUIRES_FOUNDATION', status: 'OK', detail: freshStrategy ? `fundament: istniejąca strategia (${strat.source || 'n/d'}, ${strat.approved_at})` : 'fundament: zatwierdzony wynik wf:salt' });
    }
    if (b.production_capacity_known === false)
      gates.push({ gate: 'PLATE_CAPACITY', status: 'LIMIT', detail: 'nieznana pojemność produkcyjna — kalendarz 90 dni grozi byciem listą życzeń (failure_condition wf:plate)' });
  }

  /* ── bramka uczciwości: problem nie-percepcyjny ── */
  if (isStr(b.dominant_problem) && b.dominant_problem !== 'percepcyjny' && b.dominant_problem !== 'nieznany') {
    gates.push({
      gate: 'HONESTY_PROBLEM_TYPE', status: 'WARN',
      detail: `dominujący problem "${b.dominant_problem}" — branding tego nie naprawi; powiedzieć klientowi PRZED wydaniem budżetu i nazwać, co realnie pomoże`,
    });
  }

  const mode = salt && plate ? 'SALT_THEN_PLATE' : salt ? 'SALT' : plate ? 'PLATE' : 'NONE';
  return verdict(salt, plate, reasons, gates, mode, blocked);
}

function verdict(salt, plate, reasons, gates, mode, blocked = false) {
  return {
    mode,                      // SALT | PLATE | SALT_THEN_PLATE | NONE
    needs: { salt, plate },
    blocked,
    reasons,
    gates,
    cards: [salt ? SALT_CARD : null, plate ? PLATE_CARD : null].filter(Boolean),
    claim_card: (salt || plate) ? CLAIM_CARD : null,
    /* treść frameworków NIE jest tutaj — czytaj karty (jedno źródło prawdy) */
    content_source: 'r352-os/genome/workflows/{salt,plate}.md',
  };
}

/* Bramka rozliczenia: czy framework realnie coś zmienił (expected_outcome mech:strategy-before-execution).
 * Używana w postmortemie — dokument bez zmiany decyzji jest kosztem, nie sukcesem. */
function assessFrameworkPayoff(run) {
  const r = run || {};
  const changed = [].concat(r.decisions_changed || []).filter(isStr);
  const findings = [].concat(r.findings || []);
  const unvalidated = findings.filter(f => f && f.status === 'HIPOTEZA' && !isStr(f.validation_plan));
  const issues = [];
  if (!changed.length) issues.push('żadna decyzja nie zmieniła się względem pierwotnego briefu — framework był kosztem bez zwrotu (failure_condition)');
  if (findings.length && findings.some(f => !f || !isStr(f.status)))
    issues.push('odkrycie bez statusu ZWALIDOWANE|HIPOTEZA — hipoteza podana jako fakt narusza prin:extract-never-invent');
  if (unvalidated.length) issues.push(`${unvalidated.length} hipotez bez planu walidacji`);
  return {
    payoff: issues.length ? (changed.length ? 'PARTIAL' : 'NONE') : 'CONFIRMED',
    decisions_changed: changed,
    issues,
  };
}

module.exports = {
  SALT_CARD, PLATE_CARD, CLAIM_CARD, PROBLEM_TYPES, STRATEGY_FRESH_MONTHS,
  assessStrategyNeed, assessFrameworkPayoff,
};
