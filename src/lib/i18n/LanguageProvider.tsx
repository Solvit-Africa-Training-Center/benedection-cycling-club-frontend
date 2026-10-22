"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { LanguageCatalog } from "@/lib/api/types";
import { persistLangCookie, type AppLang } from "./config";
import { getDictionary, type Dictionary } from "./dictionary";

type I18nContextValue = {
  lang: AppLang;
  setLang: (lang: AppLang) => void;
  t: Dictionary;
  languages: LanguageCatalog;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({
  lang: initialLang,
  languages,
  children,
}: {
  lang: AppLang;
  languages: LanguageCatalog;
  children: ReactNode;
}) {
  const router = useRouter();
  const [lang, setLangState] = useState<AppLang>(initialLang);
  const t = useMemo(() => getDictionary(lang), [lang]);

  useEffect(() => {
    setLangState(initialLang);
  }, [initialLang]);

  function setLang(next: AppLang) {
    setLangState(next);
    persistLangCookie(next);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    router.push(`${url.pathname}${url.search}`);
    router.refresh();
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t, languages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n must be used within LanguageProvider");
  }
  return value;
}
