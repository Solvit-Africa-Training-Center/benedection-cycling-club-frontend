export type StaffMember = {
  name: string;
  role: string;
  country: string;
  image?: string;
  description?: string;
};

export const staff: StaffMember[] = [
  {
    name: "Benoit Munyakindi",
    role: "Representative",
    country: "Rwanda",
    image: "/images/team/staff/benoit-munyakindi.jpg",
  },
  {
    name: "Dady Bagabo",
    role: "Team Manager",
    country: "Rwanda",
    image: "/images/team/staff/dady-bagabo.jpg",
  },
  {
    name: "Germaine Mukamana",
    role: "Logistics",
    country: "Rwanda",
    image: "/images/team/staff/germaine-mukamana.jpg",
  },
  {
    name: "Luc Van Nuffelen",
    role: "Sports Director",
    country: "Belgium",
    image: "/images/team/staff/luc-van-nuffelen.jpg",
  },
  {
    name: "Mpatswenimana Fabrice",
    role: "Assistant Sports Director",
    country: "Rwanda",
    image: "/images/team/staff/mpatswenimana-fabrice.jpg",
  },
  {
    name: "Mario Pauwels",
    role: "Mechanic",
    country: "Belgium",
    image: "/images/team/staff/mario-pauwels.jpg",
  },
  {
    name: "Fabrice Ndagijimana",
    role: "Mechanic",
    country: "Rwanda",
    image: "/images/team/staff/fabrice-ndagijimana.jpg",
  },
  {
    name: "Innocent Uwamungu",
    role: "Soigneur",
    country: "Rwanda",
    image: "/images/team/staff/innocent-uwamungu.jpg",
  },
];
