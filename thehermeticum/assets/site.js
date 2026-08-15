(function(){

  // Codex/Index: jeden panel z filtrem zamiast hoverowych mega. Otwarcie: klik, Cmd/Ctrl+K albo "/".
  const hdr=document.querySelector('[data-hdr]');
  const btn=document.querySelector('[data-codex-btn]');
  const panel=document.querySelector('[data-codex]');
  const q=document.querySelector('[data-codex-q]');
  const filtr=v=>{const s=v.trim().toLowerCase();
    document.querySelectorAll('.cx').forEach(sec=>{let any=false;
      sec.querySelectorAll('.cx__list li').forEach(li=>{const m=!s||li.textContent.toLowerCase().includes(s);li.hidden=!m;if(m)any=true;});
      sec.hidden=!any;});};
  const otworz=()=>{panel.hidden=false;btn.setAttribute('aria-expanded','true');hdr.classList.add('is-rozwiniete');setTimeout(()=>q.focus(),0);};
  const zamknij=()=>{if(panel.hidden)return;panel.hidden=true;btn.setAttribute('aria-expanded','false');hdr.classList.remove('is-rozwiniete');q.value='';filtr('');};
  btn.addEventListener('click',()=>panel.hidden?otworz():zamknij());
  q.addEventListener('input',()=>filtr(q.value));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape')zamknij();
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();panel.hidden?otworz():zamknij();}
    if(e.key==='/'&&panel.hidden&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();otworz();}
  });
  document.addEventListener('click',e=>{
    if(!e.target.closest('[data-codex]')&&!e.target.closest('[data-codex-btn]'))zamknij();
  });

  // Zapis newslettera → /api/subscribe (Resend). 503 = ESP jeszcze nie skonfigurowany.
  /* subskrypcja: obsługa wielu formularzy na stronie, z językiem listu */
  var PL_ = (document.documentElement.lang || 'en').indexOf('pl') === 0;
  var TXT = PL_ ? {wait:'Chwila…', bad:'Ten adres wygląda na niepełny — sprawdzisz?', err:'Zapis chwilowo niedostępny. Spróbuj proszę za moment.', again:'Wyślij'}
                : {wait:'One moment…', bad:'That address doesn’t look right — mind checking it?', err:'Signup is briefly unavailable. Please try again in a moment.', again:'Send'};
  document.querySelectorAll('[data-sub-form]').forEach(function(form){
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      var btn=form.querySelector('.sub__btn'), note=form.querySelector('.sub__note');
      var label=btn?btn.textContent:TXT.again;
      var email=form.querySelector('.sub__input').value;
      if(btn){btn.disabled=true;btn.textContent=TXT.wait;}
      try{
        var r=await fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},
              body:JSON.stringify({email:email, lang: PL_?'pl':'en', list: (function(){var o=[].slice.call(form.querySelectorAll('[data-list-opt]:checked')).map(function(x){return x.getAttribute('data-list-opt');});
                 return o.length? (o.length>1?'letter-book':(o[0]==='book'?'book-waitlist':'letter')) : (form.getAttribute('data-list')||'');})()})});
        var d=await r.json().catch(function(){return {};});
        if(r.ok&&d.ok){
          var row=form.querySelector('.sub__row'); if(row)row.hidden=true;
          if(note)note.hidden=true;
          var lab=form.querySelector('.sub__label'); if(lab)lab.hidden=true;
          var ok=form.querySelector('.sub__ok'); if(ok)ok.hidden=false;
          try{if(window.gtag)gtag('event','subscribe_completed');}catch(_){}
        }else{
          if(note){note.hidden=false;note.textContent=(r.status===400?TXT.bad:TXT.err);}
          if(btn){btn.disabled=false;btn.textContent=label;}
        }
      }catch(_){
        if(note){note.hidden=false;note.textContent=TXT.err;}
        if(btn){btn.disabled=false;btn.textContent=label;}
      }
    });
  });
})();

(function(){var t=document.querySelector('[data-stepper-track]');if(!t)return;var c=t.querySelector('.is-current');if(!c)return;
 t.scrollLeft=Math.max(0,c.offsetLeft-t.clientWidth/2+c.clientWidth/2);})();

