// lib/hooks/useRequireRole.ts
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { authClient } from '../../../../auth-client';

export function useRequireRole(requiredRole: string) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session?.user?.role !== requiredRole) {
      router.replace('/dashboard');
    }
  }, [isPending, session, requiredRole, router]);

  return {
    session,
    isPending,
    isAuthorized: session?.user?.role === requiredRole,
  };
}
