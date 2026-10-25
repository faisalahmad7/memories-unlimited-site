# MEMORIES UNLIMITED — MASTER RESTRUCTURE PROMPT + LIVING HANDOFF
**Version:** 1.0 · **Prepared:** 24 October 2026  
**Purpose:** Single source of truth for Claude Code / Claude sessions working on the Memories Unlimited Tours & Travels React website. Keep this file at the project root and update it throughout the work.

---

# PART A — MASTER PROMPT (PASTE THIS INTO CLAUDE)

You are the lead frontend engineer, UX designer, accessibility specialist, performance engineer, and careful technical handoff owner for **Memories Unlimited Tours & Travels**, a Pune-based operator focused on school picnics, educational tours, field trips, camping, edutainment, and domestic/international group tours.

I have supplied a ZIP of the existing React/Vite website. Treat the supplied codebase as the source of truth for implementation. Do not replace it with a generic template. Your task is to **audit first, then restructure and improve the existing site incrementally**, preserving the current visual identity while making it sharper, more premium, trustworthy, multi-page, and extremely good on phones.

## Non-negotiable working method

1. **Inspect before editing.** Read `CLAUDE.md`, `README.md`, `VERIFY.md`, `CREDITS.md`, `package.json`, all files in `src/`, all CSS, all assets, and the supplied price-sheet PDF and Instagram MHTML if present. Map all routes, components, animations, data flows, dependencies, image sources, forms, and calls to external services. Search the full codebase for related references before changing a component.
2. Create a baseline: run `npm install` only if necessary, then `npm run build`. Record current errors/warnings and any browser/runtime issues you can verify. Never claim a test passed unless you actually ran it.
3. Keep a concise change log and update the **HANDOFF / LIVING STATUS** section at the end of this same file as you work. This file is the handoff artifact; do not create a separate handoff file unless there is a compelling technical reason.
4. Make small, coherent changes. After each meaningful batch, build and test. Do not rewrite the whole app in one risky pass. Keep the site runnable at every checkpoint.
5. If context/token limits are approaching, stop starting new work. First update this file with current status, exact files changed, tests run/results, known bugs, decisions, and the next three concrete tasks. Ensure the project still builds. Tell the user to download/re-upload the updated project ZIP and this file to the next Claude session.
6. Before ending a session, create a fresh project ZIP **without `.git/`, `node_modules/`, build caches, or secrets**, but include source, public assets, lockfile, relevant documentation, and this master handoff file. Verify the ZIP can be opened and contains the latest code. Never imply that you changed the user's local files; work only in the supplied workspace.
7. Do not silently remove features. Audit each existing component before deleting it, and document any intentional removals.

## Existing stack — preserve unless evidence proves a change is necessary

- React 19 + Vite
- GSAP 3 and `@gsap/react` dependency, GSAP ScrollTrigger
- Lenis smooth scrolling driven by the GSAP ticker
- `motion` package
- Local React Bits components in `src/rb/` (license file is present; use only within this site and retain its license)
- Existing content/data modules: `src/site.config.js`, `src/tours.js`, `src/photos.js`
- Existing public assets under `public/brand/` and `public/flyers/`

Do not migrate frameworks or add a heavy UI kit without a strong, documented reason. Prefer the current tools, code splitting, reusable page layouts, accessible semantic HTML, and small dependencies.

## Current code facts and important bug

The homepage's `Hero` component in `src/App.jsx` has:
- `const [si, setSi] = useState(0)`
- `const picked = useRef(false)`
- an interval every 4500ms that advances the hero destination only when `!picked.current`
- destination button handlers that do `picked.current = true; setSi(i)`

**This explicitly stops the hero slideshow forever after a visitor clicks any destination button.** Fix it. Clicking a destination should immediately select that destination and update the active state/caption, but the slideshow must continue cycling afterwards. Implement a clear, tested behavior: after a click, either continue cycling from the selected destination on the next interval, or reset a timer and continue cycling after 4.5 seconds. Do not leave a sticky `picked` boolean that disables rotation. Use a cleanup-safe interval/timeout or a small reusable hook. Handle React Strict Mode correctly and do not create duplicate timers. Do not let animation/timer callbacks capture stale state. Honor `prefers-reduced-motion`; for reduced motion, do not auto-advance, but still let the user manually choose a destination.

Also check the hero slideshow's visual transition, image loading, overlay contrast, caption changes, and mobile layout. Preload or prioritize only the first hero image and lazy-load lower-priority imagery. Do not fetch a huge set of images before the first meaningful paint.

## Design direction

