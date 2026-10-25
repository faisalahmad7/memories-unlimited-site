// Small line icons shared by the nav menu, trip cards and trust ribbon. Decorative: always aria-hidden.
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }
const P = {
  bus: <><rect x="6" y="10" width="36" height="24" rx="6" /><path d="M6 24h36M18 10v14M30 10v14" /><circle cx="15" cy="38" r="3" /><circle cx="33" cy="38" r="3" /></>,
  compass: <><circle cx="24" cy="24" r="17" /><path d="M31 17l-4 11-10 3 4-11z" /></>,
  camera: <><rect x="5" y="14" width="38" height="26" rx="5" /><path d="M16 14l3-5h10l3 5" /><circle cx="24" cy="27" r="7" /></>,
  tent: <><path d="M5 38L24 9l19 29z" /><path d="M24 9v29M16 38l8-12 8 12" /></>,
  flag: <><path d="M12 42V7" /><path d="M12 9h26l-6 8 6 8H12" /></>,
  plane: <><path d="M44 8L4 22l14 6 6 14z" /><path d="M18 28L44 8" /></>,
  pin: <><path d="M24 43C14 31 10 25 10 19a14 14 0 0 1 28 0c0 6-4 12-14 24z" /><circle cx="24" cy="19" r="5" /></>,
  shield: <><path d="M24 5l15 6v12c0 10-7 17-15 20C16 40 9 33 9 23V11z" /><path d="M17 24l5 5 9-10" /></>,
  calendar: <><rect x="6" y="9" width="36" height="32" rx="5" /><path d="M6 19h36M15 5v8M33 5v8" /></>,
  people: <><circle cx="16" cy="16" r="6" /><circle cx="34" cy="20" r="5" /><path d="M6 40c0-9 5-14 10-14s10 5 10 14M28 40c0-7 3-11 6-11s8 4 8 11" /></>,
  hotel: <><path d="M8 42V10h32v32" /><path d="M16 18h4M28 18h4M16 26h4M28 26h4" /><path d="M20 42v-9h8v9" /></>,
  star: <><path d="M24 5l5.5 12 13 1.5-9.7 8.8 2.7 12.9L24 33l-11.5 7.2 2.7-12.9L5.5 18.5l13-1.5z" /></>,
}
export const Icon = ({ n, size = 28 }) => <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false" {...S}>{P[n]}</svg>
// One icon per kind of trip (slug from categories.js).
export const KIND_ICON = { 'one-day-trips': 'bus', educational: 'compass', edutainment: 'camera', camping: 'tent', domestic: 'flag', international: 'plane' }
