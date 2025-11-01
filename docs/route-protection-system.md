# ArtEsfera Route Protection System

This document explains the comprehensive route protection system implemented in the ArtEsfera platform, which uses a dual-layer approach combining Next.js middleware and client-side authentication guards.

## Overview

The route protection system consists of two complementary layers:

1. **Server-side protection** via Next.js middleware (`middleware.ts`)
2. **Client-side protection** via AuthGuard component (`src/components/AuthGuard.tsx`)

This dual approach ensures robust security by protecting routes at both the server and client levels.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Request Flow                                 │
├─────────────────────────────────────────────────────────────────┤
│ 1. User requests protected route (e.g., /dashboard)            │
│ 2. Next.js Middleware checks Firebase auth cookies             │
│ 3. If unauthenticated → redirect to /login?next=/dashboard     │
│ 4. If authenticated → proceed to route                         │
│ 5. AuthGuard component validates auth state on client          │
│ 6. If auth state invalid → redirect or show fallback           │
│ 7. If auth state valid → render protected content              │
└─────────────────────────────────────────────────────────────────┘
```

## 1. Server-side Protection (middleware.ts)

### Purpose

- Protects routes at the Edge Runtime level before they reach the client
- Checks authentication status via Firebase cookies
- Redirects unauthenticated users before page rendering

### Configuration

#### Protected Routes

```typescript
const PROTECTED_ROUTES = [
  "/dashboard",
  "/projetos/create",
  "/projetos/*/manage",
  "/admin",
  "/settings",
];
```

#### Public Routes

```typescript
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/gallery",
  "/contact",
  "/daeva",
  "/projetos", // Project listing is public
  "/profile/*", // Public profiles
];
```

### Implementation Details

```typescript
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Check if route needs protection
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => {
    if (route.includes("*")) {
      const pattern = route.replace("*", ".*");
      return new RegExp("^" + pattern + "$").test(pathname);
    }
    return pathname.startsWith(route);
  });

  if (isProtectedRoute) {
    // Check authentication via cookies
    const isAuthenticated = checkAuthenticationFromCookies(request);

    if (!isAuthenticated) {
      // Redirect to login with next parameter
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
```

### Matcher Configuration

```typescript
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|manifest.json).*)",
  ],
};
```

## 2. Client-side Protection (AuthGuard)

### Purpose

- Provides fine-grained client-side route protection
- Handles authentication state changes in real-time
- Offers flexible protection patterns (HOC, wrapper, hooks)

### Basic Usage

#### Component Wrapper

```tsx
import { AuthGuard } from "@/components/AuthGuard";

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <ProtectedContent />
    </AuthGuard>
  );
}
```

#### Higher-Order Component

```tsx
import { withAuthGuard } from "@/components/AuthGuard";

const ProtectedComponent = withAuthGuard(MyComponent, {
  redirectTo: "/custom-login",
  allowedRoles: ["admin"],
});
```

#### Custom Hook

```tsx
import { useAuthCheck } from "@/components/AuthGuard";

function MyComponent() {
  const { isAuthenticated, hasRole, isLoading } = useAuthCheck(["admin"]);

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return <ProtectedContent />;
}
```

### Advanced Configuration

#### Role-based Access Control

```tsx
<AuthGuard allowedRoles={["admin", "moderator"]}>
  <AdminPanel />
</AuthGuard>
```

#### Custom Fallback Components

```tsx
<AuthGuard fallback={<CustomLoadingSpinner />}>
  <ProtectedContent />
</AuthGuard>
```

#### Reverse Protection (for login pages)

```tsx
<AuthGuard requireAuth={false} redirectTo="/dashboard">
  <LoginPage />
</AuthGuard>
```

### Props Interface

```typescript
interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode; // Custom loading component
  redirectTo?: string; // Custom redirect URL
  requireAuth?: boolean; // Default: true
  allowedRoles?: string[]; // Role-based access
  showLoading?: boolean; // Show default loading
}
```

## 3. Authentication Context Integration

### useAuth Hook

The protection system integrates with the AuthContext:

```tsx
const { user, loading, signOut } = useAuth();

