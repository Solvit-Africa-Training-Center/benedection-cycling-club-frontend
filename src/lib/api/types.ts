export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ClubContact = {
  kind: "phone" | "email";
  value: string;
  sort_order?: number;
};

export type ClubProfile = {
  name: string;
  tagline?: string;
  founded_year?: number | null;
  location?: string;
  reference_url?: string;
  contact_note?: string;
};

export type ClubSection = {
  slug: string;
  title: string;
  body: string;
  sort_order?: number;
};

export type ClubReference = {
  id: number;
  title: string;
  url: string;
  note?: string;
  cyclist_name?: string | null;
  race_name?: string | null;
  season_year?: number | null;
};

export type ClubOverview = {
  profile: ClubProfile;
  sections: ClubSection[];
  contacts: ClubContact[];
  references: ClubReference[];
};

export type VisitorMessage = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type NewsArticleApi = {
  id: number;
  title: string;
  slug?: string;
  body: string;
  cover_image?: string | null;
  published_at?: string | null;
};

export type ClubSponsor = {
  id: number;
  name: string;
  short_description?: string;
  website_url?: string;
  logo?: string | null;
  sort_order?: number;
};

export type ClubRace = {
  id: number;
  name: string;
  race_type?: string;
  location?: string;
  season_year?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string;
  reference_url?: string;
  team_position?: number | null;
  team_note?: string;
  cover_image?: string | null;
  highlight_video_url?: string;
};

export type RaceResultApi = {
  id: number;
  cyclist: number;
  cyclist_name: string;
  classification?: string;
  finishing_position?: number | null;
  result_time?: string;
  award?: string;
};

export type ClubRaceDetail = ClubRace & {
  results: RaceResultApi[];
  references: { id: number; title: string; url: string; note?: string }[];
};

export type TeamMilestone = {
  id: number;
  year: number;
  event_name: string;
  summary: string;
  is_confirmed: boolean;
};

export type Trophy = {
  id: number;
  race: number;
  race_name: string;
  start_date: string;
  cyclist: number;
  cyclist_name: string;
  classification?: string;
  finishing_position?: number | null;
  result_time?: string;
  award?: string;
};

export type ShopCategory = {
  id: number;
  name: string;
  slug?: string;
  sort_order?: number;
};

export type ProductPhoto = {
  id: number;
  image: string;
  alt_text?: string;
  sort_order?: number;
};

export type ShopProductApi = {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  price: string;
  currency?: string;
  stock?: number;
  category: ShopCategory;
  photos: ProductPhoto[];
};

export type CartItemWrite = {
  product_id: number;
  quantity: number;
};

export type CartRequestWrite = {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  note?: string;
  items: CartItemWrite[];
};

export type CyclistCategoryApi = "men" | "women" | "kids";

export type CyclistApi = {
  id: number;
  name: string;
  category: CyclistCategoryApi;
  nationality?: string;
  birth_place?: string;
  age: number | null;
  height_cm?: string | null;
  weight_kg?: string | null;
  bps?: string;
  position?: string;
  favorite_food?: string;
  about?: string;
  photo?: string | null;
};

export type CyclistResultApi = {
  id: number;
  race: number;
  race_name: string;
  start_date: string;
  classification?: string;
  finishing_position?: number | null;
  result_time?: string;
  award?: string;
};

export type CyclistDetailApi = CyclistApi & {
  results: CyclistResultApi[];
  references: { id: number; title: string; url: string; note?: string }[];
};

export type StaffRoleApi =
  | "mechanic"
  | "logistic"
  | "coach"
  | "representative"
  | "team_manager"
  | "sports_director"
  | "assistant_sports_director"
  | "soigneur";

export type ClubStaffApi = {
  id: number;
  name: string;
  staff_role: StaffRoleApi;
  nationality?: string;
  age: number | null;
  about?: string;
  photo?: string | null;
};
