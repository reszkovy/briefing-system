#!/usr/bin/env node
/* ═══ TRANSAKCJA NA GENOME — jedna blokada, jeden rollback ═══
 *
 * Powód powstania (audyt rundy 4): `recover.sh` i `deploy.sh` deklarowały transakcję, ale jej nie
 * miały — kopiowały pliki PRZED blokadą, a rollback obejmował tylko część zmian. Skrypt shellowy
 * nie cofnie tego, co zapisał inny proces. Wykonawcy dostają więc jedno, wspólne prymitywum.
 *
 * Gwarancje:
 *   • wszystko dzieje się pod WSPÓLNĄ blokadą `.genome-write.lock` (tą samą co ingest i migrate),
 *   • każdy plik jest bajtowo zapamiętany PRZED pierwszą modyfikacją (również „nie istniał"),
 *   • rollback przywraca bajty, kasuje pliki utworzone i usuwa katalogi utworzone,
 *   • preconditions sprawdzane POD blokadą — dryf = abort przed jakimkolwiek zapisem,
 *   • zapis atomowy per plik (tmp + rename).
 *
 * ZNANE OGRANICZENIE (nazwane, nie ukryte): `ingest.js` ma własną, starszą implementację
 * dopisywania do Ledgera, pokrytą 19 testami pisarza. Ten moduł jej nie zastępuje — obsługuje
 * wykonawców bootstrapowych (recovery) i wdrożeniowych. Zwinięcie ingest.js na `Txn` to osobna
 * zmiana, której nie robię przy okazji naprawy incydentu.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { withGenomeWriteLock } = require('./genome-common.js');

const sha256 = b => crypto.createHash('sha256').update(b).digest('hex');
const hash16 = s => sha256(s).slice(0, 16);

/* ═══ DZIENNIK TRWAŁY — odporność na SIGKILL / utratę zasilania ═══ (audyt rundy 5)
 * Rollback w `catch` nie zadziała, gdy proces zginie. Dlatego PRZED pierwszą modyfikacją każdego
 * pliku jego oryginalne bajty lądują na dysku w `.genome-txn/`, a `manifest.json` opisuje, co
 * jest w trakcie. Kolejny wykonawca widzi dziennik po martwym procesie i cofa transakcję
 * automatycznie, ZANIM cokolwiek zrobi. Po udanym commicie dziennik znika.
 */
const JOURNAL_DIR = '.genome-txn';

class Txn {
  constructor(root) {
    this.root = root;
    this.before = new Map();     // abs → Buffer | null (null = nie istniał)
    this.createdDirs = [];
    this.log = [];
    this.journalDir = path.join(root, JOURNAL_DIR);
    this.journalSeq = 0;
    this.journal = { state: 'PREPARED', pid: process.pid, started: new Date().toISOString(), entries: [], dirs: [] };
  }
  _flushJournal() {
    fs.mkdirSync(this.journalDir, { recursive: true });
    const tmp = path.join(this.journalDir, 'manifest.json.tmp');
    fs.writeFileSync(tmp, JSON.stringify(this.journal));
    fs.renameSync(tmp, path.join(this.journalDir, 'manifest.json'));
  }
  _journalBefore(absFile) {
    const rel = path.relative(this.root, absFile);
    if (this.journal.entries.some(e => e.rel === rel)) return;
    const existed = fs.existsSync(absFile);
    let blob = null, sha = null;
    if (existed) {
      const buf = fs.readFileSync(absFile);
      sha = sha256(buf);                                  /* hash oryginału — do weryfikacji odtworzenia */
      blob = `blob-${String(++this.journalSeq).padStart(4, '0')}`;
      fs.mkdirSync(this.journalDir, { recursive: true });
      fs.writeFileSync(path.join(this.journalDir, blob), buf);
    }
    this.journal.entries.push({ rel, existed, blob, sha });
    this._flushJournal();
  }
  /* COMMITTED oznacza: transakcja zakończona, dziennika NIE WOLNO już rollbackować — tylko sprzątnąć. */
  _commitJournal() {
    if (!fs.existsSync(path.join(this.journalDir, 'manifest.json'))) return;
    this.journal.state = 'COMMITTED';
    this.journal.committed = new Date().toISOString();
    this._flushJournal();
  }
  _clearJournal() { try { fs.rmSync(this.journalDir, { recursive: true, force: true }); } catch { /* best effort */ } }
  abs(rel) { return path.isAbsolute(rel) ? rel : path.join(this.root, rel); }
  rel(p) { return path.relative(this.root, this.abs(p)); }

