/* ═══════════════════════════════════════════════════
   Digital View — Home v1
   Vanilla JS · Astro-portable
═══════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────
   00 · NAV HEIGHT — keeps the hero exactly 100svh minus nav
─────────────────────────────────────────────────── */
(function navHeight(){
  const nav = document.getElementById('nav');
  if(!nav) return;
  function set(){
    document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  }
  window.addEventListener('resize', set, {passive:true});
  set();
})();

/* ──────────────────────────────────────────────────
   01 · SIMULATOR
   tabs → set CPL · slider → invest · derive KPIs
─────────────────────────────────────────────────── */
(function simulator(){
  const tabs    = document.querySelectorAll('.tab');
  const slider  = document.getElementById('invest');
  const investV = document.getElementById('investV');
  const kLeads  = document.getElementById('kLeads');
  const kVisit  = document.getElementById('kVisit');
  const kOps    = document.getElementById('kOps');

  if(!slider) return;

  let cpl = 6.00;

  // visit & ops conversion by campaign type
  const conv = {
    captacion: { visit: 0.10, ops: 0.125 }, // captación venta = listings
    venta:     { visit: 0.18, ops: 0.10 },
    alquiler:  { visit: 0.22, ops: 0.18 },
  };
  let key = 'captacion';

  function format(n){
    return n.toLocaleString('es-AR');
  }

  function animateNumber(el, target){
    const start = parseInt(el.textContent.replace(/\./g,''), 10) || 0;
    const dur = 380;
    const t0 = performance.now();
    function step(t){
      const k = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      const v = Math.round(start + (target - start) * eased);
      el.textContent = format(v);
      if(k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function recompute(){
    const inv = parseInt(slider.value, 10);
    investV.textContent = format(inv);
    // update slider fill
    const p = ((inv - 400) / (5000 - 400)) * 100;
    slider.style.setProperty('--p', p + '%');

    const leads = Math.round(inv / cpl);
    const c = conv[key];
    const visits = Math.round(leads * c.visit);
    const ops = Math.max(0, Math.round(visits * c.ops));

    animateNumber(kLeads, leads);
    animateNumber(kVisit, visits);
    animateNumber(kOps, ops);
  }

  tabs.forEach(t => {
    t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.remove('is-active'));
      t.classList.add('is-active');
      cpl = parseFloat(t.dataset.cpl);
      key = t.dataset.key;
      recompute();
    });
  });

  slider.addEventListener('input', recompute);
  recompute();
})();

