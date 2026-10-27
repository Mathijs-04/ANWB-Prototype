import { TEMPLATES, IMAGES, IMAGE_POOL, photo, toISODate } from '../data.js';
import * as store from '../store.js';
import { esc, icon, $, $$, fadeImages, toast, celebrate, dayDiff } from '../ui.js';
import { activityCard } from '../components.js';

function inDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

function nextWeekday(weekday) {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() !== weekday) d.setDate(d.getDate() + 1);
  return toISODate(d);
}

const QUICK_DATES = [
  { label: 'Morgen', value: () => inDays(1) },
  { label: 'Vrijdag', value: () => nextWeekday(5) },
  { label: 'Zaterdag', value: () => nextWeekday(6) },
  { label: 'Over een week', value: () => inDays(7) },
];

/** Draft state for the form; shared by render and mount. */
let draft;

function fromTemplate(t) {
  return {
    template: t.id,
    title: t.title,
    category: t.category,
    time: t.time,
    location: t.location,
    description: t.description,
    max: t.max ?? 0,
    transport: t.transport,
    image: t.id,
  };
}

function initialDraft(query) {
  const source = query.get('van') && store.get(query.get('van'));
  if (source) {
    const t = TEMPLATES.find((x) => x.id === source.kind);
    return {
      template: t?.id || 'anders',
      title: source.title.replace(/^(Het grote |Samen naar de )/, ''),
      category: source.category,
      time: source.time,
      location: source.location,
      description: t?.description || source.description,
      max: source.max ?? 0,
      transport: Boolean(source.transport),
      image: IMAGES[source.kind] ? source.kind : store.imageOf(source),
      date: inDays(14),
      basedOn: source.title,
    };
  }
  return { ...fromTemplate(TEMPLATES[0]), date: inDays(7) };
}

const toActivity = (d) => ({
  kind: d.template,
  category: d.category,
  title: d.title.trim(),
  date: d.date,
  time: d.time,
  location: d.location.trim(),
  description: d.description.trim(),
  max: d.max > 0 ? d.max : null,
  transport: d.transport,
  image: IMAGES[d.image] ? IMAGES[d.image][0] : d.image,
});

function previewCard() {
  return activityCard({ ...toActivity(draft), id: 'preview', attendees: ['me'], isPast: false }, 0, { preview: true });
}

export function render({ query }) {
  draft = initialDraft(query);
  const user = store.getUser();

  return `
    <div class="container">
      <a class="back-link" href="#/">${icon('arrow-left')} Alle activiteiten</a>
      <div class="page-head" style="padding-top:24px;margin-bottom:48px">
        <h1>Organiseer een activiteit</h1>
        <p>${draft.basedOn ? `Op basis van <b>${esc(draft.basedOn)}</b>. Pas aan wat je wilt en plaats hem.` : 'Kies wat je wilt doen. Wij vullen de rest alvast in.'}</p>
      </div>

      <div class="create">
        <form class="create__form" novalidate data-create>
          <section class="create__step">
            <h2 class="create__step-title"><i>1</i> Wat gaan we doen?</h2>
            <div class="templates">
              ${TEMPLATES.map((t) => `
                <button class="template" type="button" data-template="${t.id}" aria-pressed="${draft.template === t.id}">
                  <img src="${photo(IMAGES[t.id]?.[0] || IMAGES.hero[0], 320)}" alt="" loading="lazy" decoding="async">
                  <span>${esc(t.label)}</span>
                </button>`).join('')}
              <button class="template template--other" type="button" data-template="anders" aria-pressed="${draft.template === 'anders'}">
                <span class="icon-wrap">${icon('plus')}</span>
                <span>Iets anders</span>
              </button>
            </div>
          </section>

          <section class="create__step">
            <h2 class="create__step-title"><i>2</i> Wanneer en waar?</h2>
            <div class="form-grid">
              ${user ? '' : `
                <label class="field field--full">
                  <span class="field__label">Jouw naam</span>
                  <input class="input" name="organizer" required autocomplete="name" placeholder="Voor- en achternaam">
                </label>`}
              <label class="field field--full">
                <span class="field__label">Titel</span>
                <input class="input" name="title" required maxlength="70" value="${esc(draft.title)}">
              </label>
              <div class="field">
                <label class="field__label" for="f-date">Datum</label>
                <input class="input" id="f-date" type="date" name="date" required min="${inDays(0)}" value="${draft.date}">
                <div class="quick-dates">${QUICK_DATES.map((q) => `<button class="chip" type="button" data-date="${q.value()}" aria-pressed="${q.value() === draft.date}">${q.label}</button>`).join('')}</div>
              </div>
              <label class="field">
                <span class="field__label">Tijd</span>
                <input class="input" type="time" name="time" required value="${draft.time}">
              </label>
              <label class="field field--full">
                <span class="field__label">Locatie</span>
                <input class="input" name="location" required value="${esc(draft.location)}" placeholder="Bijv. Hoofdkantoor Den Haag">
              </label>
            </div>
          </section>

          <section class="create__step">
            <h2 class="create__step-title"><i>3</i> Nog iets kwijt? <span class="field__hint" style="font-size:1rem">Optioneel</span></h2>
            <div class="form-grid">
              <label class="field field--full">
                <span class="field__label">Omschrijving</span>
                <textarea class="textarea" name="description" rows="3" placeholder="Wat gaan jullie doen? Wat moet je meenemen?">${esc(draft.description)}</textarea>
              </label>
              <div class="field">
                <span class="field__label">Maximaal aantal deelnemers</span>
                <div class="stepper" data-stepper>
                  <button type="button" data-step="-1" aria-label="Minder">${icon('minus')}</button>
                  <output name="max">${maxLabel(draft.max)}</output>
                  <button type="button" data-step="1" aria-label="Meer">${icon('plus')}</button>
                </div>
              </div>
              <div class="field" style="align-self:end;padding-bottom:6px">
                <label class="switch">
                  <input type="checkbox" name="transport" ${draft.transport ? 'checked' : ''}>
                  <span class="switch__track"></span>
                  <span class="switch__text"><strong>Samen reizen</strong><span>Collega’s kunnen carpoolen</span></span>
                </label>
              </div>
            </div>
          </section>

          <div class="form-actions">
            <button class="btn btn--yellow btn--lg" type="submit">Plaats activiteit ${icon('arrow')}</button>
            <small>Je wordt zelf automatisch aangemeld.</small>
          </div>
        </form>

        <aside class="create__preview">
          <div class="create__preview-label">
            <span>Zo ziet je kaart eruit</span>
            <button class="btn btn--ghost btn--sm" type="button" data-shuffle>${icon('image', 'icon--sm')} Andere foto</button>
          </div>
          <div class="create__preview-panel" data-preview>${previewCard()}</div>
        </aside>
      </div>
    </div>`;
}

