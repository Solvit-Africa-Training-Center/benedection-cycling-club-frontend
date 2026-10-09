export type StaffMember = {
  id: string;
  slug: string;
  name: string;
  role: string;
  description: string;
  image?: string;
};

export const staff: StaffMember[] = [
  {
    id: "james-sempeta",
    slug: "james-sempeta",
    name: "Dr. James Sempeta",
    role: "Directeur Sportif",
    description:
      "Tactical mastermind orchestrating high-altitude pace pacelines, convoy communication, and stage break management.",
  },
  {
    id: "bright-kamuzinzi",
    slug: "bright-kamuzinzi",
    name: "Dr. Bright Kamuzinzi",
    role: "Lead Physio & Nutritionist",
    description:
      "Specializes in glycogen replenishment strategies, myofascial recovery, and hydration optimization for tropical racing heat.",
  },
  {
    id: "yvan-matsiko",
    slug: "yvan-matsiko",
    name: "Yvan Matsiko",
    role: "Logistics & Caravan Director",
    description:
      "Coordinates team bus transit, follow cars, feed stations along remote escarpments, and cross-border customs logistics.",
  },
  {
    id: "innocent-kambanda",
    slug: "innocent-kambanda",
    name: "Innocent Kambanda",
    role: "Master Race Mechanic",
    description:
      "Maintains 32 race bikes to surgical millimeter standards. Specialist in electronic shifting adjustments during muddy volcanic rain.",
  },
];
