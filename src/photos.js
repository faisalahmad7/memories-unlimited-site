// Real, free-licensed photos from Wikipedia / Wikimedia Commons, looked up when the page opens.
// To change a picture: change a Wikipedia article title below. Titles that do not exist are skipped.
// Main pictures: the first title in each list that has a photo is used.
export const SPOTS = {
  singapore: ['Marina Bay Sands', 'Merlion Park'], mahabaleshwar: ['Venna Lake', 'Mahabaleshwar'], hampi: ['Hampi', 'Virupaksha Temple, Hampi'],
  jaipur: ['Hawa Mahal', 'Amer Fort'], ahmedabad: ['Sabarmati Riverfront', 'Adalaj Stepwell'], agra: ['Taj Mahal'],
  goa: ['Palolem Beach', 'Calangute', 'Fort Aguada', 'Basilica of Bom Jesus', 'Goa'], manali: ['Solang Valley', 'Manali, Himachal Pradesh', 'Rohtang Pass'], kerala: ['Kerala backwaters', 'Munnar'],
}
// Gallery: the places named on our flyers (and popular spots for trips available on request).
export const GALLERY = {
  singapore: { label: 'Singapore', note: 'Places named on our Singapore flyer.', places: ['Merlion Park', 'Marina Bay Sands', 'Universal Studios Singapore', 'Gardens by the Bay', 'Singapore Flyer', 'Sentosa', 'S.E.A. Aquarium', 'Orchard Road'] },
  hampi: { label: 'Hampi', note: 'Places named on our Hampi flyer.', places: ['Virupaksha Temple, Hampi', 'Vittala Temple', 'Lotus Mahal', 'Elephant stables, Hampi', "Queen's Bath, Hampi", 'Hemakuta Hill', 'Tungabhadra River'] },
  jaipur: { label: 'Jaipur, Fatehpur Sikri, Agra', note: 'Places named on our flyer, plus nearby landmarks.', places: ['Hawa Mahal', 'Amer Fort', 'City Palace, Jaipur', 'Fatehpur Sikri', 'Buland Darwaza', 'Taj Mahal', 'Agra Fort'] },
  ahmedabad: { label: 'Ahmedabad', note: 'Places named on our Ahmedabad flyer.', places: ['Sabarmati Riverfront', 'Jama Masjid, Ahmedabad', 'Adalaj Stepwell', 'Sabarmati Ashram', 'Calico Museum of Textiles', 'Gujarat Science City'] },
  mahabaleshwar: { label: 'Mahabaleshwar', note: 'Places linked to our Mahabaleshwar picnic flyer.', places: ['Venna Lake', 'Mahabaleshwar'] },
  goa: { label: 'Goa', note: 'Popular places in Goa. Not a confirmed itinerary: ask us what we can plan.', places: ['Palolem Beach', 'Calangute', 'Fort Aguada', 'Basilica of Bom Jesus', 'Dudhsagar Falls'] },
  manali: { label: 'Manali', note: 'Popular places near Manali. Not a confirmed itinerary: ask us what we can plan.', places: ['Solang Valley', 'Rohtang Pass', 'Hadimba Devi Temple', 'Manali, Himachal Pradesh'] },
  kerala: { label: 'Kerala', note: 'Popular places in Kerala. Not a confirmed itinerary: ask us what we can plan.', places: ['Kerala backwaters', 'Munnar', 'Periyar National Park', 'Kovalam'] },
}
const api = t => 'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=thumbnail%7Cname&pithumbsize=1600&redirects=1&format=json&origin=*&titles=' + encodeURIComponent(t.join('|'))
async function batch(titles) {
  const q = (await (await fetch(api(titles))).json()).query || {}
  const pages = Object.values(q.pages || {})
  const hop = (arr, t) => (arr || []).find(x => x.from === t)?.to || t
  const out = {}
  for (const t of titles) {
    const pg = pages.find(p => p.title === hop(q.redirects, hop(q.normalized, t)))
    if (pg?.thumbnail?.source) out[t] = { src: pg.thumbnail.source, file: pg.pageimage, page: pg.title }
  }
  return out
}
export async function loadPhotos() {
  const all = [...new Set([...Object.values(SPOTS).flat(), ...Object.values(GALLERY).flatMap(g => g.places)])]
  const chunks = []; for (let i = 0; i < all.length; i += 20) chunks.push(all.slice(i, i + 20))
  const places = Object.assign({}, ...(await Promise.all(chunks.map(c => batch(c).catch(() => ({}))))))
  const spots = {}
  for (const [k, list] of Object.entries(SPOTS)) { const t = list.find(x => places[x]); if (t) spots[k] = places[t] }
  return { spots, places }
}

// Extra HD photos for a place, found by searching Wikimedia Commons (wide JPEGs at least 2400px across).
const CA = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=15&prop=imageinfo&iiprop=url%7Csize%7Cmime&iiurlwidth=1600&format=json&origin=*&gsrsearch='
const cache = {}
export async function loadExtra(place) {
  if (cache[place]) return cache[place]
  try {
    const j = await (await fetch(CA + encodeURIComponent(place.replace(/,.*$/, '') + ' filetype:bitmap'))).json()
    const pages = Object.values(j.query?.pages || {}).sort((a, b) => a.index - b.index)
    return (cache[place] = pages.map(p => ({ ii: p.imageinfo?.[0], title: p.title }))
      .filter(x => x.ii && x.ii.mime === 'image/jpeg' && x.ii.width >= 2400 && x.ii.width > x.ii.height * 1.2 && x.ii.thumburl)
      .slice(0, 3).map(x => ({ src: x.ii.thumburl, file: x.title.replace(/^File:/, ''), page: place })))
  } catch { return [] }
}
