export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  gallery: string[];
  location: string;
  date: string;
  readTime: string;
  author: string;
  category: string;
  content: { type: "paragraph" | "heading" | "quote" | "image"; text?: string; src?: string; caption?: string }[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "pamir-highway-seven-day-odyssey",
    title: "The Pamir Highway: A Seven-Day Odyssey Across the Roof of the World",
    excerpt:
      "From Dushanbe to the high-altitude lakes of the Wakhan Corridor — an unhurried journey through one of the most dramatic mountain roads on earth.",
    cover:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&q=85",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1400&q=85",
    ],
    location: "Pamir Highway, GBAO",
    date: "May 8, 2026",
    readTime: "9 min read",
    author: "Pamir Luxe Editorial",
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
    excerpt:
      "Two days at Alexander's Lake — turquoise water, fortress ruins, and a private chauffeur who knows every viewpoint along the Fann Mountains.",
    cover:
      "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=85",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1400&q=85",
    ],
    location: "Iskanderkul, Fann Mountains",
    date: "April 22, 2026",
    readTime: "6 min read",
    author: "Pamir Luxe Editorial",
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
    excerpt:
      "Behind the scenes of the Pamir Luxe meet-and-greet: from immigration fast-track coordination to the cool towel waiting on your back seat.",
    cover:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1400&q=85",
    ],
    location: "Dushanbe International Airport",
    date: "April 5, 2026",
    readTime: "4 min read",
    author: "Pamir Luxe Editorial",
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
    excerpt:
      "How we delivered the bride, the groom, and a dozen relatives across three venues in a single afternoon — with not a minute lost.",
    cover:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&q=85",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1400&q=85",
    ],
    location: "Dushanbe & Varzob Valley",
    date: "March 18, 2026",
    readTime: "5 min read",
    author: "Pamir Luxe Editorial",
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
    excerpt:
      "Golden hour at Kulikalon, the seven lakes of Marguzor, and the iron ore reds of Pendjikent — built around the light, not the clock.",
    cover:
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=1400&q=85",
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1400&q=85",
    ],
    location: "Fann Mountains & Zeravshan Valley",
    date: "February 28, 2026",
    readTime: "7 min read",
    author: "Pamir Luxe Editorial",
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
    excerpt:
      "Frozen waterfalls, empty roads, and a sky so clear you can read by starlight. A January chronicle from Murghab.",
    cover:
      "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1400&q=85",
    ],
    location: "Murghab, Eastern Pamirs",
    date: "January 30, 2026",
    readTime: "8 min read",
    author: "Pamir Luxe Editorial",
    category: "Mountain Journeys",
    content: [
      { type: "paragraph", text: "Conventional wisdom says the Pamirs close in winter. Conventional wisdom is wrong. The high plateau, dry and wind-scoured, is more accessible in January than the muddy shoulder seasons — and infinitely more beautiful." },
      { type: "heading", text: "The Cold, Honestly" },
      { type: "paragraph", text: "Daytime temperatures hover at minus fifteen. Our LC300s run on winter-grade diesel with engine block heaters; chauffeurs carry oxygen, satellite phones, and the kind of calm that comes from a decade of high-altitude driving." },
      { type: "quote", text: "There is a particular silence in the Pamirs in January. You don't hear it so much as feel it settle on your shoulders." },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
