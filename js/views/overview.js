import { CATEGORIES, IMAGES } from '../data.js';
import { upcoming, past, isJoined } from '../store.js';
import { esc, icon, img, $, $$, dayDiff, dateLabel, plural } from '../ui.js';
import { activityCard, pastCard, emptyState } from '../components.js';

// Filters survive navigating to a detail page and back.
const filters = { category: 'all', q: '', when: 'all', mine: false };

const WHEN = [
  { id: 'all', label: 'Alle datums', days: Infinity },
  { id: 'week', label: 'Komende 7 dagen', days: 7 },
  { id: 'two', label: 'Komende 2 weken', days: 14 },
  { id: 'month', label: 'Komende maand', days: 31 },
];

function matches(a, f = filters) {
  if (f.category !== 'all' && a.category !== f.category) return false;
  if (f.mine && !isJoined(a)) return false;
  const days = WHEN.find((w) => w.id === f.when)?.days ?? Infinity;
  if (dayDiff(a.date) > days) return false;
  if (f.q) {
    const hay = `${a.title} ${a.location} ${a.description}`.toLowerCase();
    if (!f.q.toLowerCase().split(/\s+/).every((t) => hay.includes(t))) return false;
  }
  return true;
}

const isFiltered = () => filters.category !== 'all' || filters.q || filters.when !== 'all' || filters.mine;

export function render() {
  const list = upcoming();
  const thisWeek = list.filter((a) => dayDiff(a.date) <= 7);
  const people = new Set(thisWeek.flatMap((a) => a.attendees)).size;
  const mine = list.filter(isJoined);
  const next = list[0];
  const recent = past().slice(0, 4);

  const countFor = (cat) => list.filter((a) => matches(a, { ...filters, category: cat })).length;

  return `
    <section class="hero">
      <div class="container">
        <div class="hero__grid">
          <div>
            <h1 class="hero__title">Samen eropuit met <em>collega’s</em></h1>
            <p class="hero__lead">Van boswandeling tot borrel. Doe mee of organiseer zelf iets.</p>
            <div class="hero__actions">
              <button class="btn btn--primary btn--lg" type="button" data-scroll="activiteiten">Bekijk activiteiten ${icon('arrow')}</button>
              <a class="btn btn--outline btn--lg" href="#/nieuw">${icon('plus')} Organiseer</a>
            </div>
          </div>
          <div class="hero__visual">
            ${next ? `
              <a class="hero__badge" href="#/activiteit/${esc(next.id)}" data-id="${esc(next.id)}">
                <small>Eerstvolgende</small>
                <strong>${esc(next.title)}</strong>
                <span class="arrow-link">${esc(dateLabel(next.date))}, ${esc(next.time)} ${icon('arrow')}</span>
              </a>` : ''}
            <div class="slant">${img(IMAGES.hero[0], { alt: 'Collega’s lachen samen buiten', sizes: '(max-width: 860px) 100vw, 55vw', eager: true })}</div>
          </div>
        </div>

        <div class="quick-cards">
          <button class="quick-card quick-card--blue" type="button" data-quick="week">
            <span class="quick-card__eyebrow">${icon('calendar')} Deze week</span>
            <span class="quick-card__text">Er staan <b>${plural(thisWeek.length, 'activiteit', 'activiteiten')}</b> gepland met <b>${people} collega’s</b></span>
            <span class="quick-card__foot">${icon('arrow')}</span>
          </button>
          <button class="quick-card" type="button" data-quick="mine">
            <span class="quick-card__eyebrow">${icon('check')} Jouw agenda</span>
            <span class="quick-card__text">${mine.length
              ? `Je doet mee aan <b>${plural(mine.length, 'activiteit', 'activiteiten')}</b>. De eerste is <b>${esc(dateLabel(mine[0].date).toLowerCase())}</b>.`
              : 'Je doet nog nergens aan mee. <b>Kies iets leuks</b> uit de agenda.'}</span>
            <span class="quick-card__foot">${icon('arrow')}</span>
          </button>
          ${recent[0] ? `
            <a class="quick-card" href="#/activiteit/${esc(recent[0].id)}">
              <span class="quick-card__eyebrow">${icon('camera')} Terugblik</span>
              <span class="quick-card__text">Bekijk de foto’s van <b>${esc(recent[0].title)}</b></span>
              <span class="quick-card__foot">${icon('arrow')}</span>
            </a>` : ''}
        </div>
      </div>
    </section>

    <section class="section" id="activiteiten">
      <div class="container">
        <div class="section__head">
          <div>
            <h2 class="section__title">Wat staat er gepland?</h2>
            <p class="section__sub">Kies iets uit en doe mee. Of organiseer zelf iets.</p>
          </div>
        </div>

        <div class="filters" role="search">
          <div class="filters__chips" role="group" aria-label="Filter op soort">
            <button class="chip" type="button" data-cat="all" aria-pressed="${filters.category === 'all'}">Alles <span class="chip__count" data-count="all">${countFor('all')}</span></button>
            ${CATEGORIES.map((c) => `<button class="chip" type="button" data-cat="${c.id}" aria-pressed="${filters.category === c.id}">${c.label} <span class="chip__count" data-count="${c.id}">${countFor(c.id)}</span></button>`).join('')}
          </div>
          <div class="filters__tools">
            <label class="search-input">
              <span class="visually-hidden">Zoeken</span>
              ${icon('search')}
              <input class="input" type="search" name="q" placeholder="Zoek op activiteit of plek…" value="${esc(filters.q)}" autocomplete="off">
            </label>
            <label>
              <span class="visually-hidden">Wanneer</span>
              <select class="select" name="when">${WHEN.map((w) => `<option value="${w.id}" ${filters.when === w.id ? 'selected' : ''}>${w.label}</option>`).join('')}</select>
            </label>
            <label class="switch">
              <input type="checkbox" name="mine" ${filters.mine ? 'checked' : ''}>
              <span class="switch__track"></span>
              <span class="switch__text"><strong>Waar ik aan meedoe</strong></span>
            </label>
          </div>
          <div class="filters__meta" aria-live="polite"></div>
        </div>

        <div class="card-grid" data-grid></div>
      </div>
    </section>

    ${recent.length ? `
      <section class="past-band">
        <div class="container">
          <div class="section__head">
            <div>
              <span class="eyebrow" style="color: var(--yellow)">Terugblik</span>
              <h2 class="section__title">Zo was het</h2>
              <p class="section__sub">Foto’s en reacties van eerdere activiteiten.</p>
            </div>
            <a class="arrow-link" href="#/terugblik">Alles bekijken ${icon('arrow')}</a>
          </div>
          <div class="past-grid">${recent.map((a, i) => pastCard(a, i)).join('')}</div>
        </div>
      </section>` : ''}
  `;
}

