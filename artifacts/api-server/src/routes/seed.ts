import { db } from "@workspace/db";
import {
  vehiclesTable,
  blogPostsTable,
  toursTable,
  servicesTable,
  type BlogContentBlock,
  type TourHighlight,
  type TourItineraryDay,
  type LangMap,
  type LocalizedString,
} from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const VEHICLES = [
  {
    code: "LC300-01", name: "Land Cruiser 300", model: "Toyota Land Cruiser 300", type: "LC300",
    year: 2022, pax: 7, pricePerDay: 120, sortOrder: 1,
    description: "The Land Cruiser 300 series delivers modern luxury with an imposing presence — ideal for VIP airport transfers and high-end executive travel.",
    features: ["AC", "WiFi", "Professional Driver", "Luggage Space", "VIP Interior"],
    mainImage: "/lc-hero.png",
    gallery: [
      "/lc-hero.png",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=85",
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=1200&q=85",
    ],
  },
  {
    code: "LC300-02", name: "Land Cruiser 300", model: "Toyota Land Cruiser 300", type: "LC300",
    year: 2022, pax: 7, pricePerDay: 120, sortOrder: 2,
    description: "A second LC300 in the fleet, configured for VIP convoys and back-to-back airport transfers.",
    features: ["AC", "WiFi", "Professional Driver", "Luggage Space", "VIP Interior"],
    mainImage: "/lc-hero.png",
    gallery: ["/lc-hero.png"],
  },
  {
    code: "LC300-03", name: "Land Cruiser 300", model: "Toyota Land Cruiser 300", type: "LC300",
    year: 2023, pax: 7, pricePerDay: 120, sortOrder: 3,
    description: "The newest addition to our LC300 line — pristine interior, low mileage, ideal for executive clients.",
    features: ["AC", "WiFi", "Professional Driver", "Luggage Space", "VIP Interior", "Leather Seats"],
    mainImage: "/lc-hero.png",
    gallery: ["/lc-hero.png"],
  },
  {
    code: "LC-PRADO-01", name: "Land Cruiser Prado", model: "Toyota Land Cruiser Prado", type: "LC-PRADO",
    year: 2021, pax: 6, pricePerDay: 100, sortOrder: 4,
    description: "The Prado combines off-road capability with refined comfort — perfect for mountain expeditions and tourism.",
    features: ["AC", "Professional Driver", "Luggage Space", "Off-Road Capability"],
    mainImage: "/lc-hero.png",
    gallery: ["/lc-hero.png"],
  },
  {
    code: "LC-PRADO-02", name: "Land Cruiser Prado", model: "Toyota Land Cruiser Prado", type: "LC-PRADO",
    year: 2021, pax: 6, pricePerDay: 100, sortOrder: 5,
    description: "Second Prado configured for tourism routes through the Pamir Highway and Fann Mountains.",
    features: ["AC", "Professional Driver", "Luggage Space", "Off-Road Capability"],
    mainImage: "/lc-hero.png",
    gallery: ["/lc-hero.png"],
  },
  {
    code: "LC-PRADO-03", name: "Land Cruiser Prado", model: "Toyota Land Cruiser Prado", type: "LC-PRADO",
    year: 2022, pax: 6, pricePerDay: 100, sortOrder: 6,
    description: "Newest Prado in the fleet — ideal for client convoys and family tourism trips.",
    features: ["AC", "Professional Driver", "Luggage Space", "Off-Road Capability"],
    mainImage: "/lc-hero.png",
    gallery: ["/lc-hero.png"],
  },
];

type SeedBlog = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  gallery: string[];
  location: string;
  date: string;
  readTime: string;
  category: string;
  content: BlogContentBlock[];
};

