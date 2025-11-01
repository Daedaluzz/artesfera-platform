"use client";

import React, { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  allowedRoles?: string[];
  showLoading?: boolean;
}

/**
 * AuthGuard - Client-side Authentication Guard Component
 *
 * This HOC/wrapper component provides client-side route protection for components
 * where Next.js middleware isn't sufficient. It uses the AuthContext to check
 * authentication status and can optionally check user roles.
 *
 * Usage Examples:
 *
 * Basic usage (require authentication):
 * ```tsx
 * <AuthGuard>
 *   <ProtectedComponent />
 * </AuthGuard>
 * ```
 *
 * With custom redirect:
 * ```tsx
 * <AuthGuard redirectTo="/custom-login">
 *   <ProtectedComponent />
 * </AuthGuard>
 * ```
 *
 * With role-based access:
 * ```tsx
 * <AuthGuard allowedRoles={['admin', 'moderator']}>
 *   <AdminPanel />
 * </AuthGuard>
 * ```
 *
 * With custom fallback:
 * ```tsx
 * <AuthGuard fallback={<CustomLoadingComponent />}>
 *   <ProtectedComponent />
 * </AuthGuard>
 * ```
 *
 * Prevent authentication (for login pages):
 * ```tsx
 * <AuthGuard requireAuth={false} redirectTo="/dashboard">
 *   <LoginPage />
 * </AuthGuard>
 * ```
 */
export function AuthGuard({
  children,
  fallback,
  redirectTo = "/login",
  requireAuth = true,
  allowedRoles = [],
  showLoading = true,
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for auth state to be determined

    if (requireAuth && !user) {
      // User is not authenticated but authentication is required
      const currentPath = window.location.pathname + window.location.search;
      const loginUrl = redirectTo.includes("?")
        ? `${redirectTo}&next=${encodeURIComponent(currentPath)}`
        : `${redirectTo}?next=${encodeURIComponent(currentPath)}`;

      console.log(
        `🔒 AuthGuard: Redirecting unauthenticated user to ${loginUrl}`
      );
      router.push(loginUrl);
      return;
    }

    if (!requireAuth && user) {
      // User is authenticated but should not be (e.g., login page)
      console.log(
        `🔓 AuthGuard: Redirecting authenticated user to ${redirectTo}`
      );
      router.push(redirectTo);
      return;
    }

    // Role-based access control
    if (user && allowedRoles.length > 0) {
      // Note: This would require extending the user object or UserProfile to include roles
      // For now, we'll skip role checking since it's not implemented in the current user schema
      console.log(
        `👤 AuthGuard: Role-based access control not implemented yet`
      );
    }
  }, [user, loading, requireAuth, allowedRoles, redirectTo, router]);

  // Show loading state
  if (loading) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showLoading) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center"
          role="status"
          aria-label="Carregando..."
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy-blue dark:border-brand-yellow"></div>
            <div className="absolute inset-0 rounded-full h-12 w-12 border-t-2 border-brand-navy-blue/20 dark:border-brand-yellow/20 animate-ping"></div>
          </div>
          <span className="sr-only">Carregando autenticação...</span>
        </motion.div>
      );
    }

    return null;
  }

  // Authentication checks
  if (requireAuth && !user) {
    // User is not authenticated, redirect will happen in useEffect
    return null;
  }

  if (!requireAuth && user) {
    // User is authenticated but shouldn't be here, redirect will happen in useEffect
    return null;
  }

  // Role-based access (future implementation)
  if (user && allowedRoles.length > 0) {
    // TODO: Implement role checking when user roles are added to the schema
    // const userRoles = user.roles || [];
    // const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
    // if (!hasRequiredRole) {
    //   return <UnauthorizedComponent />;
    // }
  }

  // All checks passed, render children
  return <>{children}</>;
}

/**
 * Higher-Order Component version of AuthGuard
 *
 * Usage:
 * ```tsx
 * const ProtectedComponent = withAuthGuard(MyComponent, {
 *   allowedRoles: ['admin'],
 *   redirectTo: '/unauthorized'
 * });
 * ```
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  guardProps?: Omit<AuthGuardProps, "children">
) {
  const WrappedComponent = (props: P) => (
    <AuthGuard {...guardProps}>
      <Component {...props} />
    </AuthGuard>
  );

  WrappedComponent.displayName = `withAuthGuard(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

/**
 * Hook to check authentication status with optional role checking
 *
 * Usage:
 * ```tsx
 * const { isAuthenticated, hasRole, isLoading } = useAuthCheck(['admin']);
 * ```
 */
export function useAuthCheck(requiredRoles: string[] = []) {
  const { user, loading } = useAuth();

  const isAuthenticated = !!user;

  // TODO: Implement role checking when user roles are added
  const hasRole = requiredRoles.length === 0 || isAuthenticated;
  // const hasRole = requiredRoles.length === 0 ||
  //   (user?.roles && requiredRoles.some(role => user.roles.includes(role)));

  return {
    isAuthenticated,
    hasRole,
    isLoading: loading,
    user,
  };
}

/**
 * Component to display when user is not authorized (for future role-based access)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function UnauthorizedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="text-center">
        <div className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          <h1 className="text-2xl font-bold text-brand-black dark:text-brand-white mb-4">
            🚫 Acesso Negado
          </h1>
          <p className="text-brand-black/70 dark:text-brand-white/70 mb-6">
            Você não tem permissão para acessar esta página.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 rounded-[12px] bg-brand-navy-blue dark:bg-brand-yellow text-white dark:text-brand-black font-medium hover:opacity-80 transition-opacity duration-200"
          >
            Voltar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
