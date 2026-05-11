/* ═══════════════════════════════════════════
   SIMULADOR — Calculadora de leads
   ═══════════════════════════════════════════ */
(() => {
  const tabs    = document.querySelectorAll('.calc__tab');
  const slider  = document.getElementById('budget-slider');
  const budget  = document.getElementById('budget-val');
  const rLeads  = document.getElementById('r-leads');
  const rVis    = document.getElementById('r-visitas');
  const rOps    = document.getElementById('r-ops');
  if (!slider || !tabs.length) return;

  let cpl = 6, convVisit = 0.05, convOp = 0.01;

  const fmt = n => n.toLocaleString('es-AR');
  const animateNum = (el, to) => {
    const from = parseInt(el.textContent.replace(/\D/g,'')) || 0;
    const dur = 600, t0 = performance.now();
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(from + (to - from) * ease));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const recalc = () => {
    const b = parseInt(slider.value);
    budget.textContent = fmt(b);
    const fill = ((b - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty('--fill', fill + '%');

    const leads = Math.round(b / cpl);
    const vis   = Math.round(leads * convVisit);
    const ops   = Math.max(0, Math.round(leads * convOp));

    animateNum(rLeads, leads);
    animateNum(rVis, vis);
    animateNum(rOps, ops);
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      cpl       = parseFloat(tab.dataset.cpl);
      convVisit = parseFloat(tab.dataset.convVisit);
      convOp    = parseFloat(tab.dataset.convOp);
      recalc();
    });
  });
  slider.addEventListener('input', recalc);
  recalc();
})();

/* ═══════════════════════════════════════════
   LEADS EN VIVO — Feed animado
   ═══════════════════════════════════════════ */
(() => {
  const feed = document.getElementById('live-feed');
  if (!feed) return;

  const leads = [
    { name: 'Alejandra M.',  msg: '3 ambientes con cochera en San Isidro',  source: 'ig' },
    { name: 'Mariano J.',    msg: 'Casa en San Isidro',                     source: 'fb' },
    { name: 'Luciana S.',    msg: 'Casa en Vicente López',                  source: 'ig' },
    { name: 'Pablo V.',      msg: 'Quiere vender su casa en Vicente López', source: 'ig' },
    { name: 'Milagros F.',   msg: 'Quiere vender su casa en Tigre',         source: 'fb' },
    { name: 'Silvana M.',    msg: 'Quiere vender su casa en CABA',          source: 'ig' },
    { name: 'Liliana T.',    msg: 'Departamento 4 ambientes en CABA',       source: 'ig' },
  ];

  const initials = name => name.split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase();
  const sourceLabel = s => s === 'ig' ? 'Instagram' : 'Facebook';
  const times = ['justo ahora', 'hace 1 min', 'hace 3 min', 'hace 5 min', 'hace 8 min', 'hace 12 min'];

  let i = 0;
  const MAX = 5;

  const addLead = () => {
    const lead = leads[i % leads.length];
    i++;
    const card = document.createElement('article');
    card.className = 'lead-card';
    card.innerHTML = `
      <div class="lead-card__avatar">${initials(lead.name)}</div>
      <div class="lead-card__body">
        <p class="lead-card__name">${lead.name}</p>
        <p class="lead-card__msg">${lead.msg}</p>
      </div>
      <div class="lead-card__meta">
        <span class="lead-card__source lead-card__source--${lead.source}">${sourceLabel(lead.source)}</span>
        <span class="lead-card__time">${times[Math.floor(Math.random() * 3)]}</span>
      </div>
    `;
    feed.prepend(card);
    while (feed.children.length > MAX) feed.lastElementChild.remove();
  };

  // Render initial 4
  for (let k = 0; k < 4; k++) addLead();

  // Only animate when section is visible
  let interval = null;
  const start = () => { if (!interval) interval = setInterval(addLead, 3500); };
  const stop  = () => { clearInterval(interval); interval = null; };

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? start() : stop());
  }, { threshold: 0.2 });
  io.observe(feed);
})();

/* ─── Tracking clicks WhatsApp ─── */
document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
  el.addEventListener('click', () => {
    if (window.fbq) fbq('track', 'Contact');
    if (window.gtag) gtag('event', 'click_whatsapp');
  });
});

/* ─── Año dinámico footer ─── */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── Navbar scroll effect ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ─── Hamburger menu ─── */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── Scroll reveal ─── */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Stagger children inside grids ─── */
document.querySelectorAll('.servicios__grid, .testimonios__grid').forEach(grid => {
  grid.querySelectorAll('.reveal').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });
});

/* ─── Contact form (Formspree) ─── */
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const successMsg = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        form.reset();
        successMsg.classList.add('visible');
        submitBtn.textContent = '¡Enviado!';
        if (window.fbq) fbq('track', 'Lead');
        if (window.gtag) gtag('event', 'generate_lead', { method: 'contact_form' });
      } else {
        submitBtn.textContent = 'Error — intentá de nuevo';
        submitBtn.disabled = false;
      }
    } catch {
      submitBtn.textContent = 'Error — intentá de nuevo';
      submitBtn.disabled = false;
    }
  });
}
