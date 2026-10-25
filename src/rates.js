// Rate data transcribed from "Memories Trips Rates 2026-27.pdf" (reference-materials/).
// Method: the PDF text layer was read by word position (scripts/extract_rates.py), each number was assigned to its column
// by x-position, and every table page was then compared by eye with a rendered image of the page.
// Every row carries sourcePage so it can be re-checked. NOTHING here is shown to visitors until the owner confirms it
// (see "Rates" in Memories_Unlimited_Master_Prompt_and_Handoff.md, Part C).
//
// Open questions (do not publish until answered):
//  - The sheet never says "per student". The notes talk about "payable students", so per-student is likely, but unconfirmed.
//  - GST: 5% "on total billing" is printed under the one-day table and under the multi-day table only.
//  - Notes printed under a table apply to THAT table only. Field trips, edutainment and camping have no notes printed,
//    so their inclusions, origin and minimum group are unknown.
//  - Multi-day tours: page 6 header says "V - X", page 7 header says "I - X". Stored as printed.
//  - Singapore: sheet says 120000 (page 7, row 31); the flyer and old tours.js said 69,999. Conflict, ask the owner.
//  - Mahabaleshwar + Go Kart + Mapro: sheet says 1500 / 1600 / 1700 / 1700 (non-AC coach, plus GST); the flyer says 2200 per head
//    with an AC coach and boating. Possibly different packages. Ask the owner.
//  - rates[band] === 'customised' means the sheet prints "Customized" instead of a number.

export const RATE_META = {
  source: 'Memories Trips Rates 2026-27.pdf',
  currency: 'INR',
  gstPercent: 5,
  minPayableStudents: 40,
  freeStaffRatio: '1 teacher or staff member free for every 20 students',
  unitConfirmed: false,
  verifiedByOwner: false,
}

// Wording printed on the sheet, per table. null = the sheet prints no note for that table.
export const RATE_NOTES = {
  'one-day-picnic': {
    page: 2,
    lines: [
      'Transportation by luxury non-AC coach, with all safety and RTO norms followed',
      'Entry with activities, plus breakfast, lunch and evening snack',
      'Hygienic meals and drinking water throughout the trip',
      '20 students : 1 teacher/staff complimentary for the trip',
      'Minimum group size 40 payable students for the above rates',
      'Experienced trip leader on every coach, with knowledge of basic first aid',
      'All above rates are for the Pune and PCMC region, including transportation',
      'GST 5% will be applicable on total billing',
    ],
  },
  'field-trip': null,
  edutainment: null,
  camping: null,
  'multi-day-tour': {
    page: 7,
    lines: [
      'Transportation by AC train, flights or buses, including visas for international tours',
      'All meals as per itinerary, and packaged drinking water',
      'Hygienic meals and drinking water throughout the trip',
      '20 students : 1 teacher/staff complimentary for the trip',
      'Minimum group size 40 payable students for the above rates',
      'Experienced trip leader on every coach, with knowledge of basic first aid',
      'GST 5% will be applicable on total billing',
    ],
  },
}

export const RATE_CATEGORIES = [
  { id: 'one-day-picnic', title: 'One-day picnics', bands: ['pre-primary', 'i-iv', 'v-x', 'xi-xii', 'college'] },
  { id: 'field-trip', title: 'Field trips', bands: ['i-iv', 'v-x', 'college'] },
  { id: 'edutainment', title: 'Edutainment', bands: ['i-iv', 'v-x', 'college'] },
  { id: 'camping', title: 'Camping', bands: ['i-x', 'college'] },
  { id: 'multi-day-tour', title: 'Multi-day educational tours', bands: ['v-x', 'i-x', 'college'] },
]

export const BAND_LABEL = { 'pre-primary': 'Pre-Primary', 'i-iv': 'Classes I-IV', 'v-x': 'Classes V-X', 'xi-xii': 'Classes XI-XII', 'i-x': 'Classes I-X', college: 'Senior college' }

export const formatRupees = n => (typeof n === 'number' ? '\u20B9' + n.toLocaleString('en-IN') : 'Customised')

