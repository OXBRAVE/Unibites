import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If an admin/staff accidentally hits a student route, send them to their portal
    if (
      token?.role === "ADMIN" &&
      (pathname.startsWith("/restaurants") ||
        pathname.startsWith("/cart") ||
        pathname.startsWith("/history"))
    ) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only allow entry if a valid session token exists
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Protect these routes — unauthenticated users will be redirected to /login
export const config = {
  matcher: [
    "/restaurants/:path*",
    "/cart/:path*",
    "/history/:path*",
  ],
};
