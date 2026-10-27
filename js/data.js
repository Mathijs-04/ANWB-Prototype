// Seed data for the prototype. Dates are relative to today, so the demo never goes stale.

const UNSPLASH = 'https://images.unsplash.com/';

/** Build an Unsplash CDN url for a photo id at a given width. */
export function photo(id, w = 1200) {
  if (!id) return '';
  if (id.startsWith('data:') || id.startsWith('http')) return id;
  return `${UNSPLASH}${id}?auto=format&fit=crop&w=${w}&q=75`;
}

export function srcset(id, widths = [480, 800, 1200, 1600]) {
  if (!id || id.startsWith('data:') || id.startsWith('http')) return '';
  return widths.map((w) => `${photo(id, w)} ${w}w`).join(', ');
}

// Curated Unsplash photo ids per activity type (first = default).
export const IMAGES = {
  hero: ['photo-1511988617509-a57c8a288659', 'photo-1511632765486-a01980e01a18', 'photo-1758275557473-198776f1bec3'],
  boswandeling: ['photo-1790271479362-0ca713414180', 'photo-1790271479442-fa56ea9da2a1', 'photo-1445964047600-cdbdb873673d'],
  hardlopen: ['photo-1739368732843-800f36a9b7d0', 'photo-1540539234-c14a20fb7c7b'],
  tennis: ['photo-1554068865-24cecd4e34b8', 'photo-1515017804404-92b19fdfe6ac'],
  padel: ['photo-1709587824751-dd30420f5cf3', 'photo-1612534847738-b3af9bc31f0c', 'photo-1646649852033-7e0f3d679f8b'],
  borrel: ['photo-1758272133713-52c6bb9f74f0', 'photo-1775642675008-b73184710886', 'photo-1499186024912-c374ac2e9cb2'],
  gamenight: ['photo-1493711662062-fa541adb3fc8', 'photo-1758525862452-44b2df40e0c5'],
  bordspellen: ['photo-1779899004113-94606876a7a5', 'photo-1761716475708-ef98183ccb62'],
  koffie: ['photo-1790749870680-9f1918813d91', 'photo-1495474472287-4d71bcdd2085'],
  fietsen: ['photo-1735216228027-fe31c23474ce', 'photo-1541625602330-2277a4c46182', 'photo-1600403477955-2b8c2cfab221'],
  pubquiz: ['photo-1558210598-89ba75b1724e', 'photo-1560090143-aa4d95362170'],
  koken: ['photo-1683624328172-88fb24625ec1', 'photo-1772724317488-b901d235d419'],
  sup: ['photo-1526188717906-ab4a2f949f26', 'photo-1557151498-af2467d6f7f4', 'photo-1530570094090-deefc82ab21c'],
  volleybal: ['photo-1758004687459-08cc3e92f380', 'photo-1612872087720-bb876e2e67d1'],
  lunchwandeling: ['photo-1549057446-9f5c6ac91a04', 'photo-1725218404733-5bc02801f3a7', 'photo-1758599543120-c1cbcf407fec'],
  yoga: ['photo-1758274525981-05497b2c5b97', 'photo-1787647089633-37e49ee2e054', 'photo-1758274526045-2bd03dcc64d2'],
  bowling: ['photo-1773813434829-229144b272fd', 'photo-1545056453-f0359c3df6db', 'photo-1774397410299-45dab5b3bc1e'],
  karten: ['photo-1505570554449-69ce7d4fa36b', 'photo-1779128773287-923183d53f94'],
  // Galleries for past events
  galleryBos: ['photo-1758599668846-a74ac52087c8', 'photo-1758599668842-798d870b3210', 'photo-1758599668542-53e8c63c8e68', 'photo-1758599668796-cdd37f4ecb66', 'photo-1445964047600-cdbdb873673d'],
  galleryBorrel: ['photo-1671116810339-1b58cf241509', 'photo-1671116810289-302594443218', 'photo-1671116810348-8148423dec80', 'photo-1671116810287-f2081bb6597a', 'photo-1499186024912-c374ac2e9cb2'],
  galleryBordspel: ['photo-1762068383426-2e4389df451c', 'photo-1762068383473-f59f4dc614e0', 'photo-1763875067516-e947790c74ac', 'photo-1763875018525-1d39fe1a4354', 'photo-1761716475708-ef98183ccb62'],
  galleryRun: ['photo-1667781838690-5f32ea0ccea6', 'photo-1667781743417-a8099056261c', 'photo-1714667643277-3fc8e9ff5bea', 'photo-1716573094354-e4c3226ba887', 'photo-1540539234-c14a20fb7c7b'],
};

