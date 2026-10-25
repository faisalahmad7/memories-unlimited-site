import { CONFIG, fmtPhone, telHref, waLink, DIRECTIONS_URL, hasAddress } from '../site.config.js'
import { CREDITS } from '../photoCredits.js'
import { PageShell, Hero, Section, Pillars, CtaBand, WaButton, Art, TrustRibbon, useTitle, useDestPhotos } from './ui.jsx'
import { Icon } from '../icons.jsx'
import { YEARS, FOUNDED, OWNER, EXPERIENCE } from '../trust.js'

// Statements on these pages come from the owner (trip details, own coaches, good hotels, Pune and Mumbai, thousands of travellers),
// the printed 2026-27 rates, or src/site.config.js and src/trust.js. Do not add numbers the owner has not confirmed.

const ext = { target: '_blank', rel: 'noopener noreferrer' }
const Out = () => <span className="sr-only"> (opens in a new tab)</span>

/* ---------- About: story, trust ribbon, a photo beside each kind of trip ---------- */
const ABOUT_PHOTO = { 'one-day-trips': 'mahabaleshwar', educational: 'h-sinhagad', edutainment: 'imagicaa', camping: 'h-lonavala', domestic: 'jaipur', international: 'singapore' }
export function About() {
  useTitle('About us')
  const photos = useDestPhotos(['page-about', 'h-pune', 'h-shaniwar'])
  const kp = useDestPhotos(Object.values(ABOUT_PHOTO))
  const shot = id => kp.find(p => p.id === id)?.list?.[0]
  const rows = [
    ['One-day picnics', 'Resorts, parks, water parks and agro-tourism farms for a full school day out.', '/tours/one-day-trips', 'green', 'one-day-trips'],
    ['Educational field trips', 'Museums, factories, forts and science centres, planned as a day visit.', '/tours/educational', 'blue', 'educational'],
    ['Edutainment days', 'A learning visit and a park or resort combined in one day.', '/tours/edutainment', 'coral', 'edutainment'],
    ['Camping and overnight trips', 'Adventure camps and overnight trips, from one night to a few days.', '/tours/camping', 'sky', 'camping'],
    ['Tours in India', 'Multi-day group journeys across India, with good hotels along the way.', '/tours/domestic', 'gold', 'domestic'],
    ['Tours abroad', 'Group journeys by flight, with visas included.', '/tours/international', 'navy', 'international'],
  ]
  return (
    <PageShell theme="sky">
      <Hero variant="split" motif="bus" title="Planning school trips from Pune and Mumbai" tagline={`Since ${FOUNDED}, trusted by thousands of students and parents.`} photos={photos}
        lead="We are a tour and travel company that plans school picnics, educational field trips, camps and longer tours for schools and groups."
        chips={['Learning beyond the classroom', 'Our own coaches', 'Good hotels']} art={<Art.Flag />}
        actions={<><WaButton text="Hello Memories Unlimited! I would like to plan a school trip.">Plan a trip with us</WaButton><a className="pg-btn ghost on-dark" href="/tours">See our trips</a></>} />
      <TrustRibbon />
      <Section title="Our story" lead={`Memories Unlimited Tours & Travels was established in ${FOUNDED} by ${OWNER}, owner and proprietor, and is based in Kondhwa Khurd, Pune. We also plan trips from Mumbai.`}>
        <p className="story">Founded by {OWNER}, who brings {EXPERIENCE} years of industry experience across operations, the company has been planning school trips since {FOUNDED}.</p>
        <p className="story">In {YEARS} years we have planned personalised itineraries for schools, colleges and groups, from a single-day picnic to a tour abroad. Thousands of students have travelled with us, and their parents have trusted us with their care. We travel in our own coaches and vehicles, and stay in good hotels on longer tours.</p>
      </Section>
      <Section tone="soft" title="What we plan" lead="Pick a kind of trip to see every place we plan in that group.">
        <ul className="alt">
          {rows.map(([t, d, h, th, k], i) => { const ph = shot(ABOUT_PHOTO[k]); return (
            <li key={t} className={'alt-row th-' + th + (i % 2 ? ' flip' : '')}>
              <div className="alt-photo" style={ph ? { backgroundImage: `url(${ph.src})` } : undefined} role="img" aria-label={ph ? t : undefined} aria-hidden={ph ? undefined : 'true'} />
              <div><h3>{t}</h3><p>{d}</p><a className="pg-btn ghost" href={h}>See these trips</a></div>
            </li>) })}
        </ul>
      </Section>
      <Section title="More than trips" lead="Beyond school groups, you can ask us about flights, hotel bookings, visa assistance and holiday packages.">
        <Pillars items={[['Our own coaches', 'Personal buses and vehicles for school groups.', 'Coaches'], ['Good hotels', 'Comfortable, carefully chosen stays on multi-day tours.', 'Hotels'], ['Flights and visas', 'Ask us about flights, hotel bookings and visa assistance.', 'Travel'], ['Custom packages', 'Tell us where you want to go and we will say what we can arrange.', 'Custom']]} />
      </Section>
      <CtaBand title="Let us plan your next school trip" />
    </PageShell>
  )
}

