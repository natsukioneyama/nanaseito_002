/* =========================
   GALLERY (from featured-data.js / portfolio-data.js)
   ========================= */

// featured-data.js decides which projects / images / order (same as the vertical HOME);
// portfolio-data.js supplies titles and image paths (relative to this folder).

const gallery = document.getElementById('gallery');
const navCurrent = document.getElementById('navCurrent');
const mobileCaption = document.getElementById('mobileCaption');

const projectsById = new Map((window.PORTFOLIO_PROJECTS || []).map(p => [p.id, p]));
const featured = (window.FEATURED_PROJECTS || []).map(entry => {
  const project = projectsById.get(entry.id);
  if (!project) { console.warn(`featured-data.js: unknown project id "${entry.id}"`); return null; }
  const order = entry.media || project.media.map((_, i) => i);
  const media = order.map(i => project.media[i]).filter(m => m && m.type !== 'video');
  return media.length ? { project, media } : null;
}).filter(Boolean);

// First card of each project: the caption decision is made from these.
const projectStarts = [];

featured.forEach(({ project, media }, pi) => {
  media.forEach((m, i) => {
    const figure = document.createElement('figure');
    figure.className = 'card';
    figure.dataset.project = pi;

    const img = document.createElement('img');
    img.src = m.full;
    img.width = m.dataW;
    img.height = m.dataH;
    img.alt = m.alt || project.title;
    img.decoding = 'async';
    if (pi > 0) img.loading = 'lazy';

    figure.append(img);
    gallery.append(figure);
    if (i === 0) projectStarts.push(figure);
  });
});


/* =========================
   CURRENT PROJECT CAPTION
   ========================= */

// The caption belongs to the last project whose first image has passed the centre line
// of the gallery viewport (horizontal: its left edge, vertical: its top edge). Deciding
// from the layout on every scroll frame means it is direction-independent, holds while
// browsing images of the same project, and is never empty. DOM is touched only when the
// project actually changes, so there is no flicker.
const HORIZONTAL_MQ = window.matchMedia('(min-width: 900px) and (orientation: landscape)');
let activeProject = -1;

function setActiveProject(i) {
  if (i === activeProject || !featured[i]) return;
  activeProject = i;
  const { title, line1 } = featured[i].project;
  navCurrent.textContent = title;
  // Mobile caption: title / photographer on two lines; no empty line when line1 is blank.
  mobileCaption.replaceChildren(...[title, line1].filter(Boolean).map(text => {
    const line = document.createElement('span');
    line.textContent = text;
    return line;
  }));
}

function projectAtCentre() {
  const horizontal = HORIZONTAL_MQ.matches;
  let line;
  if (horizontal) {
    const rect = gallery.getBoundingClientRect();
    // At the right end the last project may never reach the centre: give it the caption.
    if (gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 2) return projectStarts.length - 1;
    line = rect.left + gallery.clientWidth / 2;
  } else {
    line = window.innerHeight / 2;
  }
  let index = 0;
  projectStarts.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    if ((horizontal ? r.left : r.top) <= line) index = i;
  });
  return index;
}

let captionTicking = false;
function requestCaptionUpdate() {
  if (captionTicking) return;
  captionTicking = true;
  requestAnimationFrame(() => {
    captionTicking = false;
    setActiveProject(projectAtCentre());
  });
}

setActiveProject(0);
gallery.addEventListener('scroll', requestCaptionUpdate, { passive: true });
window.addEventListener('scroll', requestCaptionUpdate, { passive: true });
window.addEventListener('resize', requestCaptionUpdate);
// Lazy images change the layout as they load.
gallery.addEventListener('load', requestCaptionUpdate, true);


/* =========================
   VERTICAL WHEEL -> HORIZONTAL (desktop)
   ========================= */

// A mouse wheel only produces deltaY; map it to the horizontal gallery so it can be
// browsed without a trackpad. Horizontal trackpad gestures keep their native behaviour.
// scroll-snap is suspended while wheeling: with snap active, each small programmatic
// step is pulled back to the nearest card and the gallery cannot advance.
let wheelTimer = 0;
gallery.addEventListener('wheel', (e) => {
  if (!HORIZONTAL_MQ.matches || e.ctrlKey) return;
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
  const delta = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? gallery.clientWidth : 1);
  gallery.classList.add('is-wheeling');
  gallery.scrollLeft += delta;
  e.preventDefault();
  clearTimeout(wheelTimer);
  wheelTimer = setTimeout(() => gallery.classList.remove('is-wheeling'), 200);
}, { passive: false });


/* =========================
   NAV ACTIVE LINK
   ========================= */

(() => {
  const links = document.querySelectorAll('.nav-link[href]');
  const currentPath = location.pathname.split('/').pop();

  links.forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop();

    if (linkPath === currentPath) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();
