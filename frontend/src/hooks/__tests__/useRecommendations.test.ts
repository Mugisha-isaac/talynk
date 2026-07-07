import { renderHook, waitFor, act } from '@testing-library/react';
import { useRecommendations } from '@/hooks/useRecommendations';

function mockFetchOnce(response: unknown, ok = true) {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    json: async () => response,
  });
}

beforeEach(() => {
  global.fetch = jest.fn();
});

describe('useRecommendations', () => {
  it('fetches recommendations on mount and exposes the result', async () => {
    mockFetchOnce({
      data: [{ id: '1' }, { id: '2' }],
      pagination: { page: 1, limit: 10, total: 2, hasMore: false },
      source: 'database',
    });

    const { result } = renderHook(() => useRecommendations());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.recommendations).toHaveLength(2);
    expect(result.current.source).toBe('database');
    expect(result.current.error).toBeNull();
  });

  it('includes sector and category filters in the request', async () => {
    mockFetchOnce({ data: [], pagination: { page: 1, limit: 10, total: 0, hasMore: false } });

    renderHook(() => useRecommendations({ sector: 'music', category: 'audio' }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const requestedUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(requestedUrl).toContain('sector=music');
    expect(requestedUrl).toContain('category=audio');
  });

  it('sets an error message when the request fails', async () => {
    mockFetchOnce(null, false);

    const { result } = renderHook(() => useRecommendations());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('Failed to fetch recommendations');
    expect(result.current.recommendations).toEqual([]);
  });

  it('advances to the next page and refetches', async () => {
    mockFetchOnce({ data: [{ id: '1' }], pagination: { page: 1, limit: 10, total: 20, hasMore: true } });
    const { result } = renderHook(() => useRecommendations());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    mockFetchOnce({ data: [{ id: '2' }], pagination: { page: 2, limit: 10, total: 20, hasMore: true } });

    act(() => {
      result.current.nextPage();
    });

    await waitFor(() => expect(result.current.pagination.page).toBe(2));

    const secondRequestUrl = (global.fetch as jest.Mock).mock.calls[1][0] as string;
    expect(secondRequestUrl).toContain('page=2');
  });
});
