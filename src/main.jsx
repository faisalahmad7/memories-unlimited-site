import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'

// Lightweight routing: real URL paths, resolved once on load. Links between routes are normal <a href> links, so
// direct load, refresh, back and forward all work without a router library. The server must serve index.html for
// unknown paths (Vite dev and preview do this; static hosts need a rewrite rule, see README).
const App = lazy(() => import('./App.jsx'))
const pick = (m, name) => ({ default: m[name] })
const ToursIndex = lazy(() => import('./pages/TourPages.jsx').then(m => pick(m, 'ToursIndex')))
const TourCategory = lazy(() => import('./pages/TourPages.jsx').then(m => pick(m, 'TourCategory')))
const info = name => lazy(() => import('./pages/InfoPages.jsx').then(m => pick(m, name)))
const STATIC = { '/about': info('About'), '/safety': info('Safety'), '/faqs': info('Faqs'), '/contact': info('Contact'), '/credits': info('Credits') }
const NotFound = lazy(() => import('./pages/TourPages.jsx').then(m => pick(m, 'NotFound')))

function Route() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/' || path === '/index.html') return <App />
  if (STATIC[path]) { const P = STATIC[path]; return <P /> }
  if (path === '/tours') return <ToursIndex />
  const m = path.match(/^\/tours\/([a-z0-9-]+)$/)
  if (m) return <TourCategory slug={m[1]} />
  return <NotFound />
}
createRoot(document.getElementById('root')).render(<Suspense fallback={null}><Route /></Suspense>)
