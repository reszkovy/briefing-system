#!/usr/bin/env node
/* ═══ ZGODA WŁAŚCICIELA — PODPIS ASYMETRYCZNY Ed25519 ═══
 *
 * Dlaczego nie HMAC: klucz symetryczny musi być czytelny dla weryfikatora, więc każdy proces,
 * który potrafi go wskazać (GENOME_APPROVAL_KEY, opts.keyPath, podmieniony TMPDIR), potrafi też
 * podpisać. Po incydencie 09.08 to nie jest akceptowalne ograniczenie.
 *
 * Ed25519:
 *   • klucz PRYWATNY  — NIGDY w repo i NIGDY w katalogu domowym: Keychain z wymuszonym
 *     potwierdzeniem użytkownika, podpis na maszynie offline albo osobne konto systemowe.
 *     Ten moduł go nie czyta i nie ma funkcji podpisującej,
 *   • klucz PUBLICZNY — WYŁĄCZNIE w kotwicy poza repo: `<homedir z passwd>/.genome/
 *     approval-pubkey.pem`. Repo nie zawiera żadnej kopii, której writer by ufał.
 *
 * NA ŚCIEŻCE PRODUKCYJNEJ NIE MA ŻADNEGO OVERRIDE: ani zmiennej środowiskowej, ani opcji,
 * ani zależności od TMPDIR czy $HOME. Ścieżkę kotwicy wyprowadza `os.userInfo().homedir`.
 * Testy podmieniają `trustDir()` w KOPII tego modułu — produkcyjny plik nie ma żadnego
 * argumentu, zmiennej ani ścieżki, którą dałoby się podstawić inne zaufanie.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const SCHEMA_VERSION = 'genome-approval/2-ed25519';
/* ═══ KOTWICA ZAUFANIA POZA REPOZYTORIUM ═══ (audyt rundy 5, potwierdzone niezależną próbą)
 * Poprzednia wersja czytała klucz publiczny z `lib/approval-pubkey.pem` — czyli z katalogu,
 * który agent może nadpisać. Wystarczyło podmienić klucz publiczny i podpisać własnym prywatnym,
 * żeby wdrożenie przeszło. Kryptografia była poprawna, punkt zaufania nie był niezależny.
 *
 * Klucz publiczny mieszka WYŁĄCZNIE w katalogu właściciela, poza repo:
 *     ~/.genome/approval-pubkey.pem
 * Repo nie zawiera i NIE MOŻE zawierać kopii, której writer by ufał. Wykonawcy nie wdrażają
 * klucza — instalowanie klucza, którym właśnie zweryfikowano pakiet, jest cyrkularne.
 *
 * ROTACJA: nowy klucz publiczny wchodzi wyłącznie z podpisem POPRZEDNIM kluczem
 * (`verifyKeyRotation`), więc utrata kontroli nad repo nie wystarcza do zmiany zaufania. */
/* Katalog zaufania wyprowadzamy z BAZY UŻYTKOWNIKÓW (getpwuid), nie ze środowiska.
 * Wariant respektujący zmienną HOME jest tu ZAKAZANY — proces mógł wskazać katalog tymczasowy
 * z własnym kluczem i audyt to zrobił. `os.userInfo().homedir` czyta passwd, więc HOME go nie
 * zmienia. Ta warstwa nie czyta ŻADNEJ zmiennej środowiskowej ani ścieżki tymczasowej. */
function trustDir() {
  let home;
  try { home = os.userInfo().homedir; } catch { home = null; }
  if (!home) return null;
  return path.join(home, '.genome');
}
const TRUST_DIR = trustDir();
const PUBKEY_FILE = TRUST_DIR ? path.join(TRUST_DIR, 'approval-pubkey.pem') : null;
/* Podpowiedź dla komunikatów. NIE jest ścieżką pliku — klucz prywatny nie ma prawa leżeć
   w katalogu domowym, bo ten jest czytelny dla każdego procesu tego użytkownika. */
const PRIVKEY_HINT = 'Keychain z wymuszonym potwierdzeniem użytkownika / podpis offline / osobne konto — NIGDY plik w katalogu domowym';
/* ścieżka, której NIE WOLNO używać jako zaufania — zostaje wyłącznie jako sygnał w testach */
const REPO_PUBKEY_FORBIDDEN = path.join(__dirname, 'approval-pubkey.pem');