/* ──────────────────────────────────────────────────
   02 · LEAD FEED
   Realistic-looking leads stream in.
─────────────────────────────────────────────────── */
(function leadFeed(){
  const list = document.getElementById('feedList');
  const counter = document.getElementById('leadsCount');
  const liveLeads = document.getElementById('liveLeads');
  if(!list) return;

  const names = [
    'Lautaro G.', 'Sofía B.', 'Tomás R.', 'Camila V.', 'Mateo N.', 'Mariana L.',
    'Federico P.', 'Lucía D.', 'Joaquín M.', 'Florencia S.', 'Bruno T.', 'Valentina A.',
    'Agustín C.', 'Renata O.', 'Maximiliano F.', 'Delfina H.', 'Iván K.', 'Catalina E.'
  ];
  const wants = [
    'Quiere vender su casa en Vicente López',
    'Busca depto 2 amb en Nordelta',
    'Consulta por PH en Belgrano',
    'Tasación de propiedad en San Isidro',
    'Alquiler temporario en Pilar',
    'Quiere captar para venta en Tigre',
    'Interesado en lotes en Puertos del Lago',
    'Busca local comercial en CABA Norte',
    'Tasación urgente en Olivos',
    'Quiere vender su casa en Martínez',
    'Consulta por cochera en Recoleta',
    'Busca 3 amb con cochera en Núñez',
  ];
  const sources = [
    {k:'IG', cls:'ig'},
    {k:'IG', cls:'ig'},
    {k:'IG', cls:'ig'},
    {k:'FB', cls:'fb'},
  ];
  const times = ['hace 1 min','hace 3 min','hace 6 min','hace 11 min','hace 18 min','hace 27 min','hace 41 min','hace 1 h','hace 2 h'];

  let counterVal = 1547;

  function pick(arr){return arr[Math.floor(Math.random()*arr.length)];}

  function makeLead(index, isNew){
    const li = document.createElement('li');
    li.className = 'feed-li' + (isNew ? ' fli-new' : '');
    const num = String(counterVal - index).padStart(4,'0');
    const src = pick(sources);
    li.innerHTML = `
      <span class="fli-num">#${num}</span>
      <span class="fli-body">
        <span class="fli-name">${pick(names)}</span>
        <span class="fli-want">${pick(wants)}</span>
      </span>
      <span class="fli-meta">
        <span class="fli-src ${src.cls}">${src.k}</span>
        <span class="fli-time">${isNew ? 'recién' : pick(times)}</span>
      </span>
    `;
    return li;
  }

  // initial fill
  for(let i = 0; i < 6; i++){
    list.appendChild(makeLead(i, false));
  }

  // stream
  let feedTimer = null;
  function startFeed(){
    if(feedTimer) clearInterval(feedTimer);
    const ms = window.__feedInterval || 4200;
    feedTimer = setInterval(tick, ms);
  }
  function tick(){
    counterVal++;
    if(counter) counter.textContent = counterVal.toLocaleString('es-AR');
    if(liveLeads) liveLeads.textContent = counterVal.toLocaleString('es-AR');
    const newLead = makeLead(0, true);
    list.insertBefore(newLead, list.firstChild);
    // drop the last
    if(list.children.length > 7){
      list.lastElementChild.remove();
    }
    // strip the "new" marker after a beat
    setTimeout(() => newLead.classList.remove('fli-new'), 3200);
  }
  startFeed();
  window.__restartFeed = startFeed;
})();

/* ──────────────────────────────────────────────────
   03 · TEAM ROBOT — lateral reveal on scroll
   Mask reveals as the section enters the viewport.
─────────────────────────────────────────────────── */
(function teamReveal(){
  const team = document.getElementById('equipo');
  const robot = document.getElementById('teamRobot');
  if(!team || !robot) return;
  const target = robot.parentElement; // .side-robot — sets var for both image mask + bar

  function update(){
    const rect = team.getBoundingClientRect();
    const vh = window.innerHeight;
    // progress 0 → 1 across the section's traverse of the viewport
    // (the robot "prints" gradually while you scroll through Equipo)
    const total = rect.height + vh * 0.4;
    const passed = vh * 0.85 - rect.top;
    let p = passed / total;
    p = Math.max(0, Math.min(1, p));
    // map 0–1 → 5–100%
    const pct = 5 + p * 95;
    target.style.setProperty('--reveal', pct + '%');
  }

  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  update();
})();

/* ──────────────────────────────────────────────────
   04 · CONTACT FORM — easter egg dancing robot
─────────────────────────────────────────────────── */
(function contactForm(){
  const form = document.getElementById('contactForm');
  const overlay = document.getElementById('danceOverlay');
  const closeBtn = document.getElementById('closeDance');
  if(!form || !overlay) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // simple required check
    const ok = ['cn','ce','cm'].every(id => {
      const el = document.getElementById(id);
      const v = el && el.value.trim();
      if(!v){ el && el.focus(); return false; }
      return true;
    });
    if(!ok) return;
    overlay.hidden = false;
    form.reset();
  });

  closeBtn.addEventListener('click', () => { overlay.hidden = true; });
  overlay.addEventListener('click', (e) => {
    if(e.target === overlay) overlay.hidden = true;
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && !overlay.hidden) overlay.hidden = true;
  });
})();

