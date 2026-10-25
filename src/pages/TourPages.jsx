import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { loadPlace } from '../photos.js'
import { waLink } from '../site.config.js'
import { RATE_META, BAND_LABEL, formatRupees } from '../rates.js'
import { CATEGORIES, bySlug } from './categories.js'
import { PageShell, Hero, Section, Steps, Pillars, CtaBand, WaButton, Art, TrustRibbon, useTitle, useDestPhotos } from './ui.jsx'
import { Icon, KIND_ICON } from '../icons.jsx'
import { GROUPS, groupOf } from '../groups.js'

// Prices stay hidden until the owner has confirmed the 2026-27 rates. Flip RATE_META.verifiedByOwner in src/rates.js.
const SHOW = RATE_META.verifiedByOwner === true

// The sheet prints many names in ALL CAPS. Title-case those words for display; keep known acronyms.
const KEEP = new Set(['ISRO', 'PUNO', 'ND', 'DIU', 'PCMC', 'AC'])
export const pretty = n => n.split(' ').map(w => (/^[A-Z]{3,}$/.test(w) && !KEEP.has(w) ? w[0] + w.slice(1).toLowerCase() : w)).join(' ')
const tidy = r => { let n = pretty(r.name).replace(/[,&]\s*$/, '').trim(); if (r.review && /cut off/.test(r.review)) n += '...'; return n }
const durText = d => (d ? d.replace(/^(\d+)N-(\d+)D$/, (_, n, dd) => `${n} night${n === '1' ? '' : 's'}, ${dd} days`) : '')
const nightsOf = rows => rows.map(r => parseInt(r.duration)).filter(Boolean)

export const STEPS = [
  ['Tell us your plan', 'Share the school, class, number of students and the month you would like to travel.'],
  ['Get options and a quote', 'We suggest places that suit the grade and send a quote for your group.'],
  ['Confirm the date', 'Choose the trip and the date that works for your school.'],
  ['Travel with a trip leader', 'An experienced trip leader travels with your group, in our own coach or vehicle.'],
  ['Return and share the memories', 'We bring the group back and look forward to your next trip.'],
]

