import type { Metadata } from "next";
import PartnerScreen from "@/screens/PartnerScreen";
import { getPartners } from "@/lib/api";

export const metadata: Metadata = {
  title: "Partners | Benediction Cycling Club",
  description:
    "Meet the official sponsors and partners supporting Benediction Banafrica Cycling Team.",
};

export default async function PartnersPage() {
  const partners = await getPartners();
  return <PartnerScreen partners={partners} />;
}
