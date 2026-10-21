import type { Metadata } from "next";
import PartnerScreen from "@/screens/PartnerScreen";
import { findClubSection, getClubOverview, getPartners } from "@/lib/api";

export const metadata: Metadata = {
  title: "Partners | Benediction Cycling Club",
  description:
    "Meet the official sponsors and partners supporting Benediction Banafrica Cycling Team.",
};

export default async function PartnersPage() {
  const [partners, club] = await Promise.all([getPartners(), getClubOverview()]);
  const partnership = findClubSection(club?.sections, ["partnership", "partner"]);
  return (
    <PartnerScreen
      partners={partners}
      intro={partnership?.body}
      introTitle={partnership?.title}
    />
  );
}