/* ---------- Safety: one word, an elegant line, then what parents want to know ---------- */
const PLEDGE = [
  ['shield', 'A trip leader on every coach', 'An experienced trip leader who knows basic first aid travels with your group on our one-day picnics and multi-day tours.'],
  ['bus', 'Our own coaches and vehicles', 'We provide personal buses and vehicles for school groups, so your children travel together with a driver and leader we know.'],
  ['people', 'Staff travel with the children', 'One teacher or staff member travels free for every 20 students, so your own staff can be with the group throughout.'],
  ['pin', 'Hygienic meals and clean water', 'Hygienic meals and drinking water are provided throughout one-day picnics and multi-day tours.'],
  ['hotel', 'Good hotels on longer tours', 'Multi-day tours include comfortable, carefully chosen hotels.'],
  ['compass', 'Answers before you book', 'Medical needs, allergies, food preferences: tell us and we will talk it through before the trip is confirmed.'],
]
export function Safety() {
  useTitle('Safety')
  const photos = useDestPhotos(['page-safety'])
  return (
    <PageShell theme="navy">
      <Hero variant="split" motif="safety" title="Safety" tagline="Careful planning, experienced trip leaders and our own coaches, so every parent can trust the journey."
        photos={photos} art={<Art.Shield />} chips={['Trip leader on every coach', 'Our own coaches', 'Hygienic meals and drinking water']}
        actions={<><WaButton text="Hello Memories Unlimited! I have a question about student safety and care on a trip.">Ask us a question</WaButton><a className="pg-btn ghost on-dark" href="#care">See how we care</a></>} />
      <TrustRibbon />
      <Section id="care" title="How we look after every group" lead="Thousands of students have travelled with us. These are the things we put in place on every trip.">
        <ul className="pledge">
          {PLEDGE.map(([ic, t, d]) => <li key={t}><span className="pl-ic"><Icon n={ic} size={28} /></span><h3>{t}</h3><p>{d}</p></li>)}
        </ul>
      </Section>
      <Section tone="soft" id="panels" title="What each kind of trip includes" lead="Packages differ, so please ask what applies to your group.">
        <div className="panels">
          <article className="panel th-green"><h3>One-day picnics</h3><ul>
            <li>Luxury coach, with all safety and RTO norms followed</li>
            <li>Experienced trip leader on every coach, with basic first aid knowledge</li>
            <li>Hygienic meals and drinking water throughout the trip</li>
            <li>One teacher or staff member free for every 20 students</li></ul></article>
          <article className="panel th-gold"><h3>Multi-day tours</h3><ul>
            <li>Travel by AC train, flights or buses, as per the tour</li>
            <li>Experienced trip leader on every coach, with basic first aid knowledge</li>
            <li>Hygienic meals and drinking water throughout the trip</li>
            <li>Good hotels for the nights</li>
            <li>Visas included on international tours</li></ul></article>
          <article className="panel th-sky"><h3>Field trips, edutainment and camps</h3><p>Arrangements depend on the trip and the place. Tell us your plan and we will confirm exactly what applies before you book.</p></article>
        </div>
      </Section>
      <Section title="Tell us before you book" lead="The more we know about your group, the better we can plan the day.">
        <ul className="checks">
          {['Medical needs of any student', 'Allergies and food preferences', 'How many teachers and staff are travelling', 'The age or class of the students', 'Anything you would like a trip leader to know'].map(t => <li key={t}>{t}</li>)}
        </ul>
        <p className="sec-lead">We will talk it through with you.</p>
      </Section>
      <CtaBand title="Have a question about your group?" text="Message us and we will answer before you decide." wa="Hello Memories Unlimited! I have a question about student safety and care on a trip." />
    </PageShell>
  )
}

