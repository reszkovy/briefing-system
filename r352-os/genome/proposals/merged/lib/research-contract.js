#!/usr/bin/env node
/* ═══ KONTRAKTY JAKOŚCI: Research · Measurement Readiness · Doublecheck ═══  v2
 * Deterministyczne walidatory (ZERO LLM). Sesja produkuje dane, ten kod je ocenia.
 * Zero praw zapisu: moduł niczego nie zapisuje — zwraca werdykty. Czyta wyłącznie klucz
 * akceptacji (read-only), żeby zweryfikować podpis człowieka.
 *
 * Pochodzenie metodologii: proposals/AUDYT-ZRODEL.md (ADOPT/ADAPT z 3 zewnętrznych skilli,
 * odtworzone własnym kodem — nic nie zostało pobrane ani zainstalowane).
 *
 * v2 (audyt 09.08) zamyka 8 blokerów: pusty zestaw metryk = BLOCKED · podpisany ślad
 * akceptacji człowieka zamiast napisu w polu reviewer · strukturalne pole wpływu (nie tylko
 * mechanizm) · impactful liczone wyłącznie z rekordów poprawnych · źródła bez publicznego URL ·
 * primary/secondary jako relacja do KONKRETNEGO claimu · walidacja treści, typów i realności dat.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

/* ─────────── słowniki ─────────── */
const SOURCE_TYPES = ['strona-firmy', 'dokumentacja', 'raport-branzowy', 'artykul', 'social',
  'rozmowa', 'dokument-wewnetrzny', 'pomiar-wlasny', 'inne'];
/* źródła publiczne MUSZĄ mieć URL; niepubliczne mają source_ref + verification_path */
const PUBLIC_TYPES = ['strona-firmy', 'dokumentacja', 'raport-branzowy', 'artykul', 'social'];
/* typy, w których „pierwotność" NIE wynika z samego typu — wymaga uzasadnienia per claim */
const NEEDS_PRIMARY_BASIS = ['raport-branzowy', 'artykul', 'social', 'inne'];
const PRIMARY_SECONDARY = ['primary', 'secondary'];
const CONFIDENCE = ['high', 'medium', 'low'];
const DATA_QUALITY = ['verified', 'partial', 'unverified', 'n/d'];
/* co research może zmienić — pełna lista, nie tylko mechanizm (bloker 3) */
const IMPACT_KINDS = ['mechanism', 'scope', 'workflow', 'guard', 'prediction', 'metric', 'decision', 'none'];
/* BLOKER 5: kierunek dowodu WZGLĘDEM TEZY — osobny od tego, co research zmienia.
   „Zmienił decyzję" ≠ „potwierdził tezę": rekord przeczący tezie też zmienia decyzję (i to mocno).
   Bez tego pola wykrywanie doboru pod tezę jest fałszywym sygnałem. */
const DIRECTIONS = ['supports', 'contradicts', 'neutral'];

/* vanity metrics — nie mogą być głównym Outcome bez jawnego uzasadnienia */
const VANITY = /^(wyświetlenia|impressions|odsłony|zasięg|reach|polubienia|likes|obserwujący|followers|kliknięcia|clicks|ruch|sessions|wizyty)$/i;