// Per-category look and copy. Figures are computed from the rate data in src/rates.js; trust lines come from src/trust.js.
function config(slug, rows) {
  const n = rows.length, nights = nightsOf(rows)
  const range = nights.length ? `${Math.min(...nights)} to ${Math.max(...nights)} nights` : ''
  const FREE = ['Staff travel free', 'One teacher or staff member travels free for every 20 students.', '1 : 20']
  const COACH = ['Our own coaches and vehicles', 'Personal buses and vehicles, driven by experienced drivers, so your group travels together.', 'Coach']
  switch (slug) {
    case 'one-day-trips': return { theme: 'green', variant: 'split', photos: ['mahabaleshwar', 'imagicaa'], art: <Art.Bus />, title: 'A full day out, planned from Pune and Mumbai', chips: [`${n} resorts, parks and farms`, 'Pune and PCMC pick-up', 'Meals included'],
      pillars: [['Pick-up in Pune and PCMC', 'Our one-day rates cover transport within the Pune and PCMC region.', 'Pune'], COACH, ['Meals on the day', 'Entry with activities, plus breakfast, lunch and an evening snack, with drinking water.', '3 meals'], FREE, ['A trip leader on each coach', 'An experienced trip leader who knows basic first aid travels on every coach.', 'Leader']] }
    case 'educational': return { theme: 'blue', variant: 'split', photos: ['h-sinhagad', 'h-shaniwar', 'h-agakhan'], art: <Art.Compass />, title: 'Learning that leaves the classroom', chips: [`${n} learning visits`, 'Classes I-IV, V-X and college', 'Pune and Mumbai'],
      pillars: [['Museums, factories and forts', 'Science parks, an art museum, a fire station, a cricket museum, Sinhagad Fort and more.', `${n}`], ['Pune, Mumbai and beyond', 'Most visits are in and around Pune. Mumbai, Panvel and Karjat day trips are also on the list.', 'Day trip'], ['Hands-on stops', 'Includes a cake factory with hands-on experience and a cheese factory visit.', 'Hands-on'], ['Priced by grade', 'Visits are priced for classes I-IV, V-X and college.', 'I - XII']] }
    case 'edutainment': return { theme: 'coral', variant: 'split', photos: ['h-agakhan', 'imagicaa', 'h-lohagad'], art: <Art.Camera />, title: 'Learn in the morning, play in the afternoon', chips: [`${n} combinations`, 'A learning stop plus a park'],
      pillars: [['Two stops in one day', 'Each combination pairs a museum, fort or factory with a park or resort.', '2 in 1'], ['Popular pairings', 'For example Diamond Parks with the National War Memorial, or Sunny\u2019s World with the Aviation Museum.', 'Combos'], ['Younger students too', 'Every combination has a rate for classes I-IV.', 'I - IV']] }
    case 'camping': return { theme: 'sky', variant: 'split', photos: ['h-lonavala', 'h-dapoli', 'h-karjat'], art: <Art.Tent />, title: 'A night under the open sky', chips: [`${n} camps and overnight trips`, range],
      pillars: [['Hills, forts and beaches', 'Lonavala, Mahabaleshwar, Karjat, Aurangabad, Dapoli, Diveagar and Goa are on the list.', range || 'Overnight'], ['Adventure camps', 'Durshet Adventure Camp is available on its own or with ND Studio.', 'Durshet'], ['For school and college', 'Camps are priced for classes I-X and for senior college.', 'I - X']] }
    case 'domestic': return { theme: 'gold', variant: 'split', photos: ['jaipur', 'hampi', 'ahmedabad'], art: <Art.Flag />, title: 'Journeys across India for your class', chips: [`${n} tours`, range, 'Good hotels'],
      pillars: [['History and heritage', 'Jaipur, Agra, Hampi, Udaipur, Chittorgarh, Gwalior and more.', 'Heritage'], ['Wildlife and nature', 'Ranthambhore, Sariska, Gir, Tadoba, Pench and Jim Corbett are on the list.', 'Wildlife'], ['Science and big cities', 'Ahmedabad with ISRO, Hyderabad with Ramoji Film City, Bangalore and Mysore.', 'Science'], ['Good hotels', 'Comfortable, carefully chosen hotels for the night stops of every tour.', 'Hotels'], ['Customised plans', 'Some tours, such as Amritsar-Dalhousie-Dharamshala, are quoted as customised trips.', 'Custom']] }
    case 'international': return { theme: 'navy', variant: 'split', photos: ['singapore'], art: <Art.Flag />, title: 'Take your class abroad', chips: [`${n} destinations`, 'Flights, AC train or bus as listed', 'Visas included'],
      pillars: [['Visas included', 'Visas are included with transport on our international tours.', 'Visas'], ['Good hotels', 'Comfortable, carefully chosen hotels for every night abroad.', 'Hotels'], ['Meals and water', 'All meals as per the itinerary, plus packaged drinking water.', 'Meals'], FREE, ['A trip leader on every trip', 'An experienced trip leader who knows basic first aid travels with the group.', 'Leader']] }
    default: return { theme: 'blue', variant: 'split', photos: [], art: <Art.Compass />, title: '', chips: [], pillars: [] }
  }
}

// ---------- The Trips hub: four paths in a cross. Choose one and its sub-pages open below. ----------
const reduceMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
const SPOT = ['top', 'left', 'right', 'bottom'] // cross positions for the four paths, in order

