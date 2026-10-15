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
import { CONFIG, hasAddress } from './site.config.js'
import { TOURS, EXTRA, FLYERS } from './tours.js'
import { loadPhotos, loadExtra, GALLERY } from './photos.js'

gsap.registerPlugin(ScrollTrigger)
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const askAbout = n => { window.dispatchEvent(new CustomEvent('mu-dest', { detail: n })); go('#enquire') }
function usePhotos() { const [p, setP] = useState({ spots: {}, places: {} }); useEffect(() => { let ok = true; loadPhotos().then(r => ok && setP(r)).catch(() => {}); return () => { ok = false } }, []); return p }
const go = sel => { const el = document.querySelector(sel); if (el) window.__lenis ? window.__lenis.scrollTo(el) : el.scrollIntoView() }

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
    let y = window.scrollY
    const f = () => { const n = window.scrollY; setHide(n > y && n > 240); y = n }
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  const L = (id, t, cls) => <a className={cls} href={id} onClick={e => { e.preventDefault(); go(id) }}>{t}</a>
  return (
    <nav className={'nav' + (hide ? ' hide' : '')}>
      <a className="brand" href="#top" onClick={e => { e.preventDefault(); go('#top') }}>
        <img className="logo" src="/brand/logo-icon.png" alt="" />
        <span><b>Memories Unlimited</b><small>Tours &amp; Travels</small></span>
      </a>
      <div>{L('#tours', 'Tours')}{L('#gallery', 'Gallery')}{L('#flyers', 'Flyers')}{L('#enquire', 'Enquire', 'pill')}</div>
    </nav>
  )
}

const STOP_IDS = ['singapore', 'hampi', 'jaipur', 'mahabaleshwar', 'ahmedabad', 'goa', 'manali', 'kerala']
const ALL = [...TOURS, ...EXTRA]
function Hero({ photos }) {
  const [si, setSi] = useState(0)
  const picked = useRef(false)
  useEffect(() => { if (reduce) return; const t = setInterval(() => { if (!picked.current) setSi(x => (x + 1) % STOP_IDS.length) }, 4500); return () => clearInterval(t) }, [])
  const cur = ALL.find(t => t.id === STOP_IDS[si])
  return (
    <header className="hero" id="top">
      <div className="herobg">{STOP_IDS.map((id, i) => photos[id] && <div key={id} className={'hbg2' + (i === si ? ' on' : '')} style={{ backgroundImage: `url(${photos[id].src})` }} />)}</div>
      <div className="aurora"><Aurora colorStops={['#1f7a33', '#03a0e3', '#2e5bd8']} amplitude={1.1} blend={0.6} speed={0.8} paused={reduce} /></div>
      <div className="hero-in">
        <SplitText tag="h1" className="h1" text="Learning beyond the classroom" splitType="words, chars" textAlign="left" delay={28} duration={1.1} ease="power4.out" from={{ opacity: 0, y: 90 }} to={{ opacity: 1, y: 0 }} threshold={0} rootMargin="0px" />
        <p>School picnics, educational tours and industrial visits, planned from Pune.</p>
        <div className="stops" role="group" aria-label="Pick a destination">{STOP_IDS.map((id, i) => <button key={id} className={'stop' + (i === si ? ' on' : '')} aria-pressed={i === si} onClick={() => { picked.current = true; setSi(i) }}>{ALL.find(x => x.id === id).name.split(',')[0]}</button>)}</div>
        <p className="next"><b>{cur.name}</b> {cur.list ? cur.tag + (cur.price ? ', ' + cur.price : '') : 'Ask us about this trip'}</p>
        <div className="cta">
          <Magnet padding={80} magnetStrength={3}><button className="btn gold" onClick={() => go('#enquire')}>Plan our school trip</button></Magnet>
          <Magnet padding={80} magnetStrength={3}><button className="btn ghost" onClick={() => go('#tours')}>See our tours</button></Magnet>
        </div>
      </div>
      <div className="badge" aria-hidden="true"><CircularText text="LEARNING*BEYOND*THE*CLASSROOM*" spinDuration={22} /></div>
    </header>
  )
}