/** Image keys available per category, used for the "andere foto" picker. */
export const IMAGE_POOL = ['hero', 'boswandeling', 'lunchwandeling', 'hardlopen', 'fietsen', 'tennis', 'padel', 'volleybal', 'yoga', 'sup', 'borrel', 'pubquiz', 'koken', 'koffie', 'gamenight', 'bordspellen', 'bowling', 'karten'];

export const CATEGORIES = [
  { id: 'sport', label: 'Sport' },
  { id: 'buiten', label: 'Buiten' },
  { id: 'gezellig', label: 'Borrel & eten' },
  { id: 'spel', label: 'Spellen' },
  { id: 'koffie', label: 'Koffie' },
];

/** Quick-start templates for the create form. */
export const TEMPLATES = [
  { id: 'boswandeling', label: 'Boswandeling', category: 'buiten', title: 'Boswandeling', time: '10:00', location: 'Meijendel, Wassenaar', transport: true, description: 'Even de benen strekken en frisse lucht happen. Rustig tempo, iedereen kan mee. Neem goede schoenen mee.' },
  { id: 'hardlopen', label: 'Hardloopclub', category: 'sport', title: 'Hardloopclub', time: '12:15', location: 'Hoofdkantoor Den Haag', transport: false, description: 'Rondje van 5 km door het Haagse Bos. We lopen in twee groepjes, dus elk tempo is welkom. Douchen kan op kantoor.' },
  { id: 'tennis', label: 'Potje tennis', category: 'sport', title: 'Potje tennis', time: '18:30', location: 'TC Marlot, Den Haag', transport: true, max: 4, description: 'Een dubbeltje spelen na het werk. Racket nodig? Ik heb er een over.' },
  { id: 'padel', label: 'Padel', category: 'sport', title: 'Potje padel', time: '19:00', location: 'Padel Den Haag, Ypenburg', transport: true, max: 4, description: 'Baan is gereserveerd. Beginners welkom, we wisselen de teams.' },
  { id: 'borrel', label: 'Borrel', category: 'gezellig', title: 'Gezellige borrel', time: '16:30', location: 'Dakterras hoofdkantoor', transport: false, description: 'Week afsluiten met een drankje en een bitterbal. Loop gerust even binnen.' },
  { id: 'gamenight', label: 'Game night', category: 'spel', title: 'Game night', time: '19:00', location: 'Lounge, 3e verdieping', transport: false, description: 'Controllers liggen klaar. We beginnen met Mario Kart, daarna kiezen we samen.' },
  { id: 'bordspellen', label: 'Bordspellen', category: 'spel', title: 'Bordspellenavond', time: '19:30', location: 'Restaurant hoofdkantoor', transport: false, description: 'Van Catan tot Codenames. Neem je favoriete spel mee, voor snacks wordt gezorgd.' },
  { id: 'koffie', label: 'Koffie drinken', category: 'koffie', title: 'Koffie drinken', time: '10:00', location: 'Koffiebar, begane grond', transport: false, max: 6, description: 'Kwartiertje bijkletsen bij de koffiebar. Ook leuk om collega\'s van andere teams te leren kennen.' },
  { id: 'fietsen', label: 'Fietstocht', category: 'buiten', title: 'Fietstocht', time: '09:30', location: 'Start: hoofdkantoor Den Haag', transport: false, description: 'Rustige toertocht van zo\'n 40 km met een koffiestop halverwege.' },
  { id: 'pubquiz', label: 'Pubquiz', category: 'gezellig', title: 'Pubquiz', time: '20:00', location: 'Café Het Plein, Den Haag', transport: false, max: 24, description: 'Teams van vier. Wie wint, mag de volgende quiz maken.' },
  { id: 'koken', label: 'Samen koken', category: 'gezellig', title: 'Samen koken', time: '18:00', location: 'Bedrijfskeuken, 1e verdieping', transport: false, max: 10, description: 'We koken samen een driegangenmenu en eten het daarna natuurlijk ook op.' },
  { id: 'yoga', label: 'Yoga', category: 'sport', title: 'Yoga voor iedereen', time: '08:00', location: 'Vergaderzaal De Duinen', transport: false, max: 12, description: 'Rustig beginnen aan de dag. Matjes zijn er, makkelijke kleding is genoeg.' },
];

