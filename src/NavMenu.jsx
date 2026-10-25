// Top-bar navigation for BOTH the home page (.nav) and the route pages (.pg-head).
// Trips, Gallery and Flyers are real links (Trips opens "Trips for every kind of school day") with a dropdown that opens
// directly UNDER its own button. Safety, FAQs, About and Contact sit in the bar; below 1000px they fold into "More".
// Hover (mouse), tap the little arrow, Enter/Space on the arrow; Esc closes; focus leaving the menu closes it.
// PHONES (700px and below) get NO dropdowns: just a hamburger button that opens a slide-in menu (MobileMenu below) whose rows
// jump to the page sections (home page) or the site pages (route pages).
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CONFIG, fmtPhone, telHref, waLink } from './site.config.js'
import { GALLERY } from './photos.js'
import { FLYERS } from './tours.js'
import { Icon } from './icons.jsx'
import { GROUPS } from './groups.js'
import './nav-menu.css'

const PAGES = [['/safety', 'Safety'], ['/faqs', 'FAQs'], ['/about', 'About'], ['/contact', 'Contact']]
const mq = q => typeof matchMedia === 'function' && matchMedia(q).matches

function Menu({ id, label, to, onHash, className = '', ctl, children }) {
  const isOpen = ctl.open === id
  const [pos, setPos] = useState(null)
  const root = useRef(null), panel = useRef(null)
  const hoverOk = () => mq('(hover: hover) and (pointer: fine)')
  const href = h => (h.startsWith('#') && !onHash ? '/' + h : h)
  // `dest` (optional) is a gallery destination id: on the home page it switches the gallery tab before scrolling there.
  const pick = (h, dest) => e => { if (dest && onHash) window.dispatchEvent(new CustomEvent('mu-gallery', { detail: dest })); if (h.startsWith('#') && onHash) { e.preventDefault(); onHash(h) } ctl.close() }
  // Centre the panel under its own button (measured before paint), then keep it on screen. Phones use CSS instead.
  useLayoutEffect(() => {
    // Only measure when opening. Never reset on close: that made the fading panel jump to the far left.
    if (!isOpen) return
    if (mq('(max-width: 700px)') || !panel.current || !panel.current.offsetParent) { setPos(null); return }
    const b = root.current.getBoundingClientRect(), p = panel.current, bar = p.offsetParent.getBoundingClientRect()
    const w = p.offsetWidth, c = b.left + b.width / 2
    setPos(Math.max(8, Math.min(c - w / 2, window.innerWidth - w - 8)) - bar.left)
  }, [isOpen])
  return (
    <span ref={root} className={'nm nm-' + id + (isOpen ? ' open' : '') + ' ' + className}
      onPointerEnter={e => { if (e.pointerType === 'mouse' && hoverOk()) ctl.enter(id) }}
      onPointerLeave={e => { if (e.pointerType === 'mouse' && hoverOk()) ctl.leave() }}
      onBlur={e => { if (!root.current?.contains(e.relatedTarget) && ctl.open === id) ctl.close() }}>
      {to
        ? <><a className="nm-link" href={href(to)} onClick={pick(to)}>{label}</a>
            <button type="button" className="nm-caret" aria-expanded={isOpen} aria-controls={'nm-' + id} aria-label={`Show the ${label} menu`} onClick={() => ctl.toggle(id)} /></>
        : <button type="button" className="nm-btn" aria-expanded={isOpen} aria-controls={'nm-' + id} onClick={() => ctl.toggle(id)}>{label}</button>}
      <div ref={panel} className="nm-panel" id={'nm-' + id} inert={!isOpen} style={pos !== null ? { left: pos + 'px', right: 'auto' } : undefined}>{children({ href, pick })}</div>
    </span>
  )
}

// Half-circle wheel: the four paths sit on the arc; "Click to view / All trips" is the hub at the bottom.
function Wheel({ pick }) {
  return (
    <div className="wheel">
      <span className="wheel-spin" aria-hidden="true"><i /><b /></span>
      <span className="wheel-glow" aria-hidden="true" />
      <ul className="wheel-list">
        {GROUPS.map((g, i) => {
          const a = Math.PI * (1 - (i + 0.5) / GROUPS.length)
          return (
            <li key={g.id} style={{ left: 50 + 37 * Math.cos(a) + '%', top: 100 - 66 * Math.sin(a) + '%', '--c': g.color }}>
              <a className="wheel-item" href={'/tours#' + g.id} onClick={pick('/tours#' + g.id)}><span className="wheel-ic"><Icon n={g.icon} size={34} /></span><span>{g.short}</span></a>
            </li>
          )
        })}
      </ul>
      <a className="wheel-go" href="/tours" onClick={pick('/tours')}>Click to view<b>All trips</b></a>
    </div>
  )
}

