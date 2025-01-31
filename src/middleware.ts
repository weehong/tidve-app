import { type NextRequest, NextResponse } from "next/server";

import { auth0 } from "@/lib/auth/auth0";

export async function middleware(request: NextRequest) {
  const res = await auth0.middleware(request);

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const session = await auth0.getSession(request);

    if (!session) {
      console.debug(
        "[Middleware] User is not logged in, redirecting to sign in",
      );
      const redirectUrl = `${request.nextUrl.origin}/auth/login?returnTo=${encodeURIComponent(
        request.nextUrl.pathname,
      )}`;
      console.debug("[Middleware] Redirecting to:", redirectUrl);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
