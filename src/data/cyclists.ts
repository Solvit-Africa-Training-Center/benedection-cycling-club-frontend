export type RiderCategory = "men" | "women" | "junior";

export type RiderHighlight = {
  year: string | number;
  event: string;
  result: string;
};

export type RiderQA = {
  question: string;
  answer: string;
};

export type Cyclist = {
  id: string;
  slug: string;
  name: string;
  displayName?: string;
  title?: string;
  role: string;
  country: string;
  age: number;
  dateOfBirth?: string;
  hometown?: string;
  discipline?: string;
  team?: string;
  racingSince?: number;
  description: string;
  bio?: string;
  heightCm: number;
  weightKg: number;
  badge: string;
  category: RiderCategory;
  image?: string;
  quote?: string;
  qa?: RiderQA[];
  highlights?: RiderHighlight[];
  gallery?: string[];
};

const QA_QUESTIONS = [
  "What is your favorite snack?",
  "What is the first thing you do after finishing a race?",
  "What do you enjoy doing on a rest day?",
  "Who would win: you on your bike or you on a dance floor?",
  "What is your hobby?",
] as const;

function buildQa(answers: [string, string, string, string, string]): RiderQA[] {
  return QA_QUESTIONS.map((question, index) => ({
    question,
    answer: answers[index],
  }));
}