/* ── Zgoda na pomiar: domyślnie odmowa, jedno pytanie, decyzja zapamiętana ── */
(function(){
  var KEY='hermeticum-consent';
  function grant(){try{gtag('consent','update',{analytics_storage:'granted'});gtag('event','page_view');}catch(e){}}
  var saved=null; try{saved=localStorage.getItem(KEY);}catch(e){}
  if(saved==='granted'){grant();return;}
  if(saved==='denied'){return;}
  var pl=(document.documentElement.lang||'en').indexOf('pl')===0;
  var t=pl?{h:'Pliki cookies',
      p:'Ta strona nie zapisuje żadnych cookies, dopóki nie wyrazisz zgody. Prosimy tylko o cookies analityczne Google Analytics — po to, żeby wiedzieć, ile osób czyta i które teksty. Bez reklam, bez profilowania, bez sprzedaży danych. Jeśli odmówisz, żaden plik nie zostanie zapisany, a serwis będzie działał tak samo.',
      y:'Akceptuję cookies',n:'Odrzuć',more:'Więcej o prywatności'}
    :{h:'Cookies',
      p:'This site writes no cookies until you agree. We ask only for Google Analytics cookies, so we can see how many people read and which texts. No advertising, no profiling, no data sold. Decline and nothing is stored — the site works exactly the same.',
      y:'Accept cookies',n:'Decline',more:'More on privacy'};
  var priv=pl?'/pl/privacy/':'/privacy/';
  var el=document.createElement('aside');
  el.className='cnst'; el.setAttribute('role','dialog'); el.setAttribute('aria-label',t.h);
  el.innerHTML='<p class="cnst__h">'+t.h+'</p><p class="cnst__p">'+t.p+' <a href="'+priv+'">'+t.more+' &rarr;</a></p>'+
    '<div class="cnst__row"><button class="btn cnst__yes" type="button">'+t.y+'</button>'+
    '<button class="cnst__no" type="button">'+t.n+'</button></div>';
  function close(v){try{localStorage.setItem(KEY,v);}catch(e){} el.remove(); if(v==='granted')grant();}
  el.querySelector('.cnst__yes').addEventListener('click',function(){close('granted');});
  el.querySelector('.cnst__no').addEventListener('click',function(){close('denied');});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&document.body.contains(el))close('denied');});
  function show(){document.body.appendChild(el);setTimeout(function(){el.classList.add('is-in');},60);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',show);else show();
})();

/* early bird — pokaż po wejściu w treść, zapamiętaj zamknięcie */
(function(){
  var eb = document.querySelector('[data-eb]');
  if (!eb) return;
  try { if (localStorage.getItem('hermeticum-eb') === 'off') return; } catch (e) {}
  eb.hidden = false;
  var shown = false;
  function check(){
    if (shown) return;
    if (window.scrollY > window.innerHeight * 0.55) { shown = true; eb.classList.add('is-on'); }
  }
  window.addEventListener('scroll', check, {passive:true});
  check();
  var x = eb.querySelector('[data-eb-close]');
  if (x) x.addEventListener('click', function(){
    eb.classList.remove('is-on');
    try { localStorage.setItem('hermeticum-eb', 'off'); } catch (e) {}
  });
})();

/* ── Asystent: pływający panel Q&A (wzorzec R080 z r352) ───────────────────
   Bez backendu i bez modelu: odpowiedzi są zapisane w kodzie, ten sam zestaw
   co w FAQ na stronie. Nic nie wychodzi na zewnątrz.                        */
