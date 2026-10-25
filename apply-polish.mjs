// Memories Unlimited: phone + PC polish (Oct 2026)
// Run ONCE from the project folder (the one that contains package.json):   node apply-polish.mjs
// It checks every edit first. If anything does not match, it changes NOTHING and tells you which one.
// To undo after running:  git checkout .   (and delete src/polish.css and src/nav-polish.css)

import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const problems = [], notes = [], pending = new Map()
let applied = 0

function patch(file, edits) {
  const full = path.join(root, file)
  if (!fs.existsSync(full)) { problems.push(`${file}: file not found. Run this from the project folder.`); return }
  const raw = fs.readFileSync(full, 'utf8')
  const crlf = raw.includes('\r\n')
  let txt = crlf ? raw.replace(/\r\n/g, '\n') : raw
  for (const e of edits) {
    if (e.done && txt.includes(e.done)) { notes.push(`${file}: already done - ${e.name}`); continue }
    if (e.find instanceof RegExp) {
      if (!e.find.test(txt)) { problems.push(`${file}: could not find "${e.name}"`); continue }
      txt = txt.replace(e.find, () => e.replace)
    } else {
      const n = txt.split(e.find).length - 1
      if (n === 0) { problems.push(`${file}: could not find "${e.name}"`); continue }
      if (n > 1 && !e.all) { problems.push(`${file}: "${e.name}" matched ${n} places, expected 1`); continue }
      txt = txt.split(e.find).join(e.replace)
    }
    applied++
  }
  pending.set(full, crlf ? txt.replace(/\n/g, '\r\n') : txt)
}
function create(file, content) {
  const full = path.join(root, file)
  if (fs.existsSync(full) && fs.readFileSync(full, 'utf8').includes('Pass 12')) { notes.push(`${file}: already exists - left alone`); return }
  pending.set(full, content); applied++
}

/* ------------------------------------------------------------------ index.html: instant logo screen */
patch('index.html', [{
  name: 'instant logo loader',
  done: 'id="boot"',
  find: '</head><body><div id="root"></div>',
  replace: `<link rel="preload" as="image" href="/brand/logo-white.webp"/>
<style>
#boot{position:fixed;inset:0;z-index:500;background:#0f2a73;display:grid;place-content:center;justify-items:center;gap:1.4rem}
#boot img{display:block;width:min(440px,78vw);height:auto}
#boot i{display:block;width:min(240px,50vw);height:4px;border-radius:9px;background:#ffc83d;transform-origin:left;animation:boot-load 1.1s ease-in-out infinite}
@keyframes boot-load{0%{transform:scaleX(0);transform-origin:left}49%{transform:scaleX(1);transform-origin:left}50%{transform:scaleX(1);transform-origin:right}100%{transform:scaleX(0);transform-origin:right}}
@media (prefers-reduced-motion:reduce){#boot i{animation:none}}
</style>
</head><body><div id="root"><div id="boot" aria-hidden="true"><img src="/brand/logo-white.webp" alt="" width="440"/><i></i></div></div>`,
}])

/* ------------------------------------------------------------------ main.jsx: loader while a page downloads */
patch('src/main.jsx', [
  { name: 'import polish.css', done: "import './polish.css'", find: "import './App.css'", replace: "import './App.css'\nimport './polish.css'" },
  {
    name: 'page loader instead of blank screen',
    done: 'function PageLoader',
    find: "createRoot(document.getElementById('root')).render(<Suspense fallback={null}><Route /></Suspense>)",
    replace: `// Shown while a page's code downloads, so people see the logo instead of a blank white screen.
function PageLoader() {
  return <div className="splash route-splash" role="status" aria-label="Loading"><img className="sp-logo" src="/brand/logo-white.webp" alt="Memories Unlimited Tours and Travels" /><div className="sp-bar" /></div>
}
createRoot(document.getElementById('root')).render(<Suspense fallback={<PageLoader />}><Route /></Suspense>)`,
  },
])

/* ------------------------------------------------------------------ trust.js + About: no more "parents" travelling */
patch('src/trust.js', [
  { name: 'label: of happy students', done: "label: 'of happy students', sub", find: "label: 'of happy students and parents'", replace: "label: 'of happy students'" },
  { name: 'label: happy students (counter)', done: "label: 'happy students', sub", find: "label: 'happy students and parents'", replace: "label: 'happy students'" },
  { name: 'sub: trusted by schools', done: "sub: 'Trusted by schools'", find: "sub: 'Trusted by families'", replace: "sub: 'Trusted by schools'", all: true },
])
patch('src/pages/InfoPages.jsx', [
  { name: 'About tagline', done: 'trusted by schools and thousands of students.', find: 'trusted by thousands of students and parents.', replace: 'trusted by schools and thousands of students.' },
])