export const cyclists: Cyclist[] = [
  // SAMPLE: replace with club-verified information
  {
    id: "nzafashwanayo-jean-claude",
    slug: "nzafashwanayo-jean-claude",
    name: "Nzafashwanayo Jean Claude",
    displayName: "Nzafashwanayo J. Claude",
    title: "Climber & Breakaway Specialist",
    role: "Climber",
    country: "Rwanda",
    age: 27,
    discipline: "Road Cycling",
    team: "Benediction Cycling Club",
    description:
      "Breakaway king and steep gradient specialist on Mount Kigali & Virunga passes.",
    bio: "Nzafashwanayo Jean Claude is a breakaway specialist who thrives on the steep gradients of Mount Kigali and the Virunga passes. He is one of Benediction Cycling Club's most experienced riders and a regular contender for the green jersey.",
    heightCm: 172,
    weightKg: 64,
    badge: "Green Jersey Contender",
    category: "men",
    image: "/images/team/riders/nzafashwanayo-jean-claude.jpg",
    gallery: [
      "/images/team/gallery/nzafashwanayo-jean-claude-1.jpg",
      "/images/team/gallery/nzafashwanayo-jean-claude-2.jpg",
      "/images/team/gallery/nzafashwanayo-jean-claude-3.jpg",
    ],
    quote: "Attack when it hurts, because that is when the race is decided.",
    qa: buildQa([
      "Sweet potatoes",
      "Drinking a lot of water",
      "Washing and checking my bike",
      "The bike, I am only fast on two wheels",
      "Football with friends",
    ]),
    highlights: [
      { year: 2022, event: "Tour du Rwanda", result: "Most aggressive rider (stage 3)" },
      { year: 2023, event: "Rwanda National Championships", result: "Top 5, Road Race" },
      { year: 2024, event: "Tour du Rwanda", result: "Green jersey contender" },
    ],
  },
  // SAMPLE: replace with club-verified information
  {
    id: "uwiduhaye-mike",
    slug: "uwiduhaye-mike",
    name: "Uwiduhaye Mike",
    title: "Elite Sprinter",
    role: "Sprinter",
    country: "Rwanda",
    age: 26,
    discipline: "Road Cycling",
    team: "Benediction Cycling Club",
    description:
      "High-torque flat finisher with decisive sprint acceleration in bunched finishes.",
    bio: "Uwiduhaye Mike is a high-torque sprinter who reads the final kilometers better than most. He gives Benediction Cycling Club a decisive finisher in bunched finishes.",
    heightCm: 174,
    weightKg: 68,
    badge: "Green Jersey Contender",
    category: "men",
    image: "/images/team/riders/uwiduhaye-mike.jpg",
    gallery: [
      "/images/team/gallery/uwiduhaye-mike-1.jpg",
      "/images/team/gallery/uwiduhaye-mike-2.jpg",
      "/images/team/gallery/uwiduhaye-mike-3.jpg",
    ],
    quote:
      "The sprint is won in the last 200 meters, but earned in the first 100 kilometers.",
    qa: buildQa([
      "Chocolate biscuits",
      "Watching the finish replay",
      "Sleeping in, then a short spin",
      "The dance floor, I love music too much",
      "Playing video games",
    ]),
    highlights: [
      { year: 2022, event: "Rwanda Cycling Cup", result: "Stage win, sprint finish" },
      { year: 2023, event: "Tour du Rwanda", result: "Top 10, stage 6" },
      { year: 2024, event: "National Road Race Series", result: "Podium finish" },
    ],
  },
  // SAMPLE: replace with club-verified information
  {
    id: "masengesho-vainqueur",
    slug: "masengesho-vainqueur",
    name: "Masengesho Vainqueur",
    title: "Time Trial Specialist",
    role: "Time Trialist",
    country: "Rwanda",
    age: 22,
    discipline: "Road Cycling",
    team: "Benediction Cycling Club",
    description:
      "Wind-tunnel calibrated specialist, capable of crushing solitary 40km flat-out intervals.",
    bio: "Masengesho Vainqueur is a time trial specialist who can hold a flat-out effort for 40 kilometers against the wind. At 22, he is one of the youngest riders in Benediction Cycling Club's first team.",
    heightCm: 170,
    weightKg: 65,
    badge: "Green Jersey Contender",
    category: "men",
    image: "/images/team/riders/masengesho-vainqueur.jpg",
    gallery: [
      "/images/team/gallery/masengesho-vainqueur-1.jpg",
      "/images/team/gallery/masengesho-vainqueur-2.jpg",
      "/images/team/gallery/masengesho-vainqueur-3.jpg",
      "/images/team/gallery/masengesho-vainqueur-4.jpg",
    ],
    quote: "Pace yourself, then ride the last kilometer like it is the first.",
    qa: buildQa([
      "Peanuts",
      "Checking my power numbers",
      "Watching cycling videos and resting",
      "The bike, I am built for aerodynamics, not dancing",
      "Watching cycling documentaries",
    ]),
    highlights: [
      { year: 2022, event: "Rwanda National Championships", result: "Time trial, Top 5" },
      {
        year: 2023,
        event: "African Continental Championships",
        result: "Individual time trial, Top 10",
      },
      {
        year: 2024,
        event: "Tour du Rwanda",
        result: "Best young rider in the time trial stage",
      },
    ],
  },
  // SAMPLE: replace with club-verified information
  {
    id: "manizabayo-eric",
    slug: "manizabayo-eric",
    name: "Manizabayo Eric",
    title: "Tempo Setter & Team Rider",
    role: "Domestique",
    country: "Rwanda",
    age: 25,
    discipline: "Road Cycling",
    team: "Benediction Cycling Club",
    description:
      "Relentless tempo setter, protecting leaders into technical gravel entries around Rubavu.",
    bio: "Manizabayo Eric is a relentless tempo setter who protects team leaders on technical gravel roads around Rubavu. His calm and reliable riding makes him a pillar of Benediction Cycling Club's first team.",
    heightCm: 170,
    weightKg: 63,
    badge: "Green Jersey Contender",
    category: "men",
    image: "/images/team/riders/manizabayo-eric.jpg",
    gallery: [
      "/images/team/gallery/manizabayo-eric-1.jpg",
      "/images/team/gallery/manizabayo-eric-2.jpg",
      "/images/team/gallery/manizabayo-eric-3.jpg",
      "/images/team/gallery/manizabayo-eric-4.jpg",
    ],
    quote:
      "A strong team wins races, and I am happy to do the work that makes it possible.",
    qa: buildQa([
      "Fresh mango",
      "Checking on my teammates",
      "Visiting friends and drinking tea",
      "The bike, my dance moves stay at home",
      "Cooking for friends",
    ]),
    highlights: [
      { year: 2022, event: "Rwanda Cycling Cup", result: "Team victory" },
      { year: 2023, event: "Tour du Rwanda", result: "Finished all stages" },
      {
        year: 2024,
        event: "African Continental Championships",
        result: "Team support role",
      },
    ],
  },
  // Figma design content
  {
    id: "mugisha-moise",
    slug: "mugisha-moise",
    name: "Mugisha Moise",
    title: "Elite Road Cyclist",
    role: "Climber",
    country: "Rwanda",
    age: 25,
    dateOfBirth: "2/08/2003",
    hometown: "Rubavu",
    discipline: "Road Cycling",
    team: "Benediction Cycling Club",
    racingSince: 2018,
    description:
      "Icon of endurance mountain passes, KOM champion in International African stage tours.",
    bio: "Mugisha Moise is a dedicated and ambitious cyclist from Rwanda, known for his strong work ethic, climbing ability and consistent performances. He joined Benediction Club with a vision to grow, compete at the highest level and inspire the next generation of Rwandan cyclists.",
    heightCm: 171,
    weightKg: 71,
    badge: "Green Jersey Contender",
    category: "men",
    image: "/images/team/riders/mugisha-moise.jpg",
    gallery: [
      "/images/team/gallery/mugisha-moise-1.jpg",
      "/images/team/gallery/mugisha-moise-2.jpg",
      "/images/team/gallery/mugisha-moise-3.jpg",
      "/images/team/gallery/mugisha-moise-4.jpg",
    ],
    quote: "Ride with purpose, push through every climb and never stop moving forward.",
    qa: buildQa([
      "Cookies",
      "Finding food",
      "Spending time with my family",
      "Definitely the bike, I'm terrible at dancing",
      "Watching movie",
    ]),
    highlights: [
      { year: 2021, event: "Tour du Rwanda", result: "Best Young Rider (stage 5)" },
      {
        year: 2022,
        event: "Rwanda National Championships",
        result: "2nd place, Road Race",
      },
      {
        year: 2023,
        event: "African Continental Championships",
        result: "Top 10 finish",
      },
    ],
  },
  // SAMPLE: replace with club-verified information
  {
    id: "jessica-umulisa",
    slug: "jessica-umulisa",
    name: "Jessica Umulisa",
    title: "Women's Development Rider",
    role: "All-Rounder",
    country: "Rwanda",
    age: 20,
    discipline: "Road Cycling",
    team: "Benediction Cycling Club",
    description:
      "Rising queen of the African Continental Championships, dominating intermediate hill climbs.",
    bio: "Jessica Umulisa is a rising star of the Benediction women's development team, known for dominating intermediate hill climbs. She is a National ITT champion and a promising name at the African Continental Championships.",
    heightCm: 168,
    weightKg: 54,
    badge: "National ITT Champion",
    category: "women",
    image: "/images/team/riders/jessica-umulisa.jpg",
    quote: "Dream big, train hard and let the road show what you are made of.",
    qa: buildQa([
      "Fresh fruit",
      "Drinking water and calling home",
      "Resting and watching movies",
      "The bike, though I love music too",
      "Listening to music",
    ]),
    highlights: [
      {
        year: "Year TBC",
        event: "National Championships",
        result: "National ITT champion",
      },
      {
        year: "Year TBC",
        event: "African Continental Championships",
        result: "Dominated the intermediate hill climbs",
      },
      {
        year: "Year TBC",
        event: "Benediction Cycling Club",
        result: "Joined the women's development team",
      },
    ],
  },
  // SAMPLE: replace with club-verified information
  {
    id: "chrispin-ntambara",
    slug: "chrispin-ntambara",
    name: "Chrispin Ntambara",
    title: "Junior Squad Rider",
    role: "Junior Rider",
    country: "Rwanda",
    age: 15,
    team: "Benediction Cycling Club",
    description:
      "High-cadence pedaling technique with strong aerobic endurance foundation on dirt roads.",
    bio: "Chrispin Ntambara is one of the youngest riders in the Benediction junior squad, with a high-cadence style and strong aerobic endurance built on dirt roads. He is a rising grassroots talent with a bright future.",
    heightCm: 164,
    weightKg: 50,
    badge: "Rising Grassroots Talent",
    category: "junior",
    image: "/images/team/riders/chrispin-ntambara.jpg",
    quote: "Every big journey starts with a small pedal stroke.",
    qa: buildQa([
      "Bananas",
      "Resting and drinking water",
      "Playing with friends",
      "The bike, definitely",
      "Football",
    ]),
    highlights: [
      {
        year: "Year TBC",
        event: "Benediction Junior Squad",
        result: "Joined the junior squad",
      },
      {
        year: "Year TBC",
        event: "Dirt road training",
        result: "Built a strong aerobic base",
      },
      {
        year: "Year TBC",
        event: "Grassroots program",
        result: "Named a rising grassroots talent",
      },
    ],
  },
  // SAMPLE: replace with club-verified information
  {
    id: "ryan-muhizi",
    slug: "ryan-muhizi",
    name: "Ryan Muhizi",
    title: "U17 National Champion",
    role: "Junior Rider",
    country: "Rwanda",
    age: 16,
    team: "Benediction Cycling Club",
    description:
      "Local Rubavu youth prodigy discovered during the annual Kivu Hill Climb Trials.",
    bio: "Ryan Muhizi is a local Rubavu youth prodigy who was discovered during the annual Kivu Hill Climb Trials. He has gone on to become U17 National Champion and is one of the brightest prospects in the junior squad.",
    heightCm: 169,
    weightKg: 55,
    badge: "U17 National Champion",
    category: "junior",
    image: "/images/team/riders/ryan-muhizi.jpg",
    quote:
      "The trials showed me what I can do, and training will show me how far I can go.",
    qa: buildQa([
      "Orange juice",
      "Telling my coach how it went",
      "Riding with friends",
      "The bike, I only dance when nobody is watching",
      "Drawing",
    ]),
    highlights: [
      {
        year: "Year TBC",
        event: "Kivu Hill Climb Trials",
        result: "Discovered by the club's coaches",
      },
      {
        year: "Year TBC",
        event: "National Championships",
        result: "U17 National Champion",
      },
      {
        year: "Year TBC",
        event: "Benediction Junior Squad",
        result: "Joined the junior squad",
      },
    ],
  },
];
