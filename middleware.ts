import { defaultLocale, locales } from "@/constants/locales";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

  let response: NextResponse | undefined;

  /**
   * If there is no locale
   * use en as default locale
   * without adding it to the url path
   */
  if (!pathnameHasLocale) {
    const url = `${request.nextUrl.origin}/${defaultLocale}${pathname}`;
    response = NextResponse.rewrite(new URL(url), request.url as any);
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icon.svg|images|icons|scripts|test|store-list|pdp).*)"],
};
