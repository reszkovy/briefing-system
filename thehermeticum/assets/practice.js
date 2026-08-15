/* The Practice — MVP. Dane wyłącznie lokalnie (IndexedDB, awaryjnie localStorage).
   Żadna treść odpowiedzi nie opuszcza przeglądarki: analityka mierzy tylko zdarzenia funkcjonalne. */
(function () {
  'use strict';
  var PL = (document.documentElement.lang || 'en').indexOf('pl') === 0;
  var DB = 'hermeticum-practice', STORE = 'days', LS = 'hermeticum-practice-days';
  var PSTORE = 'patterns', PLS = 'hermeticum-practice-patterns';
  var DBV = 2;
  var SCHEMA = 1;

  var T = PL ? {
    saved: 'Zapisano', saving: 'Zapisywanie…', failed: 'Nie udało się zapisać lokalnie',
    beginH: 'Początek', beginS: 'Dwie, trzy minuty. Każde pytanie możesz pominąć.',
    q_state: 'Jaki jest teraz Twój stan?', q_matters: 'Co ma dziś największe znaczenie?',
    q_not: 'Czego świadomie dziś nie zrobisz?', energy: 'Energia (opcjonalnie)',
    energyNote: 'To nie jest ocena dobrego ani złego dnia — tylko punkt odniesienia.',
    resetH: 'Reset uwagi', resetS: 'Opcjonalny. Uruchom, kiedy czujesz rozproszenie albo przeciążenie. Możesz go powtórzyć w ciągu dnia.',
    r_pull: 'Co przejmuje teraz Twoją uwagę?', r_remove: 'Co możesz usunąć, zamknąć albo odłożyć?',
    r_next: 'Jaki jest następny skupiony ruch?', r_stop: 'Po czym poznasz, że należy zakończyć?',
    hints: ['Jakie są fakty?', 'Jaką interpretację do nich dodajesz?', 'Co sygnalizuje ciało?'],
    aiH: 'Orientacja przed AI', aiS: 'Opcjonalna. Zanim poprosisz model o odpowiedź, ustal własne stanowisko.',
    a_q: 'O co naprawdę pytasz?', a_facts: 'Co wiesz na pewno, a co zakładasz?',
    a_own: 'Jakie jest Twoje stanowisko, zanim zapytasz?', a_use: 'Do czego użyjesz odpowiedzi — i czego nie oddajesz modelowi?',
    addReset: 'Dodaj reset uwagi', addAi: 'Dodaj orientację przed AI', at: 'o',
    closeH: 'Zamknięcie', closeS: 'Około pięciu minut, wieczorem.',
    c_happened: 'Co faktycznie się wydarzyło?', c_energy: 'Co zmieniło Twoją energię?',
    c_pattern: 'Jaki wzór zauważyłeś?', c_change: 'Co będziesz kontynuować, zmieniać albo kończyć?',
    c_next: 'Jaki jest następny ruch?', c_unsolved: 'Czego nie trzeba rozwiązywać dziś wieczorem?',
    finish: 'Zamknij dzień', reopen: 'Dzień zamknięty — możesz nadal edytować',
    download: 'Pobierz zapis dnia (.md)', copyAI: 'Skopiuj dla AI', copied: 'Skopiowano do schowka',
    archive: 'Archiwum', archiveEmpty: 'Nie ma jeszcze żadnych zapisów.',
    exportAll: 'Eksportuj wszystko', deleteAll: 'Usuń wszystkie dane',
    del: 'Usuń', open: 'Otwórz', confirmOne: 'Usunąć zapis z dnia %s? Tej operacji nie da się cofnąć.',
    confirmAll: 'Usunąć wszystkie zapisy? Tej operacji nie da się cofnąć. Rozważ najpierw eksport.',
    started: 'rozpoczęty', completed: 'zamknięty', resets: 'resetów',
    begin_cta: 'Zacznij dzisiejszą praktykę', cont_cta: 'Kontynuuj dzisiejszą praktykę',
    review_cta: 'Przejrzyj dzisiejszą praktykę', yesterday: 'Wróć do wczorajszego zapisu',
    today: 'Dzisiaj', backToday: 'Wróć do dzisiaj', editing: 'Edytujesz zapis z dnia',

    /* ── wzory ── */
    pat_save: 'Zapisz jako zauważony wzór',
    pat_saved: 'Zapisano wzór. Znajdziesz go w archiwum.',
    pat_needText: 'Najpierw opisz wzór w polu powyżej.',
    pat_h: 'Wzory',
    pat_s: 'Wzory zapisujesz sam. Status zmieniasz sam. Nic nie dzieje się automatycznie.',
    pat_empty: 'Nie ma jeszcze zapisanych wzorów. Zapisujesz je przy wieczornym zamknięciu.',
    pat_g_observed: 'Zauważone wzory', pat_g_tested: 'Sprawdzone praktyki', pat_g_integrated: 'Zintegrowane zasady',
    pat_count_1: 'pozycja', pat_count_2: 'pozycje', pat_count_5: 'pozycji',
    pat_from: 'z wpisu', pat_since: 'zapisany',
    pat_test: 'Sprawdź inną reakcję', pat_testH: 'Sprawdzenie praktyki',
    pat_practice: 'Co chcę zrobić inaczej?', pat_trigger: 'W jakiej sytuacji?',
    pat_marker: 'Po czym poznam rezultat?', pat_when: 'Kiedy wrócę do tego?',
    pat_nonaction: 'Czego świadomie nie zrobię? (opcjonalnie)',
    pat_returnH: 'Powrót do sprawdzenia',
    pat_result: 'Co się wydarzyło?', pat_observation: 'Co się zmieniło?',
    pat_learning: 'Czego się nauczyłem?', pat_continue: 'Czy kontynuuję?',
    pat_markTested: 'Oznacz jako sprawdzone',
    pat_intH: 'Integracja zasady',
    pat_intQ: 'Czy ten wynik zmienia sposób, w jaki chcesz działać w przyszłości?',
    pat_principle: 'Zasada, którą chcesz zapisać własnymi słowami',
    pat_integrate: 'Dodaj do mojego standardu działania',
    pat_edit: 'Otwórz', pat_close: 'Zwiń',
    pat_confirmDel: 'Usunąć ten wzór? Tej operacji nie da się cofnąć.',
    pat_exportOne: '.md', pat_exportPrinciples: 'Eksportuj zintegrowane zasady',
    pat_st_observed: 'zauważony', pat_st_tested: 'sprawdzony', pat_st_integrated: 'zintegrowany',
    pat_needPractice: 'Opisz najpierw, co chcesz zrobić inaczej.',
    pat_needPrinciple: 'Zapisz najpierw zasadę własnymi słowami.',
    pat_noPrinciples: 'Nie ma jeszcze zintegrowanych zasad.'
  } : {
    saved: 'Saved', saving: 'Saving…', failed: 'Could not save locally',
    beginH: 'Begin', beginS: 'Two or three minutes. Any question can be skipped.',
    q_state: 'What is your current state?', q_matters: 'What matters most today?',
    q_not: 'What will you deliberately not do today?', energy: 'Energy (optional)',
    energyNote: 'Not a score for a good or bad day — just a reference point.',
    resetH: 'Attention reset', resetS: 'Optional. Run it when you feel scattered or overloaded. You can repeat it during the day.',
    r_pull: 'What is pulling your attention?', r_remove: 'What can be removed, closed or delayed?',
    r_next: 'What is the next focused action?', r_stop: 'When will you stop?',
    hints: ['What are the facts?', 'What story are you adding?', 'What does your body signal?'],
    aiH: 'Pre-AI orientation', aiS: 'Optional. Before you ask a model, settle your own position.',
    a_q: 'What are you actually asking?', a_facts: 'What do you know, and what are you assuming?',
    a_own: 'What is your own position before you ask?', a_use: 'What will you use the answer for — and what stays yours?',
    addReset: 'Add attention reset', addAi: 'Add pre-AI orientation', at: 'at',
    closeH: 'Close', closeS: 'About five minutes, in the evening.',
    c_happened: 'What actually happened?', c_energy: 'What changed your energy?',
    c_pattern: 'What pattern did you notice?', c_change: 'What will you continue, change or end?',
    c_next: 'What is the next action?', c_unsolved: 'What does not need to be solved tonight?',
    finish: 'Close the day', reopen: 'Day closed — you can still edit',
    download: 'Download daily record (.md)', copyAI: 'Copy for AI', copied: 'Copied to clipboard',
    archive: 'Archive', archiveEmpty: 'No records yet.',
    exportAll: 'Export everything', deleteAll: 'Delete all data',
    del: 'Delete', open: 'Open', confirmOne: 'Delete the record for %s? This cannot be undone.',
    confirmAll: 'Delete all records? This cannot be undone. Consider exporting first.',
    started: 'started', completed: 'closed', resets: 'resets',
    begin_cta: 'Begin today’s practice', cont_cta: 'Continue today’s practice',
    review_cta: 'Review today’s practice', yesterday: 'Review yesterday',
    today: 'Today', backToday: 'Back to today', editing: 'Editing the record for',

    /* ── patterns ── */
    pat_save: 'Save as observed pattern',
    pat_saved: 'Pattern saved. You will find it in the archive.',
    pat_needText: 'Describe the pattern in the field above first.',
    pat_h: 'Patterns',
    pat_s: 'You save the patterns. You change the status. Nothing happens automatically.',
    pat_empty: 'No patterns saved yet. You save them at the evening close.',
    pat_g_observed: 'Observed patterns', pat_g_tested: 'Tested practices', pat_g_integrated: 'Integrated principles',
    pat_count_1: 'item', pat_count_2: 'items', pat_count_5: 'items',
    pat_from: 'from the entry of', pat_since: 'saved',
    pat_test: 'Test a different response', pat_testH: 'Practice test',
    pat_practice: 'What do I want to do differently?', pat_trigger: 'In what situation?',
    pat_marker: 'How will I recognise the result?', pat_when: 'When will I come back to it?',
    pat_nonaction: 'What will I deliberately not do? (optional)',
    pat_returnH: 'Coming back to the test',
    pat_result: 'What happened?', pat_observation: 'What changed?',
    pat_learning: 'What did I learn?', pat_continue: 'Do I continue?',
    pat_markTested: 'Mark as tested',
    pat_intH: 'Integrating a principle',
    pat_intQ: 'Does this result change how you want to act in the future?',
    pat_principle: 'The principle, in your own words',
    pat_integrate: 'Add to my operating standard',
    pat_edit: 'Open', pat_close: 'Collapse',
    pat_confirmDel: 'Delete this pattern? This cannot be undone.',
    pat_exportOne: '.md', pat_exportPrinciples: 'Export integrated principles',
    pat_st_observed: 'observed', pat_st_tested: 'tested', pat_st_integrated: 'integrated',
    pat_needPractice: 'First describe what you want to do differently.',
    pat_needPrinciple: 'First write the principle in your own words.',
    pat_noPrinciples: 'No integrated principles yet.'
  };

  /* ── zdarzenia funkcjonalne: bez treści, bez identyfikatorów ── */
  function ev(name) { try { if (window.gtag) gtag('event', name); } catch (e) {} }

  /* ── data lokalna użytkownika ── */
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function tz() { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; } }
  function hhmm() { var d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }

  /* ── magazyn: IndexedDB, awaryjnie localStorage ──
     Jedna baza, dwa magazyny: `days` (klucz: date) i `patterns` (klucz: id). */
  var idb = null, ready = null;
  function open() {
    if (ready) return ready;
    ready = new Promise(function (res) {
      if (!window.indexedDB) return res(null);
      var r;
      try { r = indexedDB.open(DB, DBV); } catch (e) { return res(null); }
      r.onupgradeneeded = function () {
        var db = r.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'date' });
        if (!db.objectStoreNames.contains(PSTORE)) db.createObjectStore(PSTORE, { keyPath: 'id' });
      };
      r.onsuccess = function () { idb = r.result; res(idb); };
      r.onerror = function () { res(null); };
      r.onblocked = function () { res(null); };
    });
    return ready;
  }
  function makeStore(NAME, LSKEY, KEY) {
    function lsAll() { try { return JSON.parse(localStorage.getItem(LSKEY) || '{}'); } catch (e) { return {}; } }
    function lsSave(o) { try { localStorage.setItem(LSKEY, JSON.stringify(o)); return true; } catch (e) { return false; } }
    function lsPut(rec) { var o = lsAll(); o[rec[KEY]] = rec; return lsSave(o); }
    return {
      get: function (id) {
        return open().then(function (db) {
          if (!db) return lsAll()[id] || null;
          return new Promise(function (res) {
            try {
              var q = db.transaction(NAME).objectStore(NAME).get(id);
              q.onsuccess = function () { res(q.result || null); };
              q.onerror = function () { res(lsAll()[id] || null); };
            } catch (e) { res(lsAll()[id] || null); }
          });
        });
      },
      all: function () {
        return open().then(function (db) {
          function fromLs() { var o = lsAll(); return Object.keys(o).map(function (k) { return o[k]; }); }
          if (!db) return fromLs();
          return new Promise(function (res) {
            try {
              var q = db.transaction(NAME).objectStore(NAME).getAll();
              q.onsuccess = function () { res(q.result || []); };
              q.onerror = function () { res(fromLs()); };
            } catch (e) { res(fromLs()); }
          });
        });
      },
      put: function (rec) {
        return open().then(function (db) {
          if (!db) return lsPut(rec);
          return new Promise(function (res) {
            try {
              var t = db.transaction(NAME, 'readwrite'); t.objectStore(NAME).put(rec);
              t.oncomplete = function () { res(true); };
              t.onerror = function () { res(lsPut(rec)); };
            } catch (e) { res(lsPut(rec)); }
          });
        });
      },
      del: function (id) {
        return open().then(function (db) {
          var o = lsAll(); delete o[id]; lsSave(o);
          if (!db) return true;
          return new Promise(function (res) {
            try {
              var t = db.transaction(NAME, 'readwrite'); t.objectStore(NAME).delete(id);
              t.oncomplete = function () { res(true); }; t.onerror = function () { res(true); };
            } catch (e) { res(true); }
          });
        });
      },
      clear: function () {
        return open().then(function (db) {
          try { localStorage.removeItem(LSKEY); } catch (e) {}
          if (!db) return true;
          return new Promise(function (res) {
            try {
              var t = db.transaction(NAME, 'readwrite'); t.objectStore(NAME).clear();
              t.oncomplete = function () { res(true); }; t.onerror = function () { res(true); };
            } catch (e) { res(true); }
          });
        });
      }
    };
  }
  var store = makeStore(STORE, LS, 'date');
  var pstore = makeStore(PSTORE, PLS, 'id');

  function blank(date) {
    return {
      schema: SCHEMA, date: date, timezone: tz(), language: PL ? 'pl' : 'en',
      created: new Date().toISOString(), updated: new Date().toISOString(),
      status: 'started', energy_morning: null,
      begin: { state: '', matters: '', not_doing: '' },
      protocols: [],
      close: { happened: '', energy: '', pattern: '', change: '', unsolved: '', next: '' }
    };
  }

  /* ── model wzoru ──
     Status zmienia wyłącznie użytkownik: observed → tested → integrated. */
  function pid() {
    return 'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }
  function blankPattern(text, sourceEntry) {
    var now = new Date().toISOString();
    return {
      schema: SCHEMA, id: pid(), created: now, updated: now,
      language: PL ? 'pl' : 'en', status: 'observed',
      pattern: text || '',
      trigger: '',
      practice: '',
      planned_move: '',
      deliberate_non_action: '',
      review_on: '',
      result: '',
      observation: '',
      learning: '',
      continue_decision: '',
      principle: '',
      source_entry: sourceEntry || '',
      source_letter: '',
      history: [{ status: 'observed', date: now }]
    };
  }
  function statusDate(p, status) {
    var h = (p.history || []).filter(function (x) { return x.status === status; });
    return h.length ? String(h[h.length - 1].date).slice(0, 10) : '';
  }
  function setStatus(p, status) {
    if (p.status === status) return false;
    p.status = status;
    p.history = p.history || [];
    p.history.push({ status: status, date: new Date().toISOString() });
    return true;
  }

  /* ── Markdown ── */

  /* ── Rama metody: klucz do czytania zapisu (i dla modelu) ── */
  var FRAME_EN = [
    '> **Method frame — Operational Hermeticism**',
    '>',
    '> Read the pattern. Align the system. Act with energy. Transmute the result.',
    '>',
    '> - **Read** — see the structure under the noise, in yourself and in the systems you live in.',
    '> - **Align** — action in line with values, energy, body and the long horizon.',
    '> - **Act** — energy is the real currency; spend it deliberately and protect the core.',
    '> - **Transmute** — turn tension into form, knowledge into practice, chaos into system.',
    '>',
    '> Working principles behind these questions:',
    '> - The body is the first system that requires alignment.',
    '> - Not everything requires action. Not everything that can be changed should be changed.',
    '> - Agency increases responsibility. The more you can do, the more carefully you must choose.',
    '> - Relationships are infrastructure, not assets. People are not tasks.',
    '> - Not everything has to be useful: curiosity, beauty and rest need no justification.',
    '> - Keep source, interpretation and practice apart — they are different kinds of claim.',
    ''
  ].join('\n');
  var FRAME_PL = [
    '> **Rama metody — hermetyzm operacyjny**',
    '>',
    '> Czytaj wzór. Ustaw system. Działaj z energią. Przekształcaj wynik.',
    '>',
    '> - **Czytaj** — zobacz strukturę pod hałasem: w sobie i w systemach, w których żyjesz.',
    '> - **Ustaw** — działanie zgodne z wartościami, energią, ciałem i długim horyzontem.',
    '> - **Działaj** — energia jest prawdziwą walutą; wydawaj ją świadomie i chroń rdzeń.',
    '> - **Przekształcaj** — zamieniaj napięcie w formę, wiedzę w praktykę, chaos w system.',
    '>',
    '> Zasady stojące za tymi pytaniami:',
    '> - Ciało jest pierwszym systemem, z którym trzeba się uzgodnić.',
    '> - Nie wszystko wymaga działania. Nie wszystko, co można zmienić, powinno zostać zmienione.',
    '> - Sprawczość zwiększa odpowiedzialność. Im więcej możesz, tym uważniej musisz wybierać.',
    '> - Relacje są infrastrukturą, nie aktywami. Ludzie nie są zadaniami.',
    '> - Nie wszystko musi być użyteczne: ciekawość, piękno i odpoczynek nie potrzebują uzasadnienia.',
    '> - Trzymaj osobno źródło, interpretację i praktykę — to różne rodzaje twierdzeń.',
    ''
  ].join('\n');

  function esc(s) { return (s || '').trim(); }
  function sec(title, val, out) { if (esc(val)) out.push('### ' + title, '', esc(val), ''); }
  function md(rec, withFrame) {
    var o = [];
    var protos = rec.protocols.map(function (p) { return p.type; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    o.push('---', 'date: ' + rec.date, 'timezone: ' + rec.timezone, 'language: ' + rec.language);
    if (rec.energy_morning != null) o.push('energy_morning: ' + rec.energy_morning);
    if (protos.length) { o.push('protocols:'); protos.forEach(function (p) { o.push('  - ' + p); }); }
    o.push('method: operational-hermeticism');
    o.push('status: ' + rec.status, '---', '', '# ' + (PL ? 'Praktyka dnia' : 'Daily Practice'), '');
    if (withFrame !== false) o.push(PL ? FRAME_PL : FRAME_EN);
    var b = rec.begin;
    if (esc(b.state) || esc(b.matters) || esc(b.not_doing)) {
      o.push('## ' + (PL ? 'Początek' : 'Begin'), '');
      sec(PL ? 'Stan' : 'Current State', b.state, o);
      sec(PL ? 'Co ma znaczenie' : 'What Matters', b.matters, o);
      sec(PL ? 'Świadome niedziałanie' : 'Deliberate Non-Action', b.not_doing, o);
    }
    var rs = rec.protocols.filter(function (p) { return p.type === 'attention-reset'; });
    if (rs.length) {
      o.push('## ' + (PL ? 'Resety uwagi' : 'Attention Resets'), '');
      rs.forEach(function (p) {
        o.push('### ' + p.time, '');
        sec(PL ? 'Co przejmuje uwagę' : 'Attention Signal', p.a.pull, o);
        sec(PL ? 'Usunięte, zamknięte, odłożone' : 'Removed, Closed or Delayed', p.a.remove, o);
        sec(PL ? 'Następny skupiony ruch' : 'Next Focused Action', p.a.next, o);
        sec(PL ? 'Warunek zakończenia' : 'Stop Condition', p.a.stop, o);
      });
    }
    var ai = rec.protocols.filter(function (p) { return p.type === 'pre-ai'; });
    if (ai.length) {
      o.push('## ' + (PL ? 'Orientacja przed AI' : 'Pre-AI Orientation'), '');
      ai.forEach(function (p) {
        o.push('### ' + p.time, '');
        sec(PL ? 'Właściwe pytanie' : 'The Actual Question', p.a.q, o);
        sec(PL ? 'Fakty i założenia' : 'Facts and Assumptions', p.a.facts, o);
        sec(PL ? 'Moje stanowisko' : 'My Own Position', p.a.own, o);
        sec(PL ? 'Zastosowanie i granica' : 'Use and Boundary', p.a.use, o);
      });
    }
    var c = rec.close;
    if (esc(c.happened) || esc(c.energy) || esc(c.pattern) || esc(c.change) || esc(c.next) || esc(c.unsolved)) {
      o.push('## ' + (PL ? 'Zamknięcie' : 'Close'), '');
      sec(PL ? 'Co się wydarzyło' : 'What Happened', c.happened, o);
      sec(PL ? 'Energia' : 'Energy', c.energy, o);
      sec(PL ? 'Wzór' : 'Pattern', c.pattern, o);
      sec(PL ? 'Kontynuować, zmienić, zakończyć' : 'Continue, Change or End', c.change, o);
      sec(PL ? 'Czego nie trzeba dziś rozwiązywać' : 'What Does Not Need to Be Solved', c.unsolved, o);
      sec(PL ? 'Następny ruch' : 'Next Action', c.next, o);
    }
    return o.join('\n').replace(/\n{3,}/g, '\n\n') + '\n';
  }

  /* ── Markdown: pojedynczy wzór ── */
  var DIA = { 'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z' };
  function slug(s) {
    var x = (s || '').toLowerCase().replace(/[ąćęłńóśźż]/g, function (c) { return DIA[c] || c; });
    try { x = x.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) {}
    x = x.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    x = x.split('-').filter(Boolean).slice(0, 6).join('-').slice(0, 48).replace(/-+$/, '');
    return x || 'pattern';
  }
  var PLAB = PL ? {
    title: 'Wzór', pattern: 'Zauważony wzór', practice: 'Praktyka', result: 'Wynik', principle: 'Zintegrowana zasada',
    l_trigger: 'Sytuacja', l_practice: 'Co robię inaczej', l_marker: 'Po czym poznam rezultat',
    l_non: 'Świadome niedziałanie', l_when: 'Kiedy wracam',
    l_result: 'Co się wydarzyło', l_observation: 'Co się zmieniło', l_learning: 'Czego się nauczyłem', l_continue: 'Czy kontynuuję',
    principlesTitle: 'Mój standard działania'
  } : {
    title: 'Pattern', pattern: 'Observed Pattern', practice: 'Practice', result: 'Result', principle: 'Integrated Principle',
    l_trigger: 'Situation', l_practice: 'What I do differently', l_marker: 'How I recognise the result',
    l_non: 'Deliberate non-action', l_when: 'When I come back',
    l_result: 'What happened', l_observation: 'What changed', l_learning: 'What I learned', l_continue: 'Do I continue',
    principlesTitle: 'My operating standard'
  };
  function bullet(label, val, out) { if (esc(val)) out.push('- **' + label + ':** ' + esc(val).replace(/\n+/g, ' ')); }
  function patternMd(p) {
    var o = [];
    o.push('---', 'type: pattern', 'status: ' + p.status,
      'created: ' + String(p.created || '').slice(0, 10),
      'tested: ' + statusDate(p, 'tested'),
      'integrated: ' + statusDate(p, 'integrated'),
      'source_entry: ' + (p.source_entry || ''),
      'language: ' + (p.language || (PL ? 'pl' : 'en')),
      'method: operational-hermeticism', '---', '');
    var head = esc(p.pattern).split('\n')[0].slice(0, 80);
    o.push('# ' + (head || PLAB.title), '');
    o.push('## ' + PLAB.pattern, '', esc(p.pattern) || '—', '');
    var pr = [];
    bullet(PLAB.l_trigger, p.trigger, pr);
    bullet(PLAB.l_practice, p.practice, pr);
    bullet(PLAB.l_marker, p.planned_move, pr);
    bullet(PLAB.l_non, p.deliberate_non_action, pr);
    bullet(PLAB.l_when, p.review_on, pr);
    if (pr.length) o.push('## ' + PLAB.practice, '', pr.join('\n'), '');
    var rs = [];
    bullet(PLAB.l_result, p.result, rs);
    bullet(PLAB.l_observation, p.observation, rs);
    bullet(PLAB.l_learning, p.learning, rs);
    bullet(PLAB.l_continue, p.continue_decision, rs);
    if (rs.length) o.push('## ' + PLAB.result, '', rs.join('\n'), '');
    if (esc(p.principle)) o.push('## ' + PLAB.principle, '', esc(p.principle), '');
    return o.join('\n').replace(/\n{3,}/g, '\n\n') + '\n';
  }
  function patternFile(p) {
    return 'pattern-' + String(p.created || '').slice(0, 10) + '-' + slug(p.pattern) + '.md';
  }

  var AI_EN = '# Instructions for AI\n\nTreat this document as a record of observations, not an objective\ndescription of reality.\n\nDo not motivate me or make decisions for me.\n\nHelp me:\n- identify repeated patterns,\n- separate facts from interpretations,\n- notice contradictions between values and actions,\n- identify energy costs,\n- ask useful questions before proposing solutions.\n\nDo not diagnose medical or psychological conditions.\nShow uncertainty where evidence is insufficient.\n';
  var AI_PL = '# Instrukcja dla AI\n\nTraktuj ten dokument jako zapis obserwacji, nie jako obiektywny\nopis rzeczywistości.\n\nNie motywuj mnie i nie podejmuj za mnie decyzji.\n\nPomóż mi:\n- rozpoznać powtarzające się wzory,\n- oddzielić fakty od interpretacji,\n- zauważyć sprzeczności między wartościami a działaniem,\n- nazwać koszty energetyczne,\n- zadać użyteczne pytania, zanim zaproponujesz rozwiązania.\n\nNie diagnozuj stanów medycznych ani psychologicznych.\nPokazuj niepewność tam, gdzie dowody są niewystarczające.\n';

  function download(name, text) {
    var b = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 200);
  }

  /* ── strona: dzisiejsza praktyka ── */
  function initToday() {
    var root = document.querySelector('[data-practice-today]');
    if (!root) return;
    var params = new URLSearchParams(location.search);
    var date = params.get('date') || today();
    var rec = null, timer = null;
    var statusEl = root.querySelector('[data-status]');

    function setStatus(txt) { if (statusEl) statusEl.textContent = txt; }
    function save(immediate) {
      if (!rec) return;
      clearTimeout(timer);
      var run = function () {
        rec.updated = new Date().toISOString();
        setStatus(T.saving);
        store.put(rec).then(function (ok) { setStatus(ok ? T.saved + ' · ' + hhmm() : T.failed); });
      };
      immediate ? run() : (timer = setTimeout(run, 700));
    }
    function bind(el, get, set) {
      el.value = get() || '';
      el.addEventListener('input', function () { set(el.value); save(); });
    }

    store.get(date).then(function (r) {
      var isNew = !r;
      rec = r || blank(date);
      if (isNew) ev('practice_started');
      ev('practice_opened');
      if (date !== today()) {
        var note = root.querySelector('[data-editing]');
        if (note) { note.hidden = false; note.querySelector('span').textContent = T.editing + ' ' + date; }
      }
      // Begin
      bind(root.querySelector('#q-state'), function () { return rec.begin.state; }, function (v) { rec.begin.state = v; });
      bind(root.querySelector('#q-matters'), function () { return rec.begin.matters; }, function (v) { rec.begin.matters = v; });
      bind(root.querySelector('#q-not'), function () { return rec.begin.not_doing; }, function (v) { rec.begin.not_doing = v; });
      var en = root.querySelector('#q-energy'), enOut = root.querySelector('[data-energy-val]');
      if (en) {
        if (rec.energy_morning != null) { en.value = rec.energy_morning; enOut.textContent = rec.energy_morning; }
        en.addEventListener('input', function () { rec.energy_morning = +en.value; enOut.textContent = en.value; save(); });
      }
      renderProtocols();
      // Close
      ['happened', 'energy', 'pattern', 'change', 'unsolved', 'next'].forEach(function (k) {
        var el = root.querySelector('#c-' + k);
        if (el) bind(el, function () { return rec.close[k]; }, function (v) { rec.close[k] = v; });
      });
      /* Zapis wzoru — opcjonalny, nie przerywa głównego przepływu. */
      var sp = root.querySelector('[data-save-pattern]');
      var spNote = root.querySelector('[data-pattern-note]');
      if (sp) sp.addEventListener('click', function () {
        var txt = (rec.close.pattern || '').trim();
        if (!txt) { if (spNote) spNote.textContent = T.pat_needText; return; }
        var p = blankPattern(txt, rec.date);
        pstore.put(p).then(function () {
          ev('pattern_saved');
          if (spNote) spNote.innerHTML = T.pat_saved + ' <a class="pr__link" href="' +
            (PL ? '/pl' : '') + '/practice/archive/#patterns">' + T.pat_h + ' &rarr;</a>';
        });
      });

      var fin = root.querySelector('[data-finish]');
      if (fin) fin.addEventListener('click', function () {
        rec.status = 'completed'; save(true); ev('evening_review_completed');
        root.querySelector('[data-done]').hidden = false;
        root.querySelector('[data-done]').scrollIntoView({ block: 'center' });
      });
      if (rec.status === 'completed') root.querySelector('[data-done]').hidden = false;
    });

    function protoBlock(p, idx) {
      var isAI = p.type === 'pre-ai';
      var qs = isAI
        ? [['q', T.a_q], ['facts', T.a_facts], ['own', T.a_own], ['use', T.a_use]]
        : [['pull', T.r_pull], ['remove', T.r_remove], ['next', T.r_next], ['stop', T.r_stop]];
      var wrap = document.createElement('div');
      wrap.className = 'pr__proto';
      wrap.innerHTML = '<p class="pr__protoH">' + (isAI ? T.aiH : T.resetH) + ' <em>' + T.at + ' ' + p.time + '</em></p>';
      qs.forEach(function (q) {
        var id = 'p' + idx + '-' + q[0];
        var f = document.createElement('div'); f.className = 'pr__f';
        f.innerHTML = '<label for="' + id + '">' + q[1] + '</label><textarea id="' + id + '" rows="2"></textarea>';
        wrap.appendChild(f);
        var ta = f.querySelector('textarea');
        ta.value = p.a[q[0]] || '';
        ta.addEventListener('input', function () { p.a[q[0]] = ta.value; save(); });
      });
      if (!isAI) {
        var h = document.createElement('p'); h.className = 'pr__hint';
        h.textContent = T.hints.join(' · ');
        wrap.appendChild(h);
      }
      return wrap;
    }
    function renderProtocols() {
      var box = root.querySelector('[data-protocols]');
      box.innerHTML = '';
      rec.protocols.forEach(function (p, i) { box.appendChild(protoBlock(p, i)); });
    }
    root.querySelectorAll('[data-add]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var type = btn.getAttribute('data-add');
        rec.protocols.push({ type: type, time: hhmm(), a: {} });
        renderProtocols(); save(true);
        ev(type === 'pre-ai' ? 'pre_ai_orientation_completed' : 'attention_reset_completed');
        var box = root.querySelector('[data-protocols]');
        var last = box.lastElementChild; if (last) last.querySelector('textarea').focus();
      });
    });
    var dl = root.querySelector('[data-download]');
    if (dl) dl.addEventListener('click', function () {
      download('the-practice-' + rec.date + '.md', md(rec)); ev('markdown_downloaded');
    });
    var cp = root.querySelector('[data-copy]');
    if (cp) cp.addEventListener('click', function () {
      var text = (PL ? AI_PL : AI_EN) + '\n' + (PL ? FRAME_PL : FRAME_EN) + '\n---\n\n' + md(rec, false);
      navigator.clipboard.writeText(text).then(function () {
        cp.textContent = T.copied; ev('ai_context_copied');
        setTimeout(function () { cp.textContent = T.copyAI; }, 2500);
      });
    });
  }

  /* ── strona wejściowa ── */
  function initLanding() {
    var el = document.querySelector('[data-practice-cta]');
    if (!el) return;
    ev('practice_opened');
    var base = PL ? '/pl/practice/today/' : '/practice/today/';
    store.get(today()).then(function (r) {
      var label = !r ? T.begin_cta : (r.status === 'completed' ? T.review_cta : T.cont_cta);
      el.textContent = label; el.href = base;
      if (r) ev('return_visit');
      var y = new Date(Date.now() - 86400000);
      var yd = y.getFullYear() + '-' + String(y.getMonth() + 1).padStart(2, '0') + '-' + String(y.getDate()).padStart(2, '0');
      store.get(yd).then(function (ry) {
        var link = document.querySelector('[data-yesterday]');
        if (link && ry && ry.status !== 'completed') { link.hidden = false; link.href = base + '?date=' + yd; link.textContent = T.yesterday + ' →'; }
      });
    });
  }

  /* ── archiwum ── */
  function initArchive() {
    var root = document.querySelector('[data-practice-archive]');
    if (!root) return;
    ev('archive_opened');
    var list = root.querySelector('[data-list]');
    function render() {
      store.all().then(function (days) {
        days.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
        list.innerHTML = '';
        if (!days.length) { list.innerHTML = '<p class="pr__empty">' + T.archiveEmpty + '</p>'; return; }
        days.forEach(function (d) {
          var n = d.protocols ? d.protocols.length : 0;
          var row = document.createElement('div'); row.className = 'pr__row';
          row.innerHTML = '<b>' + d.date + '</b>' +
            '<span>' + (d.status === 'completed' ? T.completed : T.started) + (n ? ' · ' + n + ' ' + T.resets : '') + '</span>' +
            '<a class="pr__link" href="' + (PL ? '/pl' : '') + '/practice/today/?date=' + d.date + '">' + T.open + '</a>' +
            '<button class="pr__mini" data-dl="' + d.date + '">.md</button>' +
            '<button class="pr__mini pr__mini--warn" data-del="' + d.date + '">' + T.del + '</button>';
          list.appendChild(row);
        });
      });
    }
    list.addEventListener('click', function (e) {
      var dl = e.target.getAttribute && e.target.getAttribute('data-dl');
      var del = e.target.getAttribute && e.target.getAttribute('data-del');
      if (dl) store.get(dl).then(function (r) { if (r) { download('the-practice-' + dl + '.md', md(r)); ev('markdown_downloaded'); } });
      if (del && confirm(T.confirmOne.replace('%s', del))) store.del(del).then(render);
    });
    root.querySelector('[data-export-all]').addEventListener('click', function () {
      Promise.all([store.all(), pstore.all()]).then(function (r) {
        var days = r[0], ps = r[1];
        days.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
        ps.sort(function (a, b) { return (a.created < b.created) ? 1 : -1; });
        var text = days.map(function (d) { return md(d); }).join('\n\n---\n\n');
        if (ps.length) {
          text += '\n\n---\n\n# ' + T.pat_h + '\n\n' + ps.map(function (p) { return patternMd(p); }).join('\n---\n\n');
        }
        download('the-practice-all-' + today() + '.md', text || '');
        ev('markdown_downloaded');
      });
    });
    root.querySelector('[data-delete-all]').addEventListener('click', function () {
      if (!confirm(T.confirmAll)) return;
      store.clear()
        .then(function () { return pstore.clear(); })
        .then(function () { render(); if (patternsRender) patternsRender(); });
    });
    render();
  }

  /* ── wzory: widok w archiwum ──
     Trzy grupy, licznik wykonanej pracy. Bez punktów, ocen i porównań. */
  function plural(n) {
    if (!PL) return n === 1 ? T.pat_count_1 : T.pat_count_2;
    if (n === 1) return T.pat_count_1;
    var d = n % 10, h = n % 100;
    return (d >= 2 && d <= 4 && !(h >= 12 && h <= 14)) ? T.pat_count_2 : T.pat_count_5;
  }
  var patternsRender = null;
  function initPatterns() {
    var root = document.querySelector('[data-patterns]');
    if (!root) return;
    var list = root.querySelector('[data-pattern-list]');
    var openIds = {};
    var timers = {};

    function save(p, immediate) {
      clearTimeout(timers[p.id]);
      var run = function () { p.updated = new Date().toISOString(); pstore.put(p); };
      if (immediate) run(); else timers[p.id] = setTimeout(run, 700);
    }
    function fieldEl(label, val, onInput, rows) {
      var f = document.createElement('div'); f.className = 'pr__f';
      var l = document.createElement('label'); l.textContent = label;
      var ta = document.createElement('textarea'); ta.rows = rows || 2; ta.value = val || '';
      l.setAttribute('for', 'f' + Math.random().toString(36).slice(2, 8));
      ta.id = l.getAttribute('for');
      ta.addEventListener('input', function () { onInput(ta.value); });
      f.appendChild(l); f.appendChild(ta);
      return f;
    }
    function btn(cls, label, fn) {
      var b = document.createElement('button'); b.type = 'button'; b.className = cls;
      b.textContent = label; b.addEventListener('click', fn); return b;
    }
    function detail(p, render) {
      var box = document.createElement('div'); box.className = 'pr__patBody';
      var planOpen = p.status !== 'observed' || openIds[p.id] === 'plan' ||
        !!(p.practice || p.trigger || p.planned_move || p.deliberate_non_action || p.review_on);

      var full = document.createElement('p');
      full.className = 'pr__patFull'; full.textContent = p.pattern;
      box.appendChild(full);

      if (!planOpen) {
        box.appendChild(btn('pr__add', T.pat_test, function () { openIds[p.id] = 'plan'; render(); }));
        return box;
      }

      var h1 = document.createElement('p'); h1.className = 'pr__protoH'; h1.textContent = T.pat_testH;
      box.appendChild(h1);
      box.appendChild(fieldEl(T.pat_practice, p.practice, function (v) { p.practice = v; save(p); }));
      box.appendChild(fieldEl(T.pat_trigger, p.trigger, function (v) { p.trigger = v; save(p); }));
      box.appendChild(fieldEl(T.pat_marker, p.planned_move, function (v) { p.planned_move = v; save(p); }));
      box.appendChild(fieldEl(T.pat_when, p.review_on, function (v) { p.review_on = v; save(p); }, 1));
      box.appendChild(fieldEl(T.pat_nonaction, p.deliberate_non_action, function (v) { p.deliberate_non_action = v; save(p); }));

      var h2 = document.createElement('p'); h2.className = 'pr__protoH'; h2.textContent = T.pat_returnH;
      box.appendChild(h2);
      box.appendChild(fieldEl(T.pat_result, p.result, function (v) { p.result = v; save(p); }));
      box.appendChild(fieldEl(T.pat_observation, p.observation, function (v) { p.observation = v; save(p); }));
      box.appendChild(fieldEl(T.pat_learning, p.learning, function (v) { p.learning = v; save(p); }));
      box.appendChild(fieldEl(T.pat_continue, p.continue_decision, function (v) { p.continue_decision = v; save(p); }, 1));

      var note = document.createElement('p'); note.className = 'pr__hint';
      if (p.status === 'observed') {
        box.appendChild(btn('pr__add', T.pat_markTested, function () {
          if (!(p.practice || '').trim() && !(p.result || '').trim()) { note.textContent = T.pat_needPractice; return; }
          setStatus(p, 'tested'); save(p, true); ev('pattern_tested'); openIds[p.id] = 'open'; render();
        }));
        box.appendChild(note);
      }

      if (p.status === 'tested' || p.status === 'integrated') {
        var h3 = document.createElement('p'); h3.className = 'pr__protoH'; h3.textContent = T.pat_intH;
        box.appendChild(h3);
        var q = document.createElement('p'); q.className = 'pr__patQ'; q.textContent = T.pat_intQ;
        box.appendChild(q);
        box.appendChild(fieldEl(T.pat_principle, p.principle, function (v) { p.principle = v; save(p); }));
        if (p.status === 'tested') {
          var note2 = document.createElement('p'); note2.className = 'pr__hint';
          box.appendChild(btn('pr__add', T.pat_integrate, function () {
            if (!(p.principle || '').trim()) { note2.textContent = T.pat_needPrinciple; return; }
            setStatus(p, 'integrated'); save(p, true); ev('principle_integrated'); render();
          }));
          box.appendChild(note2);
        }
      }
      return box;
    }
    function card(p, render) {
      var el = document.createElement('div'); el.className = 'pr__pat';
      var head = document.createElement('div'); head.className = 'pr__patHead';
      var t = document.createElement('b'); t.className = 'pr__patText';
      t.textContent = (p.pattern || '').split('\n')[0].slice(0, 90) || '—';
      var meta = document.createElement('span'); meta.className = 'pr__patMeta';
      meta.textContent = T['pat_st_' + p.status] + (p.source_entry ? ' · ' + T.pat_from + ' ' + p.source_entry : '');
      head.appendChild(t); head.appendChild(meta);
      head.appendChild(btn('pr__mini', openIds[p.id] ? T.pat_close : T.pat_edit, function () {
        openIds[p.id] = openIds[p.id] ? null : 'open'; render();
      }));
      head.appendChild(btn('pr__mini', T.pat_exportOne, function () {
        download(patternFile(p), patternMd(p)); ev('pattern_exported');
      }));
      head.appendChild(btn('pr__mini pr__mini--warn', T.del, function () {
        if (confirm(T.pat_confirmDel)) pstore.del(p.id).then(render);
      }));
      el.appendChild(head);
      if (openIds[p.id]) el.appendChild(detail(p, render));
      return el;
    }
    function render() {
      pstore.all().then(function (ps) {
        ps.sort(function (a, b) { return (a.created < b.created) ? 1 : -1; });
        list.innerHTML = '';
        if (!ps.length) {
          var e = document.createElement('p'); e.className = 'pr__empty'; e.textContent = T.pat_empty;
          list.appendChild(e); return;
        }
        [['observed', T.pat_g_observed], ['tested', T.pat_g_tested], ['integrated', T.pat_g_integrated]]
          .forEach(function (g) {
            var items = ps.filter(function (p) { return p.status === g[0]; });
            var sec = document.createElement('section'); sec.className = 'pr__patGroup';
            var h = document.createElement('h3'); h.textContent = g[1];
            var c = document.createElement('span'); c.className = 'pr__patCount';
            c.textContent = items.length + ' ' + plural(items.length);
            h.appendChild(c);
            sec.appendChild(h);
            items.forEach(function (p) { sec.appendChild(card(p, render)); });
            list.appendChild(sec);
          });
      });
    }
    var exp = root.querySelector('[data-export-principles]');
    if (exp) exp.addEventListener('click', function () {
      pstore.all().then(function (ps) {
        var done = ps.filter(function (p) { return p.status === 'integrated'; })
          .sort(function (a, b) { return (a.created < b.created) ? 1 : -1; });
        var head = '# ' + PLAB.principlesTitle + '\n\n';
        var text = done.length
          ? head + done.map(function (p) { return patternMd(p); }).join('\n---\n\n')
          : head + T.pat_noPrinciples + '\n';
        download('integrated-principles-' + today() + '.md', text);
        ev('pattern_exported');
      });
    });
    patternsRender = render;
    render();
  }

  function boot() { initLanding(); initToday(); initArchive(); initPatterns(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