export const RATES = [
 {
  "id": "one-day-picnic-01",
  "category": "one-day-picnic",
  "no": 1,
  "name": "IMAGICAA THEME PARK",
  "rates": {
   "v-x": 1800,
   "xi-xii": 1800,
   "college": 1900
  },
  "sourcePage": 1,
  "location": "Khopoli"
 },
 {
  "id": "one-day-picnic-02",
  "category": "one-day-picnic",
  "no": 2,
  "name": "IMAGICAA WATER PARK",
  "rates": {
   "v-x": 1600,
   "xi-xii": 1600,
   "college": 1700
  },
  "sourcePage": 1,
  "location": "Khopoli"
 },
 {
  "id": "one-day-picnic-03",
  "category": "one-day-picnic",
  "no": 3,
  "name": "IMAGICAA SNOW PARK (Add ON)",
  "rates": {
   "v-x": 150,
   "xi-xii": 150,
   "college": 350
  },
  "sourcePage": 1,
  "location": "Khopoli",
  "addOn": true
 },
 {
  "id": "one-day-picnic-04",
  "category": "one-day-picnic",
  "no": 4,
  "name": "WET N JOY AMUSEMENT PARK",
  "rates": {
   "v-x": 1650,
   "xi-xii": 1650,
   "college": 1750
  },
  "sourcePage": 1,
  "location": "Lonavala"
 },
 {
  "id": "one-day-picnic-05",
  "category": "one-day-picnic",
  "no": 5,
  "name": "WET N JOY WATER PARK",
  "rates": {
   "v-x": 1650,
   "xi-xii": 1650,
   "college": 1750
  },
  "sourcePage": 1,
  "location": "Lonavala"
 },
 {
  "id": "one-day-picnic-06",
  "category": "one-day-picnic",
  "no": 6,
  "name": "DIAMOND PARKS",
  "rates": {
   "pre-primary": 1000,
   "i-iv": 1400,
   "v-x": 1500,
   "xi-xii": 1500,
   "college": 1600
  },
  "sourcePage": 1,
  "location": "Lohegaon"
 },
 {
  "id": "one-day-picnic-07",
  "category": "one-day-picnic",
  "no": 7,
  "name": "SUNNY’S WORLD ADVENTURE PARK",
  "rates": {
   "i-iv": 1400,
   "v-x": 1600,
   "xi-xii": 1600,
   "college": 1700
  },
  "sourcePage": 1,
  "location": "Sus"
 },
 {
  "id": "one-day-picnic-08",
  "category": "one-day-picnic",
  "no": 8,
  "name": "PRATHAMESH RESORT",
  "rates": {
   "pre-primary": 1000,
   "i-iv": 1150,
   "v-x": 1250,
   "xi-xii": 1350,
   "college": 1600
  },
  "sourcePage": 1,
  "location": "Khedshivapur"
 },
 {
  "id": "one-day-picnic-09",
  "category": "one-day-picnic",
  "no": 9,
  "name": "GO CRAZY RESORT",
  "rates": {
   "pre-primary": 950,
   "i-iv": 1150,
   "v-x": 1250,
   "xi-xii": 1350,
   "college": 1600
  },
  "sourcePage": 1,
  "location": "Sinhaghad"
 },
 {
  "id": "one-day-picnic-10",
  "category": "one-day-picnic",
  "no": 10,
  "name": "MONTERIA VILLAGE RESORT",
  "rates": {
   "i-iv": 1400,
   "v-x": 1500,
   "xi-xii": 1600,
   "college": 1700
  },
  "sourcePage": 1,
  "location": "Khopoli"
 },
 {
  "id": "one-day-picnic-11",
  "category": "one-day-picnic",
  "no": 11,
  "name": "MAULI RESORT",
  "rates": {
   "pre-primary": 1000,
   "i-iv": 1150,
   "v-x": 1250,
   "xi-xii": 1350,
   "college": 1600
  },
  "sourcePage": 1,
  "location": "Kasarsai"
 },
 {
  "id": "one-day-picnic-12",
  "category": "one-day-picnic",
  "no": 12,
  "name": "KALPATARU BAUG",
  "rates": {
   "pre-primary": 850,
   "i-iv": 950,
   "v-x": 1000,
   "xi-xii": 1200,
   "college": 1300
  },
  "sourcePage": 1,
  "location": "Theur"
 },
 {
  "id": "one-day-picnic-13",
  "category": "one-day-picnic",
  "no": 13,
  "name": "DAREKARWADA Agro Tourism",
  "rates": {
   "pre-primary": 900,
   "i-iv": 1000,
   "v-x": 1100,
   "xi-xii": 1300,
   "college": 1300
  },
  "sourcePage": 1,
  "location": "Yawat"
 },
 {
  "id": "one-day-picnic-14",
  "category": "one-day-picnic",
  "no": 14,
  "name": "AVANI Agro Tourism",
  "rates": {
   "pre-primary": 800,
   "i-iv": 900,
   "v-x": 950,
   "xi-xii": 1300,
   "college": 1300
  },
  "sourcePage": 1,
  "location": "Chakan"
 },
 {
  "id": "one-day-picnic-15",
  "category": "one-day-picnic",
  "no": 15,
  "name": "AROHI Agro Tourism",
  "rates": {
   "pre-primary": 800,
   "i-iv": 900,
   "v-x": 950,
   "xi-xii": 1300,
   "college": 1300
  },
  "sourcePage": 1,
  "location": "Talegaon"
 },
 {
  "id": "one-day-picnic-16",
  "category": "one-day-picnic",
  "no": 16,
  "name": "BARAMATI Agro Tourism",
  "rates": {
   "i-iv": 1100,
   "v-x": 1250,
   "xi-xii": 1400,
   "college": 1400
  },
  "sourcePage": 1,
  "location": "Baramati"
 },
 {
  "id": "one-day-picnic-17",
  "category": "one-day-picnic",
  "no": 17,
  "name": "MEHER RETREAT Agro Tourism",
  "rates": {
   "i-iv": 900,
   "v-x": 1100,
   "xi-xii": 1250,
   "college": 1250
  },
  "sourcePage": 1,
  "location": "Yawat"
 },
 {
  "id": "one-day-picnic-18",
  "category": "one-day-picnic",
  "no": 18,
  "name": "SHANTIVAN RESORT",
  "rates": {
   "pre-primary": 850,
   "i-iv": 950,
   "v-x": 1100,
   "xi-xii": 1300,
   "college": 1300
  },
  "sourcePage": 1,
  "location": "Panshet"
 },
 {
  "id": "one-day-picnic-19",
  "category": "one-day-picnic",
  "no": 19,
  "name": "SEJAL’S WORLD RESORT",
  "rates": {
   "pre-primary": 1050,
   "i-iv": 1150,
   "v-x": 1250,
   "xi-xii": 1400,
   "college": 1500
  },
  "sourcePage": 1,
  "location": "Bhor"
 },
 {
  "id": "one-day-picnic-20",
  "category": "one-day-picnic",
  "no": 20,
  "name": "SNEH RESORT",
  "rates": {
   "pre-primary": 1150,
   "i-iv": 1300,
   "v-x": 1300,
   "xi-xii": 1400,
   "college": 1500
  },
  "sourcePage": 1,
  "location": "Kasarsai"
 },
 {
  "id": "one-day-picnic-21",
  "category": "one-day-picnic",
  "no": 21,
  "name": "VISHWASGADH RESORT",
  "rates": {
   "pre-primary": 850,
   "i-iv": 950,
   "v-x": 1100,
   "xi-xii": 1200,
   "college": 1200
  },
  "sourcePage": 1,
  "location": "Khadakwasla"
 },
 {
  "id": "one-day-picnic-22",
  "category": "one-day-picnic",
  "no": 22,
  "name": "CHONDE FARMS RESORT",
  "rates": {
   "pre-primary": 850,
   "i-iv": 950,
   "v-x": 1100,
   "xi-xii": 1200,
   "college": 1200
  },
  "sourcePage": 1,
  "location": "Wagholi"
 },
 {
  "id": "one-day-picnic-23",
  "category": "one-day-picnic",
  "no": 23,
  "name": "NATURE NEST Agro Tourism",
  "rates": {
   "pre-primary": 800,
   "i-iv": 850,
   "v-x": 950,
   "xi-xii": 1200,
   "college": 1200
  },
  "sourcePage": 1,
  "location": "Urli Kanchan"
 },
 {
  "id": "one-day-picnic-24",
  "category": "one-day-picnic",
  "no": 24,
  "name": "RAJ ROHI Agro Tourism",
  "rates": {
   "pre-primary": 800,
   "i-iv": 850,
   "v-x": 950,
   "xi-xii": 1200,
   "college": 1200
  },
  "sourcePage": 2,
  "location": "Talegaon"
 },
 {
  "id": "one-day-picnic-25",
  "category": "one-day-picnic",
  "no": 25,
  "name": "PAWAR Agro Tourism",
  "rates": {
   "pre-primary": 800,
   "i-iv": 850,
   "v-x": 950,
   "xi-xii": 1200,
   "college": 1200
  },
  "sourcePage": 2,
  "location": "Urli Kanchan"
 },
 {
  "id": "one-day-picnic-26",
  "category": "one-day-picnic",
  "no": 26,
  "name": "ANTHURIUM RESORT",
  "rates": {
   "pre-primary": 950,
   "i-iv": 1050,
   "v-x": 1150,
   "xi-xii": 1250,
   "college": 1500
  },
  "sourcePage": 2,
  "location": "Wagholi"
 },
 {
  "id": "one-day-picnic-27",
  "category": "one-day-picnic",
  "no": 27,
  "name": "FUNCITY",
  "rates": {
   "pre-primary": 1250,
   "i-iv": 1250
  },
  "sourcePage": 2,
  "location": "VM / Wakad"
 },
 {
  "id": "one-day-picnic-28",
  "category": "one-day-picnic",
  "no": 28,
  "name": "BUMBLE JUMBLE",
  "rates": {
   "pre-primary": 1050,
   "i-iv": 1150
  },
  "sourcePage": 2,
  "location": "Undri"
 },
 {
  "id": "one-day-picnic-29",
  "category": "one-day-picnic",
  "no": 29,
  "name": "KOKONUTS",
  "rates": {
   "pre-primary": 1250,
   "i-iv": 1250
  },
  "sourcePage": 2,
  "location": "NIBM"
 },
 {
  "id": "one-day-picnic-30",
  "category": "one-day-picnic",
  "no": 30,
  "name": "KOKONUTS",
  "rates": {
   "pre-primary": 1050,
   "i-iv": 1150
  },
  "sourcePage": 2,
  "location": "CAMP"
 },
 {
  "id": "one-day-picnic-31",
  "category": "one-day-picnic",
  "no": 31,
  "name": "MAHABALESHWAR + Go Kart + Mapro",
  "rates": {
   "i-iv": 1500,
   "v-x": 1600,
   "xi-xii": 1700,
   "college": 1700
  },
  "sourcePage": 2,
  "location": "Mbleshwar"
 },
 {
  "id": "field-trip-01",
  "category": "field-trip",
  "no": 1,
  "name": "National War Memorial + Aga Khan Palace",
  "rates": {
   "i-iv": 800,
   "v-x": 850
  },
  "sourcePage": 3
 },
 {
  "id": "field-trip-02",
  "category": "field-trip",
  "no": 2,
  "name": "Aviation Museum + Gram Sanskruti Udyan",
  "rates": {
   "i-iv": 800,
   "v-x": 850
  },
  "sourcePage": 3
 },
 {
  "id": "field-trip-03",
  "category": "field-trip",
  "no": 3,
  "name": "Katraj Zoo + Milk Dairy",
  "rates": {
   "i-iv": 800,
   "v-x": 850
  },
  "sourcePage": 3
 },
 {
  "id": "field-trip-04",
  "category": "field-trip",
  "no": 4,
  "name": "Science Park Chinchwad",
  "rates": {
   "i-iv": 800,
   "v-x": 850
  },
  "sourcePage": 3
 },
 {
  "id": "field-trip-05",
  "category": "field-trip",
  "no": 5,
  "name": "Cake Factory with Hands on Experience",
  "rates": {
   "i-iv": 800,
   "v-x": 850
  },
  "sourcePage": 3
 },
 {
  "id": "field-trip-06",
  "category": "field-trip",
  "no": 6,
  "name": "Fire Station",
  "rates": {
   "i-iv": 700,
   "v-x": 750
  },
  "sourcePage": 3
 },
 {
  "id": "field-trip-07",
  "category": "field-trip",
  "no": 7,
  "name": "Parle Factory",
  "rates": {
   "i-iv": 700,
   "v-x": 750
  },
  "sourcePage": 3
 },
 {
  "id": "field-trip-08",
  "category": "field-trip",
  "no": 8,
  "name": "ZAPURZA Art Museum",
  "rates": {
   "i-iv": 900,
   "v-x": 950
  },
  "sourcePage": 3
 },
 {
  "id": "field-trip-09",
  "category": "field-trip",
  "no": 9,
  "name": "SHIV SHRUSHTI Historical Museum",
  "rates": {
   "i-iv": 900,
   "v-x": 1000
  },
  "sourcePage": 3
 },
 {
  "id": "field-trip-10",
  "category": "field-trip",
  "no": 10,
  "name": "Karla Caves + Chikki Factory + Blind’s People Home",
  "rates": {
   "i-iv": 1100,
   "v-x": 1200,
   "college": 1300
  },
  "sourcePage": 3
 },
 {
  "id": "field-trip-11",
  "category": "field-trip",
  "no": 11,
  "name": "SHAGUNA BAUG Agro Tourism - Karjat",
  "rates": {
   "i-iv": 1550,
   "v-x": 1650,
   "college": 1750
  },
  "sourcePage": 3
 },
 {
  "id": "field-trip-12",
  "category": "field-trip",
  "no": 12,
  "name": "YUSUF MEHERALLY CENTRE - Panvel",
  "rates": {
   "i-iv": 1550,
   "v-x": 1650,
   "college": 1750
  },
  "sourcePage": 3
 },
 {
  "id": "field-trip-13",
  "category": "field-trip",
  "no": 13,
  "name": "Nehru Science Centre + Planetarium - Mumbai",
  "rates": {
   "i-iv": 1550,
   "v-x": 1700,
   "college": 1800
  },
  "sourcePage": 3
 },
 {
  "id": "field-trip-14",
  "category": "field-trip",
  "no": 14,
  "name": "MUMBAI DARSHAN",
  "rates": {
   "i-iv": 1600,
   "v-x": 1800,
   "college": 1900
  },
  "sourcePage": 3
 },
 {
  "id": "field-trip-15",
  "category": "field-trip",
  "no": 15,
  "name": "Go CHEESE Factory - Manchar",
  "rates": {
   "i-iv": 1650,
   "v-x": 1750,
   "college": 1850
  },
  "sourcePage": 3
 },
 {
  "id": "field-trip-16",
  "category": "field-trip",
  "no": 16,
  "name": "Blades Of Glory Cricket Museum",
  "rates": {
   "i-iv": 800,
   "v-x": 800,
   "college": 850
  },
  "sourcePage": 3
 },
 {
  "id": "field-trip-17",
  "category": "field-trip",
  "no": 17,
  "name": "Sinhaghad Fort",
  "rates": {
   "v-x": 1000,
   "college": 1100
  },
  "sourcePage": 3
 },
 {
  "id": "field-trip-18",
  "category": "field-trip",
  "no": 18,
  "name": "Parle Factory + Karla Caves",
  "rates": {
   "v-x": 950,
   "college": 1100
  },
  "sourcePage": 3
 },
 {
  "id": "field-trip-19",
  "category": "field-trip",
  "no": 19,
  "name": "Shaniwarwada + Lal Mahal",
  "rates": {
   "v-x": 850,
   "college": 900
  },
  "sourcePage": 3
 },
 {
  "id": "edutainment-01",
  "category": "edutainment",
  "no": 1,
  "name": "Diamond Parks + National War Memorial",
  "rates": {
   "i-iv": 1450,
   "v-x": 1550,
   "college": 1650
  },
  "sourcePage": 4
 },
 {
  "id": "edutainment-02",
  "category": "edutainment",
  "no": 2,
  "name": "Sunny’s World + Aviation Museum",
  "rates": {
   "i-iv": 1350,
   "v-x": 1650,
   "college": 1750
  },
  "sourcePage": 4
 },
 {
  "id": "edutainment-03",
  "category": "edutainment",
  "no": 3,
  "name": "Go Crazy + Aviation Museum",
  "rates": {
   "i-iv": 1200,
   "v-x": 1300,
   "college": 1400
  },
  "sourcePage": 4
 },
 {
  "id": "edutainment-04",
  "category": "edutainment",
  "no": 4,
  "name": "Kalpataru Baug + Saree/Textile Factory",
  "rates": {
   "i-iv": 950,
   "v-x": 1100,
   "college": 1200
  },
  "sourcePage": 4
 },
 {
  "id": "edutainment-05",
  "category": "edutainment",
  "no": 5,
  "name": "Darekarwada + Plant Nursery",
  "rates": {
   "i-iv": 1050,
   "v-x": 1150,
   "college": 1300
  },
  "sourcePage": 4
 },
 {
  "id": "edutainment-06",
  "category": "edutainment",
  "no": 6,
  "name": "PUNO Junior / Advance + Aga Khan Palace / War Memorial",
  "rates": {
   "i-iv": 1400
  },
  "sourcePage": 4
 },
 {
  "id": "edutainment-07",
  "category": "edutainment",
  "no": 7,
  "name": "Funcity + Aga Khan Palace / War Memorial",
  "rates": {
   "i-iv": 1300
  },
  "sourcePage": 4
 },
 {
  "id": "edutainment-08",
  "category": "edutainment",
  "no": 8,
  "name": "Bumble Jumble + War Memorial / Shinde Chhatri",
  "rates": {
   "i-iv": 1200
  },
  "sourcePage": 4
 },
 {
  "id": "edutainment-09",
  "category": "edutainment",
  "no": 9,
  "name": "Kokonuts + War Memorial / Shinde Chhatri",
  "rates": {
   "i-iv": 1200
  },
  "sourcePage": 4
 },
 {
  "id": "edutainment-10",
  "category": "edutainment",
  "no": 10,
  "name": "Vishwasgadh + Zapurza Art Museum",
  "rates": {
   "i-iv": 1200,
   "v-x": 1400,
   "college": 1400
  },
  "sourcePage": 4
 },
 {
  "id": "camping-01",
  "category": "camping",
  "no": 1,
  "name": "Lonavala - Karla Caves, Blind Home, Wax Museum, Chikki Fact",
  "rates": {
   "i-x": 4000,
   "college": 5000
  },
  "sourcePage": 5,
  "duration": "1N-2D",
  "review": "Name is cut off on the sheet after \"Chikki Fact\"."
 },
 {
  "id": "camping-02",
  "category": "camping",
  "no": 2,
  "name": "Mahabaleshwar - Table Land, Market,",
  "rates": {
   "i-x": 4000,
   "college": 5000
  },
  "sourcePage": 5,
  "duration": "1N-2D",
  "review": "Name is cut off on the sheet after \"Market,\"."
 },
 {
  "id": "camping-03",
  "category": "camping",
  "no": 3,
  "name": "Mapro, Go Kart Panchgani Adventure",
  "rates": {
   "i-x": 4300,
   "college": 4800
  },
  "sourcePage": 5,
  "duration": "1N-2D"
 },
 {
  "id": "camping-04",
  "category": "camping",
  "no": 4,
  "name": "Camp Durshet Adventure Camp",
  "rates": {
   "i-x": 4300,
   "college": 4800
  },
  "sourcePage": 5,
  "duration": "1N-2D"
 },
 {
  "id": "camping-05",
  "category": "camping",
  "no": 5,
  "name": "Durshet Adventure Camp + ND STUDIO",
  "rates": {
   "i-x": 4500,
   "college": 4800
  },
  "sourcePage": 5,
  "review": "Duration is blank on the sheet."
 },
 {
  "id": "camping-06",
  "category": "camping",
  "no": 6,
  "name": "Karjat Stay + Shaguna Baug Agro Tour",
  "rates": {
   "i-x": 4500,
   "college": 5000
  },
  "sourcePage": 5,
  "duration": "1N-2D"
 },
 {
  "id": "camping-07",
  "category": "camping",
  "no": 7,
  "name": "Aurangabad - Ellora & Daulatabad",
  "rates": {
   "i-x": 6500,
   "college": 7500
  },
  "sourcePage": 5,
  "duration": "1N-2D"
 },
 {
  "id": "camping-08",
  "category": "camping",
  "no": 8,
  "name": "Aurangabad - Ajanta, Ellora &",
  "rates": {
   "i-x": 8000,
   "college": 9000
  },
  "sourcePage": 5,
  "duration": "2N-3D",
  "review": "Name is cut off on the sheet after \"Ellora &\"."
 },
 {
  "id": "camping-09",
  "category": "camping",
  "no": 9,
  "name": "Daulatabad Diveagar Beach + Raigad",
  "rates": {
   "i-x": 5000,
   "college": 5500
  },
  "sourcePage": 5,
  "duration": "1N-2D"
 },
 {
  "id": "camping-10",
  "category": "camping",
  "no": 10,
  "name": "Fort Dapoli Beach + Raigad Fort",
  "rates": {
   "i-x": 5000,
   "college": 5500
  },
  "sourcePage": 5,
  "duration": "1N-2D"
 },
 {
  "id": "camping-11",
  "category": "camping",
  "no": 11,
  "name": "Goa",
  "rates": {
   "i-x": 10000,
   "college": 12000
  },
  "sourcePage": 5,
  "duration": "4N-5D"
 },
 {
  "id": "multi-day-tour-01",
  "category": "multi-day-tour",
  "no": 1,
  "name": "GOA with Spice Plantation",
  "rates": {
   "v-x": 13500,
   "college": 15500
  },
  "sourcePage": 6,
  "duration": "4N-5D"
 },
 {
  "id": "multi-day-tour-02",
  "category": "multi-day-tour",
  "no": 2,
  "name": "GOA with Chorao Island",
  "rates": {
   "v-x": 15500,
   "college": 17500
  },
  "sourcePage": 6,
  "duration": "4N-5D"
 },
 {
  "id": "multi-day-tour-03",
  "category": "multi-day-tour",
  "no": 3,
  "name": "AURANGABAD - Ajanta, Ellora, Daulatabad, Bibi Ka Maqbara",
  "rates": {
   "v-x": 9500,
   "college": 11000
  },
  "sourcePage": 6,
  "duration": "3N-4D"
 },
 {
  "id": "multi-day-tour-04",
  "category": "multi-day-tour",
  "no": 4,
  "name": "AHMEDABAD - ISRO, Lothal, Sabarmati Ashram, Akshardham",
  "rates": {
   "v-x": 15000,
   "college": 17000
  },
  "sourcePage": 6,
  "duration": "4N-5D"
 },
 {
  "id": "multi-day-tour-05",
  "category": "multi-day-tour",
  "no": 5,
  "name": "AHMEDABAD with Little Rann of Kutch",
  "rates": {
   "v-x": 18500,
   "college": 19500
  },
  "sourcePage": 6,
  "duration": "5N-6D"
 },
 {
  "id": "multi-day-tour-06",
  "category": "multi-day-tour",
  "no": 6,
  "name": "Statue Of Unity - Baroda Laxmi Vilas Palace",
  "rates": {
   "v-x": 15000,
   "college": 17000
  },
  "sourcePage": 6,
  "duration": "4N-5D"
 },
 {
  "id": "multi-day-tour-07",
  "category": "multi-day-tour",
  "no": 7,
  "name": "Gir Forest & DIU Fort",
  "rates": {
   "v-x": 15000,
   "college": 17000
  },
  "sourcePage": 6,
  "duration": "4N-5D"
 },
 {
  "id": "multi-day-tour-08",
  "category": "multi-day-tour",
  "no": 8,
  "name": "HYDERABAD with Ramoji Film City",
  "rates": {
   "v-x": 16500,
   "college": 18500
  },
  "sourcePage": 6,
  "duration": "4N-5D"
 },
 {
  "id": "multi-day-tour-09",
  "category": "multi-day-tour",
  "no": 9,
  "name": "JAIPUR - The Pink City",
  "rates": {
   "v-x": 15000,
   "college": 17000
  },
  "sourcePage": 6,
  "duration": "4N-5D"
 },
 {
  "id": "multi-day-tour-10",
  "category": "multi-day-tour",
  "no": 10,
  "name": "Jaipur + Fatehpur Sikri + Agra",
  "rates": {
   "v-x": 18500,
   "college": 19500
  },
  "sourcePage": 6,
  "sourceName": "JAIPUR + Fathepur Sikhri + AGRA",
  "duration": "5N-6D"
 },
 {
  "id": "multi-day-tour-11",
  "category": "multi-day-tour",
  "no": 11,
  "name": "JAIPUR + RANTHAMBHORE TIGER RESERVE",
  "rates": {
   "v-x": 18500,
   "college": 19500
  },
  "sourcePage": 6,
  "duration": "5N-6D"
 },
 {
  "id": "multi-day-tour-12",
  "category": "multi-day-tour",
  "no": 12,
  "name": "JAIPUR + Sariska Tiger Reserve",
  "rates": {
   "v-x": 18500,
   "college": 19500
  },
  "sourcePage": 6,
  "duration": "5N-6D"
 },
 {
  "id": "multi-day-tour-13",
  "category": "multi-day-tour",
  "no": 13,
  "name": "JAIPUR + JODHPUR",
  "rates": {
   "v-x": 18500,
   "college": 19500
  },
  "sourcePage": 6,
  "duration": "5N-6D"
 },
 {
  "id": "multi-day-tour-14",
  "category": "multi-day-tour",
  "no": 14,
  "name": "JAIPUR + JODHPUR + JAISALMER",
  "rates": {
   "v-x": 22000,
   "college": 24000
  },
  "sourcePage": 6,
  "duration": "7N-8D"
 },
 {
  "id": "multi-day-tour-15",
  "category": "multi-day-tour",
  "no": 15,
  "name": "DELHI - AGRA - JAIPUR",
  "rates": {
   "v-x": 22000,
   "college": 24000
  },
  "sourcePage": 6,
  "duration": "7N-8D"
 },
 {
  "id": "multi-day-tour-16",
  "category": "multi-day-tour",
  "no": 16,
  "name": "BANGALORE - MYSORE",
  "rates": {
   "v-x": 16000,
   "college": 17500
  },
  "sourcePage": 6,
  "duration": "4N-5D"
 },
 {
  "id": "multi-day-tour-17",
  "category": "multi-day-tour",
  "no": 17,
  "name": "UDAIPUR - CHITTAURGARH FORT",
  "rates": {
   "v-x": 15000,
   "college": 17000
  },
  "sourcePage": 6,
  "duration": "4N-5D"
 },
 {
  "id": "multi-day-tour-18",
  "category": "multi-day-tour",
  "no": 18,
  "name": "INDORE - MANDU",
  "rates": {
   "v-x": 15000,
   "college": 17000
  },
  "sourcePage": 6,
  "duration": "4N-5D"
 },
 {
  "id": "multi-day-tour-19",
  "category": "multi-day-tour",
  "no": 19,
  "name": "DELHI - MANALI - AMRITSAR",
  "rates": {
   "v-x": 28000,
   "college": 30000
  },
  "sourcePage": 6,
  "duration": "8N-9D"
 },
 {
  "id": "multi-day-tour-20",
  "category": "multi-day-tour",
  "no": 20,
  "name": "DELHI - NAINITAL - JIM CORBETT NATIONAL PARK",
  "rates": {
   "v-x": 28000,
   "college": 30000
  },
  "sourcePage": 6,
  "duration": "6N-7D"
 },
 {
  "id": "multi-day-tour-21",
  "category": "multi-day-tour",
  "no": 21,
  "name": "KERALA - Cochin - Munnar - Alleppey House boat Ride (Flight)",
  "rates": {
   "v-x": 39000,
   "college": 41000
  },
  "sourcePage": 6,
  "duration": "4N-5D"
 },
 {
  "id": "multi-day-tour-22",
  "category": "multi-day-tour",
  "no": 22,
  "name": "DARJEELING - GANGTOK Sikkim (Flight)",
  "rates": {
   "v-x": 39000,
   "college": 41000
  },
  "sourcePage": 6,
  "duration": "4N-5D"
 },
 {
  "id": "multi-day-tour-23",
  "category": "multi-day-tour",
  "no": 23,
  "name": "BHUTAN - Phuentsholing Thimpu Paro (Flight)",
  "rates": {
   "v-x": 65000,
   "college": 70000
  },
  "sourcePage": 6,
  "duration": "6N-7D"
 },
 {
  "id": "multi-day-tour-24",
  "category": "multi-day-tour",
  "no": 24,
  "name": "TADOBA / PENCH National Park",
  "rates": {
   "i-x": 15000,
   "college": 17000
  },
  "sourcePage": 7,
  "duration": "4N-5D"
 },
 {
  "id": "multi-day-tour-25",
  "category": "multi-day-tour",
  "no": 25,
  "name": "HAMPI BADAMI",
  "rates": {
   "i-x": 15000,
   "college": 17000
  },
  "sourcePage": 7,
  "duration": "4N-5D"
 },
 {
  "id": "multi-day-tour-26",
  "category": "multi-day-tour",
  "no": 26,
  "name": "GWALIOR - JHANSI",
  "rates": {
   "i-x": 18500,
   "college": 19500
  },
  "sourcePage": 7,
  "duration": "5N-6D"
 },
 {
  "id": "multi-day-tour-27",
  "category": "multi-day-tour",
  "no": 27,
  "name": "AMRITSAR - DALHOUSIE - DHARAMSHALA",
  "rates": {
   "i-x": "customised",
   "college": "customised"
  },
  "sourcePage": 7,
  "duration": "6N-7D"
 },
 {
  "id": "multi-day-tour-28",
  "category": "multi-day-tour",
  "no": 28,
  "name": "NEPAL - Kathmandu Pokhra Chitwan",
  "rates": {
   "i-x": "customised",
   "college": "customised"
  },
  "sourcePage": 7,
  "duration": "6N-7D"
 },
 {
  "id": "multi-day-tour-29",
  "category": "multi-day-tour",
  "no": 29,
  "name": "KASHMIR - Srinagar Gulmarg Sonmarg Pahalgam (Flight)",
  "rates": {
   "i-x": 65000,
   "college": 65000
  },
  "sourcePage": 7,
  "duration": "5N-6D"
 },
 {
  "id": "multi-day-tour-30",
  "category": "multi-day-tour",
  "no": 30,
  "name": "THAILAND - Bangkok & Pattaya (Flight)",
  "rates": {
   "i-x": 75000,
   "college": 75000
  },
  "sourcePage": 7,
  "duration": "5N-6D"
 },
 {
  "id": "multi-day-tour-31",
  "category": "multi-day-tour",
  "no": 31,
  "name": "SINGAPORE with UNIVERSAL & SENTOSA (Flight)",
  "rates": {
   "i-x": 120000,
   "college": 120000
  },
  "sourcePage": 7,
  "duration": "4N-5D"
 },
 {
  "id": "multi-day-tour-32",
  "category": "multi-day-tour",
  "no": 32,
  "name": "MALAYSIA with GENTING (Flight)",
  "rates": {
   "i-x": 89000,
   "college": 89000
  },
  "sourcePage": 7,
  "duration": "4N-5D"
 },
 {
  "id": "multi-day-tour-33",
  "category": "multi-day-tour",
  "no": 33,
  "name": "DUBAI - ABU DHABI",
  "rates": {
   "i-x": 98000,
   "college": 98000
  },
  "sourcePage": 7,
  "duration": "5N-6D"
 },
 {
  "id": "multi-day-tour-34",
  "category": "multi-day-tour",
  "no": 34,
  "name": "Hong Kong - Macau - Shenzhen",
  "rates": {
   "i-x": 146000,
   "college": 146000
  },
  "sourcePage": 7,
  "sourceName": "HONG KONG - MACAU - SCHENZEN",
  "duration": "7N-8D"
 },
 {
  "id": "multi-day-tour-35",
  "category": "multi-day-tour",
  "no": 35,
  "name": "JAPAN",
  "rates": {
   "i-x": 250000,
   "college": 250000
  },
  "sourcePage": 7,
  "duration": "8N-9D"
 }
]