/* Kotwica musi być własnością tego użytkownika i niezapisywalna dla grupy ani innych.
   Katalog świata-zapisywalny to nie kotwica, tylko skrzynka na listy. */
function inspectTrustAnchor(file) {
  const problems = [];
  if (!file) return { ok: false, problems: ['nie da się ustalić katalogu domowego z bazy użytkowników'] };
  let real;
  try { real = fs.realpathSync(file); } catch { return { ok: false, problems: [`brak kotwicy zaufania (${file})`] }; }
  let st, dst;
  try { st = fs.statSync(real); dst = fs.statSync(path.dirname(real)); }
  catch (e) { return { ok: false, problems: ['nie da się odczytać metadanych kotwicy: ' + e.message] }; }
  const uid = typeof process.getuid === 'function' ? process.getuid() : null;
  if (uid !== null && st.uid !== uid) problems.push(`klucz publiczny należy do uid ${st.uid}, proces działa jako ${uid}`);
  if (uid !== null && dst.uid !== uid) problems.push(`katalog kotwicy należy do uid ${dst.uid}, proces działa jako ${uid}`);
  if (st.mode & 0o022) problems.push(`klucz publiczny zapisywalny dla grupy/innych (mode ${(st.mode & 0o777).toString(8)})`);
  if (dst.mode & 0o022) problems.push(`katalog kotwicy zapisywalny dla grupy/innych (mode ${(dst.mode & 0o777).toString(8)})`);
  return { ok: problems.length === 0, problems, real };
}

const PHASES = ['research', 'foundation', 'contract'];
const CONTRACT_FIELDS = [
  'client', 'business_problem', 'project_start', 'scope', 'non_scope', 'baseline',
  'mechanisms', 'frameworks', 'validation_plan', 'outcome_owner', 'measurement_date',
  'go_decision', 'go_rationale', 'prepared_by', 'decided_by', 'report_version', 'contract_version',
];
/* Co dokładnie obejmuje podpis. Kolejność bez znaczenia — kanonizacja sortuje klucze. */
const SIGNED_FIELDS = ['schema_version', 'phase', 'nonce', 'expires_at', 'project_contract', 'payload_hash',
  'artifact_hashes',   /* ← audyt rundy 5: podpis MUSI obejmować pliki, które realnie zostaną wdrożone */
  'claims', 'research', 'routing', 'recommended_mechanisms', 'recommended_frameworks', 'metrics', 'predictions'];

