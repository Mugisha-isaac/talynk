import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: 'TALENT' | 'SPONSOR' | 'ADMIN';
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // TODO: Integrate with Supabase authentication
    // For now, just set loading to false
    setLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    router.push('/auth/login');
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
  };
}
