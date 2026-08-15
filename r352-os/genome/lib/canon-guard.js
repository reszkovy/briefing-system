#!/usr/bin/env node
/* ═══ GUARD KANONU — jedna definicja „to nie jest kopia, to jest kanon" ═══
 *
 * Poprzednie wersje pytały „czy cel leży w katalogu tymczasowym?" i sprawdzały to przez
 * `os.tmpdir()`. To była dziura: `TMPDIR` ustawia wywołujący, więc katalog obok kanonu dawał się
 * przedstawić jako piaskownica. Drugą dziurą był symlink — `r352-os/genome` w „tymczasowym" repo
 * mógł wskazywać na kanon, a sprawdzany był tylko korzeń repo.
 *
 * Odwracamy pytanie: nie „czy to piaskownica", tylko **„czy któryś z REALNYCH celów zapisu
 * dotyka kanonu"**. To jest właściwość, której wywołujący nie ustawia zmienną środowiskową.
 * Każda ścieżka jest rozwiązywana przez realpath (z tolerancją na nieistniejące ogony), więc
 * symlink prowadzący do kanonu jest widoczny.
 *
 * Zero zależności od środowiska: brak process.env, brak os.tmpdir(), brak os.homedir().
 */
'use strict';
const fs = require('fs');
const path = require('path');

/* realpath odporny na nieistniejącą ścieżkę: rozwiązuje najgłębszego istniejącego przodka
   i dokleja resztę. Bez tego katalog, który dopiero powstanie, wymykałby się kontroli. */
function resolveDeep(p) {
  let abs = path.resolve(p);
  const rest = [];
  for (let i = 0; i < 64; i++) {
    try { return path.join(fs.realpathSync(abs), ...rest.slice().reverse()); }
    catch {
      const parent = path.dirname(abs);
      if (parent === abs) return path.resolve(p);
      rest.push(path.basename(abs));
      abs = parent;
    }
  }
  return path.resolve(p);
}

const isInside = (child, parent) => child === parent || child.startsWith(parent + path.sep);

/**
 * @param {string[]} targets  wszystkie miejsca, w które operacja MOŻE pisać
 * @param {string[]} canonRoots  kanoniczny Genome i kanoniczne repo
 * @returns {{ok:boolean, hits:Array<{target:string,real:string,canon:string}>}}
 */
function checkTargetsAgainstCanon(targets, canonRoots) {
  const canon = canonRoots.filter(Boolean).map(resolveDeep);
  const hits = [];
  for (const t of targets.filter(Boolean)) {
    const real = resolveDeep(t);
    for (const c of canon) {
      /* trafienie w obie strony: cel wewnątrz kanonu ORAZ kanon wewnątrz celu
         (drugi przypadek to „podaj korzeń repo i pisz w środku") */
      if (isInside(real, c) || isInside(c, real)) { hits.push({ target: t, real, canon: c }); break; }
    }
  }
  return { ok: hits.length === 0, hits };
}

/** Komunikat gotowy do wypisania. */
function canonGuardError(hits) {
  return 'OPERACJA ODRZUCONA: wskazany cel dotyka KANONICZNEGO Genome.\n'
    + hits.map(h => `   • ${h.target}\n     → realpath ${h.real}\n     → kanon    ${h.canon}`).join('\n')
    + '\n   Symlink i podmieniony TMPDIR nie omijają tej kontroli — sprawdzane są REALNE ścieżki zapisu.';
}

/* Korzenie kanonu wyprowadzone z lokalizacji Genome. Repo dokładamy WYŁĄCZNIE wtedy, gdy układ
   naprawdę wygląda jak `<repo>/r352-os/genome` — inaczej „dwa katalogi wyżej" bywa przypadkowym
   katalogiem nadrzędnym i guard zaczyna blokować legalne kopie robocze. */
function looksLikeGenome(dir) {
  try { return fs.existsSync(path.join(dir, 'build.js')) && fs.existsSync(path.join(dir, 'ledger')) && fs.existsSync(path.join(dir, 'records')); }
  catch { return false; }
}

/* Korzenie kanonu wyprowadzone z lokalizacji modułu — ale TYLKO gdy ta lokalizacja NAPRAWDĘ jest
   Genome (build.js + ledger/ + records/). Kopia wykonawcy w katalogu roboczym nie ma czego chronić
   „u siebie", więc nie wymyślamy jej fikcyjnego kanonu. */
function canonRootsFor(genomeRoot) {
  const g = resolveDeep(genomeRoot);
  if (!looksLikeGenome(g)) return [];
  const roots = [g];
  if (path.basename(g) === 'genome' && path.basename(path.dirname(g)) === 'r352-os')
    roots.push(path.dirname(path.dirname(g)));
  return roots;
}

/* DRUGA, niezależna reguła: żadna REALNA ścieżka zapisu nie może wyjść poza zadeklarowany cel.
   To ona łapie symlink `r352-os/genome` → kanon, nawet gdy wykonawca jest kopią i nie zna kanonu. */
function checkTargetsEscapeRoot(targets, declaredRoot) {
  const root = resolveDeep(declaredRoot);
  const hits = [];
  for (const tgt of targets.filter(Boolean)) {
    const real = resolveDeep(tgt);
    if (!isInside(real, root)) hits.push({ target: tgt, real, canon: root });
  }
  return { ok: hits.length === 0, hits };
}

function escapeGuardError(hits) {
  return 'OPERACJA ODRZUCONA: ścieżka zapisu WYCHODZI poza zadeklarowany cel.\n'
    + hits.map(h => `   • ${h.target}\n     → realpath ${h.real}\n     → cel      ${h.canon}`).join('\n')
    + '\n   Symlink prowadzący poza cel jest tu widoczny, bo porównujemy REALNE ścieżki.';
}

module.exports = { resolveDeep, isInside, looksLikeGenome, checkTargetsAgainstCanon, canonGuardError, canonRootsFor, checkTargetsEscapeRoot, escapeGuardError };
