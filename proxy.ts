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
const STAFF_ROLES = ["ADMIN", "EDITOR", "AUTHOR"];

// Set ADMIN_HOST (e.g. "admin.aksum.com" or "admin.localhost:3000") to serve the
// admin dashboard from its own address. Leave it unset to keep everything on a
// single host (the original behaviour).
const ADMIN_HOST = process.env.ADMIN_HOST;

function withPathname(response: NextResponse, pathname: string) {
  response.headers.set("x-pathname", pathname);
  return response;
}

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export default auth((request: NextRequest) => {
  const { pathname, search } = request.nextUrl;
  const session = (request as any).auth;
  const host = request.headers.get("host") ?? "";
  const splitEnabled = Boolean(ADMIN_HOST);
  const onAdminHost = splitEnabled && host === ADMIN_HOST;
  const isStaff = STAFF_ROLES.includes(session?.user?.role);

  // 1. Public host: admin URLs live on the admin host only.
  if (splitEnabled && !onAdminHost && (isAdminPath(pathname) || pathname === "/admin-login")) {
    return NextResponse.redirect(
      new URL(`${request.nextUrl.protocol}//${ADMIN_HOST}${pathname}${search}`)
    );
  }

  // 2. Admin host: only admin pages and the admin login are served.
  if (onAdminHost) {
    let response: NextResponse;

    if (pathname === "/admin-login") {
      if (session?.user && isStaff) {
        const cb = request.nextUrl.searchParams.get("callbackUrl");
        const dest = cb && cb.startsWith("/admin") ? cb : "/admin";
        return NextResponse.redirect(new URL(dest, request.url));
      }
      response = NextResponse.next();
    } else if (isAdminPath(pathname)) {
      if (!session?.user) {
        const loginUrl = new URL("/admin-login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
      if (!isStaff) {
        return NextResponse.redirect(new URL("/admin-login?error=forbidden", request.url));
      }
      response = withPathname(NextResponse.next(), pathname);
    } else {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  // 3. Single-host mode (ADMIN_HOST not set): original admin gating.
  if (!splitEnabled && isAdminPath(pathname)) {
    if (!session?.user) {
      const signInUrl = new URL("/en/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    if (!isStaff) {
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
    const isStaffOrMember = STAFF_ROLES.includes(role) || ["supporter", "patron"].includes(tier);

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
