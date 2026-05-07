'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/lib/utils';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, requireAdmin = false, fallback }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const token = getCookie('pb_auth_token');
    if (!token) {
      const loginUrl = `/logowanie?next=${encodeURIComponent(window.location.pathname)}`;
      router.replace(loginUrl);
      return;
    }

    if (requireAdmin) {
      const roleCookie = getCookie('pb_user_role');
      if (roleCookie !== 'admin' && roleCookie !== 'superadmin') {
        router.replace('/logowanie?forbidden=1');
        return;
      }
    }

    setIsAuthorized(true);
  }, [router, requireAdmin]);

  if (isAuthorized === null) {
    if (fallback) return <>{fallback}</>;
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="w-12 h-12 border-4 border-[var(--color-primary-highlight)] border-t-[var(--color-primary)] rounded-full animate-spin" />
      </main>
    );
  }

  if (!isAuthorized) return null;

  return <>{children}</>;
}
