'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace('/');
      }
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    // Set up a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.error('Auth loading timed out');
        router.replace('/');
      }
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timeout);
  }, [loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}