function Tours({ onOpen, photos }) {
  const track = useRef(), pos = useRef(0), paused = useRef(false)
  useEffect(() => {
    if (reduce) return
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
  const hold = () => { paused.current = true }
  const resume = (ms = 0) => setTimeout(() => { pos.current = track.current.scrollLeft; paused.current = false }, ms)
  const nudge = d => { hold(); track.current.scrollBy({ left: d * Math.min(360, window.innerWidth * 0.8), behavior: 'smooth' }); resume(1200) }
  return (
    <section className="tours" id="tours">
      <div className="th">
        <div className="rv"><h2>Where we can take your class</h2><p>Prices and inclusions are as printed on our flyers. Tap a tour for details.</p></div>
        <div className="arrows"><button onClick={() => nudge(-1)} aria-label="Scroll tours left">‹</button><button onClick={() => nudge(1)} aria-label="Scroll tours right">›</button></div>
      </div>
      <div className="track" ref={track} onPointerEnter={hold} onPointerLeave={() => resume()} onTouchStart={hold} onTouchEnd={() => resume(1800)} onFocus={hold} onBlur={() => resume()}>
        {[...TOURS, ...EXTRA].map(t => { const p = photos[t.id]; return (
          <GlareHover key={t.id} width="clamp(250px, 26vw, 360px)" height="auto" borderRadius="22px" glareColor="#ffffff" glareOpacity={0.4} className="cardwrap">
            <button className="card" onClick={() => (t.list ? onOpen(t) : askAbout(t.name))} aria-label={`${t.name}: ${t.list ? 'see details' : 'ask us'}`}>
              {p ? <img src={p.src} alt={t.name} loading="lazy" /> : <span className="phf">{t.name}</span>}
              <span className="meta"><b>{t.name}</b><i>{t.price || (t.list ? 'Price on request' : 'Ask us about this trip')}</i></span>
            </button>
          </GlareHover>) })}
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

function Gallery({ places }) {
  const [tab, setTab] = useState('singapore')
  const [lb, setLb] = useState(null)
  const [extra, setExtra] = useState({})
  const g = GALLERY[tab]
  useEffect(() => {
    let ok = true
    g.places.forEach(t => loadExtra(t).then(r => ok && r.length && setExtra(m => ({ ...m, [t]: r }))))
    return () => { ok = false }
  }, [tab])
  const seen = new Set()
  const items = g.places.flatMap(t => [places[t], ...(extra[t] || [])].filter(Boolean).map(p => ({ t, p }))).filter(({ p }) => !seen.has(p.file) && seen.add(p.file))
  useEffect(() => { if (!reduce) gsap.fromTo('.gi', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: 'power3.out', overwrite: true }) }, [tab, items.length])
  useEffect(() => {
    if (lb === null) return
    window.__lenis && window.__lenis.stop(); document.body.style.overflow = 'hidden'
    const k = e => { if (e.key === 'Escape') setLb(null); if (e.key === 'ArrowRight') setLb(i => (i + 1) % items.length); if (e.key === 'ArrowLeft') setLb(i => (i - 1 + items.length) % items.length) }
    window.addEventListener('keydown', k)
    return () => { window.removeEventListener('keydown', k); window.__lenis && window.__lenis.start(); document.body.style.overflow = '' }
  }, [lb, items.length])
  const cur = lb !== null ? items[lb] : null
  return (
    <section className="gal" id="gallery">
      <div className="wrap rv">
        <h2>Places you will see</h2>
        <p className="gnote">HD photos of the places on each tour. Choose a trip.</p>
        <div className="tabs" role="tablist">{Object.entries(GALLERY).map(([k, v]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => { setTab(k); setLb(null) }}>{v.label}</button>)}</div>
        <p className="gnote">{g.note}</p>
        <div className="masonry">
          {items.length ? items.map(({ t, p }, i) => (
            <button key={p.file} className="gi" onClick={() => setLb(i)} aria-label={`Open photo: ${t}`}><img src={p.src} alt={t} loading="lazy" /><span>{t.replace(/,.*$/, '')}</span></button>
          )) : <p>Photos are loading, or could not be loaded. Check your internet connection.</p>}
        </div>
      </div>
      {cur && (
        <div className="lbx" onClick={() => setLb(null)} role="dialog" aria-modal="true" aria-label={cur.t}>
          <button className="nv" style={{ left: '1rem' }} aria-label="Previous photo" onClick={e => { e.stopPropagation(); setLb((lb - 1 + items.length) % items.length) }}>‹</button>
          <figure onClick={e => e.stopPropagation()} style={{ margin: 0 }}><img src={cur.p.src} alt={cur.t} /><figcaption>{cur.t.replace(/,.*$/, '')}</figcaption></figure>
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
    tl.fromTo('.sp-logo', { opacity: 0, scale: 0.86, y: 14 }, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power3.out' })
      .fromTo('.sp-bar', { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, 0.1)
      .add(onReveal, '+=0.2')
      .to('.splash', { yPercent: -100, duration: 0.6, ease: 'power4.inOut' }, '<')
    return () => { tl.kill(); document.body.style.overflow = '' }
  }, [])
  if (gone) return null
  return <div className="splash" role="presentation"><img className="sp-logo" src="/brand/logo-white.png" alt="Memories Unlimited Tours and Travels" /><div className="sp-bar" /></div>
}

const MONTHS = (() => { const d = new Date(); return Array.from({ length: 9 }, (_, i) => new Date(d.getFullYear(), d.getMonth() + i, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' })) })()
const DESTS = [...TOURS.map(t => t.name), 'Goa', 'Manali', 'Kerala', "Wet'nJoy", 'Parle Factory visit', 'Not sure yet']
const GROUPS = ['Primary (classes 1 to 4)', 'Middle (classes 5 to 8)', 'Secondary (classes 9 to 12)', 'Mixed or not sure']
const STEPS = ['About you', 'Your trip', 'Review and send']

function Enquire() {
  const [step, setStep] = useState(0)
  const [f, setF] = useState({ name: '', school: '', phone: '', dest: '', count: '', month: '', group: '', note: '' })
  const [err, setErr] = useState({})
  const [msg, setMsg] = useState('')
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
  const go2 = n => { setMsg(''); setStep(n) }
  const next = () => { if (check(step)) go2(step + 1) }
  const text = () => ['Hello Memories Unlimited, I would like to enquire about a school tour.', `Name: ${f.name}`, `School: ${f.school}`, `Phone: ${f.phone}`, `Destination: ${f.dest}`, `Students (approx): ${f.count || '-'}`, `Preferred month: ${f.month || '-'}`, `Class group: ${f.group || '-'}`, `Note: ${f.note || '-'}`].join('\n')
  const wa = () => { window.open(`https://wa.me/91${CONFIG.whatsapp}?text=${encodeURIComponent(text())}`, '_blank', 'noopener'); setMsg('WhatsApp should now be open with your message ready. Press Send there to finish.') }
  const mail = () => { window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('School tour enquiry: ' + f.dest)}&body=${encodeURIComponent(text())}`; setMsg('Your email app should now be open with your message ready. Press Send there to finish.') }
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
      <div className="wrap two">
        <div className="eleft rv">
          <h2>Plan your school trip with us</h2>
          <p className="eintro">Tell us where you would like to go, when, and how many students. It takes about a minute.</p>
          <div className="qcs">
            <a className="qc" href={`tel:+91${CONFIG.phones[0]}`}><span><b>Call us</b><small>{CONFIG.phones[0]}</small></span></a>
            <a className="qc" href={`https://wa.me/91${CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer"><span><b>Chat on WhatsApp</b><small>{CONFIG.whatsapp}</small></span></a>
            <a className="qc" href={`mailto:${CONFIG.email}`}><span><b>Email us</b><small>{CONFIG.email}</small></span></a>
          </div>
          <p className="fine2">Prefer not to fill the form? Use any option above.</p>
        </div>
        <form className="ecard rv" onSubmit={e => { e.preventDefault(); if (step < 2) next() }} noValidate aria-label="School tour enquiry">
          <ol className="steps" aria-label="Enquiry progress">{STEPS.map((t, i) => <li key={t} className={i < step ? 'done' : i === step ? 'now' : ''} aria-current={i === step ? 'step' : undefined}><span>{i < step ? '✓' : i + 1}</span>{t}</li>)}</ol>
          <div className="stepbox" key={step}>
            <h3 tabIndex={-1} ref={head} className="sh">{['Tell us about you', 'Tell us about the trip', 'Check your enquiry']}[step]</h3>
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
              <p className="fine2">Nothing is sent until you press Send in WhatsApp or your email app.</p>
            </>)}
          </div>
          <div className="nav2">
            {step > 0 && <button type="button" className="btn out" onClick={() => go2(step - 1)}>Back</button>}
            {step === 0 && <button type="submit" className="btn gold big">Continue to trip details</button>}
            {step === 1 && <button type="submit" className="btn gold big">Review my enquiry</button>}
            {step === 2 && (<>
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
  useReveal(ready)
  useEffect(() => { if (ready) { const t = setTimeout(() => ScrollTrigger.refresh(), 150); return () => clearTimeout(t) } }, [ready])
  const { spots: photos, places } = usePhotos()
  const trailItems = useMemo(() => [...new Set([...Object.values(photos), ...Object.values(places)].map(p => p.src))].slice(0, 28), [photos, places])
  return (
    <ClickSpark sparkColor="#03a0e3" sparkSize={12} sparkRadius={28} sparkCount={9} disabled={reduce}>
      <Splash onReveal={() => setReady(true)} />
      <Nav />
      {ready && <Hero photos={photos} />}
      <section className="manifesto">
        <svg className="mroute" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path id="mrp" d="M-20 260 C 220 40, 480 330, 700 150 S 1100 20, 1240 120" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="2 14" strokeLinecap="round" />{!reduce && <path d="M-14 -9 L22 0 L-14 9 L-8 0 Z" fill="currentColor"><animateMotion dur="14s" repeatCount="indefinite" rotate="auto"><mpath href="#mrp" /></animateMotion></path>}</svg>
        <div className="wrap">
        <ScrollReveal baseOpacity={0.12} baseRotation={2} blurStrength={6} textClassName="mtext">Learning does not stop at the classroom door. History becomes a temple you can touch. Science becomes a city you can walk through.</ScrollReveal>
      </div></section>
      <div className="band">
        {reduce ? <p className="static">School picnics ✦ Educational tours ✦ Industrial visits</p>
          : <ScrollVelocity texts={['School picnics ✦ Educational tours ✦ Industrial visits ✦', 'Learning beyond the classroom ✦ From Pune ✦']} velocity={70} className="bandtext" />}
      </div>
      <Tours onOpen={setOpen} photos={photos} />
      <Gallery places={places} />
      <section className="trail" id="trail">
        {!reduce && trailItems.length > 0 && <div className="stage"><ImageTrail items={trailItems} variant={1} /></div>}
        <div className="copy rv">
          <h2>Where will your class go next?</h2>
          <p>{reduce ? 'Tell us your plan and we will help.' : 'Move your mouse or finger across this page.'}</p>
          <button className="btn gold" onClick={() => go('#enquire')}>Tell us your plan</button>
          <div className="flyers"><h3 id="flyers">Our flyers. Tap one to read it.</h3>{FLYERS.map((f, i) => <button key={i} onClick={() => setFb(i)} aria-label={`Open flyer: ${f.name}`}><img src={f.src} alt={`${f.name} flyer`} loading="lazy" /></button>)}</div>
        </div>
      </section>
      <Enquire />
      <footer className="foot"><div className="wrap fgrid rv">
        <div><img className="flogo" src="/brand/logo-white.png" alt={CONFIG.name} /><p className="ftag">Learning beyond the classroom.</p></div>
        <ul>
          {CONFIG.phones.map(p => <li key={p}>Phone: <a href={`tel:+91${p}`}>{p}</a></li>)}
          <li>WhatsApp: <a href={`https://wa.me/91${CONFIG.whatsapp}`}>{CONFIG.whatsapp}</a></li>
          <li>Email: <a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a></li>
          <li>{hasAddress ? CONFIG.address : 'Address: to be added'}</li>
        </ul>
        <ul className="flinks"><li><a href="#tours" onClick={e => { e.preventDefault(); go('#tours') }}>Tours</a></li><li><a href="#gallery" onClick={e => { e.preventDefault(); go('#gallery') }}>Gallery</a></li><li><a href="#flyers" onClick={e => { e.preventDefault(); go('#flyers') }}>Flyers</a></li><li><a href="#enquire" onClick={e => { e.preventDefault(); go('#enquire') }}>Enquire</a></li></ul>
      </div></footer>
      {fb !== null && <FlyerBox i={fb} setI={setFb} />}
      {open && <Modal t={open} onClose={() => setOpen(null)} photos={photos} />}
    </ClickSpark>
  )
}