function renderGrid(root, { animate = true } = {}) {
  const list = upcoming().filter((a) => matches(a));
  const grid = $('[data-grid]', root);
  grid.innerHTML = list.length
    ? list.map((a, i) => activityCard(a, animate ? i : 0)).join('')
    : emptyState({
      title: filters.mine && !filters.q ? 'Je doet nog nergens aan mee' : 'Niks gevonden',
      text: filters.mine && !filters.q ? 'Kies een activiteit uit de agenda, of organiseer zelf iets.' : 'Probeer een ander filter. Of organiseer het zelf.',
      action: `<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="btn btn--outline" type="button" data-clear>Wis filters</button><a class="btn btn--primary" href="#/nieuw">${icon('plus')} Organiseer</a></div>`,
    });

  $('.filters__meta', root).innerHTML = `
    <span>${plural(list.length, 'activiteit', 'activiteiten')}</span>
    ${isFiltered() ? '<button class="link-btn" type="button" data-clear>Wis filters</button>' : ''}`;

  $$('[data-cat]', root).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === filters.category)));
  const all = upcoming();
  $$('[data-count]', root).forEach((el) => {
    el.textContent = all.filter((a) => matches(a, { ...filters, category: el.dataset.count })).length;
  });
  window.dispatchEvent(new Event('content-rendered'));
}

export function mount(root) {
  renderGrid(root);
  const section = $('#activiteiten', root);
  const scrollToList = () => section.scrollIntoView({ behavior: 'smooth', block: 'start' });

  root.addEventListener('click', (e) => {
    const cat = e.target.closest('[data-cat]');
    if (cat) { filters.category = cat.dataset.cat; renderGrid(root); return; }

    if (e.target.closest('[data-clear]')) {
      Object.assign(filters, { category: 'all', q: '', when: 'all', mine: false });
      $('[name="q"]', root).value = '';
      $('[name="when"]', root).value = 'all';
      $('[name="mine"]', root).checked = false;
      renderGrid(root);
      return;
    }

    if (e.target.closest('[data-scroll]')) { scrollToList(); return; }

    const quick = e.target.closest('[data-quick]');
    if (quick) {
      Object.assign(filters, { category: 'all', q: '', when: quick.dataset.quick === 'week' ? 'week' : 'all', mine: quick.dataset.quick === 'mine' });
      $('[name="q"]', root).value = '';
      $('[name="when"]', root).value = filters.when;
      $('[name="mine"]', root).checked = filters.mine;
      renderGrid(root);
      scrollToList();
    }
  });

  let t;
  $('[name="q"]', root).addEventListener('input', (e) => {
    clearTimeout(t);
    t = setTimeout(() => { filters.q = e.target.value.trim(); renderGrid(root, { animate: false }); }, 120);
  });
  $('[name="when"]', root).addEventListener('change', (e) => { filters.when = e.target.value; renderGrid(root); });
  $('[name="mine"]', root).addEventListener('change', (e) => { filters.mine = e.target.checked; renderGrid(root); });
}
