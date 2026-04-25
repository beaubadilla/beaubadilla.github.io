'use strict';

const S3 = 'https://beaujb-website.s3.amazonaws.com';

const CATEGORIES = ['movies', 'shows', 'sports', 'food', 'music', 'games', 'travel', 'anime'];

const TECH_STACK_IDS = [
  'javascript-img', 'vue-img', 'vuetify-img', 'html5-img', 'css3-img', 'jest-img',
  'express-img', 'python-img',
  'firebase-img', 'scylladb-img', 'sqlite-img',
  'linux-img', 'windows-img',
  'aws-img', 'nodejs-img', 'github-img', 'git-img', 'heroku-img',
];

let techStackAnimating = false;

/* =========================================================
   Navigation toggle
   ========================================================= */
function toggleNav() {
  document.getElementById('nav').classList.toggle('is-open');
}

/* =========================================================
   Favorites slider
   ========================================================= */
function displaySlider(tile) {
  const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const category = tile.dataset.category;
  const slider = document.getElementById(`${category}-slider`);
  const favGrid = document.getElementById('favorites');
  const isOpen = favGrid.dataset.activeSlider === category;

  if (isOpen) {
    /* Close the open slider */
    slider.style.display = 'none';
    CATEGORIES.forEach(c => {
      const el = document.getElementById(c);
      el.style.display = 'flex';
      el.style.gridArea = '';
    });
    favGrid.dataset.activeSlider = '';
    tile.classList.remove('uk-animation-scale-up');
    tile.classList.add('uk-animation-scale-down');
  } else {
    /* Close any previously open slider */
    if (favGrid.dataset.activeSlider) {
      const prev = favGrid.dataset.activeSlider;
      document.getElementById(`${prev}-slider`).style.display = 'none';
      CATEGORIES.forEach(c => {
        const el = document.getElementById(c);
        el.style.display = 'flex';
        el.style.gridArea = '';
      });
    }

    /* Open this slider */
    const row = tile.dataset.row;
    const col = tile.dataset.col;

    if (vw > 550) {
      tile.style.gridArea = `${row} / ${col} / span 2 / span 1`;
      slider.style.gridArea = `${row} / ${parseInt(col) < 4 ? parseInt(col) + 1 : parseInt(col) - 1} / span 2 / span 3`;
      /* Rearrange remaining tiles out of the way */
      CATEGORIES.filter(c => c !== category).forEach(c => {
        document.getElementById(c).style.display = 'none';
      });
      slider.style.gridArea = `${row} / 1 / span 2 / span 4`;
      tile.style.gridArea = '';
    } else {
      slider.style.gridArea = '2 / 1 / span 1 / span 4';
    }

    CATEGORIES.filter(c => c !== category).forEach(c => {
      document.getElementById(c).style.display = 'none';
    });

    slider.style.display = 'block';
    tile.style.display = 'flex';
    tile.classList.remove('uk-animation-scale-down');
    tile.classList.add('uk-animation-scale-up');
    favGrid.dataset.activeSlider = category;
  }
}

/* =========================================================
   Project "Read More"
   ========================================================= */
function showMoreProjectInfo() {
  const info = document.getElementById('pihp-info-1');
  const btn  = document.getElementById('read-more-btn');
  const hidden = info.style.display === 'none' || info.style.display === '';
  info.style.display = hidden ? 'block' : 'none';
  btn.textContent    = hidden ? 'Read Less' : 'Read More';
}

/* =========================================================
   Tech stack tooltip stagger
   ========================================================= */
function showAllTStackTooltips() {
  if (techStackAnimating) return;
  techStackAnimating = true;
  const STEP = 500;
  TECH_STACK_IDS.forEach((id, i) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) UIkit.tooltip(el).show();
    }, STEP * (i + 1));
  });
  setTimeout(() => {
    const last = document.getElementById(TECH_STACK_IDS[TECH_STACK_IDS.length - 1]);
    if (last) UIkit.tooltip(last).hide();
    techStackAnimating = false;
  }, STEP * (TECH_STACK_IDS.length + 1));
}

/* =========================================================
   Wire up all event listeners
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  /* Nav toggle */
  const navBtn = document.getElementById('nav-button');
  if (navBtn) navBtn.addEventListener('click', toggleNav);

  /* Favorites tiles */
  CATEGORIES.forEach(cat => {
    const tile = document.getElementById(cat);
    if (tile) tile.addEventListener('click', () => displaySlider(tile));
  });

  /* Tech stack tooltip stagger on heading hover */
  const tstackHeading = document.getElementById('tech-stack-heading');
  if (tstackHeading) tstackHeading.addEventListener('mouseenter', showAllTStackTooltips);

  /* Read More button */
  const readMoreBtn = document.getElementById('read-more-btn');
  if (readMoreBtn) readMoreBtn.addEventListener('click', showMoreProjectInfo);
});
