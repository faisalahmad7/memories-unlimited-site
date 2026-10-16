// Destination photos. For every destination the page asks Wikimedia Commons (in the visitor's browser) for large
// landscape JPEGs and keeps the best 8. Pictures narrower than MIN_W are skipped, so nothing blurry is shown.
// To change what appears: edit the search words in `q` below. First word list = the search, second = optional caption.

const MIN_W = 2000 // source width in pixels; anything smaller is skipped
const SHOW = 8 // photos per destination
const BAD = /\b(map|logo|flag|diagram|plan|poster|stamp|coat of arms|locator|banner|icon|sign|ticket|menu|brochure|svg|screenshot|portrait|crowd|queue|selfie|interior)\b/i

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

const API = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=40&prop=imageinfo&iiprop=url%7Csize%7Cmime&iiurlwidth=1800&format=json&origin=*&gsrsearch='

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
  const g = GALLERY[id]
  const lists = await Promise.all(g.q.map(([term]) => search(term)))
  const seen = new Set(), out = []
  const take = (x, cap) => { const k = x.title; if (seen.has(k)) return false; seen.add(k); out.push({ src: x.ii.thumburl, file: k, cap }); return true }
  // Round-robin: the best picture of each place first, then the second best, and so on, until we have enough.
  for (const w of [MIN_W, 1600]) {
    for (let round = 0; round < 6 && out.length < SHOW; round++) {
      lists.forEach((list, i) => {
        if (out.length >= SHOW) return
        const key = g.q[i][0].split(' ')[0].toLowerCase()
        const good = list.filter(x => sharp(x, w)).sort((a, b) => (b.title.toLowerCase().includes(key) ? 1 : 0) - (a.title.toLowerCase().includes(key) ? 1 : 0))
        const x = good.filter(y => !seen.has(y.title))[0]
        if (x && round < 6) take(x, g.q[i][1])
      })
    }
    if (out.length >= SHOW) break
  }
  return out.slice(0, SHOW)
}

const KEY = 'mu-photos-v1'
export async function loadPhotos(onEach) {
  let saved = {}
  try { saved = JSON.parse(sessionStorage.getItem(KEY) || '{}') } catch {}
  const result = { ...saved }
  if (Object.keys(saved).length) onEach?.({ ...result })
  await Promise.all(Object.keys(GALLERY).map(async id => {
    if (result[id]?.length >= SHOW) return
    const list = await loadDest(id)
    if (list.length) { result[id] = list; onEach?.({ ...result }); try { sessionStorage.setItem(KEY, JSON.stringify(result)) } catch {} }
  }))
  return result
}
