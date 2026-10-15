export type NewsArticle = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  position?: string;
  content?: string[];
};

export const news: NewsArticle[] = [
  {
    slug: "tour-du-rwanda-2025",
    category: "Race News",
    title: "Benediction Club shines at Tour du Rwanda 2025",
    excerpt:
      "Our riders delivered an outstanding performance securing top positions in the 5th stage of the Tour du Rwanda",
    date: "May 12, 2025",
    image: "/news1.jpeg",
    position: "object-top",
    content: [
      "First paragraph of the article.",
      "Second paragraph of the article.",
      "Third paragraph of the article.",
    ],
  },
  {
    slug: "new-season-same-vision",
    category: "Team News",
    title: "New season, same vision: stronger together",
    excerpt:
      "Meet our 2025 team and learn about the riders, coaches and support staff behind our mission",
    date: "Apr 28, 2025",
    image: "/news2.jpeg",
    position: "object-center",
    content: [
      "First paragraph of the article.",
      "Second paragraph of the article.",
      "Third paragraph of the article.",
    ],
  },
  {
    slug: "altitude-training-camp",
    category: "Training",
    title: "Altitude training camp boosts team performance",
    excerpt:
      "The team completed a successful training camp in Musanze, building strength for the upcoming races.",
    date: "Apr 15, 2025",
    image: "/news3.jpeg",
    position: "object-center",
    content: [
      "First paragraph of the article.",
      "Second paragraph of the article.",
      "Third paragraph of the article.",
    ],
  },
   {
    slug: "cleaner-greener-tomorrow",
    category: "Community",
    title: "Cycling for a cleaner, greener tomorrow",
    excerpt:
      "Benediction Club joins hands with local communities for a clean up ride and environmental awareness campaign.",
    date: "Apr 02, 2025",
    image: "/news4.jpeg",
    position: "object-center",
    content: [
      "First paragraph of the article.",
      "Second paragraph of the article.",
      "Third paragraph of the article.",
    ],
  },
  {
    slug: "national-championships-june-2025",
    category: "Race News",
    title: "Rwanda National Championships set for June 2025",
    excerpt:
      "The event will bring together the best cyclists from across the country, with the biggest names in local cycling.",
    date: "Mar 20, 2025",
    image: "/news5.jpeg",
    position: "object-center",
    content: [
      "First paragraph of the article.",
      "Second paragraph of the article.",
      "Third paragraph of the article.",
    ],
  },
  {
    slug: "riders-ready-next-challenge",
    category: "Team News",
    title: "Riders ready for the next challenge",
    excerpt:
      "The team is fully prepared and focused on the next round of races with high hopes and strong motivation.",
    date: "Mar 10, 2025",
    image: "/news6.jpeg",
    position: "object-center",
    content: [
      "First paragraph of the article.",
      "Second paragraph of the article.",
      "Third paragraph of the article.",
    ],
  },
  {
    slug: "news-7",
    category: "Team News",
    title: "Choosing the right gear for every ride",
    excerpt:
      "Benediction Club joins hands with local communities for a clean up ride and environmental awareness campaign",
    date: "Feb 28, 2025",
    image: "/news7.jpeg",
    position: "object-center",
    content: [
      "First paragraph of the article.",
      "Second paragraph of the article.",
      "Third paragraph of the article.",
    ],
  },
  {
    slug: "news-8",
    category: "Race News",
    title: "Benection club dominates kigali criterium",
    excerpt:
      "The event will bring together the best cyclists from across the country, with the biggest names in local cycling",
    date: "Feb 18, 2025",
    image: "/news8.jpeg",
    position: "object-center",
    content: [
      "First paragraph of the article.",
      "Second paragraph of the article.",
      "Third paragraph of the article.",
    ],
  },
  {
    slug: "news-9",
    category: "Team News",
    title: "Preparing for Tour du cemeroun",
    excerpt:
      "Before shipping bikes to central Africa, our team contigent logs simulated humidity protocols to combat equatorial heat zones along the coastal flats of duala",
    date: "Feb 05, 2025",
    image: "/news9.jpeg",
    position: "object-center",
    content: [
      "First paragraph of the article.",
      "Second paragraph of the article.",
      "Third paragraph of the article.",
    ],
  },


];