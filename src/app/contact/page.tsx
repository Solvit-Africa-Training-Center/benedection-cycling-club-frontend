import type { Metadata } from "next";
import ContactScreen from "@/screens/ContactScreen";
import { getClubOverview } from "@/lib/api";

export const metadata: Metadata = {
  title: "Contact | Benediction Cycling Club",
  description: "Get in touch with the Benediction Cycling Club team.",
};

export default async function ContactPage() {
  const club = await getClubOverview();
  return <ContactScreen contacts={club?.contacts} location={club?.profile.location} />;
}