- Retain the existing warm cream / royal blue / sunshine yellow identity, with sky blue, grass green, and coral as accents. Refine contrast, spacing, hierarchy, and consistency; do not rebrand from scratch.
- Make the result feel like a polished, credible educational travel company—not a toy site, generic travel template, or loud animation demo.
- Use premium, highly legible typography with a clear display/body pairing. Existing fonts include Bricolage Grotesque and Caveat. Evaluate whether Caveat should be an occasional accent only; avoid using novelty/script type for core navigation or body copy. Use a performant font strategy and sensible fallbacks.
- Make navbar more prominent: larger, bolder, easier-to-scan labels, good spacing, visible active state, and a deliberate mobile navigation pattern. Avoid hiding every useful navigation link on mobile. Do not let a fixed/sticky nav obscure page anchors.
- Hero: upgrade composition, crop, readability, CTA hierarchy, and responsive behavior while preserving the destination-selector concept if it remains the best UX. Avoid a giant, slow, over-animated first viewport.
- “Every trip, a memory” ribbon/reel section: improve the visual balance and contrast. Specifically make **“a memory”** more strongly highlighted/readable, with a distinct but on-brand treatment. Preserve the moving ribbon concept, but make it accessible and avoid horizontal overflow or excessive motion on phones.
- Each tour category page should feel intentionally designed and have its own hero image, introductory copy, category-specific highlights, relevant trip cards, and animation style—within one consistent design system. Do not give every page the same generic hero.
- Make pricing informative and professional, not bargain-bin-looking. Use clear “starting from”/per-student/per-person labels only when supported by the rate sheet. Present inclusions, group/grade bands, minimum group size, taxes, transport origin, and quote caveats clearly where applicable. Do not guess a rate-to-grade mapping from poorly extracted PDF text; inspect the PDF visually page-by-page.
- Remove duplicate flyer presentation. Keep the originals accessible only if they genuinely help users; deduplicate by meaning/content and never show repeated flyer artwork as separate unique offers.
- Use real, licensed, brand-approved photos. Do not present AI/stock/Wikimedia photos as real Memories Unlimited trips. Do not hotlink images or rely on runtime web search for core website imagery. Do not add a photo from the internet until source/license/attribution and suitability have been checked. Prefer owner-provided photos, or locally optimized, licensed images with a credits manifest.
- Google reviews must look authentic and verifiable: link directly to the real Google Business Profile/reviews, use actual review excerpts and dates only if verified, and never fabricate ratings, review counts, names, stars, or testimonials. If live data cannot be verified, use a restrained “Read our Google reviews” link and clearly sourced excerpts rather than animated fake counters.
- Add trust and safety information only from verified operational facts. No invented accreditations, policies, school partners, safety guarantees, insurance coverage, response-time promises, supervision ratios, or credentials. Build a well-designed Safety & Student Care page/section using verified policies; keep unconfirmed items in a private launch checklist rather than presenting them as facts.
- Ensure all calls to action have clear labels and work. Keep phone/WhatsApp contact details centralized in `src/site.config.js`.

## Suggested professional information architecture

Use React Router only if its value justifies the dependency; otherwise implement a lightweight, robust route approach. Prefer real URL routes with direct-load support, working back/forward navigation, 404 handling, and route-level code splitting. Suggested structure (adjust based on the verified business offerings and actual content):

- `/` — Home: value proposition, selected categories, verified trust cues, featured journeys, reviews/social proof, enquiry CTA.
- `/about` — company story, approach, verified team/company facts.
- `/tours` — all tour categories and destinations.
- `/tours/camping` — camping and overnight outdoor trips (only confirmed offers).
- `/tours/one-day-trips` — one-day picnics and resorts.
- `/tours/educational` — curriculum-linked/heritage/science/industry field visits.
- `/tours/edutainment` — combinations of educational and recreation visits.
- `/tours/domestic` — multi-day Indian journeys.
- `/tours/international` — international journeys, including Singapore only with current pricing/details confirmed.
- `/tours/:slug` — individual tour detail pages generated from structured, validated data, only for confirmed offerings.
- `/safety` — student care, transport, first-aid/emergency arrangements and communication, only where confirmed.
- `/faqs` — FAQs answered from verified business policies.
- `/gallery` — approved real trip photographs, with consent and sensible image sizes.
- `/contact` or `/enquire` — concise, accessible lead form and direct contact options.

Do not publish empty pages simply to fill a sitemap. If an offer is not confirmed, mark it as “Ask us about availability” or keep it out of public-facing navigation until the owner confirms it. Keep school/group buyers in mind: teacher/coordinator needs and parent/student reassurance differ.

## Competitor/reference analysis — use as patterns, not copy

The following public websites were reviewed as structural benchmarks. Revisit the live sites before making specific claims about their current implementation; sites can change.

1. **Sprouts Edu Tours** — https://sproutsedutours.in/  
   Useful patterns: distinct journey categories (domestic, international, adventure, CAS/IAYP), clear learning-oriented positioning, a staged planning process, dedicated safety messaging, testimonials, FAQs and enquiry pathways. Their content explains the journey from planning through preparation, execution and reflection. Learn from the information architecture and completeness, not their exact copy, graphics or brand.
2. **Sprouts Domestic** — https://sproutsedutours.in/domestic/  
   Useful patterns: destination cards with regions/circuits, duration, season and ideal grades. For Memories Unlimited, display only the fields actually verified for each trip; avoid fabricated grades or best-season claims.
3. **Backpackers and Movers** — https://www.backpackersandmovers.com/ and https://www.backpackersandmovers.com/tours  
   Useful patterns: visible pickup region, trip duration, audience/category filters, group capacity and starting prices for specific outings. Borrow the clarity of the information, not the visual design. Ensure rate qualifiers and GST are unambiguous.