/* ─────────── pomocnicze: typy, treść, realne daty ─────────── */
const isStr = v => typeof v === 'string';
const filled = v => isStr(v) && v.trim().length > 0;
/* data realna: nie tylko format, ale istniejący dzień kalendarza (2026-02-30 odpada) */
function isRealDate(s) {
  if (!isStr(s) || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}
const todayISO = () => new Date().toISOString().slice(0, 10);

/* ═══════════ 1. RESEARCH RECORD ═══════════ */
/* pola zawsze wymagane; source_url ALBO source_ref zależnie od typu źródła */
const RESEARCH_FIELDS = ['claim', 'source_title', 'publisher', 'published_at', 'accessed_at',
  'source_type', 'primary_or_secondary', 'observation', 'interpretation', 'confidence',
  'contradicting_sources', 'decision_impact', 'direction', 'limitations'];

/* wpływ researchu — strukturalny, nie wolny tekst (bloker 3).
   { changes: ['scope','metric'], targets: ['mech:…','zakres: FAQ'], note: '…' }
   Akceptujemy też skrót: 'none' | ['scope'] — normalizujemy. */
function normalizeImpact(v) {
  if (v === undefined || v === null) return { ok: false, why: 'brak pola decision_impact', kinds: [], targets: [], note: '' };
  if (isStr(v)) {
    if (v === 'NO_DECISION_IMPACT' || v === 'none' || v === 'n/d' || v.trim() === '')
      return { ok: true, kinds: ['none'], targets: [], note: '' };
    return { ok: false, why: 'decision_impact jako wolny tekst nie jest dopuszczalny — wymagane { changes:[…], targets:[…], note }', kinds: [], targets: [], note: v };
  }
  if (Array.isArray(v)) return normalizeImpact({ changes: v });
  if (typeof v !== 'object') return { ok: false, why: `decision_impact ma zły typ (${typeof v})`, kinds: [], targets: [], note: '' };

  const kinds = [].concat(v.changes || []).filter(x => isStr(x));
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
    return { ok: false, errors: ['rekord researchu nie jest obiektem'], warnings: [], decision_impact: 'NO_DECISION_IMPACT', impact_kinds: [] };

  /* — obecność + TREŚĆ + typ (bloker 7): sam klucz nie wystarcza — */
  for (const f of RESEARCH_FIELDS) {
    if (r[f] === undefined) { errors.push(`brak pola "${f}"`); continue; }
    if (f === 'contradicting_sources') {
      if (!Array.isArray(r[f])) errors.push('contradicting_sources musi być tablicą (pustą, jeśli brak)');
      else if (r[f].some(x => !filled(x))) errors.push('contradicting_sources zawiera pusty wpis');
      continue;
    }
    if (f === 'decision_impact') continue;                 /* własna walidacja niżej */
    if (!isStr(r[f])) { errors.push(`pole "${f}" musi być tekstem (jest ${Array.isArray(r[f]) ? 'tablicą' : typeof r[f]})`); continue; }
    if (!filled(r[f])) errors.push(`pole "${f}" jest puste — sam klucz nie wystarcza`);
  }

  /* — BLOKER 5: kierunek względem tezy — */
  if (r.direction !== undefined && !DIRECTIONS.includes(r.direction))
    errors.push(`direction musi być supports|contradicts|neutral (jest: "${r.direction}") — bez tego nie da się odróżnić „zmienił decyzję" od „potwierdził tezę"`);
  if (r.direction === 'supports' && (r.contradicting_sources || []).filter(filled).length && r.confidence === 'high')
    errors.push('direction "supports" + źródła przeciwne + confidence "high" — sprzeczność wewnętrzna');

  /* — model źródła (bloker 6): URL tylko tam, gdzie źródło jest publiczne — */
  const st = r.source_type;
  if (st !== undefined && !SOURCE_TYPES.includes(st))
    errors.push(`source_type spoza słownika: "${st}" (${SOURCE_TYPES.join('|')})`);
  const isPublic = PUBLIC_TYPES.includes(st);
  if (isPublic) {
    if (!filled(r.source_url)) errors.push(`źródło publiczne (${st}) wymaga source_url — bez niego nikt tego nie sprawdzi`);
    else if (!/^https?:\/\/[^\s]+$/.test(r.source_url)) errors.push(`source_url nie jest adresem: "${r.source_url}"`);
  } else if (SOURCE_TYPES.includes(st)) {
    /* rozmowa, dokument wewnętrzny, pomiar własny: URL bywa niemożliwy — ale ślad musi istnieć */
    if (!filled(r.source_ref))
      errors.push(`źródło niepubliczne (${st}) wymaga source_ref — kto/co/kiedy (np. "rozmowa z M. Kowalską 2026-08-05, notatka rec:…")`);
    if (!filled(r.verification_path))
      errors.push(`źródło niepubliczne (${st}) wymaga verification_path — jak INNA osoba to zweryfikuje (kogo zapytać, gdzie leży plik)`);
    if (filled(r.source_url) && !/^https?:\/\/[^\s]+$/.test(r.source_url))
      errors.push(`source_url podany, ale nie jest adresem: "${r.source_url}"`);
  }

  /* — daty realne, nie tylko sformatowane (bloker 7) — */
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

  /* — primary/secondary jako RELACJA DO CLAIMU, nie właściwość typu (bloker 6) — */
  if (r.primary_or_secondary !== undefined && !PRIMARY_SECONDARY.includes(r.primary_or_secondary))
    errors.push(`primary_or_secondary musi być primary|secondary (jest: "${r.primary_or_secondary}")`);
  if (r.primary_or_secondary === 'primary' && NEEDS_PRIMARY_BASIS.includes(st) && !filled(r.primary_basis))
    errors.push(`"${st}" bywa pierwotne (raport z własnym badaniem, wpis autora o samym sobie) — ale nie z definicji: uzasadnij polem primary_basis, dlaczego jest pierwotne DLA TEGO claimu`);
  if (r.primary_or_secondary === 'secondary' && filled(r.primary_basis))
    warnings.push('primary_basis wypełnione przy źródle secondary — zignorowane');

  /* — obserwacja ≠ interpretacja — */
  if (filled(r.observation) && filled(r.interpretation) && r.observation.trim() === r.interpretation.trim())
    errors.push('observation i interpretation są identyczne — fakt i wniosek muszą być rozdzielone');
  if (r.confidence !== undefined && !CONFIDENCE.includes(r.confidence))
    errors.push(`confidence musi być high|medium|low (jest: "${r.confidence}")`);

  /* — wiarygodne źródło przeciwne obniża pewność i wymusza ograniczenie — */
  const contra = Array.isArray(r.contradicting_sources) ? r.contradicting_sources.filter(filled) : [];
  if (contra.length) {
    if (r.confidence === 'high') errors.push(`confidence "high" przy ${contra.length} źródłach przeciwnych — obniż do medium/low albo rozstrzygnij sprzeczność`);
    if (!filled(r.limitations) || r.limitations === 'n/d') errors.push('są źródła przeciwne, a limitations puste — ograniczenie musi być nazwane');
  }

  /* — strukturalny wpływ (bloker 3) — */
  const imp = normalizeImpact(r.decision_impact);
  if (!imp.ok) errors.push(imp.why);

  const ok = errors.length === 0;
  return {
    ok, errors, warnings,
    /* wpływ liczy się WYŁĄCZNIE z rekordu poprawnego kontraktowo (bloker 4) */
    decision_impact: (ok && imp.ok && !imp.kinds.includes('none')) ? 'IMPACT' : 'NO_DECISION_IMPACT',
    impact_kinds: ok && imp.ok ? imp.kinds : [],
    impact_targets: ok && imp.ok ? imp.targets : [],
  };
}

/* raport researchu: rekordy bez wpływu na decyzję nie pompują objętości.
   Rekord NIEWAŻNY nie podnosi żadnej pozytywnej metryki (bloker 4). */
function summarizeResearch(records, opts = {}) {
  const list = Array.isArray(records) ? records : [];
  const results = list.map(r => validateResearchRecord(r, opts));
  const valid = results.filter(r => r.ok);
  const impactful = valid.filter(r => r.decision_impact === 'IMPACT');
  const kinds = {};
  for (const r of impactful) for (const k of r.impact_kinds) kinds[k] = (kinds[k] || 0) + 1;
  const dirs = { supports: 0, contradicts: 0, neutral: 0 };
  for (let i = 0; i < list.length; i++)
    if (results[i].ok && DIRECTIONS.includes(list[i].direction)) dirs[list[i].direction]++;
  return {
    directions: dirs,
    total: list.length,
    valid: valid.length,
    invalid: results.length - valid.length,
    impactful: impactful.length,                                  /* tylko z poprawnych */
    no_decision_impact: valid.length - impactful.length,          /* poprawne, ale bez wpływu */
    impact_kinds: kinds,
    results,
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

  /* ADOPT z Analytics Tracking: metryka bez decyzji = tracking "na wszelki wypadek" */
  if (!filled(m.decision_supported) || m.decision_supported === 'n/d')
    blockers.push('metryka nie wspiera żadnej decyzji — nie zbieramy danych na wszelki wypadek');
  if (!filled(m.metric)) blockers.push('brak pola metric');
  if (!filled(m.measurement_source) || m.measurement_source === 'n/d') blockers.push('brak measurement_source (skąd wezmą się dane)');
  if (!isRealDate(m.measurement_date)) blockers.push(`measurement_date musi być realną datą YYYY-MM-DD (jest: "${m.measurement_date === undefined ? 'brak' : m.measurement_date}")`);
  if (!filled(m.resolution_owner) || m.resolution_owner === 'n/d') blockers.push('brak resolution_owner (kto rozliczy)');
  if (!filled(m.target) || m.target === 'n/d') blockers.push('brak target/kryterium rozstrzygnięcia — inaczej wyniku nie da się ocenić');

  /* baseline: brak ZOSTAJE n/d i obniża gotowość, ale nie blokuje (czasem baseline nie istnieje) */
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

  /* vanity metric jako główny Outcome wymaga jawnego uzasadnienia */
  if (m.is_primary_outcome && VANITY.test(String(m.metric || '').trim()) && !filled(m.vanity_justification))
    blockers.push(`"${m.metric}" to metryka próżności — jako główny Outcome wymaga pola vanity_justification`);

  const state = blockers.length ? 'BLOCKED' : (limits.length ? 'PARTIAL' : 'READY');
  return { metric: filled(m.metric) ? m.metric : '(bez nazwy)', state, blockers, limits };
}

function measurementReadiness(metrics) {
  const list = Array.isArray(metrics) ? metrics : [];
  /* BLOKER 1: brak metryk to nie jest gotowość. Nie ma czego rozliczyć = nie ma pomiaru. */
  if (!list.length)
    return {
      measurement_readiness: 'BLOCKED',
      metrics: [],
      blockers: ['nie zdefiniowano ŻADNEJ metryki — projekt bez metryki nie może zamrozić predykcji'],
    };
  const per = list.map(assessMetric);
  const state = per.some(x => x.state === 'BLOCKED') ? 'BLOCKED'
    : per.some(x => x.state === 'PARTIAL') ? 'PARTIAL' : 'READY';
  return { measurement_readiness: state, metrics: per, blockers: per.flatMap(x => x.blockers) };
}

/* ═══════════ 2b. ŚLAD AKCEPTACJI CZŁOWIEKA ═══════════
 * BLOKER 2. Napis `reviewer: "przemek"` jest tekstem, który agent umie wpisać sam — nie jest
 * dowodem niczego. Jedyny weryfikowalny ślad w tym systemie to podpis HMAC kluczem, którego
 * agent nie może utworzyć (`~/.genome/approval.key`, poza repo, ten sam mechanizm co migrate.js).
 *
 * Kontrakt jest uczciwy: bez podpisu zwracamy `unverified` i JAWNIE mówimy, że niezależność
 * NIE jest zagwarantowana. Nie udajemy, że pole tekstowe cokolwiek gwarantuje.
 */
const DEFAULT_KEY_PATH = path.join(os.homedir(), '.genome', 'approval.key');

/* kanoniczny odcisk raportu — to, co człowiek faktycznie podpisuje */
/* BLOKER 1: odcisk musi obejmować CAŁY pakiet decyzyjny, nie wycinek.
 * Poprzednia wersja podpisywała claims + fragment researchu + mechanizmy + frameworki.
 * Poza podpisem zostawały: interpretation, confidence, limitations, decision_impact, direction,
 * metryki, predykcje i Project Contract — czyli wszystko, co realnie zamraża projekt.
 * Można je było zmienić po akceptacji bez unieważnienia podpisu.
 *
 * Zasada: podpisujemy DETERMINISTYCZNĄ, PEŁNĄ serializację pakietu. Nie ma listy „ważnych pól" —
 * bierzemy wszystko poza samym podpisem (review_signature), bo lista zawsze się zestarzeje.
 */
function canonicalize(v) {
  if (v === null || typeof v !== 'object') return v;
  if (Array.isArray(v)) return v.map(canonicalize);
  const out = {};
  for (const k of Object.keys(v).sort()) {
    if (k === 'review_signature') continue;        /* podpis nie podpisuje sam siebie */
    out[k] = canonicalize(v[k]);
  }
  return out;
}

function reportFingerprint(report) {
  return crypto.createHash('sha256').update(JSON.stringify(canonicalize(report || {}))).digest('hex');
}

/* Co dokładnie objęte podpisem — do pokazania człowiekowi PRZED podpisaniem. */
function fingerprintCoverage(report) {
  const keys = Object.keys(report || {}).filter(k => k !== 'review_signature').sort();
  return { covered_top_level_keys: keys, excluded: ['review_signature'], fingerprint: reportFingerprint(report) };
}

function verifyHumanReview(report, opts = {}) {
  const fp = reportFingerprint(report);
  const sig = report.review_signature;
  if (!sig) return { state: 'unverified', fingerprint: fp, why: 'brak podpisu akceptacji — pole reviewer to tekst, nie dowód' };
  const keyPath = opts.keyPath || DEFAULT_KEY_PATH;
  let key;
  try { key = fs.readFileSync(keyPath, 'utf8').trim(); }
  catch { return { state: 'unverifiable', fingerprint: fp, why: `brak klucza akceptacji (${keyPath}) — podpisu nie da się sprawdzić` }; }
  if (!key) return { state: 'unverifiable', fingerprint: fp, why: 'klucz akceptacji jest pusty' };
  const expect = crypto.createHmac('sha256', key).update(fp).digest('hex');
  const a = Buffer.from(String(sig), 'utf8'), b = Buffer.from(expect, 'utf8');
  const okSig = a.length === b.length && crypto.timingSafeEqual(a, b);
  return okSig
    ? { state: 'verified', fingerprint: fp, why: 'podpis zgadza się z odciskiem raportu' }
    : { state: 'invalid', fingerprint: fp, why: 'podpis nie pasuje do treści raportu — raport zmieniono po akceptacji albo podpis jest fałszywy' };
}

/* ═══════════ 3. DOUBLECHECK — bramka adwersaryjna ═══════════ */
/* Nie zapisuje. Nie zatwierdza. Zwraca werdykt jakości treści ORAZ osobno stan
   niezależnego review — te dwie rzeczy nie są tym samym i nie wolno ich mieszać. */
function doublecheck(report, opts = {}) {
  const findings = [];
  const r0 = report || {};
  const claims = r0.claims || [];
  const research = r0.research || [];
  const mechanisms = [].concat(r0.recommended_mechanisms || []);
  const frameworks = [].concat(r0.recommended_frameworks || []);
  const recommended = mechanisms.concat(frameworks);
  const summary = summarizeResearch(research, opts);

  /* Warstwa 1 — ekstrakcja: fakt ≠ rekomendacja ≠ opinia */
  const facts = claims.filter(c => c && c.kind === 'fact');
  if (!claims.length) findings.push({ level: 'REVISE', what: 'raport nie wyodrębnia żadnych weryfikowalnych twierdzeń (warstwa 1)' });
  for (const c of claims)
    if (!c || !['fact', 'recommendation', 'opinion'].includes(c.kind))
      findings.push({ level: 'REVISE', what: `twierdzenie "${String((c && c.text) || '').slice(0, 50)}" bez klasyfikacji fact|recommendation|opinion` });

  /* Warstwa 2 — źródła: fakt bez źródła nie przechodzi */
  for (const f of facts) {
    const idx = research.findIndex(r => r && r.claim === f.text);
    if (idx < 0) { findings.push({ level: 'REVISE', what: `fakt bez źródła: "${String(f.text).slice(0, 60)}"` }); continue; }
    const v = summary.results[idx];
    if (!v.ok) findings.push({ level: 'REVISE', what: `źródło do "${String(f.text).slice(0, 40)}" nie spełnia kontraktu: ${v.errors[0]}` });
    if ((research[idx].contradicting_sources || []).filter(filled).length)
      findings.push({ level: 'LIMIT', what: `twierdzenie ma źródło przeciwne — obowiązuje ograniczenie: "${String(f.text).slice(0, 50)}"` });
  }

  /* Warstwa 3 — adwersaryjna.
   * UWAGA (próba na sucho 09.08): pierwsza wersja flagowała każdy mechanizm nieopisany w researchu
   * i odpaliła w 3/3 przypadkach — na regule, nie na patologii. Zawężone.
   * BLOKER 3: research bywa przesłanką dla zakresu, workflow, guarda, predykcji, metryki lub decyzji —
   * nie tylko dla listy mechanizmów. Ozdobnikiem jest research, który nie zmienił NICZEGO. */
  const evidenceBacked = new Set([].concat(r0.evidence_backed || []));
  const targetsAll = new Set(summary.results.flatMap(r => r.impact_targets || []));
  for (const m of recommended)
    if (!targetsAll.has(m) && !evidenceBacked.has(m))
      findings.push({ level: 'LIMIT', what: `${m} bez oparcia: ani w researchu, ani w Evidence z Genome` });

  if (summary.valid > 0 && summary.impactful === 0)
    findings.push({ level: 'REVISE', what: `${summary.valid} poprawnych rekordów researchu i ŻADEN niczego nie zmienia (mechanizm, zakres, workflow, guard, predykcja, metryka, decyzja) — research jako ozdoba, nie przesłanka` });
  if (summary.invalid > 0)
    findings.push({ level: 'REVISE', what: `${summary.invalid} z ${summary.total} rekordów researchu nie spełnia kontraktu — nieważny rekord nie liczy się do niczego` });
  /* BLOKER 5: jednostronność liczona na DIRECTION. „Każdy zmienił decyzję" to nie jest bias —
     biasem jest „każdy wspiera tezę i żaden jej nie podważa ani nie jest neutralny". */
  const d = summary.directions || { supports: 0, contradicts: 0, neutral: 0 };
  if (summary.valid >= 3 && d.supports === summary.valid && d.contradicts === 0 && d.neutral === 0)
    findings.push({ level: 'LIMIT', what: `wszystkie ${summary.valid} poprawne rekordy mają direction "supports", zero contradicts, zero neutral — research jednostronny, sprawdź dobór pod tezę` });

  /* Warstwa 4 — niezależność review. Tekst w polu reviewer NIE jest dowodem (bloker 2). */
  const review = verifyHumanReview(r0, opts);
  if (r0.author && r0.reviewer && r0.author === r0.reviewer)
    findings.push({ level: 'REVISE', what: 'ten sam podmiot napisał i zrecenzował raport — bramka nie może zatwierdzić własnego raportu' });
  if (review.state === 'invalid')
    findings.push({ level: 'REVISE', what: `podpis akceptacji nie pasuje do treści raportu — ${review.why}` });
  if (review.state !== 'verified')
    findings.push({ level: 'INFO', what: `niezależność review NIE jest potwierdzona (${review.state}): ${review.why}. Werdykt dotyczy wyłącznie jakości treści.` });

  const verdict = findings.some(f => f.level === 'REVISE') ? 'REVISE'
    : findings.some(f => f.level === 'LIMIT') ? 'PASS_WITH_LIMITATIONS' : 'PASS';
  return {
    verdict,
    findings,
    blocks_contract: verdict === 'REVISE',
    independent_review: review.state,
    review_fingerprint: review.fingerprint,
    research_summary: { total: summary.total, valid: summary.valid, invalid: summary.invalid, impactful: summary.impactful, impact_kinds: summary.impact_kinds },
  };
}

/* ═══════════ 4. BRAMKA PROJECT CONTRACT ═══════════
 * Jedno miejsce, które łączy trzy warunki. Router i skill NIE powtarzają tej logiki (bloker 8/
 * wymóg „jedno kanoniczne źródło") — wołają tę funkcję.  */
function contractGate({ doublecheck: dc, measurement, human_review_required = true }) {
  const blockers = [];
  if (!dc) blockers.push('brak wyniku Doublecheck');
  else {
    if (dc.blocks_contract) blockers.push(`Doublecheck: ${dc.verdict}`);
    if (human_review_required && dc.independent_review !== 'verified')
      blockers.push(`brak zweryfikowanego podpisu akceptacji człowieka (stan: ${dc.independent_review}) — kontrakt zamraża predykcje, więc wymaga śladu, którego agent nie umie wytworzyć`);
  }
  if (!measurement) blockers.push('brak oceny Measurement Readiness');
  else if (measurement.measurement_readiness === 'BLOCKED')
    blockers.push(`Measurement Readiness: BLOCKED — ${(measurement.blockers || [])[0] || 'brak szczegółu'}`);
  return { can_freeze: blockers.length === 0, blockers };
}

module.exports = {
  RESEARCH_FIELDS, METRIC_FIELDS, SOURCE_TYPES, PUBLIC_TYPES, DATA_QUALITY, IMPACT_KINDS,
  isRealDate, normalizeImpact,
  validateResearchRecord, summarizeResearch, assessMetric, measurementReadiness,
  DIRECTIONS, canonicalize, reportFingerprint, fingerprintCoverage, verifyHumanReview, doublecheck, contractGate,
};
