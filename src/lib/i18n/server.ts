import { cookies } from "next/headers";
import { DEFAULT_LANG, LANG_COOKIE, parseLang, type AppLang } from "./config";

export async function getRequestLang(): Promise<AppLang> {
  try {
    const store = await cookies();
    return parseLang(store.get(LANG_COOKIE)?.value);
  } catch {
    return DEFAULT_LANG;
  }
}
