// The four main paths on the Trips hub (/tours). Each opens one or two sub-pages (the category pages in pages/categories.js).
// Kept free of rate data so the home page bundle stays small. Slugs must match pages/categories.js.
export const GROUPS = [
  { id: 'day', title: 'Day trips', short: 'Day trips', icon: 'bus', color: '#1f7a33', blurb: 'Picnics and resorts for one full school day.', slugs: ['one-day-trips'] },
  { id: 'learning', title: 'Learning visits', short: 'Learning', icon: 'compass', color: '#1c3f9e', blurb: 'Museums, forts, factories and fun parks.', slugs: ['educational', 'edutainment'] },
  { id: 'camps', title: 'Camps', short: 'Camps', icon: 'tent', color: '#0b7fc0', blurb: 'Adventure camps and overnight stays.', slugs: ['camping'] },
  { id: 'tours', title: 'Tours', short: 'Tours', icon: 'plane', color: '#d6402c', blurb: 'Multi-day journeys across India and abroad.', slugs: ['domestic', 'international'] },
]
export const groupOf = slug => GROUPS.find(g => g.slugs.includes(slug))
