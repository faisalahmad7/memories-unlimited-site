// Shared building blocks for the route pages. Each page picks its own theme, hero layout and illustration.
import { useEffect, useState } from 'react'
import { CONFIG, fmtPhone, telHref, waLink } from '../site.config.js'
import { loadDestination } from '../photos.js'
import NavMenus from '../NavMenu.jsx'
import TrustRibbon from '../TrustRibbon.jsx'
import { YEARS, FOUNDED } from '../trust.js'
import './pages.css'

export { TrustRibbon }
export function useTitle(t) { useEffect(() => { document.title = t + ' | Memories Unlimited Tours & Travels' }, [t]) }

// Destination photos for a hero. Returns [{ id, list }]. Empty until loaded; heroes look fine with an illustration instead.
export function useDestPhotos(ids) {
  const key = ids.join(',')
  const [out, setOut] = useState([])
  useEffect(() => {
    let ok = true
    if (!ids.length) return
    Promise.all(ids.map(id => loadDestination(id).catch(() => []))).then(lists => { if (ok) setOut(lists.map((list, i) => ({ id: ids[i], list }))) })
    return () => { ok = false }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps
  return out
}

const FOOT = [['/tours', 'Trips'], ['/safety', 'Safety'], ['/faqs', 'FAQs'], ['/about', 'About'], ['/contact', 'Contact']]

export function PageShell({ theme = 'blue', children }) {
  return (
    <div className={'pg th-' + theme}>
      <a className="pg-skip" href="#pg-main">Skip to content</a>
      <header className="pg-head">
        <a className="pg-brand" href="/"><img src="/brand/logo-nav.webp" alt="Memories Unlimited Tours and Travels" width="82" height="52" /></a>
        <nav aria-label="Main" className="pg-nav">
          <NavMenus />
          <a href="/#enquire" className="pg-cta">Enquire</a>
        </nav>
      </header>
      <main id="pg-main">{children}</main>
      <footer className="pg-foot">
        <div className="pg-wrap pg-foot-grid">
          <div><strong>{CONFIG.name}</strong><p>Planning school trips since {FOUNDED}, {YEARS} years and counting.</p><p>Pune and Mumbai</p><p>Office: Kondhwa, Pune</p></div>
          <div><strong>Explore</strong><p>{FOOT.map(([h, t]) => <a key={h} href={h}>{t}</a>)}</p></div>
          <div><strong>Talk to us</strong><p><a href={telHref(CONFIG.phones[0])}>{fmtPhone(CONFIG.phones[0])}</a><a href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp<span className="sr-only"> (opens in a new tab)</span></a></p></div>
        </div>
      </footer>
    </div>
  )
}

// Hero. Every page hero is a full-bleed photo with a dark shade, so the headline always reads. The first photo is the
// background; the next two (if any) sit beside the text as tilted cards. With no photo (still loading, or none found) the
// hero falls back to a colour gradient with a line illustration. `tagline` is the elegant line under a one-word headline.
export function Hero({ variant = 'split', title, tagline, lead, actions, chips, photos = [], art, crumb, motif }) {
  const imgs = photos.flatMap(p => (p.list || []).slice(0, 1).map(x => ({ ...x, place: p.id }))).slice(0, 3)
  const bg = imgs[0], side = imgs.slice(1)
  return (
    <section className={'hero2 hero2-' + variant + (bg ? ' hero2-photo' : '')}>
      {bg && <div className="hero2-bg" style={{ backgroundImage: `url(${bg.src})` }} aria-hidden="true" />}
      {!bg && motif && <Scene motif={motif} />}
      <div className="hero2-shade" aria-hidden="true" />
      <div className="pg-wrap hero2-in">
        {variant === 'center' && !bg && !motif && art && <div className="hero2-art">{art}</div>}
        <div className="hero2-copy">
          {crumb}
          <h1>{title}</h1>
          {tagline && <p className="hero2-tag">{tagline}</p>}
          {lead && <p className="hero2-lead">{lead}</p>}
          {actions && <div className="hero2-actions">{actions}</div>}
          {chips && chips.length > 0 && <ul className="hero2-chips">{chips.map(c => <li key={c}>{c}</li>)}</ul>}
        </div>
        {variant === 'split' && (
          <div className="hero2-side">
            {side.length ? <div className="stack">{side.map((x, i) => <img key={x.file} className={'sk sk' + i} src={x.src} alt="" loading="lazy" width="640" height="420" />)}</div> : (!bg && !motif && art)}
          </div>
        )}
      </div>
    </section>
  )
}

// Original illustrated hero background, drawn here (not a photo), for pages where we have no suitable real picture yet.
// A coach drives along the road, clouds drift, and a large motif sits on the right. motif: 'safety' | 'faq' | 'chat' | 'bus'.
const MOTIFS = {
  safety: <g transform="translate(1180 80)"><path d="M130 0 L260 50 V150 C260 235 205 290 130 318 C55 290 0 235 0 150 V50 Z" fill="rgba(255,255,255,.14)" stroke="currentColor" strokeWidth="9" strokeLinejoin="round" /><path d="M72 160 L112 202 L194 112" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" /></g>,
  faq: <g transform="translate(1130 70)"><path d="M0 20 H250 V170 H110 L55 225 V170 H0 Z" fill="rgba(255,255,255,.14)" stroke="currentColor" strokeWidth="9" strokeLinejoin="round" /><path d="M105 75 C105 40 165 40 165 78 C165 108 128 104 128 138" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" /><circle cx="128" cy="160" r="8" fill="currentColor" /><g transform="translate(150 150)"><path d="M30 20 H190 V130 H110 L82 165 V130 H30 Z" fill="rgba(255,255,255,.1)" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" opacity=".7" /><circle cx="80" cy="75" r="7" fill="currentColor" opacity=".7" /><circle cx="110" cy="75" r="7" fill="currentColor" opacity=".7" /><circle cx="140" cy="75" r="7" fill="currentColor" opacity=".7" /></g></g>,
  chat: <g transform="translate(1160 80)"><rect x="40" y="0" width="170" height="300" rx="34" fill="rgba(255,255,255,.14)" stroke="currentColor" strokeWidth="9" /><path d="M95 22 H155" stroke="currentColor" strokeWidth="9" strokeLinecap="round" /><path d="M72 90 H178 V150 H112 L90 174 V150 H72 Z" fill="currentColor" opacity=".85" /><path d="M178 190 H92 V240 H138 L160 262 V240 H178 Z" fill="rgba(255,255,255,.35)" /></g>,
  bus: null,
}
function Scene({ motif }) {
  return (
    <div className="scn" aria-hidden="true">
      <svg viewBox="0 0 1600 600" preserveAspectRatio="xMidYMax slice" focusable="false">
        <circle className="scn-sun" cx="930" cy="130" r="64" fill="currentColor" opacity=".9" />
        <circle cx="930" cy="130" r="104" fill="currentColor" opacity=".18" />
        <g fill="#fff" opacity=".22">
          <g className="scn-c1"><ellipse cx="260" cy="110" rx="90" ry="26" /><ellipse cx="330" cy="92" rx="60" ry="26" /><ellipse cx="205" cy="96" rx="46" ry="20" /></g>
          <g className="scn-c2"><ellipse cx="760" cy="210" rx="80" ry="22" /><ellipse cx="820" cy="195" rx="50" ry="22" /></g>
          <g className="scn-c3"><ellipse cx="1360" cy="70" rx="70" ry="20" /><ellipse cx="1410" cy="58" rx="44" ry="20" /></g>
        </g>
        {MOTIFS[motif]}
        <path d="M0 470 C 200 380 380 400 560 450 C 760 505 900 360 1120 390 C 1320 418 1460 450 1600 400 V600 H0 Z" fill="#000" opacity=".16" />
        <path d="M0 520 C 240 450 420 470 640 505 C 860 540 1040 470 1260 480 C 1420 487 1520 510 1600 490 V600 H0 Z" fill="#fff" opacity=".12" />
        <rect y="548" width="1600" height="52" fill="#000" opacity=".28" />
        <path d="M0 574 H1600" stroke="#fff" strokeWidth="4" strokeDasharray="38 30" opacity=".6" className="scn-road" />
        <g fill="#000" opacity=".2"><g transform="translate(120 470)"><rect x="-4" y="30" width="8" height="48" /><circle cy="14" r="30" /></g><g transform="translate(1480 480)"><rect x="-4" y="26" width="8" height="42" /><circle cy="12" r="26" /></g><g transform="translate(640 500)"><rect x="-3" y="20" width="6" height="30" /><circle cy="8" r="20" /></g></g>
        <g className="scn-bus">
          <rect x="0" y="498" width="190" height="62" rx="14" fill="#ffc83d" />
          <rect x="0" y="536" width="190" height="10" fill="#d6402c" />
          <g fill="#7fd0ff"><rect x="14" y="508" width="30" height="22" rx="4" /><rect x="52" y="508" width="30" height="22" rx="4" /><rect x="90" y="508" width="30" height="22" rx="4" /><rect x="128" y="508" width="30" height="22" rx="4" /><rect x="164" y="508" width="20" height="30" rx="4" /></g>
          <g fill="#0f2a73"><circle cx="40" cy="562" r="14" /><circle cx="150" cy="562" r="14" /></g><g fill="#fff"><circle cx="40" cy="562" r="5" /><circle cx="150" cy="562" r="5" /></g>
        </g>
      </svg>
    </div>
  )
}

export function Section({ title, lead, tone, children, id }) {
  return (
    <section className={'sec' + (tone ? ' sec-' + tone : '')} id={id}>
      <div className="pg-wrap">
        {title && <h2 className="sec-h">{title}</h2>}
        {lead && <p className="sec-lead">{lead}</p>}
        {children}
      </div>
    </section>
  )
}

export function Steps({ items }) {
  return <ol className="steps">{items.map(([t, d], i) => <li key={t}><span className="steps-n" aria-hidden="true">{i + 1}</span><div><h3>{t}</h3><p>{d}</p></div></li>)}</ol>
}

export function Pillars({ items }) {
  return <ul className="pillars">{items.map(([t, d, tag]) => <li key={t}><span className="pillar-i" aria-hidden="true">{tag}</span><h3>{t}</h3><p>{d}</p></li>)}</ul>
}

export const WaButton = ({ text, children, ghost }) => (
  <a className={'pg-btn' + (ghost ? ' ghost' : '')} href={waLink(text)} target="_blank" rel="noopener noreferrer">{children}<span className="sr-only"> (opens in a new tab)</span></a>
)

export function CtaBand({ title = 'Tell us your plan', text = 'Share the school, grade, number of students and the month you want to travel. We will reply with options.', wa = 'Hello Memories Unlimited! I would like to plan a school trip.' }) {
  return (
    <section className="cta-band">
      <div className="pg-wrap cta-in">
        <div><h2>{title}</h2><p>{text}</p></div>
        <div className="cta-btns">
          <WaButton text={wa}>Message us on WhatsApp</WaButton>
          <a className="pg-btn ghost on-dark" href={telHref(CONFIG.phones[0])}>Call {fmtPhone(CONFIG.phones[0])}</a>
          <a className="pg-btn ghost on-dark" href="/#enquire">Send an enquiry</a>
        </div>
      </div>
    </section>
  )
}

// Simple original line illustrations (drawn here, not photos of real trips).
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round' }
export const Art = {
  Tent: () => <svg className="art" viewBox="0 0 200 160" role="img" aria-label="Illustration of a camp tent under the stars"><g {...S}><path d="M20 130 L100 30 L180 130 Z" /><path d="M100 30 L100 130" /><path d="M72 130 L100 90 L128 130" /><path d="M10 138 H190" /></g><g fill="currentColor"><circle cx="40" cy="30" r="4" /><circle cx="160" cy="22" r="3" /><circle cx="140" cy="52" r="3" /></g></svg>,
  Shield: () => <svg className="art" viewBox="0 0 200 180" role="img" aria-label="Illustration of a shield with a tick"><g {...S}><path d="M100 14 L170 40 V90 C170 130 140 156 100 168 C60 156 30 130 30 90 V40 Z" /><path d="M70 92 L92 114 L132 70" /></g></svg>,
  Question: () => <svg className="art" viewBox="0 0 200 180" role="img" aria-label="Illustration of a speech bubble with a question mark"><g {...S}><path d="M30 30 H170 V120 H90 L55 152 V120 H30 Z" /><path d="M84 62 C84 44 116 44 116 62 C116 78 100 76 100 92" /></g><circle cx="100" cy="106" r="4" fill="currentColor" /></svg>,
  Compass: () => <svg className="art" viewBox="0 0 200 180" role="img" aria-label="Illustration of a compass"><g {...S}><circle cx="100" cy="90" r="68" /><path d="M126 64 L112 112 L74 116 L88 68 Z" /></g><circle cx="100" cy="90" r="5" fill="currentColor" /></svg>,
  Pin: () => <svg className="art" viewBox="0 0 200 180" role="img" aria-label="Illustration of a map pin"><g {...S}><path d="M100 164 C60 116 44 94 44 70 A56 56 0 0 1 156 70 C156 94 140 116 100 164 Z" /><circle cx="100" cy="70" r="20" /></g></svg>,
  Camera: () => <svg className="art" viewBox="0 0 200 180" role="img" aria-label="Illustration of a camera"><g {...S}><rect x="26" y="50" width="148" height="100" rx="16" /><path d="M70 50 L82 30 H118 L130 50" /><circle cx="100" cy="100" r="28" /></g></svg>,
  Bus: () => <svg className="art" viewBox="0 0 200 180" role="img" aria-label="Illustration of a coach"><g {...S}><rect x="22" y="40" width="156" height="92" rx="14" /><path d="M22 84 H178" /><path d="M60 40 V84 M100 40 V84 M140 40 V84" /></g><circle cx="62" cy="136" r="12" fill="none" stroke="currentColor" strokeWidth="5" /><circle cx="140" cy="136" r="12" fill="none" stroke="currentColor" strokeWidth="5" /></svg>,
  Phone: () => <svg className="art" viewBox="0 0 200 180" role="img" aria-label="Illustration of a phone with a chat bubble"><g {...S}><rect x="62" y="16" width="76" height="148" rx="14" /><path d="M62 40 H138 M62 140 H138" /><path d="M146 52 H186 V82 H168 L156 94 V82 H146 Z" /></g></svg>,
  Flag: () => <svg className="art" viewBox="0 0 200 180" role="img" aria-label="Illustration of a flag on a hill"><g {...S}><path d="M60 160 V24" /><path d="M60 28 H150 L132 54 L150 80 H60" /><path d="M20 164 H180" /></g></svg>,
}