4. **GoGanges Educational Tours** — https://www.goganges.com/educational-tours  
   Useful patterns: separate short field/agri visits, leadership/camping experiences and multi-day tours; explain customization and educational purpose.
5. **Trailblazers India** — https://www.trailblazersindia.com/  
   Useful patterns: distinct school trips, children’s open camps, families/friends and destination discovery.
6. **Edutrip India** — https://edutripindia.co/  
   Useful patterns: a clear end-to-end journey (planning, permissions, transport, stay, meals, activities, coordination, return) and trust signals supported by evidence.
7. **EduXpedition** — https://www.eduxpedition.com/  
   Useful patterns: distinguish learning programs from general excursions and explain educational outcomes without overloading the page.

Design lesson: professional competitors help visitors answer **what trips exist, who they are for, duration, what is included, indicative price, how safety is managed, what evidence supports trust, and how to request a quote**. Memories Unlimited should answer these questions with its own verified facts and distinctive visual identity.

## Price sheet: `Memories Trips Rates 2026-27.pdf`

The supplied PDF appears to include multiple service categories and rate tables, including:
- One-day picnics / resort or theme parks, with grades listed as Pre-Primary, I–IV, V–X, XI–XII and college.
- Field trips / industrial or educational visits.
- Edutainment combinations.
- Camping itineraries with durations and different audience/rate columns.
- Multi-day domestic tours.
- A Mahabaleshwar one-day picnic offer.
- Notes indicating Pune & PCMC origin for listed one-day rates, 5% GST on total billing, minimum group size of 40 payable students for the listed one-day rates, a stated complimentary teacher/staff arrangement of 1 per 20 students, hygienic meals/drinking water, and an experienced trip leader with basic first-aid knowledge.
- Three phone numbers appear in the rate sheet: +91 75060 40841, +91 82268 22688, +91 75074 44408. The existing config currently uses only the first two; **do not silently replace or add contact details**—ask the owner to confirm which numbers are official and what role each plays.
- The existing code lists a Mahabaleshwar offer at ₹2,200 per head and Singapore at ₹69,999 per student, all-inclusive (T&C apply), but these are marked unverified in `VERIFY.md`. Confirm these against current approved pricing before publishing.

**Critical pricing instruction:** PDF text extraction loses table alignment. Open the PDF pages visually and transcribe every rate with its exact row, grade/audience column, duration, inclusion and caveat. Never infer which numeric price belongs to which grade from a flattened text dump. Build structured data and add a source/page note to each rate. Confirm whether rates are current for 2026–27, whether GST is included/excluded, what “all inclusive” means, whether rates change by pickup area/group size, and what cancellation/payment terms apply. Avoid displaying a full dense spreadsheet on the homepage; provide clean category cards and a downloadable, accessible rate guide only after verification.

## Current codebase observations to validate during audit

- `src/App.jsx` is a large single-file page/component collection (~54 KB) containing the hero, navbar, “Every trip, a memory” ribbon, reviews, tour strip, and other sections. Refactor into well-named components/modules incrementally.
- `src/photos.js` queries Wikimedia Commons from the visitor’s browser at runtime, searches multiple terms across many destinations, filters images by size, and caches results in `sessionStorage`. This can cause delayed/inconsistent images, network overhead, layout shifts, dependency on third-party API availability, and uncertain image licensing/attribution. Replace runtime image discovery with a curated local manifest of approved, optimized assets. Include explicit dimensions/aspect ratios to reduce CLS.
- `src/tours.js` contains five flyer-backed tours (Singapore, Mahabaleshwar, Hampi, Jaipur/Fatehpur Sikri/Agra, Ahmedabad), “on request” extras, a trail, and a list of 12 flyers that includes duplicate themes (Singapore and “Learn beyond classrooms” repeat). Deduplicate and distinguish confirmed offers from enquiries.
- `src/site.config.js` centralizes contact details, but the enquiry email currently points to `faisalahmadshaikh0@gmail.com` through FormSubmit while the public email is `memoriesunlimit@gmail.com`. Verify the delivery recipient and test form activation before launch. Do not expose secrets.
- `Reviews()` in `src/App.jsx` animates a rating of 4.9 and a count of 193. `REVIEWS` has three short excerpts but no visible author/date/source per excerpt. The code itself does not prove these figures are current. Verify all claims against the actual Google listing. If not verifiable, remove fake/animated numbers and use a direct reviews link.
- `Nav()` currently hides the nav based on scroll position, and CSS has repeated/overlapping navbar rules and mobile breakpoints. Consolidate the CSS and verify behavior on touch, keyboard, small phones, tablets and desktop. Avoid hiding the navbar permanently after scrolling down unless this is intentional and usability-tested.
- `useSmoothScroll()` integrates Lenis and GSAP ticker. Ensure one scroll system only, proper cleanup, no duplicated ticker callbacks, no scroll hijacking on touch devices, and correct anchor navigation on every route.
- GSAP/ScrollTrigger animations must be scoped and cleaned up with `gsap.context()` / `ctx.revert()`, work with React Strict Mode, avoid animating layout-heavy properties, refresh after route/content changes when needed, and respect reduced-motion preferences.
- `src/rb/` includes Aurora, CircularText, ClickSpark, GlareHover, ImageTrail, Magnet, ScrollReveal, ScrollVelocity and SplitText. Review actual use and mobile/performance cost. Keep effects only when they add value; do not let decorative WebGL/canvas or hover effects block core content or keyboard/touch use.
- `VERIFY.md` already marks phone numbers, email, address, prices, claims, destinations and logo as needing owner confirmation. Treat those as open launch blockers, not facts.