const BLOG_POSTS: SeedBlog[] = [
  {
    slug: "pamir-highway-seven-day-odyssey",
    title: "The Pamir Highway: A Seven-Day Odyssey Across the Roof of the World",
    excerpt: "From Dushanbe to the high-altitude lakes of the Wakhan Corridor — an unhurried journey through one of the most dramatic mountain roads on earth.",
    cover: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&q=85",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1400&q=85",
    ],
    location: "Pamir Highway, GBAO",
    date: "May 8, 2026",
    readTime: "9 min read",
    category: "Mountain Journeys",
    content: [
      { type: "paragraph", text: "There are roads, and then there is the M41. Climbing from the green valleys of the Vakhsh basin to passes above 4,600 metres, the Pamir Highway has earned its title as the second-highest international road in the world — and one of the last truly cinematic overland journeys left on the planet." },
      { type: "heading", text: "Day One — Dushanbe to Kalaikhum" },
      { type: "paragraph", text: "Our guests are met at Dushanbe International by a freshly detailed Land Cruiser 300, bottled water, cool towels, and a chilled welcome basket. From the capital we trace the Vakhsh river east, the city giving way to apricot orchards and silver-roofed villages." },
      { type: "image", src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85", caption: "Sunset over the Vakhsh valley, an hour out of Dushanbe." },
      { type: "quote", text: "The mountains do not reveal themselves all at once. They earn your attention slowly, one switchback at a time." },
      { type: "heading", text: "Days Two & Three — Through the Wakhan" },
      { type: "paragraph", text: "The Wakhan Corridor is a thin sliver of Tajikistan tucked between Afghanistan and the Hindu Kush. Mud-brick villages, 11th-century Buddhist stupas, and hot springs steaming against the snowline make these two days the spiritual heart of any Pamir itinerary." },
      { type: "paragraph", text: "Our chauffeurs know which families serve the best tea in Langar, where to stop for a photograph of the Afghan ridgeline at first light, and how to time the crossing of Khargush Pass before the afternoon winds rise." },
      { type: "heading", text: "Days Four through Seven — Karakul, Murghab, Sary-Tash" },
      { type: "paragraph", text: "The high plateau is another country entirely. Yak herders, salt flats, and the impossible blue of Lake Karakul. We end at the Kyrgyz border in Sary-Tash with the Pamirs behind you and the Tien Shan ahead — a fitting horizon line for a week that recalibrates what travel can be." },
    ],
  },
  {
    slug: "iskanderkul-weekend",
    title: "A Weekend at Iskanderkul: Tajikistan's Alpine Mirror",
    excerpt: "Two days at Alexander's Lake — turquoise water, fortress ruins, and a private chauffeur who knows every viewpoint along the Fann Mountains.",
    cover: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=85",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1400&q=85",
    ],
    location: "Iskanderkul, Fann Mountains",
    date: "April 22, 2026",
    readTime: "6 min read",
    category: "Weekend Escapes",
    content: [
      { type: "paragraph", text: "Three hours northwest of Dushanbe, the Anzob Pass opens into the Fann Mountains — Tajikistan's most-photographed range and the home of Iskanderkul, a glacial lake said to be named after Alexander the Great himself." },
      { type: "heading", text: "Saturday — Arrival and the Fann Approach" },
      { type: "paragraph", text: "We collect guests at 7:00 AM with breakfast already packed: warm non bread, fresh kaymak, and Tajik green tea. The new Anzob tunnel makes the drive smoother than ever, but our drivers know the four classic photo stops along the old switchback road for those who prefer the scenic route." },
      { type: "image", src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=85", caption: "Morning light on the Fann Mountains as the road climbs toward Anzob Pass." },
      { type: "heading", text: "Sunday — Lakeside Mornings" },
      { type: "paragraph", text: "There is no luxury quite like waking beside an alpine lake with no agenda. We arrange a private boat at sunrise, a lakeside breakfast, and an unhurried return to the capital — chauffeur on standby, climate set to your preference." },
    ],
  },
  {
    slug: "vip-airport-transfer-experience",
    title: "What VIP Airport Transfer Really Means in Dushanbe",
    excerpt: "Behind the scenes of the Pamir Luxe meet-and-greet: from immigration fast-track coordination to the cool towel waiting on your back seat.",
    cover: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=85",
    gallery: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1400&q=85"],
    location: "Dushanbe International Airport",
    date: "April 5, 2026",
    readTime: "4 min read",
    category: "VIP Experiences",
    content: [
      { type: "paragraph", text: "A VIP transfer is not simply a car. It is a sequence of quiet, well-rehearsed details that begin the moment your flight clears Tajik airspace and end only when the door of your hotel suite closes behind you." },
      { type: "heading", text: "Before You Land" },
      { type: "paragraph", text: "Our team monitors your flight in real time. Your chauffeur is positioned thirty minutes before the published landing slot — never late, never visible until you need them. Your preferred bottled water, cabin temperature, and music are already set." },
      { type: "heading", text: "The Quiet Walk" },
      { type: "paragraph", text: "A discreet PLD-uniformed greeter meets you the moment you exit immigration with your name held at chest height in a leather folio. Luggage assistance is silent and immediate. The walk to the vehicle takes under two minutes." },
      { type: "quote", text: "Luxury, in the end, is the absence of friction." },
    ],
  },
  {
    slug: "wedding-fleet-pamir-style",
    title: "A Pamir Wedding: Coordinating a Six-Vehicle Procession",
    excerpt: "How we delivered the bride, the groom, and a dozen relatives across three venues in a single afternoon — with not a minute lost.",
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&q=85",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1400&q=85",
    ],
    location: "Dushanbe & Varzob Valley",
    date: "March 18, 2026",
    readTime: "5 min read",
    category: "Client Stories",
    content: [
      { type: "paragraph", text: "Tajik weddings are large, joyful, and tightly choreographed. When the Karimov family asked us to handle transport for their daughter's three-venue celebration, we mobilised the entire fleet — six Land Cruisers, six chauffeurs, one operations lead in a chase vehicle." },
      { type: "heading", text: "The Plan" },
      { type: "paragraph", text: "A walked rehearsal the day before. Vehicles polished overnight. White ribbons fitted to the LC300s for the bride and groom; the LC200s assigned to immediate family. Radio check at 09:00 sharp." },
      { type: "image", src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1400&q=85", caption: "The procession crossing the Varzob river en route to the reception." },
      { type: "heading", text: "The Day" },
      { type: "paragraph", text: "Three venues, forty-two guests, zero late arrivals. The mother of the bride later wrote that the cars were the calmest thing about her entire wedding day. We can think of no higher compliment." },
    ],
  },
  {
    slug: "fann-photography-itinerary",
    title: "A Photographer's Five-Day Itinerary Through the Fann Mountains",
    excerpt: "Golden hour at Kulikalon, the seven lakes of Marguzor, and the iron ore reds of Pendjikent — built around the light, not the clock.",
    cover: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=1400&q=85",
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1400&q=85",
    ],
    location: "Fann Mountains & Zeravshan Valley",
    date: "February 28, 2026",
    readTime: "7 min read",
    category: "Tourist Adventures",
    content: [
      { type: "paragraph", text: "Most operators build itineraries around accommodation. We build ours around light. For a serious landscape photographer, the difference is everything." },
      { type: "heading", text: "Day 1 — Kulikalon Basin" },
      { type: "paragraph", text: "Pre-dawn departure from Artuch. Our drivers know exactly where to position you for the first ridge of light to strike Bodkhona — at 4,400 metres, one of the most spectacular pinnacles in Central Asia." },
      { type: "heading", text: "Days 2–4 — The Seven Lakes of Marguzor" },
      { type: "paragraph", text: "Each lake has its own colour, from emerald Mizhgon to black Khazorchashma. We move slowly, on your schedule, with the vehicle as a mobile basecamp — tea, charging cables, and a chauffeur who will wait six hours for the cloud to break if that is what the shot requires." },
    ],
  },
  {
    slug: "winter-in-pamirs",
    title: "Winter in the Pamirs: Why the Quiet Season Is the Best Season",
    excerpt: "Frozen waterfalls, empty roads, and a sky so clear you can read by starlight. A January chronicle from Murghab.",
    cover: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=1600&q=85",
    gallery: ["https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1400&q=85"],
    location: "Murghab, Eastern Pamirs",
    date: "January 30, 2026",
    readTime: "8 min read",
    category: "Mountain Journeys",
    content: [
      { type: "paragraph", text: "Conventional wisdom says the Pamirs close in winter. Conventional wisdom is wrong. The high plateau, dry and wind-scoured, is more accessible in January than the muddy shoulder seasons — and infinitely more beautiful." },
      { type: "heading", text: "The Cold, Honestly" },
      { type: "paragraph", text: "Daytime temperatures hover at minus fifteen. Our LC300s run on winter-grade diesel with engine block heaters; chauffeurs carry oxygen, satellite phones, and the kind of calm that comes from a decade of high-altitude driving." },
      { type: "quote", text: "There is a particular silence in the Pamirs in January. You don't hear it so much as feel it settle on your shoulders." },
    ],
  },
];

