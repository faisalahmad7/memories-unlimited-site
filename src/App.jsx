import { useEffect, useMemo, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Aurora from './rb/Aurora/Aurora.jsx'
import SplitText from './rb/SplitText/SplitText.jsx'
import ScrollReveal from './rb/ScrollReveal/ScrollReveal.jsx'
import ScrollVelocity from './rb/ScrollVelocity/ScrollVelocity.jsx'
import CircularText from './rb/CircularText/CircularText.jsx'
import ImageTrail from './rb/ImageTrail/ImageTrail.jsx'
import Magnet from './rb/Magnet/Magnet.jsx'
import GlareHover from './rb/GlareHover/GlareHover.jsx'
import ClickSpark from './rb/ClickSpark/ClickSpark.jsx'
import { CONFIG, hasAddress, fmtPhone, telHref, waLink, WA_HELLO, DIRECTIONS_URL } from './site.config.js'
import { TOURS, EXTRA, FLYERS } from './tours.js'
import { loadPhotos, GALLERY } from './photos.js'
import NavMenus from './NavMenu.jsx'
import TrustRibbon from './TrustRibbon.jsx'
import { GROUPS as TRIP_KINDS } from './groups.js'
import { YEARS, FOUNDED, OWNER, EXPERIENCE } from './trust.js'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const askAbout = n => { window.dispatchEvent(new CustomEvent('mu-dest', { detail: n })); go('#enquire') }
function usePhotos() {
  const [g, setG] = useState({}); const [done, setDone] = useState(false)
  useEffect(() => { let ok = true; loadPhotos(r => ok && setG(r)).then(r => { if (ok) { setG(r); setDone(true) } }).catch(() => ok && setDone(true)); return () => { ok = false } }, [])
  const spots = useMemo(() => Object.fromEntries(Object.entries(g).filter(([, v]) => v?.length).map(([k, v]) => [k, v[0]])), [g])
  return { spots, gallery: g, done }
}
// Footer and other links: open the gallery on a given destination.
const showGallery = id => { window.dispatchEvent(new CustomEvent('mu-gallery', { detail: id })); go('#gallery') }
const mqPhone = () => window.matchMedia('(max-width: 700px)')
function useIsPhone() {
  const [p, setP] = useState(() => mqPhone().matches)
  useEffect(() => { const m = mqPhone(), h = () => setP(m.matches); m.addEventListener('change', h); return () => m.removeEventListener('change', h) }, [])
  return p
}
const go = sel => { const el = document.querySelector(sel); if (el) window.__lenis ? window.__lenis.scrollTo(el) : el.scrollIntoView() }

// Hand-drawn doodles: each is a few stroked paths in a 100x100 box. GSAP draws them on scroll, floats them, and nudges them with the pointer.
const PATHS = {
  star: ['M50 8 L61 38 L93 40 L68 60 L77 92 L50 74 L23 92 L32 60 L7 40 L39 38 Z'],
  plane: ['M6 46 L94 10 L66 90 L48 58 Z', 'M94 10 L48 58'],
  globe: ['M8 50 a42 42 0 1 0 84 0 a42 42 0 1 0 -84 0', 'M8 50 H92', 'M50 8 C28 28 28 72 50 92', 'M50 8 C72 28 72 72 50 92'],
  pencil: ['M14 86 L20 62 L74 8 L92 26 L38 80 Z', 'M20 62 L38 80', 'M64 18 L82 36'],
  sun: ['M30 50 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0', 'M50 4 V16', 'M50 84 V96', 'M4 50 H16', 'M84 50 H96', 'M17 17 L25 25', 'M75 75 L83 83', 'M83 17 L75 25', 'M17 83 L25 75'],
  cloud: ['M24 72 C6 72 6 44 28 46 C30 26 62 22 68 42 C92 38 96 72 74 72 Z'],
  bus: ['M10 26 H90 V74 H10 Z', 'M10 56 H90', 'M18 34 H38 V48 H18 Z', 'M46 34 H66 V48 H46 Z', 'M74 34 H82 V48 H74 Z', 'M22 74 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0', 'M62 74 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0'],
  book: ['M50 24 C36 14 18 14 8 20 V78 C18 72 36 72 50 82 C64 72 82 72 92 78 V20 C82 14 64 14 50 24 Z', 'M50 24 V82'],
  backpack: ['M28 30 C28 10 72 10 72 30', 'M20 30 H80 V90 H20 Z', 'M32 58 H68 V80 H32 Z', 'M50 58 V68'],
  heart: ['M50 88 C10 56 6 28 26 18 C38 12 48 20 50 30 C52 20 62 12 74 18 C94 28 90 56 50 88 Z'],
  camera: ['M10 30 H30 L36 20 H64 L70 30 H90 V80 H10 Z', 'M34 56 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0'],
  squiggle: ['M6 50 Q20 14 34 50 T62 50 T90 50'],
  mountain: ['M4 86 L34 30 L52 60 L66 40 L96 86 Z', 'M26 44 L34 50 L42 44'],
  flag: ['M24 92 V10', 'M24 12 H80 L66 30 L80 48 H24'],
  swoosh: ['M8 74 C30 10 70 10 88 60', 'M88 60 L74 56', 'M88 60 L90 44'],
  spark: ['M50 6 V32', 'M50 68 V94', 'M6 50 H32', 'M68 50 H94'],
  ruler: ['M8 34 L66 92 L92 66 L34 8 Z', 'M22 48 L30 40', 'M34 60 L42 52', 'M46 72 L54 64'],
}
// [shape, colour, size px, left, top, tilt deg, pointer depth, hide on phones]
function Doodles({ items }) {
  return (
    <div className="doods" aria-hidden="true">
      {items.map(([n, c, sz, x, y, r, d, hm], i) => (
        <span key={i} className={'dood' + (hm ? ' hm' : '')} data-d={d || 1} style={{ left: x, top: y, width: sz, height: sz, color: c, '--r': (r || 0) + 'deg' }}>
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">{PATHS[n].map((d2, j) => <path key={j} d={d2} pathLength="1" className="dd" />)}</svg>
        </span>
      ))}
    </div>
  )
}
const Wave = ({ fill }) => <svg className="wv" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" style={{ color: fill }}><path d="M0 0 H1440 V28 C1200 70 1000 -6 720 30 C440 66 240 -4 0 34 Z" fill="currentColor" /></svg>
const Y = '#ffc83d', SKY = '#2bb3f0', CORAL = '#ff6b57', MINT = '#4ad08a', NV = '#1c3f9e', WH = '#ffffff'

// ONE smooth-scroll system: Lenis driven by the GSAP ticker.
function useSmoothScroll() {
  useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({ lerp: 0.1 })
    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = t => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy(); window.__lenis = null }
  }, [])
}

function Nav() {
  const [hide, setHide] = useState(false)
  useEffect(() => {
    let last = window.scrollY, ticking = false
    const f = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const n = window.scrollY, d = n - last
        if (n < 80) setHide(false)
        else if (d > 6) setHide(true)
        else if (d < -6) setHide(false)
        if (Math.abs(d) > 6) last = n
        ticking = false
      })
    }
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  const L = (id, t, cls) => <a className={cls} href={id} onClick={e => { e.preventDefault(); go(id) }}>{t}</a>
  return (
    <nav className={'nav' + (hide ? ' hide' : '')} aria-label="Main">
      <a className="brand" href="#top" onClick={e => { e.preventDefault(); go('#top') }}>
        <img className="logo logo-wide" src="/brand/logo-nav.webp" alt="Memories Unlimited Tours and Travels" />
      </a>
      <div><NavMenus onHash={go} />{L('#enquire', 'Enquire', 'pill')}</div>
    </nav>
  )
}

