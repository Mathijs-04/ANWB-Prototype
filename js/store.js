// Local state: seeds + everything the user changed, persisted in localStorage.
import { seedActivities, seedPast, PEOPLE, IMAGES, toISODate } from './data.js';

const KEY = 'anwb-activities:v1';
const MUTABLE = ['attendees', 'rides', 'comments', 'photos', 'reactions', 'myReactions'];

let state = load();
let seeds = buildSeeds();

function empty() {
  return { user: null, created: [], patches: {} };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty(), ...JSON.parse(raw) } : empty();
  } catch {
    return empty();
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false; // Storage full or blocked; the session keeps working in memory.
  }
}

function buildSeeds() {
  return [...seedActivities(), ...seedPast()].map((a) => ({ rides: [], comments: [], photos: [], reactions: {}, myReactions: [], max: null, ...a, seed: true }));
}

export const today = () => toISODate(new Date());

function withComputed(a) {
  return { ...a, isPast: a.date < today() };
}

/* ---------- People ---------- */

export function getUser() {
  return state.user;
}

export function setUser(user) {
  state.user = { name: user.name.trim(), team: (user.team || '').trim() };
  save();
}

export function person(id) {
  if (id === 'me') return { id, name: state.user?.name || 'Jij', team: state.user?.team || '', me: true };
  const p = PEOPLE[id];
  return p ? { id, ...p } : { id, name: 'Collega', team: '' };
}

/* ---------- Activities ---------- */

export function all() {
  const merged = seeds.map((s) => ({ ...s, ...pick(state.patches[s.id]) }));
  return [...merged, ...state.created].map(withComputed);
}

function pick(patch) {
  if (!patch) return {};
  return Object.fromEntries(Object.entries(patch).filter(([k]) => MUTABLE.includes(k)));
}

export function get(id) {
  return all().find((a) => a.id === id) || null;
}

export function upcoming() {
  return all().filter((a) => !a.isPast).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export function past() {
  return all().filter((a) => a.isPast).sort((a, b) => b.date.localeCompare(a.date));
}

/** Apply a mutation to one activity and persist it. */
function update(id, fn) {
  const created = state.created.find((a) => a.id === id);
  if (created) {
    fn(created);
  } else {
    const current = get(id);
    if (!current) return;
    const draft = structuredClone(Object.fromEntries(MUTABLE.map((k) => [k, current[k]])));
    fn(draft);
    state.patches[id] = draft;
  }
  return save();
}

export function imageOf(a) {
  return IMAGES[a.image]?.[0] || a.image || IMAGES.hero[0];
}

export function galleryOf(a) {
  return [...(IMAGES[a.gallery] || []), ...(a.photos || [])];
}

export const isJoined = (a) => a.attendees.includes('me');
export const isFull = (a) => a.max != null && a.attendees.length >= a.max;
export const spotsLeft = (a) => (a.max == null ? null : Math.max(0, a.max - a.attendees.length));

export function join(id) {
  update(id, (a) => {
    if (!a.attendees.includes('me')) a.attendees.push('me');
  });
}

export function leave(id) {
  update(id, (a) => {
    a.attendees = a.attendees.filter((p) => p !== 'me');
    a.rides = (a.rides || [])
      .filter((r) => r.driver !== 'me')
      .map((r) => ({ ...r, passengers: r.passengers.filter((p) => p !== 'me') }));
  });
}

/* ---------- Carpool ---------- */

export function myRide(a) {
  return (a.rides || []).find((r) => r.driver === 'me' || r.passengers.includes('me')) || null;
}

export function offerRide(id, { from, time, seats }) {
  update(id, (a) => {
    a.rides = (a.rides || []).map((r) => ({ ...r, passengers: r.passengers.filter((p) => p !== 'me') }));
    a.rides.push({ id: `r${Date.now().toString(36)}`, driver: 'me', from, time, seats, passengers: [] });
    if (!a.attendees.includes('me')) a.attendees.push('me');
  });
}

export function cancelRide(id, rideId) {
  update(id, (a) => {
    a.rides = a.rides.filter((r) => r.id !== rideId);
  });
}

export function joinRide(id, rideId) {
  update(id, (a) => {
    a.rides = a.rides.map((r) => ({
      ...r,
      passengers: r.id === rideId ? [...r.passengers.filter((p) => p !== 'me'), 'me'] : r.passengers.filter((p) => p !== 'me'),
    }));
    if (!a.attendees.includes('me')) a.attendees.push('me');
  });
}

export function leaveRide(id, rideId) {
  update(id, (a) => {
    a.rides = a.rides.map((r) => (r.id === rideId ? { ...r, passengers: r.passengers.filter((p) => p !== 'me') } : r));
  });
}

/* ---------- Past activities ---------- */

export function addComment(id, text) {
  update(id, (a) => {
    a.comments = [...(a.comments || []), { by: 'me', text, at: today() }];
  });
}

export function addPhoto(id, dataUrl) {
  return update(id, (a) => {
    a.photos = [...(a.photos || []), dataUrl];
  });
}

export function toggleReaction(id, emoji) {
  update(id, (a) => {
    a.reactions = { ...(a.reactions || {}) };
    a.myReactions = [...(a.myReactions || [])];
    const mine = a.myReactions.includes(emoji);
    a.reactions[emoji] = Math.max(0, (a.reactions[emoji] || 0) + (mine ? -1 : 1));
    a.myReactions = mine ? a.myReactions.filter((e) => e !== emoji) : [...a.myReactions, emoji];
  });
}

/* ---------- Create ---------- */

export function create(data) {
  const slug = data.title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
  const activity = {
    id: `${slug || 'activiteit'}-${Date.now().toString(36).slice(-4)}`,
    organizer: 'me',
    attendees: ['me'],
    rides: [], comments: [], photos: [], reactions: {}, myReactions: [],
    createdAt: Date.now(),
    ...data,
  };
  state.created.push(activity);
  save();
  return activity.id;
}

export function reset() {
  state = empty();
  seeds = buildSeeds();
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
