#!/usr/bin/env node
/* ═══ WRITER EVIDENCE — JEDNA implementacja dla ingest.js i wykonawców ═══
 *
 * Powód (audyt rundy 5): `deploy.js` miał ręczną, uproszczoną kopię tej logiki — bez deduplikacji
 * po fingerprint i independence_key, bez `independent_sources` i bez pełnego słownika kierunków.
 * Dwie semantyki zapisu Evidence to dokładnie ta klasa błędu, przed którą Genome ma chronić.
 *
 * Ten moduł jest CZYSTY: nie czyta i nie zapisuje plików. Dostaje treść karty, zwraca nową treść
 * i zdarzenia. Wywołujący (ingest przez `stage()`, wykonawcy przez `Txn`) odpowiada za zapis.
 */
'use strict';
const { independenceKey, evidenceStrength, sha16 } = require('./genome-common.js');

const EVIDENCE_TYPES = ['measurement', 'postmortem', 'narrative', 'backtest', 'intention'];
const DIRECTIONS = ['supports', 'contradicts', 'limits', 'neutral'];

const canonical = v => v === null || typeof v !== 'object' ? JSON.stringify(v)
  : Array.isArray(v) ? '[' + v.map(canonical).join(',') + ']'
    : '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canonical(v[k])).join(',') + '}';

/** Walidacja pojedynczego wejścia Evidence. Ta sama dla wszystkich wywołujących. */
function validateEvidenceInput(ev) {
  const target = ev.mechanism || ev.on;
  const errors = [];
  if (!target) errors.push('evidence bez pola mechanism');
  if (!ev.project) errors.push(`evidence dla ${target || '?'}: brak pola project (niezależność liczy się po project ID)`);
  if (!EVIDENCE_TYPES.includes(ev.type)) errors.push(`evidence dla ${target || '?'}: type "${ev.type}" spoza słownika [${EVIDENCE_TYPES}]`);
  if (!ev.source) errors.push(`evidence dla ${target || '?'}: brak source (invariant 8)`);
  if (ev.direction && !DIRECTIONS.includes(ev.direction)) errors.push(`evidence dla ${target || '?'}: direction "${ev.direction}" spoza słownika [${DIRECTIONS}]`);
  return { ok: errors.length === 0, errors, target };
}

/** Wyprowadzenie identyfikatorów — jedna definicja fingerprintu i klucza niezależności. */
function deriveIds(ev, target) {
  const observation = ev.observation || ev.note || '';
  const fingerprint = ev.fingerprint || sha16(canonical({ m: target, p: ev.project, o: observation.slice(0, 200) }));
  const independence_key = independenceKey(ev);
  const id = ev.id || `ev:${target.split(':')[1]}-${String(ev.project).replace(/^proj:/, '')}-${fingerprint.slice(0, 6)}`;
  return { observation, fingerprint, independence_key, id };
}

/**
 * Dopisuje JEDNO Evidence do frontmatteru karty.
 * @returns {{status:'added'|'skipped', reason?:string, fm?:object, event?:object, note?:string}}
 */
function applyEvidence(fm, ev, { today, actor = 'session:ingest' } = {}) {
  const v = validateEvidenceInput(ev);
  if (!v.ok) return { status: 'error', errors: v.errors };
  const target = v.target;
  const entries = Array.isArray(fm.evidence) ? fm.evidence.slice() : [];
  const conf = { ...(fm.confidence || {}) };
  const { observation, fingerprint, independence_key, id } = deriveIds(ev, target);

  /* DEDUPLIKACJA — trzy niezależne kryteria, wszystkie obowiązkowe */
  const dup = entries.find(e => e.id === id) ? 'ten sam Evidence ID'
    : entries.find(e => e.fingerprint && e.fingerprint === fingerprint) ? 'ten sam fingerprint (ten sam fakt)'
      : entries.find(e => e.independence_key && e.independence_key === independence_key) ? 'ten sam independence_key (to samo źródło+projekt)'
        : null;
  if (dup) return { status: 'skipped', reason: dup, id };

  const noteIndependence = entries.some(e => e.project === ev.project)
    ? `${target}: zapisane, ale ${ev.project} już liczony — nie zwiększa liczby niezależnych projektów` : null;

  entries.push({
    id, mechanism: target, project: ev.project, type: ev.type, date: ev.date || today,
    source: ev.source, observation, direction: ev.direction || 'neutral', independence_key, fingerprint,
    ...(ev.limitations ? { limitations: ev.limitations } : {}),
    ...(ev.note && ev.note !== observation ? { note: ev.note } : {}),
  });

  /* evidence_strength — WSPÓLNA funkcja, plus rozkład kierunków */
  const strength = evidenceStrength(entries, today);
  strength.directions = entries.reduce((a, e) => (a[e.direction || 'neutral'] = (a[e.direction || 'neutral'] || 0) + 1, a), {});
  conf.evidence_strength = strength;

  const nfm = { ...fm, evidence: entries, confidence: conf, updated: today, version: (fm.version || 1) + 1 };
  const event = {
    kind: 'evidence.added', on: target, evidence_id: id, project: ev.project, evidence_type: ev.type,
    source: ev.source, direction: ev.direction || 'neutral', cause: ev.cause, actor: ev.actor || actor,
    provenance: ev.source, version_to: nfm.version, note: observation.slice(0, 300),
  };
  return { status: 'added', fm: nfm, event, id, note: noteIndependence };
}

/**
 * Przelicza wartość confidence z wpisów Evidence. `validated` NIGDY nie jest nadawane
 * automatycznie — wymaga osobnej decyzji, więc funkcja tylko sygnalizuje kwalifikację.
 */
function confidenceFromEvidence(entries) {
  const live = entries.filter(e => (e.type === 'measurement' || e.type === 'postmortem')
    && !String(e.source || '').startsWith('rec:backtests/')).length;
  const projects = new Set(entries.map(e => e.project).filter(Boolean)).size;
  const qualifiesValidated = entries.length >= 3 && projects >= 2 && live >= 1;
  return { value: entries.length ? 'emerging' : 'hypothesis', qualifiesValidated, live, projects };
}

module.exports = { EVIDENCE_TYPES, DIRECTIONS, validateEvidenceInput, deriveIds, applyEvidence, confidenceFromEvidence, canonical };
