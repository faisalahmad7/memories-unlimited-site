# Photo and component credits

## Destination photos
Until `python scripts/fetch_photos.py` is run on a computer with internet, the site still looks photos up live from Wikimedia Commons (`src/photos.js`).
After the script runs, photos are stored in `public/photos/` as WebP, `src/localPhotos.js` lists them, the site stops calling Wikimedia for those destinations,
and `src/photoCredits.js` feeds the `/credits` page (linked from every footer).

Most Commons photos are CC BY or CC BY-SA. Those licences require crediting the author, so credits stay on the `/credits` page and are NOT shown on each photo.
Photos that are public domain or CC0 need no credit. `--pd-only` downloads only those. Do not delete the `/credits` page while CC BY or CC BY-SA photos are in use.

## Components
React Bits components in `src/rb`: MIT + Commons Clause, see `src/rb/LICENSE-react-bits.md` (keep that file; use inside this site only).
