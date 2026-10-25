// Destination photos. For every destination the page asks Wikimedia Commons (in the visitor's browser) for large
// landscape JPEGs and keeps the best 8. Pictures narrower than MIN_W are skipped, so nothing blurry is shown.
// To change what appears: edit the search words in `q` below. First word list = the search, second = optional caption.

import { LOCAL } from './localPhotos.js'
import { OWN_HEROES } from './heroImages.js'

const MIN_W = 2000 // source width in pixels; anything smaller is skipped
const SHOW = 8 // photos per destination
const HERO_SHOW = 3 // photos kept for a hero-only destination
const BAD = /\b(map|logo|flag|diagram|plan|poster|stamp|coat of arms|locator|banner|icon|sign|ticket|menu|brochure|svg|screenshot|portrait|crowd|queue|selfie|interior|police|policeman|army|soldier|military|protest|rally|riot|accident|minister|politic|funeral|procession|festival|market|people|men|women|children|students|school)\b/i

export const GALLERY = {
  singapore: { label: 'Singapore', note: 'Places named on our Singapore flyer.', q: [['Merlion Park Singapore', 'Merlion Park'], ['Marina Bay Sands', 'Marina Bay Sands'], ['Gardens by the Bay', 'Gardens by the Bay'], ['Universal Studios Singapore', 'Universal Studios'], ['Singapore Flyer', 'Singapore Flyer'], ['Sentosa Singapore', 'Sentosa'], ['S.E.A. Aquarium Sentosa', 'S.E.A. Aquarium'], ['Orchard Road Singapore', 'Orchard Road']] },
  hampi: { label: 'Hampi', note: 'Places named on our Hampi flyer.', q: [['Virupaksha Temple Hampi', 'Virupaksha Temple'], ['Vittala Temple Hampi stone chariot', 'Vittala Temple'], ['Lotus Mahal Hampi', 'Lotus Mahal'], ['Elephant stables Hampi', 'Elephant Stable'], ["Queen's Bath Hampi", "Queen's Bath"], ['Hemakuta Hill Hampi', 'Hemakuta Hill'], ['Tungabhadra River Hampi', 'Tungabhadra River'], ['Hampi ruins', 'Hampi']] },
  jaipur: { label: 'Jaipur, Fatehpur Sikri, Agra', note: 'Places named on our flyer, plus nearby landmarks.', q: [['Hawa Mahal Jaipur', 'Hawa Mahal'], ['Amer Fort Jaipur', 'Amer Fort'], ['City Palace Jaipur', 'City Palace'], ['Fatehpur Sikri', 'Fatehpur Sikri'], ['Buland Darwaza Fatehpur Sikri', 'Buland Darwaza'], ['Taj Mahal Agra', 'Taj Mahal'], ['Agra Fort', 'Agra Fort'], ['Jantar Mantar Jaipur', 'Jantar Mantar']] },
  ahmedabad: { label: 'Ahmedabad', note: 'Places named on our Ahmedabad flyer.', q: [['Sabarmati Riverfront Ahmedabad', 'Sabarmati Riverfront'], ['Jama Masjid Ahmedabad', 'Jama Masjid'], ['Adalaj Stepwell', 'Adalaj Stepwell'], ['Sabarmati Ashram', 'Sabarmati Ashram'], ['Calico Museum of Textiles', 'Calico Museum'], ['Gujarat Science City', 'Science City'], ['Sidi Saiyyed Mosque jali', 'Sidi Saiyyed Mosque'], ['Ahmedabad', 'Ahmedabad']] },
  mahabaleshwar: { label: 'Mahabaleshwar', note: 'Places in and around Mahabaleshwar, the setting of our picnic.', q: [['Venna Lake Mahabaleshwar', 'Venna Lake'], ['Mahabaleshwar', 'Mahabaleshwar'], ["Arthur's Seat Mahabaleshwar", "Arthur's Seat"], ['Pratapgad fort', 'Pratapgad'], ['Mapro Garden Panchgani', 'Mapro Garden'], ['Panchgani table land', 'Panchgani'], ['Lingmala waterfall Mahabaleshwar', 'Lingmala Waterfall'], ['Krishna river Mahabaleshwar', 'Krishna River']] },
  imagicaa: { label: 'Imagicaa', note: 'Theme park trip. Not a confirmed itinerary: ask us what we can plan.', q: [['Imagicaa theme park Khopoli', 'Imagicaa'], ['Adlabs Imagica', 'Imagicaa'], ['Imagica water park Khopoli', 'Imagicaa water park'], ['Imagica Mumbai theme park rides', 'Imagicaa rides'], ['Khopoli Maharashtra', 'Khopoli']] },
  goa: { label: 'Goa', note: 'Popular places in Goa. Not a confirmed itinerary: ask us what we can plan.', q: [['Palolem Beach', 'Palolem Beach'], ['Calangute Beach', 'Calangute'], ['Fort Aguada', 'Fort Aguada'], ['Basilica of Bom Jesus', 'Basilica of Bom Jesus'], ['Dudhsagar Falls', 'Dudhsagar Falls'], ['Baga Beach Goa', 'Baga Beach'], ['Se Cathedral Old Goa', 'Se Cathedral'], ['Chapora Fort', 'Chapora Fort']] },
  manali: { label: 'Manali', note: 'Popular places near Manali. Not a confirmed itinerary: ask us what we can plan.', q: [['Solang Valley', 'Solang Valley'], ['Rohtang Pass', 'Rohtang Pass'], ['Hadimba Devi Temple', 'Hadimba Temple'], ['Manali Himachal Pradesh', 'Manali'], ['Beas River Manali', 'Beas River'], ['Atal Tunnel Rohtang', 'Atal Tunnel'], ['Jogini Falls Manali', 'Jogini Falls'], ['Old Manali', 'Old Manali']] },
  kerala: { label: 'Kerala', note: 'Popular places in Kerala. Not a confirmed itinerary: ask us what we can plan.', q: [['Kerala backwaters houseboat', 'Kerala backwaters'], ['Munnar tea plantation', 'Munnar'], ['Periyar National Park', 'Periyar'], ['Kovalam beach', 'Kovalam'], ['Alleppey backwaters', 'Alleppey'], ['Athirappilly Falls', 'Athirappilly Falls'], ['Varkala cliff beach', 'Varkala'], ['Fort Kochi Chinese fishing nets', 'Fort Kochi']] },
}

