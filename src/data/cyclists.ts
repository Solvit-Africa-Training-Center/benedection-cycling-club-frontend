export type Cyclist = {
  id: string;
  name: string;
  role: string;
  image: string;
  nationality: string;
};

export const featuredTeam: Cyclist[] = [
  {
    id: '1',
    name: 'Eric Manizabayo',
    role: 'Climber',
    image: '/images/team/placeholder.jpg',
    nationality: 'RW',
  },
  {
    id: '2',
    name: 'Jean Bosco Nsengimana',
    role: 'All-Rounder',
    image: '/images/team/placeholder.jpg',
    nationality: 'RW',
  },
  {
    id: '3',
    name: 'Patrick Byukusenge',
    role: 'Sprinter',
    image: '/images/team/placeholder.jpg',
    nationality: 'RW',
  }
];

export const staffTeam = [
  {
    id: 's1',
    name: 'Felix Sempoma',
    role: 'Head Coach',
    image: '/images/team/placeholder.jpg',
  }
];
