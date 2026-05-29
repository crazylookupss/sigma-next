import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isAuthenticated = !!session;

  // Public paths that don't require authentication
  const publicPaths = ["/landing", "/api/auth", "/hubs"];
  const isPublicPath = publicPaths.some((p) => nextUrl.pathname.startsWith(p));

  if (!isAuthenticated && !isPublicPath) {
    // Redirect unauthenticated users to the landing / sign-in page
    const landingUrl = new URL("/landing", nextUrl.origin);
    return NextResponse.redirect(landingUrl);
  }

  if (isAuthenticated && nextUrl.pathname === "/landing") {
    // Redirect authenticated users away from landing to the dashboard
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  // Match all routes except Next.js internals and static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