/* ------------------------------------------------------------------ App.jsx: phone hero + home text */
patch('src/App.jsx', [
  { name: 'import trip groups', done: 'TRIP_KINDS }', find: "import TrustRibbon from './TrustRibbon.jsx'", replace: "import TrustRibbon from './TrustRibbon.jsx'\nimport { GROUPS as TRIP_KINDS } from './groups.js'" },
  { name: 'phone flag in Hero', done: 'const phone = useIsPhone()', find: 'const N = STOP_IDS.length', replace: 'const N = STOP_IDS.length\n  const phone = useIsPhone()' },
  { name: 'animate chips in', done: ".hx-cta > *, .hx-kinds'", find: ".from('.hx-cta > *'", replace: ".from('.hx-cta > *, .hx-kinds'" },
  {
    name: 'hero buttons + trip chips (phone)',
    done: 'hx-all',
    find: /<button className="btn gold" onClick=\{\(\) => go\('#enquire'\)\}>Plan our school trip<\/button>\s*<button className="btn ghost" onClick=\{\(\) => go\('#tours'\)\}>See our tours<\/button>\s*<\/div>/,
    replace: `{phone
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
        )}`,
  },
  {
    name: 'splash logo no longer blinks',
    done: "{ scale: 0.96, y: 8 }",
    find: "{ opacity: 0, scale: 0.86, y: 14 }, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power3.out' }",
    replace: "{ scale: 0.96, y: 8 }, { scale: 1, y: 0, duration: 0.45, ease: 'power3.out' }",
  },
  { name: 'home stat wording', done: '<span>of students have travelled with us</span>', find: '<span>of students and parents have travelled with us</span>', replace: '<span>of students have travelled with us</span>' },
])

/* ------------------------------------------------------------------ NavMenu.jsx: phone menu with the trips wheel */
patch('src/NavMenu.jsx', [
  { name: 'import nav-polish.css', done: "import './nav-polish.css'", find: "import './nav-menu.css'", replace: "import './nav-menu.css'\nimport './nav-polish.css'" },
  { name: 'Wheel: mobile prop', done: 'function Wheel({ pick, mobile = false })', find: 'function Wheel({ pick }) {', replace: 'function Wheel({ pick, mobile = false }) {' },
  { name: 'Wheel: icon size', done: 'size={mobile ? 26 : 34}', find: '<Icon n={g.icon} size={34} />', replace: '<Icon n={g.icon} size={mobile ? 26 : 34} />' },
  { name: 'Wheel: tap label', done: "mobile ? 'Tap to view'", find: ">Click to view<b>All trips</b></a>", replace: ">{mobile ? 'Tap to view' : 'Click to view'}<b>All trips</b></a>" },
  {
    name: 'home menu rows',
    done: "['#gallery', 'Gallery'], ['#reviews', 'Reviews'], ['#flyers', 'Flyers']]",
    find: "const HOME_ROWS = [['#top', 'Home'], ['#about', 'About us'], ['#tours', 'Tours'], ['#gallery', 'Gallery'], ['#reviews', 'Reviews'], ['#flyers', 'Flyers'], ['#enquire', 'Enquire']]",
    replace: "const HOME_ROWS = [['#top', 'Home'], ['#about', 'About us'], ['#gallery', 'Gallery'], ['#reviews', 'Reviews'], ['#flyers', 'Flyers']]",
  },
  {
    name: 'home menu pills',
    done: "['#tours', 'Popular tours']",
    find: "const HOME_MORE = [['/tours', 'All trips'], ['/safety', 'Safety'], ['/faqs', 'FAQs'], ['/contact', 'Contact']]",
    replace: "const HOME_MORE = [['#tours', 'Popular tours'], ['/safety', 'Safety'], ['/faqs', 'FAQs'], ['/contact', 'Contact']]",
  },
  {
    name: 'page menu rows',
    done: "['/#flyers', 'Flyers'], ['/about', 'About us']]",
    find: "const PAGE_ROWS = [['/', 'Home'], ['/tours', 'Trips'], ['/#gallery', 'Gallery'], ['/#flyers', 'Flyers'], ['/about', 'About us'], ['/#enquire', 'Enquire']]",
    replace: "const PAGE_ROWS = [['/', 'Home'], ['/#gallery', 'Gallery'], ['/#flyers', 'Flyers'], ['/about', 'About us']]",
  },
  {
    name: 'page menu pills',
    done: "['/#tours', 'Popular tours']",
    find: "const PAGE_MORE = [['/safety', 'Safety'], ['/faqs', 'FAQs'], ['/contact', 'Contact']]",
    replace: "const PAGE_MORE = [['/#tours', 'Popular tours'], ['/safety', 'Safety'], ['/faqs', 'FAQs'], ['/contact', 'Contact']]",
  },
  {
    name: 'wheel card at top of phone menu',
    done: 'className="mm-trips"',
    find: '<ul className="mm-list">',
    replace: `<section className="mm-trips" aria-labelledby="mm-trips-h">
                <p className="mm-trips-h" id="mm-trips-h">Trips for every kind of school day</p>
                <Wheel mobile pick={() => () => setOpen(false)} />
              </section>
              <ul className="mm-list">`,
  },
])

