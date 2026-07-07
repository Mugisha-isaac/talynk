import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuthUser } from '@/hooks/useAuthUser';
import { UserRole } from '@/types';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

function mockFetchOnce(response: unknown, ok = true) {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    json: async () => response,
  });
}

beforeEach(() => {
  global.fetch = jest.fn();
  mockPush.mockClear();
});

describe('useAuthUser', () => {
  it('starts in a loading state and resolves to the session user', async () => {
    const sessionUser = { id: '1', role: UserRole.TALENT };
    mockFetchOnce({ user: sessionUser });

    const { result } = renderHook(() => useAuthUser());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toEqual(sessionUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('sets user to null when the session request fails', async () => {
    mockFetchOnce(null, false);

    const { result } = renderHook(() => useAuthUser());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('captures a network error message instead of throwing', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('network down'));

    const { result } = renderHook(() => useAuthUser());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('network down');
    expect(result.current.user).toBeNull();
  });

  it('exposes role helpers that reflect the loaded user', async () => {
    mockFetchOnce({ user: { id: '2', role: UserRole.SPONSOR } });

    const { result } = renderHook(() => useAuthUser());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isSponsor()).toBe(true);
    expect(result.current.isTalent()).toBe(false);
    expect(result.current.hasRole(UserRole.SPONSOR)).toBe(true);
  });

  it('logs out by calling the logout endpoint and redirecting', async () => {
    mockFetchOnce({ user: { id: '1', role: UserRole.TALENT } });
    const { result } = renderHook(() => useAuthUser());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    mockFetchOnce({});

    await act(async () => {
      await result.current.logout();
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' });
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
    expect(result.current.user).toBeNull();
  });
});
