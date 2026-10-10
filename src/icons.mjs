// One icon set, 24px grid, 1.75 stroke, round caps.
const s = (d, extra = '') =>
  `<svg class="ic" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"${extra}>${d}</svg>`;

export const ICONS = {
  pin: s('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  locate: s('<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>'),
  search: s('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>'),
  globe: s('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/>'),
  check: s('<path d="M5 12.5l4.2 4.2L19 7"/>'),
  phone: s('<path d="M6.6 3.5h2.6l1.4 4-2 1.3a11 11 0 0 0 6.6 6.6l1.3-2 4 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"/>'),
  chat: s('<path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.6z"/><path d="M9 9.5c.3 2.4 2.1 4.3 4.5 4.8l1-1.2 1.6.7"/>'),
  arrow: s('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  arrowUp: s('<path d="M12 19V5M6 11l6-6 6 6"/>'),
  menu: s('<path d="M4 8h16M4 16h16"/>'),
  close: s('<path d="M6 6l12 12M18 6L6 18"/>'),
  clock: s('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  tag: s('<path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.4 0z"/><circle cx="8.2" cy="8.2" r="1.4"/>'),
  chevron: s('<path d="M6 9l6 6 6-6"/>'),
  scissors: s('<circle cx="6" cy="6" r="2.6"/><circle cx="6" cy="18" r="2.6"/><path d="M8.1 7.6L20 18M8.1 16.4L20 6"/>'),
  pause: s('<path d="M9 5.5v13M15 5.5v13"/>', ' data-i="pause"'),
  play: s('<path d="M8 5.5v13l10-6.5z"/>', ' data-i="play"'),
};
