import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Extract token using next-auth JWT approach
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Only handle redirection for dashboard URL
  if (request.nextUrl.pathname === "/dashboard") {
    // If user is logged in and has a role
    if (token?.role) {
      const userRole = token.role.toString().toUpperCase();

      // Redirect admin users to admin dashboard
      if (userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }

      // Other roles (BAKERY) continue to regular dashboard
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// Configure matcher for the middleware
export const config = {
  matcher: ["/dashboard"],
};