const SIDE = [['top', 'Home'], ['about', 'About'], ['tours', 'Tours'], ['gallery', 'Gallery'], ['reviews', 'Reviews'], ['trail', 'Flyers'], ['enquire', 'Enquire']]
function SideNav() {
  const [cur, setCur] = useState('top')
  const [scrub, setScrub] = useState(false)
  const [flash, setFlash] = useState(false)
  const nav = useRef(), fl = useRef(0)
  const st = useRef({ timer: 0, down: false, scrub: false, y0: 0, last: -1, block: false })
  useEffect(() => {
    const ctx = gsap.context(() => {
      SIDE.forEach(([id]) => ScrollTrigger.create({ trigger: '#' + id, start: 'top 55%', end: 'bottom 55%', onToggle: st => st.isActive && setCur(id) }))
      if (!reduce) gsap.fromTo('.sn-fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 } })
    })
    return () => ctx.revert()
  }, [])
  // Only the dots themselves are touchable. Tap = go to that section. Press and hold (or press and drag) = scrub
  // through the sections instantly, like flicking through story slides.
  const nearest = y => { let best = 0, d = 1e9; nav.current.querySelectorAll('a i').forEach((n, i) => { const r = n.getBoundingClientRect(), dd = Math.abs(y - (r.top + r.height / 2)); if (dd < d) { d = dd; best = i } }); return best }
  const jump = i => { const el = document.getElementById(SIDE[i][0]); if (!el) return; window.__lenis ? window.__lenis.scrollTo(el, { immediate: true }) : el.scrollIntoView(); setCur(SIDE[i][0]) }
  const buzz = n => { try { navigator.vibrate && navigator.vibrate(n) } catch (e) { } }
  const begin = e => {
    const dot = e.target.closest && e.target.closest('i'); if (!dot) return
    const s = st.current; s.down = true; s.scrub = false; s.y0 = e.clientY; s.last = nearest(e.clientY)
    try { dot.setPointerCapture(e.pointerId) } catch (err) { }
    clearTimeout(s.timer)
    s.timer = setTimeout(() => { if (s.down) { s.scrub = true; setFlash(false); setScrub(true); buzz(10) } }, 220)
  }
  const move = e => {
    const s = st.current; if (!s.down) return
    if (!s.scrub && Math.abs(e.clientY - s.y0) > 8) { clearTimeout(s.timer); s.scrub = true; setFlash(false); setScrub(true) }
    if (!s.scrub) return
    const i = nearest(e.clientY)
    if (i !== s.last) { s.last = i; jump(i); buzz(6) }
  }
  const end = () => {
    const s = st.current; clearTimeout(s.timer)
    if (s.scrub) {
      s.block = true; setTimeout(() => { s.block = false }, 350)
      // the label of the section you landed on blinks twice, quickly, then goes away
      setFlash(true); clearTimeout(fl.current); fl.current = setTimeout(() => setFlash(false), 520)
    }
    s.down = false; s.scrub = false; setScrub(false)
    const ae = document.activeElement; if (ae && nav.current && nav.current.contains(ae) && ae.blur) ae.blur()
  }
  return (
    <nav ref={nav} className={'sn' + (cur === 'top' ? ' atop' : '') + (scrub ? ' scrub' : '') + (flash ? ' flash' : '')} aria-label="Page sections" onPointerDown={begin} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onContextMenu={e => e.preventDefault()}>
      <span className="sn-line" aria-hidden="true"><span className="sn-fill" /></span>
      {SIDE.map(([id, t]) => <a key={id} href={'#' + id} draggable="false" className={cur === id ? 'on' : ''} aria-label={t} aria-current={cur === id ? 'true' : undefined} onClick={e => { e.preventDefault(); if (st.current.block) return; go('#' + id) }}><span className="sn-t">{t}</span><i /></a>)}
    </nav>
  )
}

const STOP_IDS = ['singapore', 'hampi', 'jaipur', 'mahabaleshwar', 'ahmedabad', 'imagicaa', 'goa', 'manali', 'kerala']
const ALL = [...TOURS, ...EXTRA]
// Home hero: one big photo that changes with a circular GSAP reveal, a headline that rises word by word, and a single
// destination ticket (number, name, progress). Nothing else competes with the headline; the trust facts follow right below.
const HX_MS = 5200
function Hero({ photos }) {
  const root = useRef(), prev = useRef(-1), prog = useRef(null), holdRef = useRef(false)
  const [si, setSi] = useState(0)
  const [hold, setHold] = useState(false)
  const N = STOP_IDS.length
  const phone = useIsPhone()
  // Only the photo on screen and the next one are loaded; the rest wait their turn (big saving on phone data).
  const [seen, setSeen] = useState(() => new Set([0, 1]))
  useEffect(() => { setSeen(p => (p.has(si) && p.has((si + 1) % N) ? p : new Set([...p, si, (si + 1) % N]))) }, [si, N])
  const cur = ALL.find(t => t.id === STOP_IDS[si])

  // Intro, once: headline words rise out of masks, the underline draws itself, then buttons and ticket arrive.
  useEffect(() => {
    if (reduce) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('.hx-w > span', { yPercent: 115, rotate: 4, duration: 1.15, stagger: 0.09 }, 0.15)
        .from('.hx-line path', { strokeDashoffset: 320, duration: 1.1, ease: 'power2.inOut' }, 0.9)
        .from('.hx-sub', { y: 24, opacity: 0, duration: 0.9 }, 0.8)
        .from('.hx-cta > *, .hx-kinds', { y: 22, opacity: 0, duration: 0.8, stagger: 0.1 }, 1.0)
        .from('.hx-ticket', { y: 40, opacity: 0, duration: 1 }, 1.1)
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.hx-layers', { yPercent: 12, ease: 'none', scrollTrigger: st })
      gsap.to('.hx-copy', { yPercent: -12, opacity: 0.15, ease: 'none', scrollTrigger: st })
      if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const mx = gsap.quickTo('.hx-img-wrap', 'x', { duration: 1.2, ease: 'power3' }), my = gsap.quickTo('.hx-img-wrap', 'y', { duration: 1.2, ease: 'power3' })
        const mv = e => { mx((e.clientX / innerWidth - 0.5) * -26); my((e.clientY / innerHeight - 0.5) * -18) }
        addEventListener('pointermove', mv)
        return () => removeEventListener('pointermove', mv)
      }
    }, root)
    return () => ctx.revert()
  }, [])

  // Each time the destination changes: the new photo opens as a circle from the lower right, the name slides in.
  useEffect(() => {
    const els = root.current.querySelectorAll('.hx-img'), el = els[si], p = prev.current
    prev.current = si
    if (!el) return
    if (reduce || p < 0 || p === si) { gsap.set(els, { opacity: 0, zIndex: 0 }); gsap.set(el, { opacity: 1, zIndex: 2, clipPath: 'none' }); if (!reduce && p < 0) gsap.fromTo(el, { scale: 1.12 }, { scale: 1, duration: 2.4, ease: 'power2.out' }); return }
    const old = els[p]
    gsap.set(old, { zIndex: 1 })
    const tw = gsap.fromTo(el, { opacity: 1, zIndex: 2, scale: 1.18, clipPath: 'circle(0% at 82% 78%)' }, { scale: 1, clipPath: 'circle(150% at 82% 78%)', duration: 1.5, ease: 'power3.inOut', onComplete: () => { gsap.set(old, { opacity: 0, zIndex: 0 }); gsap.set(el, { clipPath: 'none' }) } })
    const nm = gsap.fromTo('.hx-name > span', { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'power4.out', delay: 0.25 })
    return () => { tw.progress(1); nm.progress(1) }
  }, [si])

  // The progress tween on the active tick drives the auto-advance. Hover or focus on the ticket pauses it (WCAG 2.2.2).
  useEffect(() => {
    if (reduce) return
    const fill = root.current.querySelector('.hx-tick.on .hx-fill')
    if (!fill) return
    prog.current = gsap.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: HX_MS / 1000, ease: 'none', onComplete: () => setSi(x => (x + 1) % N) })
    if (holdRef.current) prog.current.pause()
    return () => prog.current?.kill()
  }, [si, N])
  useEffect(() => { holdRef.current = hold; prog.current && (hold ? prog.current.pause() : prog.current.play()) }, [hold])

  return (
    <header className="hx" id="top" ref={root}>
      <div className="hx-layers" aria-hidden="true">
        <div className="hx-img-wrap">{STOP_IDS.map((id, i) => <div key={id} className="hx-img" style={photos[id] && seen.has(i) ? { backgroundImage: `url(${photos[id].src})` } : undefined} />)}</div>
      </div>
      <div className="hx-shade" aria-hidden="true" />
      <div className="hx-copy">
        <h1 className="hx-h1" aria-label="Learning beyond the classroom">
          <span className="hx-row" aria-hidden="true"><span className="hx-w"><span>Learning</span></span> <span className="hx-w hx-gold"><span>beyond</span><svg className="hx-line" viewBox="0 0 300 18" preserveAspectRatio="none"><path d="M3 12 C 60 2, 120 18, 180 8 S 270 6, 297 11" pathLength="320" strokeDasharray="320" /></svg></span></span>
          <span className="hx-row" aria-hidden="true"><span className="hx-w"><span>the</span></span> <span className="hx-w"><span>classroom.</span></span></span>
        </h1>
        <p className="hx-sub">School trips, educational tours and industrial visits, planned from Pune and Mumbai.</p>
        <div className="hx-cta">
          {phone
            ? <a className="btn gold hx-all" href="/tours">Explore all school trips</a>
            : <button className="btn gold" onClick={() => go('#enquire')}>Plan our school trip</button>}
          {phone
            ? <button className="btn ghost" onClick={() => go('#enquire')}>Plan our school trip</button>
            : <button className="btn ghost" onClick={() => go('#tours')}>See our tours</button>}
        </div>
        {phone && (
          <ul className="hx-kinds" aria-label="Kinds of trips we plan">
            {TRIP_KINDS.map(g => <li key={g.id}><a href={'/tours#' + g.id} style={{ '--c': g.color }}>{g.short}</a></li>)}
          </ul>
        )}
      </div>
      <div className="hx-ticket" role="group" aria-label="Destinations we plan trips to" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
        <div className="hx-count" aria-hidden="true"><b>{String(si + 1).padStart(2, '0')}</b><span>/ {String(N).padStart(2, '0')}</span></div>
        <div className="hx-dest" aria-live="polite">
          <span className="hx-name"><span key={si}>{cur.name}</span></span>
          <span className="hx-meta">{cur.list ? cur.tag + (cur.price ? ', ' + cur.price : '') : 'Ask us about this trip'}</span>
        </div>
        <ol className="hx-ticks">{STOP_IDS.map((id, i) => { const t = ALL.find(x => x.id === id); return (
          <li key={id}><button type="button" className={'hx-tick' + (i === si ? ' on' : '')} aria-label={t.name.split(',')[0]} aria-current={i === si ? 'true' : undefined} onClick={() => setSi(i)}><i className="hx-fill" /></button></li>) })}</ol>
      </div>
    </header>
  )
}

