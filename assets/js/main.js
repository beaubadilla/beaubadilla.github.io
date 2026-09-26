'use strict';

/* =========================================================
   Theme toggle  (persisted, respects system preference)
   ========================================================= */
function setupTheme() {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const sync = () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  };

  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    sync();
  });

  sync();
}

/* =========================================================
   Mobile navigation
   ========================================================= */
function setupNav() {
  const btn = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!btn || !menu) return;

  const close = () => {
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
  };

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

/* =========================================================
   Favorites — expand a category into a carousel
   ========================================================= */
function setupFavorites() {
  const tiles = document.querySelectorAll('.fav-tile');
  const panel = document.getElementById('fav-panel');
  const title = document.getElementById('fav-panel-title');
  const closeBtn = document.querySelector('.fav-close');
  if (!tiles.length || !panel) return;

  const carousels = panel.querySelectorAll('.carousel');

  const closeAll = () => {
    tiles.forEach(t => t.setAttribute('aria-expanded', 'false'));
    carousels.forEach(c => (c.hidden = true));
    panel.hidden = true;
  };

  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const category = tile.dataset.category;
      const isActive = tile.getAttribute('aria-expanded') === 'true';
      closeAll();
      if (isActive) return;

      tile.setAttribute('aria-expanded', 'true');
      const carousel = panel.querySelector(`.carousel[data-carousel="${category}"]`);
      if (carousel) carousel.hidden = false;
      if (title) title.textContent = tile.querySelector('span').textContent;
      panel.hidden = false;
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeAll);

  /* Carousel prev/next — scroll by one slide */
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slide = carousel.querySelector('.slide');
    if (!track || !slide) return;
    const step = () => slide.getBoundingClientRect().width + 16; /* slide + gap */
    const prev = carousel.querySelector('.carousel-nav.prev');
    const next = carousel.querySelector('.carousel-nav.next');
    if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  });
}

/* =========================================================
   Project "Read more" toggle
   ========================================================= */
function setupReadMore() {
  const btn = document.getElementById('pihp-toggle');
  const more = document.getElementById('pihp-more');
  if (!btn || !more) return;

  btn.addEventListener('click', () => {
    const open = more.hidden;
    more.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Read less' : 'Read more';
  });
}

/* =========================================================
   Scroll reveal
   ========================================================= */
function setupReveals() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window) ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  els.forEach(el => io.observe(el));
}

/* =========================================================
   Boot
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  setupNav();
  setupFavorites();
  setupReadMore();
  setupReveals();

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
});
