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
  { id: 'boswandeling', label: 'Boswandeling', category: 'buiten', title: 'Boswandeling', time: '10:00', location: 'Meijendel, Wassenaar', transport: true, description: 'Lekker een frisse neus halen in het bos. We lopen in een rustig tempo, dus iedereen kan mee. Trek wel stevige schoenen aan!' },
  { id: 'hardlopen', label: 'Hardloopclub', category: 'sport', title: 'Hardloopclub', time: '12:15', location: 'Hoofdkantoor Den Haag', transport: false, description: 'We lopen samen een rondje van zo’n 5 kilometer. Elk tempo is welkom en niemand loopt alleen. Douchen kan gewoon op kantoor.' },
  { id: 'tennis', label: 'Potje tennis', category: 'sport', title: 'Potje tennis', time: '18:30', location: 'TC Marlot, Den Haag', transport: true, max: 4, description: 'Zin in een potje dubbel na het werk? Niveau maakt niet uit, gezelligheid wel. Geen racket? Dan neem ik er een extra mee.' },
  { id: 'padel', label: 'Padel', category: 'sport', title: 'Potje padel', time: '19:00', location: 'Padel Den Haag, Ypenburg', transport: true, max: 4, description: 'Ik heb een baan gereserveerd. Nog nooit gespeeld? Geen probleem, je hebt het zo door. Rackets kun je ter plekke huren.' },
  { id: 'borrel', label: 'Borrel', category: 'gezellig', title: 'Gezellige borrel', time: '16:30', location: 'Dakterras hoofdkantoor', transport: false, description: 'Tijd om de week af te sluiten met een drankje en een bitterbal. Loop gerust even binnen, iedereen is welkom.' },
  { id: 'gamenight', label: 'Game night', category: 'spel', title: 'Game night', time: '19:00', location: 'Lounge, 3e verdieping', transport: false, description: 'De controllers liggen klaar! We beginnen met Mario Kart en kiezen daarna samen wat we nog meer spelen.' },
  { id: 'bordspellen', label: 'Bordspellen', category: 'spel', title: 'Bordspellenavond', time: '19:30', location: 'Restaurant hoofdkantoor', transport: false, description: 'Een avondje spelletjes met collega’s. Neem gerust je eigen favoriet mee, voor snacks wordt gezorgd.' },
  { id: 'koffie', label: 'Koffie drinken', category: 'koffie', title: 'Koffie drinken', time: '10:00', location: 'Koffiebar, begane grond', transport: false, max: 6, description: 'Even bijkletsen bij de koffiebar. Leuk om ook eens collega’s van andere afdelingen te leren kennen.' },
  { id: 'fietsen', label: 'Fietstocht', category: 'buiten', title: 'Fietstocht', time: '09:30', location: 'Start: hoofdkantoor Den Haag', transport: false, description: 'Een rustige fietstocht met halverwege een koffiestop. We wachten altijd op elkaar, dus iedereen kan mee.' },
  { id: 'pubquiz', label: 'Pubquiz', category: 'gezellig', title: 'Pubquiz', time: '20:00', location: 'Café Het Plein, Den Haag', transport: false, max: 24, description: 'We spelen in teams van vier. Het winnende team mag de volgende quiz in elkaar zetten.' },
  { id: 'koken', label: 'Samen koken', category: 'gezellig', title: 'Samen koken', time: '18:00', location: 'Bedrijfskeuken, 1e verdieping', transport: false, max: 10, description: 'We koken samen een driegangenmenu en schuiven daarna gezellig met z’n allen aan tafel.' },
  { id: 'yoga', label: 'Yoga', category: 'sport', title: 'Ochtendyoga', time: '08:00', location: 'Vergaderzaal De Duinen', transport: false, max: 12, description: 'Rustig beginnen aan de dag met een uurtje yoga. Matten liggen klaar, makkelijk zittende kleding is genoeg.' },
  { id: 'karten', label: 'Karten', category: 'sport', title: 'Karten', time: '18:30', location: 'Kartbaan Delft', transport: true, max: 12, description: 'Wie is de snelste coureur van de afdeling? Na een korte training rijden we een echte race. Ervaring is niet nodig.' },
  { id: 'bowling', label: 'Bowlen', category: 'spel', title: 'Bowlen', time: '19:00', location: 'Bowlingcentrum Den Haag', transport: false, max: 18, description: 'Een avondje bowlen met bitterballen erbij. Ook als je vooral goten gooit, wordt het gezellig.' },
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
      id: 'fietstocht-bollenstreek',
      kind: 'fietsen', category: 'buiten',
      title: 'Najaarsrit met koffiestop',
      date: nextWeekday(6, 1), time: '09:30', duration: 'Ca. 3 uur · 45 km',
      location: 'Start: hoofdkantoor Den Haag', address: 'Fietsenstalling bij de hoofdingang',
      image: 'photo-1541625602330-2277a4c46182', organizer: 'tim',
      attendees: ['tim', 'sanne', 'lucas', 'emma', 'bram'],
      max: 12, transport: false,
      description: 'Zaterdagochtend nog één keer lekker fietsen voordat het echt winter wordt. We rijden via de duinen naar Noordwijk en drinken daar koffie met appeltaart, met uitzicht op zee. Daarna fietsen we terug langs de bollenvelden. In november zijn die wat kaal, maar nog steeds mooi.\n\nHet is zo’n 45 kilometer en we houden een rustig tempo aan, dus je hoeft echt geen wielrenner te zijn. Een gewone fiets is prima. Pomp wel even je banden op!',
    },
    {
      id: 'lunchwandeling',
      kind: 'lunchwandeling', category: 'buiten',
      title: 'Lunchwandeling',
      date: nextWeekday(1, 2), time: '12:30', duration: '30 min',
      location: 'Hoofdkantoor Den Haag', address: 'Verzamelen bij de hoofdingang',
      image: 'lunchwandeling', organizer: 'noor',
      attendees: ['noor', 'julia', 'eva', 'iris', 'ruben'],
      max: null, transport: false, recurring: 'Elke maandag',
      description: 'Even weg van je scherm en een frisse neus halen. Elke maandag lopen we in de lunchpauze een half uurtje door het Haagse Bos. Geen tempo, geen stappenteller, gewoon wandelen en bijkletsen. Je bent ruim op tijd terug voor je volgende overleg.',
    },
    {
      id: 'padel-ypenburg',
      kind: 'padel', category: 'sport',
      title: 'Potje padel',
      date: nextWeekday(1, 2), time: '19:00', duration: '1,5 uur',
      location: 'Padel Den Haag, Ypenburg', address: 'Laan van Hoornwijck 12',
      image: 'padel', organizer: 'daan',
      attendees: ['daan', 'milan', 'jesse'],
      max: 4, transport: true,
      rides: [{ id: 'r1', driver: 'daan', from: 'Hoofdkantoor Den Haag', time: '18:30', seats: 3, passengers: ['milan'] }],
      description: 'Ik heb een baan geboekt en we zijn nog één speler tekort. Nog nooit gepadeld? Geen enkel probleem. Het is een stuk makkelijker dan tennis en na tien minuten heb je het wel door. Rackets kun je daar huren.\n\nNa afloop drinken we nog wat in de kantine.',
    },
    {
      id: 'koffie-nieuwe-collegas',
      kind: 'koffie', category: 'koffie',
      title: 'Koffie & kennismaken',
      date: nextWeekday(2, 2), time: '10:00', duration: '30 min',
      location: 'Koffiebar, begane grond', address: 'Hoofdkantoor Den Haag',
      image: 'koffie', organizer: 'lotte',
      attendees: ['lotte', 'julia', 'sem', 'noor'],
      max: 8, transport: false,
      description: 'Ben je net begonnen bij de ANWB? Of ken je eigenlijk alleen de mensen van je eigen afdeling? Schuif dan aan bij de koffiebar. Er is geen programma en niemand hoeft zich voor te stellen met een leuk weetje. Gewoon een goede kop koffie en een goed gesprek.',
    },
    {
      id: 'tennis-dubbel',
      kind: 'tennis', category: 'sport',
      title: 'Dubbeltje tennis',
      date: nextWeekday(2, 2), time: '18:30', duration: '1 uur',
      location: 'TC Marlot, Den Haag', address: 'Van Hogenhoucklaan 1',
      image: 'tennis', organizer: 'emma',
      attendees: ['emma', 'iris'],
      max: 4, transport: true, rides: [],
      description: 'Ik zoek nog twee mensen voor een potje dubbel op dinsdagavond. Of je nu elke week op de baan staat of je racket al jaren op zolder ligt, dat maakt niet uit. Het gaat vooral om de gezelligheid. Heb je geen racket? Ik neem er een extra mee.',
    },
    {
      id: 'lunchrun-haagse-bos',
      kind: 'hardlopen', category: 'sport',
      title: 'Lunchrun Haagse Bos',
      date: nextWeekday(3, 2), time: '12:15', duration: '45 min',
      location: 'Hoofdkantoor Den Haag', address: 'Verzamelen bij de hoofdingang',
      image: 'hardlopen', organizer: 'lucas',
      attendees: ['lucas', 'fleur', 'milan', 'sophie', 'tim', 'eva', 'mees'],
      max: null, transport: false, recurring: 'Elke woensdag',
      description: 'Elke woensdag lopen we tussen de middag een rondje van 5 kilometer door het Haagse Bos. We splitsen op in een rustige en een iets snellere groep, dus je hoeft niet bang te zijn dat je achteraan bungelt.\n\nOmkleden en douchen kan gewoon op kantoor. Om kwart over één zit je weer fris achter je bureau.',
    },
    {
      id: 'ochtendyoga',
      kind: 'yoga', category: 'sport',
      title: 'Ochtendyoga',
      date: nextWeekday(4, 2), time: '08:00', duration: '1 uur',
      location: 'Vergaderzaal De Duinen', address: 'Hoofdkantoor Den Haag, 2e verdieping',
      image: 'yoga', organizer: 'sophie',
      attendees: ['sophie', 'fleur', 'anouk', 'lotte', 'emma'],
      max: 12, transport: false,
      description: 'Rustig wakker worden voordat de eerste mails binnenkomen. We doen een uurtje rustige yoga die voor iedereen te doen is, ook als je nog nooit op een mat hebt gestaan. Matten liggen klaar, je hoeft alleen makkelijk zittende kleding mee te nemen.',
    },
    {
      id: 'mario-kart-toernooi',
      kind: 'gamenight', category: 'spel',
      title: 'Mario Kart-toernooi',
      date: nextWeekday(4, 2), time: '19:00', duration: 'Tot 22:30',
      location: 'Lounge, 3e verdieping', address: 'Hoofdkantoor Den Haag',
      image: 'gamenight', organizer: 'milan',
      attendees: ['milan', 'daan', 'sem', 'mees', 'thijs', 'tim', 'emma', 'jesse', 'iris'],
      max: 16, transport: false,
      description: 'Het is weer tijd voor het Mario Kart-toernooi! We spelen in poules op het grote scherm in de lounge en rond half tien is de grote finale. De winnaar mag de wisselbeker een jaar lang op het bureau zetten.\n\nRond half acht bestellen we pizza, dus je hoeft niet eerst thuis te eten.',
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
      description: 'De week zit erop! Vanaf half vijf staan de drankjes en bitterballen klaar op het dakterras. Neem gerust je teamgenoten mee, iedereen is welkom. Gaat het regenen? Dan verhuizen we naar het restaurant op de eerste verdieping.',
    },
    {
      id: 'boswandeling-meijendel',
      kind: 'boswandeling', category: 'buiten',
      title: 'Herfstwandeling in Wassenaar',
      date: nextWeekday(6, 7), time: '10:00', duration: 'Ca. 2,5 uur',
      location: 'Meijendel, Wassenaar', address: 'Parkeerplaats De Tapuit, Meijendelseweg 40',
      image: 'boswandeling', organizer: 'sanne',
      attendees: ['sanne', 'bram', 'eva', 'julia', 'ruben', 'anouk'],
      max: 20, transport: true,
      rides: [
        { id: 'r1', driver: 'bram', from: 'Station Den Haag Centraal', time: '09:30', seats: 3, passengers: ['eva'] },
        { id: 'r2', driver: 'ruben', from: 'Leiden, P+R Haagse Schouw', time: '09:35', seats: 4, passengers: ['julia', 'anouk'] },
      ],
      description: 'Een mooie wandeling van zo’n 9 kilometer door Meijendel, dwars door de duinen en het bos. Halverwege stoppen we bij De Tapuit voor koffie en appeltaart, dus daar kun je je alvast op verheugen.\n\nTrek wel stevige schoenen aan, want na alle regen kan het hier en daar flink modderig zijn. Wil je meerijden? Kijk hieronder bij Samen reizen.',
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
      description: 'Zin in een avondje spelletjes? Ik neem een tas vol spellen mee, van Catan en Ticket to Ride tot snelle kaartspellen voor tussendoor. Heb je zelf een favoriet? Neem die vooral mee. Voor drinken en chips wordt gezorgd.',
    },
    {
      id: 'karten-delft',
      kind: 'karten', category: 'sport',
      title: 'Karten in Delft',
      date: nextWeekday(3, 9), time: '18:30', duration: 'Ca. 2,5 uur',
      location: 'Kartbaan Delft', address: 'Schieweg 25, Delft',
      image: 'karten', organizer: 'ruben',
      attendees: ['ruben', 'mees', 'sem', 'lucas', 'daan', 'sophie', 'jesse'],
      max: 12, transport: true,
      rides: [
        { id: 'r1', driver: 'ruben', from: 'Hoofdkantoor Den Haag', time: '18:00', seats: 4, passengers: ['mees', 'sem'] },
        { id: 'r2', driver: 'sophie', from: 'Station Rijswijk', time: '18:05', seats: 3, passengers: ['lucas'] },
      ],
      description: 'Tijd om uit te vinden wie de snelste coureur van de ANWB is. We rijden eerst een korte training om de baan te leren kennen, daarna volgt een echte race van vijftien minuten. Ervaring is niet nodig, een beetje durf wel.\n\nNa afloop eten we samen nog een hapje. Het kost 25 euro per persoon, dat regelen we ter plekke.',
    },
    {
      id: 'pubquiz-centrum',
      kind: 'pubquiz', category: 'gezellig',
      title: 'Pubquiz',
      date: nextWeekday(4, 8), time: '20:00', duration: 'Ca. 2,5 uur',
      location: 'Café Het Plein, Den Haag', address: 'Plein 12',
      image: 'pubquiz', organizer: 'iris',
      attendees: ['iris', 'jesse', 'eva', 'ruben', 'bram', 'anouk', 'julia', 'emma'],
      max: 24, transport: false,
      description: 'Zes rondes vol vragen, van verkeersregels tot jaren 90-hits. We maken op de avond zelf teams van vier, dus je hoeft niet zelf een team bij elkaar te zoeken. Het winnende team mag de volgende quiz maken. Je bent gewaarschuwd!',
    },
    {
      id: 'bowlen-den-haag',
      kind: 'bowling', category: 'spel',
      title: 'Bowlen & bitterballen',
      date: nextWeekday(5, 9), time: '19:00', duration: 'Ca. 2 uur',
      location: 'Bowlingcentrum Den Haag', address: 'Laan van Meerdervoort 300',
      image: 'bowling', organizer: 'jesse',
      attendees: ['jesse', 'noor', 'thijs', 'iris', 'bram', 'fleur', 'tim', 'milan', 'julia', 'sem'],
      max: 18, transport: false,
      description: 'Een avondje bowlen, ook als je normaal vooral goten gooit. We hebben drie banen gereserveerd en de bitterballen zijn al besteld. Wie de hoogste score haalt, krijgt eeuwige roem en een drankje van de rest.',
    },
    {
      id: 'italiaanse-kookavond',
      kind: 'koken', category: 'gezellig',
      title: 'Italiaanse kookavond',
      date: nextWeekday(4, 15), time: '18:00', duration: 'Tot 21:30',
      location: 'Bedrijfskeuken, 1e verdieping', address: 'Hoofdkantoor Den Haag',
      image: 'koken', organizer: 'anouk',
      attendees: ['anouk', 'eva', 'lotte', 'bram', 'emma', 'sophie'],
      max: 10, transport: false,
      description: 'Samen een Italiaans driegangenmenu koken in de bedrijfskeuken. Ik zorg voor de recepten en de boodschappen, jullie voor de handen. We maken alles zelf, van verse pasta tot tiramisu. Daarna schuiven we natuurlijk met z’n allen aan tafel om het op te eten.\n\nWe vragen een kleine bijdrage van 10 euro voor de ingrediënten.',
    },
  ];
}

