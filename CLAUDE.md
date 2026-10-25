# CLAUDE.md: Memories Unlimited Tours & Travels (Pune)

School picnics, educational tours, industrial visits. Headline: "LEARNING BEYOND THE CLASSROOM".
Real tours (from the owner's flyers): Singapore 4N/5D, Mahabaleshwar 1-day picnic, Hampi, Jaipur/Fatehpur Sikri/Agra, Ahmedabad.
On request, no flyer yet: Goa, Manali, Kerala, Imagicaa, Wet'nJoy, Parle Factory visit.

## Rules
- Never invent prices, itineraries, testimonials, ratings, school logos, accreditations or safety guarantees. Prices only as on the flyers.
- Never invent a phone number or email. All contact details live in src/site.config.js only.
- The form's "Send enquiry" button emails CONFIG.enquiryEmail through the free FormSubmit service (https://formsubmit.co/ajax/...). Only say "sent" when the service confirms success. WhatsApp, email-app and copy buttons remain as fallbacks. Nothing is stored.
- Free and open-source tools only. Do not migrate frameworks. One smooth-scroll system: Lenis driven by the GSAP ticker.
- Respect prefers-reduced-motion. Preserve working features. Never say something is tested unless it was run.
- AI-generated pictures must never be shown as real photos of a school's trip.
- src/rb is React Bits (MIT + Commons Clause): use inside this site only; keep its LICENSE file.

## Commands
- npm install
- npm run dev   (local preview)
- npm run build (output in dist/)

## Design skills in use (installed under ~/.claude/skills)
- design-taste-frontend (Taste Skill v2): no eyebrows, no emoji, no thin rules, no resting shadows, no glass nav, headlines two lines or fewer, statements 36px or less, at least four real pictures, one live thing, staggered entrances.
- awwwards-animations: GSAP + Lenis integrated, cleanup on unmount, reduced motion, only transform and opacity.
- frontend-design: one memorable moment, copy that says what a button does.
Known choices that the owner asked for and that bend these rules: Aurora glow, glare/tilt hovers, click sparks.

## Bright pass (Oct 2026)
- Palette: royal blue, sunshine yellow, sky, grass green, coral on warm white. Light only.
- Doodles (PATHS + Doodles in App.jsx) are drawn, floated and parallaxed by GSAP. Nav hides on scroll down, shows on scroll up. SideNav = section dots. Gallery shows one photo per place (no loadExtra).

## Pass 2 (Oct 2026)
- Phones/WhatsApp/directions helpers live in site.config.js (fmtPhone, telHref, waLink, DIRECTIONS_URL). Floating WhatsApp button = WhatsAppFab.
- Tours strip auto-drifts for mouse users only; touch screens use native swipe with scroll-snap.
- Phone hero is deliberately sparse (doodles, side dots and detail line hidden at 700px and below).

## Pass 3 (Oct 2026): nav menus, hero photos, reviews
- src/NavMenu.jsx + src/nav-menu.css: Trips / Gallery / Flyers dropdowns, used by the home nav (App.jsx) and the route-page header (pages/ui.jsx). Trip counts come from CATEGORIES (rates.js), never hard-coded. Panels hang from the bar (.nm is not positioned) so they cannot run off-screen; mobile shows only Trips (Gallery and Flyers links sit inside it).
- Hero photos: HEROES in src/photos.js are hero-only Wikimedia Commons searches (not gallery tabs). Pages: Educational, Edutainment, Camping, About, Contact. If a search returns nothing sharp the line illustration stays. Hero shows "Photo pages" links to each Commons file page for credit. Safety and FAQs keep illustrations on purpose (no suitable neutral photo).
- Reviews: bento layout. Still only the owner's three Google excerpts: NO star rating, count, names or dates (rules above). Topic tags and the "How we look after a group" card restate lines already on /safety and /faqs.
- Verified in headless Chromium with the Wikimedia call mocked; real photo selection has NOT been checked live.

## Pass 4 (Oct 2026): nav, trust, flip cards, photo heroes
- Nav (src/NavMenu.jsx + nav-menu.css): dropdown is centred UNDER its own button (measured in a layout effect). Trips, Gallery and Flyers are links with a small arrow for the menu; Trips goes to /tours. No trip counts in the nav. All pages are in the bar (Home, Trips, Gallery, Flyers, Safety, FAQs, About, Contact, Enquire); below 1000px the four pages fold into "More".
- Trust facts live ONLY in src/trust.js (founded 2013, thousands of students and parents, own coaches, good hotels, Pune + Mumbai). src/TrustRibbon.jsx shows them under the hero on home, Trips, About and Safety. The 4.9 rating is OFF (SHOW_RATING=false) until the owner checks the live Justdial/Google listing.
- Visitor-facing text no longer says "rate sheet" / "our sheet", except the FAQ "Can I see your rate card?". Keep it that way.
- Heroes (pages/ui.jsx Hero): full-bleed photo + shade + tilted side photos; gradient and line art if no photo. Safety and FAQs headlines are the single words "Safety" and "FAQs" with an elegant tagline below.
- Photos: new HEROES ids h-mumbai, h-safety, h-bus, h-hotel, h-kids (Wikimedia searches, src/photos.js). The owner's OWN photos go in public/heroes/ and src/heroImages.js and always win. Best fix for the Safety page: a real photo of a student in a harness.
- Trip kind cards (TourPages.jsx KindGrid): front = icon + Fraunces title + small "N trips" pill; back = photo. Hover/focus flips; on touch the first tap flips, the second opens the page.
- Not verified in a browser or by `npm run build` in this session (no network): only esbuild syntax checks were run.

## Session 8 redesign (Oct 2026)
- No photo-credit lines anywhere (hero credit, PhotoNote, footer link removed). Demo photos stay until the owner adds their own in src/heroImages.js (page ids: page-safety, page-faqs, page-about, page-contact, page-tours). Pages with no photo show an illustration.
- Nav (src/NavMenu.jsx): ONE shared open state, so only one dropdown can be open. Trips panel is a half-circle glowing wheel (src/groups.js defines the four paths).
- /tours is a four-tile cross hub (TripHub in pages/TourPages.jsx, GSAP). The six category pages are sub-pages of the four paths.
- Home hero is `Hero` in App.jsx (classes hx-*): circular GSAP photo reveal, word-by-word headline, one destination ticket. Trust ribbon counts up (TrustRibbon.jsx, trust.js).
- NOT run in a browser or with `vite build` (no network in that session): run `npm install && npm run build` and look at it before deploying.

## Session 9 fixes (Oct 2026)
- Nav jump bug: a closing panel used to reset to left:0 while fading. Fixed in NavMenu.jsx (position kept on close); non-open panels hide instantly (nav-menu.css).
- Wheel: violet/indigo background, 4.4rem glowing icons that bob. Trust ribbon: five solid-colour tiles (colours live in trust.js as bg/ink).
- Trips hub: four equal cards that float and fill with colour on hover; clicking opens a full-screen "stage" (class stg-*) with the sub-page cards and "Click to view" buttons. Esc / "All paths" closes; URL hash (#day) opens it directly.
- Safety, FAQs, Contact, About heroes use the drawn `Scene` (pages/ui.jsx, `motif` prop) when no photo is set. A photo in src/heroImages.js replaces it.
- Still NOT run in a browser or `vite build`. Check on a phone and a laptop before deploying.

## Session 10 fixes (Oct 2026)
- Gallery links from other pages: App.jsx scrolls to the URL hash once `ready`; gallery menu items link to `/?g=<destination>#gallery` and switch the tab (event `mu-gallery`).
- The hub stage and trip detail card render through `createPortal` into document.body (they were trapped under the trust ribbon by a parent stacking context).
- Hub cards: wrapper `.hub-cell` takes the GSAP entrance; the button takes the CSS hover (GSAP's inline transform used to override it). Fixed 14.5rem row height so all four are identical.
- Trip lists: slim rows (`TripList`) open a detail card (`TripDetail`) with Wikimedia pictures when the place name matches (loadPlace in photos.js), a Google Maps embed (address, reviews, photos come from Google) and links. Google's own pictures cannot be copied onto the site (licence + needs a paid API key); put real photos in the detail card later if the owner has them.
- Wikimedia pictures may legally need a credit line; the /credits page still exists if you decide to link it again.
- Not run in a browser or `vite build`.

## Session 11 (Oct 2026): phone menu, desktop nav, story, flyers
- Phones (700px and below): NO dropdowns. NavMenu.jsx `MobileMenu` = hamburger + slide-in menu (rows jump to sections on Home; site pages on route pages). Desktop keeps the dropdowns, now bigger/bolder pills (nav-menu.css, "Pass 11").
- Flyers menu items open that exact flyer (event `mu-flyer`, or `/?f=<index>#flyers` from other pages).
- Trips hub on phones = four glowing circles on a ring (symbol + label only, pages.css "Pass 11"). Trust ribbon is hidden on phones on the Trips pages (`<TrustRibbon hideOnPhone />`).
- Story: OWNER and EXPERIENCE live in trust.js (Jerwan Battiwala, 18+ years); shown on Home (founder strip) and About.
- Phone speed: no endless doodle floating, hero loads current + next photo only, 10 trail images, no nav blur.
- Tested in headless Chromium with GSAP/Lenis/motion STUBBED (no npm registry access): layout, menu, flyer clicks and button gaps were checked; animations were not. Run `npm install && npm run build` and look before deploying.