const maxLabel = (n) => (n > 0 ? `${n} personen` : 'Geen max');

export function mount(root, { navigate }) {
  const form = $('[data-create]', root);
  const preview = $('[data-preview]', root);
  const updatePreview = () => { preview.innerHTML = previewCard(); fadeImages(preview); };

  const fill = () => {
    form.title.value = draft.title;
    form.time.value = draft.time;
    form.location.value = draft.location;
    form.description.value = draft.description;
    form.transport.checked = draft.transport;
    $('output[name="max"]', form).value = maxLabel(draft.max);
    $$('[data-template]', root).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.template === draft.template)));
    updatePreview();
  };

  root.addEventListener('click', (e) => {
    const tpl = e.target.closest('[data-template]');
    if (tpl) {
      const t = TEMPLATES.find((x) => x.id === tpl.dataset.template);
      draft = t
        ? { ...draft, ...fromTemplate(t) }
        : { ...draft, template: 'anders', title: '', category: 'gezellig', description: '', image: 'hero', max: 0, transport: false, location: 'Hoofdkantoor Den Haag' };
      fill();
      if (!t) form.title.focus();
      return;
    }

    const quick = e.target.closest('[data-date]');
    if (quick) {
      draft.date = quick.dataset.date;
      form.date.value = draft.date;
      syncDateChips();
      updatePreview();
      return;
    }

    const step = e.target.closest('[data-step]');
    if (step) {
      draft.max = Math.max(0, Math.min(99, draft.max + (draft.max === 0 && +step.dataset.step > 0 ? 2 : +step.dataset.step)));
      $('output[name="max"]', form).value = maxLabel(draft.max);
      updatePreview();
      return;
    }

    if (e.target.closest('[data-shuffle]')) {
      const pool = IMAGE_POOL.filter((k) => k !== draft.image);
      const current = IMAGE_POOL.indexOf(draft.image);
      draft.image = current >= 0 ? IMAGE_POOL[(current + 1) % IMAGE_POOL.length] : pool[0];
      updatePreview();
    }
  });

  const syncDateChips = () => $$('[data-date]', root).forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.date === draft.date)));

  form.addEventListener('input', (e) => {
    const { name, value, checked } = e.target;
    if (name === 'transport') draft.transport = checked;
    else if (name in draft) draft[name] = value;
    if (name === 'date') syncDateChips();
    if (['title', 'date', 'time', 'location'].includes(name)) e.target.removeAttribute('aria-invalid');
    updatePreview();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const required = $$('[required]', form);
    const invalid = required.filter((el) => !el.value.trim() || (el.name === 'date' && dayDiff(el.value) < 0));
    required.forEach((el) => el.toggleAttribute('aria-invalid', invalid.includes(el)));
    if (invalid.length) {
      invalid[0].focus();
      toast(invalid[0].name === 'date' ? 'Kies een datum vanaf vandaag.' : 'Vul de rode velden nog even in.', { icon: 'x' });
      return;
    }
    const id = store.create(toActivity(draft));
    if (form.organizer) {
      store.setUser({ name: form.organizer.value, team: '' });
      document.dispatchEvent(new CustomEvent('user-changed'));
    }
    navigate(`/activiteit/${id}`);
    requestAnimationFrame(() => setTimeout(() => {
      celebrate($('[data-leave]'));
      toast('Je activiteit staat online! Deel de link met je collega’s.', { icon: 'sparkle', duration: 5000 });
    }, 450));
  });

  fadeImages(root);
}
