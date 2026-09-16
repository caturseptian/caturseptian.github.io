// ── HTMX config: don't let a fetched fragment's <title> hijack the tab title ──
if (window.htmx) htmx.config.ignoreTitle = true;

// ── Mobile menu ───────────────────────────────────────────────────
const mobBtn = document.getElementById('mob-btn');
const mmenu = document.getElementById('mmenu');
const mobOpen = document.getElementById('mob-open');
const mobClose = document.getElementById('mob-close');

function toggleMenu(open) {
  mmenu.classList.toggle('open', open);
  mobOpen.classList.toggle('hidden', open);
  mobClose.classList.toggle('hidden', !open);
  mobBtn.setAttribute('aria-expanded', String(open));
}
mobBtn.addEventListener('click', e => { e.stopPropagation(); toggleMenu(!mmenu.classList.contains('open')); });
mmenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
document.addEventListener('click', e => { if (!mmenu.contains(e.target) && e.target !== mobBtn) toggleMenu(false); });

// ── Scroll effects ────────────────────────────────────────────────
const siteHeader = document.getElementById('site-header');
const btt = document.getElementById('btt');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  siteHeader.classList.toggle('nav-scrolled', y > 36);
  btt.classList.toggle('show', y > 400);
}, { passive: true });

// ── Active nav links ──────────────────────────────────────────────
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('#navbar a[href^="#"]');

let currentSectionId = sections[0]?.id;

// The last section can't reach the trigger band above once the page is
// scrolled to its max, so force it active whenever we hit the bottom.
// Both the observer and the scroll listener funnel through this so
// whichever fires last still lands on the correct link.
function applyActiveLink() {
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  const activeId = atBottom ? sections[sections.length - 1].id : currentSectionId;
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + activeId));
}

sections.forEach(s =>
  new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) currentSectionId = e.target.id; });
    applyActiveLink();
  }, { rootMargin: '-15% 0px -75% 0px', threshold: 0 }).observe(s)
);

window.addEventListener('scroll', applyActiveLink, { passive: true });

// ── Reveal on scroll ──────────────────────────────────────────────
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
} else {
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revObs.unobserve(e.target); } });
  }, { threshold: 0.07, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));
}

// ── Generic expand/collapse (used by the badge-criteria panel) ────
document.querySelectorAll('[data-toggle]').forEach(btnEl => {
  const target = document.querySelector(btnEl.dataset.toggle);
  if (!target) return;
  btnEl.addEventListener('click', () => {
    const hidden = target.classList.toggle('hidden');
    btnEl.setAttribute('aria-expanded', String(!hidden));
  });
});
