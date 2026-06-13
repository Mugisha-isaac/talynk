// src/hooks/useRecommendations.ts
import { useState, useEffect } from 'react';
import { RecommendationItem } from '@/types';

/**
 * useRecommendations - Fetch personalized recommendations
 * @param options - Configuration options
 * @returns Recommendations data with loading/error states
 */
export function useRecommendations(options?: {
  page?: number;
  limit?: number;
  category?: string;
  excludeFollowing?: boolean;
}) {
  const [data, setData] = useState<RecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: options?.page || 1,
    limit: options?.limit || 10,
    total: 0,
  });

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          ...(options?.category && { category: options.category }),
          ...(options?.excludeFollowing && { excludeFollowing: 'true' }),
        });

        const response = await fetch(`/api/recommendations?${params}`);

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const result = await response.json();
        setData(result.data);
        setPagination(result.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [pagination.page, pagination.limit, options?.category]);

  return {
    recommendations: data,
    isLoading,
    error,
    pagination,
    nextPage: () =>
      setPagination(p => ({ ...p, page: p.page + 1 })),
    prevPage: () =>
      setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) })),
  };
}