// AuthGuard automatically uses these values:
// - user: Current Firebase user object
// - loading: Authentication state loading status
```

### User State Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   loading: true │───▶│ user: null      │───▶│ user: User      │
│   user: null    │    │ loading: false  │    │ loading: false  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
     Initial State        Unauthenticated         Authenticated
```

## 4. Implementation Examples

### Example 1: Basic Protected Page

```tsx
// src/app/dashboard/page.tsx
import { AuthGuard } from "@/components/AuthGuard";

function DashboardContent() {
  const { user, signOut } = useAuth();
  return <div>Welcome {user?.displayName}!</div>;
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
```

### Example 2: Admin-only Route

```tsx
// src/app/admin/page.tsx
import { withAuthGuard } from "@/components/AuthGuard";

function AdminPanel() {
  return <div>Admin functionality here</div>;
}

export default withAuthGuard(AdminPanel, {
  allowedRoles: ["admin"],
  redirectTo: "/unauthorized",
});
```

### Example 3: Public Route with Optional Auth

```tsx
// src/app/profile/page.tsx
function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      {user ? <AuthenticatedProfileView user={user} /> : <PublicProfileView />}
    </div>
  );
}
```

## 5. Security Considerations

### Cookie-based Authentication

- Middleware checks HTTP-only cookies set by Firebase Auth
- Cookies are automatically managed by Firebase SDK
- Secure transmission over HTTPS

### Client-side Validation

- AuthGuard performs real-time auth state checking
- Handles authentication state changes (login/logout)
- Prevents race conditions between server and client

### Route Protection Layers

1. **Edge Runtime**: Middleware blocks unauthorized requests
2. **React Components**: AuthGuard validates client state
3. **API Routes**: Separate protection for API endpoints

## 6. Error Handling

### Middleware Errors

- Malformed cookies → treat as unauthenticated
- Network errors → allow request to proceed (fail open)
- Invalid routes → continue to 404 handling

### AuthGuard Errors

- Auth context errors → show fallback component
- Role checking errors → deny access by default
- Redirect errors → log error and show fallback

## 7. Performance Considerations

### Middleware Performance

- Runs on Edge Runtime (faster cold starts)
- Minimal cookie parsing overhead
- Pattern matching optimized for common cases

### Client Performance

- AuthGuard uses React Context to avoid prop drilling
- Memoized auth state checks
- Lazy loading of protected components

## 8. Testing Strategies

### Unit Tests

```typescript
// Test AuthGuard component
describe("AuthGuard", () => {
  it("redirects unauthenticated users", () => {
    render(
      <AuthGuard>
        <ProtectedComponent />
      </AuthGuard>
    );
    // Assert redirect behavior
  });
});
```

### Integration Tests

```typescript
// Test middleware protection
describe("Middleware", () => {
  it("protects dashboard routes", async () => {
    const response = await fetch("/dashboard");
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toContain("/login");
  });
});
```

## 9. Troubleshooting

### Common Issues

#### Issue: Infinite Redirect Loops

**Cause**: Login page is protected or auth state inconsistency
**Solution**: Ensure login routes are in PUBLIC_ROUTES array

#### Issue: Flash of Unauthenticated Content

**Cause**: Client-side protection delay
**Solution**: Use AuthGuard with appropriate loading states

#### Issue: Server/Client Auth Mismatch

**Cause**: Cookie and client state desynchronization
**Solution**: Implement proper auth state synchronization

### Debug Mode

Enable debug logging:

```typescript
// In AuthGuard
console.log("🔒 AuthGuard: Auth state", { user, loading });

// In middleware
console.log("🛡️ Middleware: Route protection", { pathname, isAuthenticated });
```

## 10. Future Enhancements

### Planned Features

- [ ] Role-based permissions system
- [ ] Route-specific permission policies
- [ ] Analytics for protected route access
- [ ] A/B testing for auth flows

### API Route Protection

Extend protection to API routes:

```typescript
// src/app/api/protected/route.ts
import { getAuthenticatedUser } from "@/lib/auth-server";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  // Protected API logic
}
```

---

This route protection system provides comprehensive security for the ArtEsfera platform while maintaining excellent user experience and developer ergonomics.
