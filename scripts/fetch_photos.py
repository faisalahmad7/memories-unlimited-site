#!/usr/bin/env python3
"""Download destination photos from Wikimedia Commons ONCE, compress them to WebP and wire them into the site.

Run this on YOUR computer (it needs internet; the Claude sandbox has none):
    pip install pillow
    python scripts/fetch_photos.py                # CC0 / public domain and CC BY / CC BY-SA photos
    python scripts/fetch_photos.py --pd-only      # ONLY photos that need no credit (public domain / CC0)

It writes:
    public/photos/<destination>/01.webp ...   (max 1600 px wide, WebP quality 78)
    src/localPhotos.js                        (the site uses these first and stops calling Wikimedia)
    src/photoCredits.js                       (shown on the small /credits page, NOT on the photos)

LICENCE NOTE: most Commons photos are CC BY or CC BY-SA. Those licences REQUIRE crediting the author, and removing
the credit breaks the licence. That is why credits go on one /credits page, linked from the footer. If you want a
site with no credits at all, use --pd-only (fewer photos), or use photos you own.
"""
import argparse, html, json, os, re, time, urllib.parse, urllib.request, io
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {'User-Agent': 'MemoriesUnlimitedSite/1.0 (school tours website; photo import script)'}
API = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=40&prop=imageinfo&iiprop=url%7Csize%7Cmime%7Cextmetadata&iiurlwidth=1600&format=json&gsrsearch='
BAD = re.compile(r'\b(map|logo|flag|diagram|plan|poster|stamp|coat of arms|locator|banner|icon|sign|ticket|menu|brochure|svg|screenshot|portrait|crowd|queue|selfie|interior)\b', re.I)
PD = re.compile(r'^(public domain|pd|cc0|cc-zero)', re.I)
CC = re.compile(r'^(cc[ -]by(-sa)?[ -]\d)', re.I)
SHOW, MIN_W = 8, 2000
# Search terms per destination: [search text, caption]. Same list the site used at runtime.
DESTS = {
 "singapore": [
  [
   "Merlion Park Singapore",
   "Merlion Park"
  ],
  [
   "Marina Bay Sands",
   "Marina Bay Sands"
  ],
  [
   "Gardens by the Bay",
   "Gardens by the Bay"
  ],
  [
   "Universal Studios Singapore",
   "Universal Studios"
  ],
  [
   "Singapore Flyer",
   "Singapore Flyer"
  ],
  [
   "Sentosa Singapore",
   "Sentosa"
  ],
  [
   "S.E.A. Aquarium Sentosa",
   "S.E.A. Aquarium"
  ],
  [
   "Orchard Road Singapore",
   "Orchard Road"
  ]
 ],
 "hampi": [
  [
   "Virupaksha Temple Hampi",
   "Virupaksha Temple"
  ],
  [
   "Vittala Temple Hampi stone chariot",
   "Vittala Temple"
  ],
  [
   "Lotus Mahal Hampi",
   "Lotus Mahal"
  ],
  [
   "Elephant stables Hampi",
   "Elephant Stable"
  ],
  [
   "Queen's Bath Hampi",
   "Queen's Bath"
  ],
  [
   "Hemakuta Hill Hampi",
   "Hemakuta Hill"
  ],
  [
   "Tungabhadra River Hampi",
   "Tungabhadra River"
  ],
  [
   "Hampi ruins",
   "Hampi"
  ]
 ],
 "jaipur": [
  [
   "Hawa Mahal Jaipur",
   "Hawa Mahal"
  ],
  [
   "Amer Fort Jaipur",
   "Amer Fort"
  ],
  [
   "City Palace Jaipur",
   "City Palace"
  ],
  [
   "Fatehpur Sikri",
   "Fatehpur Sikri"
  ],
  [
   "Buland Darwaza Fatehpur Sikri",
   "Buland Darwaza"
  ],
  [
   "Taj Mahal Agra",
   "Taj Mahal"
  ],
  [
   "Agra Fort",
   "Agra Fort"
  ],
  [
   "Jantar Mantar Jaipur",
   "Jantar Mantar"
  ]
 ],
 "ahmedabad": [
  [
   "Sabarmati Riverfront Ahmedabad",
   "Sabarmati Riverfront"
  ],
  [
   "Jama Masjid Ahmedabad",
   "Jama Masjid"
  ],
  [
   "Adalaj Stepwell",
   "Adalaj Stepwell"
  ],
  [
   "Sabarmati Ashram",
   "Sabarmati Ashram"
  ],
  [
   "Calico Museum of Textiles",
   "Calico Museum"
  ],
  [
   "Gujarat Science City",
   "Science City"
  ],
  [
   "Sidi Saiyyed Mosque jali",
   "Sidi Saiyyed Mosque"
  ],
  [
   "Ahmedabad",
   "Ahmedabad"
  ]
 ],
 "mahabaleshwar": [
  [
   "Venna Lake Mahabaleshwar",
   "Venna Lake"
  ],
  [
   "Mahabaleshwar",
   "Mahabaleshwar"
  ],
  [
   "Arthur's Seat Mahabaleshwar",
   "Arthur's Seat"
  ],
  [
   "Pratapgad fort",
   "Pratapgad"
  ],
  [
   "Mapro Garden Panchgani",
   "Mapro Garden"
  ],
  [
   "Panchgani table land",
   "Panchgani"
  ],
  [
   "Lingmala waterfall Mahabaleshwar",
   "Lingmala Waterfall"
  ],
  [
   "Krishna river Mahabaleshwar",
   "Krishna River"
  ]
 ],
 "imagicaa": [
  [
   "Imagicaa theme park Khopoli",
   "Imagicaa"
  ],
  [
   "Adlabs Imagica",
   "Imagicaa"
  ],
  [
   "Imagica water park Khopoli",
   "Imagicaa water park"
  ],
  [
   "Imagica Mumbai theme park rides",
   "Imagicaa rides"
  ],
  [
   "Khopoli Maharashtra",
   "Khopoli"
  ]
 ],
 "goa": [
  [
   "Palolem Beach",
   "Palolem Beach"
  ],
  [
   "Calangute Beach",
   "Calangute"
  ],
  [
   "Fort Aguada",
   "Fort Aguada"
  ],
  [
   "Basilica of Bom Jesus",
   "Basilica of Bom Jesus"
  ],
  [
   "Dudhsagar Falls",
   "Dudhsagar Falls"
  ],
  [
   "Baga Beach Goa",
   "Baga Beach"
  ],
  [
   "Se Cathedral Old Goa",
   "Se Cathedral"
  ],
  [
   "Chapora Fort",
   "Chapora Fort"
  ]
 ],
 "manali": [
  [
   "Solang Valley",
   "Solang Valley"
  ],
  [
   "Rohtang Pass",
   "Rohtang Pass"
  ],
  [
   "Hadimba Devi Temple",
   "Hadimba Temple"
  ],
  [
   "Manali Himachal Pradesh",
   "Manali"
  ],
  [
   "Beas River Manali",
   "Beas River"
  ],
  [
   "Atal Tunnel Rohtang",
   "Atal Tunnel"
  ],
  [
   "Jogini Falls Manali",
   "Jogini Falls"
  ],
  [
   "Old Manali",
   "Old Manali"
  ]
 ],
 "kerala": [
  [
   "Kerala backwaters houseboat",
   "Kerala backwaters"
  ],
  [
   "Munnar tea plantation",
   "Munnar"
  ],
  [
   "Periyar National Park",
   "Periyar"
  ],
  [
   "Kovalam beach",
   "Kovalam"
  ],
  [
   "Alleppey backwaters",
   "Alleppey"
  ],
  [
   "Athirappilly Falls",
   "Athirappilly Falls"
  ],
  [
   "Varkala cliff beach",
   "Varkala"
  ],
  [
   "Fort Kochi Chinese fishing nets",
   "Fort Kochi"
  ]
 ]
}

