/* ARToffNIA — mega menu (współdzielony komponent; wstrzykuje własny CSS i markup)
   Linki zajęć = deep-linki do katalogu (?zaj= / ?kto=), docelowo podmienialne na podstrony zajęć. */
(function(){
"use strict";
var CSS = `
.mm-btn{background:var(--ink);color:var(--bg);border:none;border-radius:999px;padding:.6rem 1.35rem;font-family:inherit;font-size:.78rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;margin-left:1.4rem;transition:opacity .15s}
.mm-btn:hover{opacity:.75}
.mm{position:fixed;inset:0;background:#E9E9E3;z-index:999;overflow-y:auto;opacity:0;visibility:hidden;transform:translateY(-10px);transition:opacity .28s ease,transform .32s cubic-bezier(.22,.8,.3,1),visibility 0s linear .32s}
.mm.open{opacity:1;visibility:visible;transform:none;transition:opacity .28s ease,transform .32s cubic-bezier(.22,.8,.3,1)}
.mm-grid>div{opacity:0;transform:translateY(16px);transition:opacity .4s ease,transform .45s cubic-bezier(.22,.8,.3,1)}
.mm.open .mm-grid>div{opacity:1;transform:none}
.mm.open .mm-grid>div:nth-child(1){transition-delay:.08s}
.mm.open .mm-grid>div:nth-child(2){transition-delay:.15s}
.mm.open .mm-grid>div:nth-child(3){transition-delay:.22s}
.mm.open .mm-grid>div:nth-child(4){transition-delay:.29s}
.mm-cta{opacity:0;transform:translateY(10px);transition:opacity .4s ease .38s,transform .45s cubic-bezier(.22,.8,.3,1) .38s}
.mm.open .mm-cta{opacity:1;transform:none}
.mm-top{opacity:0;transition:opacity .3s ease .04s}
.mm.open .mm-top{opacity:1}
@media (prefers-reduced-motion:reduce){.mm,.mm-grid>div,.mm-cta,.mm-top{transition:none!important;transform:none!important}}
.mm-in{max-width:1200px;margin:0 auto;padding:0 1.5rem 3rem}
.mm-top{display:flex;justify-content:space-between;align-items:center;padding:1.4rem 0;border-bottom:1px solid var(--ink)}
.mm-top img{height:34px;width:auto;display:block}
.mm-logo{font-weight:800;font-size:1rem;letter-spacing:.02em}
.mm-close{background:none;border:1px solid var(--ink);border-radius:999px;width:42px;height:42px;font-size:1.05rem;cursor:pointer;line-height:1}
.mm-close{transition:background .15s,color .15s,transform .25s}
.mm-close:hover{background:var(--ink);color:var(--bg);transform:rotate(90deg)}
.mm-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:2.4rem;padding-top:2.2rem}
@media (max-width:900px){.mm-grid{grid-template-columns:repeat(2,1fr)}}
@media (max-width:560px){.mm-grid{grid-template-columns:1fr}}
.mm-h{font-size:.68rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#8A8A82;padding-bottom:.7rem;border-bottom:1px solid #D6D6CE;margin-bottom:.9rem}
.mm-h + .mm-h{margin-top:1.8rem}
.mm ul{list-style:none;margin:0 0 1.6rem;padding:0}
.mm li{margin:0}
.mm a{display:block;color:var(--ink);text-decoration:none;font-size:.92rem;font-weight:500;padding:.32rem 0;letter-spacing:-.005em}
.mm a:hover{font-weight:800}
.mm a.big{font-size:1.15rem;font-weight:700;padding:.42rem 0}
.mm a.big:hover{font-weight:800}
.mm .dot{display:inline-block;width:.6rem;height:.6rem;border-radius:50%;margin-right:.55rem;vertical-align:baseline}
.mm-cta{display:flex;gap:1.2rem;align-items:center;flex-wrap:wrap;margin-top:1.4rem;padding-top:1.8rem;border-top:1px solid var(--ink)}
.mm-cta .btnx{display:inline-block;background:var(--ink);color:var(--bg);padding:.85rem 1.8rem;font-weight:700;font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;border-radius:999px}
.mm-cta .tel{font-size:.9rem;color:var(--mid)}
.mm-cta .tel a{color:var(--ink);font-weight:700;text-decoration:none}
body.mm-lock{overflow:hidden}
`;

/* zaj = filtr po nazwie w katalogu; docelowo: href podstrony zajęć */
function zaj(label,q){ return '<li><a href="index.html?zaj='+encodeURIComponent(q||label)+'#zajecia">'+label+'</a></li>'; }
function zajS(label,slug){ return '<li><a href="zajecie.html?id='+slug+'">'+label+'</a></li>'; }
function kto(label,key,color){ return '<li><a class="big" href="grupa.html?g='+key+'"><span class="dot" style="background:var(--g-'+key+')"></span>'+label+'</a></li>'; }

var HTML = `
<div class="mm" id="mm" role="dialog" aria-label="Menu serwisu">
  <div class="mm-in">
    <div class="mm-top">
      <a href="index.html"><img src="logo-artoffnia.svg" alt="ARToffNIA — Fundacja Tańca i Sztuki"></a>
      <button class="mm-close" aria-label="Zamknij menu">✕</button>
    </div>
    <div class="mm-grid">
      <div>
        <div class="mm-h">Taniec</div>
        <ul>
          ${zaj('Zespół Pryzmat','Pryzmat')}
          ${zaj('Disco Dance · Dance It Out','Disco Dance')}
          ${zajS('Mix Dance 7+','mix-dance-7')}
          ${zajS('Balet OPEN','balet-open')}
          ${zajS('Jazz OPEN','jazz-open')}
          ${zajS('Taniec współczesny 13+','taniec-wspolczesny-open-13')}
          ${zaj('Hip-hop','Hip-hop')}
          ${zajS('Breakdance 7+','breakdance-7')}
          ${zaj('Popping')}
          ${zajS('Street dance 30+','street-dance-30-poczatkujaca')}
          ${zajS('High Heels','high-heels')}
          ${zajS('Flamenco','flamenco')}
          ${zajS('Improwizacja taneczna','improwizacja-taneczna-16')}
          ${zajS('Lekcje indywidualne','lekcje-indywidualne-tanca')}
        </ul>
      </div>
      <div>
        <div class="mm-h">Ruch i forma</div>
        <ul>
          ${zaj('Akrobatyka i tricking','Akrobatyka')}
          ${zajS('Fitness dla dorosłych','fitness-dla-doroslych')}
          ${zajS('Body Balance','body-balance')}
          ${zajS('Pilates','pilates')}
          ${zaj('Joga','Joga')}
          ${zajS('ZOGA Movement','zoga-movement')}
          ${zajS('Salsation','salsation')}
          ${zajS('Latina Power','latina-power')}
          ${zajS('Gimnastyka słowiańska','gimnastyka-slowianska-dla-kobiet')}
          ${zaj('Gimnastyka dla seniorów 60+','seniorów 60+')}
        </ul>
        <div class="mm-h">Teatr i aktorstwo</div>
        <ul>
          ${zajS('Aktorskie dla młodzieży','aktorskie-dla-mlodziezy-11')}
          ${zajS('Aktorskie dla dorosłych','aktorskie-dla-doroslych')}
          ${zajS('Przygotowanie do szkół teatralnych','przygotowanie-do-szkol-teatralnych')}
        </ul>
      </div>
      <div>
        <div class="mm-h">Dla kogo</div>
        <ul>
          ${kto('Dzieci 4–12','dzieci')}
          ${kto('Nastolatki 13–17','nastolatki')}
          ${kto('Dorośli 18+','dorosli')}
          ${kto('Seniorzy 60+','seniorzy')}
        </ul>
        <div class="mm-h">Ferie i wakacje</div>
        <ul>
          <li><a class="big" href="obozy.html">Obozy i ferie 2026</a></li>
        </ul>
      </div>
      <div>
        <div class="mm-h">Informacje</div>
        <ul>
          <li><a href="cennik.html">Cennik 2025/26</a></li>
          <li><a href="zapisy.html">Zapisy</a></li>
          <li><a href="fundacja.html">Fundacja i ludzie</a></li>
          <li><a href="wynajem.html">Wynajem sal</a></li>
          <li><a href="galeria.html">Galeria</a></li>
          <li><a href="aktualnosci.html">Aktualności</a></li>
          <li><a href="kontakt.html">Kontakt</a></li>
        </ul>
        <div class="mm-h">Dokumenty</div>
        <ul>
          <li><a href="statut.html">Statut</a></li>
          <li><a href="regulamin-2025-26.pdf" target="_blank" rel="noopener">Regulamin 2025/26 (PDF)</a></li>
          <li><a href="standardy.html">Standardy ochrony małoletnich</a></li>
          <li><a href="wspieraj.html">Wspieraj kulturę</a></li>
        </ul>
      </div>
    </div>
    <div class="mm-cta">
      <a class="btnx" href="zapisy.html">Zapisz się na zajęcia</a>
      <span class="tel">Biuro: <a href="tel:+48604110894">604 110 894</a> · pn–pt 9:00–17:00</span>
    </div>
  </div>
</div>`;

var st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);
var wrap=document.createElement('div'); wrap.innerHTML=HTML; document.body.appendChild(wrap.firstElementChild);
var mm=document.getElementById('mm');
var nav=document.querySelector('.nav-links')||document.querySelector('.atf-links');
var btn=document.createElement('button'); btn.className='mm-btn'; btn.textContent='Menu'; btn.setAttribute('aria-haspopup','dialog');
if(nav) nav.parentNode.appendChild(btn);
function open(){ mm.classList.add('open'); document.body.classList.add('mm-lock'); }
function close(){ mm.classList.remove('open'); document.body.classList.remove('mm-lock'); }
btn.addEventListener('click', open);
mm.querySelector('.mm-close').addEventListener('click', close);
document.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });
mm.addEventListener('click', function(e){ if(e.target.tagName==='A') close(); });
})();