/** Colleagues used in the seed data. `me` is the current user and is filled in at runtime. */
export const PEOPLE = {
  sanne: { name: 'Sanne de Vries', team: 'Wegenwacht' },
  daan: { name: 'Daan Jansen', team: 'IT' },
  fleur: { name: 'Fleur Bakker', team: 'Marketing' },
  bram: { name: 'Bram Visser', team: 'Reizen' },
  lotte: { name: 'Lotte Smit', team: 'HR' },
  jesse: { name: 'Jesse Meijer', team: 'Verzekeringen' },
  noor: { name: 'Noor Mulder', team: 'Klantenservice' },
  thijs: { name: 'Thijs de Boer', team: 'Data & Analytics' },
  eva: { name: 'Eva Bos', team: 'Juridische zaken' },
  sem: { name: 'Sem Peters', team: 'Webwinkel' },
  julia: { name: 'Julia Hendriks', team: 'Ledenservice' },
  lucas: { name: 'Lucas van Dijk', team: 'Wegenwacht' },
  iris: { name: 'Iris Dekker', team: 'Communicatie' },
  ruben: { name: 'Ruben Kok', team: 'Financiën' },
  anouk: { name: 'Anouk Vermeulen', team: 'Reizen' },
  milan: { name: 'Milan de Graaf', team: 'IT' },
  emma: { name: 'Emma van Leeuwen', team: 'Marketing' },
  tim: { name: 'Tim Brouwer', team: 'Energie' },
  sophie: { name: 'Sophie Willems', team: 'Verkeersinformatie' },
  mees: { name: 'Mees Hoekstra', team: 'Data & Analytics' },
};

// The demo is on 30 October 2026, so seed dates are planned from that day
// (or from today once it has passed, so the demo never goes stale).
const DEMO_DAY = new Date('2026-10-30T12:00:00');

function anchor() {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d > DEMO_DAY ? d : new Date(DEMO_DAY);
}

// Shorthand: day offset from the anchor -> yyyy-mm-dd
function day(offset) {
  const d = anchor();
  d.setDate(d.getDate() + offset);
  return toISODate(d);
}

/** The next given weekday (0 = sunday) at least `minDays` after the anchor. */
function nextWeekday(weekday, minDays = 1) {
  const d = anchor();
  d.setDate(d.getDate() + minDays);
  while (d.getDay() !== weekday) d.setDate(d.getDate() + 1);
  return toISODate(d);
}