/* ---------- FAQs: one word, an elegant line, topic menu on the left, grouped questions ---------- */
const FAQ = [
  ['Booking and quotes', [
    ['How do I request a quote?', `Message us on WhatsApp, call ${fmtPhone(CONFIG.phones[0])}, or use the enquiry form on our home page. Share your school, class, number of students and preferred month, and we will reply with options and a quote.`],
    ['What is the minimum group size?', 'Our rates are designed for groups of at least 40 payable students. For a smaller group, please message us to discuss it.'],
    ['Do teachers and staff pay?', 'One teacher or staff member travels free for every 20 students.'],
    ['Is GST extra?', 'Yes. 5% GST is applicable on the total billing.'],
    ['Can I see your rate card?', 'Rates depend on the destination, the class and the size of your group. Message us and we will share our current rate card along with a quote for your group.'],
  ]],
  ['One-day trips', [
    ['Where do one-day trips start from?', 'Our one-day picnic rates cover the Pune and PCMC region and include transport. We plan from both Pune and Mumbai, so let us know where your school is.'],
    ['What is included in a one-day picnic?', 'Transport, entry with activities, breakfast, lunch and an evening snack, with hygienic meals and drinking water throughout the trip.'],
    ['What is the difference between a field trip, an edutainment day and a picnic?', 'A field trip is a learning visit, such as a museum, factory or fort. An edutainment day combines a learning visit with a park or resort. A picnic is a day at a resort or park.'],
  ]],
  ['Tours and custom trips', [
    ['Do you work in Mumbai as well as Pune?', 'Yes. We are based in Pune and also work from Mumbai, so we can plan trips for schools in both cities.'],
    ['Do you offer trips beyond Maharashtra?', 'Yes. We run overnight camps and multi-day tours across India, and international tours by flight. Browse our trips to see the places we plan.'],
    ['Can you plan a trip that is not listed?', 'Yes, many of our tours are planned as customised trips. Tell us where you want to go and we will tell you what we can arrange.'],
    ['Are visas included on international tours?', 'Yes. Visas are included with transport on our international tours.'],
  ]],
  ['Care and travel', [
    ['Who travels with the students?', 'An experienced trip leader who knows basic first aid travels on every coach on our one-day picnics and multi-day tours, together with your own teachers and staff.'],
    ['What vehicles do you use?', 'We provide our own buses and vehicles for school groups.'],
    ['What are the hotels like on multi-day tours?', 'We book good, comfortable hotels for the nights of a multi-day tour. Tell us your preferences and we will share the stays planned for your group.'],
    ['Are the meals hygienic?', 'Yes. Hygienic meals and drinking water are provided throughout one-day picnics and multi-day tours.'],
  ]],
  ['About us', [
    ['How long have you been planning school trips?', `We have been planning school trips since ${FOUNDED}. Over ${YEARS} years we have built our experience around one thing: safe, well-organised and memorable journeys for students, so that schools and parents can rely on us from the first enquiry to the journey home.`],
  ]],
]
const slug = s => s.toLowerCase().replace(/[^a-z]+/g, '-')
export function Faqs() {
  useTitle('FAQs')
  const photos = useDestPhotos(['page-faqs'])
  return (
    <PageShell theme="coral">
      <Hero variant="split" motif="faq" title="FAQs" tagline="Clear answers on booking, travel and student care, from a team that has planned school trips since 2013."
        photos={photos} art={<Art.Question />}
        actions={<WaButton text="Hello Memories Unlimited! I have a question about a school trip.">Ask us on WhatsApp</WaButton>} />
      <Section>
        <div className="faq-layout">
          <nav className="faq-menu" aria-label="Question topics"><strong>Topics</strong>{FAQ.map(([g]) => <a key={g} href={'#' + slug(g)}>{g}</a>)}</nav>
          <div className="faq-groups">
            {FAQ.map(([g, qs]) => (
              <section key={g} id={slug(g)} className="faq-group"><h2>{g}</h2>
                <div className="pg-faq">{qs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
              </section>
            ))}
          </div>
        </div>
      </Section>
      <CtaBand title="Still have a question?" text="Send us a message and we will reply." wa="Hello Memories Unlimited! I have a question about a school trip." />
    </PageShell>
  )
}

/* ---------- Contact: cards per way to reach us ---------- */
export function Contact() {
  useTitle('Contact us')
  const photos = useDestPhotos(['page-contact', 'h-pune', 'h-shaniwar'])
  return (
    <PageShell theme="gold">
      <Hero variant="split" motif="chat" title="Talk to us" tagline="Based in Pune, planning trips for schools in Pune and Mumbai." photos={photos} lead="The quickest way to reach us is WhatsApp or a call." art={<Art.Phone />}
        actions={<><WaButton text="Hello Memories Unlimited! I would like to plan a school trip.">Message on WhatsApp</WaButton><a className="pg-btn ghost on-dark" href="/#enquire">Send an enquiry online</a></>} />
      <Section title="Ways to reach us">
        <ul className="ccards">
          <li className="ccard"><h3>Call</h3>{CONFIG.phones.map(p => <a key={p} href={telHref(p)}>{fmtPhone(p)}</a>)}</li>
          <li className="ccard"><h3>WhatsApp</h3><a href={waLink()} {...ext}>{fmtPhone(CONFIG.whatsapp)}<Out /></a></li>
          <li className="ccard"><h3>Email</h3><a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a></li>
          {hasAddress && <li className="ccard wide"><h3>Visit us in Pune</h3><p>{CONFIG.address}</p><p>We also plan trips for schools in Mumbai. Message us and tell us where your school is.</p><p><a className="pg-btn" href={DIRECTIONS_URL} {...ext}>Get directions<Out /></a><a className="pg-btn ghost" href={CONFIG.mapsUrl} {...ext}>Open in Google Maps<Out /></a></p></li>}
        </ul>
      </Section>
      <CtaBand title="Prefer to write it down?" text="Use the enquiry form on the home page and tell us about your trip." />
    </PageShell>
  )
}

/* ---------- Credits ---------- */
export function Credits() {
  useTitle('Photo credits')
  const need = CREDITS.filter(c => c.creditRequired), free = CREDITS.length - need.length
  const photos = useDestPhotos(['h-pune', 'h-shaniwar'])
  return (
    <PageShell theme="blue">
      <Hero variant="center" photos={photos} title="Photo credits" lead="Destination photos on this site come from Wikimedia Commons. Thank you to the photographers." art={<Art.Camera />} />
      <Section>
        {CREDITS.length === 0 ? <p>Credits will be listed here once the photos are installed.</p> : (
          <>
            {free > 0 && <p>{free} photos are in the public domain or CC0 and need no credit.</p>}
            <ul className="credit-list">{need.map(c => <li key={c.file}>{c.dest}: <a href={c.page} {...ext}>{c.file.replace(/^File:/, '')}<Out /></a> by {c.author}, {c.license}</li>)}</ul>
          </>
        )}
        <p>Animation components by React Bits (MIT with Commons Clause).</p>
      </Section>
    </PageShell>
  )
}
