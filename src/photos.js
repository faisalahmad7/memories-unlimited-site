
const SHOW = 8;

export const GALLERY = {
  singapore: {
    label: 'Singapore',
    note: 'Places named on our Singapore flyer.',
    q: [
      ['Merlion Park Singapore', 'Merlion Park'],
      ['Marina Bay Sands', 'Marina Bay Sands'],
      ['Gardens by the Bay', 'Gardens by the Bay'],
      ['Universal Studios Singapore', 'Universal Studios'],
      ['Singapore Flyer', 'Singapore Flyer'],
      ['Sentosa Singapore', 'Sentosa'],
      ['S.E.A. Aquarium Sentosa', 'S.E.A. Aquarium'],
      ['Orchard Road Singapore', 'Orchard Road'],
    ],
  },
  hampi: {
    label: 'Hampi',
    note: 'Places named on our Hampi flyer.',
    q: [
      ['Virupaksha Temple Hampi', 'Virupaksha Temple'],
      ['Vittala Temple Hampi stone chariot', 'Vittala Temple'],
      ['Lotus Mahal Hampi', 'Lotus Mahal'],
      ['Elephant stables Hampi', 'Elephant Stable'],
      ["Queen's Bath Hampi", "Queen's Bath"],
      ['Hemakuta Hill Hampi', 'Hemakuta Hill'],
      ['Tungabhadra River Hampi', 'Tungabhadra River'],
      ['Hampi ruins', 'Hampi'],
    ],
  },
  jaipur: {
    label: 'Jaipur, Fatehpur Sikri, Agra',
    note: 'Places named on our flyer, plus nearby landmarks.',
    q: [
      ['Hawa Mahal Jaipur', 'Hawa Mahal'],
      ['Amer Fort Jaipur', 'Amer Fort'],
      ['City Palace Jaipur', 'City Palace'],
      ['Fatehpur Sikri', 'Fatehpur Sikri'],
      ['Buland Darwaza Fatehpur Sikri', 'Buland Darwaza'],
      ['Taj Mahal Agra', 'Taj Mahal'],
      ['Agra Fort', 'Agra Fort'],
      ['Jantar Mantar Jaipur', 'Jantar Mantar'],
    ],
  },
  ahmedabad: {
    label: 'Ahmedabad',
    note: 'Places named on our Ahmedabad flyer.',
    q: [
      ['Sabarmati Riverfront Ahmedabad', 'Sabarmati Riverfront'],
      ['Jama Masjid Ahmedabad', 'Jama Masjid'],
      ['Adalaj Stepwell', 'Adalaj Stepwell'],
      ['Sabarmati Ashram', 'Sabarmati Ashram'],
      ['Calico Museum of Textiles', 'Calico Museum'],
      ['Gujarat Science City', 'Science City'],
      ['Sidi Saiyyed Mosque jali', 'Sidi Saiyyed Mosque'],
      ['Ahmedabad', 'Ahmedabad'],
    ],
  },
  mahabaleshwar: {
    label: 'Mahabaleshwar',
    note: 'Places in and around Mahabaleshwar, the setting of our picnic.',
    q: [
      ['Venna Lake Mahabaleshwar', 'Venna Lake'],
      ['Mahabaleshwar', 'Mahabaleshwar'],
      ["Arthur's Seat Mahabaleshwar", "Arthur's Seat"],
      ['Pratapgad fort', 'Pratapgad'],
      ['Mapro Garden Panchgani', 'Mapro Garden'],
      ['Panchgani table land', 'Panchgani'],
      ['Lingmala waterfall Mahabaleshwar', 'Lingmala Waterfall'],
      ['Krishna river Mahabaleshwar', 'Krishna River'],
    ],
  },
  imagicaa: {
    label: 'Imagicaa',
    note: 'Theme park trip. Not a confirmed itinerary: ask us what we can plan.',
    q: [
      ['Imagicaa theme park Khopoli', 'Imagicaa'],
      ['Adlabs Imagica', 'Imagicaa'],
      ['Imagica water park Khopoli', 'Imagicaa water park'],
      ['Imagica Mumbai theme park rides', 'Imagicaa rides'],
      ['Khopoli Maharashtra', 'Khopoli'],
    ],
  },
  goa: {
    label: 'Goa',
    note: 'Popular places in Goa. Not a confirmed itinerary: ask us what we can plan.',
    q: [
      ['Palolem Beach', 'Palolem Beach'],
      ['Calangute Beach', 'Calangute'],
      ['Fort Aguada', 'Fort Aguada'],
      ['Basilica of Bom Jesus', 'Basilica of Bom Jesus'],
      ['Dudhsagar Falls', 'Dudhsagar Falls'],
      ['Baga Beach Goa', 'Baga Beach'],
      ['Se Cathedral Old Goa', 'Se Cathedral'],
      ['Chapora Fort', 'Chapora Fort'],
    ],
  },
  manali: {
    label: 'Manali',
    note: 'Popular places near Manali. Not a confirmed itinerary: ask us what we can plan.',
    q: [
      ['Solang Valley', 'Solang Valley'],
      ['Rohtang Pass', 'Rohtang Pass'],
      ['Hadimba Devi Temple', 'Hadimba Temple'],
      ['Manali Himachal Pradesh', 'Manali'],
      ['Beas River Manali', 'Beas River'],
      ['Atal Tunnel Rohtang', 'Atal Tunnel'],
      ['Jogini Falls Manali', 'Jogini Falls'],
      ['Old Manali', 'Old Manali'],
    ],
  },
  kerala: {
    label: 'Kerala',
    note: 'Popular places in Kerala. Not a confirmed itinerary: ask us what we can plan.',
    q: [
      ['Kerala backwaters houseboat', 'Kerala backwaters'],
      ['Munnar tea plantation', 'Munnar'],
      ['Periyar National Park', 'Periyar'],
      ['Kovalam beach', 'Kovalam'],
      ['Alleppey backwaters', 'Alleppey'],
      ['Athirappilly Falls', 'Athirappilly Falls'],
      ['Varkala cliff beach', 'Varkala'],
      ['Fort Kochi Chinese fishing nets', 'Fort Kochi'],
    ],
  },
};

export async function loadPhotos(onEach) {
  const result = {};

  for (const [destination, details] of Object.entries(GALLERY)) {
    const count = Math.min(details.q.length, SHOW);

    result[destination] = Array.from({ length: count }, (_, index) => ({
      src: `/images/gallery/${destination}/${String(index + 1).padStart(2, '0')}.webp`,
      file: `${destination}-${String(index + 1).padStart(2, '0')}`,
      cap: details.q[index][1],
    }));
  }

  onEach?.(result);
  return result;
}