export function toISODate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Seed activities. Built lazily so relative dates are computed at load time. */
export function seedActivities() {
  return [
    {
      id: 'lunchrun-haagse-bos',
      kind: 'hardlopen', category: 'sport',
      title: 'Lunchrun door het Haagse Bos',
      date: nextWeekday(3, 2), time: '12:15', duration: '45 min',
      location: 'Hoofdkantoor Den Haag', address: 'Verzamelen bij de hoofdingang',
      image: 'hardlopen', organizer: 'lucas',
      attendees: ['lucas', 'fleur', 'milan', 'sophie', 'tim', 'eva', 'mees'],
      max: null, transport: false, recurring: 'Elke woensdag',
      description: 'Elke woensdag lopen we een rondje van 5 km door het Haagse Bos. We splitsen in twee groepjes: rustig (6:30 min/km) en iets sneller (5:15 min/km). Niemand loopt alleen.\n\nDouchen en omkleden kan op kantoor. Om 13:15 zit je weer achter je bureau.',
    },
    {
      id: 'koffie-nieuwe-collegas',
      kind: 'koffie', category: 'koffie',
      title: 'Koffie met nieuwe collega’s',
      date: nextWeekday(2, 2), time: '10:00', duration: '30 min',
      location: 'Koffiebar, begane grond', address: 'Hoofdkantoor Den Haag',
      image: 'koffie', organizer: 'lotte',
      attendees: ['lotte', 'julia', 'sem', 'noor'],
      max: 8, transport: false,
      description: 'Nieuw bij de ANWB of gewoon nieuwsgierig wie er nog meer rondloopt? Schuif aan voor een kop koffie. Geen agenda, geen presentatie. Gewoon kennismaken.',
    },
    {
      id: 'vrijdagmiddagborrel',
      kind: 'borrel', category: 'gezellig',
      title: 'Vrijdagmiddagborrel',
      date: nextWeekday(5, 2), time: '16:30', duration: 'Tot 19:00',
      location: 'Dakterras hoofdkantoor', address: 'Bij regen: restaurant, 1e verdieping',
      image: 'borrel', organizer: 'fleur',
      attendees: ['fleur', 'bram', 'anouk', 'daan', 'jesse', 'emma', 'iris', 'ruben', 'noor', 'thijs', 'sem', 'julia', 'lotte', 'tim'],
      max: null, transport: false,
      description: 'We sluiten de week af op het dakterras. Drankjes en bitterballen staan klaar vanaf half vijf. Neem gerust je teamgenoten mee.',
    },
    {
      id: 'boswandeling-meijendel',
      kind: 'boswandeling', category: 'buiten',
      title: 'Herfstwandeling in Wassenaar',
      date: nextWeekday(6, 1), time: '10:00', duration: 'Ca. 2,5 uur',
      location: 'Meijendel, Wassenaar', address: 'Parkeerplaats De Tapuit, Meijendelseweg 40',
      image: 'boswandeling', organizer: 'sanne',
      attendees: ['sanne', 'bram', 'eva', 'julia', 'ruben', 'anouk'],
      max: 20, transport: true,
      rides: [
        { id: 'r1', driver: 'bram', from: 'Station Den Haag Centraal', time: '09:30', seats: 3, passengers: ['eva'] },
        { id: 'r2', driver: 'ruben', from: 'Leiden, P+R Haagse Schouw', time: '09:35', seats: 4, passengers: ['julia', 'anouk'] },
      ],
      description: 'Een route van 9 km door duinen, bos en langs de Kikkervalleien. Halverwege stoppen we bij De Tapuit voor koffie met appeltaart.\n\nTrek stevige schoenen aan; het kan modderig zijn.',
    },
    {
      id: 'padel-ypenburg',
      kind: 'padel', category: 'sport',
      title: 'Potje padel na werktijd',
      date: nextWeekday(1, 2), time: '19:00', duration: '1,5 uur',
      location: 'Padel Den Haag, Ypenburg', address: 'Laan van Hoornwijck 12',
      image: 'padel', organizer: 'daan',
      attendees: ['daan', 'milan', 'jesse'],
      max: 4, transport: true,
      rides: [{ id: 'r1', driver: 'daan', from: 'Hoofdkantoor Den Haag', time: '18:30', seats: 3, passengers: ['milan'] }],
      description: 'Baan staat gereserveerd. We zoeken nog één speler. Nooit gespeeld? Geen probleem, we leggen het je uit. Rackets zijn te huur.',
    },
    {
      id: 'mario-kart-toernooi',
      kind: 'gamenight', category: 'spel',
      title: 'Game night: Mario Kart-toernooi',
      date: nextWeekday(4, 2), time: '19:00', duration: 'Tot 22:30',
      location: 'Lounge, 3e verdieping', address: 'Hoofdkantoor Den Haag',
      image: 'gamenight', organizer: 'milan',
      attendees: ['milan', 'daan', 'sem', 'mees', 'thijs', 'tim', 'emma', 'jesse', 'iris'],
      max: 16, transport: false,
      description: 'Vier controllers, één groot scherm en een wisselbeker. We spelen in poules, de finale is om 21:30. Pizza wordt besteld rond half acht.',
    },
    {
      id: 'tennis-dubbel',
      kind: 'tennis', category: 'sport',
      title: 'Potje tennis (dubbel)',
      date: nextWeekday(2, 2), time: '18:30', duration: '1 uur',
      location: 'TC Marlot, Den Haag', address: 'Van Hogenhoucklaan 1',
      image: 'tennis', organizer: 'emma',
      attendees: ['emma', 'iris'],
      max: 4, transport: true, rides: [],
      description: 'Gezellig een dubbeltje spelen. Niveau maakt niet uit, plezier wel. Ik heb een extra racket voor wie die nodig heeft.',
    },
    {
      id: 'bordspellenavond',
      kind: 'bordspellen', category: 'spel',
      title: 'Bordspellenavond',
      date: nextWeekday(1, 8), time: '19:30', duration: 'Tot 23:00',
      location: 'Restaurant hoofdkantoor', address: '1e verdieping',
      image: 'bordspellen', organizer: 'thijs',
      attendees: ['thijs', 'mees', 'noor', 'lotte', 'sophie'],
      max: 20, transport: false,
      description: 'Van Catan en Ticket to Ride tot snelle kaartspellen. Neem gerust je eigen favoriet mee. Er zijn snacks en drankjes.',
    },
    {
      id: 'fietstocht-bollenstreek',
      kind: 'fietsen', category: 'buiten',
      title: 'Najaarsrit door de Duin- en Bollenstreek',
      date: nextWeekday(6, 7), time: '09:30', duration: 'Ca. 3 uur · 45 km',
      location: 'Start: hoofdkantoor Den Haag', address: 'Fietsenstalling hoofdingang',
      image: 'fietsen', organizer: 'tim',
      attendees: ['tim', 'sanne', 'lucas'],
      max: 12, transport: false,
      description: 'Via de duinen naar Noordwijk en terug langs de bollenvelden. Tempo rond de 22 km/u, we wachten altijd op elkaar. Koffiestop in Noordwijk aan Zee.',
    },
    {
      id: 'pubquiz-centrum',
      kind: 'pubquiz', category: 'gezellig',
      title: 'Pubquiz: wie weet het meest?',
      date: nextWeekday(4, 8), time: '20:00', duration: 'Ca. 2,5 uur',
      location: 'Café Het Plein, Den Haag', address: 'Plein 12',
      image: 'pubquiz', organizer: 'iris',
      attendees: ['iris', 'jesse', 'eva', 'ruben', 'bram', 'anouk', 'julia', 'emma'],
      max: 24, transport: false,
      description: 'Zes rondes: van verkeersregels tot jaren 90-hits. Teams van vier, we delen ze in op de avond zelf. Winnaars maken de volgende quiz.',
    },
  ];
}

