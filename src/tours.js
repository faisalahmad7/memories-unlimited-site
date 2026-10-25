// Only facts printed on the business flyers. PRICES ARE BLANK ON PURPOSE for Singapore (flyer Rs 69,999 vs rate sheet Rs 1,20,000) and
// Mahabaleshwar (flyer Rs 2200 vs rate sheet row 31, see src/rates.js). Fill in once the owner confirms.
export const TOURS = [
  { id: 'singapore', name: 'Singapore', tag: '4 nights, 5 days', price: '', img: '/flyers/flyer-01.webp', lh: 'Inclusions',
    list: ['Return airfare', 'Visa and insurance', '4 nights accommodation', 'All meals (Veg and Jain options available)', 'Airport transfers and all sightseeing', 'Entry tickets to all attractions', 'Tour manager and guide', 'Travel by AC coach', '24x7 assistance'],
    plan: [['Day 1', 'Arrival in Singapore. City tour: Merlion Park, Marina Bay Sands'], ['Day 2', 'Universal Studios Singapore'], ['Day 3', 'Gardens by the Bay, Singapore Flyer'], ['Day 4', 'Sentosa Island tour: S.E.A. Aquarium, Wings of Time show'], ['Day 5', 'Shopping at Orchard Road, departure']] },
  { id: 'mahabaleshwar', name: 'Mahabaleshwar', tag: '1-day picnic from Pune', price: '', img: '/flyers/mahabaleshwar.webp', lh: 'Inclusions',
    list: ['Transportation by AC coach', 'All meals', 'Go karting', 'Boating at Venna Lake', 'Mahabaleshwar market shopping', 'Mapro visit'] },
  { id: 'hampi', name: 'Hampi', tag: 'Educational tour from Pune', price: '', img: '/flyers/hampi.webp', lh: 'Places to visit',
    list: ['Virupaksha Temple', 'Vittala Temple (the Stone Chariot)', 'Lotus Mahal', 'Elephant Stable', "Queen's Bath", 'Hemakuta Hill and Sunset Point', 'Tungabhadra River'] },
  { id: 'jaipur', name: 'Jaipur, Fatehpur Sikri and Agra', tag: 'Educational tour', price: '', img: '/flyers/jaipur.webp', lh: 'Places to visit',
    list: ['Jaipur, the Pink City', 'Fatehpur Sikri, the City of Victory', 'Agra, home of the Taj'] },
  { id: 'ahmedabad', name: 'Ahmedabad', tag: 'Educational tour', price: '', img: '/flyers/ahmedabad.webp', lh: 'Places to visit',
    list: ['Sabarmati Riverfront', 'Jama Masjid', 'Adalaj Stepwell', 'Sabarmati Ashram', 'Calico Museum of Textiles', 'Gujarat Science City'] },
]
export const TRAIL = ['singapore', 'mahabaleshwar', 'hampi', 'jaipur', 'ahmedabad', 'educational', 'learn-beyond'].map(n => `/flyers/${n}.webp`)
// Destinations you named that have no flyer yet. Shown as "ask us"; confirm availability before launch.
export const EXTRA = [{ id: 'goa', name: 'Goa', tag: 'On request' }, { id: 'manali', name: 'Manali', tag: 'On request' }, { id: 'kerala', name: 'Kerala', tag: 'On request' }, { id: 'imagicaa', name: 'Imagicaa', tag: 'On request' }]
// Flyers shown to visitors: ONE per distinct offer. The business supplied 12 flyer images (and the extra copies in
// public/flyers are byte-identical duplicates), but several repeat the same offer:
//   Singapore: flyer-01 (no price printed) and flyer-11 (prints Rs 69,999, which conflicts with the 2026-27 rate sheet).
//   Learn beyond classrooms: flyer-02, 05, 06, 07 are four layouts of the same message.
// We show the Singapore flyer WITHOUT a price and one "Learn beyond classrooms" flyer. The other files stay on disk
// and are listed in MEDIA_MANIFEST.md; nothing was deleted.
export const FLYERS = [
  ['Singapore tour', 1], ['Learn beyond classrooms', 5], ['Educational tours', 3], ['Visa services', 4],
  ['Mahabaleshwar picnic', 8], ['Jaipur, Fatehpur Sikri and Agra', 9], ['Hampi tour', 10], ['Ahmedabad tour', 12],
].map(([name, n]) => ({ name, src: `/flyers/flyer-${String(n).padStart(2, '0')}.webp` }))