/* ------------------------------------------------------------------ new CSS files */
create('src/polish.css', `/* Pass 12 (Oct 2026): page loader, PC "a memory" fix, calmer phone hero. Loaded after App.css. */

/* Loader between pages (same look as the home page splash) */
.route-splash .sp-bar { animation: sp-load 1.1s ease-in-out infinite; }
@keyframes sp-load {
  0% { transform: scaleX(0); transform-origin: left; }
  49% { transform: scaleX(1); transform-origin: left; }
  50% { transform: scaleX(1); transform-origin: right; }
  100% { transform: scaleX(0); transform-origin: right; }
}

/* PC: "a memory" is smaller and sits on its own line, so the gold block no longer covers "Every trip" */
@media (min-width: 701px) {
  .reel-h { font-size: clamp(3.6rem, 12.5vw, 11.5rem); line-height: 1; gap: .06em; }
  .reel-h span { line-height: 1; }
  .reel-b mark { display: inline-block; line-height: .98; padding: .02em .14em .1em; }
}

/* PHONE hero: headline on two lines, one clear button to all trips, four trip types, quieter destination line */
@media (max-width: 700px) {
  .hx-h1 { font-size: clamp(2rem, 10.6vw, 3.3rem); }
  .hx-row { white-space: nowrap; }
  .hx-sub { margin-top: .9rem; font-size: 1rem; max-width: 26rem; }
  .hx-copy { margin-bottom: 1.4rem; }
  .hx-cta { flex-direction: column; align-items: stretch; gap: .6rem; margin-top: 1.3rem; max-width: 20rem; }
  .hx-cta .btn { justify-content: center; text-align: center; }
  .hx-cta .btn.gold { padding: 1rem 1.4rem; font-size: 1.08rem; }
  .hx-cta .btn.ghost { padding: .7rem 1.2rem; font-size: .95rem; }
  .hx-kinds { list-style: none; margin: 1rem 0 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; max-width: 20rem; }
  .hx-kinds a { display: flex; align-items: center; gap: .5rem; min-height: 42px; padding: .3rem .8rem; border-radius: 99px; border: 1.5px solid rgba(255, 255, 255, .55); background: rgba(10, 29, 87, .5); color: #fff; font-weight: 700; font-size: .9rem; text-decoration: none; }
  .hx-kinds a::before { content: ""; flex: none; width: .65rem; height: .65rem; border-radius: 50%; background: var(--c); box-shadow: 0 0 0 2px #fff; }
  .hx-kinds a:active { background: rgba(255, 255, 255, .22); }
  .hx-count, .hx-meta { display: none; }
  .hx-name { font-size: 1.1rem; }
  .hx-ticket { padding-top: .7rem; }
}
`)