## Image and performance requirements

- Audit all images and fonts. Convert suitable raster photographs to WebP (or AVIF with fallback only if build pipeline and browser support are properly handled); do not blindly convert logos or graphics if transparency/quality makes PNG/SVG better. Keep SVG where appropriate.
- Do not use lossy conversion that damages logos/text in flyers. Store optimized originals and generated derivatives intentionally; remove unused duplicates only after confirming they are not referenced.
- Use responsive `<picture>`/`srcSet` or equivalent widths for hero/cards, correct `sizes`, intrinsic `width`/`height` or `aspect-ratio`, descriptive alt text, and lazy loading below the fold. Hero LCP image should be optimized and eager/high priority; never lazy-load the LCP image.
- Keep local assets local; no client-side Commons API fetch for production content. Maintain `CREDITS.md` with source/license/attribution and exact files for external assets.
- Set explicit budgets and measure rather than guess: Lighthouse/PageSpeed on mobile and desktop, Web Vitals (LCP, CLS, INP), production bundle size, image payload, and route chunk sizes. Aim for strong Core Web Vitals, but do not claim a score until measured on a production build/deployed URL.
- Route-level lazy loading via `React.lazy` + `Suspense` (or equivalent) where appropriate. Keep the homepage initial JS lean and do not eagerly import every page’s gallery, image collection, or animation library if it can be loaded on demand.
- Use responsive layout testing at minimum around 320, 360, 375, 390, 430, 768, 1024, 1280 and 1440 CSS px, including landscape and browser zoom. Check no horizontal overflow, tap targets, readable text, sticky navigation, safe areas, and reduced motion.
- Do not sacrifice accessibility for animation: semantic headings, focus-visible styles, keyboard support, labels, form error states, contrast, skip link, proper `aria-current`, reduced-motion behavior, and no auto-moving content that cannot be paused/controlled. Ribbon animation should pause/disable under reduced motion.

## Trust, safety, testimonials and privacy

- Create a dedicated trust/safety page only using owner-confirmed procedures. The PDF supports specific claims such as coach compliance with safety/RTO norms, hygienic meals and drinking water, a stated teacher/staff arrangement, and experienced trip leaders with basic first-aid knowledge for listed one-day rates; verify current scope before publishing them.
- Ask owner to confirm supervision arrangements by age/activity, emergency escalation/contact, medical/allergy handling, transport vendors and checks, hotel/rooming practices, parent/school updates, insurance, permissions, payment/refund/cancellation rules, accessibility, and safeguarding procedures.
- Do not turn a flyer claim into a universal promise if it applies only to particular packages.
- Only show reviews, review counts, partner schools, logos, student numbers and photographs when authentic, current, authorized and verifiable. Clearly label excerpts and link to source. Never manufacture testimonials.
- Enquiry form should ask only useful details (school/organization, contact person, phone/email, trip category/destination, approximate date, student count/grade, notes, preferred contact method). Validate fields, provide clear success/error/fallback states, and never claim an enquiry was sent unless the service confirms it. Ensure privacy-conscious handling and disclose the service used.
- Never include children’s identifiable images without documented permission.

## Definition of done

The work is not done until:
- [ ] `npm run build` succeeds.
- [ ] Every page route works by clicking links and by direct URL load/refresh; back/forward works; unknown routes have a 404/fallback.
- [ ] Hero destination selection works and slideshow keeps cycling after a click; no duplicate intervals.
- [ ] Reduced-motion mode disables automatic motion while preserving usability.
- [ ] Navbar, page anchors, CTA, phone, WhatsApp, directions, forms and review links are tested.
- [ ] No duplicate flyers/cards, no broken image links, no runtime Wikimedia photo search for core assets, no console errors observed in tested routes.
- [ ] Mobile layouts have no horizontal overflow at tested widths and tap targets are practical.
- [ ] All published prices/contact details/reviews/safety claims are source-verified or clearly marked as requiring a quote.
- [ ] Images are licensed, credited where required, optimized and responsive.
- [ ] The single master handoff file is updated with accurate changes/tests/open questions.
- [ ] A clean ZIP containing the updated project and this file is produced and verified.

Start by auditing the ZIP and reporting a short baseline: architecture, verified features, likely bugs, missing assets/data, performance risks, and your staged plan. Then implement the highest-impact, lowest-risk fixes first—especially the hero slideshow bug, mobile navigation/layout, and image loading—before building the full multi-page architecture.

---

# PART B — VERIFIED PROJECT INVENTORY / BASELINE NOTES


