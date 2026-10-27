import { photo } from '../data.js';
import * as store from '../store.js';
import { esc, icon, img, $, avatar, avatarStack, fullDate, dateLabel, dayDiff, agoLabel, toast, celebrate, plural, fadeImages } from '../ui.js';
import { categoryLabel, spotsText, emptyState, ensureUser, openLightbox } from '../components.js';

const PEOPLE_PREVIEW = 6;

export function render({ id }) {
  const a = store.get(id);
  if (!a) {
    return `<div class="container section">${emptyState({
      title: 'Deze activiteit bestaat niet (meer)',
      text: 'Misschien is de link verlopen of is de activiteit verwijderd.',
      action: `<a class="btn btn--primary" href="#/">Naar alle activiteiten</a>`,
    })}</div>`;
  }
  return a.isPast ? renderPast(a) : renderUpcoming(a);
}

/* ==========================================================================
   Upcoming
   ========================================================================== */

function renderUpcoming(a) {
  const joined = store.isJoined(a);
  const full = store.isFull(a);
  const diff = dayDiff(a.date);
  const when = diff === 0 ? 'Vandaag' : diff === 1 ? 'Morgen' : `Over ${diff} dagen`;

  return `
    <div class="container">
      <a class="back-link" href="#/">${icon('arrow-left')} Alle activiteiten</a>

      <section class="detail-hero">
        <div>
          <div class="detail-hero__tags">
            <span class="tag">${esc(categoryLabel(a.category))}</span>
            ${a.recurring ? `<span class="tag tag--yellow">${esc(a.recurring)}</span>` : ''}
            ${joined ? `<span class="tag tag--green">${icon('check', 'icon--sm')} Je doet mee</span>` : ''}
          </div>
          <h1 class="detail-hero__title">${esc(a.title)}</h1>

          <div class="facts">
            <div class="fact"><span class="fact__icon">${icon('calendar')}</span><div><small>Datum</small><strong>${esc(fullDate(a.date))}</strong></div></div>
            <div class="fact"><span class="fact__icon">${icon('clock')}</span><div><small>Tijd</small><strong>${esc(a.time)}${a.duration ? ` · ${esc(a.duration)}` : ''}</strong></div></div>
            <div class="fact"><span class="fact__icon">${icon('pin')}</span><div><small>${esc(a.address || 'Locatie')}</small><strong>${esc(a.location)}</strong></div></div>
          </div>

          <div class="join-box">
            ${joined
              ? `<button class="btn btn--lg btn--joined" type="button" data-leave data-hover-label="Afmelden">${icon('check')} <span>Je doet mee</span></button>`
              : `<button class="btn btn--lg btn--yellow" type="button" data-join ${full ? 'disabled' : ''}>${full ? 'Helaas, vol' : `Ik doe mee ${icon('arrow')}`}</button>`}
            <div class="join-box__meta">
              ${a.attendees.length ? avatarStack(a.attendees, 4) : ''}
              <span><strong>${a.attendees.length}</strong> ${a.attendees.length === 1 ? 'collega doet' : 'collega’s doen'} mee</span>
            </div>
          </div>
        </div>

        <div class="detail-hero__visual">
          <div class="hero__badge" aria-hidden="true"><small>${esc(when)}</small><strong>${esc(dateLabel(a.date))} · ${esc(a.time)}</strong></div>
          <div class="slant">${img(store.imageOf(a), { alt: '', sizes: '(max-width: 860px) 100vw, 50vw', eager: true, attrs: 'data-hero-img' })}</div>
        </div>
      </section>

      <section class="detail-body">
        <div class="detail-main">
          <div class="prose">
            <h2>Over deze activiteit</h2>
            <p>${esc(a.description || 'De organisator heeft nog geen omschrijving toegevoegd.')}</p>
          </div>
          ${a.transport ? carpool(a) : ''}
        </div>

        <aside class="detail-side">
          ${organizerPanel(a)}
          ${attendeesPanel(a)}
          <div class="side-actions">
            <button class="btn btn--outline" type="button" data-ics>${icon('calendar')} In agenda</button>
            <button class="btn btn--outline" type="button" data-share>${icon('share')} Deel link</button>
          </div>
        </aside>
      </section>
    </div>

    <div class="mobile-join">
      <div><strong>${esc(dateLabel(a.date))} · ${esc(a.time)}</strong><span>${a.attendees.length} doen mee${store.spotsLeft(a) != null ? ` · ${store.spotsLeft(a)} vrij` : ''}</span></div>
      ${joined
        ? `<button class="btn btn--joined" type="button" data-leave data-hover-label="Afmelden">${icon('check')} <span>Je doet mee</span></button>`
        : `<button class="btn btn--yellow" type="button" data-join ${full ? 'disabled' : ''}>${full ? 'Vol' : 'Ik doe mee'}</button>`}
    </div>`;
}

