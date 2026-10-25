// ONE place for contact details. Read from the business flyers: confirm every digit before launch.
export const CONFIG = {
  name: 'Memories Unlimited Tours & Travels',
  phones: ['7506040841', '8226822688'],
  whatsapp: '8226822688',
  email: 'memoriesunlimit@gmail.com',
  // Where the enquiry form delivers its email (sent by the free FormSubmit service, see README).
  enquiryEmail: 'faisalahmadshaikh0@gmail.com',
  address: 'Shop No. 2, Building 5B, H&M Royal Society, Opposite Talab Factory, Kondhwa Main Road, Kondhwa Khurd, Pune, Maharashtra 411048',
  // Google Maps listing, as copied from Google Maps (tracking parameters removed).
  mapsListing: 'Memories Unlimited Tours & Travels, Shop no.2 Bldg no.5B, H&M Royal, opp. Talab Factory, Kondhwa, Pune, Maharashtra 411048',
  mapsUrl: 'https://www.google.com/maps/place/Memories+Unlimited+Tours+%26+Travels/@18.461699,73.8343298,13z/data=!4m22!1m15!4m14!1m6!1m2!1s0x3bc2eb67c5352e67:0x611fa3ab9c15ebba!2sMemories+Unlimited+Tours+%26+Travels,+Shop+no.2+Bldg+no.5B,+H%26M+Royal,+opp.+Talab+Factory,+Kondhwa,+Pune,+Maharashtra+411048!2m2!1d73.8915218!2d18.4617077!1m6!1m2!1s0x3bc2eb67c5352e67:0x611fa3ab9c15ebba!2sMemories+Unlimited+Tours+%26+Travels,+Shop+no.2+Bldg+no.5B,+H%26M+Royal,+opp.+Talab+Factory,+Kondhwa,+Pune,+Maharashtra+411048!2m2!1d73.8915218!2d18.4617077!3m5!1s0x3bc2eb67c5352e67:0x611fa3ab9c15ebba!8m2!3d18.4617077!4d73.8915218!16s%2Fg%2F11hzqg6pfh',
}
export const hasAddress = !/^PLACEHOLDER/.test(CONFIG.address)

// Phone numbers: stored as 10 digits, shown as "+91 75060 40841", dialled as "+917506040841".
const ten = p => String(p).replace(/\D/g, '').slice(-10)
export const fmtPhone = p => { const d = ten(p); return `+91 ${d.slice(0, 5)} ${d.slice(5)}` }
export const telHref = p => `tel:+91${ten(p)}`

// WhatsApp: wa.me opens the WhatsApp app on phones and WhatsApp Web / Desktop on computers.
export const WA_HELLO = 'Hello Memories Unlimited! I found your website and would like to plan a school trip. Could you please share the tour options, prices and available dates?'
export const waLink = (text = WA_HELLO) => `https://wa.me/91${ten(CONFIG.whatsapp)}?text=${encodeURIComponent(text)}`

// Directions: no starting point is set, so Google Maps uses the visitor's own location.
// (Opens the Google Maps app on phones.)
export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CONFIG.mapsListing)}&travelmode=driving`
