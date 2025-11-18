
(function () {
  const cards = document.querySelectorAll('.card-neplan-cards');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view-neplan-cards');
      } else {
        e.target.classList.remove('in-view-neplan-cards'); // replay when scrolling back
      }
    });
  }, { threshold: 0.18 });
  cards.forEach(card => io.observe(card));
})();

(function () {
  const rows = document.querySelectorAll('.row-neplan-description');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      e.target.classList.toggle('in-view-neplan-description', e.isIntersecting);
    });
  }, { threshold: 0.15 });
  rows.forEach(r => io.observe(r));
})();

// Tiny JS to slide and update progress
(function () {
  const rail = document.getElementById('rail-neplan-testimonials');
  const prev = document.querySelector('.neplan-testimonials .prev') || document.querySelector('.prev');
  const next = document.querySelector('.neplan-testimonials .next') || document.querySelector('.next');
  const bar = document.querySelector('.bar-neplan-testimonials');

  function slide(dir = 1) {
    const card = rail.querySelector('.card-neplan-testimonials');
    const gap = parseInt(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap || 24, 10);
    const step = (card?.offsetWidth || 520) + gap;
    rail.scrollBy({ left: dir * step, behavior: 'smooth' });
  }
  function updateProgress() {
    const max = rail.scrollWidth - rail.clientWidth;
    const pct = max ? rail.scrollLeft / max : 0;
    bar.style.transform = `scaleX(${pct})`;
  }
  next.addEventListener('click', () => slide(1));
  prev.addEventListener('click', () => slide(-1));
  rail.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('load', updateProgress);
})();

/* Infinite carousel + visible progress bar */
(function () {
  const rail = document.getElementById('rail-neplan-testimonials');
  const prev = document.querySelector('.nav-neplan-testimonials.prev');
  const next = document.querySelector('.nav-neplan-testimonials.next');
  const bar = document.querySelector('.bar-neplan-testimonials');
  if (!rail || !prev || !next || !bar) return;

  // step size = card width + column gap
  const gap = () => parseInt(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap || 24, 10);
  const step = () => (rail.querySelector('.card-neplan-testimonials')?.offsetWidth || 520) + gap();

  // clone ends for seamless wrap
  const originals = Array.from(rail.children);
  if (originals.length < 1) return;
  const firstClone = originals[0].cloneNode(true);
  const lastClone = originals[originals.length - 1].cloneNode(true);
  rail.insertBefore(lastClone, rail.firstChild);
  rail.appendChild(firstClone);

  let index = 1; // start on the real first item

  function goto(i, behavior = 'auto') { rail.scrollTo({ left: step() * i, behavior }); }
  function init() { goto(index, 'auto'); updateProgress(); }

  // progress: map scrollLeft in [s..s*N] → [0..1]
  function updateProgress() {
    const s = step();
    const min = s * 1;                          // first real
    const max = s * originals.length;           // last real
    let pos = rail.scrollLeft;
    let pct = (pos - min) / (max - min);
    if (pct < 0) pct = 0;
    if (pct > 1) pct = 1;
    bar.style.transform = `scaleX(${pct})`;
  }

  // arrows
  function move(dir) { index += dir; rail.scrollTo({ left: step() * index, behavior: 'smooth' }); }
  next.addEventListener('click', () => move(1));
  prev.addEventListener('click', () => move(-1));

  // wrap + progress sync
  let ticking = false;
  rail.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const s = step();
      index = Math.round(rail.scrollLeft / s);

      // wrap if at clones
      if (index === 0) { index = originals.length; goto(index); }
      if (index === originals.length + 1) { index = 1; goto(index); }

      updateProgress();
      ticking = false;
    });
  });

  window.addEventListener('load', init);
  window.addEventListener('resize', () => { goto(index); updateProgress(); });
})();

/* IntersectionObserver reveal — shows elements when they enter the viewport,
           hides them again when they leave (works on scroll down and up). */
(function () {
  const els = document.querySelectorAll('.reveal-mobility');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(el => el.classList.add('is-visible-mobility'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible-mobility');
      } else {
        entry.target.classList.remove('is-visible-mobility');
      }
    });
  }, { threshold: 0.18 });

  els.forEach(el => io.observe(el));
})();/* IntersectionObserver reveal — shows elements when they enter the viewport,
           hides them again when they leave (works on scroll down and up). */
(function () {
  const els = document.querySelectorAll('.reveal-mobility');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(el => el.classList.add('is-visible-mobility'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible-mobility');
      } else {
        entry.target.classList.remove('is-visible-mobility');
      }
    });
  }, { threshold: 0.18 });

  els.forEach(el => io.observe(el));
})();


// reveal
(() => {
  const SELECTOR = '.reveal-left, .reveal-right, .reveal-up, .reveal-down';

  // Apply per-element delay from data attribute if provided
  document.querySelectorAll(SELECTOR).forEach(el => {
    const d = el.getAttribute('data-reveal-delay');
    if (d) el.style.setProperty('--reveal-delay', /^\d+$/.test(d) ? `${d}ms` : d);
  });

  // Auto-stagger children inside a .reveal-group
  document.querySelectorAll('.reveal-group[data-reveal-stagger]').forEach(group => {
    const step = parseInt(group.dataset.revealStagger, 10) || 120; // ms
    let i = 0;
    group.querySelectorAll(SELECTOR).forEach(el => {
      el.style.setProperty('--reveal-delay', `${i * step}ms`);
      i++;
    });
  });

  // Observe and toggle visibility (replays when scrolling back unless .reveal-once)
  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) target.classList.add('is-visible');
      else if (!target.classList.contains('reveal-once'))
        target.classList.remove('is-visible');
    });
  }, { threshold: 0.18 });

  document.querySelectorAll(SELECTOR).forEach(el => io.observe(el));
})();



(function () {
  const grid = document.getElementById('grid-neplan-card-with-animation');
  if (!grid) return;
  const cards = grid.querySelectorAll('.card-neplan-card-with-animation');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('show-neplan-card-with-animation');
      } else {
        // remove so it replays when scrolling back (LIFO feel)
        e.target.classList.remove('show-neplan-card-with-animation');
      }
    });
  }, { threshold: 0.18 });

  cards.forEach(c => io.observe(c));
})();
