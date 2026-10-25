# MEDIA_MANIFEST.md

Audited in session 3 (24 Oct 2026). Contact sheet of the 12 distinct flyer images: `reference-materials/contact-sheet-flyers.png`.

**Nothing was deleted.** Duplicate files remain on disk until the owner confirms. None of these images is a photograph of a real Memories Unlimited trip: they are marketing flyers (artwork looks AI-generated or stock; ownership unknown, see VERIFY.md) and logos cut from flyers (low resolution).

| File | Size (px) | KB | md5 (8) | Identical to | Referenced by |
|---|---|---|---|---|---|
| brand/logo-cream.webp | 960x608 | 117 | cf888f7a | brand/logo-white.webp | not referenced (byte-identical to logo-white.webp) |
| brand/logo-icon.png | 256x256 | 52 | 35b87fa8 | - | index.html favicon / apple-touch-icon |
| brand/logo-nav.webp | 640x405 | 73 | ccbe8041 | - | Nav() in App.jsx |
| brand/logo-white.webp | 960x608 | 117 | cf888f7a | brand/logo-cream.webp | Splash and Footer in App.jsx |
| flyers/ahmedabad.webp | 1024x1536 | 209 | 0258a6fc | flyers/flyer-12.webp | TOURS ahmedabad.img |
| flyers/educational.webp | 1024x1536 | 202 | 512b785d | flyers/flyer-03.webp | tours.js TRAIL only (not imported) |
| flyers/flyer-01.webp | 1024x1536 | 241 | 293262a4 | - | FLYERS[0] and TOURS singapore.img (Singapore, no price printed) |
| flyers/flyer-02.webp | 1024x1024 | 128 | e1c57983 | flyers/learn-beyond.webp | unused; same message as flyer-05 |
| flyers/flyer-03.webp | 1024x1536 | 202 | 512b785d | flyers/educational.webp | FLYERS[2] (Educational tours) |
| flyers/flyer-04.webp | 1024x1450 | 215 | 6c7ef2d5 | - | FLYERS[3] (Visa services) |
| flyers/flyer-05.webp | 1024x1450 | 242 | cb240303 | - | FLYERS[1] (Learn beyond classrooms) |
| flyers/flyer-06.webp | 864x1536 | 209 | 116b6c84 | - | unused; same message as flyer-05 |
| flyers/flyer-07.webp | 864x1536 | 150 | ab07f1a5 | - | unused; same message as flyer-05 |
| flyers/flyer-08.webp | 1024x1536 | 245 | f2319118 | flyers/mahabaleshwar.webp | FLYERS[4] (Mahabaleshwar) |
| flyers/flyer-09.webp | 1024x1536 | 207 | 86610a0e | flyers/jaipur.webp | FLYERS[5] (Jaipur/Fatehpur Sikri/Agra) |
| flyers/flyer-10.webp | 1024x1536 | 220 | 45d3ea4d | flyers/hampi.webp | FLYERS[6] (Hampi) |
| flyers/flyer-11.webp | 1024x1536 | 228 | 089c5ee7 | flyers/singapore.webp | unused; Singapore flyer that prints Rs 69,999 |
| flyers/flyer-12.webp | 1024x1536 | 209 | 0258a6fc | flyers/ahmedabad.webp | FLYERS[7] (Ahmedabad) |
| flyers/hampi.webp | 1024x1536 | 220 | 45d3ea4d | flyers/flyer-10.webp | TOURS hampi.img |
| flyers/jaipur.webp | 1024x1536 | 207 | 86610a0e | flyers/flyer-09.webp | TOURS jaipur.img |
| flyers/learn-beyond.webp | 1024x1024 | 128 | e1c57983 | flyers/flyer-02.webp | tours.js TRAIL only (not imported) |
| flyers/mahabaleshwar.webp | 1024x1536 | 245 | f2319118 | flyers/flyer-08.webp | TOURS mahabaleshwar.img |
| flyers/singapore.webp | 1024x1536 | 228 | 089c5ee7 | flyers/flyer-11.webp | tours.js TRAIL only (TRAIL is not imported by App.jsx); prints Rs 69,999 |

## Duplicates by meaning (what visitors used to see repeated)

- Singapore: flyer-01 (no price) and flyer-11 (prints Rs 69,999). The site now shows flyer-01 only. Rate sheet says Rs 1,20,000: owner must confirm.
- Learn beyond classrooms: flyer-02 (square), 05, 06, 07 are four layouts of one message. The site now shows flyer-05 only.
- Visa services (flyer-04): kept because the owner asked for all flyers. It makes claims that are unverified (see VERIFY.md).

## Instagram MHTML (`reference-materials/`)

Session 1 found only 13 small thumbnails (about 640 px): 12 posts and a profile photo. Not re-opened in session 3. Not usable as site photos without the owner's written permission.

## Still missing

- Real, consented photos from past trips (hero, tour pages, gallery).
- Original logo file (current logos are cut from flyers).
- Source and licence for the flyer artwork.

## Runtime images (not local)

`src/photos.js` still fetches destination photos from Wikimedia Commons in the visitor's browser. The hero, tour cards and gallery depend on it. It was NOT removed in session 3 because there are no approved local photos to replace it with; removing it would leave those sections empty. Replace it when the owner supplies photos.