function organizerPanel(a) {
  const o = store.person(a.organizer);
  return `
    <div class="panel">
      <div class="panel__title">Georganiseerd door</div>
      <div class="organizer">
        ${avatar(a.organizer, 'lg')}
        <div><strong>${esc(o.name)}${o.me ? ' (jij)' : ''}</strong><span>${esc(o.team || 'ANWB')}</span></div>
      </div>
    </div>`;
}

function attendeesPanel(a, { title = 'Wie doen er mee?' } = {}) {
  const list = [...a.attendees].sort((x, y) => (y === 'me') - (x === 'me'));
  const capacity = a.max && !a.isPast
    ? `<div class="capacity">
         <div class="capacity__bar"><i style="width:${Math.min(100, (a.attendees.length / a.max) * 100)}%"></i></div>
         <div class="capacity__label"><span>${a.attendees.length} van ${a.max}</span>${spotsText(a)}</div>
       </div>`
    : '';
  return `
    <div class="panel">
      <div class="panel__title">${title} <span>${a.attendees.length}</span></div>
      ${list.length ? `
        <ul class="people-list" data-people>
          ${list.map((id, i) => {
            const p = store.person(id);
            return `<li ${i >= PEOPLE_PREVIEW ? 'hidden' : ''} class="${p.me ? 'keep-anim' : ''}">${avatar(id, 'sm')}<strong>${esc(p.name)}${p.me ? ' (jij)' : ''}</strong><span class="people-list__team">${esc(p.team)}</span></li>`;
          }).join('')}
        </ul>
        ${list.length > PEOPLE_PREVIEW ? `<button class="people-list__more" type="button" data-more-people>Toon alle ${list.length}</button>` : ''}`
        : '<p style="color:var(--muted)">Nog niemand. Wees de eerste!</p>'}
      ${capacity}
    </div>`;
}

/* ---------- Carpool ---------- */

function carpool(a) {
  const rides = a.rides || [];
  const mine = store.myRide(a);
  const iDrive = mine?.driver === 'me';
  const free = rides.reduce((n, r) => n + Math.max(0, r.seats - r.passengers.length), 0);
  const defaultTime = shiftTime(a.time, -30);

  return `
    <section class="carpool" id="vervoer">
      <h2 class="block-title">Samen reizen</h2>
      <p class="carpool__intro">Rijd je zelf? Bied je lege plekken aan. Zoek je een lift? Stap in bij een collega.</p>

      ${rides.length ? `<div class="carpool__summary">
        <span>${icon('car', 'icon--sm')} ${plural(rides.length, 'auto', 'auto’s')}</span>
        <span>${icon('seat', 'icon--sm')} ${plural(free, 'plek', 'plekken')} vrij</span>
        ${mine && !iDrive ? `<span style="background:var(--yellow)">${icon('check', 'icon--sm')} Je rijdt mee met ${esc(store.person(mine.driver).name.split(' ')[0])}</span>` : ''}
      </div>` : ''}

      <div class="rides">
        ${rides.length ? rides.map((r, i) => rideCard(r, i)).join('') : `<p style="color:var(--muted);padding:4px 0 8px">Nog geen ritten. Ben jij de eerste?</p>`}
      </div>

      ${iDrive ? '' : `
        <details class="offer-ride">
          <summary><span class="icon-wrap">${icon('plus')}</span> Ik rijd zelf en heb plek over</summary>
          <form class="offer-ride__form" data-offer>
            <label class="field"><span class="field__label">Vertrekpunt</span><input class="input" name="from" required value="Hoofdkantoor Den Haag"></label>
            <label class="field"><span class="field__label">Vertrek</span><input class="input" type="time" name="time" required value="${defaultTime}"></label>
            <div class="field"><span class="field__label">Vrije plekken</span>
              <div class="stepper" data-stepper data-min="1" data-max="6">
                <button type="button" data-step="-1" aria-label="Minder">${icon('minus')}</button>
                <output name="seats">3</output>
                <button type="button" data-step="1" aria-label="Meer">${icon('plus')}</button>
              </div>
            </div>
            <button class="btn btn--primary" type="submit">${icon('car')} Rit aanbieden</button>
          </form>
        </details>`}

      <div class="transport-alt">
        <span>${icon('train')} Liever met het OV? <a href="https://9292.nl" target="_blank" rel="noopener">Plan je reis</a></span>
        <span>${icon('bike')} Of pak de fiets</span>
      </div>
    </section>`;
}