## Single-bundle contents and mandatory first action
The handoff ZIP must include the original source project plus these supplied reference files under `reference-materials/`: `Memories Trips Rates 2026-27.pdf`, `Memories Unlimited (@memoriesunlimited_official) • Instagram photos and videos.mhtml`, and `Memories_Unlimited_Website_Audit_and_Client_Questionnaire.pdf`. Inspect all three directly before making major decisions. The Instagram MHTML may contain remote references rather than downloadable original media; report exactly what is extractable and do not claim otherwise.

**Before implementing:** create `MEDIA_MANIFEST.md` and a visual contact sheet of the actual local assets. Map each existing image/flyer/logo/font to its code references and intended section; identify duplicate flyers; record origin, dimensions, optimization/format status, license/permission/credit status and whether the image depicts a real Memories Unlimited trip. Do not delete originals or substitute imagery until references are mapped. Where tools permit, extract images from the MHTML; if not, document the limitation and ask for missing original files. The handoff ZIP should include the manifest/contact sheet when produced.

## Project inventory seen in supplied ZIP

- Root project folder: `gsap wala memories/`
- `package.json`: React 19, Vite 5, GSAP 3, `@gsap/react`, Lenis, Motion.
- Main app: `src/App.jsx` (~54 KB); stylesheet: `src/App.css`; entry: `src/main.jsx`.
- Data/config: `src/site.config.js`, `src/tours.js`, `src/photos.js`.
- Local flyer/brand assets under `public/flyers/` and `public/brand/`.
- Animation components under `src/rb/`; license at `src/rb/LICENSE-react-bits.md`.
- Project notes: `CLAUDE.md`, `README.md`, `VERIFY.md`, `CREDITS.md`.
- Archive also includes `Memories Trips Rates 2026-27.pdf`, Instagram MHTML export, and a prior audit/questionnaire PDF. Re-open and inspect these in the working environment; do not assume their extracted text is perfectly aligned or current.

## Explicit defect confirmed from code

The hero slideshow stops after destination-button click because `picked.current` is set to `true` in each destination button's click handler and the interval callback advances only when `!picked.current`. This is a code-level root cause, not just a visual suspicion.

## Current listed tour data (not all owner-confirmed)

- Singapore — 4 nights / 5 days; current data lists ₹69,999 per student all-inclusive, T&C apply; VERIFY.md flags current price/T&Cs as unverified.
- Mahabaleshwar — 1-day picnic from Pune; current data lists ₹2,200/head; VERIFY.md flags current rate/inclusions as unverified. The 2026–27 PDF also contains Mahabaleshwar + Go Kart + Mapro pricing; reconcile these sources before publication.
- Hampi — educational tour; places listed, price absent.
- Jaipur, Fatehpur Sikri and Agra — educational tour; price absent.
- Ahmedabad — educational tour; price absent.
- `EXTRA` currently lists Goa, Manali, Kerala and Imagicaa as on request. `CLAUDE.md`/README mention Wet'n'Joy and Parle Factory too; reconcile differences against the PDF and owner confirmation.
- Flyers list contains 12 entries, including duplicate Singapore and repeated “Learn beyond classrooms” artwork. Deduplicate in the user-facing experience.

## Contact / identity details needing owner confirmation

`src/site.config.js` currently lists:
- Phone: 7506040841
- WhatsApp: 8226822688
- Public email: memoriesunlimit@gmail.com
- Enquiry recipient used by FormSubmit: faisalahmadshaikh0@gmail.com
- Kondhwa, Pune address and Google Maps listing URL.

The 2026–27 PDF also displays +91 75074 44408. `VERIFY.md` already flags phone/email/address verification. Ask the owner which numbers and email addresses are official, which should be public, and which receives website enquiries. Never invent replacements.

## Pricing PDF: safe extracted notes

The seven-page `Memories Trips Rates 2026-27.pdf` includes separate one-day picnic, field-trip, edutainment, camping and multi-day tour material. One-day rate notes extracted from the document state:
- Rates apply to Pune & PCMC region including transportation.
- GST 5% applies to total billing.
- Minimum group size: 40 payable students for the listed rates.
- One teacher/staff member complimentary per 20 students (confirm exact terms and applicability).
- Hygienic meals and drinking water throughout the trip.
- Experienced trip leader on every coach with basic first-aid knowledge.
- A separate line mentions transportation by luxury non-AC coach with safety/RTO norms followed.
Because text extraction flattens multi-column tables, the exact price-to-grade mapping is **not** safely reconstructable from extracted text alone. Visually inspect every PDF page and transcribe the tables before publishing prices.

---

# PART C — LIVING HANDOFF / STATUS (CLAUDE MUST UPDATE THIS)

**Current phase:** Session 4 done. Every route page was redesigned so each has its own hero and layout (Sprouts-style). Still no real `npm run build`.
**Last updated:** 24 Oct 2026, session 4 (Claude chat; session 3 details below still apply). The npm registry was unreachable again (ENOTFOUND), so `npm install` and `npm run build` still could not run. Nothing was opened in a browser.

