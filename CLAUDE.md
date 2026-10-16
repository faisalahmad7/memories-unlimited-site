# CLAUDE.md: Memories Unlimited Tours & Travels (Pune)

School picnics, educational tours, industrial visits. Headline: "LEARNING BEYOND THE CLASSROOM".
Real tours (from the owner's flyers): Singapore 4N/5D, Mahabaleshwar 1-day picnic, Hampi, Jaipur/Fatehpur Sikri/Agra, Ahmedabad.
On request, no flyer yet: Goa, Manali, Kerala, Imagicaa, Wet'nJoy, Parle Factory visit.

## Rules
- Never invent prices, itineraries, testimonials, ratings, school logos, accreditations or safety guarantees. Prices only as on the flyers.
- Never invent a phone number or email. All contact details live in src/site.config.js only.
- The form does not send anything itself. It opens WhatsApp or email with a written message. Never claim an enquiry is sent or stored unless a real backend exists.
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
