(function(){
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── pasek postępu ── */
  const bar = document.getElementById('progress');
  /* ── sticky nav ── */
  const navShell = document.getElementById('navShell');

  let ticking = false;
  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(()=>{
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y/h)*100 : 0) + '%';
      navShell.classList.toggle('stuck', y > 20);

      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ── podmenu Oferta ── */
  document.querySelectorAll('.has-sub').forEach(li=>{
    const trig = li.querySelector('.mtrig');
    const open = v => { li.classList.toggle('open', v); trig.setAttribute('aria-expanded', v); };
    li.addEventListener('mouseenter', ()=>open(true));
    li.addEventListener('mouseleave', ()=>open(false));
    trig.addEventListener('click', e=>{ e.preventDefault(); open(!li.classList.contains('open')); });
    document.addEventListener('click', e=>{ if(!li.contains(e.target)) open(false); });
    document.addEventListener('keydown', e=>{ if(e.key === 'Escape') open(false); });
  });

  /* ── bezszwowa pętla marquee: duplikujemy zawartość ── */
  document.querySelectorAll('[data-loop]').forEach(track=>{
    track.innerHTML += track.innerHTML;
  });

  /* ── ujawnianie przy scrollu ── */
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, {threshold:.12, rootMargin:'0px 0px -60px 0px'});
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));
  /* Bezpiecznik. Obserwator bywa uśpiony (karta w tle, stara przeglądarka),
     a wtedy treść zostałaby na zawsze przezroczysta — dlatego to samo
     liczymy też z pozycji przy przewijaniu. */
  const dosloniete = () => {
    const h = window.innerHeight;
    document.querySelectorAll('.rv:not(.in)').forEach(el=>{
      if(el.getBoundingClientRect().top < h - 40) el.classList.add('in');
    });
  };
  setTimeout(dosloniete, 1200);
  let rvOst = 0, rvTimer = null;
  addEventListener('scroll', ()=>{
    const t = performance.now();
    if(t - rvOst >= 80){ rvOst = t; dosloniete(); return; }
    clearTimeout(rvTimer);
    rvTimer = setTimeout(()=>{ rvOst = performance.now(); dosloniete(); }, 80);
  }, {passive:true});

  /* ── licznik liczb ── */
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(!en.isIntersecting) return;
      const el = en.target, target = +el.dataset.count;
      cio.unobserve(el);
      if(reduce){ el.textContent = target; return; }
      const dur = 1100, t0 = performance.now();
      (function tick(t){
        const p = Math.min((t - t0)/dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e);
        if(p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, {threshold:.5});
  counters.forEach(el=>cio.observe(el));

  /* ── karuzela nagród ── */
  const rail = document.getElementById('awardsRail');
  document.querySelectorAll('[data-rail]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      rail.scrollBy({left: (+btn.dataset.rail) * 352, behavior:'smooth'});
    });
  });

  /* ── światło podążające za kursorem na kartach ── */
  if(!reduce){
    document.querySelectorAll('.card').forEach(card=>{
      card.addEventListener('pointermove', e=>{
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left)/r.width*100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top)/r.height*100) + '%');
      });
    });
  }


  /* ── menu mobilne ── */
  const burger = document.querySelector('.burger');
  const mnav   = document.getElementById('mobileMenu');
  if(burger && mnav){
    const setOpen = v => {
      mnav.hidden = !v;
      burger.setAttribute('aria-expanded', v);
      document.body.style.overflow = v ? 'hidden' : '';
    };
    burger.addEventListener('click', ()=> setOpen(mnav.hidden));
    const zamknij = mnav.querySelector('.mnav-x');
    if(zamknij) zamknij.addEventListener('click', ()=> setOpen(false));
    mnav.addEventListener('click', e=>{ if(e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', e=>{ if(e.key === 'Escape' && !mnav.hidden) setOpen(false); });
    window.addEventListener('resize', ()=>{ if(window.innerWidth > 900 && !mnav.hidden) setOpen(false); });
  }

  /* ── atuty: iskra wędruje do wskazanego przystanku ── */
  const atuty = document.querySelector('[data-atuty]');
  if(atuty){
    const iskra = atuty.querySelector('.atut-iskra');
    const poz   = [...atuty.querySelectorAll('.atut')];

    // przesunięcie robi przejście CSS — nie potrzeba pętli animacji
    const przesun = el => {
      const i = el.querySelector('.atut-ico');
      if(!i) return;
      const x = i.getBoundingClientRect().left - atuty.getBoundingClientRect().left
                + i.offsetWidth / 2;
      iskra.style.transform = `translateX(${x.toFixed(1)}px) translateX(-50%)`;
    };
    const wskaz = el => {
      poz.forEach(p => p.classList.toggle('on', p === el));
      atuty.classList.add('iskra-on');
      przesun(el);
    };
    poz.forEach(p => {
      p.addEventListener('pointerenter', () => wskaz(p));
      p.addEventListener('focus', () => wskaz(p));
    });
    atuty.addEventListener('pointerleave', () => {
      poz.forEach(p => p.classList.remove('on'));
      atuty.classList.remove('iskra-on');
    });
    addEventListener('resize', () => {
      const akt = atuty.querySelector('.atut.on');
      if(akt) przesun(akt);
    });
  }

  /* ── pasek kotwic: podświetla sekcję, w której właśnie jesteśmy ── */
  const kotPas = document.querySelector('.kot-pas');
  if(kotPas){
    const linki = [...kotPas.querySelectorAll('.kot')];
    const pary  = linki
      .map(a => ({ a, sek: document.querySelector(a.getAttribute('href')) }))
      .filter(x => x.sek);

    if(pary.length){
      let ostatni = null;
      const odswiez = () => {
        // linia odniesienia tuż pod paskiem — sekcja, która ją przecina, jest bieżąca
        const linia = 200;
        let biezaca = pary[0].a;
        for(const { a, sek } of pary){
          if(sek.getBoundingClientRect().top <= linia) biezaca = a;
        }
        // na samym dole strony ostatnia sekcja wygrywa, choćby była krótka
        if(window.innerHeight + window.scrollY >= document.body.scrollHeight - 4)
          biezaca = pary[pary.length - 1].a;

        if(biezaca === ostatni) return;
        ostatni = biezaca;
        linki.forEach(a => a.classList.toggle('on', a === biezaca));

        const p = kotPas.getBoundingClientRect(), z = biezaca.getBoundingClientRect();
        if(z.left < p.left || z.right > p.right)
          kotPas.scrollTo({ left: biezaca.offsetLeft - 12, behavior: 'smooth' });
      };
      // throttling na czasie, nie na rAF — rAF milczy na ukrytej karcie
      let ostatnio = 0, timer = null;
      addEventListener('scroll', () => {
        const teraz = performance.now();
        if(teraz - ostatnio >= 60){ ostatnio = teraz; odswiez(); return; }
        clearTimeout(timer);
        timer = setTimeout(() => { ostatnio = performance.now(); odswiez(); }, 60);
      }, { passive: true });
      addEventListener('resize', odswiez);
      odswiez();
    }
  }

  /* ── zakładki cennika ── */
  const tabs = document.querySelectorAll('.price-tab');
  if(tabs.length){
    const groups = [...document.querySelectorAll('.price-group')];
    const mark = () => {
      const y = window.scrollY + 200;
      let cur = groups[0];
      groups.forEach(g=>{ if(g.offsetTop <= y) cur = g; });
      tabs.forEach(t=> t.classList.toggle('on', t.getAttribute('href') === '#' + cur.id));
    };
    window.addEventListener('scroll', mark, {passive:true});
    mark();
  }

  /* ── formularz kontaktowy (demo — bez wysyłki) ── */
  const form = document.getElementById('kontaktForm');
  if(form){
    const msg = document.getElementById('formMsg');
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const missing = [...form.querySelectorAll('[required]')].filter(f=>
        f.type === 'checkbox' ? !f.checked : !f.value.trim());
      if(missing.length){
        msg.textContent = 'Uzupełnij pola oznaczone gwiazdką.';
        msg.className = 'form-msg err';
        missing[0].focus();
        return;
      }
      const przycisk = form.querySelector('[type=submit]');
      const etykieta = przycisk ? przycisk.innerHTML : '';
      if (przycisk) { przycisk.disabled = true; przycisk.textContent = 'Wysyłanie…'; }
      msg.textContent = '';
      msg.className = 'form-msg';

      const dane = Object.fromEntries(new FormData(form).entries());
      dane.zgoda = !!form.querySelector('[name=zgoda]')?.checked;

      fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dane),
      })
        .then(r => r.json().then(d => ({ ok: r.ok, d })))
        .then(({ ok, d }) => {
          if (!ok) throw new Error(d.blad || 'Nie udało się wysłać wiadomości.');
          msg.textContent = 'Dziękujemy — wiadomość została wysłana. Odezwiemy się najszybciej, jak to możliwe.';
          msg.className = 'form-msg ok';
          form.reset();
        })
        .catch(err => {
          msg.textContent = err.message + ' Możesz też napisać na kontakt@dimedical.pl.';
          msg.className = 'form-msg err';
        })
        .finally(() => {
          if (przycisk) { przycisk.disabled = false; przycisk.innerHTML = etykieta; }
        });
    });
  }


  /* ── wideo: YouTube dopiero po kliknięciu (nie obciąża startu strony) ── */
  document.querySelectorAll('.video[data-yt]').forEach(box=>{
    const btn=box.querySelector('.video-play');
    if(!btn) return;
    btn.addEventListener('click', ()=>{
      const f=document.createElement('iframe');
      f.src='https://www.youtube-nocookie.com/embed/'+box.dataset.yt+'?autoplay=1&rel=0';
      f.title='Film instruktażowy M-Typer';
      f.allow='accelerometer; autoplay; encrypted-media; picture-in-picture';
      f.allowFullscreen=true;
      box.appendChild(f);
      box.classList.add('on');
    });
  });


  /* ── POLE MOLEKULARNE ────────────────────────────────────────────
     Zamiast luźnych kropek — realne obiekty: pierścienie, łańcuchy
     i fragmenty podwójnej helisy. Dryfują, obracają się, a kursor
     je przyciąga i rozświetla. Biel czyta się na barwnych plamach
     tła i znika nad czystym papierem — stąd wrażenie głębi.       */
  const pole = document.getElementById('pole');
  // rysowanie startuje po pierwszym renderze, żeby nie wchodzić w drogę LCP
  const poZaladowaniu = fn => (document.readyState === 'complete')
      ? requestAnimationFrame(fn)
      : addEventListener('load', () => requestAnimationFrame(fn), { once:true });
  if(pole && !reduce){
    const ctx = pole.getContext('2d');
    const waski = matchMedia('(max-width:820px)').matches;
    // na telefonie DPR 3 oznaczałby 9× więcej pikseli do wypełnienia co klatkę
    const dpr = Math.min(window.devicePixelRatio || 1, waski ? 1.5 : 2);
    let W=0, H=0, obiekty=[], raf=null;
    const ptr = { x:-9999, y:-9999, on:false };
    const ZASIEG = 230;

    /* pierścień — sześciokąt z atomami w wierzchołkach */
    const pierscien = (r)=>{
      const w=[], b=[];
      for(let i=0;i<6;i++){
        const a = Math.PI/3*i;
        w.push({x:Math.cos(a)*r, y:Math.sin(a)*r});
      }
      for(let i=0;i<6;i++) b.push([i,(i+1)%6]);
      if(Math.random()>.5){ w.push({x:0,y:-r*1.7}); b.push([0,6]); }
      return {w,b};
    };
    /* łańcuch — zygzak jak szkielet węglowy */
    const lancuch = (n,d)=>{
      const w=[], b=[];
      for(let i=0;i<n;i++) w.push({x:(i-(n-1)/2)*d, y:(i%2?1:-1)*d*.42});
      for(let i=0;i<n-1;i++) b.push([i,i+1]);
      return {w,b};
    };
    /* fragment podwójnej helisy */
    const helisa = (n,d,a)=>{
      const w=[], b=[];
      for(let i=0;i<n;i++){
        const f=i/(n-1)*Math.PI*2.2;
        w.push({x:(i-(n-1)/2)*d, y:Math.sin(f)*a});
        w.push({x:(i-(n-1)/2)*d, y:-Math.sin(f)*a});
      }
      for(let i=0;i<n-1;i++){ b.push([i*2,(i+1)*2]); b.push([i*2+1,(i+1)*2+1]); }
      for(let i=0;i<n;i+=2) b.push([i*2,i*2+1]);      // szczebelki
      return {w,b};
    };

    function ile(){
      const a = window.innerWidth * window.innerHeight;
      const n = Math.round(Math.min(Math.max(a/150000, 7), 18));
      return waski ? Math.max(4, Math.round(n * 0.5)) : n;
    }
    function build(){
      W=window.innerWidth; H=window.innerHeight;
      pole.width=W*dpr; pole.height=H*dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      obiekty = Array.from({length:ile()}, ()=>{
        const los = Math.random();
        const ksztalt = los<.42 ? pierscien(13+Math.random()*11)
                      : los<.78 ? lancuch(4+((Math.random()*3)|0), 20+Math.random()*10)
                                : helisa(5, 17, 13);
        return {
          ...ksztalt,
          x:Math.random()*W, y:Math.random()*H,
          vx:(Math.random()-.5)*.16, vy:(Math.random()-.5)*.16,
          kat:Math.random()*Math.PI*2, obr:(Math.random()-.5)*.0022,
          sk:.8+Math.random()*.5, moc:0
        };
      });
    }

    window.addEventListener('pointermove', e=>{ ptr.x=e.clientX; ptr.y=e.clientY; ptr.on=true; }, {passive:true});
    window.addEventListener('pointerleave', ()=>{ ptr.on=false; ptr.x=ptr.y=-9999; });
    window.addEventListener('blur', ()=>{ ptr.on=false; });

    function draw(){
      ctx.clearRect(0,0,W,H);

      obiekty.forEach(o=>{
        let cel = 0;
        if(ptr.on){
          const dx=ptr.x-o.x, dy=ptr.y-o.y, d=Math.hypot(dx,dy);
          if(d < ZASIEG){
            cel = 1 - d/ZASIEG;
            o.vx += (dx/d) * cel * .012;          // delikatne przyciąganie
            o.vy += (dy/d) * cel * .012;
          }
        }
        o.moc += (cel - o.moc) * .07;             // rozświetlenie wygładzone

        o.vx*=.985; o.vy*=.985;
        const sp=Math.hypot(o.vx,o.vy);
        if(sp<.035){ o.vx+=(Math.random()-.5)*.03; o.vy+=(Math.random()-.5)*.03; }
        else if(sp>.7){ o.vx=o.vx/sp*.7; o.vy=o.vy/sp*.7; }

        o.x+=o.vx; o.y+=o.vy;
        o.kat += o.obr + o.moc*.004;              // przy kursorze kręci się żwawiej

        const m=90;
        if(o.x<-m) o.x=W+m; else if(o.x>W+m) o.x=-m;
        if(o.y<-m) o.y=H+m; else if(o.y>H+m) o.y=-m;

        const sin=Math.sin(o.kat), cos=Math.cos(o.kat), s=o.sk*(1+o.moc*.14);
        const pkt = o.w.map(w=>({
          x: o.x + (w.x*cos - w.y*sin)*s,
          y: o.y + (w.x*sin + w.y*cos)*s
        }));

        const baza = .30 + o.moc*.42;
        ctx.strokeStyle = 'rgba(255,255,255,'+baza+')';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        o.b.forEach(([a,b])=>{ ctx.moveTo(pkt[a].x,pkt[a].y); ctx.lineTo(pkt[b].x,pkt[b].y); });
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,'+(baza+.30)+')';
        pkt.forEach(q=>{ ctx.beginPath(); ctx.arc(q.x,q.y,2.3*s,0,Math.PI*2); ctx.fill(); });

        if(o.moc > .04){                          // nić do kursora
          ctx.strokeStyle='rgba(255,255,255,'+(o.moc*.30)+')';
          ctx.lineWidth=1;
          ctx.beginPath(); ctx.moveTo(o.x,o.y); ctx.lineTo(ptr.x,ptr.y); ctx.stroke();
        }
      });

      raf = requestAnimationFrame(draw);
    }
    const start=()=>{ if(!raf) raf=requestAnimationFrame(draw); };
    const stop =()=>{ if(raf){ cancelAnimationFrame(raf); raf=null; } };

    let t; window.addEventListener('resize', ()=>{ clearTimeout(t); t=setTimeout(build,180); });
    document.addEventListener('visibilitychange', ()=> document.hidden ? stop() : start());
    poZaladowaniu(()=>{ build(); start(); });
  }


  /* ── SILNIK RUCHU: jedna pętla, wartości wygładzane ──────────────
     Parallax i magnetyzm nie reagują wprost na zdarzenia, tylko
     dążą do celu — stąd wrażenie ciągłości zamiast skoków.        */
  if(!reduce){
    const lerp = (a,b,t)=> a + (b-a)*t;
    const war = [...document.querySelectorAll('[data-par]')].map(el=>({
      el, wsp:parseFloat(el.dataset.par), teraz:0, cel:0
    }));
    /* przyciski nie pływają — śledzimy tylko pozycję kursora w ich obrębie */
    const swiatlo = [...document.querySelectorAll('.btn')];

    swiatlo.forEach(b=>{
      b.addEventListener('pointermove', e=>{
        const r = b.getBoundingClientRect();
        b.style.setProperty('--bx', ((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
        b.style.setProperty('--by', ((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
      }, {passive:true});
      b.addEventListener('pointerleave', ()=>{
        b.style.setProperty('--bx','50%'); b.style.setProperty('--by','50%');
      });
    });

    let ostatniY = -1;
    (function petla(){
      const y = window.scrollY;
      if(y !== ostatniY){ war.forEach(w=> w.cel = y * w.wsp); ostatniY = y; }
      war.forEach(w=>{
        w.teraz = lerp(w.teraz, w.cel, .075);
        if(Math.abs(w.teraz - w.cel) > .05)
          w.el.style.transform = 'translate3d(0,'+w.teraz.toFixed(2)+'px,0)';
      });
      requestAnimationFrame(petla);
    })();
  }

  /* ── automatyczne opóźnienia w grupach ──────────────────────────
     Zamiast ręcznych klas rv-d1..d4 — kolejność liczona z układu. */
  document.querySelectorAll('.news-grid, .why-grid, .tiles, .post-grid, .steps, .dl-list')
    .forEach(grupa=>{
      [...grupa.children].forEach((dz,i)=>{
        if(dz.classList.contains('rv') && !dz.style.getPropertyValue('--d'))
          dz.style.setProperty('--d', (i * .07).toFixed(2) + 's');
      });
    });

  /* ── nagłówki ujawniane wierszami ───────────────────────────────
     Dzielimy WYŁĄCZNIE węzły tekstowe, więc znaczniki w środku
     nagłówka (np. gradientowy .accent) zostają nietknięte.
     Numer wiersza liczymy z realnych pozycji — działa na każdej
     szerokości ekranu.                                            */
  if(!reduce){
    const slowaZTekstu = (korzen)=>{
      const doZamiany=[];
      const chodz=(n)=>{
        for(const dz of [...n.childNodes]){
          if(dz.nodeType===3){ if(dz.nodeValue.trim()) doZamiany.push(dz); }
          else if(dz.nodeType===1 && !dz.classList.contains('w')) chodz(dz);
        }
      };
      chodz(korzen);
      const wyn=[];
      doZamiany.forEach(t=>{
        const frag=document.createDocumentFragment();
        t.nodeValue.split(/(\s+)/).forEach(kawalek=>{
          if(!kawalek) return;
          if(/^\s+$/.test(kawalek)){ frag.appendChild(document.createTextNode(kawalek)); return; }
          const i=document.createElement('i'); i.className='w';
          const sp=document.createElement('span'); sp.textContent=kawalek;
          i.appendChild(sp); frag.appendChild(i); wyn.push(i);
        });
        t.parentNode.replaceChild(frag, t);
      });
      return wyn;
    };

    document.querySelectorAll('h1, .sec-head h2').forEach(h=>{
      if(h.querySelector('img, svg, .w')) return;
      if(h.textContent.length > 200) return;

      const slowa = slowaZTekstu(h);
      if(slowa.length < 2) return;
      h.classList.add('reveal-lines');

      let gora=null, wiersz=-1;
      slowa.forEach(w=>{
        const t=Math.round(w.getBoundingClientRect().top);
        if(gora===null || Math.abs(t-gora)>4){ wiersz++; gora=t; }
        w.style.setProperty('--i', wiersz);
      });

      /* nagłówek nad zgięciem startuje razem z resztą hero, nie czeka na scroll —
         inaczej akapit pojawia się przed tytułem */
      if(h.getBoundingClientRect().top < window.innerHeight * .85){
        requestAnimationFrame(()=>requestAnimationFrame(()=>h.classList.add('in')));
        /* bezpiecznik: w tle przeglądarka dławi klatki — tekst musi się pokazać tak czy tak */
        setTimeout(()=>h.classList.add('in'), 900);
      } else {
        new IntersectionObserver((es,ob)=>{
          es.forEach(e=>{ if(e.isIntersecting){ h.classList.add('in'); ob.disconnect(); } });
        }, {threshold:.2}).observe(h);
      }
    });
  }




  /* ── zgoda na cookies ──
     Nic ponad niezbędne nie uruchamia się przed świadomym wyborem.
     Skrypty analityczne podpinać przez window.zaZgoda(), nie bezpośrednio. */
  (function(){
    const KLUCZ = 'dimedical-zgoda';
    const baner = document.getElementById('zgodaCookies');
    let wybor = null;
    try { wybor = localStorage.getItem(KLUCZ); } catch(e) {}

    // kolejka zadań czekających na zgodę
    const czekajace = [];
    window.zaZgoda = fn => {
      if (wybor === 'wszystkie') fn();
      else czekajace.push(fn);
    };

    const zapisz = v => {
      wybor = v;
      try { localStorage.setItem(KLUCZ, v); } catch(e) {}
      if (baner) {
        baner.hidden = true;
        document.documentElement.style.setProperty('--zgoda-h', '0px');
        document.body.classList.remove('zgoda-widoczna');
      }
      if (v === 'wszystkie') {
        while (czekajace.length) { try { czekajace.shift()(); } catch(e) {} }
      }
      dispatchEvent(new CustomEvent('zgoda', { detail: v }));
    };

    if (!baner) return;
    if (wybor) { baner.hidden = true; return; }

    // pokazujemy dopiero po wejściu strony, żeby nie konkurować z pierwszym wrażeniem
    // przyciski kontaktu ustępują banerowi o tyle, ile ten realnie zajmuje
    const zmierz = () => {
      const h = baner.hidden ? 0 : Math.ceil(baner.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--zgoda-h', h + 'px');
      document.body.classList.toggle('zgoda-widoczna', !baner.hidden);
    };

    setTimeout(() => {
      baner.hidden = false;
      zmierz();
      const pierwszy = baner.querySelector('[data-zgoda]');
      if (pierwszy) pierwszy.focus({ preventScroll: true });
    }, 900);
    addEventListener('resize', zmierz);

    baner.addEventListener('click', e => {
      const b = e.target.closest('[data-zgoda]');
      if (b) zapisz(b.dataset.zgoda);
    });
    // Esc = wybór zachowawczy, nie zamknięcie bez decyzji
    addEventListener('keydown', e => {
      if (e.key === 'Escape' && !baner.hidden) zapisz('niezbedne');
    });
  })();


})();
