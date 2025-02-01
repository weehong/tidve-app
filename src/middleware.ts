import { type NextRequest, NextResponse } from "next/server";

import { auth0 } from "@/lib/auth/auth0";

const isProtectedPath = (pathname: string) => {
  const protectedPaths = ["/dashboard", "/profile", "/subscription"];
  return protectedPaths.some((path) => pathname.startsWith(path));
};

const redirectToLogin = (request: NextRequest) => {
  const redirectUrl = `${request.nextUrl.origin}/auth/login?returnTo=${encodeURIComponent(
    request.nextUrl.pathname,
  )}`;
  console.debug("[Middleware] User is not logged in, redirecting to sign in");
  console.debug("[Middleware] Redirecting to:", redirectUrl);
  return NextResponse.redirect(redirectUrl);
};

export async function middleware(request: NextRequest) {
  const res = await auth0.middleware(request);

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
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