// Hero-only destinations for the route pages (Educational, Edutainment, Camping, About, Contact). They are NOT gallery tabs.
// Same Wikimedia Commons search as above; if nothing sharp comes back the page keeps its line illustration.
export const HEROES = {
  'h-sinhagad': { q: [['Sinhagad fort', 'Sinhagad Fort'], ['Sinhagad Pune hill fort', 'Sinhagad']] },
  'h-shaniwar': { q: [['Shaniwar Wada Pune', 'Shaniwar Wada'], ['Shaniwar Wada gate', 'Shaniwar Wada']] },
  'h-agakhan': { q: [['Aga Khan Palace Pune', 'Aga Khan Palace']] },
  'h-lohagad': { q: [['Lohagad fort', 'Lohagad Fort'], ['Visapur fort', 'Visapur']] },
  'h-lonavala': { q: [['Lonavala', 'Lonavala'], ['Bhushi Dam Lonavala', 'Lonavala'], ['Tiger Point Lonavala', 'Lonavala']] },
  'h-dapoli': { q: [['Dapoli beach', 'Dapoli'], ['Diveagar beach', 'Diveagar'], ['Karde beach Dapoli', 'Dapoli']] },
  'h-karjat': { q: [['Karjat Maharashtra', 'Karjat'], ['Kondana caves Karjat', 'Karjat'], ['Bhivpuri waterfall Karjat', 'Karjat']] },
  'h-pune': { q: [['Pune skyline', 'Pune'], ['Pune city Maharashtra', 'Pune'], ['Parvati hill Pune', 'Pune']] },
}

const API = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=40&prop=imageinfo&iiprop=url%7Csize%7Cmime&iiurlwidth=1280&format=json&origin=*&gsrsearch='

async function search(term, tries = 2) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(API + encodeURIComponent(term + ' filetype:bitmap'))
      if (!r.ok) throw new Error(r.status)
      const pages = Object.values((await r.json()).query?.pages || {}).sort((a, b) => a.index - b.index)
      return pages.map(p => ({ ii: p.imageinfo?.[0], title: p.title })).filter(x => x.ii?.thumburl)
    } catch { await new Promise(res => setTimeout(res, 400 * (i + 1))) }
  }
  return []
}
const sharp = (x, w) => x.ii.mime === 'image/jpeg' && x.ii.width >= w && x.ii.height >= w * 0.55 && x.ii.width / x.ii.height >= 1.25 && x.ii.width / x.ii.height <= 2.1 && !BAD.test(x.title)

