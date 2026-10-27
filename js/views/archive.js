import { past } from '../store.js';
import { icon } from '../ui.js';
import { pastCard, emptyState } from '../components.js';

export function render() {
  const list = past();
  return `
    <div class="container">
      <div class="page-head">
        <span class="eyebrow">Terugblik</span>
        <h1>Zo was het</h1>
        <p>Foto’s en reacties van eerdere activiteiten. Was je erbij? Deel jouw foto’s.</p>
      </div>
      <section class="section" style="padding-top:48px">
        <div class="archive-list">
          ${list.length ? list.map((a, i) => pastCard(a, i)).join('') : emptyState({
            title: 'Nog niks om op terug te kijken',
            text: 'Zodra er activiteiten zijn geweest, vind je ze hier.',
            action: `<a class="btn btn--primary" href="#/">${icon('calendar')} Naar de agenda</a>`,
          })}
        </div>
      </section>
    </div>`;
}

export function mount() {
  // Only links on this page.
}