## Status at a glance
| Item | State |
|---|---|
| Hero slideshow keeps cycling after a click | Code fixed in session 2, NOT run in a browser |
| Nav (hide on scroll down, show on scroll up, phone links) | Code fixed in session 2, NOT run in a browser |
| "a memory" ribbon highlight | Code fixed in session 2, NOT viewed |
| `npm run build` | NOT run (registry unreachable in sessions 1, 2 and 3) |
| Syntax check of App.jsx, tours.js, rates.js, site.config.js, photos.js (TypeScript transpiler) | 0 errors. CSS braces balanced 557/557. This is NOT a build. |
| Rate sheet transcribed to `src/rates.js` | DONE, all 106 rows, each with sourcePage. Not yet used by any page. Not owner-verified. |
| MEDIA_MANIFEST.md + flyer contact sheet | DONE (`reference-materials/contact-sheet-flyers.png`) |
| Duplicate flyers in the UI | FIXED: 12 down to 8 distinct offers in `FLYERS` (tours.js). No files deleted. |
| Google review numbers (animated 4.9 and 193) | REMOVED. Section now shows three excerpts and a link to the Google listing. Not run in a browser. |
| Singapore and Mahabaleshwar prices | Blanked in `tours.js` (they conflict with the rate sheet). The flyer artwork itself still prints Rs 69,999 (flyer-11, not shown) and Rs 2200 (flyer-08, still shown). |
| Wikimedia runtime image search (`src/photos.js`) | Now LOCAL-FIRST: `src/localPhotos.js` (empty) wins over Wikimedia. To go fully local, run `python scripts/fetch_photos.py` on a computer WITH internet (the Claude sandbox has none, so the script was only tested on fake data). Until then the site still fetches from Wikimedia. |
| Routes: `/`, `/tours`, `/tours/{one-day-trips,educational,edutainment,camping,domestic,international}`, 404 | REDESIGNED in session 4: shared `src/pages/ui.jsx`, themes in `src/pages/pages.css`. Rendered to static HTML with react-dom/server and screenshotted in Chromium at 1280 and 390 px: no horizontal overflow on any page. Not run through Vite, no click testing. Prices hidden behind `RATE_META.verifiedByOwner`. |
| `/about`, `/safety`, `/faqs`, `/contact`, `/credits` | REDESIGNED in session 4, each with its own hero/theme/layout: About (stats band + numbered rows), Safety (shield hero + panels from the sheet's notes + checklist), FAQs (centred hero + sticky topic menu + grouped questions), Contact (contact cards), Credits. Same render check as above. OWNER MUST APPROVE wording (esp. /safety). |
| `/gallery` page | Not built: no real trip photos exist. |

## Rate sheet findings (session 3, read page by page and checked against rendered pages)
- 106 rows: 31 one-day picnics (pages 1-2), 19 field trips (p3), 10 edutainment (p4), 11 camping (p5), 35 multi-day tours (pp 6-7). Counts match session 1.
- Grade bands differ per table: one-day = Pre-Primary, I-IV, V-X, XI-XII, Sr. College; field trips and edutainment = I-IV, V-X, College; camping = I-X, College; multi-day tours = V-X, College on page 6 but I-X, College on page 7 (stored as printed; ask owner whether that is a typo).
- The sheet never says "per student". Notes say "payable students", so per-student is likely but `RATE_META.unitConfirmed` is false.
- Notes printed only under the one-day table (page 2) and the multi-day table (page 7). Field trips, edutainment and camping print NO inclusions, origin or minimum group. Do not copy the one-day notes onto them.
- One-day notes say: luxury NON-AC coach, entry with activities plus breakfast, lunch and evening snack, Pune and PCMC region, GST 5% on total billing, minimum 40 payable students, 1 free teacher per 20 students, trip leader with basic first-aid knowledge.
- Conflicts: Singapore sheet Rs 1,20,000 vs flyer Rs 69,999. Mahabaleshwar + Go Kart + Mapro sheet 1500 / 1600 / 1700 / 1700 (non-AC, plus GST) vs flyer Rs 2200 per head (AC coach, boating). Possibly different packages.
- Rows with source problems (flagged `review` in rates.js): camping rows 1, 2, 8 have names cut off on the sheet; camping row 5 has a blank duration. Two multi-day rows show "Customized" instead of a price (Amritsar-Dalhousie-Dharamshala, Nepal). Spelling fixed for display with the original kept in `sourceName`: "Fathepur Sikhri", "Schenzen".
- Extraction script: `scripts/extract_rates.py` (needs pdfplumber and the PDF in the working folder; column x-boundaries are hard-coded for this layout).

## Session 1 findings (its files were lost with the sandbox; findings kept here)
- npm registry blocked in that sandbox; GitHub worked (GSAP, Lenis, Motion, @gsap/react cloned and bundled with esbuild to verify). The ORIGINAL site built and loaded with no console errors.
- Duplicate flyer files (byte-identical, md5): ahmedabad = flyer-12, educational = flyer-03, flyer-02 = learn-beyond, flyer-08 = mahabaleshwar, flyer-09 = jaipur, flyer-10 = hampi, flyer-11 = singapore. Session 3 confirmed this and added the duplicates-by-meaning above.
- Instagram MHTML: only 13 small thumbnails (12 posts + profile photo, about 640px). Bio: "Tours | Trips | Holidays | School Trips | Flights | Hotels | Visa assistance | packages". Not usable as site photos without the owner's permission. Do not quote follower or post counts.
- Google Fonts and Wikimedia were blocked in that sandbox. For self-hosting, google/fonts on GitHub has `ofl/bricolagegrotesque` and `ofl/caveat`; woff2 conversion needs fontTools plus brotli.
- Idea (not built): original vector illustrations per destination as a placeholder until approved real photos arrive. Never present illustrations as photos of real trips.

## Change log
- 2026-10-24, session 5: route-page header fits one row on phones; added meta description and Open Graph tags to `index.html`; added `public/_redirects` (Netlify) and `vercel.json` so direct URLs like `/tours/camping` work on static hosts. Found 53px sideways overflow at 320 px from the header; fixed by hiding the Safety link under 360px (it stays in the footer). Static renders at 320 and 390 px now show no horizontal overflow. Nothing else changed.
- 2026-10-24, session 4: the redesigned pages written in a lost chat were rebuilt from scratch. New `src/pages/ui.jsx` (PageShell header/footer, Hero with split/full/center layouts, Section, Steps, Pillars, CtaBand, line-art illustrations, `useDestPhotos`). `src/pages/TourPages.jsx` rewritten (index with 6 coloured kind cards; each category has its own theme, hero layout, 'what to expect' cards, grade filter, trip cards with WhatsApp ask; international/domestic use a photo hero when photos load). `src/pages/InfoPages.jsx` rewritten (see table). `src/pages/pages.css` replaced. `src/photos.js`: added `loadDestination(id)`. Hero photos come from the existing Wikimedia/local photo system, so offline they fall back to illustrations. There is NO `/gallery` page (no real trip photos exist), so the header does not link to it. Test: all 13 pages rendered with react-dom/server via tsx and screenshotted with Playwright (no errors, no overflow at 390 px). A bug found that way and fixed: full-width heroes with no photo were a muddy dark overlay; the dark overlay now only appears when a photo is present.
- 2026-10-24, session 1: audit only; no code kept (sandbox lost).
- 2026-10-24, session 2: hero timer fix (single setTimeout keyed on `si`), `Nav()` hide on scroll down / show on scroll up, `<mark>` on "a memory", CSS nav blocks merged, safe-area padding.
- 2026-10-24, session 3:
  - Line endings: `src/App.jsx`, `src/App.css`, `src/tours.js`, `src/photos.js` converted from CRLF to LF (whole-file diff in git; content otherwise unchanged by this step).
  - `src/tours.js`: `FLYERS` reduced to 8 distinct offers (flyer-01, 05, 03, 04, 08, 09, 10, 12). Singapore uses flyer-01 (no price). Singapore and Mahabaleshwar `price` set to '' so the UI says "Price on request". Comment explains why.
  - `src/App.jsx`: `Reviews()` rewritten: removed `countTo`, the count-up animation, the big "4.9", the "193 Google reviews" heading and the star score. Added a "Read our reviews on Google" link to `CONFIG.mapsUrl`. The Mahabaleshwar one-day card text no longer prints a price ("Ask us for the current rate").
  - `src/App.css`: appended `.sr-only`. The old `.rv-big`, `.rv-score`, `.rv-num`, `.rv-stars` rules are now unused and can be deleted.
  - New: `src/rates.js`, `scripts/extract_rates.py`, `MEDIA_MANIFEST.md`, `reference-materials/contact-sheet-flyers.png`.
- 2026-10-24, session 3 (continued): routing. New `src/main.jsx` (path-based, `React.lazy`, 404 fallback, no router dependency; links are plain `<a href>` so direct load, refresh and back/forward are native). New `src/pages/categories.js` (splits the 106 rate rows into 6 category pages; international = sheet rows 23, 28, 30-35 of the multi-day table, domestic = the other 27), `src/pages/TourPages.jsx` (index, category table, 404, shared header/footer), `src/pages/pages.css`. `App.jsx` nav got an "All trips" link (`/tours`, hidden under 700px with the other `opt` links). README has a Routes section. Category pages show trip names, location, duration and the grade bands the sheet covers; rupee rates and sheet notes appear only when `RATE_META.verifiedByOwner === true`.
- 2026-10-24, session 3 (code review pass, still no browser): read Hero, Reel and Enquire. Hero timer logic reviewed and looks correct. Added `hold` state: auto-advance now pauses while the destination buttons are hovered or focused (WCAG 2.2.2). Enquire only says "sent" after FormSubmit confirms success (kept). Added a privacy line naming FormSubmit under the form. Still to verify in a browser: that `hold` does not leave the hero stuck on touch devices (mouseenter can fire on tap and mouseleave may not follow; if so, drop the mouse handlers and keep focus/blur only).
- 2026-10-24, session 3 (photos and info pages): footer still said "4.9 on Google from 193 reviews"; replaced with a "Read our Google reviews" link. `src/photos.js` now merges `LOCAL` from `src/localPhotos.js` first and skips Wikimedia for those destinations. New `scripts/fetch_photos.py` (downloads, filters by licence, saves WebP, writes localPhotos.js and photoCredits.js; `--pd-only` for no-credit photos). New `src/pages/InfoPages.jsx` (About, Safety, FAQs, Contact, Credits), routes in `src/main.jsx`, route-page header now links Home/Tours/Safety/FAQs/Contact, footers link Safety/FAQs/Contact/Photo credits. The owner asked for NO photo credits; this is not safe for CC BY / CC BY-SA photos, so credits are on one /credits page only. Script filter logic tested with fake data; the download itself was never run.
- Tests run in session 3: TypeScript-transpiler syntax check on the changed source files (including main.jsx and the pages) (0 errors), CSS brace count, a Node import of `rates.js` (106 rows; per-category counts 31/19/10/11/35; spot rows compared with the rendered PDF pages), a check that all 8 `FLYERS` files exist. Nothing else was run.

## Known bugs / risks
- Session 4 pages were checked as static renders only. Not tested: Vite build, `React.lazy` routing in a browser, the grade filter buttons, the header `aria-current` (it showed Home on every page in the static render because there is no URL), loading of Wikimedia hero photos.
- Route-page header on phones now fits one row (About and FAQs hidden under 700px; both stay in the footer). Checked in static render only.
- Unused CSS still in `src/App.css`: `.rv-big`, `.rv-score`, `.rv-num`, `.rv-stars` (no longer used in App.jsx). Safe to delete.
- Nothing has been viewed in a browser in ANY session since the original site. First thing next session with network: `npm install && npm run build`, then check the hero, nav at 320 to 1440 px, the ribbon, and the new Reviews section.
- The Reviews section still carries old unused CSS and the section height was designed around the big "4.9" background number, so spacing may look off.
- Mahabaleshwar flyer artwork (flyer-08) still prints Rs 2200 and appears in the flyer strip and the tour modal. Only the owner can replace the artwork.
- Older rules for `.nav .logo` (about lines 923 and 1616) remain; check the wide logo does not sit on a round gold background. `.reel` background is overridden to sky blue further down; check contrast.
- Everything in `VERIFY.md` is still unverified.

## Current blockers / owner questions
1. Confirm all public phone numbers (sheet and flyer also show +91 75074 44408), WhatsApp, public email, enquiry recipient (currently a different Gmail from the public email), address, social URLs.
2. Rates: are the 2026-27 sheet rates current and are they per student? Is GST 5% extra on every table? What are the inclusions, pickup area and minimum group for field trips, edutainment and camping? Singapore Rs 1,20,000 or Rs 69,999? Mahabaleshwar sheet row vs the Rs 2200 flyer? Is page 6 "V-X" or "I-X"? Complete the cut-off camping names and the blank duration. What are the "Customized" tours priced at (or keep as "ask us")? Cancellation and payment terms.
3. Which tours are actively sold (Goa, Manali, Kerala, Imagicaa, Wet'n'Joy, Parle Factory)? The sheet lists Imagicaa, Wet N Joy, Parle Factory, Goa and Kerala, so most are likely offered; confirm.
4. Safety procedures, supervision, emergency contact, insurance (publish only what is confirmed).
5. Real trip photos with consent, original logo, and whether school logos can be shown.
6. Google Business Profile link and permission to use real review excerpts with author and date; the earlier 4.9 rating and 193 count are unverified and removed.
7. Live test of the FormSubmit enquiry form after activation.

## Next tasks: execute in this order
0. (Session 5 note) Everything that can be done without internet or owner answers is done. What is left needs: (a) a computer with network for `npm install && npm run build`, `python scripts/fetch_photos.py`, and self-hosting fonts; (b) owner answers in the blockers list; (c) real consented trip photos for a `/gallery` page.
1. With network: `npm install && npm run build`; open the site and confirm the session 2 fixes, the session 3 Reviews and flyer changes, and EVERY new route (direct load of `/tours`, `/tours/camping`, a bad URL; back/forward; 320 to 1440 px; table scroll on phones). The routing code has never been run. Check that `/#enquire` from the route pages lands on the form.
2. Build Safety, FAQ, About, Gallery and Contact pages only from owner-confirmed content (questions 4 and 5). Give each category its own hero image once real photos exist. Set `RATE_META.verifiedByOwner = true` only after the owner answers question 2.
3. Run `scripts/fetch_photos.py` (or add the owner's own photos to `src/localPhotos.js`), check the photos in a browser, then self-host fonts. Build `/gallery` only from real consented trip photos.
4. Responsive, reduced-motion and accessibility QA; performance numbers on a production build.
5. Update this section, then make a clean ZIP (no node_modules, .git, dist).

## Required handoff update template
- **Date/session:**
- **Files changed:**
- **What changed and why:**
- **Build/test commands run and exact results:**
- **Routes/devices/browsers tested:**
- **Known bugs/regressions:**
- **Unverified facts / owner answers still needed:**
- **Next three actions:**
- **ZIP filename and verification:**

**Handoff rule:** Update this file BEFORE starting each new batch of work and again after it, not only at the end, so a sudden limit never loses progress. Then create and verify a clean ZIP. The next Claude session must read this file and `CLAUDE.md` first and continue from "Next tasks".