type SeedTour = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  duration: string;
  durationDays: number;
  startingPrice: number;
  route: string;
  mainImage: string;
  gallery: string[];
  highlights: TourHighlight[];
  itinerary: TourItineraryDay[];
  included: string[];
  sortOrder: number;
};

const TOURS: SeedTour[] = [
  {
    slug: "dushanbe-pamir-tour",
    title: "Dushanbe → Pamir Tour",
    shortDescription:
      "A seven-day chauffeured journey across the roof of the world — from the capital to the high lakes of the Wakhan.",
    description:
      "Trace the legendary Pamir Highway in a freshly detailed Land Cruiser 300, with a professional VIP chauffeur, curated stops, and unhurried mornings at altitude. We handle every logistic so you can focus on the landscape.",
    duration: "7 Days · 6 Nights",
    durationDays: 7,
    startingPrice: 2400,
    route: "Dushanbe → Kalaikhum → Khorog → Wakhan → Murghab → Karakul → Sary-Tash",
    mainImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&q=85",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1400&q=85",
    ],
    highlights: [
      { title: "Wakhan Corridor", body: "Two unhurried days through the most cinematic valley in Central Asia." },
      { title: "Lake Karakul", body: "Sunrise on the impossible blue of a 3,900-metre alpine lake." },
      { title: "Private LC300", body: "Freshly detailed Land Cruiser 300 with VIP chauffeur for the full route." },
    ],
    itinerary: [
      { day: 1, title: "Dushanbe → Kalaikhum", body: "Airport pickup, welcome basket, and a scenic drive east along the Vakhsh river to overnight in Kalaikhum." },
      { day: 2, title: "Kalaikhum → Khorog", body: "The dramatic Panj river border road, with photo stops above the Afghan ridgeline." },
      { day: 3, title: "Wakhan Corridor", body: "Mud-brick villages, Buddhist stupas, and a hot-spring stop at Bibi Fatima." },
      { day: 4, title: "Khargush Pass → Murghab", body: "Crossing onto the high plateau before the afternoon winds rise." },
      { day: 5, title: "Murghab → Lake Karakul", body: "Yak herders, salt flats, and sunset over Karakul." },
      { day: 6, title: "Karakul → Sary-Tash", body: "Final pass with the Pamirs behind and the Tien Shan ahead." },
      { day: 7, title: "Return transfer", body: "Comfortable transfer back to Dushanbe or onward handover at the Kyrgyz border." },
    ],
    included: [
      "Private Land Cruiser 300 + VIP chauffeur",
      "All fuel and road permits",
      "Bottled water and welcome basket daily",
      "Hand-picked guesthouses and homestays",
      "Daily breakfast",
      "24/7 operations support",
    ],
    sortOrder: 1,
  },
  {
    slug: "dushanbe-khujand-tour",
    title: "Dushanbe → Khujand Tour",
    shortDescription:
      "Three-day cultural drive across the Anzob tunnel to the ancient Silk Road capital of northern Tajikistan.",
    description:
      "From the modern capital to one of Central Asia's oldest continuously inhabited cities. Stop at Iskanderkul on the way, walk Khujand's Panjshanbe bazaar, and return through the Fann Mountains in luxury comfort.",
    duration: "3 Days · 2 Nights",
    durationDays: 3,
    startingPrice: 980,
    route: "Dushanbe → Iskanderkul → Khujand → Istaravshan → Dushanbe",
    mainImage:
      "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=85",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1400&q=85",
    ],
    highlights: [
      { title: "Iskanderkul Lake", body: "An afternoon at Alexander's turquoise lake in the Fann Mountains." },
      { title: "Panjshanbe Bazaar", body: "The most atmospheric covered market in Central Asia." },
      { title: "Anzob Tunnel", body: "The modern engineering marvel that links the two halves of the country." },
    ],
    itinerary: [
      { day: 1, title: "Dushanbe → Iskanderkul → Khujand", body: "Morning departure with breakfast, lakeside lunch, and arrival in Khujand by evening." },
      { day: 2, title: "Khujand exploration", body: "Panjshanbe bazaar, the Khujand fortress, and the historical museum with a private guide." },
      { day: 3, title: "Khujand → Istaravshan → Dushanbe", body: "A stop in the medieval town of Istaravshan before the scenic drive home." },
    ],
    included: [
      "Private Land Cruiser + VIP chauffeur",
      "All fuel and road tolls",
      "Bottled water and refreshments",
      "Boutique hotel in Khujand (2 nights)",
      "Daily breakfast",
      "Local guide on day 2",
    ],
    sortOrder: 2,
  },
];