const isStr = v => typeof v === 'string';
const filled = v => isStr(v) && v.trim().length > 0;
const isRealDate = s => {
  if (!isStr(s) || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
};

function canonicalize(v) {
  if (v === null || typeof v !== 'object') return v;
  if (Array.isArray(v)) return v.map(canonicalize);
  const out = {};
  for (const k of Object.keys(v).sort()) out[k] = canonicalize(v[k]);
  return out;
}

/* Odcisk rzeczywistego payloadu zapisu — JEDNA definicja dla wszystkich wykonawców. */
function payloadHash(input) {
  const p = input || {};
  return crypto.createHash('sha256')
    .update(JSON.stringify(canonicalize({ events: p.events || [], evidence: p.evidence || [], objects: p.objects || [] })))
    .digest('hex');
}

/* Bajty, które właściciel realnie podpisuje. */
function signingBytes(pkg) {
  const p = pkg || {};
  const sel = {};
  for (const f of SIGNED_FIELDS) sel[f] = p[f] === undefined ? null : p[f];
  return Buffer.from(SCHEMA_VERSION + '\n' + JSON.stringify(canonicalize(sel)), 'utf8');
}
function fingerprint(pkg) {
  return crypto.createHash('sha256').update(signingBytes(pkg)).digest('hex');
}

function validateProjectContract(pc) {
  const errors = [];
  if (!pc || typeof pc !== 'object' || Array.isArray(pc)) return { ok: false, errors: ['project_contract nie jest obiektem'] };
  for (const f of CONTRACT_FIELDS) {
    if (pc[f] === undefined || pc[f] === null) { errors.push(`Project Contract bez pola "${f}"`); continue; }
    if (['mechanisms', 'frameworks'].includes(f)) { if (!Array.isArray(pc[f])) errors.push(`"${f}" musi być tablicą`); continue; }
    if (!filled(pc[f])) errors.push(`Project Contract: pole "${f}" jest puste`);
  }
  if (pc.go_decision != null && !['GO', 'REVISE', 'STOP'].includes(pc.go_decision))
    errors.push(`go_decision musi być GO|REVISE|STOP (jest: "${pc.go_decision}")`);
  if (filled(pc.prepared_by) && filled(pc.decided_by)) {
    if (pc.prepared_by === pc.decided_by) errors.push('prepared_by === decided_by');
    if (/^(session|agent|migration|ingest|deploy|recovery)[:\-]/i.test(pc.decided_by))
      errors.push(`decided_by "${pc.decided_by}" wygląda na proces — decyzję podejmuje człowiek`);
  }
  for (const f of ['project_start', 'measurement_date'])
    if (filled(pc[f]) && !isRealDate(pc[f])) errors.push(`"${f}" musi być realną datą YYYY-MM-DD`);
  return { ok: errors.length === 0, errors };
}

/* ZERO PUNKTU WSTRZYKNIĘCIA. Funkcja nie przyjmuje żadnego argumentu: klucz publiczny pochodzi
 * wyłącznie z kotwicy wyprowadzonej z bazy użytkowników. Parametr `publicKeyPem` istniał tu do
 * rundy 7 „dla testów" — i był nieprawdziwym wyjątkiem od deklaracji, że wstrzyknięcia nie ma.
 * Testy podmieniają `trustDir()` w KOPII tego pliku; kopia nie jest w manifeście wdrożeniowym. */
function loadPublicKey() {
  const insp = inspectTrustAnchor(PUBKEY_FILE);
  if (!insp.ok) return { ok: false, why: `kotwica zaufania odrzucona: ${insp.problems.join('; ')}. Klucz zakłada właściciel poza repo (patrz SETUP-KOTWICY.md); ścieżka pochodzi z bazy użytkowników.` };
  const pem = fs.readFileSync(insp.real, 'utf8');
  const source = insp.real;
  try {
    const key = crypto.createPublicKey(pem);
    if (key.asymmetricKeyType !== 'ed25519') return { ok: false, why: `klucz publiczny nie jest Ed25519 (${key.asymmetricKeyType})` };
    return { ok: true, key, source };
  } catch (e) { return { ok: false, why: 'klucz publiczny nie daje się wczytać: ' + e.message }; }
}

/**
 * Weryfikacja zgody. Zwraca stan; NIE zapisuje niczego i NIE potrafi podpisać.
 * @param {object} approval  { package, signature, nonce, approved_by }
 * @param {object} input     { events, evidence, objects } — rzeczywisty payload zapisu
 */
function verifyApproval(approval, input, opts = {}) {
  const a = approval || {};
  const pkg = a.package || null;
  const today = opts.today || new Date().toISOString().slice(0, 10);
  const base = { schema_version: SCHEMA_VERSION };

  if (!pkg) return { ...base, state: 'invalid', why: 'brak approval.package' };
  if (pkg.schema_version !== SCHEMA_VERSION)
    return { ...base, state: 'invalid', why: `schema_version pakietu "${pkg.schema_version}" ≠ "${SCHEMA_VERSION}"` };
  if (!filled(a.signature)) return { ...base, state: 'unverified', why: 'brak podpisu — status/approved_by to dane, nie zgoda' };
  if (!filled(pkg.nonce)) return { ...base, state: 'invalid', why: 'pakiet bez nonce — zgoda musi być jednorazowa' };
  if (!filled(a.nonce) || a.nonce !== pkg.nonce) return { ...base, state: 'invalid', why: 'approval.nonce ≠ package.nonce' };
  if (!isRealDate(pkg.expires_at)) return { ...base, state: 'invalid', why: 'pakiet bez poprawnego expires_at' };
  if (pkg.expires_at < today) return { ...base, state: 'expired', why: `zgoda wygasła ${pkg.expires_at} (dziś ${today})` };
  if (!PHASES.includes(pkg.phase)) return { ...base, state: 'invalid', why: `phase spoza słownika: "${pkg.phase}"` };
  if (!filled(pkg.payload_hash)) return { ...base, state: 'invalid', why: 'pakiet bez payload_hash' };
  if (opts.requireArtifacts && (!pkg.artifact_hashes || !Object.keys(pkg.artifact_hashes).length))
    return { ...base, state: 'invalid', why: 'pakiet bez artifact_hashes — podpis nie obejmowałby wdrażanych plików (ROUTER.md, skille, biblioteki, writer, testy, sam wykonawca)' };

  const v = validateProjectContract(pkg.project_contract);
  if (!v.ok) return { ...base, state: 'invalid', why: `Project Contract niekompletny: ${v.errors[0]}${v.errors.length > 1 ? ` (+${v.errors.length - 1})` : ''}` };

  const actual = payloadHash(input);
  if (actual !== pkg.payload_hash)
    return { ...base, state: 'payload_mismatch', why: `payload_hash: podpisano ${pkg.payload_hash}, do zapisu idzie ${actual}` };

  const pk = loadPublicKey();
  if (!pk.ok) return { ...base, state: 'unverifiable', why: pk.why };

  let okSig = false;
  try { okSig = crypto.verify(null, signingBytes(pkg), pk.key, Buffer.from(a.signature, 'hex')); }
  catch (e) { return { ...base, state: 'invalid', why: 'podpis nie daje się zdekodować: ' + e.message }; }

  return okSig
    ? { ...base, state: 'verified', fingerprint: fingerprint(pkg), key_source: pk.source, nonce: pkg.nonce, why: 'podpis Ed25519 zgodny' }
    : { ...base, state: 'invalid', fingerprint: fingerprint(pkg), key_source: pk.source, why: 'podpis nie pasuje do pakietu — treść zmieniona po akceptacji albo podpis fałszywy' };
}

/* ── ARTEFAKTY: czytamy KAŻDY plik dokładnie raz, liczymy hash, porównujemy z podpisanym.
   Zwracamy TE SAME bufory — to one mają trafić na dysk, żeby między weryfikacją a zapisem
   nie było drugiego odczytu (TOCTOU). ── */
function verifyArtifacts(signedHashes, resolve) {
  const problems = [], buffers = new Map();
  const entries = Object.entries(signedHashes || {});
  if (!entries.length) return { ok: false, problems: ['brak artifact_hashes w podpisanym pakiecie'], buffers };
  for (const [rel, expected] of entries) {
    const abs = resolve(rel);
    let buf;
    try { buf = fs.readFileSync(abs); }
    catch { problems.push(`${rel}: BRAK PLIKU (${abs})`); continue; }
    const got = crypto.createHash('sha256').update(buf).digest('hex');
    if (got !== expected) { problems.push(`${rel}: sha256 ${got.slice(0, 16)}… ≠ podpisany ${String(expected).slice(0, 16)}…`); continue; }
    buffers.set(rel, buf);
  }
  return { ok: problems.length === 0, problems, buffers };
}

/* ── ROTACJA KLUCZA: nowy klucz publiczny wymaga podpisu POPRZEDNIM kluczem ── */
function verifyKeyRotation({ new_public_key_pem, signature, valid_from }) {
  if (!filled(new_public_key_pem)) return { ok: false, why: 'brak nowego klucza publicznego' };
  if (!filled(signature)) return { ok: false, why: 'rotacja bez podpisu poprzednim kluczem' };
  let newKey;
  try { newKey = crypto.createPublicKey(new_public_key_pem); }
  catch (e) { return { ok: false, why: 'nowy klucz nie daje się wczytać: ' + e.message }; }
  if (newKey.asymmetricKeyType !== 'ed25519') return { ok: false, why: 'nowy klucz nie jest Ed25519' };
  const prev = loadPublicKey();
  if (!prev.ok) return { ok: false, why: 'brak POPRZEDNIEGO klucza — rotacji nie da się uwierzytelnić: ' + prev.why };
  const bytes = Buffer.from(`${SCHEMA_VERSION}\nkey-rotation\n${valid_from || ''}\n${new_public_key_pem.trim()}`, 'utf8');
  let ok = false;
  try { ok = crypto.verify(null, bytes, prev.key, Buffer.from(signature, 'hex')); } catch { ok = false; }
  return ok ? { ok: true, why: 'rotacja podpisana poprzednim kluczem' }
    : { ok: false, why: 'podpis rotacji nie pasuje — nowy klucz NIE zostaje przyjęty' };
}

module.exports = {
  SCHEMA_VERSION, PUBKEY_FILE, TRUST_DIR, REPO_PUBKEY_FORBIDDEN, PRIVKEY_HINT, PHASES, CONTRACT_FIELDS, SIGNED_FIELDS,
  trustDir, inspectTrustAnchor,
  verifyKeyRotation,
  canonicalize, payloadHash, signingBytes, fingerprint, validateProjectContract, verifyArtifacts,
  loadPublicKey, verifyApproval, isRealDate,
};
