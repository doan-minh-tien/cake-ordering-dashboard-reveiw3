import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from user session
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET
  });
  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/api'];
  const isPublicPath = publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/api/')
  );
  
  // Dashboard routes require authentication
  const isDashboardPath = pathname.startsWith('/dashboard');
  
  // If path is dashboard and user is not authenticated, redirect to login
  if (isDashboardPath && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If user is logged in and trying to access login page, redirect to dashboard
  if (isPublicPath && token && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/', '/dashboard/:path*']
}; 