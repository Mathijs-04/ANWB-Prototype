// Router and app shell.
import * as overview from './views/overview.js';
import * as detail from './views/detail.js';
import * as create from './views/create.js';
import * as archive from './views/archive.js';
import * as store from './store.js';
import { $, $$, fadeImages, initials, toast } from './ui.js';
import { ensureUser } from './components.js';

const main = $('#main');
const header = $('.site-header');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const scrollPositions = new Map();

const ROUTES = [
  { name: 'overview', pattern: /^\/?$/, view: overview, title: 'Activiteiten' },
  { name: 'detail', pattern: /^\/activiteit\/([^/?]+)$/, view: detail, params: (m) => ({ id: decodeURIComponent(m[1]) }) },
  { name: 'create', pattern: /^\/nieuw$/, view: create, title: 'Organiseer een activiteit' },
  { name: 'archive', pattern: /^\/terugblik$/, view: archive, title: 'Terugblik' },
];

let current = null; // { route, path, params }

function parseHash() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, qs = ''] = raw.split('?');
  for (const route of ROUTES) {
    const m = path.match(route.pattern);
    if (m) return { route, path, params: { ...(route.params?.(m) || {}), query: new URLSearchParams(qs) } };
  }
  return { route: ROUTES[0], path: '/', params: { query: new URLSearchParams() } };
}

/** Render the current route into a fresh wrapper, so listeners never pile up. */
function renderView(match, { refresh = false } = {}) {
  const { route, params } = match;
  const wrapper = document.createElement('div');
  wrapper.className = refresh ? 'view is-refresh' : 'view';
  wrapper.innerHTML = route.view.render(params);
  main.replaceChildren(wrapper);
  route.view.mount(wrapper, { ...params, refresh: refreshView, navigate: (to) => { location.hash = `#${to}`; } });
  fadeImages(wrapper);

  document.body.dataset.route = route.name;
  $$('[data-nav]').forEach((a) => a.classList.toggle('is-active', a.dataset.nav === route.name || (route.name === 'detail' && a.dataset.nav === 'overview' && !store.get(params.id)?.isPast) || (route.name === 'detail' && a.dataset.nav === 'archive' && store.get(params.id)?.isPast)));
  const activity = route.name === 'detail' && store.get(params.id);
  document.title = `${activity ? activity.title : route.title} · ANWB Activities`;
}

/** Re-render the current view in place (after an action), keeping scroll position. */
function refreshView() {
  const y = scrollY;
  renderView(current, { refresh: true });
  scrollTo(0, y);
}

function onRouteChange() {
  const next = parseHash();
  if (current && next.path === current.path && next.params.query.toString() === current.params.query.toString()) return;

  const prev = current;
  if (prev) scrollPositions.set(prev.path, scrollY);

  // Shared-element morph between a card image and the detail hero image.
  const goingToDetail = next.route.name === 'detail';
  const comingFromDetail = prev?.route.name === 'detail';
  const morphId = goingToDetail ? next.params.id : comingFromDetail ? prev.params.id : null;
  if (morphId) {
    const from = goingToDetail ? cardImage(morphId) : $('[data-hero-img]', main);
    if (from && inViewport(from)) from.style.viewTransitionName = 'hero-img';
  }

  const update = () => {
    current = next;
    renderView(next);
    const restore = !goingToDetail && next.route.name !== 'create' && scrollPositions.has(next.path) && comingFromDetail;
    scrollTo({ top: restore ? scrollPositions.get(next.path) : 0, behavior: 'instant' });
    if (morphId) {
      const to = goingToDetail ? $('[data-hero-img]', main) : cardImage(morphId);
      if (to && inViewport(to)) to.style.viewTransitionName = 'hero-img';
    }
  };

  if (!prev || !document.startViewTransition || reducedMotion.matches) {
    update();
    if (prev) main.firstElementChild?.classList.add('page-enter');
    return;
  }
  const transition = document.startViewTransition(update);
  transition.finished.finally(() => $$('[style*="view-transition-name"]').forEach((el) => { el.style.viewTransitionName = ''; }));
}

const cardImage = (id) => $(`[data-id="${CSS.escape(id)}"] [data-card-img]`, main);

function inViewport(el) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < innerHeight && r.width > 0;
}

/* ---------- Header ---------- */

function renderProfile() {
  const user = store.getUser();
  const avatarEl = $('[data-profile-avatar]');
  const label = $('[data-profile-label]');
  if (user) {
    avatarEl.className = 'profile-btn__avatar avatar avatar--me';
    avatarEl.style.cssText = '--c: var(--yellow); color: var(--blue)';
    avatarEl.textContent = initials(user.name);
    label.textContent = `Hoi ${user.name.split(' ')[0]}`;
  } else {
    avatarEl.className = 'profile-btn__avatar';
    avatarEl.style.cssText = '';
    avatarEl.textContent = '';
    label.textContent = 'Wie ben jij?';
  }
}

document.addEventListener('click', async (e) => {
  if (e.target.closest('[data-action="profile"]')) {
    await ensureUser({ force: true, reason: 'Je naam is alleen zichtbaar voor collega’s in deze demo.' });
    return;
  }
  if (e.target.closest('[data-action="reset"]')) {
    store.reset();
    renderProfile();
    renderView(current);
    scrollTo({ top: 0, behavior: 'smooth' });
    toast('Demo is teruggezet naar de beginsituatie.', { icon: 'refresh' });
  }
});

document.addEventListener('user-changed', () => {
  renderProfile();
  // The create form keeps its own draft; re-rendering it would reset the user's input.
  if (current && current.route.name !== 'create') refreshView();
});

addEventListener('content-rendered', () => fadeImages(main));
addEventListener('scroll', () => header.classList.toggle('is-scrolled', scrollY > 8), { passive: true });
addEventListener('hashchange', onRouteChange);

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
renderProfile();
onRouteChange();

// Escape hatch for console debugging during demos.
window.anwb = { store };
