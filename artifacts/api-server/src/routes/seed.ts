import { db } from "@workspace/db";
import {
  vehiclesTable,
  blogPostsTable,
  toursTable,
  type BlogContentBlock,
  type TourHighlight,
  type TourItineraryDay,
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
}
