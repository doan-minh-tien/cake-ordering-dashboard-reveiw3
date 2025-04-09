import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Bỏ qua các API routes và _next routes
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }
  
  // Get token from user session
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // Dashboard routes require authentication
  const isDashboardPath = pathname.startsWith('/dashboard');
  const isRootPath = pathname === '/';
  
  // Nếu đang ở trang dashboard nhưng chưa đăng nhập -> chuyển về trang chủ
  if (isDashboardPath && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Nếu đã đăng nhập và đang ở trang chủ -> chuyển đến dashboard
  if (isRootPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Cho phép truy cập tất cả các routes khác
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
