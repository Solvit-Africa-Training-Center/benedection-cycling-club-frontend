export type RiderCategory = "men" | "women" | "junior" | "ALL PERSONNEL";

export type RiderQA = {
  question: string;
  answer: string;
};

export type Cyclist = {
  id?: string;
  slug?: string;
  name: string;
  role: string;
  category: RiderCategory;
  country?: string;
  dateOfBirth?: string;
  age?: number;
  birthplace?: string;
  height?: string;
  weight?: string;
  discipline?: string;
  team?: string;
  title?: string;
  bio?: string;
  description?: string;
  topResults?: string[];
  image?: string;
  gallery?: string[];
  qa?: RiderQA[];
  quote?: string;
};

export function ageFromDateOfBirth(iso: string, today: Date = new Date()): number {
  const dob = new Date(iso);
  let age = today.getFullYear() - dob.getFullYear();
  if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

function buildQa(answers: [string, string, string, string, string]): RiderQA[] {
  return QA_QUESTIONS.map((question, index) => ({
    question,
    answer: answers[index],
  }));
}

const QA_QUESTIONS = [
  "What is your favorite snack?",
  "What is the first thing you do after finishing a race?",
  "What do you enjoy doing on a rest day?",
  "Who would win: you on your bike or you on a dance floor?",
  "What is your hobby?",
] as const;

// Junior = under 19 years old. Jackson Nkurikiyinka turns 19 on 2027-07-05; change his category then.
export const cyclists: Cyclist[] = [
  {
    slug: "mugisha-moise",
    name: "Moise Mugisha",
    role: "Time Trialist",
    category: "men",
    country: "Rwanda",
    dateOfBirth: "1997-01-01",
    age: 29,
    birthplace: "Busogo",
    height: "168cm",
    weight: "58kg",
    title: "Rwanda National Champion (ITT)",
    bio: "Moise Mugisha is a Rwandan cyclist from Busogo. He is a two-time Rwanda national time trial champion (2023, 2024) and won the Tour du Cameroun general classification in 2022.",
    description: "Moise Mugisha is a Rwandan cyclist from Busogo.",
    discipline: "Road Cycling",
    team: "Benediction Cycling Club",
    topResults: [
      "Winner — Grand Prix Chantal Biya, general classification (2020)",
      "Winner — Tour du Cameroun, general classification (2022)",
      "Rwanda National Champion — Men's Individual Time Trial (2023, 2024)",
      "Stage winner — Tour du Rwanda (2022)",
      "2nd — Tour du Rwanda, general classification (2020)",
      "2nd — African Continental Championships, Men's ITT (2023)",
      "Two stage wins — Grand Prix Chantal Biya (2020)",
      "3rd — African Games, Men's ITT (2019)",
    ],
    image: "/images/team/riders/mugisha-moise.jpg",
    gallery: [
      "/images/team/gallery/mugisha-moise-1.jpg",
      "/images/team/gallery/mugisha-moise-2.jpg",
      "/images/team/gallery/mugisha-moise-3.jpg",
      "/images/team/gallery/mugisha-moise-4.jpg",
    ],
    quote: "Ride with purpose, push through every climb and never stop moving forward.",
    qa: buildQa(["Cookies", "Finding food", "Spending time with my family", "Definitely the bike, I'm terrible at dancing", "Watching movie"]),
  },
  {
    slug: "manizabayo-eric",
    name: "Eric Manizabayo",
    role: "Road Cyclist",
    category: "men",
    country: "Rwanda",
    dateOfBirth: "1997-08-28",
    age: 29,
    birthplace: "Jenda",
    height: "168cm",
    weight: "62kg",
    title: "Rwanda National Champion (Road Race)",
    bio: "Eric Manizabayo is a Rwandan cyclist from Jenda. He won the Rwanda national road race title in 2022 and has finished on stage podiums at the Tour du Rwanda, Tour du Cameroun, Tour of Limpopo and Tour of Sharjah.",
    description: "Eric Manizabayo is a Rwandan cyclist from Jenda.",
    discipline: "Road Cycling",
    team: "Benediction Cycling Club",
    topResults: [
      "Rwanda National Champion — Men's Road Race (2022)",
      "Three 3rd-place stage finishes — Tour du Rwanda (2021, 2022)",
      "2nd — stage, Tour du Cameroun (2023)",
      "2nd — stage, Tour of Sharjah (2024)",
      "9th — Tour du Rwanda, general classification (2022)",
      "10th — Tour du Rwanda, general classification (2020)",
      "3rd — stage, Tour of Limpopo (2019)",
      "3rd — stage, Tour du Cameroun (2019)",
      "8th — Tour du Cameroun, general classification (2023)",
    ],
    image: "/images/team/riders/manizabayo-eric.jpg",
    gallery: [
      "/images/team/gallery/manizabayo-eric-1.jpg",
      "/images/team/gallery/manizabayo-eric-2.jpg",
      "/images/team/gallery/manizabayo-eric-3.jpg",
      "/images/team/gallery/manizabayo-eric-4.jpg",
    ],
    quote: "A strong team wins races, and I am happy to do the work that makes it possible.",
    qa: buildQa(["Fresh mango", "Checking on my teammates", "Visiting friends and drinking tea", "The bike, my dance moves stay at home", "Cooking for friends"]),
  },
  {
    slug: "masengesho-vainqueur",
    name: "Vainqueur Masengesho",
    role: "Road Cyclist",
    category: "men",
    country: "Rwanda",
    dateOfBirth: "2002-01-01",
    age: 24,
    birthplace: "Nyiranterengwa",
    height: "181cm",
    weight: "75kg",
    title: "Rwanda National Champion (Road Race)",
    bio: "Vainqueur Masengesho is a Rwandan cyclist from Nyiranterengwa. He won the Rwanda national road race title in 2024 and finished second overall at the Tour d'Algérie Cycliste in 2026.",
    description: "Vainqueur Masengesho is a Rwandan cyclist from Nyiranterengwa.",
    discipline: "Road Cycling",
    team: "Benediction Cycling Club",
    topResults: [
      "Rwanda National Champion — Men's Road Race (2024)",
      "2nd — Tour d'Algérie Cycliste, general classification (2026)",
      "2nd — stage, Tour du Cameroun (2026)",
      "7th — Tour du Rwanda, general classification (2025)",
      "4th — Rwanda National Championships, Men's Road Race (2025)",
      "3rd — two stages, Tour d'Algérie Cycliste (2026)",
      "7th — Tour de Maurice, general classification (2024)",
      "4th — Tour du Cameroun mountains classification (2026)",
    ],
    image: "/images/team/riders/masengesho-vainqueur.jpg",
    gallery: [
      "/images/team/gallery/masengesho-vainqueur-1.jpg",
      "/images/team/gallery/masengesho-vainqueur-2.jpg",
      "/images/team/gallery/masengesho-vainqueur-3.jpg",
      "/images/team/gallery/masengesho-vainqueur-4.jpg",
    ],
    quote: "Pace yourself, then ride the last kilometer like it is the first.",
    qa: buildQa(["Peanuts", "Checking my power numbers", "Watching cycling videos and resting", "The bike, I am built for aerodynamics, not dancing", "Watching cycling documentaries"]),
  },
  {
    slug: "nzafashwanayo-jean-claude",
    name: "Jean Claude Nzafashwanayo",
    role: "Road Cyclist",
    category: "men",
    country: "Rwanda",
    dateOfBirth: "2000-08-04",
    age: 26,
    birthplace: "Kacyiru",
    height: "179cm",
    weight: "78kg",
    title: "Road Cyclist",
    bio: "Jean Claude Nzafashwanayo is a Rwandan cyclist from Kacyiru. He won a stage of the Tour du Cameroun in 2019 and finished fifth overall there in 2023.",
    description: "Jean Claude Nzafashwanayo is a Rwandan cyclist from Kacyiru.",
    discipline: "Road Cycling",
    team: "Benediction Cycling Club",
    topResults: [
      "Stage winner — Tour du Cameroun (2019)",
      "5th — Tour du Cameroun, general classification (2023)",
      "5th — Rwanda National Championships, Men's Road Race (2022, 2024)",
      "3rd — stage, Tour du Cameroun (2022)",
      "4th — Tour du Cameroun mountains classification (2023)",
      "4th — stage, Tour du Sénégal (2019)",
      "6th — Rwanda National Championships, Men's ITT (2022)",
    ],
    image: "/images/team/riders/nzafashwanayo-jean-claude.jpg",
    gallery: [
      "/images/team/gallery/nzafashwanayo-jean-claude-1.jpg",
      "/images/team/gallery/nzafashwanayo-jean-claude-2.jpg",
      "/images/team/gallery/nzafashwanayo-jean-claude-3.jpg",
    ],
    quote: "Attack when it hurts, because that is when the race is decided.",
    qa: buildQa(["Sweet potatoes", "Drinking a lot of water", "Washing and checking my bike", "The bike, I am only fast on two wheels", "Football with friends"]),
  },

  {
    slug: "uwiduhaye-mike",
    name: "Mike Uwiduhaye",
    role: "Climber",
    category: "men",
    country: "Rwanda",
    dateOfBirth: "1997-08-15",
    age: 29,
    birthplace: "Cyamabuye",
    height: "179cm",
    weight: "77kg",
    title: "Road Cyclist",
    bio: "Mike Uwiduhaye is a Rwandan cyclist from Cyamabuye. He finished second in the Tour du Rwanda mountains classification in 2025 and fifth overall at the 2026 Race to Remember.",
    description: "Mike Uwiduhaye is a Rwandan cyclist from Cyamabuye.",
    discipline: "Road Cycling",
    team: "Benediction Cycling Club",
    topResults: [
      "2nd — Tour du Rwanda mountains classification (2025)",
      "6th overall — Tour du Cameroun (2026)",
      "9th — Tour du Cameroun mountains classification (2026)",
      "5th overall — Race to Remember (2026)",
      "14th — Rwanda National Championships, Men's Road Race (2025)",
    ],
    image: "/images/team/riders/uwiduhaye-mike.jpg",
    gallery: [
      "/images/team/gallery/uwiduhaye-mike-1.jpg",
      "/images/team/gallery/uwiduhaye-mike-2.jpg",
      "/images/team/gallery/uwiduhaye-mike-3.jpg",
    ],
    quote: "The sprint is won in the last 200 meters, but earned in the first 100 kilometers.",
    qa: buildQa(["Chocolate biscuits", "Watching the finish replay", "Sleeping in, then a short spin", "The dance floor, I love music too much", "Playing video games"]),
  },
  {
    slug: "phocas-nshimiyimana",
    name: "Phocas Nshimiyimana",
    role: "Road Cyclist",
    category: "men",
    country: "Rwanda",
    dateOfBirth: "2006-01-01",
    age: 20,
    birthplace: "Sashwara",
    height: "159cm",
    weight: "57kg",
    title: "Road Cyclist",
    bio: "Phocas Nshimiyimana is a Rwandan cyclist from Sashwara. In 2026 he finished fifth in the Tour du Cameroun youth classification and seventh overall at the Race to Remember.",
    description: "Phocas Nshimiyimana is a Rwandan cyclist from Sashwara.",
    discipline: "Road Cycling",
    team: "Benediction Cycling Club",
    topResults: [
      "5th — Tour du Cameroun youth classification (2026)",
      "7th overall — Race to Remember (2026)",
      "5th — Tour du Cameroun youth classification (2026)",
    ],
    // PHOTO: save the photo as public/images/team/riders/phocas-nshimiyimana.jpg, then uncomment the next line
    // image: "/images/team/riders/phocas-nshimiyimana.jpg",
    quote: "Every climb is a second chance to put the group under pressure.",
    qa: buildQa(["Bananas", "Checking my cadence", "Stretching and drinking", "The bike, I am only fast on two wheels", "Reading cycling news"]),
  },

  {
    slug: "espoir-uhiriwe",
    name: "Espoir Uhiriwe",
    role: "Road Cyclist",
    category: "men",
    country: "Rwanda",
    dateOfBirth: "2005-10-21",
    age: 20,
    birthplace: "Mukamira",
    height: "179cm",
    weight: "65kg",
    title: "Road Cyclist",
    bio: "Espoir Uhiriwe is a Rwandan cyclist from Mukamira. He finished eighth in the Tour du Cameroun youth classification in 2026.",
    description: "Espoir Uhiriwe is a Rwandan cyclist from Mukamira.",
    discipline: "Road Cycling",
    team: "Benediction Cycling Club",
    topResults: [
      "8th — Tour du Cameroun youth classification (2026)",
    ],
    // PHOTO: save the photo as public/images/team/riders/espoir-uhiriwe.jpg, then uncomment the next line
    // image: "/images/team/riders/espoir-uhiriwe.jpg",
    quote: "Steady riders finish the race.",
    qa: buildQa(["Banana", "Checking my distance", "Stretching", "The bike, I love the feeling of the road", "Watching cycling clips"]),
  },
  {
    slug: "jean-claude-niyomugabo",
    name: "Jean Claude Niyomugabo",
    role: "Road Cyclist",
    category: "men",
    country: "Rwanda",
    dateOfBirth: "2000-01-01",
    age: 26,
    birthplace: "Busogo",
    height: "180cm",
    weight: "75kg",
    title: "Road Cyclist",
    bio: "Jean Claude Niyomugabo is a Rwandan cyclist from Busogo. In 2026 he finished fourth in the Heroes Cycling Cup and fourth overall at the Race to Remember.",
    description: "Jean Claude Niyomugabo is a Rwandan cyclist from Busogo.",
    discipline: "Road Cycling",
    team: "Benediction Cycling Club",
    topResults: [
      "4th — Heroes Cycling Cup (2026)",
      "4th overall — Race to Remember (2026)",
      "7th — Tour du Cameroun youth classification (2024)",
    ],
    // PHOTO: save the photo as public/images/team/riders/jean-claude-niyomugabo.jpg, then uncomment the next line
    // image: "/images/team/riders/jean-claude-niyomugabo.jpg",
    quote: "Never chase the sprint; make the sprint come to you.",
    qa: buildQa(["Peanuts", "Drinking a lot of water", "Sleeping", "The bike, I am strongest on two wheels", "Reading the race"]),
  },

  {
    id: '9',
    name: 'ESPOIR UHIRIWE',
    category: 'ALL PERSONNEL',
    role: 'FIRST TEAM • AGE 31',
    description: 'Endurance specialist. Mountain stage expert. Tour de Rwanda champion.',
    image: '/images/team/cyclist-1.jpg',
  },
  {
    slug: "glen-van-nuuffelen",
    name: "GLEN VAN NUFFELEN",
    role: "ACADEMY • AGE 25",
    category: "men",
    country: "Rwanda",
    title: "ACADEMY • AGE 25",
    description: "Versatile rider. Road & track capability. Future team leader.",
    team: "Benediction Cycling Club",
    image: "/images/team/cyclist-2.jpg",
  },
  {
    slug: "diane-ingabire",
    name: "DIANE INGABIRE",
    role: "DEVELOPMENT • AGE 22",
    category: "women",
    country: "Rwanda",
    title: "DEVELOPMENT • AGE 22",
    description: "Rising star. Sprinter prospect. Women's cycling ambassador.",
    team: "Benediction Cycling Club",
    image: "/images/team/cyclist-3.jpg",
  },
  {
    slug: "valentine-nzayisengwa",
    name: "VALENTINE NZAYISENGA",
    role: "JUNIOR • AGE 17",
    category: "junior",
    country: "Rwanda",
    title: "JUNIOR • AGE 17",
    description: "Young talent. Mountain climber. National junior circuit leader.",
    team: "Benediction Cycling Club",
    image: "/images/team/cyclist-4.jpg",
  },
  {
    slug: "jelle-roelandt",
    name: "JELLE ROELANDT",
    role: "FIRST TEAM • AGE 30",
    category: "men",
    country: "Rwanda",
    title: "FIRST TEAM • AGE 30",
    description: "Time-trial specialist. Individual pursuit expert. Precision handler.",
    team: "Benediction Cycling Club",
    image: "/images/team/cyclist-5.jpg",
  },
  {
    id: '14',
    slug: 'jackson-nkurikiyinka',
    name: 'JACKSON NKURIKIYINKA',
    category: 'junior',
    country: 'Rwanda',
    role: 'JUNIOR • AGE 18',
    title: 'JUNIOR • AGE 18',
    description: 'Junior squad member. High-altitude training specialist. Development pathway.',
    team: 'Benediction Cycling Club',
    image: '/images/team/cyclist-6.jpg',
  },
  {
    slug: "noah-brits",
    name: "NOAH BRITS",
    role: "ACADEMY • AGE 23",
    category: "men",
    country: "Rwanda",
    title: "ACADEMY • AGE 23",
    description: "All-rounder. Team player. Tactical support specialist.",
    team: "Benediction Cycling Club",
    image: "/images/team/cyclist-7.jpg",
  },
  {
    slug: "foeke-du-bois",
    name: "FOEKE DUBOIS",
    role: "JUNIOR • AGE 16",
    category: "junior",
    country: "Rwanda",
    title: "JUNIOR • AGE 16",
    description: "Youngest squad member. High potential. Development focus.",
    team: "Benediction Cycling Club",
    image: "/images/team/cyclist-8.jpg",
  },
];