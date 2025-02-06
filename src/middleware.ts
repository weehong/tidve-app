import { type NextRequest, NextResponse } from "next/server";

import { auth0 } from "@/libs/auth/auth0";

const publicPaths = ["/", "/auth/login"];

const isProtectedPath = (pathname: string) => {
  const protectedPaths = ["/dashboard", "/profile", "/subscription"];
  return protectedPaths.some((path) => pathname.startsWith(path));
};

const redirectToLogin = (request: NextRequest) => {
  const redirectUrl = new URL(
    `${request.nextUrl.origin}/auth/login?returnTo=${encodeURIComponent(
      request.nextUrl.pathname,
    )}`,
  );
  return NextResponse.redirect(redirectUrl);
};

export async function middleware(request: NextRequest) {
  const res = await auth0.middleware(request);

  if (publicPaths.includes(request.nextUrl.pathname)) {
    return res;
  }

  if (isProtectedPath(request.nextUrl.pathname)) {
    const session = await auth0.getSession(request);

    if (!session) {
      return redirectToLogin(request);
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|\\.svg).*)",
  ],
};