// "Every trip, a memory": plain scroll-linked sliding. No pinning, no hidden states, uses only local flyer images.
function Reel() {
  const root = useRef()
  const names = [...TOURS.map(t => t.name.split(',')[0].replace(' and Agra', '')), 'Imagicaa', 'Goa', 'Manali', 'Kerala']
  const row = [...names, ...names]
  useEffect(() => {
    if (reduce) return
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
      gsap.fromTo('.reel-a', { xPercent: 6 }, { xPercent: -22, ease: 'none', scrollTrigger: st })
      gsap.fromTo('.reel-b', { xPercent: -18 }, { xPercent: 6, ease: 'none', scrollTrigger: st })
      gsap.fromTo('.reel-r1', { xPercent: -30 }, { xPercent: 0, ease: 'none', scrollTrigger: st })
      gsap.fromTo('.reel-r2', { xPercent: 0 }, { xPercent: -30, ease: 'none', scrollTrigger: st })
    }, root)
    return () => ctx.revert()
  }, [])
  const strip = (cls, list) => <div className={'reel-row ' + cls} aria-hidden="true">{list.map((n, i) => <span key={i}>{n}<i>✦</i></span>)}</div>
  return (
    <section className="reel" ref={root}>
      <h2 className="reel-h"><span className="reel-a">Every trip</span><span className="reel-b"><mark>a memory</mark></span></h2>
      {strip('reel-r1', row)}
      {strip('reel-r2', [...row].reverse())}
    </section>
  )
}

