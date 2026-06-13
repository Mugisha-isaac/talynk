// src/hooks/useAuthUser.ts
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { useRouter } from 'next/navigation';

/**
 * useAuthUser - Get current authenticated user
 * @returns Current user data and auth functions
 */
export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch current user session
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/session');

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/auth/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updated = await response.json();
      setUser(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      throw err;
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const isTalent = (): boolean => user?.role === UserRole.TALENT;
  const isSponsor = (): boolean => user?.role === UserRole.SPONSOR;
  const isAdmin = (): boolean => user?.role === UserRole.ADMIN;

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    logout,
    updateProfile,
    hasRole,
    isTalent,
    isSponsor,
    isAdmin,
  };
}
