/** Static content migrated from the original Pamoja Africa V site */

export interface Speaker {
  name: string;
  role: string;
  country: string;
  date: string;
  bg: string;
  fg: string;
  photo: string | null;
}

export interface AgendaSession {
  time: string;
  title: string;
  venue: string;
  type: string;
  speaker?: string;
}

export interface AgendaDay {
  date: string;
  weekday: string;
  label: string;
  tagline: string;
  sessions: AgendaSession[];
}

export interface AgendaConf {
  label: string;
  sub: string;
  color: string;
  days: AgendaDay[];
}

export interface HistoryItem {
  year: string;
  label: string;
  place: string;
  delegates: string;
  caption: string;
  image: string;
  upcoming?: boolean;
}

export interface FAQItem {
  q: string;
  a: string;
}

export const speakers: Speaker[] = [
  { name: "Dr. Samuel Mwangi", role: "Keynote speaker", country: "Kenya", date: "Dec 27", bg: "#EA7F1D", fg: "#FFF6EA", photo: "/assets/speaker1.png" },
  { name: "Pst. Marco Oliveira", role: "Plenary — Arise", country: "Mozambique", date: "Dec 28", bg: "#22350A", fg: "#8DCF3D", photo: "/assets/speaker2.png" },
  { name: "Rev. David Okafor", role: "Plenary — Shine", country: "Nigeria", date: "Dec 29", bg: "#8DCF3D", fg: "#22350A", photo: "/assets/speaker3.png" },
  { name: "Dr. Emmanuel Adisa", role: "Plenary — Go", country: "Ghana", date: "Jan 1", bg: "#C2410C", fg: "#FFF6EA", photo: "/assets/speaker4.png" },
  { name: "Bp. Joseph Kamau", role: "Evening worship & Closing", country: "Tanzania", date: "Dec 28 & Jan 2", bg: "#0A1002", fg: "#EEFFD7", photo: "/assets/speaker5.png" },
  { name: "To be announced", role: "Closing keynote", country: "Continental", date: "Jan 2", bg: "#5C8727", fg: "#EEFFD7", photo: null },
];

