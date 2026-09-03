import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { auth } from "@/auth";

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "am"],
  defaultLocale: "en",
});

const protectedPathPattern = /^\/(en|am)\/(account|onboarding)/;
const articlePathPattern = /^\/(en|am)\/article\/[a-z0-9-]+/;
const FREE_ARTICLE_LIMIT = 5;

function withPathname(response: NextResponse, pathname: string) {
  response.headers.set("x-pathname", pathname);
  return response;
}

export default auth((request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const session = (request as any).auth;

  if (pathname.startsWith("/admin")) {
    if (!session?.user) {
      const signInUrl = new URL("/en/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    const role = session.user.role;
    if (!["ADMIN", "EDITOR", "AUTHOR"].includes(role)) {
      return NextResponse.redirect(new URL("/en", request.url));
    }
    return withPathname(NextResponse.next(), pathname);
  }

  const isProtected = protectedPathPattern.test(pathname);
  if (isProtected && !session?.user) {
    const locale = pathname.startsWith("/am") ? "am" : "en";
    const signInUrl = new URL(`/${locale}/sign-in`, request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (articlePathPattern.test(pathname)) {
    const role = session?.user?.role;
    const tier = session?.user?.membershipTier;
    const isStaffOrMember = ["ADMIN", "EDITOR", "AUTHOR"].includes(role) || ["supporter", "patron"].includes(tier);

    const response = withPathname(intlMiddleware(request) ?? NextResponse.next(), pathname);

    if (isStaffOrMember) {
      response.headers.set("x-paywall-blocked", "false");
      return response;
    }

    const monthKey = new Date().toISOString().slice(0, 7);
    const cookieName = `aksum_reads_${monthKey}`;
    const currentCount = Number(request.cookies.get(cookieName)?.value ?? "0");

    if (currentCount >= FREE_ARTICLE_LIMIT) {
      response.headers.set("x-paywall-blocked", "true");
    } else {
      response.headers.set("x-paywall-blocked", "false");
      response.cookies.set(cookieName, String(currentCount + 1), {
        maxAge: 60 * 60 * 24 * 40,
        httpOnly: false,
      });
    }

    return response;
  }

  return withPathname(intlMiddleware(request) ?? NextResponse.next(), pathname);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
