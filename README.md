<p align="center">
  <img src="public/brand/logo-white.webp" alt="Memories Unlimited Tours & Travels" width="380" />
</p>

<h1 align="center">Memories Unlimited Tours &amp; Travels</h1>

<p align="center"><b>Learning beyond the classroom.</b><br/>Website for a Pune-based travel company that organises school picnics, educational tours and industrial visits.</p>

---

## About

This is the marketing website for Memories Unlimited Tours & Travels. It shows the tours the company runs, a photo gallery, the original flyers, and an enquiry form that opens WhatsApp or email with a ready-written message.

**Tours featured** (details taken from the company's own flyers):

- Singapore, 4 nights / 5 days
- Mahabaleshwar, 1-day picnic from Pune
- Hampi, educational tour
- Jaipur, Fatehpur Sikri and Agra
- Ahmedabad

Also available on request: Goa, Manali, Kerala, Wet'n'Joy and a Parle factory visit.

## Tech stack

| Part | Tool |
| --- | --- |
| Framework | React 19 |
| Build tool | Vite |
| Animation | GSAP (`@gsap/react`) and Motion |
| Smooth scrolling | Lenis |
| Animated components | [React Bits](https://reactbits.dev) (copied into `src/rb/`) |

## Getting started

You need [Node.js](https://nodejs.org) installed (version 18 or newer).

```bash
# 1. Clone the repo
git clone https://github.com/faisalahmad7/memories-unlimited-site.git
cd memories-unlimited-site

# 2. Install dependencies
npm install

# 3. Start the local preview
npm run dev
```

Open the address that Vite prints in the terminal (usually `http://localhost:5173`).

To make a production build:

```bash
npm run build     # output goes to the dist/ folder
npm run preview   # optional: preview the built site locally
```

## Project structure

```
memories-unlimited-site/
├── index.html
├── public/
│   ├── brand/          # logo files
│   └── flyers/         # tour flyers and gallery images
└── src/
    ├── App.jsx         # page sections and layout
    ├── App.css         # styles
    ├── main.jsx        # React entry point
    ├── site.config.js  # contact details (edit here)
    ├── tours.js        # tour data (edit here)
    ├── photos.js       # gallery images
    └── rb/             # React Bits animation components
```

## Editing the content

- **Contact details** (phone numbers, WhatsApp, email, address): edit `src/site.config.js`. This is the only place they should live. The address is still a placeholder and needs to be filled in before launch.
- **Tours and prices**: edit `src/tours.js`. Only use details printed on the real flyers.
- **Logo**: replace the files in `public/brand/`.

## Deploying

The site is a static Vite build, so it works on any static host. On Vercel or Netlify, import this repository and use:

- **Build command:** `npm run build`
- **Output directory:** `dist`

## Notes

- The enquiry form does not send or store anything itself. It opens WhatsApp or the email app with a written message, and the visitor sends it from there.
- Animations respect the `prefers-reduced-motion` setting.
- Confirm all prices and contact details against the current flyers before publishing.

## Licence and credits

The animation components in `src/rb/` come from React Bits, which is MIT with the Commons Clause. They may be used inside this website, but not sold or redistributed as components on their own. See [`src/rb/LICENSE-react-bits.md`](src/rb/LICENSE-react-bits.md) and [`CREDITS.md`](CREDITS.md).

The Memories Unlimited name, logo and flyer images belong to Memories Unlimited Tours & Travels.


## Routes (session 3)
Real URL paths, resolved in `src/main.jsx`: `/` (home), `/tours`, `/tours/{one-day-trips,educational,edutainment,camping,domestic,international}`, anything else shows a 404 page. Pages are code-split. On a static host, add a rewrite so every path serves `index.html` (Netlify: `/* /index.html 200`; Vercel: a rewrite to `/index.html`). Prices on these pages are hidden until `RATE_META.verifiedByOwner` is set to `true` in `src/rates.js`.

## Photos (session 3)
Run once on a computer with internet: `pip install pillow` then `python scripts/fetch_photos.py` (add `--pd-only` for photos that need no credit). It downloads up to 8 photos per destination, compresses them to WebP (max 1600 px, quality 78) into `public/photos/`, rewrites `src/localPhotos.js` and `src/photoCredits.js`, and the site then serves them locally. Your own photos can be added by hand to `src/localPhotos.js`.

## Pages
`/about`, `/safety`, `/faqs`, `/contact`, `/credits` plus the `/tours` pages. Their wording comes only from the 2026-27 rate sheet and `site.config.js`; the owner must approve it before launch.