export const agenda: Record<string, AgendaConf> = {
  pamoja: {
    label: "Pamoja Conference",
    sub: "7 days — Students, young professionals, church leaders",
    color: "#8DCF3D",
    days: [
      { date: "Dec 27", weekday: "Sun", label: "Day 01", tagline: "Arrival & Opening", sessions: [
        { time: "09:00 – 17:00", title: "Registration & check-in", venue: "AACC Main atrium", type: "Logistics" },
        { time: "14:00 – 16:00", title: "Delegate orientation", venue: "Hall A", type: "Plenary", speaker: "Organizing committee" },
        { time: "18:30 – 20:00", title: "Opening ceremony — \"Arise Africa\"", venue: "Main auditorium", type: "Plenary", speaker: "Dr. Samuel Mwangi" },
        { time: "20:30 – 22:00", title: "Welcome reception", venue: "Outdoor courtyard", type: "Fellowship" },
      ]},
      { date: "Dec 28", weekday: "Mon", label: "Day 02", tagline: "Arise — A Spirit-filled life", sessions: [
        { time: "07:00 – 08:30", title: "Morning devotion & prayer", venue: "Chapel", type: "Worship" },
        { time: "09:00 – 10:30", title: "Plenary 01 — Arise from within", venue: "Main auditorium", type: "Plenary", speaker: "Pst. Marco Oliveira" },
        { time: "11:00 – 12:30", title: "Breakout tracks (choose one of 8)", venue: "Halls B – I", type: "Workshop" },
        { time: "14:00 – 15:30", title: "Bible engagement lab", venue: "Hall B", type: "Workshop", speaker: "Team GCM Ethiopia" },
        { time: "16:00 – 17:30", title: "Regional huddles — East / West / North / South", venue: "Rooms 201 – 204", type: "Discussion" },
        { time: "19:00 – 20:30", title: "Evening worship night", venue: "Main auditorium", type: "Worship", speaker: "Bp. Joseph Kamau" },
      ]},
      { date: "Dec 29", weekday: "Tue", label: "Day 03", tagline: "Shine — Integrity & calling", sessions: [
        { time: "07:00 – 08:30", title: "Morning devotion", venue: "Chapel", type: "Worship" },
        { time: "09:00 – 10:30", title: "Plenary 02 — Shine where you are", venue: "Main auditorium", type: "Plenary", speaker: "Rev. David Okafor" },
        { time: "11:00 – 12:30", title: "Marketplace & digital missions panel", venue: "Hall A", type: "Panel" },
        { time: "14:00 – 17:00", title: "Tracks — Leadership / Campus / Digital / Marketplace", venue: "Halls B – I", type: "Workshop" },
        { time: "19:00 – 20:30", title: "Cultural night — Africa showcase", venue: "Outdoor stage", type: "Cultural" },
      ]},
      { date: "Dec 30", weekday: "Wed", label: "Day 04", tagline: "Go — Cousin engagement", sessions: [
        { time: "07:00 – 08:30", title: "Morning devotion", venue: "Chapel", type: "Worship" },
        { time: "09:00 – 10:30", title: "Plenary 03 — Go to the cousins", venue: "Main auditorium", type: "Plenary", speaker: "Dr. Emmanuel Adisa" },
        { time: "11:00 – 12:30", title: "Cousin-engagement strategy workshop", venue: "Hall A", type: "Workshop" },
        { time: "14:00 – 17:00", title: "Prayer walk — Addis city", venue: "Meet at lobby", type: "Mission" },
        { time: "19:00 – 20:30", title: "Testimony night", venue: "Main auditorium", type: "Fellowship" },
      ]},
      { date: "Dec 31", weekday: "Thu", label: "Day 05", tagline: "Movement multiplication", sessions: [
        { time: "07:00 – 08:30", title: "Morning devotion", venue: "Chapel", type: "Worship" },
        { time: "09:00 – 12:30", title: "Movement-building intensive", venue: "Hall A", type: "Workshop" },
        { time: "14:00 – 17:00", title: "Country-team planning sessions", venue: "Rooms 201 – 210", type: "Discussion" },
        { time: "21:00 – 00:30", title: "Year-end watchnight service", venue: "Main auditorium", type: "Worship" },
      ]},
      { date: "Jan 1", weekday: "Fri", label: "Day 06", tagline: "Collaboration & partnerships", sessions: [
        { time: "09:00 – 10:30", title: "New Year plenary — A new generation", venue: "Main auditorium", type: "Plenary" },
        { time: "11:00 – 12:30", title: "Continental collaboration forum", venue: "Hall A", type: "Panel" },
        { time: "14:00 – 17:00", title: "Commissioning prep & pledges", venue: "Hall B", type: "Workshop" },
        { time: "19:00 – 20:30", title: "Gala banquet", venue: "Grand ballroom", type: "Fellowship" },
      ]},
      { date: "Jan 2", weekday: "Sat", label: "Day 07", tagline: "Commissioning & departure", sessions: [
        { time: "08:00 – 10:00", title: "Closing plenary — Go", venue: "Main auditorium", type: "Plenary", speaker: "Bp. Joseph Kamau" },
        { time: "10:30 – 12:00", title: "Commissioning service", venue: "Main auditorium", type: "Worship" },
        { time: "12:00 – 15:00", title: "Lunch & farewell", venue: "Courtyard", type: "Fellowship" },
        { time: "15:00 onwards", title: "Delegate departures — Staff check-in opens", venue: "Main atrium", type: "Logistics" },
      ]},
    ],
  },
  staff: {
    label: "Staff Conference",
    sub: "5 days — Staff, associate staff, interns & families",
    color: "#EA7F1D",
    days: [
      { date: "Jan 2", weekday: "Sat", label: "Day 01", tagline: "Arrival & welcome", sessions: [
        { time: "15:00 – 18:00", title: "Staff registration & housing", venue: "Main atrium", type: "Logistics" },
        { time: "19:00 – 20:30", title: "Welcome dinner", venue: "Grand ballroom", type: "Fellowship" },
      ]},
      { date: "Jan 3", weekday: "Sun", label: "Day 02", tagline: "Renewal — The leader's inner life", sessions: [
        { time: "07:30 – 08:30", title: "Staff worship & prayer", venue: "Chapel", type: "Worship" },
        { time: "09:00 – 10:30", title: "Opening plenary — Renewal", venue: "Main auditorium", type: "Plenary", speaker: "AACC leadership" },
        { time: "11:00 – 12:30", title: "Marriage & family track / Singles track", venue: "Parallel halls", type: "Track" },
        { time: "14:00 – 17:00", title: "Team building — national groups", venue: "Breakout rooms", type: "Discussion" },
        { time: "19:00 – 20:30", title: "Prayer & communion", venue: "Main auditorium", type: "Worship" },
      ]},
      { date: "Jan 4", weekday: "Mon", label: "Day 03", tagline: "Vision-casting for 2028", sessions: [
        { time: "07:30 – 08:30", title: "Staff worship", venue: "Chapel", type: "Worship" },
        { time: "09:00 – 12:30", title: "Vision-casting intensive — 2028 plan", venue: "Hall A", type: "Plenary" },
        { time: "14:00 – 17:00", title: "Department breakouts — LS / Digital / Campus / Marketplace", venue: "Halls B – E", type: "Workshop" },
        { time: "19:00 – 20:30", title: "Staff family night", venue: "Outdoor courtyard", type: "Family" },
      ]},
      { date: "Jan 5", weekday: "Tue", label: "Day 04", tagline: "Equipping & appointments", sessions: [
        { time: "07:30 – 08:30", title: "Staff worship", venue: "Chapel", type: "Worship" },
        { time: "09:00 – 12:30", title: "Equipping workshops — leadership, coaching, fundraising", venue: "Halls B – E", type: "Workshop" },
        { time: "14:00 – 17:00", title: "Staff appointment ceremony & new staff charge", venue: "Main auditorium", type: "Plenary" },
        { time: "19:00 – 20:30", title: "Appreciation dinner", venue: "Grand ballroom", type: "Fellowship" },
      ]},
      { date: "Jan 6", weekday: "Wed", label: "Day 05", tagline: "Sending & departure", sessions: [
        { time: "08:00 – 10:00", title: "Closing plenary — Sending", venue: "Main auditorium", type: "Plenary" },
        { time: "10:30 – 11:30", title: "Commissioning prayer", venue: "Main auditorium", type: "Worship" },
        { time: "11:30 – 14:00", title: "Farewell brunch & departures", venue: "Courtyard", type: "Fellowship" },
      ]},
    ],
  },
};

