import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_for_dev_only_change_this'
);

// Define which routes require the user to be logged in
const PROTECTED_ROUTES = ['/admin', '/profile', '/account', '/wishlist'];

// Define routes that logged-in users shouldn't re-visit (like the login page)
const AUTH_ROUTES = ['/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Extract the session token from cookies
  const token = request.cookies.get('auth_session')?.value;

  // 2. Verify the token if it exists
  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch (err) {
      // Token is invalid or expired
      isAuthenticated = false;
    }
  }

  // 3. Rule A: If trying to access a protected route without being logged in
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect them to login, passing the original URL so we can send them back later
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    
    const response = NextResponse.redirect(loginUrl);
    // Clear the bad cookie just in case it was expired/corrupted
    if (token) response.cookies.delete('auth_session');
    return response;
  }

  // 4. Rule B: If already logged in, don't let them go back to the login page
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow the request to pass through normally if no rules are hit
  return NextResponse.next();
}

// 5. Optimize performance by only running middleware on specific pathways
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (handled internally by route configs)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};