def get(url, tries=3):
    err = None
    for i in range(tries):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40).read()
        except Exception as e:
            err = e; time.sleep(1.5 * (i + 1))
    raise err

def search(term):
    try:
        j = json.loads(get(API + urllib.parse.quote(term + ' filetype:bitmap')))
    except Exception:
        return []
    pages = sorted(j.get('query', {}).get('pages', {}).values(), key=lambda p: p.get('index', 0))
    return [(p['title'], p['imageinfo'][0]) for p in pages if p.get('imageinfo') and p['imageinfo'][0].get('thumburl')]

def clean(s): return html.unescape(re.sub(r'<[^>]+>', '', s or '')).strip()

def ok(title, ii, pd_only):
    if ii['mime'] != 'image/jpeg' or ii['width'] < MIN_W or ii['height'] < MIN_W * 0.55: return None
    r = ii['width'] / ii['height']
    if not 1.25 <= r <= 2.1 or BAD.search(title): return None
    lic = clean(ii.get('extmetadata', {}).get('LicenseShortName', {}).get('value'))
    if PD.match(lic): return lic, False
    if CC.match(lic) and not pd_only: return lic, True
    return None

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--pd-only', action='store_true'); a = ap.parse_args()
    manifest, credits = {}, []
    for dest, qs in DESTS.items():
        print('==', dest); seen, out = set(), []
        lists = [search(t) for t, _ in qs]
        for rnd in range(6):
            for (term, cap), lst in zip(qs, lists):
                if len(out) >= SHOW: break
                for title, ii in lst:
                    lic = ok(title, ii, a.pd_only)
                    if lic and title not in seen:
                        seen.add(title); out.append((title, ii, cap, lic)); break
        os.makedirs(os.path.join(ROOT, 'public', 'photos', dest), exist_ok=True)
        items = []
        for n, (title, ii, cap, (lic, needs)) in enumerate(out[:SHOW], 1):
            try:
                im = Image.open(io.BytesIO(get(ii['thumburl']))).convert('RGB')
            except Exception as e:
                print('  skip', title, e); continue
            im.thumbnail((1600, 1600))
            rel = '/photos/%s/%02d.webp' % (dest, n)
            im.save(os.path.join(ROOT, 'public', rel.lstrip('/')), 'WEBP', quality=78, method=6)
            items.append({'src': rel, 'file': title, 'cap': cap})
            md = ii.get('extmetadata', {})
            credits.append({'dest': dest, 'file': title, 'author': clean(md.get('Artist', {}).get('value')) or 'Unknown', 'license': lic,
                            'creditRequired': needs, 'page': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(title.replace(' ', '_'))})
            print('  ok', rel, lic); time.sleep(0.4)
        if items: manifest[dest] = items
    open(os.path.join(ROOT, 'src', 'localPhotos.js'), 'w', encoding='utf-8').write(
        '// GENERATED by scripts/fetch_photos.py. Destinations listed here are served from /public/photos and are never fetched from Wikimedia.\nexport const LOCAL = ' + json.dumps(manifest, indent=1, ensure_ascii=False) + '\n')
    open(os.path.join(ROOT, 'src', 'photoCredits.js'), 'w', encoding='utf-8').write(
        '// GENERATED by scripts/fetch_photos.py. Shown on the /credits page.\nexport const CREDITS = ' + json.dumps(credits, indent=1, ensure_ascii=False) + '\n')
    print('Done:', sum(len(v) for v in manifest.values()), 'photos in', len(manifest), 'destinations')
    missing = [d for d in DESTS if d not in manifest]
    if missing: print('No local photos for:', ', '.join(missing), '(the site keeps using Wikimedia for these until photos are added)')

if __name__ == '__main__': main()
