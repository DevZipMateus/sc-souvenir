/* ============================================================
   SC SOUVENIR — SCRIPT.JS
   Mobile menu | FAQ | Scroll reveal | Header shrink |
   Scroll progress | Contact form → WhatsApp | Counter | Nav highlight
   ============================================================ */

'use strict';

/* ---------- DOM Ready ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initHeader();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initActiveNav();
  initContactForm();
  initFooterYear();
  initParallax();
  initCardTilt();
});

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop  = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollable = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ============================================================
   HEADER SHRINK ON SCROLL
   ============================================================ */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   MOBILE MENU TOGGLE
   ============================================================ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('main-nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    nav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Close on nav link click */
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Abrir menu');
      document.body.style.overflow = '';
    });
  });

  /* Close on outside click */
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && nav.classList.contains('open')) {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Abrir menu');
      document.body.style.overflow = '';
    }
  });

  /* Close on resize above 768 */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && nav.classList.contains('open')) {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Abrir menu');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          /* Staggered delay for sibling cards */
          const siblings = entry.target.parentElement.querySelectorAll('.reveal');
          let delay = 0;
          siblings.forEach((sib, i) => {
            if (sib === entry.target) delay = i * 80;
          });
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, Math.min(delay, 400));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   COUNTER ANIMATION (hero stats)
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step     = 16;
  const totalSteps = duration / step;
  let current = 0;

  const timer = setInterval(() => {
    current += target / totalSteps;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, step);
}

/* ============================================================
   ACTIVE NAV HIGHLIGHT ON SCROLL
   ============================================================ */
function initActiveNav() {
  const sections  = document.querySelectorAll('section[id], div[id="diferenciais"]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(sec => observer.observe(sec));
}

/* ============================================================
   CONTACT FORM → WHATSAPP MESSAGE
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contato-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome     = trim(form.nome?.value     || '');
    const telefone = trim(form.telefone?.value || '');
    const cidade   = trim(form.cidade?.value   || '');
    const mensagem = trim(form.mensagem?.value  || '');

    /* Basic validation */
    let valid = true;

    if (!nome) {
      showError(form.nome, 'Por favor, informe seu nome.');
      valid = false;
    } else {
      clearError(form.nome);
    }

    if (!telefone) {
      showError(form.telefone, 'Por favor, informe seu telefone.');
      valid = false;
    } else {
      clearError(form.telefone);
    }

    if (!mensagem) {
      showError(form.mensagem, 'Por favor, escreva uma mensagem.');
      valid = false;
    } else {
      clearError(form.mensagem);
    }

    if (!valid) return;

    /* Build message */
    let text = `Olá! Sou *${nome}*`;
    if (telefone) text += ` — Telefone: ${telefone}`;
    if (cidade)   text += ` — Cidade: ${cidade}`;
    text += `.\n\n${mensagem}`;

    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/5548999999999?text=${encoded}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

function trim(str) { return str.trim(); }

function showError(el, msg) {
  if (!el) return;
  clearError(el);
  el.style.borderColor = '#E91E8C';
  const err = document.createElement('span');
  err.className = 'form-error';
  err.style.cssText = 'display:block;margin-top:4px;font-size:0.78rem;color:#E91E8C;';
  err.textContent = msg;
  el.parentNode.appendChild(err);
  el.focus();
}

function clearError(el) {
  if (!el) return;
  el.style.borderColor = '';
  const prev = el.parentNode.querySelector('.form-error');
  if (prev) prev.remove();
}

/* ============================================================
   FOOTER YEAR
   ============================================================ */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   PARALLAX NO HERO
   ============================================================ */
function initParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  if (window.innerWidth <= 768) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled > window.innerHeight * 1.2) return;
    hero.style.backgroundPositionY = `calc(center + ${scrolled * 0.25}px)`;
  }, { passive: true });
}

/* ============================================================
   TILT 3D NOS CARDS (desktop)
   ============================================================ */
function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll(
    '.produto-card:not(.produto-destaque), .diferencial-card, .mvv-card, .mercado-card'
  );

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const tiltX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
      const tiltY = ((x - rect.width  / 2) / (rect.width  / 2)) *  5;
      card.style.transition = 'transform 0.08s linear';
      card.style.transform  = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s ease';
      card.style.transform  = '';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });
}