/** Past activities with photos and comments. */
export function seedPast() {
  return [
    {
      id: 'wandeling-amsterdamse-bos',
      kind: 'boswandeling', category: 'buiten',
      title: 'Wandeling Amsterdamse Bos',
      date: day(-13), time: '10:00', duration: '2,5 uur',
      location: 'Amsterdamse Bos, Amstelveen', address: '',
      image: 'galleryBos', organizer: 'sanne',
      attendees: ['sanne', 'bram', 'eva', 'julia', 'ruben', 'anouk', 'noor', 'lotte', 'sophie', 'tim', 'iris'],
      transport: true,
      description: 'Met elf collega’s liepen we zo’n 10 kilometer door het Amsterdamse Bos. Halverwege kregen we een flinke regenbui over ons heen, maar de appeltaart bij de pannenkoekenboerderij maakte alles weer goed.',
      gallery: 'galleryBos',
      reactions: { '🙌': 9, '🍂': 6, '☕': 4 },
      comments: [
        { by: 'eva', text: 'Wat een mooie route! En die appeltaart halverwege was echt de beste van het jaar.', at: day(-13) },
        { by: 'bram', text: 'Volgende keer de Veluwe? Ik rijd wel.', at: day(-12) },
        { by: 'noor', text: 'Eindelijk eens mensen van Reizen leren kennen. Super leuk dit!', at: day(-12) },
      ],
    },
    {
      id: 'zomerborrel-dakterras',
      kind: 'borrel', category: 'gezellig',
      title: 'Nazomerborrel',
      date: day(-35), time: '16:30', duration: 'Tot 20:00',
      location: 'Dakterras hoofdkantoor', address: '',
      image: 'galleryBorrel', organizer: 'fleur',
      attendees: ['fleur', 'bram', 'anouk', 'daan', 'jesse', 'emma', 'iris', 'ruben', 'noor', 'thijs', 'sem', 'julia', 'lotte', 'tim', 'mees', 'milan', 'sophie', 'lucas'],
      transport: false,
      description: 'De laatste warme vrijdag van het jaar vierden we met z’n allen op het dakterras. Met muziek, bitterballen en een prachtige zonsondergang boven de stad. Een betere afsluiter van de zomer konden we ons niet wensen.',
      gallery: 'galleryBorrel',
      reactions: { '🥂': 14, '☀️': 8, '🎶': 5 },
      comments: [
        { by: 'daan', text: 'Die zonsondergang! Dit moeten we echt vaker doen.', at: day(-35) },
        { by: 'lotte', text: 'Top georganiseerd Fleur, dank je wel.', at: day(-34) },
      ],
    },
    {
      id: 'catan-kampioenschap',
      kind: 'bordspellen', category: 'spel',
      title: 'Bordspelkampioenschap',
      date: day(-21), time: '19:30', duration: 'Tot 23:30',
      location: 'Restaurant hoofdkantoor', address: '',
      image: 'galleryBordspel', organizer: 'thijs',
      attendees: ['thijs', 'mees', 'noor', 'lotte', 'sophie', 'milan', 'jesse', 'eva'],
      transport: false,
      description: 'Acht spelers, twee tafels en een hoop strategie. Het bleef spannend tot de allerlaatste beurt, maar uiteindelijk ging Noor er met de wisselbeker vandoor. Gefeliciteerd!',
      gallery: 'galleryBordspel',
      reactions: { '🎲': 7, '🏆': 5 },
      comments: [
        { by: 'noor', text: 'Ik zeg niks, maar die wisselbeker staat wel heel mooi op mijn bureau.', at: day(-21) },
        { by: 'mees', text: 'Revanche volgende maand. Ik ben al aan het oefenen.', at: day(-20) },
      ],
    },
    {
      id: 'singelloop-utrecht',
      kind: 'hardlopen', category: 'sport',
      title: 'Singelloop Utrecht',
      date: day(-26), time: '13:00', duration: 'Middag',
      location: 'Singel, Utrecht', address: '',
      image: 'galleryRun', organizer: 'lucas',
      attendees: ['lucas', 'fleur', 'milan', 'sophie', 'tim', 'eva', 'mees', 'emma', 'daan'],
      transport: true,
      description: 'Met negen collega’s stonden we aan de start van de 5 en 10 kilometer. Er werd flink gestreden, maar iedereen kwam over de finish. Een paar van ons zelfs met een persoonlijk record.',
      gallery: 'galleryRun',
      reactions: { '🏃': 8, '💪': 7, '🏅': 6 },
      comments: [
        { by: 'sophie', text: 'Persoonlijk record! Dat komt echt door de lunchruns.', at: day(-26) },
        { by: 'tim', text: 'Volgend jaar met een ANWB-teamshirt?', at: day(-25) },
        { by: 'lucas', text: 'Goed idee Tim, ik ga het regelen.', at: day(-25) },
      ],
    },
  ];
}
