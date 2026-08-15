
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
  const subForm=document.querySelector('[data-sub-form]');
  subForm?.addEventListener('submit',async e=>{
    e.preventDefault();
    const btn=subForm.querySelector('.sub__btn'), note=subForm.querySelector('.sub__note');
    const email=subForm.querySelector('.sub__input').value;
    btn.disabled=true; btn.textContent='One moment\u2026';
    try{
      const r=await fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});
      const d=await r.json().catch(()=>({}));
      if(r.ok&&d.ok){
        subForm.querySelector('.sub__row').hidden=true; note.hidden=true;
        subForm.querySelector('.sub__label').hidden=true;
        subForm.querySelector('.sub__ok').hidden=false;
      }else if(r.status===400){ note.hidden=false; note.textContent='That address doesn\u2019t look right \u2014 mind checking it?'; btn.disabled=false; btn.textContent='Begin the walk'; }
      else{ note.hidden=false; note.textContent='The scriptorium is briefly closed \u2014 signup opens within days. Please try again soon.'; btn.disabled=false; btn.textContent='Begin the walk'; }
    }catch{ note.hidden=false; note.textContent='Network hiccup \u2014 please try again.'; btn.disabled=false; btn.textContent='Begin the walk'; }
  });

  // ── Engagement layer ──
  const rmq=window.matchMedia('(prefers-reduced-motion: reduce)');
  // header zbija się po scrollu
  const hdrEl=document.querySelector('[data-hdr]');
  addEventListener('scroll',()=>hdrEl?.classList.toggle('is-scrolled',scrollY>24),{passive:true});
  // scroll-reveal ze staggerem per rodzic
  if(!rmq.matches){
    const groups=[['.hooks__grid','.hook'],['.path__steps','.step'],['.wings__grid','.wing'],['.myth__rows','.myth__row'],['.faq__list','.faq__item']];
    const singles=['.hooks .kicker','.hooks .h2','.path .kicker','.path .h2','.path .lead','.myth .kicker','.myth .h2','.sub__copy','.sub__form','.faq .kicker','.faq .h2','.faq__last','.path__locked','.path__note','.myth__note'];
    groups.forEach(([g,sel])=>{document.querySelectorAll(g+' > *').forEach((el,i)=>{el.classList.add('rv');el.style.setProperty('--i',i)});});
    singles.forEach(s=>document.querySelectorAll(s).forEach(el=>el.classList.add('rv')));
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{rootMargin:'0px 0px -10% 0px',threshold:.15});
    document.querySelectorAll('.rv').forEach(el=>io.observe(el));
    const steps=document.querySelector('.path__steps');
    if(steps){const io2=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){steps.classList.add('in');io2.disconnect();}}),{threshold:.2});io2.observe(steps);}
    // parallax pieczęci-ibisa w hero
    const seal=document.querySelector('.hero__seal');
    if(seal){let t=null;const upd=()=>{t=null;const y=scrollY;seal.style.setProperty('--plx',(y*0.12).toFixed(1)+'px');seal.style.setProperty('--rot',(y*0.008).toFixed(2)+'deg');};
      addEventListener('scroll',()=>{if(t===null)t=requestAnimationFrame(upd)},{passive:true});}
  }

  // YouTube facade: iframe dopiero po kliknięciu (wydajność + prywatność: youtube-nocookie)
  document.querySelectorAll('[data-yt]').forEach(f=>{
    const go=()=>{
      const id=f.getAttribute('data-yt');
      const ifr=document.createElement('iframe');
      ifr.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0';
      ifr.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      ifr.allowFullscreen=true;
      ifr.title=f.getAttribute('aria-label')||'Video';
      f.querySelector('img').replaceWith(ifr);
      f.querySelector('.yt__play')?.remove();
      f.removeAttribute('role');f.removeAttribute('tabindex');
    };
    f.addEventListener('click',go,{once:true});
    f.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}},{once:true});
  });

/* czytnik: zapamiętanie miejsca + nawigacja klawiaturą */
(function(){
  var m=document.querySelector('[data-book-chapter]');
  if(m){try{localStorage.setItem('hermeticum-book',JSON.stringify({n:+m.dataset.bookChapter,u:m.dataset.bookUrl}));}catch(e){}}
  var r=document.querySelector('[data-book-resume]');
  if(r){try{var s=JSON.parse(localStorage.getItem('hermeticum-book')||'null');
    if(s&&s.u){r.href=s.u;r.hidden=false;r.textContent=r.textContent+' \u2192 '+String(s.n).padStart(2,'0');}}catch(e){}}
  document.addEventListener('keydown',function(e){
    if(e.metaKey||e.ctrlKey||e.altKey||/input|textarea/i.test((e.target.tagName||'')))return;
    var sel=e.key==='ArrowRight'?'.bnav__next':e.key==='ArrowLeft'?'.bnav__prev':null;
    if(!sel)return; var a=document.querySelector(sel); if(a)location.href=a.href;
  });
})();