async function loadDest(id) {
  const g = GALLERY[id] || HEROES[id]
  const SHOW_N = GALLERY[id] ? SHOW : HERO_SHOW
  const lists = await Promise.all(g.q.map(([term]) => search(term)))
  const seen = new Set(), out = []
  const take = (x, cap) => { const k = x.title; if (seen.has(k)) return false; seen.add(k); out.push({ src: x.ii.thumburl, file: k, cap }); return true }
  // Round-robin: the best picture of each place first, then the second best, and so on, until we have enough.
  for (const w of [MIN_W, 1600]) {
    for (let round = 0; round < 6 && out.length < SHOW_N; round++) {
      lists.forEach((list, i) => {
        if (out.length >= SHOW_N) return
        const key = g.q[i][0].split(' ')[0].toLowerCase()
        const good = list.filter(x => sharp(x, w)).sort((a, b) => (b.title.toLowerCase().includes(key) ? 1 : 0) - (a.title.toLowerCase().includes(key) ? 1 : 0))
        const x = good.filter(y => !seen.has(y.title))[0]
        if (x && round < 6) take(x, g.q[i][1])
      })
    }
    if (out.length >= SHOW_N) break
  }
  return out.slice(0, SHOW_N)
}

const KEY = 'mu-photos-v1'
export async function loadPhotos(onEach) {
  let saved = {}
  try { saved = JSON.parse(sessionStorage.getItem(KEY) || '{}') } catch {}
  const result = { ...saved, ...LOCAL } // local photos always win; they need no network
  if (Object.keys(result).length) onEach?.({ ...result })
  await Promise.all(Object.keys(GALLERY).map(async id => {
    if (LOCAL[id]?.length || result[id]?.length >= SHOW) return
    const list = await loadDest(id)
    if (list.length) { result[id] = list; onEach?.({ ...result }); try { sessionStorage.setItem(KEY, JSON.stringify(result)) } catch {} }
  }))
  return result
}

// One destination on demand (used by the route pages): local photos first, then the session cache, then Wikimedia.
export async function loadDestination(id) {
  // Photos the owner supplied (src/heroImages.js) always win over Wikimedia.
  if (OWN_HEROES[id]?.length) return OWN_HEROES[id].map(src => ({ src, file: 'own:' + src, cap: 'Memories Unlimited' }))
  if (LOCAL[id]?.length) return LOCAL[id]
  const key = HEROES[id] ? 'mu-heroes-v1' : KEY
  let saved = {}
  try { saved = JSON.parse(sessionStorage.getItem(key) || '{}') } catch {}
  if (saved[id]?.length) return saved[id]
  if (!GALLERY[id] && !HEROES[id]) return []
  const list = await loadDest(id)
  if (list.length) { saved[id] = list; try { sessionStorage.setItem(key, JSON.stringify(saved)) } catch {} }
  return list
}

// Pictures of ONE named place (used by the trip detail card). Only keeps a picture when its Commons title contains the
// distinctive words of the place name, so a result is never "some other park". Returns [] when nothing matches.
const GENERIC = new Set(['resort', 'agro', 'tourism', 'factory', 'museum', 'with', 'hands', 'experience', 'centre', 'center', 'world', 'adventure', 'water', 'theme', 'junior', 'advance', 'park', 'parks', 'camp', 'add'])
const PLACE_KEY = 'mu-place-v1'
export async function loadPlace(term) {
  let saved = {}
  try { saved = JSON.parse(sessionStorage.getItem(PLACE_KEY) || '{}') } catch {}
  const k = term.toLowerCase()
  if (saved[k]) return saved[k]
  const tok = k.replace('sinhaghad', 'sinhagad').split(/[^a-z0-9]+/).filter(w => w.length > 3 && !GENERIC.has(w)).slice(0, 2)
  if (!tok.length) return []
  const list = await search(term)
  const seen = new Set(), out = []
  for (const x of list) {
    const t = x.title.toLowerCase()
    if (x.ii.mime === 'image/jpeg' && x.ii.width >= 1000 && x.ii.width / x.ii.height >= 1.1 && !BAD.test(x.title) && tok.every(w => t.includes(w)) && !seen.has(x.title)) {
      seen.add(x.title); out.push({ src: x.ii.thumburl, file: x.title, cap: term })
      if (out.length >= 3) break
    }
  }
  saved[k] = out
  try { sessionStorage.setItem(PLACE_KEY, JSON.stringify(saved)) } catch {}
  return out
}
