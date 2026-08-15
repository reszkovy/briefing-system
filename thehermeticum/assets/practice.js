/* The Practice — MVP. Dane wyłącznie lokalnie (IndexedDB, awaryjnie localStorage).
   Żadna treść odpowiedzi nie opuszcza przeglądarki: analityka mierzy tylko zdarzenia funkcjonalne. */
(function () {
  'use strict';
  var PL = (document.documentElement.lang || 'en').indexOf('pl') === 0;
  var DB = 'hermeticum-practice', STORE = 'days', LS = 'hermeticum-practice-days';
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
    today: 'Dzisiaj', backToday: 'Wróć do dzisiaj', editing: 'Edytujesz zapis z dnia'
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
    today: 'Today', backToday: 'Back to today', editing: 'Editing the record for'
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

  /* ── magazyn: IndexedDB, awaryjnie localStorage ── */
  var store = (function () {
    var idb = null, ready = null;
    function open() {
      if (ready) return ready;
      ready = new Promise(function (res) {
        if (!window.indexedDB) return res(null);
        var r;
        try { r = indexedDB.open(DB, 1); } catch (e) { return res(null); }
        r.onupgradeneeded = function () { r.result.createObjectStore(STORE, { keyPath: 'date' }); };
        r.onsuccess = function () { idb = r.result; res(idb); };
        r.onerror = function () { res(null); };
      });
      return ready;
    }
    function lsAll() { try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch (e) { return {}; } }
    function lsSave(o) { try { localStorage.setItem(LS, JSON.stringify(o)); return true; } catch (e) { return false; } }
    return {
      get: function (date) {
        return open().then(function (db) {
          if (!db) return lsAll()[date] || null;
          return new Promise(function (res) {
            var q = db.transaction(STORE).objectStore(STORE).get(date);
            q.onsuccess = function () { res(q.result || null); };
            q.onerror = function () { res(lsAll()[date] || null); };
          });
        });
      },
      all: function () {
        return open().then(function (db) {
          if (!db) { var o = lsAll(); return Object.keys(o).map(function (k) { return o[k]; }); }
          return new Promise(function (res) {
            var q = db.transaction(STORE).objectStore(STORE).getAll();
            q.onsuccess = function () { res(q.result || []); };
            q.onerror = function () { var o = lsAll(); res(Object.keys(o).map(function (k) { return o[k]; })); };
          });
        });
      },
      put: function (rec) {
        return open().then(function (db) {
          if (!db) { var o = lsAll(); o[rec.date] = rec; return lsSave(o); }
          return new Promise(function (res) {
            try {
              var t = db.transaction(STORE, 'readwrite'); t.objectStore(STORE).put(rec);
              t.oncomplete = function () { res(true); };
              t.onerror = function () { var o = lsAll(); o[rec.date] = rec; res(lsSave(o)); };
            } catch (e) { var o2 = lsAll(); o2[rec.date] = rec; res(lsSave(o2)); }
          });
        });
      },
      del: function (date) {
        return open().then(function (db) {
          var o = lsAll(); delete o[date]; lsSave(o);
          if (!db) return true;
          return new Promise(function (res) {
            var t = db.transaction(STORE, 'readwrite'); t.objectStore(STORE).delete(date);
            t.oncomplete = function () { res(true); }; t.onerror = function () { res(true); };
          });
        });
      },
      clear: function () {
        return open().then(function (db) {
          try { localStorage.removeItem(LS); } catch (e) {}
          if (!db) return true;
          return new Promise(function (res) {
            var t = db.transaction(STORE, 'readwrite'); t.objectStore(STORE).clear();
            t.oncomplete = function () { res(true); }; t.onerror = function () { res(true); };
          });
        });
      }
    };
  })();

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

  /* ── Markdown ── */
  function esc(s) { return (s || '').trim(); }
  function sec(title, val, out) { if (esc(val)) out.push('### ' + title, '', esc(val), ''); }
  function md(rec) {
    var o = [];
    var protos = rec.protocols.map(function (p) { return p.type; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    o.push('---', 'date: ' + rec.date, 'timezone: ' + rec.timezone, 'language: ' + rec.language);
    if (rec.energy_morning != null) o.push('energy_morning: ' + rec.energy_morning);
    if (protos.length) { o.push('protocols:'); protos.forEach(function (p) { o.push('  - ' + p); }); }
    o.push('status: ' + rec.status, '---', '', '# ' + (PL ? 'Praktyka dnia' : 'Daily Practice'), '');
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
      var text = (PL ? AI_PL : AI_EN) + '\n---\n\n' + md(rec);
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
      store.all().then(function (days) {
        days.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
        var text = days.map(function (d) { return md(d); }).join('\n\n---\n\n');
        download('the-practice-all-' + today() + '.md', text || '');
        ev('markdown_downloaded');
      });
    });
    root.querySelector('[data-delete-all]').addEventListener('click', function () {
      if (confirm(T.confirmAll)) store.clear().then(render);
    });
    render();
  }

  function boot() { initLanding(); initToday(); initArchive(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