  /* zapamiętaj bajty przed pierwszą modyfikacją */
  snapshot(relOrAbs) {
    const f = this.abs(relOrAbs);
    if (this.before.has(f)) return;
    this.before.set(f, fs.existsSync(f) ? fs.readFileSync(f) : null);
    this._journalBefore(f);    /* trwały ślad na dysku — przeżyje SIGKILL */
  }
  read(relOrAbs) {
    const f = this.abs(relOrAbs);
    return fs.existsSync(f) ? fs.readFileSync(f) : null;
  }
  sha(relOrAbs) { const b = this.read(relOrAbs); return b === null ? null : sha256(b); }

  write(relOrAbs, content) {
    const f = this.abs(relOrAbs);
    this.snapshot(f);
    let d = path.dirname(f);
    const missing = [];
    while (!fs.existsSync(d)) { missing.push(d); d = path.dirname(d); }
    for (const m of missing.reverse()) {
      fs.mkdirSync(m); this.createdDirs.push(m);
      this.journal.dirs = (this.journal.dirs || []).concat(path.relative(this.root, m));
    }
    if (missing.length) this._flushJournal();
    const tmp = f + '.txn.tmp';
    fs.writeFileSync(tmp, content);
    fs.renameSync(tmp, f);
    this.log.push(`write ${this.rel(f)}`);
  }
  copy(srcAbs, relOrAbsDst) { this.write(relOrAbsDst, fs.readFileSync(srcAbs)); }
  /* Katalog, który MOŻE utworzyć proces zewnętrzny (np. sync-skills). Jeśli nie istniał przed
     transakcją, rollback go usunie — o ile zostanie pusty. Bez tego rollback zostawiałby
     puste katalogi i stan nie byłby bajtowo identyczny. */
  expectDir(relOrAbs) {
    const d = this.abs(relOrAbs);
    if (!fs.existsSync(d) && !this.createdDirs.includes(d)) {
      this.createdDirs.push(d);
      this.journal.dirs = (this.journal.dirs || []).concat(path.relative(this.root, d));
      this._flushJournal();
    }
  }
  append(relOrAbs, text) {
    const cur = this.read(relOrAbs);
    const prev = cur ? cur.toString('utf8') : '';
    this.write(relOrAbs, (prev ? prev.replace(/\n*$/, '\n') : '') + text.replace(/\n*$/, '\n'));
  }

