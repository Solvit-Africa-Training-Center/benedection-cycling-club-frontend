import { cookies, headers } from "next/headers";
import { DEFAULT_LANG, LANG_COOKIE, parseLang, type AppLang } from "./config";

export async function getRequestLang(): Promise<AppLang> {
  try {
    const [store, hdrs] = await Promise.all([cookies(), headers()]);
    return parseLang(
      hdrs.get("x-app-lang") ||
        store.get(LANG_COOKIE)?.value ||
        hdrs.get("accept-language"),
    );
  } catch {
    return DEFAULT_LANG;
  }
}
