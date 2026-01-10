'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AUTH_ROUTES = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/'];
const ONBOARDING_ROUTE = '/auth/onboarding';

/**
 * A client component that handles redirection based on auth state.
 * - If a user is logged in, it redirects them away from auth pages to the main app.
 * - If a user is not logged in, it redirects them from protected pages to the login page.
 */
export function AuthRedirect() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until the user state is confirmed
    }

    const isOnAuthRoute = AUTH_ROUTES.includes(pathname);
    const isOnOnboardingRoute = pathname === ONBOARDING_ROUTE;
    const isProtected = !isOnAuthRoute && !isOnOnboardingRoute;

    if (user) {
      // User is logged in
      if (isOnAuthRoute && pathname !== '/') {
        router.push('/chat'); // Redirect from login/signup to chat home
      }
    } else {
      // User is not logged in
      if (isProtected) {
        router.push('/auth/login'); // Redirect from protected routes to login
      }
    }
  }, [user, isUserLoading, pathname, router]);

  // This component doesn't render anything
  return null;
}