export const history: HistoryItem[] = [
  { year: "2006", label: "Pamoja I", place: "Nakuru, Kenya", delegates: "2,277", caption: "Students & young professionals. The vision first gathered in East Africa.", image: "/assets/past_1.png" },
  { year: "2009", label: "Pamoja II", place: "Yamoussoukro, Cote d'Ivoire", delegates: "1,043", caption: "The continent's students answered the call in francophone West Africa.", image: "/assets/past_2.png" },
  { year: "2013", label: "Pamoja III", place: "Lagos, Nigeria", delegates: "1,900", caption: "Students and young professionals from across the continent.", image: "/assets/past_3.png" },
  { year: "2016-17", label: "Pamoja IV", place: "Lusaka, Zambia", delegates: "2,653", caption: "Students, young professionals and pastors from 34 nations of Africa.", image: "/assets/conference_crowd.jpg" },
  { year: "2027-28", label: "Pamoja V", place: "Addis Ababa, Ethiopia", delegates: "5,000+", caption: "3,000 delegates + 2,000 staff & family. \"Arise Africa.\"", image: "/assets/venue_hero.jpg", upcoming: true },
];

export const faq: FAQItem[] = [
  { q: "What is the difference between the Pamoja Conference and the Staff Conference?", a: "They are two back-to-back events at the same venue. The Pamoja Conference (Dec 27 — Jan 2) gathers 3,000 students, young professionals and church leaders. The Staff Conference (Jan 2 — Jan 6) is for 2,000 Campus Crusade staff, associate staff, interns and staff families." },
  { q: "Who is the Pamoja Conference for?", a: "University students, young professionals, and church leaders from across Africa and the diaspora. If you are between 18 and 35, you are especially welcome." },
  { q: "What are the dates?", a: "Pamoja Conference — Dec 27, 2027 to Jan 2, 2028. Staff Conference — Jan 2 to Jan 6, 2028." },
  { q: "How much does it cost?", a: "Fees vary by country office. Register through your national office for localized pricing in your local currency." },
  { q: "Can I come as a student group or church group?", a: "Yes — group registration of 2+ unlocks a streamlined process. Select the group option when you register through your country office." },
  { q: "Is there a visa process for Ethiopia?", a: "Most African passport holders can obtain an eVisa online or visa-on-arrival at Bole International Airport. We provide an official invitation letter after registration." },
];

export const venueInfo = {
  name: "Addis Ababa Convention Center",
  short: "AACC",
  tagline: "A continental home for a continental gathering.",
  body: "Purpose-built for pan-African events, the Addis Ababa Convention Center is Ethiopia's largest conference and exhibition complex. With a 3,500-seat main auditorium, a 2,000-capacity plenary hall, and more than 20 breakout rooms, it is designed to carry conversations of continental scale.",
  address: "Addis Ababa, Ethiopia — Bole Road — a short ride from Bole International Airport",
  specs: [
    { value: "3,500", label: "Main auditorium" },
    { value: "2,000", label: "Plenary hall" },
    { value: "20+", label: "Breakout rooms" },
    { value: "6", label: "Dining halls" },
  ],
  features: [
    "Full simultaneous interpretation (EN / FR / PT / SW / AR)",
    "Dedicated prayer rooms on every floor",
    "On-site health clinic & 24/7 security",
    "Family & childcare facilities for Staff Conference",
    "500+ on-site parking bays",
    "High-speed fiber Wi-Fi throughout",
  ],
  logistics: [
    { title: "By air", body: "Bole International Airport (ADD) — direct flights from 60+ African cities. Shuttle service from airport to venue." },
    { title: "Accommodation", body: "Official partner hotels within walking distance. Group bookings available during registration, starting at $48/night." },
    { title: "Ground transport", body: "Dedicated shuttle loop between partner hotels and the venue every 15 minutes." },
  ],
};