type SeedService = {
  slug: string;
  iconName: string;
  image: string;
  title: string;
  titleI18n: LangMap;
  shortDescription: string;
  shortDescriptionI18n: LangMap;
  description: string;
  descriptionI18n: LangMap;
  bullets: LocalizedString[];
  isVisaSupport: boolean;
  sortOrder: number;
};

const SERVICES: SeedService[] = [
  {
    slug: "visa-support",
    iconName: "FileCheck",
    image: "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?auto=format&fit=crop&w=1400&q=80",
    title: "Visa Support",
    titleI18n: { ru: "Визовая поддержка", tj: "Дастгирии раводид", uz: "Viza yordami" },
    shortDescription: "Guidance and assistance with Tajikistan e-visas, invitation letters and GBAO permits.",
    shortDescriptionI18n: {
      ru: "Помощь с электронными визами Таджикистана, письмами-приглашениями и разрешениями ГБАО.",
      tj: "Кӯмак дар гирифтани раводиди электронӣ, мактуби даъват ва иҷозатномаи ВМКБ.",
      uz: "Tojikiston e-vizalari, taklifnomalar va GBAO ruxsatnomalari bo'yicha yordam.",
    },
    description: "We help international guests navigate Tajikistan's entry requirements with confidence — from selecting the right visa category to securing the GBAO permit for Pamir travel.",
    descriptionI18n: {
      ru: "Мы помогаем иностранным гостям уверенно пройти процедуру въезда в Таджикистан — от выбора правильной категории визы до получения разрешения ГБАО для путешествий по Памиру.",
      tj: "Мо ба меҳмонони хориҷӣ дар роҳ кардани талаботи воридшавӣ ба Тоҷикистон кӯмак мерасонем — аз интихоби категорияи дурусти раводид то гирифтани иҷозатномаи ВМКБ барои сафар ба Помир.",
      uz: "Biz xalqaro mehmonlarga Tojikistonga kirish talablarini ishonch bilan bajarishda yordam beramiz — to'g'ri viza turini tanlashdan tortib Pomir sayohati uchun GBAO ruxsatnomasini olishgacha.",
    },
    bullets: [
      { en: "E-visa application guidance and document review", ru: "Помощь с подачей заявки на электронную визу и проверка документов", tj: "Дастгирӣ дар пешниҳоди раводиди электронӣ ва тафтиши ҳуҷҷатҳо", uz: "E-viza arizasi bo'yicha yordam va hujjatlarni tekshirish" },
      { en: "Invitation letter coordination where required", ru: "Координация писем-приглашений при необходимости", tj: "Ҳамоҳангсозии мактуби даъват дар ҳолати зарурӣ", uz: "Zarur bo'lganda taklifnoma muvofiqlashtirish" },
      { en: "GBAO permit assistance for Pamir routes", ru: "Помощь с разрешением ГБАО для маршрутов по Памиру", tj: "Кӯмак барои гирифтани иҷозатномаи ВМКБ", uz: "Pomir yo'nalishlari uchun GBAO ruxsatnomasi yordami" },
      { en: "Pre-arrival briefing and timeline planning", ru: "Брифинг до прибытия и планирование сроков", tj: "Машварати пеш аз омадан ва банақшагирии муҳлат", uz: "Kelishdan oldin brifing va vaqt rejalashtirish" },
    ],
    isVisaSupport: true,
    sortOrder: 1,
  },
  {
    slug: "airport-transfers",
    iconName: "Plane",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=80",
    title: "Airport Transfers",
    titleI18n: { ru: "Трансфер из аэропорта", tj: "Интиқол аз фурудгоҳ", uz: "Aeroport transferi" },
    shortDescription: "Premium meet-and-greet transfers from Dushanbe International Airport and regional airfields.",
    shortDescriptionI18n: {
      ru: "Премиум-встреча и трансфер из международного аэропорта Душанбе и региональных аэродромов.",
      tj: "Пешвоз ва интиқоли премиум аз фурудгоҳи байналмилалии Душанбе ва фурудгоҳҳои минтақавӣ.",
      uz: "Dushanbe Xalqaro aeroporti va mintaqaviy aerodromlardan premium kutib olish va transfer.",
    },
    description: "Begin your journey the moment you land. Our chauffeurs greet you at the gate, assist with luggage and escort you to a sanitised luxury vehicle.",
    descriptionI18n: {
      ru: "Начните путешествие в момент посадки. Наши водители встречают вас у выхода, помогают с багажом и сопровождают к продезинфицированному автомобилю премиум-класса.",
      tj: "Сафари худро аз лаҳзаи фуруд омадан оғоз кунед. Ронандагони мо шуморо дар хуруҷ пешвоз мегиранд, бо бағоҷ кӯмак мекунанд ва то мошини боҳашамат ҳамроҳӣ мекунанд.",
      uz: "Sayohatingizni qo'nish paytidan boshlang. Haydovchilarimiz sizni darvozada kutib oladi, yuk bilan yordam beradi va dezinfeksiya qilingan hashamatli avtomobilga kuzatib boradi.",
    },
    bullets: [
      { en: "Meet-and-greet at the gate with name board", ru: "Встреча у выхода с табличкой с именем", tj: "Пешвоз дар хуруҷ бо лавҳаи ном", uz: "Darvozada ism yozuvi bilan kutib olish" },
      { en: "Flight tracking and complimentary wait time", ru: "Отслеживание рейса и бесплатное время ожидания", tj: "Пайгирии парвоз ва вақти интизории ройгон", uz: "Reysni kuzatish va bepul kutish vaqti" },
      { en: "Premium SUVs and sedans, refreshments included", ru: "Премиум-внедорожники и седаны, напитки включены", tj: "Мошинҳои боҳашамат, нӯшокиҳо дохил карда шудаанд", uz: "Premium SUV va sedanlar, ichimliklar bilan" },
      { en: "Available 24/7 across Tajikistan's airports", ru: "Доступно 24/7 во всех аэропортах Таджикистана", tj: "24/7 дар ҳамаи фурудгоҳҳои Тоҷикистон дастрас", uz: "Tojikiston aeroportlarida 24/7 mavjud" },
    ],
    isVisaSupport: false,
    sortOrder: 2,
  },
  {
    slug: "private-chauffeur",
    iconName: "UserSquare",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1400&q=80",
    title: "Private Chauffeur Service",
    titleI18n: { ru: "Личный водитель", tj: "Хидмати ронандаи шахсӣ", uz: "Shaxsiy haydovchi xizmati" },
    shortDescription: "Hourly or daily chauffeured transport with a multilingual professional driver.",
    shortDescriptionI18n: {
      ru: "Почасовой или посуточный транспорт с многоязычным профессиональным водителем.",
      tj: "Нақлиёт бо ронандаи касбии бисёрзабона дар асоси соатона ё рӯзона.",
      uz: "Soatlik yoki kunlik ko'p tilli professional haydovchi bilan transport.",
    },
    description: "Travel on your own schedule with a discreet, English-speaking chauffeur and a vehicle reserved exclusively for you.",
    descriptionI18n: {
      ru: "Путешествуйте по собственному расписанию с тактичным англоговорящим водителем и автомобилем, зарезервированным исключительно для вас.",
      tj: "Бо ҷадвали худатон бо ронандаи мулоими англисизабон ва мошине, ки танҳо барои шумо банд карда шудааст, сафар кунед.",
      uz: "O'z jadvalingizda nazokatli, ingliz tilida so'zlashadigan haydovchi va faqat siz uchun ajratilgan avtomobil bilan sayohat qiling.",
    },
    bullets: [
      { en: "Hourly, half-day or full-day bookings", ru: "Бронирование на час, полдня или целый день", tj: "Брони барои соат, ним рӯз ё як рӯз", uz: "Soatlik, yarim kun yoki kunlik buyurtma" },
      { en: "Multilingual chauffeurs (EN / RU / TJ / UZ)", ru: "Многоязычные водители (EN / RU / TJ / UZ)", tj: "Ронандагони бисёрзабон (EN / RU / TJ / UZ)", uz: "Ko'p tilli haydovchilar (EN / RU / TJ / UZ)" },
      { en: "Top-spec Toyota Land Cruiser fleet", ru: "Парк Toyota Land Cruiser в топовой комплектации", tj: "Парки Toyota Land Cruiser-и сатҳи баланд", uz: "Yuqori darajadagi Toyota Land Cruiser parki" },
      { en: "Personal itinerary and on-route changes", ru: "Личный маршрут и изменения по пути", tj: "Маршрути шахсӣ ва тағйирот дар роҳ", uz: "Shaxsiy yo'nalish va yo'l davomida o'zgarishlar" },
    ],
    isVisaSupport: false,
    sortOrder: 3,
  },
  {
    slug: "hotel-booking",
    iconName: "Hotel",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
    title: "Hotel & Apartment Booking",
    titleI18n: { ru: "Бронирование отелей и апартаментов", tj: "Брон кардани меҳмонхона ва манзил", uz: "Mehmonxona va kvartira buyurtmasi" },
    shortDescription: "Curated stays at premium hotels and serviced apartments across Tajikistan.",
    shortDescriptionI18n: {
      ru: "Подобранное проживание в премиум-отелях и сервисных апартаментах по всему Таджикистану.",
      tj: "Манзилҳои интихобшуда дар меҳмонхонаҳои боҳашамат ва манзилҳои хидматрасон дар саросари Тоҷикистон.",
      uz: "Tojikiston bo'ylab premium mehmonxonalar va xizmat ko'rsatuvchi kvartiralarda saralangan turar joy.",
    },
    description: "Skip the search. We secure verified premium accommodation in Dushanbe, Khujand, Khorog and the regions, negotiated at the best available rate.",
    descriptionI18n: {
      ru: "Не тратьте время на поиск. Мы подберём проверенное премиум-жильё в Душанбе, Худжанде, Хороге и регионах по лучшим ценам.",
      tj: "Вақтро барои ҷустуҷӯ сарф накунед. Мо манзили боэътимоди боҳашамат дар Душанбе, Хуҷанд, Хоруғ ва минтақаҳо бо беҳтарин нархҳо пешниҳод мекунем.",
      uz: "Qidiruvga vaqt sarflamang. Biz Dushanbe, Xo'jand, Xorug' va viloyatlarda tekshirilgan premium turar joyni eng yaxshi narxlarda taqdim etamiz.",
    },
    bullets: [
      { en: "Verified 4★ and 5★ hotel partners", ru: "Проверенные партнёры 4★ и 5★ отелей", tj: "Шарикони боэътимоди меҳмонхонаҳои 4★ ва 5★", uz: "Tekshirilgan 4★ va 5★ mehmonxona hamkorlari" },
      { en: "Serviced apartments for longer stays", ru: "Сервисные апартаменты для длительного проживания", tj: "Манзилҳои хидматрасон барои иқомати дарозмуддат", uz: "Uzoq muddat uchun xizmat ko'rsatuvchi kvartiralar" },
      { en: "VIP check-in and category upgrades when available", ru: "VIP-заселение и повышение категории при возможности", tj: "Сабтиномии VIP ва баланд бардоштани категория", uz: "VIP ro'yxatdan o'tish va imkon bo'lsa darajani oshirish" },
      { en: "Single point of contact throughout your stay", ru: "Единый контакт на протяжении всего пребывания", tj: "Нуқтаи ягонаи тамос дар тӯли иқомат", uz: "Sayohat davomida bitta aloqa nuqtasi" },
    ],
    isVisaSupport: false,
    sortOrder: 4,
  },
  {
    slug: "tour-guides",
    iconName: "Compass",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80",
    title: "Professional Tour Guides",
    titleI18n: { ru: "Профессиональные гиды", tj: "Роҳбаладони касбӣ", uz: "Professional gidlar" },
    shortDescription: "Licensed, multilingual guides with deep knowledge of Tajik history and culture.",
    shortDescriptionI18n: {
      ru: "Лицензированные многоязычные гиды с глубоким знанием истории и культуры Таджикистана.",
      tj: "Роҳбаладони иҷозатномадор бо донишҳои амиқ дар таърих ва фарҳанги Тоҷикистон.",
      uz: "Tojikiston tarixi va madaniyatini chuqur biladigan litsenziyalangan ko'p tilli gidlar.",
    },
    description: "Discover Tajikistan with a licensed local guide who brings every fortress, bazaar and mountain pass to life.",
    descriptionI18n: {
      ru: "Откройте для себя Таджикистан с лицензированным местным гидом, который оживит каждую крепость, базар и горный перевал.",
      tj: "Тоҷикистонро бо роҳбалади маҳаллии иҷозатномадор кашф кунед, ки ҳар як қалъа, бозор ва ағбаро зинда мекунад.",
      uz: "Har bir qal'a, bozor va tog' dovonini jonlantiruvchi litsenziyalangan mahalliy gid bilan Tojikistonni kashf eting.",
    },
    bullets: [
      { en: "Licensed, vetted and personally interviewed", ru: "Лицензированные, проверенные и лично собеседованные", tj: "Иҷозатномадор, санҷидашуда ва шахсан мусоҳибашуда", uz: "Litsenziyalangan, tekshirilgan va shaxsan suhbatlashilgan" },
      { en: "EN, RU, TJ, UZ — additional languages on request", ru: "EN, RU, TJ, UZ — другие языки по запросу", tj: "EN, RU, TJ, UZ — забонҳои дигар бо дархост", uz: "EN, RU, TJ, UZ — qo'shimcha tillar so'rov bo'yicha" },
      { en: "Specialists in history, gastronomy and trekking", ru: "Специалисты по истории, гастрономии и треккингу", tj: "Мутахассисон оид ба таърих, гастрономия ва кӯҳнавардӣ", uz: "Tarix, gastronomiya va trekking bo'yicha mutaxassislar" },
      { en: "Custom thematic and family-friendly itineraries", ru: "Тематические и семейные маршруты на заказ", tj: "Маршрутҳои мавзӯӣ ва оилавӣ ба фармоиш", uz: "Maxsus tematik va oilaviy yo'nalishlar" },
    ],
    isVisaSupport: false,
    sortOrder: 5,
  },
  {
    slug: "vip-transportation",
    iconName: "Crown",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
    title: "VIP Transportation",
    titleI18n: { ru: "VIP-транспорт", tj: "Нақлиёти VIP", uz: "VIP transport" },
    shortDescription: "Discreet, high-security transport for diplomats, executives and dignitaries.",
    shortDescriptionI18n: {
      ru: "Конфиденциальный транспорт повышенной безопасности для дипломатов, руководителей и высокопоставленных лиц.",
      tj: "Нақлиёти махфӣ бо амнияти баланд барои дипломатҳо, роҳбарон ва шахсони расмӣ.",
      uz: "Diplomatlar, rahbarlar va yuqori martabali shaxslar uchun maxfiy, yuqori xavfsiz transport.",
    },
    description: "Confidential ground transport for officials and high-profile guests, coordinated by a dedicated account manager.",
    descriptionI18n: {
      ru: "Конфиденциальный наземный транспорт для официальных лиц и VIP-гостей, координируемый персональным менеджером.",
      tj: "Нақлиёти махфии заминӣ барои шахсони расмӣ ва меҳмонони сатҳи баланд, ки аз ҷониби менеҷери шахсӣ ҳамоҳанг карда мешавад.",
      uz: "Mansabdor shaxslar va yuqori martabali mehmonlar uchun shaxsiy menejer tomonidan muvofiqlashtirilgan maxfiy transport.",
    },
    bullets: [
      { en: "Convoy and lead-car options on request", ru: "Сопровождение и головная машина по запросу", tj: "Имкониятҳои конвой ва мошини пешбар бо дархост", uz: "So'rov bo'yicha konvoy va boshlovchi avtomobil" },
      { en: "NDA-bound chauffeurs and account team", ru: "Водители и команда под NDA", tj: "Ронандагон ва дастаи ба NDA баста", uz: "NDA bilan bog'langan haydovchilar va jamoa" },
      { en: "Coordination with personal security details", ru: "Координация с личной охраной", tj: "Ҳамоҳангӣ бо муҳофизати шахсӣ", uz: "Shaxsiy xavfsizlik bilan muvofiqlashtirish" },
      { en: "Priority dispatch and back-up vehicles", ru: "Приоритетная подача и резервные автомобили", tj: "Фиристодани афзалиятнок ва мошинҳои захиравӣ", uz: "Ustuvor jo'natish va zaxira transportlari" },
    ],
    isVisaSupport: false,
    sortOrder: 6,
  },
  {
    slug: "custom-travel",
    iconName: "Map",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=80",
    title: "Custom Travel Planning",
    titleI18n: { ru: "Индивидуальное планирование путешествий", tj: "Банақшагирии сафари инфиродӣ", uz: "Individual sayohat rejalashtirish" },
    shortDescription: "Bespoke multi-day itineraries tailored to your interests, pace and budget.",
    shortDescriptionI18n: {
      ru: "Индивидуальные многодневные маршруты, адаптированные под ваши интересы, темп и бюджет.",
      tj: "Маршрутҳои бисёррӯзаи фармоишӣ, мутобиқ ба манфиатҳо, суръат ва буҷети шумо.",
      uz: "Sizning qiziqishlaringiz, sur'atingiz va byudjetingizga moslashtirilgan ko'p kunlik yo'nalishlar.",
    },
    description: "From a long weekend in the Fann Mountains to a two-week Silk Road expedition — we design and operate the entire journey for you.",
    descriptionI18n: {
      ru: "От длинных выходных в Фанских горах до двухнедельной экспедиции по Шёлковому пути — мы спроектируем и проведём всё путешествие для вас.",
      tj: "Аз истироҳати дарози охири ҳафта дар Кӯҳҳои Фон то экспедитсияи дуҳафтаинаи Роҳи Абрешим — мо тамоми сафарро барои шумо тарҳрезӣ ва ташкил мекунем.",
      uz: "Fann tog'larida uzoq dam olishdan tortib, ikki haftalik Ipak Yo'li ekspeditsiyasigacha — biz butun sayohatni siz uchun tashkil etamiz.",
    },
    bullets: [
      { en: "One-on-one itinerary consultation", ru: "Индивидуальная консультация по маршруту", tj: "Машварати инфиродӣ оид ба маршрут", uz: "Yo'nalish bo'yicha individual maslahat" },
      { en: "Hotels, meals, permits and transport handled", ru: "Отели, питание, разрешения и транспорт — всё включено", tj: "Меҳмонхонаҳо, хӯрок, иҷозатнома ва нақлиёт — ҳама ҳал шудааст", uz: "Mehmonxonalar, ovqat, ruxsatnomalar va transport bilan shug'ullanamiz" },
      { en: "Adventure, cultural and family-friendly tracks", ru: "Приключенческие, культурные и семейные маршруты", tj: "Маршрутҳои саргузаштӣ, фарҳангӣ ва оилавӣ", uz: "Sarguzasht, madaniy va oilaviy yo'nalishlar" },
      { en: "Real-time concierge support during your trip", ru: "Поддержка консьержа в реальном времени во время поездки", tj: "Дастгирии консерж дар вақти воқеӣ ҳангоми сафар", uz: "Sayohat davomida real vaqtda konserj yordami" },
    ],
    isVisaSupport: false,
    sortOrder: 7,
  },
  {
    slug: "city-tours",
    iconName: "Building2",
    image: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1400&q=80",
    title: "City Tours",
    titleI18n: { ru: "Городские туры", tj: "Сайёҳати шаҳр", uz: "Shahar sayohatlari" },
    shortDescription: "Half- and full-day private tours of Dushanbe, Khujand, Istaravshan and Khorog.",
    shortDescriptionI18n: {
      ru: "Полу- и полнодневные частные туры по Душанбе, Худжанду, Истаравшану и Хорогу.",
      tj: "Сайёҳатҳои хусусии ним ва пурра рӯзи Душанбе, Хуҷанд, Истаравшан ва Хоруғ.",
      uz: "Dushanbe, Xo'jand, Istaravshan va Xorug' bo'ylab yarim va to'liq kunlik xususiy sayohatlar.",
    },
    description: "See the highlights — and the hidden corners — of Tajikistan's most storied cities with a private guide and chauffeur.",
    descriptionI18n: {
      ru: "Откройте достопримечательности — и скрытые уголки — самых известных городов Таджикистана с личным гидом и водителем.",
      tj: "Манзараҳои асосӣ — ва кунҷҳои пинҳониро — шаҳрҳои машҳуртарини Тоҷикистонро бо роҳбалад ва ронандаи шахсӣ бубинед.",
      uz: "Shaxsiy gid va haydovchi bilan Tojikistonning eng mashhur shaharlarining diqqatga sazovor joylarini va yashirin burchaklarini ko'ring.",
    },
    bullets: [
      { en: "Private vehicle and licensed guide", ru: "Личный автомобиль и лицензированный гид", tj: "Мошини шахсӣ ва роҳбалади иҷозатномадор", uz: "Shaxsiy avtomobil va litsenziyalangan gid" },
      { en: "Curated cultural and culinary stops", ru: "Тщательно подобранные культурные и кулинарные остановки", tj: "Истгоҳҳои интихобшудаи фарҳангӣ ва кулинарӣ", uz: "Tanlangan madaniy va kulinariya to'xtashlar" },
      { en: "Skip-the-line entries to key museums", ru: "Вход без очереди в ключевые музеи", tj: "Вуруди беэъфоф ба осорхонаҳои асосӣ", uz: "Asosiy muzeylarga navbatsiz kirish" },
      { en: "Flexible morning, afternoon or evening departures", ru: "Гибкие отправления утром, днём или вечером", tj: "Хатсайри субҳ, рӯз ё шом — мутобиқ ба шумо", uz: "Moslashuvchan ertalab, kunduzi yoki kechqurun jo'nashlar" },
    ],
    isVisaSupport: false,
    sortOrder: 8,
  },
  {
    slug: "business-travel",
    iconName: "Briefcase",
    image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=1400&q=80",
    title: "Business Travel Assistance",
    titleI18n: { ru: "Поддержка деловых поездок", tj: "Дастгирии сафарҳои корӣ", uz: "Biznes sayohat yordami" },
    shortDescription: "Corporate travel, meeting logistics and concierge support for executives in Tajikistan.",
    shortDescriptionI18n: {
      ru: "Корпоративные поездки, логистика встреч и поддержка консьержа для руководителей в Таджикистане.",
      tj: "Сафарҳои корпоративӣ, логистикаи вохӯриҳо ва дастгирии консерж барои роҳбарон дар Тоҷикистон.",
      uz: "Tojikistondagi rahbarlar uchun korporativ sayohat, uchrashuv logistikasi va konserj yordami.",
    },
    description: "A dedicated account team manages every detail of your business trip — from arrival to boardroom — so you can focus on the meeting.",
    descriptionI18n: {
      ru: "Выделенная команда менеджеров управляет каждой деталью вашей деловой поездки — от прибытия до зала заседаний — чтобы вы могли сосредоточиться на встрече.",
      tj: "Дастаи махсуси менеҷерон ҳар як ҷузъи сафари кории шуморо идора мекунад — аз омадан то утоқи маҷлис — то шумо ба вохӯрӣ диққат диҳед.",
      uz: "Maxsus jamoa biznes sayohatingizning har bir tafsilotini boshqaradi — kelishdan tortib uchrashuv xonasigacha — siz esa uchrashuvga e'tibor qaratasiz.",
    },
    bullets: [
      { en: "Dedicated account manager and 24/7 hotline", ru: "Персональный менеджер и горячая линия 24/7", tj: "Менеҷери шахсӣ ва хатти доғи 24/7", uz: "Shaxsiy menejer va 24/7 yordam liniyasi" },
      { en: "Meeting room sourcing and translator booking", ru: "Подбор переговорных и бронирование переводчика", tj: "Ҷустуҷӯи утоқи маҷлис ва брон кардани тарҷумон", uz: "Yig'ilish xonasini topish va tarjimon buyurtma qilish" },
      { en: "Group transport and event logistics", ru: "Групповой транспорт и логистика мероприятий", tj: "Нақлиёти гурӯҳӣ ва логистикаи чорабиниҳо", uz: "Guruh transporti va tadbirlar logistikasi" },
      { en: "Detailed expense reporting on request", ru: "Детальные отчёты о расходах по запросу", tj: "Ҳисоботи муфассали хароҷот бо дархост", uz: "So'rov bo'yicha batafsil xarajat hisoboti" },
    ],
    isVisaSupport: false,
    sortOrder: 9,
  },
];