(function(){
  var PL = location.pathname.indexOf('/pl/') === 0 || location.pathname === '/pl';
  var T = PL ? {
    open:'Pytania', close:'Zamknij', title:'Zapytaj',
    intro:'Cześć. Odpowiadam na to, o co ludzie pytają najczęściej: czym to jest, co dostajesz co tydzień, co z Twoimi danymi i od czego zacząć. Wybierz pytanie albo przejdź prosto do zapisu.',
    pick:'Wybierz pytanie', cta:'Zapisz się na list', ctaHref:'/pl/subscribe/',
    more:'', moreHref:'',
    qa:[
      ['Czym właściwie jest The Hermeticum?','Serwisem o tradycji hermetycznej i metodą pracy wyprowadzoną z tych tekstów. Dostajesz trzy rzeczy: cotygodniowy list, książkę „Hermetyzm operacyjny" i darmowe narzędzie do pięciominutowej praktyki.'],
      ['Co dostaję w liście?','Jedną obserwację do sprawdzenia u siebie, jedno źródło z podanym wydaniem i datą, jedno ćwiczenie na pięć minut oraz jedno pytanie do zabrania ze sobą. Raz w tygodniu, w piątek.'],
      ['Czy to kolejny system produktywności?','Nie. Kilka wątków się pokrywa, ale cel jest inny. Produktywność optymalizuje wynik; to optymalizuje obecność i osąd, i bywa gotowe zapłacić za nie wynikiem.'],
      ['Czy muszę wierzyć w hermetyzm?','Wcale. To język źródłowy metody, czytany jako historia idei. Możesz trzymać każde twierdzenie metafizyczne na dystans i nadal korzystać z praktyki.'],
      ['Gdzie są moje dane?','Wpisy z praktyki zostają w Twojej przeglądarce i nigdzie indziej. Adres e-mail podany do listu trzyma dostawca poczty i nic poza tym.'],
      ['Czy muszę używać AI?','Nie. Praktyka działa na kartce. A jeśli używasz modeli, daje Ci własne stanowisko, zanim model będzie miał je za Ciebie.'],
      ['Co jest darmowe, a co płatne?','Wiedza zostaje otwarta: źródła, archiwum, początek ścieżki, słownik, list i wybrane praktyki. Struktura, narzędzia i prowadzona praktyka mogą być z czasem płatne - nigdy dostęp do samych idei.'],
      ['Od czego zacząć?','Od pięciu pytań przed oddaniem problemu modelowi. Zajmują dwie minuty i pokazują metodę w działaniu lepiej niż jakikolwiek opis.']
    ]
  } : {
    open:'Questions', close:'Close', title:'Ask',
    intro:'Hello. I answer what people ask most: what this is, what lands in your inbox each week, what happens to your data and where to start. Pick a question, or go straight to the list.',
    pick:'Choose a question', cta:'Join the letter', ctaHref:'/subscribe/',
    more:'', moreHref:'',
    qa:[
      ['What is The Hermeticum?','A site about the Hermetic tradition and a working method drawn from those texts. Three things: a weekly letter, the book Operational Hermeticism, and a free five-minute practice tool.'],
      ['What lands in my inbox?','One observation to check on yourself, one source with its edition and date, one five-minute exercise and one question to take with you. Once a week, on Friday.'],
      ['Is this another productivity system?','No. Some threads overlap, but the aim differs. Productivity optimises output; this optimises presence and judgement, and will sometimes pay for them in output.'],
      ['Do I have to believe in hermeticism?','Not at all. It is the source language of the method, read as intellectual history. You can hold every metaphysical claim at arm’s length and still use the practice.'],
      ['Where is my data?','Practice entries stay in your browser and nowhere else. The address you give for the letter sits with our mail provider, and nothing beyond that.'],
      ['Do I need to use AI?','No. The practice works on paper. And if you do use models, it gives you your own position before the model has one for you.'],
      ['What is free and what will cost?','The knowledge stays open: sources, archive, the start of the Path, the glossary, the letter and selected practices. Structure, tools and guided practice may become paid - never access to the ideas themselves.'],
      ['Where do I start?','With the five questions before you hand a problem to a model. Two minutes, and they show the method better than any description.']
    ]
  };

  var SIGIL = '<svg viewBox="0 0 545 554" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M544.781 165.192H475.492V390.54H544.781V553.071H0V390.54H66.4902V165.192H0V0H544.781V165.192ZM56.209 124.889H115.522V426.137H56.209V498.717H248.977V426.137H187.322V305.169H357.457V426.137H296.583V498.717H488.57V426.137H429.257V124.889H488.57V52.3076H296.583V124.889H357.457V232.589H187.322V124.889H248.977V52.3076H56.209V124.889Z" fill="currentColor"/></svg>';

  var btn = document.createElement('button');
  btn.className = 'ask__btn'; btn.type = 'button';
  btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-controls','ask');
  btn.innerHTML = '<span class="ask__btnIco">' + SIGIL + '</span><span class="ask__btnTxt">' + T.open + '</span>';

  var panel = document.createElement('div');
  panel.className = 'ask'; panel.id = 'ask'; panel.hidden = true;
  panel.setAttribute('role','dialog'); panel.setAttribute('aria-label', T.title);
  panel.innerHTML =
    '<div class="ask__head"><span class="ask__ico">' + SIGIL + '</span><b>' + T.title + '</b>' +
      '<button class="ask__x" type="button" aria-label="' + T.close + '">&times;</button></div>' +
    '<div class="ask__log" data-ask-log tabindex="0"></div>' +
    '<div class="ask__foot"><p class="ask__pick">' + T.pick + '</p>' +
      '<div class="ask__qs" data-ask-qs></div>' +
      '<a class="btn ask__cta" href="' + T.ctaHref + '">' + T.cta + '</a></div>';

  var dock = document.querySelector('.dock');
  if (!dock){ dock = document.createElement('div'); dock.className = 'dock'; document.body.appendChild(dock); }
  dock.appendChild(btn); document.body.appendChild(panel);

  var log = panel.querySelector('[data-ask-log]'), qs = panel.querySelector('[data-ask-qs]');

  function bubble(who, text){
    var d = document.createElement('div');
    d.className = 'ask__msg ask__msg--' + who;
    d.innerHTML = (who === 'bot' ? '<span class="ask__av">' + SIGIL + '</span>' : '') + '<p></p>';
    d.querySelector('p').textContent = text;
    log.appendChild(d); log.scrollTop = log.scrollHeight;
    return d;
  }
  function render(){
    qs.innerHTML = '';
    T.qa.forEach(function(pair, i){
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'ask__q'; b.textContent = pair[0];
      b.addEventListener('click', function(){
        bubble('me', pair[0]);
        b.disabled = true;
        setTimeout(function(){ bubble('bot', pair[1]); }, 220);
      });
      qs.appendChild(b);
    });
  }
  var started = false;
  function open(){
    panel.hidden = false; btn.setAttribute('aria-expanded','true');
    document.documentElement.classList.add('ask-on');
    if (!started){ started = true; bubble('bot', T.intro); render(); }
    requestAnimationFrame(function(){ panel.classList.add('is-on'); });
  }
  function close(){
    panel.classList.remove('is-on'); btn.setAttribute('aria-expanded','false');
    document.documentElement.classList.remove('ask-on');
    setTimeout(function(){ panel.hidden = true; }, 260);
  }
  btn.addEventListener('click', function(){ panel.hidden ? open() : close(); });
  panel.querySelector('.ask__x').addEventListener('click', close);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !panel.hidden) close(); });
})();

