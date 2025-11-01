import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js App Router Middleware for Route Protection
 *
 * This middleware protects routes based on authentication status.
 * It runs on the Edge Runtime and checks cookies to determine auth state.
 *
 * Route Configuration:
 * - Public routes: /, /login, /gallery, /profile/[id], /projects, /daeva
 * - Protected routes: /dashboard, /projetos/create, /projetos/manage
 *
 * Behavior:
 * - Redirects unauthenticated users to /login with next parameter
 * - Allows authenticated users to access protected routes
 * - Preserves query parameters and original destination
 */

// Define protected route patterns
const PROTECTED_ROUTES = [
  "/dashboard",
  "/projetos/create",
  "/projetos/*/manage",
];

// Define public routes (explicitly allowed without auth)
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/gallery",
  "/galeria", // Portuguese version
  "/projects",
  "/projetos", // Portuguese version
  "/daeva",
  "/contact",
  "/contato",
  "/profile", // Public profile views
  "/perfil", // Portuguese version
];

/**
 * Check if a path matches any pattern in the given patterns array
 * Supports wildcard patterns with *
 */
function matchesPattern(path: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    // Convert pattern to regex (replace * with .*)
    const regexPattern = pattern.replace(/\*/g, ".*");
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
  });
}

/**
 * Check if the user is authenticated by looking for Firebase auth tokens
 * This is a simplified check - in production you might want to verify the token
 */
function isAuthenticated(request: NextRequest): boolean {
  // Check for Firebase auth token in cookies
  // Firebase sets these cookies automatically when user is signed in
  const authToken =
    request.cookies.get("__session")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  // Also check for Firebase ID token (common cookie name used by Firebase)
  const firebaseToken =
    request.cookies.get("firebase-auth-token")?.value ||
    request.cookies.get("__Secure-fbasetoken")?.value;

  // Check for custom auth cookie that might be set by the AuthContext
  const customAuthCookie = request.cookies.get("artesfera-auth")?.value;

  return !!(authToken || firebaseToken || customAuthCookie);
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Skip middleware for API routes, static files, and Next.js internal paths
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap")
  ) {
    return NextResponse.next();
  }

  // Check if the current path is a protected route
  const isProtectedRoute = matchesPattern(pathname, PROTECTED_ROUTES);

  // Check if the current path is explicitly public
  const isPublicRoute =
    matchesPattern(pathname, PUBLIC_ROUTES) ||
    pathname.match(/^\/perfil\/[^/]+$/) || // Profile pages with ID
    pathname.match(/^\/profile\/[^/]+$/); // English profile pages

  // If it's a public route, allow access
  if (isPublicRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  // If it's a protected route, check authentication
  if (isProtectedRoute) {
    const authenticated = isAuthenticated(request);

    if (!authenticated) {
      // Redirect to login with the original path as 'next' parameter
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname + search);

      console.log(
        `🔒 Redirecting unauthenticated user from ${pathname} to login`
      );

      return NextResponse.redirect(loginUrl);
    }

    console.log(`✅ Allowing authenticated user to access ${pathname}`);
  }

  // For all other routes, allow access (default behavior)
  return NextResponse.next();
}

/**
 * Middleware configuration
 * Specify which paths this middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml (SEO files)
     * - File extensions (images, fonts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)",
  ],
};
