// Shared rendering helpers: formatting, icons, avatars, images, toasts.
import { photo, srcset } from './data.js';
import { person, today } from './store.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export const icon = (name, cls = '') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

/* ---------- Dates ---------- */

const parse = (iso) => new Date(`${iso}T12:00:00`);
const fmt = (opts) => new Intl.DateTimeFormat('nl-NL', opts);

export function dayDiff(iso) {
  return Math.round((parse(iso) - parse(today())) / 86400000);
}

/** "Vandaag", "Morgen", "Zaterdag 31 oktober" */
export function dateLabel(iso, { long = false } = {}) {
  const diff = dayDiff(iso);
  if (diff === 0) return 'Vandaag';
  if (diff === 1) return 'Morgen';
  if (diff === -1) return 'Gisteren';
  const label = fmt(long ? { weekday: 'long', day: 'numeric', month: 'long' } : { weekday: 'short', day: 'numeric', month: 'short' }).format(parse(iso));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function fullDate(iso) {
  const s = fmt({ weekday: 'long', day: 'numeric', month: 'long' }).format(parse(iso));
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function dateTile(iso) {
  const d = parse(iso);
  return `<div class="date-tile" aria-hidden="true"><b>${d.getDate()}</b><span>${fmt({ month: 'short' }).format(d).replace('.', '')}</span></div>`;
}

export function agoLabel(iso) {
  const diff = -dayDiff(iso);
  if (diff <= 0) return 'Vandaag';
  if (diff === 1) return 'Gisteren';
  if (diff < 7) return `${diff} dagen geleden`;
  if (diff < 14) return 'Vorige week';
  if (diff < 31) return `${Math.round(diff / 7)} weken geleden`;
  return `${Math.round(diff / 30)} maand${diff >= 60 ? 'en' : ''} geleden`;
}

/* ---------- Avatars ---------- */

const COLORS = ['#003d86', '#0a6ccf', '#1d8a4e', '#b05f00', '#6b3fa0', '#00838f', '#c8102e', '#4a5a75'];

export function initials(name) {
  const parts = name.split(' ').filter((p) => p && p[0] === p[0].toUpperCase());
  return ((parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?';
}

function colorFor(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return COLORS[h % COLORS.length];
}

export function avatar(id, size = '') {
  const p = person(id);
  const color = p.me ? 'var(--yellow)' : colorFor(p.name);
  const style = p.me ? '--c: var(--yellow); color: var(--blue)' : `--c:${color}`;
  return `<span class="avatar ${size ? `avatar--${size}` : ''} ${p.me ? 'avatar--me' : ''}" style="${style}" title="${esc(p.name)}">${esc(initials(p.name))}</span>`;
}

export function avatarStack(ids, max = 4, size = 'sm') {
  const shown = [...ids].sort((a, b) => (b === 'me') - (a === 'me')).slice(0, max);
  const rest = ids.length - shown.length;
  return `<span class="avatar-stack">${shown.map((id) => avatar(id, size)).join('')}${rest > 0 ? `<span class="avatar avatar--${size} avatar--more">+${rest}</span>` : ''}</span>`;
}

/* ---------- Images ---------- */

export function img(id, { alt = '', sizes = '100vw', w = 1200, eager = false, cls = '', attrs = '' } = {}) {
  const set = srcset(id);
  return `<img class="${cls}" src="${esc(photo(id, w))}" ${set ? `srcset="${set}" sizes="${sizes}"` : ''} alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" data-fade ${attrs}>`;
}

/** Fade remote images in once loaded (also handles images already in cache). */
export function fadeImages(root = document) {
  $$('img[data-fade]:not(.is-loaded)', root).forEach((el) => {
    if (el.complete && el.naturalWidth) el.classList.add('is-loaded');
    else {
      el.addEventListener('load', () => el.classList.add('is-loaded'), { once: true });
      el.addEventListener('error', () => el.classList.add('is-loaded'), { once: true });
    }
  });
}

/* ---------- Feedback ---------- */

export function toast(message, { action, icon: iconName = 'check', duration = 3600 } = {}) {
  const region = $('.toast-region');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span class="toast__icon">${icon(iconName)}</span><span>${message}</span>`;
  if (action) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = action.label;
    btn.addEventListener('click', () => { action.onClick(); dismiss(); });
    el.append(btn);
  }
  region.append(el);
  const dismiss = () => {
    el.classList.add('is-leaving');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  };
  setTimeout(dismiss, duration);
}

/** A small burst of ANWB-coloured confetti from an element. */
export function celebrate(fromEl) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !fromEl) return;
  const r = fromEl.getBoundingClientRect();
  const colors = ['#ffcd01', '#003d86', '#59b4ff', '#ffffff'];
  for (let i = 0; i < 26; i++) {
    const c = document.createElement('i');
    c.className = 'confetti';
    const angle = (Math.PI * 2 * i) / 26 + Math.random() * 0.4;
    const dist = 70 + Math.random() * 90;
    c.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;background:${colors[i % colors.length]};--dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist - 40}px;--rot:${Math.random() * 540 - 270}deg;${i % 4 === 3 ? 'box-shadow:0 0 0 1px #003d8633;' : ''}`;
    document.body.append(c);
    c.addEventListener('animationend', () => c.remove(), { once: true });
  }
}

export function plural(n, one, many) {
  return `${n} ${n === 1 ? one : many}`;
}
