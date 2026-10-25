// ONE place for the trust facts shown on the home page and the route pages.
// Founded 2013 (owner). "Thousands", own coaches and good hotels are the owner's statements.
// To show a real counter for students, set STUDENTS to the owner's confirmed number (for example 5000): it then counts up as "5,000+".
export const FOUNDED = 2013
export const YEARS = new Date().getFullYear() - FOUNDED
// Owner / proprietor and his industry experience, as stated by the owner's side (shown in "Our story" on the home and About pages).
export const OWNER = 'Jerwan Battiwala'
export const EXPERIENCE = '18+'
export const STUDENTS = null
// Turn this on only after the owner has checked the live Justdial / Google listing.
export const SHOW_RATING = false
export const RATING = '4.9'
export const TRUST = [
  { icon: 'calendar', value: YEARS, suffix: '', label: 'years of school trips', sub: 'Since ' + FOUNDED, bg: '#ffc83d', ink: '#0f2a73' },
  STUDENTS ? { icon: 'people', value: STUDENTS, suffix: '+', label: 'happy students', sub: 'Trusted by schools', bg: '#0a7bbd', ink: '#fff' }
           : { icon: 'people', big: 'Thousands', label: 'of happy students', sub: 'Trusted by schools', bg: '#0a7bbd', ink: '#fff' },
  { icon: 'pin', value: 2, suffix: '', label: 'cities: Pune and Mumbai', sub: 'Office in Kondhwa, Pune', bg: '#d6402c', ink: '#fff' },
  { icon: 'bus', big: 'Own coaches', label: 'Personal buses and vehicles', sub: 'For every group size', bg: '#1f7a33', ink: '#fff' },
  { icon: 'hotel', big: 'Good hotels', label: 'Comfortable, chosen stays', sub: 'On multi-day tours', bg: '#6d3fc0', ink: '#fff' },
  ...(SHOW_RATING ? [{ icon: 'star', value: Number(RATING), decimals: 1, suffix: '/5', label: 'on customer reviews', sub: 'Justdial and Facebook', bg: '#0a7bbd', ink: '#fff' }] : []),
]