/* ──────────────────────────────────────────────────
   05 · NAV — active link based on scroll position
─────────────────────────────────────────────────── */
(function navActive(){
  const links = document.querySelectorAll('.nav-links a');
  if(!links.length) return;
  const sections = [...links].map(a => {
    const id = a.getAttribute('href').slice(1);
    return { a, el: document.getElementById(id) };
  }).filter(x => x.el);

  function onScroll(){
    const y = window.scrollY + 120;
    let active = null;
    for(const s of sections){
      if(s.el.offsetTop <= y) active = s;
    }
    links.forEach(l => l.style.color = '');
    if(active){
      active.a.style.color = 'var(--ink)';
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();

/* ──────────────────────────────────────────────────
   06 · TWEAKS PANEL — dark/light + feed pace
   Lives only when host activates edit mode.
─────────────────────────────────────────────────── */
(function tweaks(){
  const panel = document.getElementById('tweaksPanel');
  const closeBtn = document.getElementById('twClose');
  if(!panel) return;

  const defaults = (typeof TWEAK_DEFAULTS !== 'undefined') ? TWEAK_DEFAULTS : { theme:'dark', feedRate:'fast' };
  const state = Object.assign({}, defaults);
  const navThemeBtn = document.getElementById('themeToggle');
  try{ const ls = localStorage.getItem('dvTheme'); if(ls === 'light' || ls === 'dark') state.theme = ls; }catch(_){}

  function applyTheme(t){
    if(t === 'light') document.body.setAttribute('data-theme', 'light');
    else document.body.removeAttribute('data-theme');
    // swap themeable client logos (white marks in dark, dark marks in light)
    document.querySelectorAll('#clientLogos .cl-swap').forEach(img => {
      const src = (t === 'light') ? img.dataset.light : img.dataset.dark;
      if(src && img.getAttribute('src') !== src) img.setAttribute('src', src);
    });
  }
  function applyFeedRate(r){
    window.__feedInterval = (r === 'slow') ? 7000 : 4200;
    if(typeof window.__restartFeed === 'function') window.__restartFeed();
  }

  function apply(){
    applyTheme(state.theme);
    applyFeedRate(state.feedRate);
    panel.querySelectorAll('.tw-radio').forEach(group => {
      const key = group.dataset.tweak;
      group.querySelectorAll('button').forEach(b => {
        b.classList.toggle('is-active', b.dataset.value === state[key]);
      });
    });
    if(navThemeBtn){
      const isLight = state.theme === 'light';
      navThemeBtn.setAttribute('aria-pressed', String(isLight));
      const ico = navThemeBtn.querySelector('.tt-ico');
      const lbl = navThemeBtn.querySelector('.tt-lbl');
      if(ico) ico.textContent = isLight ? '○' : '●';
      if(lbl) lbl.textContent = isLight ? 'Light' : 'Dark';
    }
  }

  function persist(patch){
    Object.assign(state, patch);
    try{
      window.parent.postMessage({type:'__edit_mode_set_keys', edits: patch}, '*');
    }catch(_){}
    if('theme' in patch){ try{ localStorage.setItem('dvTheme', state.theme); }catch(_){} }
    apply();
  }

  panel.querySelectorAll('.tw-radio').forEach(group => {
    const key = group.dataset.tweak;
    group.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        persist({ [key]: b.dataset.value });
      });
    });
  });

  // nav theme toggle — flips whole page theme like the tweak
  if(navThemeBtn){
    navThemeBtn.addEventListener('click', () => {
      persist({ theme: state.theme === 'light' ? 'dark' : 'light' });
    });
  }

  // Host protocol
  window.addEventListener('message', (e) => {
    const d = e.data;
    if(!d || !d.type) return;
    if(d.type === '__activate_edit_mode'){
      panel.classList.add('is-open');
      panel.setAttribute('aria-hidden','false');
    } else if(d.type === '__deactivate_edit_mode'){
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden','true');
    }
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden','true');
    try{
      window.parent.postMessage({type:'__edit_mode_dismissed'}, '*');
    }catch(_){}
  });

  apply();

  try{
    window.parent.postMessage({type:'__edit_mode_available'}, '*');
  }catch(_){}
})();