/** Past activities with photos and comments. */
export function seedPast() {
  return [
    {
      id: 'wandeling-amsterdamse-bos',
      kind: 'boswandeling', category: 'buiten',
      title: 'Wandeling door het Amsterdamse Bos',
      date: day(-13), time: '10:00', duration: '2,5 uur',
      location: 'Amsterdamse Bos, Amstelveen', address: '',
      image: 'galleryBos', organizer: 'sanne',
      attendees: ['sanne', 'bram', 'eva', 'julia', 'ruben', 'anouk', 'noor', 'lotte', 'sophie', 'tim', 'iris'],
      transport: true,
      description: 'Elf collega’s, 10 kilometer en gelukkig maar één regenbui.',
      gallery: 'galleryBos',
      reactions: { '🙌': 9, '🍂': 6, '☕': 4 },
      comments: [
        { by: 'eva', text: 'Wat een mooie route! De appeltaart halverwege was de beste van het jaar.', at: day(-13) },
        { by: 'bram', text: 'Volgende keer de Veluwe? Ik rijd wel.', at: day(-12) },
        { by: 'noor', text: 'Eindelijk mensen van Reizen leren kennen. Super leuk dit!', at: day(-12) },
      ],
    },
    {
      id: 'zomerborrel-dakterras',
      kind: 'borrel', category: 'gezellig',
      title: 'Nazomerborrel op het dakterras',
      date: day(-35), time: '16:30', duration: 'Tot 20:00',
      location: 'Dakterras hoofdkantoor', address: '',
      image: 'galleryBorrel', organizer: 'fleur',
      attendees: ['fleur', 'bram', 'anouk', 'daan', 'jesse', 'emma', 'iris', 'ruben', 'noor', 'thijs', 'sem', 'julia', 'lotte', 'tim', 'mees', 'milan', 'sophie', 'lucas'],
      transport: false,
      description: 'De laatste warme vrijdag van het jaar. Met dj, bitterballen en een zonsondergang boven de stad.',
      gallery: 'galleryBorrel',
      reactions: { '🥂': 14, '☀️': 8, '🎶': 5 },
      comments: [
        { by: 'daan', text: 'Die zonsondergang! Dit moeten we vaker doen.', at: day(-35) },
        { by: 'lotte', text: 'Top georganiseerd Fleur, dank je wel.', at: day(-34) },
      ],
    },
    {
      id: 'catan-kampioenschap',
      kind: 'bordspellen', category: 'spel',
      title: 'Het grote Catan-kampioenschap',
      date: day(-21), time: '19:30', duration: 'Tot 23:30',
      location: 'Restaurant hoofdkantoor', address: '',
      image: 'galleryBordspel', organizer: 'thijs',
      attendees: ['thijs', 'mees', 'noor', 'lotte', 'sophie', 'milan', 'jesse', 'eva'],
      transport: false,
      description: 'Acht spelers, twee tafels, één kampioen. Gefeliciteerd Noor!',
      gallery: 'galleryBordspel',
      reactions: { '🎲': 7, '🏆': 5 },
      comments: [
        { by: 'noor', text: 'Ik zeg niks, maar die wisselbeker staat mooi op mijn bureau.', at: day(-21) },
        { by: 'mees', text: 'Revanche volgende maand. Ik heb geoefend.', at: day(-20) },
      ],
    },
    {
      id: 'singelloop-utrecht',
      kind: 'hardlopen', category: 'sport',
      title: 'Samen naar de Singelloop Utrecht',
      date: day(-26), time: '13:00', duration: 'Middag',
      location: 'Singel, Utrecht', address: '',
      image: 'galleryRun', organizer: 'lucas',
      attendees: ['lucas', 'fleur', 'milan', 'sophie', 'tim', 'eva', 'mees', 'emma', 'daan'],
      transport: true,
      description: 'Negen collega’s aan de start van de 5 en 10 km. Iedereen heeft de finish gehaald.',
      gallery: 'galleryRun',
      reactions: { '🏃': 8, '💪': 7, '🏅': 6 },
      comments: [
        { by: 'sophie', text: 'Persoonlijk record! Dankzij de lunchruns, echt waar.', at: day(-26) },
        { by: 'tim', text: 'Volgend jaar met een ANWB-teamshirt?', at: day(-25) },
        { by: 'lucas', text: 'Goed idee Tim, ik ga het regelen.', at: day(-25) },
      ],
    },
  ];
}