create('src/nav-polish.css', `/* Pass 12 (Oct 2026): calmer PC navigation, trips wheel inside the phone menu. Loaded after nav-menu.css. */

/* PC: no always-on bubbles. Text stays bold; a soft square-ish highlight appears on hover; current page gets a gold underline. */
@media (min-width: 701px) {
  :root .nm-desk .nm, :root .nm-desk a.nm-pg, :root .nm-desk a.nm-home { border-radius: 10px; background: transparent; }
  :root .nm-desk .nm .nm-link, :root .nm-desk .nm .nm-btn, :root .nm-desk .nm .nm-caret { border-radius: 10px; }
  :root .nm-desk .nm:hover, :root .nm-desk .nm.open, :root .nm-desk a.nm-pg:hover, :root .nm-desk a.nm-home:hover { background: rgba(15, 42, 115, .09); color: #0f2a73; }
  :root .nm-desk a.nm-pg[aria-current], :root .nm-desk a.nm-home[aria-current] { background: transparent; color: #0f2a73; box-shadow: inset 0 -3px 0 #ffc83d; border-radius: 10px 10px 4px 4px; }
  :root .nav div a.pill { border-radius: 10px; }
  :root .pg-head .pg-nav a.pg-cta { border-radius: 10px; }

  /* Route pages have the navy bar */
  :root .pg-head .nm-desk .nm, :root .pg-head .nm-desk a.nm-pg, :root .pg-head .nm-desk a.nm-home { background: transparent; }
  :root .pg-head .nm-desk .nm:hover, :root .pg-head .nm-desk .nm.open, :root .pg-head .nm-desk a.nm-pg:hover, :root .pg-head .nm-desk a.nm-home:hover { background: rgba(255, 255, 255, .14); color: #fff; }
  :root .pg-head .nm-desk .nm:hover .nm-link, :root .pg-head .nm-desk .nm:hover .nm-btn, :root .pg-head .nm-desk .nm:hover .nm-caret,
  :root .pg-head .nm-desk .nm.open .nm-link, :root .pg-head .nm-desk .nm.open .nm-btn, :root .pg-head .nm-desk .nm.open .nm-caret,
  :root .pg-head .nm-desk a.nm-pg:hover, :root .pg-head .nm-desk a.nm-home:hover { color: #fff; }
  :root .pg-head .nm-desk a.nm-pg[aria-current], :root .pg-head .nm-desk a.nm-home[aria-current] { background: transparent; color: #fff; box-shadow: inset 0 -3px 0 #ffc83d; border-radius: 10px 10px 4px 4px; }
}

/* PHONE menu: the trips wheel leads, rows and pills are tighter */
@media (max-width: 700px) {
  :root .mm a.mm-row { min-height: 48px; font-size: 1.2rem; padding: .35rem .8rem; }
  :root .mm-list { gap: .05rem; margin-top: 0; }
  :root .mm-more { margin-top: .9rem; padding-top: .9rem; gap: .5rem; }
  :root .mm a.mm-pill { min-height: 44px; font-size: .95rem; }
  :root .mm-foot { padding-top: 1rem; }

  .mm-trips { margin: .2rem 0 .8rem; padding: .75rem .7rem .8rem; border-radius: 22px; border: 2px solid #ffc83d; color: #fff;
    background: radial-gradient(120% 100% at 50% 100%, #7a2fd0 0%, #3b1a9a 42%, #1a1470 100%); box-shadow: 0 10px 24px rgba(42, 19, 128, .28); }
  .mm-trips-h { margin: 0 0 .6rem; text-align: center; font-size: .98rem; font-weight: 800; letter-spacing: -.01em; line-height: 1.2; }
  .mm div.wheel { display: block; position: relative; width: 100%; aspect-ratio: 1 / .7; overflow: hidden; border-radius: 999px 999px 0 0; }
  .mm a.wheel-item { display: flex; flex-direction: column; align-items: center; gap: .3rem; min-width: 4.2rem; padding: .2rem; border-radius: 18px; color: #fff; text-decoration: none; font-weight: 800; font-size: .78rem; text-align: center; line-height: 1.1; background: transparent; }
  .mm .wheel-ic { width: 3rem; height: 3rem; }
  .mm a.wheel-go { position: absolute; left: 50%; bottom: 0; transform: translateX(-50%); width: 42%; height: 32%; display: flex; flex-direction: column; align-items: center; justify-content: center;
    border-radius: 999px 999px 0 0; background: #ffc83d; color: #2a1380; text-decoration: none; font-weight: 600; font-size: .72rem; line-height: 1.1; box-shadow: 0 0 22px rgba(255, 200, 61, .8); }
  .mm a.wheel-go b { font-size: 1.1rem; font-weight: 800; }
  .mm a.wheel-go:active { background: #fff; }
}
`)

/* ------------------------------------------------------------------ report + write */
if (problems.length) {
  console.log('\nNothing was changed. These edits did not match your files:\n')
  problems.forEach(p => console.log('  - ' + p))
  console.log('\nSend me these lines and I will adjust the script.')
  process.exit(1)
}
for (const [full, content] of pending) fs.writeFileSync(full, content)
notes.forEach(n => console.log('  note: ' + n))
console.log(`\nDone: ${applied} edit(s) applied across ${pending.size} file(s).`)
console.log('Next: npm run dev, check the site, then git add . / git commit / git push.')