/* ── pływające CTA (desktop): pojawia się po opuszczeniu pierwszego ekranu,
      chowa się nad sekcją zapisu, żeby nie dublować tego samego przycisku ── */
(function(){
  if (document.querySelector('.cta-float')) return;
  var PL = location.pathname.indexOf('/pl/') === 0 || location.pathname === '/pl';
  var a = document.createElement('a');
  a.className = 'cta-float';
  a.href = PL ? '/pl/subscribe/' : '/subscribe/';
  a.textContent = PL ? 'Odbierz pierwszą praktykę' : 'Get the first practice';
  var dock = document.querySelector('.dock');
  if (!dock){ dock = document.createElement('div'); dock.className = 'dock'; document.body.appendChild(dock); }
  dock.insertBefore(a, dock.firstChild);
  var sub = document.querySelector('#subscribe, .sbp');
  function tick(){
    var poFoldzie = window.scrollY > window.innerHeight * 0.7;
    var przySekcji = false;
    if (sub){
      var r = sub.getBoundingClientRect();
      przySekcji = r.top < window.innerHeight && r.bottom > 0;
    }
    a.classList.toggle('is-on', poFoldzie && !przySekcji);
  }
  window.addEventListener('scroll', tick, {passive:true});
  window.addEventListener('resize', tick, {passive:true});
  tick();
})();