// ---------- Phones: hamburger + slide-in menu ----------
const HOME_ROWS = [['#top', 'Home'], ['#about', 'About us'], ['#tours', 'Tours'], ['#gallery', 'Gallery'], ['#reviews', 'Reviews'], ['#flyers', 'Flyers'], ['#enquire', 'Enquire']]
const HOME_MORE = [['/tours', 'All trips'], ['/safety', 'Safety'], ['/faqs', 'FAQs'], ['/contact', 'Contact']]
const PAGE_ROWS = [['/', 'Home'], ['/tours', 'Trips'], ['/#gallery', 'Gallery'], ['/#flyers', 'Flyers'], ['/about', 'About us'], ['/#enquire', 'Enquire']]
const PAGE_MORE = [['/safety', 'Safety'], ['/faqs', 'FAQs'], ['/contact', 'Contact']]
const DOTS = ['#ffc83d', '#0b8fd6', '#ff6b57', '#1f7a33', '#6d3fc0', '#ffc83d', '#ff6b57']

function MobileMenu({ onHash, path }) {
  const [open, setOpen] = useState(false)
  const [cur, setCur] = useState(null)
  const btn = useRef(null), x = useRef(null)
  const rows = onHash ? HOME_ROWS : PAGE_ROWS, more = onHash ? HOME_MORE : PAGE_MORE

  // Which section is on screen right now (home page only): highlighted in the list.
  const sectionNow = () => {
    let id = null
    for (const [h] of HOME_ROWS) { const el = document.querySelector(h === '#top' ? '#top' : h); if (el && el.getBoundingClientRect().top <= innerHeight * 0.45) id = h }
    return id || '#top'
  }
  const show = () => { if (onHash) setCur(sectionNow()); setOpen(true) }
  const hide = (refocus = true) => { setOpen(false); if (refocus) btn.current?.focus({ preventScroll: true }) }

  useEffect(() => {
    if (!open) return
    window.__lenis && window.__lenis.stop(); document.body.style.overflow = 'hidden'
    const key = e => { if (e.key === 'Escape') hide() }
    document.addEventListener('keydown', key)
    const t = setTimeout(() => x.current?.focus({ preventScroll: true }), 60)
    return () => { clearTimeout(t); document.removeEventListener('keydown', key); window.__lenis && window.__lenis.start(); document.body.style.overflow = '' }
  }, [open])
  // Turning the phone sideways (or any resize past the phone width) closes the menu.
  useEffect(() => {
    const m = matchMedia('(min-width: 701px)'), h = () => m.matches && setOpen(false)
    m.addEventListener('change', h); return () => m.removeEventListener('change', h)
  }, [])

  const click = h => e => {
    if (onHash && h.startsWith('#')) { e.preventDefault(); setOpen(false); setTimeout(() => onHash(h), 120) }
    else setOpen(false)
  }
  const isCur = h => (onHash ? h === cur : path === h)
  return (
    <>
      <button ref={btn} type="button" className="mm-btn" aria-label="Open menu" aria-expanded={open} aria-controls="mm-panel" onClick={show}><span /><span /><span /></button>
      {createPortal(
        <div className={'mm' + (open ? ' open' : '')} inert={!open}>
          <div className="mm-back" onClick={() => hide()} />
          <aside className="mm-panel" id="mm-panel" role="dialog" aria-modal="true" aria-label="Menu">
            <div className="mm-top">
              <img src="/brand/logo-nav.webp" alt="Memories Unlimited Tours and Travels" />
              <button ref={x} type="button" className="mm-x" aria-label="Close menu" onClick={() => hide()}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
            </div>
            <nav aria-label="Menu">
              <ul className="mm-list">
                {rows.map(([h, t], i) => (
                  <li key={h} style={{ '--i': i }}>
                    <a className="mm-row" href={h} onClick={click(h)} aria-current={isCur(h) ? 'true' : undefined}>
                      <i className="mm-dot" style={{ '--c': DOTS[i % DOTS.length] }} aria-hidden="true" />
                      <span>{t}</span>
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="mm-more">
                {more.map(([h, t], i) => <li key={h} style={{ '--i': rows.length + i }}><a className="mm-pill" href={h} onClick={click(h)} aria-current={path === h ? 'page' : undefined}>{t}</a></li>)}
              </ul>
            </nav>
            <div className="mm-foot">
              <a className="mm-call" href={telHref(CONFIG.phones[0])}>Call us</a>
              <a className="mm-wa" href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp<span className="sr-only"> (opens in a new tab)</span></a>
              <p>{fmtPhone(CONFIG.phones[0])} &middot; Kondhwa, Pune</p>
            </div>
          </aside>
        </div>, document.body)}
    </>
  )
}

export default function NavMenus({ onHash }) {
  // ONE menu is open at a time (state lives here), so moving across the bar can never leave two panels open or flicker.
  const [open, setOpen] = useState(null)
  const wrap = useRef(null), timer = useRef(0)
  const ctl = {
    open,
    // Switching between menus is instant; opening from closed waits 90 ms so a mouse just passing over the bar does nothing.
    enter: id => { clearTimeout(timer.current); if (open && open !== id) setOpen(id); else timer.current = setTimeout(() => setOpen(id), 90) },
    leave: () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(null), 260) },
    toggle: id => { clearTimeout(timer.current); setOpen(o => (o === id ? null : id)) },
    close: () => { clearTimeout(timer.current); setOpen(null) },
  }
  useEffect(() => {
    if (!open) return
    const out = e => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(null) }
    const key = e => { if (e.key === 'Escape') { setOpen(null); wrap.current?.querySelector('.nm.open .nm-caret, .nm.open .nm-btn')?.focus() } }
    document.addEventListener('pointerdown', out); document.addEventListener('keydown', key)
    return () => { document.removeEventListener('pointerdown', out); document.removeEventListener('keydown', key) }
  }, [open])
  useEffect(() => () => clearTimeout(timer.current), [])
  const path = typeof location !== 'undefined' ? location.pathname.replace(/\/+$/, '') || '/' : '/'
  const cur = h => (path === h || path.startsWith(h + '/') ? 'page' : undefined)
  return (
    <>
    <span ref={wrap} className="nm-wrap nm-desk">
      {!onHash && <a className="nm-home" href="/" aria-current={path === '/' ? 'page' : undefined}>Home</a>}
      <Menu id="trips" label="Trips" to="/tours" onHash={onHash} ctl={ctl}>{({ pick }) => (
        <>
          <p className="nm-head"><b>Trips for every kind of school day</b><span>Planned from Pune and Mumbai</span></p>
          <Wheel pick={pick} />
        </>)}</Menu>
      <Menu id="gallery" label="Gallery" to="#gallery" onHash={onHash} ctl={ctl} className="nm-nomobile">{({ href, pick }) => (
        <>
          <p className="nm-head"><b>Places you will see</b><span>Photos of the places on each tour</span></p>
          <ul className="nm-places">
            {Object.entries(GALLERY).map(([k, v]) => (
              <li key={k}><a className="nm-item nm-place" href={onHash ? '#gallery' : '/?g=' + k + '#gallery'} onClick={pick('#gallery', k)}><span className="nm-pin" aria-hidden="true" /><b>{v.label}</b></a></li>
            ))}
          </ul>
          <p className="nm-foot"><a className="nm-all" href={href('#gallery')} onClick={pick('#gallery')}>Open the gallery</a></p>
        </>)}</Menu>
      <Menu id="flyers" label="Flyers" to="#flyers" onHash={onHash} ctl={ctl} className="nm-nomobile">{({ href, pick }) => (
        <>
          <p className="nm-head"><b>Our flyers</b><span>Tap one to read it</span></p>
          <ul className="nm-flyers">
            {FLYERS.map((f, i) => (
              <li key={f.name}><a className="nm-item nm-flyer" href={onHash ? '#flyers' : '/?f=' + i + '#flyers'} onClick={e => { if (onHash) { e.preventDefault(); window.dispatchEvent(new CustomEvent('mu-flyer', { detail: i })) } ctl.close() }}><img src={f.src} alt="" width="44" height="64" loading="lazy" /><b>{f.name}</b></a></li>
            ))}
          </ul>
          <p className="nm-foot"><a className="nm-all" href={href('#flyers')} onClick={pick('#flyers')}>See all flyers</a></p>
        </>)}</Menu>
      {PAGES.map(([h, t]) => <a key={h} className="nm-pg" href={h} aria-current={cur(h)}>{t}</a>)}
      <Menu id="more" label="More" ctl={ctl} className="nm-morewrap">{({ href, pick }) => (
        <ul className="nm-pages">
          {PAGES.map(([h, t]) => <li key={h}><a className="nm-item nm-page" href={h} onClick={pick(h)} aria-current={cur(h)}><b>{t}</b></a></li>)}
          <li className="nm-mobonly"><a className="nm-item nm-page" href={href('#gallery')} onClick={pick('#gallery')}><b>Gallery</b></a></li>
          <li className="nm-mobonly"><a className="nm-item nm-page" href={href('#flyers')} onClick={pick('#flyers')}><b>Flyers</b></a></li>
        </ul>)}</Menu>
    </span>
    <MobileMenu onHash={onHash} path={path} />
    </>
  )
}