// Google reviews. We show NO star rating and NO review count: those figures in the earlier code could not be verified
// against the live Google listing, so they were removed (handoff task 3). The three excerpts below were supplied by the
// owner from the Google listing; the author and date of each are unknown, so none is shown. Replace with verified,
// dated excerpts when the owner confirms them. The link opens the real Google Maps listing, where reviews can be read.
// `tag` and `icon` describe what the sentence is about (they are not extra claims). No rating or count is shown anywhere.
const REVIEWS = [
  { q: 'Special mention for the frequent water checks and delicious food arrangements.', tag: 'Food and water', icon: 'plate' },
  { q: 'Catered to the tastes of the children as well as the staff.', tag: 'Children and staff', icon: 'kids' },
  { q: 'The food, the people, the vibes - everything was top-notch!', tag: 'The whole trip', icon: 'spark' },
]
// Every line below is also on the Safety and FAQs pages.
const CARE = ['A trip leader travels with your group', 'Our own coaches and vehicles', 'Hygienic meals and drinking water', 'One teacher or staff member free for every 20 students']
const RvIcon = ({ n }) => {
  const P = { plate: <><circle cx="24" cy="24" r="14" /><circle cx="24" cy="24" r="7" /><path d="M6 8v10M10 8v10M14 8v10M10 18v22M42 8c-4 3-5 9-5 14h5v18" /></>,
    kids: <><circle cx="16" cy="16" r="6" /><circle cx="34" cy="20" r="5" /><path d="M6 40c0-9 5-14 10-14s10 5 10 14M28 40c0-7 3-11 6-11s8 4 8 11" /></>,
    spark: <><path d="M24 4l4.5 13.5L42 22l-13.5 4.5L24 40l-4.5-13.5L6 22l13.5-4.5z" /><path d="M38 6v8M34 10h8" /></> }
  return <svg className="rvx-ic" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">{P[n]}</svg>
}
function Reviews() {
  const root = useRef()
  useEffect(() => {
    if (reduce) return
    const ctx = gsap.context(() => {
      gsap.from('.rvx-card', { y: 46, opacity: 0, rotate: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: root.current, start: 'top 72%', once: true } })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section className="rvs" id="reviews" ref={root}>
      <Wave fill="#fffaf0" />
      <Doodles items={[['star', NV, 56, '5%', '14%', -12, 1.4], ['star', CORAL, 36, '11%', '60%', 10, 1, 1], ['heart', CORAL, 64, '88%', '18%', 10, 1.6], ['star', NV, 44, '92%', '66%', 16, 1, 1], ['squiggle', NV, 120, '70%', '86%', 0, 1.2, 1]]} />
      <div className="wrap">
        <h2>What families say on Google</h2>
        <p className="rv-sub">Three lines from our Google listing. Every review, with the name and date, is on Google.</p>
        <div className="rvx-grid">
          {REVIEWS.map((r, i) => (
            <figure className={'rvx-card rvx-q' + (i + 1)} key={r.q}>
              <span className="rvx-top"><RvIcon n={r.icon} /><span className="rvx-tag">{r.tag}</span></span>
              <blockquote>{r.q}</blockquote>
              <figcaption>From our Google listing</figcaption>
            </figure>
          ))}
          <aside className="rvx-card rvx-care" aria-labelledby="rvx-care-h">
            <h3 id="rvx-care-h">How we look after a group</h3>
            <ul>{CARE.map(c => <li key={c}>{c}</li>)}</ul>
            <a className="rvx-link" href="/safety">Read about student care</a>
          </aside>
          <aside className="rvx-card rvx-cta">
            <h3>Travelled with us?</h3>
            <p>Your words help the next school choose. Share a few lines on Google.</p>
            <a className="btn gold" href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer">Read and write reviews on Google<span className="sr-only"> (opens in a new tab)</span></a>
          </aside>
        </div>
      </div>
    </section>
  )
}

function Tours({ onOpen, photos }) {
  const track = useRef(), pos = useRef(0), paused = useRef(false)
  useEffect(() => {
    // Gentle auto-drift is for mouse users only. On phones and tablets it fought the finger (the loop kept
    // rewriting the scroll position mid-swipe), so touch devices get plain native swiping with snap instead.
    if (reduce || window.matchMedia('(hover: none), (pointer: coarse)').matches) return
    let raf, dir = 1
    const step = () => {
      const t = track.current
      if (t && !paused.current) {
        pos.current += 0.7 * dir
        if (pos.current + t.clientWidth >= t.scrollWidth) { dir = -1; pos.current = t.scrollWidth - t.clientWidth }
        else if (pos.current <= 0) { dir = 1; pos.current = 0 }
        t.scrollLeft = pos.current
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])
  useEffect(() => {
    if (reduce) return
    const ctx = gsap.context(() => {
      gsap.from('.tours .cardwrap', { y: 70, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09, scrollTrigger: { trigger: '.tours .track', start: 'top 85%', once: true } })
    })
    return () => ctx.revert()
  }, [])
  const hold = () => { paused.current = true }
  const resume = (ms = 0) => setTimeout(() => { pos.current = track.current.scrollLeft; paused.current = false }, ms)
  const nudge = d => { hold(); track.current.scrollBy({ left: d * Math.min(360, window.innerWidth * 0.8), behavior: 'smooth' }); resume(1200) }
  return (
    <section className="tours" id="tours">
      <Doodles items={[['plane', Y, 86, '84%', '3%', 8, 1.6], ['globe', SKY, 74, '3%', '80%', -8, 1.2, 1], ['star', Y, 36, '46%', '91%', 0, 1], ['mountain', MINT, 90, '88%', '84%', 0, 1.4, 1], ['cloud', WH, 100, '42%', '1%', 0, 0.8, 1]]} />
      <div className="th">
        <div className="rv"><h2>Where we can take your class</h2><p>Prices are as printed on our flyers. Tap a tour to see its photos just below.</p></div>
        <div className="arrows"><button onClick={() => nudge(-1)} aria-label="Scroll tours left">‹</button><button onClick={() => nudge(1)} aria-label="Scroll tours right">›</button></div>
      </div>
      <div className="track" ref={track} data-lenis-prevent-touch="true" onPointerEnter={hold} onPointerLeave={() => resume()} onTouchStart={hold} onTouchEnd={() => resume(1800)} onFocus={hold} onBlur={() => resume()}>
        {[...TOURS, ...EXTRA].map(t => {
          const p = photos[t.id]; return (
            <GlareHover key={t.id} width="clamp(250px, 26vw, 360px)" height="auto" borderRadius="22px" glareColor="#ffffff" glareOpacity={0.4} className="cardwrap">
              <button className="card" onClick={() => (GALLERY[t.id] ? showGallery(t.id) : t.list ? onOpen(t) : askAbout(t.name))} aria-label={`${t.name}: see photos`}>
                {p ? <img src={p.src} alt={t.name} loading="lazy" /> : <span className="phf">{t.name}</span>}
                <span className="meta"><b>{t.name}</b><i>{t.price || (t.list ? 'Price on request' : 'Ask us about this trip')}</i></span>
              </button>
            </GlareHover>)
        })}
      </div>
    </section>
  )
}

function Modal({ t, onClose, photos }) {
  const [fl, setFl] = useState(!!t.flyer)
  useEffect(() => {
    window.__lenis && window.__lenis.stop(); document.body.style.overflow = 'hidden'
    const k = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => { window.removeEventListener('keydown', k); window.__lenis && window.__lenis.start(); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div className="ov" onClick={onClose}>
      <div className={fl ? 'sheet big' : 'sheet'} role="dialog" aria-modal="true" aria-label={t.name} onClick={e => e.stopPropagation()}>
        <button className="x" onClick={onClose} aria-label="Close">×</button>
        <img src={fl ? t.img : (photos[t.id]?.src || t.img)} alt={fl ? `${t.name} flyer` : t.name} className={fl ? 'ph tall' : 'ph'} />
        <div className="sb">
          <h3>{t.name}</h3>
          {fl && <p className="fine"><a href={t.img} target="_blank" rel="noopener noreferrer">Open the flyer full size</a></p>}
          <p>{t.tag} · {t.price || 'Price on request'}</p>
          <h4>{t.lh}</h4><ul>{t.list.map(i => <li key={i}>{i}</li>)}</ul>
          {t.plan && (<><h4>Proposed itinerary</h4><ul>{t.plan.map(([d, x]) => <li key={d}><b>{d}:</b> {x}</li>)}</ul></>)}
          <p className="fine">Details are as printed on our flyer. Please confirm dates, price and inclusions when you enquire.</p>
          <button className="btn ghost" onClick={() => setFl(!fl)}>{fl ? 'See the photo' : 'View the flyer'}</button>{' '}
          <button className="btn gold" onClick={() => { onClose(); setTimeout(() => askAbout(t.name), 60) }}>Enquire about this tour</button>
        </div>
      </div>
    </div>
  )
}

function Gallery({ gallery, done, onOpen }) {
  const [tab, setTab] = useState('singapore')
  const [lb, setLb] = useState(null)
  const isPhone = useIsPhone()
  const [more, setMore] = useState(false)
  useEffect(() => { setMore(false) }, [tab])
  useEffect(() => { const t = setTimeout(() => ScrollTrigger.refresh(), 750); return () => clearTimeout(t) }, [more, isPhone])
  const g = GALLERY[tab]
  const items = gallery[tab] || []
  useEffect(() => { const h = e => { if (GALLERY[e.detail]) { setTab(e.detail); setLb(null) } }; window.addEventListener('mu-gallery', h); return () => window.removeEventListener('mu-gallery', h) }, [])
  useEffect(() => {
    if (lb === null) return
    window.__lenis && window.__lenis.stop(); document.body.style.overflow = 'hidden'
    const k = e => { if (e.key === 'Escape') setLb(null); if (e.key === 'ArrowRight') setLb(i => (i + 1) % items.length); if (e.key === 'ArrowLeft') setLb(i => (i - 1 + items.length) % items.length) }
    window.addEventListener('keydown', k)
    return () => { window.removeEventListener('keydown', k); window.__lenis && window.__lenis.start(); document.body.style.overflow = '' }
  }, [lb, items.length])
  const cur = lb !== null ? items[lb] : null
  const [bad, setBad] = useState({})
  const shown = items.filter(p => !bad[p.file])
  const vis = isPhone && !more ? shown.slice(0, 4) : shown
  return (
    <section className="gal" id="gallery">
      <Wave fill="#1c3f9e" />
      <Doodles items={[['camera', CORAL, 84, '3%', '9%', -10, 1.4], ['mountain', SKY, 90, '90%', '6%', 0, 1.2, 1], ['heart', CORAL, 44, '94%', '52%', 12, 1, 1], ['flag', MINT, 64, '2%', '60%', -6, 1.4, 1], ['star', Y, 40, '50%', '3%', 10, 1.8]]} />
      <div className="wrap rv">
        <h2>Places you will see</h2>
        <p className="gnote">Photos of the places on each tour. Choose a trip.</p>
        <div className="tabs" role="tablist">{Object.entries(GALLERY).map(([k, v]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => { setTab(k); setLb(null) }}>{v.label}</button>)}</div>
        <p className="gnote">{g.note}</p>
        {(() => {
          const t = ALL.find(x => x.id === tab); return t && (
            <p className="gmore">{t.list
              ? <button className="btn ghost" onClick={() => onOpen(t)}>{t.name.split(',')[0]} details and flyer</button>
              : <button className="btn ghost" onClick={() => askAbout(t.name)}>Ask us about {t.name}</button>}</p>)
        })()}
        <div className="pgrid" key={tab}>
          {vis.length ? vis.map((p, i) => (
            <button key={p.file} className="gi" style={{ '--i': isPhone && more && i >= 4 ? i - 4 : i, '--tilt': (i % 2 ? 1 : -1) * (1 + (i % 3) * 0.5) + 'deg' }} onClick={() => setLb(items.indexOf(p))} aria-label={`Open photo: ${p.cap}`}><img src={p.src} alt={p.cap} loading="lazy" decoding="async" onError={() => setBad(b => ({ ...b, [p.file]: 1 }))} /><span>{p.cap}</span></button>
          )) : done ? <p>We could not load these photos right now. Please refresh the page in a moment.</p>
            : Array.from({ length: 8 }, (_, i) => <span key={i} className="gi gsk" aria-hidden="true" style={{ '--i': i }} />)}
        </div>
        {isPhone && shown.length > 4 && <p className="gmore-ph"><button className="btn ghost" aria-expanded={more} onClick={() => setMore(m => !m)}>{more ? 'Show fewer photos' : `View ${shown.length - 4} more photos`}</button></p>}
      </div>
      {cur && (
        <div className="lbx" onClick={() => setLb(null)} role="dialog" aria-modal="true" aria-label={cur.cap}>
          <button className="nv" style={{ left: '1rem' }} aria-label="Previous photo" onClick={e => { e.stopPropagation(); setLb((lb - 1 + items.length) % items.length) }}>‹</button>
          <figure onClick={e => e.stopPropagation()} style={{ margin: 0 }}><img src={cur.src} alt={cur.cap} /><figcaption>{cur.cap} · {lb + 1} of {items.length}</figcaption></figure>
          <button className="nv" style={{ right: '1rem' }} aria-label="Next photo" onClick={e => { e.stopPropagation(); setLb((lb + 1) % items.length) }}>›</button>
          <button className="x" onClick={() => setLb(null)} aria-label="Close">×</button>
        </div>
      )}
    </section>
  )
}

function FlyerBox({ i, setI }) {
  useEffect(() => {
    window.__lenis && window.__lenis.stop(); document.body.style.overflow = 'hidden'
    const k = e => { if (e.key === 'Escape') setI(null); if (e.key === 'ArrowRight') setI(x => (x + 1) % FLYERS.length); if (e.key === 'ArrowLeft') setI(x => (x - 1 + FLYERS.length) % FLYERS.length) }
    window.addEventListener('keydown', k)
    return () => { window.removeEventListener('keydown', k); window.__lenis && window.__lenis.start(); document.body.style.overflow = '' }
  }, [setI])
  const f = FLYERS[i]
  return (
    <div className="lbx" onClick={() => setI(null)} role="dialog" aria-modal="true" aria-label={f.name}>
      <button className="nv" style={{ left: '1rem' }} aria-label="Previous flyer" onClick={e => { e.stopPropagation(); setI((i - 1 + FLYERS.length) % FLYERS.length) }}>‹</button>
      <figure onClick={e => e.stopPropagation()} style={{ margin: 0 }}><img src={f.src} alt={`${f.name} flyer`} /><figcaption>{f.name} · {i + 1} of {FLYERS.length} · <a href={f.src} target="_blank" rel="noopener noreferrer">Open full size</a></figcaption></figure>
      <button className="nv" style={{ right: '1rem' }} aria-label="Next flyer" onClick={e => { e.stopPropagation(); setI((i + 1) % FLYERS.length) }}>›</button>
      <button className="x" onClick={() => setI(null)} aria-label="Close">×</button>
    </div>
  )
}

function Splash({ onReveal }) {
  const [gone, setGone] = useState(false)
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const done = () => { document.body.style.overflow = ''; setGone(true) }
    if (reduce) { onReveal(); const t = setTimeout(done, 500); return () => { clearTimeout(t); document.body.style.overflow = '' } }
    const tl = gsap.timeline({ onComplete: done })
    tl.fromTo('.sp-logo', { scale: 0.96, y: 8 }, { scale: 1, y: 0, duration: 0.45, ease: 'power3.out' })
      .fromTo('.sp-bar', { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, 0.1)
      .add(onReveal, '+=0.2')
      .to('.splash', { yPercent: -100, duration: 0.6, ease: 'power4.inOut' }, '<')
    return () => { tl.kill(); document.body.style.overflow = '' }
  }, [])
  if (gone) return null
  return <div className="splash" role="presentation"><img className="sp-logo" src="/brand/logo-white.webp" alt="Memories Unlimited Tours and Travels" /><div className="sp-bar" /></div>
}

const MONTHS = (() => { const d = new Date(); return Array.from({ length: 9 }, (_, i) => new Date(d.getFullYear(), d.getMonth() + i, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' })) })()
const DESTS = [...TOURS.map(t => t.name), 'Imagicaa', 'Goa', 'Manali', 'Kerala', "Wet'nJoy", 'Parle Factory visit', 'Not sure yet']
const GROUPS = ['Primary (classes 1 to 4)', 'Middle (classes 5 to 8)', 'Secondary (classes 9 to 12)', 'Mixed or not sure']
const STEPS = ['About you', 'Your trip', 'Review and send']

function Enquire() {
  const [step, setStep] = useState(0)
  const [f, setF] = useState({ name: '', school: '', phone: '', dest: '', count: '', month: '', group: '', note: '' })
  const [err, setErr] = useState({})
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const head = useRef(), first = useRef(true)
  const set = k => e => setF(v => ({ ...v, [k]: e.target.value }))
  useEffect(() => { const h = e => { setF(v => ({ ...v, dest: e.detail })); setStep(1); setErr({}); setMsg('') }; window.addEventListener('mu-dest', h); return () => window.removeEventListener('mu-dest', h) }, [])
  useEffect(() => { if (first.current) { first.current = false; return } head.current && head.current.focus({ preventScroll: true }) }, [step])
  const check = s => {
    const e = {}
    if (s === 0) {
      if (!f.name.trim()) e.name = 'Please tell us your name.'
      if (!f.school.trim()) e.school = 'Please enter your school name.'
      if (f.phone.replace(/\D/g, '').length < 10) e.phone = 'Please enter a 10-digit phone number so we can reach you.'
    }
    if (s === 1) {
      if (!f.dest) e.dest = 'Please choose a destination, or pick "Not sure yet".'
      if (f.count && !/^\d{1,4}$/.test(f.count.trim())) e.count = 'Please use numbers only, for example 120.'
    }
    setErr(e); return !Object.keys(e).length
  }
  const go2 = n => { setMsg(''); setSent(false); setStep(n) }
  const next = () => { if (check(step)) go2(step + 1) }
  const text = () => ['Hello Memories Unlimited, I would like to enquire about a school tour.', `Name: ${f.name}`, `School: ${f.school}`, `Phone: ${f.phone}`, `Destination: ${f.dest}`, `Students (approx): ${f.count || '-'}`, `Preferred month: ${f.month || '-'}`, `Class group: ${f.group || '-'}`, `Note: ${f.note || '-'}`].join('\n')
  const wa = () => { window.open(waLink(text()), '_blank', 'noopener'); setMsg('WhatsApp should now be open with your message ready. Press Send there to finish.') }
  const mail = () => { window.location.href = `mailto:${CONFIG.enquiryEmail}?subject=${encodeURIComponent('School tour enquiry: ' + f.dest)}&body=${encodeURIComponent(text())}`; setMsg('Your email app should now be open with your message ready. Press Send there to finish.') }
  // Real delivery: the enquiry is emailed to CONFIG.enquiryEmail as a tidy table (free FormSubmit service).
  // We only say "sent" when the service confirms it. If it fails, WhatsApp and email stay available.
  const send = async () => {
    if (busy || sent) return
    setBusy(true); setMsg('Sending your enquiry...')
    const body = {
      _subject: `New school tour enquiry: ${f.dest} - ${f.school}`, _template: 'table', _captcha: 'false', _honey: '',
      'Name': f.name.trim(), 'School': f.school.trim(), 'Phone': f.phone.trim(), 'Destination': f.dest,
      'Students (approx)': f.count || '-', 'Preferred month': f.month || '-', 'Class group': f.group || '-', 'Note': f.note.trim() || '-',
      'Sent from': 'Memories Unlimited website enquiry form',
    }
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${CONFIG.enquiryEmail}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) })
      const j = await r.json().catch(() => ({}))
      if (r.ok && (j.success === true || j.success === 'true')) { setSent(true); setMsg(`Thank you, ${f.name.trim().split(' ')[0]}! Your enquiry has been sent. We will contact you on ${f.phone.trim()}.`) }
      else throw new Error(j.message || r.status)
    } catch { setMsg('We could not send this automatically just now. Please use Send on WhatsApp or Send by email below, or call us.') }
    setBusy(false)
  }
  const copy = async () => { try { await navigator.clipboard.writeText(text()); setMsg('Message copied. Paste it into WhatsApp, SMS or email.') } catch { setMsg('Could not copy automatically. Please select the message above and copy it.') } }
  const fld = (id, label, hint, children) => (
    <div className={'fld' + (err[id] ? ' bad' : '')}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && <small id={id + '-h'}>{hint}</small>}
      {err[id] && <p className="ferr" id={id + '-e'} role="alert">{err[id]}</p>}
    </div>
  )
  const ad = id => ({ id, 'aria-invalid': !!err[id], 'aria-describedby': [id + '-h', err[id] ? id + '-e' : ''].join(' ').trim() })
  return (
    <section className="enq" id="enquire">
      <Wave fill="#1c3f9e" />
      <Doodles items={[['pencil', Y, 96, '46%', '6%', 20, 1.4, 1], ['backpack', CORAL, 92, '3%', '72%', -8, 1.2, 1], ['book', SKY, 84, '90%', '8%', 8, 1.6, 1], ['plane', NV, 80, '40%', '88%', -14, 1.8], ['globe', MINT, 70, '93%', '78%', 0, 1, 1], ['star', Y, 42, '8%', '12%', -10, 1.4], ['ruler', CORAL, 66, '52%', '60%', 10, 1, 1], ['swoosh', NV, 110, '18%', '46%', -20, 1.2, 1], ['bus', NV, 90, '72%', '92%', 0, 1.4, 1]]} />
      <div className="wrap two">
        <div className="eleft rv">
          <h2>Plan your school trip with us</h2>
          <p className="eintro">Tell us where you would like to go, when, and how many students. It takes about a minute.</p>
          <div className="qcs">
            <a className="qc" href={telHref(CONFIG.phones[0])}><span><b>Call us</b><small>{fmtPhone(CONFIG.phones[0])}</small></span></a>
            <a className="qc" href={waLink()} target="_blank" rel="noopener noreferrer"><span><b>Chat on WhatsApp</b><small>{fmtPhone(CONFIG.whatsapp)}</small></span></a>
            <a className="qc" href={`mailto:${CONFIG.email}?subject=${encodeURIComponent('School trip enquiry')}&body=${encodeURIComponent(WA_HELLO)}`}><span><b>Email us</b><small>{CONFIG.email}</small></span></a>
            {hasAddress && <a className="qc" href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer"><span><b>Visit us, get directions</b><small>Kondhwa, Pune. Opens Google Maps</small></span></a>}
          </div>
          <p className="fine2">Prefer not to fill the form? Use any option above.</p>
          <p className="scrawl" aria-hidden="true">no sign-up, nothing sent until you press send!</p>
        </div>
        <form className="ecard rv" onSubmit={e => { e.preventDefault(); if (step < 2) next() }} noValidate aria-label="School tour enquiry">
          <ol className="steps" aria-label="Enquiry progress">{STEPS.map((t, i) => <li key={t} className={i < step ? 'done' : i === step ? 'now' : ''} aria-current={i === step ? 'step' : undefined}><span>{i < step ? '✓' : i + 1}</span>{t}</li>)}</ol>
          <div className="stepbox" key={step}>
            <h3 tabIndex={-1} ref={head} className="sh">{['Tell us about you', 'Tell us about the trip', 'Check your enquiry'][step]}</h3>
            {step === 0 && (<>
              {fld("name", "Your name", null, <input {...ad('name')} value={f.name} onChange={set('name')} autoComplete="name" required />)}
              {fld("school", "School name", null, <input {...ad('school')} value={f.school} onChange={set('school')} autoComplete="organization" required />)}
              {fld("phone", "Your phone number", "So we can call or message you back.", <input {...ad('phone')} type="tel" inputMode="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" required />)}
            </>)}
            {step === 1 && (<>
              <fieldset className={'fld' + (err.dest ? ' bad' : '')} aria-describedby={err.dest ? 'dest-e' : undefined}>
                <legend>Where would you like to go?</legend>
                <div className="chips2">{DESTS.map(d => <label key={d} className="chip2"><input type="radio" name="dest" value={d} checked={f.dest === d} onChange={set('dest')} /><span>{d}</span></label>)}</div>
                {err.dest && <p className="ferr" id="dest-e" role="alert">{err.dest}</p>}
              </fieldset>
              <div className="row2">
                {fld("count", "Number of students (approx.)", "A rough number is fine.", <input {...ad('count')} inputMode="numeric" value={f.count} onChange={set('count')} />)}
                {fld("month", "When would you like to travel?", null, <select {...ad('month')} value={f.month} onChange={set('month')}><option value="">Not decided yet</option>{MONTHS.map(m => <option key={m}>{m}</option>)}</select>)}
              </div>
              {fld("group", "Students' classes", null, <select {...ad('group')} value={f.group} onChange={set('group')}><option value="">Not sure</option>{GROUPS.map(g => <option key={g}>{g}</option>)}</select>)}
              {fld("note", "Anything else we should know?", null, <textarea {...ad('note')} value={f.note} onChange={set('note')} />)}
            </>)}
            {step === 2 && (<>
              <pre className="sum" tabIndex={0} aria-label="Your enquiry message">{text()}</pre>
              <p className="fine2">Nothing is sent until you press Send enquiry, or Send in WhatsApp or your email app. Send enquiry passes your details to the free FormSubmit service, which emails them to us. We do not store them on this website.</p>
            </>)}
          </div>
          <div className="nav2">
            {step > 0 && <button type="button" className="btn out" onClick={() => go2(step - 1)}>Back</button>}
            {step === 0 && <button type="submit" className="btn gold big">Continue to trip details</button>}
            {step === 1 && <button type="submit" className="btn gold big">Review my enquiry</button>}
            {step === 2 && (<>
              <button type="button" className="btn gold big" onClick={send} disabled={busy || sent}>{sent ? 'Enquiry sent' : busy ? 'Sending...' : 'Send enquiry'}</button>
              <button type="button" className="btn wa" onClick={wa}>Send on WhatsApp</button>
              <button type="button" className="btn out" onClick={mail}>Send by email</button>
              <button type="button" className="btn out" onClick={copy}>Copy message</button>
            </>)}
          </div>
          <div className="status" role="status" aria-live="polite">{msg}</div>
        </form>
      </div>
    </section>
  )
}

function WhatsAppFab() {
  return (
    <a className="wafab" href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
      <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.04 3C9.4 3 4 8.4 4 15.04c0 2.3.66 4.5 1.9 6.4L4 29l7.75-1.86a12.03 12.03 0 0 0 4.29.8C22.68 27.94 28 22.6 28 15.96 28 9.3 22.68 3 16.04 3zm0 22.1c-1.4 0-2.77-.37-3.97-1.08l-.28-.17-4.6 1.1 1.2-4.46-.19-.3a9.16 9.16 0 0 1-1.4-4.86c0-5.08 4.13-9.2 9.22-9.2 5.08 0 9.2 4.12 9.2 9.2 0 5.08-4.12 9.77-9.18 9.77zm5.04-6.88c-.28-.14-1.64-.8-1.9-.9-.25-.1-.43-.14-.62.14-.18.28-.71.9-.87 1.08-.16.19-.32.21-.6.07-.27-.14-1.17-.43-2.22-1.37-.82-.73-1.37-1.64-1.53-1.91-.16-.28-.02-.43.12-.57.12-.12.28-.32.41-.48.14-.16.18-.28.28-.46.09-.19.05-.35-.02-.49-.07-.14-.62-1.5-.85-2.05-.22-.54-.45-.46-.62-.47h-.53c-.18 0-.48.07-.73.35-.25.27-.96.94-.96 2.29s.98 2.66 1.12 2.84c.14.19 1.94 2.96 4.7 4.15.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" /></svg>
    </a>
  )
}

const ICON = {
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  mail: <><path d="M3 5h18v14H3z" /><path d="M3 6l9 7 9-7" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  up: <path d="M12 19V5M5 12l7-7 7 7" />,
}
const Ic = ({ n }) => <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICON[n]}</svg>
function Footer() {
  const root = useRef()
  useEffect(() => {
    if (reduce) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.fmark', { xPercent: 8 }, { xPercent: -8, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 } })
      gsap.from('.fcol', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.fgrid', start: 'top 88%', once: true } })
    }, root)
    return () => ctx.revert()
  }, [])
  const L = (id, t) => <li key={id}><a href={id} onClick={e => { e.preventDefault(); go(id) }}>{t}</a></li>
  return (
    <footer className="foot" ref={root}>
      <Wave fill="#fffdf2" />
      <Doodles items={[['star', Y, 40, '4%', '8%', -10, 1.2, 1], ['plane', SKY, 70, '90%', '6%', 12, 1.6, 1], ['cloud', WH, 90, '60%', '18%', 0, 0.8, 1], ['spark', Y, 30, '28%', '12%', 0, 1.6]]} />
      <div className="wrap">
        <div className="fcta">
          <div><h2>Ready to plan your class trip?</h2><p>Tell us the destination, the month and the number of students. We will reply with the details.</p></div>
          <div className="fctab"><button className="btn gold big" onClick={() => go('#enquire')}>Plan our school trip</button><a className="btn ghost big" href={telHref(CONFIG.phones[0])}>Call {fmtPhone(CONFIG.phones[0])}</a></div>
        </div>
        <div className="fgrid">
          <div className="fcol fbrand">
            <img className="flogo" src="/brand/logo-white.webp" alt={CONFIG.name} />
            <p className="ftag">School trips, educational tours and industrial visits, planned from Pune and Mumbai since {FOUNDED}. Founded by {OWNER}.</p>
            <p className="fchip"><a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer">Read our Google reviews<span className="sr-only"> (opens in a new tab)</span></a></p>
          </div>
          <div className="fcol"><h3>Explore</h3><ul>{[['#about', 'About'], ['#tours', 'Tours'], ['#gallery', 'Gallery'], ['#reviews', 'Reviews'], ['#trail', 'Flyers'], ['#enquire', 'Enquire']].map(([id, t]) => L(id, t))}</ul></div>
          <div className="fcol"><h3>Destinations</h3><ul>{ALL.map(t => <li key={t.id}><a href="#gallery" onClick={e => { e.preventDefault(); GALLERY[t.id] ? showGallery(t.id) : askAbout(t.name) }}>{t.name.split(',')[0]}</a></li>)}</ul></div>
          <div className="fcol"><h3>Contact</h3>
            <ul className="fcon">
              {CONFIG.phones.map(p => <li key={p}><Ic n="phone" /><a href={telHref(p)}>{fmtPhone(p)}</a></li>)}
              <li><Ic n="chat" /><a href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp {fmtPhone(CONFIG.whatsapp)}</a></li>
              <li><Ic n="mail" /><a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a></li>
              {hasAddress && <li><Ic n="pin" /><a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer">{CONFIG.address}</a></li>}
              {hasAddress && <li className="fdir"><a className="btn gold" href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">Get directions</a></li>}
            </ul>
          </div>
        </div>
        <div className="fbar"><span>© {new Date().getFullYear()} {CONFIG.name} · <a href="/safety">Safety</a> · <a href="/faqs">FAQs</a> · <a href="/contact">Contact</a></span><button className="totop" onClick={() => go('#top')}><Ic n="up" />Back to top</button></div>
      </div>
      <div className="fmark" aria-hidden="true">Memories Unlimited</div>
    </footer>
  )
}

function useReveal(dep) {
  useEffect(() => {
    const els = [...document.querySelectorAll('.rv:not(.in)')]
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    els.forEach(e => io.observe(e))
    return () => io.disconnect()
  }, [dep])
}

export default function App() {
  useSmoothScroll()
  const [open, setOpen] = useState(null)
  const [ready, setReady] = useState(false)
  const [fb, setFb] = useState(null)
  const [fmore, setFmore] = useState(false)
  useEffect(() => { const t = setTimeout(() => ScrollTrigger.refresh(), 750); return () => clearTimeout(t) }, [fmore])
  // The Flyers menu (and /?f=3 links from other pages) open that exact flyer. On phones the flyers past the first four are
  // folded away, so unfold them too, otherwise the picture would open but the page behind it would look unchanged.
  useEffect(() => {
    const h = e => { const n = +e.detail; if (Number.isInteger(n) && FLYERS[n]) { if (n >= 4) setFmore(true); setFb(n) } }
    window.addEventListener('mu-flyer', h); return () => window.removeEventListener('mu-flyer', h)
  }, [])
  useReveal(ready)
  // Arriving from another page with /#gallery (or /?g=hampi#gallery): the sections only exist once `ready`, so the browser's own
  // hash jump misses. Scroll there ourselves, and again a moment later in case images moved things.
  useEffect(() => {
    if (!ready) return
    const h = location.hash, q = new URLSearchParams(location.search).get('g'), fq = new URLSearchParams(location.search).get('f')
    if (!h || h === '#top') return
    try { history.replaceState(null, '', location.pathname + h) } catch { }
    if (q && GALLERY[q]) setTimeout(() => window.dispatchEvent(new CustomEvent('mu-gallery', { detail: q })), 250)
    if (fq !== null && FLYERS[+fq]) setTimeout(() => window.dispatchEvent(new CustomEvent('mu-flyer', { detail: +fq })), 700)
    const t1 = setTimeout(() => go(h), 450)
    const t2 = setTimeout(() => { const el = document.querySelector(h); if (el && Math.abs(el.getBoundingClientRect().top) > 150) go(h) }, 1600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [ready])
  useEffect(() => { if (ready) { const t = setTimeout(() => ScrollTrigger.refresh(), 150); const l = () => ScrollTrigger.refresh(); window.addEventListener('load', l); return () => { clearTimeout(t); window.removeEventListener('load', l) } } }, [ready])
  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      // Phones: doodles hidden on small screens get no animation at all, and the rest only draw themselves in (no endless floating),
      // which saves dozens of running tweens and keeps scrolling smooth.
      const small = mqPhone().matches
      document.querySelectorAll('.dood').forEach((d, i) => {
        if (reduce || d.offsetParent === null) return
        gsap.fromTo(d.querySelectorAll('.dd'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.out', stagger: 0.12, delay: (i % 4) * 0.1, scrollTrigger: { trigger: d, start: 'top 94%', once: true } })
        if (!small) gsap.to(d.firstChild, { y: 'random(-12,12)', rotation: 'random(-7,7)', duration: 'random(2.6,4.6)', ease: 'sine.inOut', repeat: -1, yoyo: true, delay: Math.random() * 2 })
      })
    })
    let off = () => { }
    if (!reduce && window.matchMedia('(pointer:fine)').matches) {
      const mv = [...document.querySelectorAll('.dood')].map(d => ({ x: gsap.quickTo(d, 'x', { duration: 1, ease: 'power3' }), y: gsap.quickTo(d, 'y', { duration: 1, ease: 'power3' }), k: +d.dataset.d || 1 }))
      const mm = e => { const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5; mv.forEach(m => { m.x(-nx * 26 * m.k); m.y(-ny * 26 * m.k) }) }
      window.addEventListener('pointermove', mm, { passive: true }); off = () => window.removeEventListener('pointermove', mm)
    }
    return () => { off(); ctx.revert() }
  }, [ready])
  const { spots: photos, gallery, done } = usePhotos()
  const trailItems = useMemo(() => [...new Set(Object.values(gallery).flat().map(p => p.src))].slice(0, mqPhone().matches ? 10 : 28), [gallery])
  return (
    <ClickSpark sparkColor="#ffc83d" sparkSize={12} sparkRadius={28} sparkCount={9} disabled={reduce}>
      <Splash onReveal={() => setReady(true)} />
      <Nav />
      {ready && <SideNav />}
      {ready && <Hero photos={photos} />}
      {ready && <TrustRibbon />}
      <section className="manifesto" id="about">
        <Doodles items={[['sun', Y, 96, '86%', '6%', 0, 1.2], ['book', SKY, 80, '4%', '12%', -8, 1.4, 1], ['pencil', CORAL, 76, '90%', '72%', 16, 1.6, 1], ['star', NV, 38, '12%', '80%', 8, 1], ['cloud', SKY, 90, '50%', '4%', 0, 0.8, 1], ['spark', CORAL, 30, '70%', '86%', 0, 1.6]]} />
        <svg className="mroute" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path id="mrp" d="M-20 260 C 220 40, 480 330, 700 150 S 1100 20, 1240 120" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="2 14" strokeLinecap="round" />{!reduce && <path d="M-14 -9 L22 0 L-14 9 L-8 0 Z" fill="currentColor"><animateMotion dur="14s" repeatCount="indefinite" rotate="auto"><mpath href="#mrp" /></animateMotion></path>}</svg>
        <div className="wrap">
          <ScrollReveal baseOpacity={0.12} baseRotation={2} blurStrength={6} textClassName="mtext">Learning does not stop at the classroom door. History becomes a temple you can touch. Science becomes a city you can walk through.</ScrollReveal>
          <div className="abt">
            <p className="abt-founder">
              <span className="abt-fy" aria-hidden="true">{FOUNDED}</span>
              <span>Established in <b>{FOUNDED}</b> and founded by <b>{OWNER}</b>, owner and proprietor, who brings <b>{EXPERIENCE} years of industry experience</b> across operations to every trip we plan.</span>
            </p>
            <div className="abt-stats">
              <p><b>{YEARS}</b><span>years of school trips, since {FOUNDED}</span></p>
              <p><b>Thousands</b><span>of students have travelled with us</span></p>
              <p><b>Pune + Mumbai</b><span>Office in Kondhwa Khurd, Pune</span></p>
            </div>

            <div className="abt-cards">
              <div className="abt-card hi">
                <h3>Made for students</h3>
                <p>
                  Safe, memorable <mark>school trips and nature camps</mark> designed for every group, in our own coaches and good hotels.
                </p>
                <ul className="abt-list">
                  <li>School picnics</li>
                  <li>Educational tours</li>
                  <li>Industrial visits</li>
                  <li>Nature camps</li>
                  <li>Our own coaches and vehicles</li>
                  <li>Good hotels on longer tours</li>
                </ul>
                <button className="btn gold" onClick={() => go('#enquire')}>
                  Send an enquiry
                </button>
              </div>

              <div className="abt-card">
                <h3>Learn & explore</h3>
                <p>
                  From Hampi and Mahabaleshwar to Singapore, discover new places and create memories.
                </p>
                <ul className="abt-list">
                  {TOURS.map(t => <li key={t.id}>{t.name.split(',')[0].replace(' and Agra', '')}</li>)}
                </ul>
                <button className="btn gold" onClick={() => go('#tours')}>
                  See our tours
                </button>
              </div>

              <div className="abt-card">
                <h3>Easy trip planning</h3>
                <p>
                  Share your destination, travel month and group size.
                  We'll handle the details.
                </p>
                <p className="abt-also">
                  Holiday packages, group tours, flights and hotels too.
                </p>
                <button className="btn gold" onClick={() => go('#enquire')}>
                  Plan our school trip
                </button>
              </div>
            </div>

            {(() => {
              const d = TOURS.find(t => t.id === 'mahabaleshwar'); return d && (
                <div className="abt-day">
                  <span className="abt-tag">One-day trip</span>
                  <div className="abt-day-t">
                    <h3>A school picnic in a single day</h3>
                    <p>{d.name}. {d.list.join(', ')}. Ask us for the current rate.</p>
                  </div>
                  <div className="abt-day-b">
                    <button className="btn gold" onClick={() => askAbout(d.name)}>Enquire about a one-day picnic</button>
                    <button className="btn ghost" onClick={() => setOpen(d)}>See what is included</button>
                  </div>
                </div>)
            })()}

          </div>
        </div></section>
      <div className="band">
        {reduce ? <p className="static">School picnics ✦ Educational tours ✦ Industrial visits</p>
          : <ScrollVelocity texts={['School picnics ✦ Educational tours ✦ Industrial visits ✦', 'Learning beyond the classroom ✦ From Pune and Mumbai ✦']} velocity={70} className="bandtext" />}
      </div>
      <Reel />
      <Tours onOpen={setOpen} photos={photos} />
      <Gallery gallery={gallery} done={done} onOpen={setOpen} />
      <Reviews />
      <section className="trail" id="trail">
        <Wave fill="#ffc83d" />
        <Doodles items={[['star', Y, 54, '6%', '16%', -10, 1.4], ['plane', SKY, 80, '86%', '12%', 14, 1.6], ['sun', Y, 70, '90%', '62%', 0, 1, 1], ['cloud', WH, 100, '4%', '70%', 0, 1.2, 1], ['spark', WH, 36, '30%', '8%', 0, 1.8]]} />
        {!reduce && trailItems.length > 0 && <div className="stage"><ImageTrail items={trailItems} variant={1} /></div>}
        <div className="copy rv">
          <h2>Where will your class go next?</h2>
          <p>{reduce ? 'Tell us your plan and we will help.' : 'Move your mouse or finger across this page.'}</p>
          <button className="btn gold" onClick={() => go('#enquire')}>Tell us your plan</button>
          <div className={'flyers' + (fmore ? ' open' : '')}><h3 id="flyers">Our flyers. Tap one to read it.</h3>
            {(() => { const fb1 = (f, i) => <button key={i} style={{ '--r': (i % 2 ? 1.6 : -1.6) + 'deg', '--j': Math.max(0, i - 4) }} onClick={() => setFb(i)} aria-label={`Open flyer: ${f.name}`}><img src={f.src} alt={`${f.name} flyer`} loading="lazy" /></button>; return (<>{FLYERS.slice(0, 4).map((f, i) => fb1(f, i))}<div className="fl-more"><div className="fl-in">{FLYERS.slice(4).map((f, i) => fb1(f, i + 4))}</div></div></>) })()}
            <button className="btn gold fl-toggle" aria-expanded={fmore} onClick={() => { if (fmore) go('#flyers'); setFmore(m => !m) }}>{fmore ? 'Show fewer flyers' : `View ${FLYERS.length - 4} more flyers`}</button></div>
        </div>
      </section>
      <Enquire />
      <Footer />
      {ready && <WhatsAppFab />}
      {fb !== null && <FlyerBox i={fb} setI={setFb} />}
      {open && <Modal t={open} onClose={() => setOpen(null)} photos={photos} />}
    </ClickSpark>
  )
}
