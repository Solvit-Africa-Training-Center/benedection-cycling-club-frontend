export type RiderCategory = 'Climber' | 'Sprinter' | 'All-Rounder' | 'Time Trialist';

export type Cyclist = {
  id: string;
  name: string;
  role: string;
  category: RiderCategory;
  image: string;
  nationality: string;
  age?: number;
  hometown?: string;
  specialty?: string;
  bio?: string;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
};

export const featuredTeam: Cyclist[] = [
  {
    id: '1',
    name: 'Eric Manizabayo',
    role: 'Climber',
    category: 'Climber',
    image: '/images/team/placeholder.jpg',
    nationality: 'RW',
    age: 26,
    hometown: 'Rubavu',
    specialty: 'High-altitude climbs',
    bio: 'Lead climber forging pace on the volcanic ascents above Lake Kivu.',
  },
  {
    id: '2',
    name: 'Jean Bosco Nsengimana',
    role: 'All-Rounder',
    category: 'All-Rounder',
    image: '/images/team/placeholder.jpg',
    nationality: 'RW',
    age: 28,
    hometown: 'Musanze',
    specialty: 'Stage racing',
    bio: 'Experienced all-rounder anchoring the squad across stage races.',
  },
  {
    id: '3',
    name: 'Patrick Byukusenge',
    role: 'Sprinter',
    category: 'Sprinter',
    image: '/images/team/placeholder.jpg',
    nationality: 'RW',
    age: 24,
    hometown: 'Kigali',
    specialty: 'Bunch sprints',
    bio: 'Explosive finisher driving the lead-out train home.',
  },
  {
    id: '4',
    name: 'Moise Mugisha',
    role: 'Time Trialist',
    category: 'Time Trialist',
    image: '/images/team/placeholder.jpg',
    nationality: 'RW',
    age: 25,
    hometown: 'Huye',
    specialty: 'Aerodynamic pacing',
    bio: 'Diesel engine against the clock with precise pacing discipline.',
  },
  {
    id: '5',
    name: 'Didier Munyaneza',
    role: 'Climber',
    category: 'Climber',
    image: '/images/team/placeholder.jpg',
    nationality: 'RW',
    age: 23,
    hometown: 'Rubavu',
    specialty: 'Summit finishes',
    bio: 'Young climbing talent rising through the academy ranks.',
  },
  {
    id: '6',
    name: 'Samuel Niyonkuru',
    role: 'Sprinter',
    category: 'Sprinter',
    image: '/images/team/placeholder.jpg',
    nationality: 'RW',
    age: 27,
    hometown: 'Rusizi',
    specialty: 'Lead-out',
    bio: 'Road captain guiding sprint positioning in chaotic finales.',
  },
  {
    id: '7',
    name: 'Emmanuel Nkurunziza',
    role: 'All-Rounder',
    category: 'All-Rounder',
    image: '/images/team/placeholder.jpg',
    nationality: 'RW',
    age: 29,
    hometown: 'Karongi',
    specialty: 'Breakaways',
    bio: 'Breakaway specialist reading the race from the front.',
  },
  {
    id: '8',
    name: 'Olivier Hakizimana',
    role: 'Climber',
    category: 'Climber',
    image: '/images/team/placeholder.jpg',
    nationality: 'RW',
    age: 22,
    hometown: 'Rubavu',
    specialty: 'Mountain domestique',
    bio: 'Selfless mountain domestique setting tempo on long ascents.',
  },
];

export const staffTeam: StaffMember[] = [
  {
    id: 's1',
    name: 'Felix Sempoma',
    role: 'Head Coach',
    image: '/images/team/placeholder.jpg',
    bio: 'Directing training and race strategy from Rubavu HQ.',
  },
  {
    id: 's2',
    name: 'Claudine Uwase',
    role: 'Physiotherapist',
    image: '/images/team/placeholder.jpg',
    bio: 'Keeping the squad race-ready with recovery and injury prevention.',
  },
  {
    id: 's3',
    name: 'Jean Paul Habimana',
    role: 'Mechanic',
    image: '/images/team/placeholder.jpg',
    bio: 'Precision bike preparation for every terrain and condition.',
  },
  {
    id: 's4',
    name: 'Aline Mukamana',
    role: 'Team Manager',
    image: '/images/team/placeholder.jpg',
    bio: 'Coordinating logistics, partnerships, and race calendars.',
  },
];