function rideCard(r, i) {
  const driver = store.person(r.driver);
  const mineAsDriver = r.driver === 'me';
  const mineAsPassenger = r.passengers.includes('me');
  const left = r.seats - r.passengers.length;
  const seats = Array.from({ length: r.seats }, (_, s) => {
    const p = r.passengers[s];
    const cls = p === 'me' ? 'seat seat--me' : p ? 'seat seat--taken' : 'seat';
    const label = p ? store.person(p).name : 'Vrije plek';
    return `<span class="${cls}" title="${esc(label)}">${icon('seat')}</span>`;
  }).join('');

  let action;
  if (mineAsDriver) action = `<button class="btn btn--outline btn--sm" type="button" data-cancel-ride="${esc(r.id)}">Rit annuleren</button>`;
  else if (mineAsPassenger) action = `<button class="btn btn--joined btn--sm" type="button" data-leave-ride="${esc(r.id)}" data-hover-label="Uitstappen">${icon('check', 'icon--sm')} <span>Je rijdt mee</span></button>`;
  else if (left <= 0) action = `<button class="btn btn--outline btn--sm" type="button" disabled>Vol</button>`;
  else action = `<button class="btn btn--primary btn--sm" type="button" data-join-ride="${esc(r.id)}">Instappen</button>`;

  return `
    <div class="ride ${mineAsDriver || mineAsPassenger ? 'ride--mine' : ''}" style="animation-delay:${i * 60}ms">
      ${avatar(r.driver)}
      <div>
        <div class="ride__title">${esc(driver.name)}${mineAsDriver ? ' (jij)' : ''}</div>
        <div class="ride__sub"><span>${icon('pin')}${esc(r.from)}</span><span>${icon('clock')}Vertrek ${esc(r.time)}</span></div>
        <div class="seats" aria-label="${left} van ${r.seats} plekken vrij">${seats}</div>
      </div>
      <div class="ride__action">${action}</div>
    </div>`;
}

