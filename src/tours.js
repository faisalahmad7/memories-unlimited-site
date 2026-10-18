// Only facts printed on the business flyers. Confirm prices before launch.
export const TOURS = [
  { id: 'singapore', name: 'Singapore', tag: '4 nights, 5 days', price: '₹69,999 per student, all inclusive (T&C apply)', img: '/flyers/singapore.webp', lh: 'Inclusions',
    list: ['Return airfare', 'Visa and insurance', '4 nights accommodation', 'All meals (Veg and Jain options available)', 'Airport transfers and all sightseeing', 'Entry tickets to all attractions', 'Tour manager and guide', 'Travel by AC coach', '24x7 assistance'],
    plan: [['Day 1', 'Arrival in Singapore. City tour: Merlion Park, Marina Bay Sands'], ['Day 2', 'Universal Studios Singapore'], ['Day 3', 'Gardens by the Bay, Singapore Flyer'], ['Day 4', 'Sentosa Island tour: S.E.A. Aquarium, Wings of Time show'], ['Day 5', 'Shopping at Orchard Road, departure']] },
  { id: 'mahabaleshwar', name: 'Mahabaleshwar', tag: '1-day picnic from Pune', price: '₹2200 per head', img: '/flyers/mahabaleshwar.webp', lh: 'Inclusions',
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
// Every flyer supplied by the business, in the order received.
export const FLYERS = [['Singapore tour', 1], ['Learn beyond classrooms', 2], ['Educational tours', 3], ['Visa services', 4], ['Learn beyond classrooms', 5], ['Learn beyond classrooms', 6], ['Learn beyond classrooms', 7], ['Mahabaleshwar picnic', 8], ['Jaipur, Fatehpur Sikri and Agra', 9], ['Hampi tour', 10], ['Singapore tour', 11], ['Ahmedabad tour', 12]]
  .map(([name, n]) => ({ name, src: `/flyers/flyer-${String(n).padStart(2, '0')}.webp` }))
