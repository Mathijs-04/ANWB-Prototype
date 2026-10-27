// Reusable view fragments.
import { CATEGORIES } from './data.js';
import { imageOf, isJoined, spotsLeft, galleryOf, person, getUser, setUser } from './store.js';
import { esc, icon, img, dateTile, dateLabel, avatarStack, agoLabel, $, fadeImages } from './ui.js';

export const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label || 'Activiteit';

export function spotsText(a) {
  const left = spotsLeft(a);
  if (left == null) return '';
  if (left === 0) return '<span class="spots spots--full">Vol</span>';
  if (left <= 2) return `<span class="spots spots--low">Nog ${left} ${left === 1 ? 'plek' : 'plekken'}</span>`;
  return `<span class="spots">${left} plekken vrij</span>`;
}

export function activityCard(a, i = 0, { preview = false } = {}) {
  const joined = isJoined(a);
  const tag = preview ? 'div' : 'a';
  const n = a.attendees.length;
  return `
    <${tag} class="card" ${preview ? '' : `href="#/activiteit/${esc(a.id)}"`} data-id="${esc(a.id)}" style="--i:${i}">
      <div class="card__media">
        ${dateTile(a.date)}
        <div class="card__badges">
          ${joined && !preview ? `<span class="tag tag--green">${icon('check', 'icon--sm')} Je doet mee</span>` : ''}
          ${a.recurring ? `<span class="tag tag--white">${esc(a.recurring)}</span>` : ''}
        </div>
        ${img(imageOf(a), { alt: '', sizes: '(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 400px', w: 800, attrs: 'data-card-img' })}
      </div>
      <div class="card__body">
        <span class="card__kicker">${esc(dateLabel(a.date))} · ${esc(a.time)}</span>
        <h3 class="card__title">${esc(a.title || 'Naamloze activiteit')}</h3>
        <div class="card__meta">
          <span>${icon('pin')}<span>${esc(a.location || 'Locatie volgt')}</span></span>
        </div>
        <div class="card__foot">
          <span class="card__people">${n ? avatarStack(a.attendees, 4) : ''}<span>${n} ${n === 1 ? 'doet' : 'doen'} mee</span></span>
          ${spotsText(a)}
        </div>
      </div>
    </${tag}>`;
}

export function pastCard(a, i = 0) {
  const photos = galleryOf(a).length;
  return `
    <a class="past-card" href="#/activiteit/${esc(a.id)}" data-id="${esc(a.id)}" style="--i:${i}">
      ${img(imageOf(a), { alt: '', sizes: '(max-width: 640px) 80vw, (max-width: 1080px) 50vw, 320px', w: 800, attrs: 'data-card-img' })}
      <div class="past-card__body">
        <span class="past-card__date">${esc(agoLabel(a.date))}</span>
        <h3 class="past-card__title">${esc(a.title)}</h3>
        <div class="past-card__stats">
          <span>${icon('users')}${a.attendees.length}</span>
          ${photos ? `<span>${icon('camera')}${photos}</span>` : ''}
          ${a.comments?.length ? `<span>${icon('chat')}${a.comments.length}</span>` : ''}
        </div>
      </div>
    </a>`;
}

export function emptyState({ title, text, action = '' }) {
  return `
    <div class="empty">
      <div class="empty__icon">${icon('sparkle', 'icon--lg')}</div>
      <h3>${title}</h3>
      <p>${text}</p>
      ${action}
    </div>`;
}

/* ---------- "Wie ben jij?" dialog ---------- */

const TEAMS = ['Wegenwacht', 'IT', 'Marketing', 'Reizen', 'HR', 'Verzekeringen', 'Klantenservice', 'Ledenservice', 'Data & Analytics', 'Communicatie', 'Financiën', 'Energie', 'Webwinkel', 'Juridische zaken', 'Verkeersinformatie'];

/** Ask for the user's name (once). Resolves true when a user is known. */
export function ensureUser({ force = false, reason = 'Dan weten je collega’s wie er meedoet.' } = {}) {
  if (getUser() && !force) return Promise.resolve(true);
  const user = getUser();
  const dialog = document.createElement('dialog');
  dialog.className = 'dialog';
  dialog.innerHTML = `
    <form method="dialog" class="dialog__inner">
      <div class="dialog__head">
        <h2>${user ? 'Jouw gegevens' : 'Hoi! Wie ben jij?'}</h2>
        <p>${esc(reason)}</p>
      </div>
      <label class="field">
        <span class="field__label">Naam</span>
        <input class="input" name="name" required autocomplete="name" placeholder="Voor- en achternaam" value="${esc(user?.name || '')}">
      </label>
      <label class="field">
        <span class="field__label">Afdeling <span class="field__hint">Optioneel</span></span>
        <input class="input" name="team" list="teams" placeholder="Bijv. Wegenwacht" value="${esc(user?.team || '')}">
        <datalist id="teams">${TEAMS.map((t) => `<option value="${esc(t)}">`).join('')}</datalist>
      </label>
      <div class="dialog__actions">
        <button class="btn btn--ghost" value="cancel" formnovalidate>Annuleren</button>
        <button class="btn btn--primary" value="ok">${user ? 'Opslaan' : 'Ga verder'}</button>
      </div>
    </form>`;
  document.body.append(dialog);
  dialog.showModal();
  return new Promise((resolve) => {
    dialog.addEventListener('close', () => {
      const data = new FormData($('form', dialog));
      const ok = dialog.returnValue === 'ok' && String(data.get('name')).trim();
      if (ok) setUser({ name: String(data.get('name')), team: String(data.get('team') || '') });
      dialog.remove();
      document.dispatchEvent(new CustomEvent('user-changed'));
      resolve(Boolean(ok) || Boolean(getUser() && !force));
    });
  });
}

/* ---------- Lightbox ---------- */

export function openLightbox(photos, start = 0, { photoUrl }) {
  let index = start;
  const dialog = document.createElement('dialog');
  dialog.className = 'dialog dialog--lightbox';
  dialog.innerHTML = `
    <div class="lightbox">
      <button class="lightbox__close" type="button" aria-label="Sluiten">${icon('x')}</button>
      <img alt="">
      ${photos.length > 1 ? `
        <button class="lightbox__btn lightbox__btn--prev" type="button" aria-label="Vorige foto">${icon('chevron-left')}</button>
        <button class="lightbox__btn lightbox__btn--next" type="button" aria-label="Volgende foto">${icon('chevron-right')}</button>` : ''}
      <span class="lightbox__count"></span>
    </div>`;
  const image = $('img', dialog);
  const show = () => {
    image.src = photoUrl(photos[index], 1800);
    image.alt = `Foto ${index + 1} van ${photos.length}`;
    $('.lightbox__count', dialog).textContent = `${index + 1} / ${photos.length}`;
  };
  const step = (d) => { index = (index + d + photos.length) % photos.length; show(); };
  dialog.addEventListener('click', (e) => {
    if (e.target.closest('.lightbox__prev, .lightbox__btn--prev')) step(-1);
    else if (e.target.closest('.lightbox__btn--next')) step(1);
    else if (e.target.closest('.lightbox__close') || e.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  dialog.addEventListener('close', () => dialog.remove());
  document.body.append(dialog);
  show();
  dialog.showModal();
  fadeImages(dialog);
}

export function personLine(id) {
  const p = person(id);
  return `<strong>${esc(p.name)}${p.me ? ' (jij)' : ''}</strong>`;
}
