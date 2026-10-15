export type Partner = {
  name: string;
  specialization: string;
  description: string;
  website?: string;
  websiteLabel?: string;
  mark: string;
  logo?: string;
  featured?: boolean;
};

export const partners: Partner[] = [
  {
    name: "Banafrica Foreign Languages",
    specialization: "Translation, interpreting and language services",
    description:
      "Professional language solutions across more than 150 languages, including translation, interpreting, transcription, editing, proofreading, voice-over and Braille accessibility services.",
    website: "https://banafrica1.com/",
    websiteLabel: "Visit Banafrica",
    mark: "BF",
    logo: "/images/patners/BFL_Logo_page-0001.jpg",
    featured: true,
  },
  {
    name: "DOLTCINI",
    specialization: "Cycling clothing and sportswear",
    description:
      "A Belgian sportswear brand specializing in cycling apparel and customized clothing for cycling teams and athletes.",
    website: "https://www.doltcini.be/",
    websiteLabel: "Visit DOLTCINI",
    mark: "D",
    logo: "/images/patners/Doltcini.jpg",
    featured: true,
  },
  {
    name: "IPXI Carpets",
    specialization: "Carpets and floor coverings",
    description:
      "A brand featured on the Benediction Banafrica cycling jersey and shorts. Its specific products and business activities require confirmation.",
    mark: "IPXI",
    logo: "/images/patners/IPXI.jpg",
  },
  {
    name: "Betonwerken Lombaert",
    specialization: "Concrete works and construction",
    description:
      "A construction-industry partner featured on the Benediction Banafrica cycling jersey. Its precise range of construction services is to be confirmed.",
    website: "https://betonwerken-lombaert.be/",
    websiteLabel: "Visit website",
    mark: "BL",
    logo: "/images/patners/BL.png",
    featured: true,
  },
  {
    name: "Inyange Industries",
    specialization: "Food processing, dairy products and beverages",
    description:
      "A Rwandan food-processing company producing milk, yoghurt, fruit juices, mineral water, butter and other dairy products.",
    website: "https://www.inyangeindustries.com/",
    websiteLabel: "Visit Inyange",
    mark: "INYANGE",
    logo: "/images/patners/Inyange logo (1)_page-0001.jpg",
    featured: true,
  },
  {
    name: "Terra Treasure Stone",
    specialization: "Stone cutting and paving",
    description:
      "A Musanze-based partner specializing in stone cutting and paving materials, including amakoro, for construction and landscaping projects.",
    mark: "TTS",
    logo: "/images/patners/Terra.jpg",
  },
  {
    name: "Magasin Sportclass",
    specialization: "Sports equipment and jersey retail",
    description:
      "A sports retailer providing equipment and clothing for athletes, sports teams and individuals.",
    mark: "SC",
    logo: "/images/patners/magazineSportClass.jpg",
  },
  {
    name: "Van der Valk Hotel Beveren",
    specialization: "Hospitality, accommodation and events",
    description:
      "A Belgian hospitality establishment offering accommodation, dining, leisure facilities and spaces for business or events.",
    website: "https://www.hotelbeveren.be/en",
    websiteLabel: "Visit Hotel Beveren",
    mark: "VDV",
    logo: "/images/patners/vanhotel.png",
    featured: true,
  },
];