function shiftTime(time, minutes) {
  const [h, m] = time.split(':').map(Number);
  const total = (h * 60 + m + minutes + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

/* ==========================================================================
   Past
   ========================================================================== */

const REACTIONS = ['🙌', '❤️', '😂'];

function renderPast(a) {
  const photos = store.galleryOf(a);
  const me = store.getUser();
  const emoji = [...new Set([...Object.keys(a.reactions), ...REACTIONS])].slice(0, 5);

  return `
    <section class="archive-hero">
      ${img(store.imageOf(a), { alt: '', sizes: '100vw', w: 1800, eager: true, attrs: 'data-hero-img' })}
      <div class="container archive-hero__top">
        <a class="back-link" href="#/terugblik">${icon('arrow-left')} Terugblik</a>
      </div>
      <div class="container">
        <span class="tag tag--yellow">${icon('history', 'icon--sm')} ${esc(agoLabel(a.date))}</span>
        <h1>${esc(a.title)}</h1>
        <div class="archive-hero__meta">
          <span>${icon('calendar')} ${esc(fullDate(a.date))}</span>
          <span>${icon('pin')} ${esc(a.location)}</span>
          <span>${icon('users')} ${plural(a.attendees.length, 'deelnemer', 'deelnemers')}</span>
        </div>
      </div>
    </section>

    <div class="container">
      <section class="detail-body">
        <div class="detail-main">
          ${a.description ? `<div class="prose"><h2>Zo was het</h2><p>${esc(a.description)}</p></div>` : ''}

          <section>
            <h2 class="block-title">Foto’s <span style="color:var(--muted);font-weight:400">${photos.length || ''}</span></h2>
            <div class="gallery">
              ${photos.map((p, i) => `<button class="gallery__item" type="button" data-photo="${i}" style="--i:${i}" aria-label="Bekijk foto ${i + 1}">${img(p, { alt: '', sizes: '(max-width: 860px) 50vw, 33vw', w: 900 })}</button>`).join('')}
              <label class="gallery__item gallery__add" style="--i:${photos.length}">
                <span class="icon-wrap">${icon('camera')}</span>
                Foto toevoegen
                <small>Deel jouw foto’s</small>
                <input type="file" accept="image/*" multiple class="visually-hidden" data-upload>
              </label>
            </div>
          </section>

          <section>
            <h2 class="block-title">Reacties <span style="color:var(--muted);font-weight:400">${a.comments.length || ''}</span></h2>
            <div class="comments">
              ${a.comments.map((c) => {
                const p = store.person(c.by);
                return `<div class="comment ${c.by === 'me' ? 'keep-anim' : ''}">${avatar(c.by)}<div class="comment__bubble"><div class="comment__head"><strong>${esc(p.name)}</strong><span>${esc(agoLabel(c.at))}</span></div><p>${esc(c.text)}</p></div></div>`;
              }).join('')}
              <form class="comment-form" data-comment>
                ${me ? avatar('me') : `<span class="avatar" style="--c:var(--grey);color:var(--blue)">${icon('chat', 'icon--sm')}</span>`}
                <div class="comment-form__box">
                  <label class="visually-hidden" for="comment">Jouw reactie</label>
                  <textarea class="textarea" id="comment" name="text" required placeholder="Hoe vond jij het?"></textarea>
                  <div class="comment-form__actions">
                    <span class="field__hint">${me ? `Je reageert als ${esc(me.name)}` : 'We vragen eerst even je naam.'}</span>
                    <button class="btn btn--primary btn--sm" type="submit">Plaats reactie</button>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>

        <aside class="detail-side">
          <div class="panel">
            <div class="stat-row">
              <div class="stat"><b>${a.attendees.length}</b><span>deelnemers</span></div>
              <div class="stat"><b>${photos.length}</b><span>foto’s</span></div>
              <div class="stat"><b>${a.comments.length}</b><span>reacties</span></div>
            </div>
            <div class="panel__title" style="margin:20px 0 12px">Hoe was het?</div>
            <div class="reactions">
              ${emoji.map((e) => `<button class="reaction" type="button" data-react="${e}" aria-pressed="${a.myReactions.includes(e)}"><span>${e}</span><b>${a.reactions[e] || ''}</b></button>`).join('')}
            </div>
          </div>
          ${organizerPanel(a)}
          ${attendeesPanel(a, { title: 'Wie waren erbij?' })}
          <a class="btn btn--yellow btn--block btn--lg" href="#/nieuw?van=${esc(a.id)}">${icon('refresh')} Organiseer opnieuw</a>
        </aside>
      </section>
    </div>`;
}

/* ==========================================================================
   Behaviour
   ========================================================================== */

export function mount(root, { id, refresh }) {
  const a = store.get(id);
  if (!a) return;

  root.addEventListener('click', async (e) => {
    const t = e.target;

    if (t.closest('[data-join]')) {
      if (!(await ensureUser())) return;
      store.join(id);
      refresh();
      celebrate($('[data-leave]', root));
      toast(`Gezellig! Je doet mee aan <b>${esc(a.title)}</b>.`, a.transport ? { action: { label: 'Regel vervoer', onClick: () => $('#vervoer')?.scrollIntoView({ behavior: 'smooth' }) }, duration: 5000 } : {});
      return;
    }

    if (t.closest('[data-leave]')) {
      store.leave(id);
      refresh();
      toast('Je bent afgemeld.', { icon: 'x', action: { label: 'Ongedaan maken', onClick: () => { store.join(id); refresh(); } } });
      return;
    }

    const joinRide = t.closest('[data-join-ride]');
    if (joinRide) {
      if (!(await ensureUser())) return;
      const wasJoined = store.isJoined(store.get(id));
      store.joinRide(id, joinRide.dataset.joinRide);
      refresh();
      const ride = store.get(id).rides.find((r) => r.id === joinRide.dataset.joinRide);
      toast(`Je rijdt mee met ${esc(store.person(ride.driver).name.split(' ')[0])}.${wasJoined ? '' : ' Je bent ook aangemeld.'}`);
      return;
    }

    const leaveRide = t.closest('[data-leave-ride]');
    if (leaveRide) { store.leaveRide(id, leaveRide.dataset.leaveRide); refresh(); toast('Je bent uitgestapt.', { icon: 'x' }); return; }

    const cancelRide = t.closest('[data-cancel-ride]');
    if (cancelRide) { store.cancelRide(id, cancelRide.dataset.cancelRide); refresh(); toast('Je rit is geannuleerd.', { icon: 'x' }); return; }

    const step = t.closest('[data-step]');
    if (step) {
      const stepper = step.closest('[data-stepper]');
      const out = $('output', stepper);
      out.value = Math.min(+stepper.dataset.max, Math.max(+stepper.dataset.min, +out.value + +step.dataset.step));
      return;
    }

    if (t.closest('[data-more-people]')) {
      root.querySelectorAll('[data-people] li[hidden]').forEach((li) => { li.hidden = false; });
      t.closest('[data-more-people]').remove();
      return;
    }

    if (t.closest('[data-ics]')) { downloadIcs(store.get(id)); return; }

    if (t.closest('[data-share]')) {
      try {
        await navigator.clipboard.writeText(location.href);
        toast('Link gekopieerd. Deel hem met je collega’s.', { icon: 'share' });
      } catch {
        toast('Kopiëren lukt niet. Kopieer de link uit de adresbalk.', { icon: 'x' });
      }
      return;
    }

    const photoBtn = t.closest('[data-photo]');
    if (photoBtn) { openLightbox(store.galleryOf(store.get(id)), +photoBtn.dataset.photo, { photoUrl: photo }); return; }

    const react = t.closest('[data-react]');
    if (react) {
      store.toggleReaction(id, react.dataset.react);
      const fresh = store.get(id);
      react.setAttribute('aria-pressed', String(fresh.myReactions.includes(react.dataset.react)));
      $('b', react).textContent = fresh.reactions[react.dataset.react] || '';
    }
  });

  root.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;

    if (form.matches('[data-offer]')) {
      if (!(await ensureUser())) return;
      const data = new FormData(form);
      store.offerRide(id, { from: String(data.get('from')).trim(), time: String(data.get('time')), seats: +$('output', form).value });
      refresh();
      toast('Top! Je rit staat erbij. Collega’s kunnen nu instappen.', { icon: 'car' });
      return;
    }

    if (form.matches('[data-comment]')) {
      const text = String(new FormData(form).get('text')).trim();
      if (!text) return;
      if (!(await ensureUser({ reason: 'Zo weten je collega’s van wie de reactie is.' }))) return;
      store.addComment(id, text);
      refresh();
      toast('Bedankt voor je reactie!', { icon: 'chat' });
    }
  });

  root.addEventListener('change', async (e) => {
    if (!e.target.matches('[data-upload]')) return;
    const files = [...e.target.files].filter((f) => f.type.startsWith('image/'));
    if (!files.length) return;
    let added = 0;
    for (const file of files) {
      const dataUrl = await resizeImage(file, 1400);
      if (store.addPhoto(id, dataUrl)) added++;
      else { toast('De opslag van je browser is vol. Niet alle foto’s zijn bewaard.', { icon: 'x' }); break; }
    }
    if (added) { refresh(); toast(`${plural(added, 'foto', 'foto’s')} toegevoegd.`, { icon: 'camera' }); }
  });

  // Hover label swap ("Je doet mee" -> "Afmelden")
  root.addEventListener('pointerover', (e) => swapLabel(e, true));
  root.addEventListener('pointerout', (e) => swapLabel(e, false));
  fadeImages(root);
}

function swapLabel(e, on) {
  const btn = e.target.closest('[data-hover-label]');
  if (!btn || btn.contains(e.relatedTarget)) return;
  const span = $('span', btn);
  if (!span) return;
  if (on) { btn.dataset.label = span.textContent; span.textContent = btn.dataset.hoverLabel; } else if (btn.dataset.label) span.textContent = btn.dataset.label;
}

function resizeImage(file, max) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, max / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    image.onerror = reject;
    image.src = url;
  });
}

function downloadIcs(a) {
  const [h, m] = a.time.split(':').map(Number);
  const start = new Date(`${a.date}T00:00:00`);
  start.setHours(h, m);
  const end = new Date(start.getTime() + 2 * 3600000);
  const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const text = (s) => String(s || '').replace(/[,;\\]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ANWB Activities//NL', 'BEGIN:VEVENT',
    `UID:${a.id}@anwb-activities`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
    `SUMMARY:${text(a.title)}`, `LOCATION:${text(a.location)}`, `DESCRIPTION:${text(a.description)}\\n\\n${text(location.href)}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  link.download = `${a.id}.ics`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  toast('Afspraak gedownload. Open hem om toe te voegen aan je agenda.', { icon: 'calendar' });
}
