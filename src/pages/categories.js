// Route table for the tour category pages. Slugs follow the suggested sitemap in the master prompt.
// Rows come from src/rates.js (transcribed from the 2026-27 rate sheet). Text below only restates what the sheet shows.
import { RATES } from '../rates.js'

// Multi-day rows that are international (flights/visas). Everything else multi-day is treated as domestic.
const INTERNATIONAL = new Set([23, 28, 30, 31, 32, 33, 34, 35]) // sheet row numbers: Bhutan, Nepal, Thailand, Singapore, Malaysia, Dubai, Hong Kong, Japan
const multi = r => r.category === 'multi-day-tour'

export const CATEGORIES = [
  { slug: 'one-day-trips', title: 'One-day trips and picnics', blurb: 'Resorts, parks, water parks and agro-tourism farms around Pune, for a full school day out.', rows: RATES.filter(r => r.category === 'one-day-picnic') },
  { slug: 'educational', title: 'Educational field trips', blurb: 'Museums, factories, forts, science centres and heritage sites, planned as a day visit.', rows: RATES.filter(r => r.category === 'field-trip') },
  { slug: 'edutainment', title: 'Edutainment', blurb: 'A learning visit and a fun park or resort combined into one day.', rows: RATES.filter(r => r.category === 'edutainment') },
  { slug: 'camping', title: 'Camping and overnight trips', blurb: 'Adventure camps and short overnight trips, from one night to a few days.', rows: RATES.filter(r => r.category === 'camping') },
  { slug: 'domestic', title: 'Domestic tours', blurb: 'Multi-day educational journeys within India.', rows: RATES.filter(r => multi(r) && !INTERNATIONAL.has(r.no)) },
  { slug: 'international', title: 'International tours', blurb: 'Multi-day group journeys abroad, travelling by flight.', rows: RATES.filter(r => multi(r) && INTERNATIONAL.has(r.no)) },
]
export const bySlug = slug => CATEGORIES.find(c => c.slug === slug)
