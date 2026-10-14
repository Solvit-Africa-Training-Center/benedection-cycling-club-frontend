import type { Metadata } from "next";
import ContactScreen from "@/screens/ContactScreen";

export const metadata: Metadata = {
  title: "Contact | Benediction Cycling Club",
  description: "Get in touch with the Benediction Cycling Club team.",
};

export default function ContactPage() {
  return <ContactScreen />;
}
