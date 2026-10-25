// Trust ribbon: bright tiles with numbers that count up when they scroll into view (reduced motion: shown at once).
import { useEffect, useRef, useState } from 'react'
import { Icon } from './icons.jsx'
import { TRUST } from './trust.js'
import './trust.css'

function Count({ to, decimals = 0, suffix = '', run }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(to); return }
    let raf, t0
    const step = t => { t0 ??= t; const k = Math.min(1, (t - t0) / 1600), e = 1 - Math.pow(1 - k, 3); setV(to * e); if (k < 1) raf = requestAnimationFrame(step) }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [run, to])
  const shown = decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-IN')
  return <>{shown}{suffix}</>
}

export default function TrustRibbon({ hideOnPhone = false }) {
  const root = useRef(null)
  const [run, setRun] = useState(false)
  useEffect(() => {
    const el = root.current
    if (!el || typeof IntersectionObserver === 'undefined') { setRun(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRun(true); io.disconnect() } }, { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <section ref={root} className={'tr' + (run ? ' tr-on' : '') + (hideOnPhone ? ' tr-nophone' : '')} aria-label="Why schools and parents trust us">
      <ul className="tr-in">
        {TRUST.map((t, i) => (
          <li key={t.label} className="tr-i" style={{ '--tb': t.bg, '--ti': t.ink, '--d': i * 90 + 'ms' }}>
            <span className="tr-ic"><Icon n={t.icon} size={26} /></span>
            <b className={'tr-big' + (t.big ? ' tr-txt' : '')}>{t.big ? t.big : <Count to={t.value} decimals={t.decimals} suffix={t.suffix} run={run} />}</b>
            <span className="tr-lb">{t.label}</span>
            <small>{t.sub}</small>
          </li>
        ))}
      </ul>
    </section>
  )
}
