import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';

/**
 * Custom hook to require authentication for protected routes
 * Redirects to /auth if user is not authenticated
 * @param redirectPath - Path to redirect to if not authenticated (default: '/auth')
 */
export function useRequireAuth(redirectPath: string = '/auth') {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate(redirectPath);
    }
  }, [user, loading, navigate, redirectPath]);

  return { user, loading };
}