  /* ── Ledger: alokacja ID, ts, hash-chain ── */
  appendEvents(events, { tz = 'Europe/Madrid', now = new Date() } = {}) {
    if (!events.length) return [];
    const fmt = new Intl.DateTimeFormat('sv-SE', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
    const date = fmt.format(now);
    const month = date.slice(0, 7);
    const file = path.join(this.root, 'ledger', `events-${month}.jsonl`);
    this.snapshot(file);
    const raw = this.read(file);
    const lines = raw ? raw.toString('utf8').split('\n').filter(Boolean) : [];
    let prev = lines.length ? hash16(lines[lines.length - 1]) : 'genesis';
    /* najwyższy numer seryjny w tym dniu we WSZYSTKICH partycjach */
    let maxSeq = 0;
    for (const f of fs.existsSync(path.join(this.root, 'ledger')) ? fs.readdirSync(path.join(this.root, 'ledger')) : []) {
      if (!/^events-\d{4}-\d{2}\.jsonl$/.test(f)) continue;
      for (const l of fs.readFileSync(path.join(this.root, 'ledger', f), 'utf8').split('\n').filter(Boolean)) {
        const m = l.match(new RegExp('"id":"evt:' + date + '-(\\d{4})"'));
        if (m) maxSeq = Math.max(maxSeq, Number(m[1]));
      }
    }
    const out = [];
    for (const e of events) {
      maxSeq++;
      const ev = { id: `evt:${date}-${String(maxSeq).padStart(4, '0')}`, ts: now.toISOString(), ...e, prev_hash: prev };
      const line = JSON.stringify(ev);
      lines.push(line);
      prev = hash16(line);
      out.push(ev);
    }
    this.write(file, lines.join('\n') + '\n');
    return out;
  }

  /* ── rejestr zużytych nonce (poza ledger/, bo build czyta stamtąd każdy .jsonl) ── */
  consumeNonce(entry) {
    const file = path.join(this.root, '.approval-nonces.jsonl');
    this.snapshot(file);
    const raw = this.read(file);
    const used = raw ? raw.toString('utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return {}; } }) : [];
    const clash = used.find(u => u.nonce === entry.nonce);
    if (clash) return { ok: false, why: `nonce "${entry.nonce}" zużyty ${clash.consumed_at} przez ${clash.approved_by}` };
    this.append(file, JSON.stringify(entry));
    return { ok: true };
  }

  /* Rollback synchroniczny. KAŻDY problem = `ok:false`; wtedy dziennika NIE WOLNO usuwać,
     bo to jedyne dane ratunkowe dla pliku, którego nie udało się przywrócić. */
  rollback() {
    const restored = [], problems = [];
    for (const [f, buf] of this.before) {
      const rel = this.rel(f);
      try {
        if (buf === null) {
          if (fs.existsSync(f)) { fs.unlinkSync(f); restored.push('usunięto ' + rel); }
          if (fs.existsSync(f)) { problems.push(`${rel}: plik nadal istnieje po próbie usunięcia`); continue; }
          continue;
        }
        fs.writeFileSync(f, buf);
        /* weryfikacja hashem: zapis mógł się „udać" i zostawić inną treść (pełny dysk, FUSE) */
        const back = fs.readFileSync(f);
        if (sha256(back) !== sha256(buf)) { problems.push(`${rel}: treść po przywróceniu ≠ oryginał`); continue; }
        restored.push('przywrócono ' + rel);
      } catch (e) { problems.push(`${rel}: ${e.message}`); }
    }
    if (!problems.length) {
      for (const d of this.createdDirs.slice().reverse()) {
        try { if (fs.existsSync(d) && fs.readdirSync(d).length === 0) fs.rmdirSync(d); } catch { /* niepusty — zostaje */ }
      }
    }
    return { ok: problems.length === 0, restored, problems };
  }
}

/* ═══ RECOVERY-ON-START: dokończenie po SIGKILL ═══
 * Wywoływane PRZED każdą transakcją. Jeśli w korzeniu leży dziennik po procesie, który nie żyje,
 * cofamy jego zmiany bajtowo i usuwamy dziennik. Dziennik żywego procesu jest nietykalny. */
function recoverPendingTransaction(root) {
  const jdir = path.join(root, JOURNAL_DIR);
  const man = path.join(jdir, 'manifest.json');
  if (!fs.existsSync(man)) return { pending: false };
  let j;
  try { j = JSON.parse(fs.readFileSync(man, 'utf8')); }
  catch { return { pending: true, ok: false, why: `dziennik ${man} jest nieczytelny — wymaga decyzji człowieka; NIC nie zostało zmienione ani usunięte`, dir: jdir }; }

  if (j.pid) { try { process.kill(j.pid, 0); return { pending: true, ok: false, alive: true, why: `dziennik należy do ŻYJĄCEGO procesu PID ${j.pid} — nie dotykamy` }; } catch { /* martwy */ } }

  /* COMMITTED: transakcja się udała, proces zginął przed sprzątnięciem.
     Rollback byłby COFNIĘCIEM UDANEJ PRACY — wolno wyłącznie sprzątnąć. */
  if (j.state === 'COMMITTED') {
    try { fs.rmSync(jdir, { recursive: true, force: true }); }
    catch (e) { return { pending: true, ok: false, why: `dziennik COMMITTED, ale nie da się go usunąć: ${e.message} — usuń ręcznie ${jdir}` }; }
    return { pending: true, ok: true, committed: true, recovered: [], why: 'dziennik COMMITTED — transakcja była udana, tylko sprzątnięto' };
  }

  /* PREPARED: cofamy. KAŻDY błąd = zatrzymanie; dziennik i bloby ZOSTAJĄ nietknięte. */
  const restored = [], problems = [];
  for (const e of (j.entries || []).slice().reverse()) {
    const abs = path.join(root, e.rel);
    try {
      if (!e.existed) {
        if (fs.existsSync(abs)) { fs.unlinkSync(abs); restored.push('usunięto ' + e.rel); }
        continue;
      }
      const blobPath = path.join(jdir, e.blob);
      if (!fs.existsSync(blobPath)) { problems.push(`${e.rel}: BRAK BLOBU ${e.blob} — nie da się odtworzyć oryginału`); continue; }
      const buf = fs.readFileSync(blobPath);
      if (e.sha && sha256(buf) !== e.sha) { problems.push(`${e.rel}: BLOB USZKODZONY (sha256 ${sha256(buf).slice(0, 16)}… ≠ ${String(e.sha).slice(0, 16)}…)`); continue; }
      fs.writeFileSync(abs, buf);
      const back = sha256(fs.readFileSync(abs));
      if (e.sha && back !== e.sha) { problems.push(`${e.rel}: zapis odtworzenia nie zgadza się z hashem oryginału`); continue; }
      restored.push('przywrócono ' + e.rel);
    } catch (err) { problems.push(`${e.rel}: ${err.message}`); }
  }

  if (problems.length) {
    return { pending: true, ok: false, partial: restored, problems, dir: jdir, why:
      `ODTWORZENIE NIEUKOŃCZONE (${problems.length} błędów). Dziennik i wszystkie bloby ZOSTAJĄ nietknięte — ` +
      `żadna kolejna transakcja nie ruszy, dopóki człowiek tego nie rozstrzygnie. Katalog: ${jdir}` };
  }

  for (const d of (j.dirs || []).slice().reverse()) {
    const abs = path.join(root, d);
    try { if (fs.existsSync(abs) && fs.readdirSync(abs).length === 0) fs.rmdirSync(abs); } catch { /* niepusty */ }
  }
  try { fs.rmSync(jdir, { recursive: true, force: true }); }
  catch (e) { return { pending: true, ok: false, why: `rollback wykonany, ale dziennika nie da się usunąć: ${e.message} — usuń ręcznie ${jdir}`, partial: restored }; }
  return { pending: true, ok: true, recovered: restored, started: j.started, pid: j.pid };
}

/* Pełny hash drzewa — do porównań przed/po i do testów awarii. */
function treeHash(root, skip = /(^|\/)(dist|node_modules|proposals|\.genome-write\.lock|\.genome-txn)(\/|$)/) {
  const out = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : 1)) {
      const q = path.join(d, e.name);
      if (skip.test(q.slice(root.length))) continue;
      e.isDirectory() ? walk(q) : out.push(q.slice(root.length) + ':' + sha256(fs.readFileSync(q)));
    }
  })(root);
  return sha256(out.sort().join('\n'));
}

