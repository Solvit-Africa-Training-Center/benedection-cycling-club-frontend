import { NextResponse, type NextRequest } from "next/server";
import { LANG_COOKIE, parseLang } from "@/lib/i18n/config";

export function proxy(request: NextRequest) {
  const lang = parseLang(
    request.nextUrl.searchParams.get("lang") || request.cookies.get(LANG_COOKIE)?.value,
  );
  const headers = new Headers(request.headers);
  headers.set("x-app-lang", lang);

  const response = NextResponse.next({ request: { headers } });
  if (request.nextUrl.searchParams.has("lang")) {
    response.cookies.set(LANG_COOKIE, lang, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
