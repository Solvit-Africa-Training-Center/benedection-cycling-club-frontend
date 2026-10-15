import type { Metadata } from "next";
import PartnerScreen from "@/screens/PartnerScreen";

export const metadata: Metadata = {
  title: "Partners | Benediction Cycling Club",
  description:
    "Meet the official sponsors and partners supporting Benediction Banafrica Cycling Team.",
};

export default function PartnersPage() {
  return <PartnerScreen />;
}
