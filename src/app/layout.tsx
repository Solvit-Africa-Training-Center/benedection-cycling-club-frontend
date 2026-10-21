import type { Metadata } from "next";
import { Geist, Geist_Mono, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getLanguages } from "@/lib/api";
import { htmlLang } from "@/lib/i18n/config";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { getRequestLang } from "@/lib/i18n/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Benediction Cycling Club",
  description: "Rising above the crags & volcanoes of Rubavu",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const lang = await getRequestLang();
  const languages = await getLanguages();

  return (
    <html
      lang={htmlLang(lang)}
      className={`${geistSans.variable} ${geistMono.variable} ${barlow.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider lang={lang} languages={languages}>
          <Navbar />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}