/**
 * Uruchamia `body(txn)` pod wspólną blokadą. Każdy wyjątek albo `{ ok:false }` = pełny rollback.
 * `hooks.afterStep(name, txn)` może rzucić — do wymuszania awarii w testach.
 */
function runTransaction(root, body, opts = {}) {
  return withGenomeWriteLock(root, () => {
    /* najpierw dokończ po ewentualnym SIGKILL, dopiero potem własna transakcja */
    const pend = recoverPendingTransaction(root);
    if (pend.pending && !pend.ok) return { ok: false, error: `NIEDOKOŃCZONA TRANSAKCJA: ${pend.why}` };
    if (pend.pending && pend.ok && opts.onRecovered) opts.onRecovered(pend);

    const txn = new Txn(root);
    try {
      const res = body(txn);
      if (!res || res.ok === false) {
        const rb = txn.rollback();
        if (!rb.ok) return { ok: false, rollback_failed: true, restored: rb.restored, rollback_problems: rb.problems,
          journal: txn.journalDir, ...(res || {}),
          error: `ROLLBACK NIEPEŁNY (${rb.problems.length} błędów) — dziennik i bloby ZOSTAJĄ w ${txn.journalDir}; żadna kolejna transakcja nie ruszy, dopóki człowiek tego nie rozstrzygnie.` };
        txn._clearJournal();   /* dziennik znika WYŁĄCZNIE po pełnym, zweryfikowanym rollbacku */
        return { ok: false, rolled_back: true, restored: rb.restored, ...(res || {}) };
      }
      txn._commitJournal();   /* najpierw ZNACZNIK COMMITTED na dysku… */
      txn._clearJournal();    /* …dopiero potem sprzątanie; SIGKILL między nimi = tylko sprzątanie */
      return { ok: true, ...res, files_written: txn.log.length, recovered_before: pend.pending ? pend.recovered : undefined };
    } catch (e) {
      const rb = txn.rollback();
      if (!rb.ok) return { ok: false, rollback_failed: true, restored: rb.restored, rollback_problems: rb.problems,
        journal: txn.journalDir,
        error: `ROLLBACK NIEPEŁNY po błędzie "${e.message}" (${rb.problems.length} problemów) — dziennik i bloby ZOSTAJĄ w ${txn.journalDir}.`,
        stack: opts.debug ? e.stack : undefined };
      txn._clearJournal();
      return { ok: false, rolled_back: true, restored: rb.restored, error: e.message, stack: opts.debug ? e.stack : undefined };
    }
  });
}

module.exports = { Txn, runTransaction, recoverPendingTransaction, treeHash, sha256, hash16, JOURNAL_DIR };
