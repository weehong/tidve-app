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

const redirectToDashboard = (request: NextRequest) => {
  return NextResponse.redirect(new URL(`${request.nextUrl.origin}/dashboard`, request.url));
};

export async function middleware(request: NextRequest) {
  const res = await auth0.middleware(request);

  if (publicPaths.includes(request.nextUrl.pathname)) {
    const session = await auth0.getSession(request);

    if (session) {
      return redirectToDashboard(request);
    }

    return res;
  }

  if (isProtectedPath(request.nextUrl.pathname)) {
    const session = await auth0.getSession(request);

    if (!session) {
      return redirectToLogin(request);
    }

    if (request.nextUrl.pathname !== "/wizard") {
      const profile = await fetch(
        `${request.nextUrl.origin}/api/profile?id=${session.user.sub}`,
      ).then((res) => res.json());

      if (!profile?.currency) {
        return NextResponse.redirect(
          new URL(
            `${request.nextUrl.origin}/wizard?returnTo=/dashboard`,
            request.url,
          ),
        );
      }
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|\\.svg).*)",
  ],
};