function TripHub() {
  const fromHash = () => { const h = typeof location !== 'undefined' ? location.hash.slice(1) : ''; return GROUPS.find(g => g.id === h)?.id || null }
  const [open, setOpen] = useState(fromHash)
  const root = useRef(null), stage = useRef(null), origin = useRef({ x: 50, y: 50 }), opener = useRef(null)
  const g = GROUPS.find(x => x.id === open)
  const subs = g ? g.slugs.map(sl => CATEGORIES.find(c => c.slug === sl)).filter(Boolean) : []
  const total = subs.reduce((n, c) => n + c.rows.length, 0)

  useEffect(() => {
    if (reduceMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.hub-cell', { scale: 0.6, opacity: 0, duration: 0.8, ease: 'back.out(1.6)', stagger: 0.12 })
      gsap.from('.hub-core', { scale: 0, rotate: -180, duration: 1, ease: 'power3.out' })
      gsap.to('.hub-ring', { rotate: 360, duration: 24, ease: 'none', repeat: -1 })
    }, root)
    return () => ctx.revert()
  }, [])

  // Follow the address (#day etc.), so the wheel in the nav and the Back button both work.
  useEffect(() => {
    const on = () => setOpen(fromHash())
    addEventListener('hashchange', on); return () => removeEventListener('hashchange', on)
  }, [])

  // The stage fills the screen: a circle of the path's colour grows out of the tile you picked, then the content rises in.
  useEffect(() => {
    if (!open || !stage.current) return
    const el = stage.current, prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const key = e => { if (e.key === 'Escape') close() }
    addEventListener('keydown', key)
    el.querySelector('.stg-x')?.focus({ preventScroll: true })
    let tl
    if (!reduceMotion()) {
      const { x, y } = origin.current
      tl = gsap.timeline()
      tl.fromTo(el, { clipPath: `circle(0% at ${x}% ${y}%)` }, { clipPath: `circle(150% at ${x}% ${y}%)`, duration: 0.9, ease: 'power3.inOut' })
        .from('.stg-title span', { yPercent: 110, duration: 0.8, ease: 'power4.out', stagger: 0.06 }, 0.45)
        .from('.stg-blurb, .stg-count', { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.7)
        .from('.stg-card', { y: 50, opacity: 0, scale: 0.94, duration: 0.7, ease: 'back.out(1.4)', stagger: 0.12 }, 0.75)
        .from('.stg-big', { scale: 0.5, opacity: 0, rotate: -25, duration: 1.1, ease: 'power3.out' }, 0.5)
    }
    return () => { tl?.kill(); removeEventListener('keydown', key); document.documentElement.style.overflow = prevOverflow }
  }, [open])

  const choose = (id, e) => {
    const r = e.currentTarget.getBoundingClientRect()
    origin.current = { x: ((r.left + r.width / 2) / innerWidth) * 100, y: ((r.top + r.height / 2) / innerHeight) * 100 }
    opener.current = e.currentTarget
    try { history.replaceState(null, '', '#' + id) } catch {}
    setOpen(id)
  }
  const close = () => {
    const done = () => { try { history.replaceState(null, '', location.pathname) } catch {} setOpen(null); opener.current?.focus({ preventScroll: true }) }
    if (reduceMotion() || !stage.current) return done()
    const { x, y } = origin.current
    gsap.to(stage.current, { clipPath: `circle(0% at ${x}% ${y}%)`, duration: 0.55, ease: 'power3.in', onComplete: done })
  }

  return (
    <div className="hub" ref={root}>
      <div className="hub-cross" aria-label="Kinds of trips">
        <span className="hub-ring" aria-hidden="true" />
        <span className="hub-core" aria-hidden="true"><Icon n="compass" size={34} /><b>Pick a path</b></span>
        {GROUPS.map((x, i) => (
          <div key={x.id} className={'hub-cell hub-' + SPOT[i]}>
            <button type="button" aria-haspopup="dialog" className="hub-tile" style={{ '--c': x.color }} onClick={e => choose(x.id, e)}>
              <span className="hub-ic"><Icon n={x.icon} size={40} /></span>
              <span className="hub-t">{x.title}</span>
              <span className="hub-b">{x.blurb}</span>
              <span className="hub-open" aria-hidden="true">Open {'\u2192'}</span>
            </button>
          </div>
        ))}
      </div>
      {g && createPortal(
        <div className="stg" ref={stage} role="dialog" aria-modal="true" aria-labelledby="stg-title" style={{ '--c': g.color }}>
          <span className="stg-big" aria-hidden="true"><Icon n={g.icon} size={420} /></span>
          <button type="button" className="stg-x" onClick={close} aria-label="Close and choose another path"><span aria-hidden="true">{'\u2190'}</span> All paths</button>
          <div className="stg-in">
            <h3 className="stg-title" id="stg-title">{g.title.split(' ').map((w, i) => <span key={i}>{w}</span>)}</h3>
            <p className="stg-blurb">{g.blurb}</p>
            <p className="stg-count">{total} trips to choose from</p>
            <ul className="stg-cards">
              {subs.map(c => (
                <li key={c.slug} className="stg-card">
                  <a href={'/tours/' + c.slug}>
                    <span className="stg-ic"><Icon n={KIND_ICON[c.slug]} size={36} /></span>
                    <b>{c.title}</b>
                    <span className="stg-d">{c.blurb}</span>
                    <small>{c.rows.slice(0, 3).map(r => tidy(r).split(' - ')[0]).join(' \u00b7 ')}</small>
                    <span className="stg-go">Click to view<i aria-hidden="true">{'\u2192'}</i></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>, document.body)}
    </div>
  )
}

// Other paths, shown on a category page: plain links.
function OtherTrips({ items }) {
  return (
    <ul className="kinds small">
      {items.map(c => { const g = groupOf(c.slug); return (
        <li key={c.slug} className="kl" style={{ '--c': g.color }}>
          <a href={'/tours/' + c.slug}><span className="kl-ic"><Icon n={KIND_ICON[c.slug]} size={26} /></span><b>{c.title}</b><small>{c.rows.length} trips</small></a>
        </li>) })}
    </ul>
  )
}

export function ToursIndex() {
  useTitle('Trips for every kind of school day')
  const photos = useDestPhotos(['page-tours', 'singapore', 'jaipur', 'mahabaleshwar'])
  return (
    <PageShell theme="blue">
      <Hero variant="split" title="Trips for every kind of school day" lead="From a one-day picnic near Pune to a week abroad. Pick a kind of trip, see the places we plan trips to, and ask us for a quote."
        photos={photos} art={<Art.Compass />} chips={['Planned from Pune and Mumbai', 'Our own coaches', 'Good hotels']}
        actions={<><WaButton text="Hello Memories Unlimited! I would like to plan a school trip.">Get a quote</WaButton><a className="pg-btn ghost on-dark" href="#kinds">Choose a path</a></>} />
      <TrustRibbon hideOnPhone />
      <Section id="kinds" tone="hub" title="Where will your class go next?" lead="Four ways to take learning beyond the classroom.">
        <TripHub />
      </Section>
      <Section tone="soft" title="How a trip comes together" lead="Five simple steps, from your first message to the journey home.">
        <Steps items={STEPS} />
      </Section>
      <Section title="Planning for your school">
        <div className="two">
          <div className="pg-card"><h3>For teachers and coordinators</h3><p>We quote for your group. One teacher or staff member travels free for every 20 students, for a minimum of 40 payable students.</p><WaButton text="Hello Memories Unlimited! I am a teacher and would like a quote for my class.">Ask for a school quote</WaButton></div>
          <div className="pg-card"><h3>For parents</h3><p>Have a question about meals, supervision, coaches or hotels? Message us and we will answer, or read about student care on our safety page.</p><a className="pg-btn ghost" href="/safety">Read about student care</a></div>
        </div>
      </Section>
      <CtaBand />
    </PageShell>
  )
}

// ---------- Trip list: slim rows. Click one and a bigger card opens with pictures, a Google map and the actions. ----------
const stripName = n => n.replace(/\s*\(.*?\)\s*/g, ' ').trim()
function tripParts(r) {
  const full = stripName(tidy(r)), loc = r.location || (full.includes(' - ') ? full.split(' - ').slice(1).join(' ') : '')
  const parts = full.split(/\s\+\s/).map(x => x.split(' - ')[0].trim()).filter(Boolean)
  return { parts: parts.length ? parts : [full], loc }
}
const mapsQ = (p, loc) => [p, loc].filter(Boolean).join(' ')

function TripDetail({ rows, id, onClose, onGo, c, color }) {
  const i = rows.findIndex(r => r.id === id), r = rows[i]
  const { parts, loc } = useMemo(() => (r ? tripParts(r) : { parts: [''], loc: '' }), [r])
  const [pi, setPi] = useState(0)
  const [photos, setPhotos] = useState(null)
  const box = useRef(null)
  const q = mapsQ(parts[pi] || parts[0], loc)
  useEffect(() => { setPi(0) }, [id])
  useEffect(() => {
    let ok = true; setPhotos(null)
    loadPlace(parts[pi] || parts[0]).then(l => ok && setPhotos(l)).catch(() => ok && setPhotos([]))
    return () => { ok = false }
  }, [id, pi]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const key = e => { if (e.key === 'Escape') onClose(); else if (e.key === 'ArrowRight') onGo(1); else if (e.key === 'ArrowLeft') onGo(-1) }
    addEventListener('keydown', key)
    box.current?.querySelector('.td-x')?.focus({ preventScroll: true })
    if (!reduceMotion()) gsap.fromTo(box.current, { y: 70, scale: 0.9, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.5)' })
    return () => { removeEventListener('keydown', key); document.documentElement.style.overflow = prev }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  if (!r) return null
  const title = tidy(r) + (r.addOn ? ' (add-on)' : '')
  const meta = [r.location, durText(r.duration)].filter(Boolean).join(' \u00b7 ')
  return createPortal(
    <div className="td-back" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="td" ref={box} role="dialog" aria-modal="true" aria-labelledby="td-t" style={{ '--c': color }}>
        <button type="button" className="td-x" onClick={onClose} aria-label="Close trip details">{'\u00d7'}</button>
        <div className={'td-ph n' + (photos ? photos.length : 0)}>
          {photos && photos.length > 0
            ? photos.map(p => <img key={p.file} src={p.src} alt={'Picture of ' + p.cap} loading="lazy" />)
            : <div className="td-ill"><Icon n={KIND_ICON[c.slug]} size={96} /><span>{photos === null ? 'Looking for pictures...' : 'See the place on Google below'}</span></div>}
        </div>
        <div className="td-body">
          <p className="td-kind">{c.title} <span>{i + 1} of {rows.length}</span></p>
          <h3 id="td-t">{title}</h3>
          {meta && <p className="td-meta">{meta}</p>}
          <div className="td-chips"><span>{SHOW ? 'Per student' : 'Suitable for'}</span>{Object.entries(r.rates).map(([b, v]) => <b key={b}>{BAND_LABEL[b] || b}{SHOW ? `: ${formatRupees(v)}` : ''}</b>)}</div>
          {parts.length > 1 && (
            <div className="td-tabs" role="tablist" aria-label="Places on this trip">
              {parts.map((p, k) => <button key={p} type="button" role="tab" aria-selected={pi === k} onClick={() => setPi(k)}>{pretty(p)}</button>)}
            </div>
          )}
          <div className="td-map"><iframe key={q} title={'Google map: ' + q} src={'https://www.google.com/maps?q=' + encodeURIComponent(q) + '&output=embed'} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
          <p className="td-note">The address, reviews and more photos of {pretty(parts[pi] || parts[0])} are shown by Google Maps above.</p>
          <div className="td-actions">
            <a className="td-ask" href={waLink(`Hello Memories Unlimited! I am interested in "${tidy(r)}" (${c.title}). Please share a quote and dates.`)} target="_blank" rel="noopener noreferrer">Ask about this trip<span className="sr-only"> (opens WhatsApp in a new tab)</span></a>
            <a href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q)} target="_blank" rel="noopener noreferrer">Open in Google Maps<span className="sr-only"> (new tab)</span></a>
            <a href={'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(q)} target="_blank" rel="noopener noreferrer">More photos on Google<span className="sr-only"> (new tab)</span></a>
          </div>
          <div className="td-nav"><button type="button" onClick={() => onGo(-1)} disabled={i <= 0}>{'\u2190'} Previous</button><button type="button" onClick={() => onGo(1)} disabled={i >= rows.length - 1}>Next {'\u2192'}</button></div>
        </div>
      </div>
    </div>, document.body)
}

function TripList({ rows, c, color, onOpen }) {
  return (
    <ol className="tl">
      {rows.map((r, i) => (
        <li key={r.id}>
          <button type="button" className="tl-row" style={{ '--c': color }} onClick={() => onOpen(r.id)} aria-haspopup="dialog">
            <span className="tl-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <span className="tl-main"><b>{tidy(r)}{r.addOn ? ' (add-on)' : ''}</b><span>{[r.location, durText(r.duration)].filter(Boolean).join(' \u00b7 ') || c.title}</span></span>
            <span className="tl-chips">{Object.keys(r.rates).map(b => <i key={b}>{BAND_LABEL[b] || b}</i>)}</span>
            <span className="tl-go" aria-hidden="true">View {'\u2192'}</span>
          </button>
        </li>
      ))}
    </ol>
  )
}

export function TourCategory({ slug }) {
  const c = bySlug(slug)
  useTitle(c ? c.title : 'Not found')
  const [band, setBand] = useState('all')
  const [sel, setSel] = useState(null)
  const cf = useMemo(() => (c ? config(c.slug, c.rows) : null), [c])
  const photos = useDestPhotos(cf ? cf.photos : [])
  if (!c) return <NotFound />
  const bands = [...new Set(c.rows.flatMap(r => Object.keys(r.rates)))]
  const rows = band === 'all' ? c.rows : c.rows.filter(r => r.rates[band] !== undefined)
  const others = CATEGORIES.filter(x => x.slug !== c.slug)
  return (
    <PageShell theme={cf.theme}>
      <Hero variant={cf.variant} photos={photos} art={cf.art} title={cf.title} lead={c.blurb} chips={cf.chips.filter(Boolean)}
        crumb={<p className="crumb"><a href="/tours">Trips</a> / <a href={'/tours#' + groupOf(c.slug).id}>{groupOf(c.slug).title}</a> / {c.title}</p>}
        actions={<><WaButton text={`Hello Memories Unlimited! I would like a quote for: ${c.title}. Please share options and dates.`}>Get a quote</WaButton><a className="pg-btn ghost on-dark" href="#trips">See all {c.rows.length} trips</a></>} />
      <TrustRibbon hideOnPhone />
      <Section title="What to expect">
        <Pillars items={cf.pillars} />
      </Section>
      <Section id="trips" tone="soft" title={`All ${c.rows.length} trips`} lead={SHOW ? 'Rates are per student, before GST.' : 'Rates depend on your group size, grade and travel date. Ask us and we will send a quote.'}>
        {bands.length > 1 && (
          <div className="filters" role="group" aria-label="Filter by grade">
            <button type="button" aria-pressed={band === 'all'} onClick={() => setBand('all')}>All grades</button>
            {bands.map(b => <button type="button" key={b} aria-pressed={band === b} onClick={() => setBand(b)}>{BAND_LABEL[b] || b}</button>)}
          </div>
        )}
        <p className="count" role="status" aria-live="polite">Showing {rows.length} of {c.rows.length} trips</p>
        <TripList rows={rows} c={c} color={groupOf(c.slug).color} onOpen={setSel} />
        {sel && <TripDetail rows={rows} id={sel} c={c} color={groupOf(c.slug).color} onClose={() => setSel(null)} onGo={d => { const k = rows.findIndex(r => r.id === sel) + d; if (rows[k]) setSel(rows[k].id) }} />}
      </Section>
      <Section title="How to book">
        <Steps items={STEPS.slice(0, 3)} />
      </Section>
      <Section tone="soft" title="Explore other kinds of trips">
        <OtherTrips items={others} />
      </Section>
      <CtaBand wa={`Hello Memories Unlimited! I would like a quote for: ${c.title}.`} />
    </PageShell>
  )
}

export function NotFound() {
  useTitle('Page not found')
  const photos = useDestPhotos(['h-pune', 'h-shaniwar'])
  return (
    <PageShell theme="blue">
      <Hero variant="center" photos={photos} title="We could not find that page" lead="The link may be old or mistyped." art={<Art.Compass />}
        actions={<><a className="pg-btn" href="/">Back to the home page</a><a className="pg-btn ghost on-dark" href="/tours">See our tours</a></>} />
    </PageShell>
  )
}