export async function seedAll() {
  for (const v of VEHICLES) {
    const existing = await db.select().from(vehiclesTable).where(eq(vehiclesTable.code, v.code));
    if (existing.length === 0) {
      await db.insert(vehiclesTable).values({ ...v, status: "available" });
    } else {
      await db
        .update(vehiclesTable)
        .set({
          name: sql`CASE WHEN ${vehiclesTable.name} = '' THEN ${v.name} ELSE ${vehiclesTable.name} END`,
          year: sql`CASE WHEN ${vehiclesTable.year} = 2024 THEN ${v.year} ELSE ${vehiclesTable.year} END`,
          pricePerDay: sql`CASE WHEN ${vehiclesTable.pricePerDay} = 100 AND ${v.pricePerDay} <> 100 THEN ${v.pricePerDay} ELSE ${vehiclesTable.pricePerDay} END`,
          description: sql`CASE WHEN ${vehiclesTable.description} = '' THEN ${v.description} ELSE ${vehiclesTable.description} END`,
          mainImage: sql`CASE WHEN ${vehiclesTable.mainImage} = '' THEN ${v.mainImage} ELSE ${vehiclesTable.mainImage} END`,
          features: sql`CASE WHEN ${vehiclesTable.features} = '[]'::jsonb THEN ${JSON.stringify(v.features)}::jsonb ELSE ${vehiclesTable.features} END`,
          gallery: sql`CASE WHEN ${vehiclesTable.gallery} = '[]'::jsonb THEN ${JSON.stringify(v.gallery)}::jsonb ELSE ${vehiclesTable.gallery} END`,
          sortOrder: sql`CASE WHEN ${vehiclesTable.sortOrder} = 0 THEN ${v.sortOrder} ELSE ${vehiclesTable.sortOrder} END`,
        })
        .where(eq(vehiclesTable.code, v.code));
    }
  }
  for (const p of BLOG_POSTS) {
    const existing = await db.select().from(blogPostsTable).where(eq(blogPostsTable.slug, p.slug));
    if (existing.length === 0) {
      await db.insert(blogPostsTable).values({
        ...p,
        author: "Pamir Luxe Editorial",
        published: true,
      });
    }
  }
  for (const t of TOURS) {
    const existing = await db.select().from(toursTable).where(eq(toursTable.slug, t.slug));
    if (existing.length === 0) {
      await db.insert(toursTable).values({ ...t, featured: true, hidden: false });
    }
  }
  for (const s of SERVICES) {
    const existing = await db.select().from(servicesTable).where(eq(servicesTable.slug, s.slug));
    if (existing.length === 0) {
      await db.insert(servicesTable).values({ ...s, hidden: false });
    }
  }
}
