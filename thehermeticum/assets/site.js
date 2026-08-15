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
