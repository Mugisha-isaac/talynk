import { useState, useEffect } from 'react';
import { RecommendationItem } from '@/types';

export function useRecommendations(options?: {
  page?: number;
  limit?: number;
  category?: string;
  sector?: string;
  excludeFollowing?: boolean;
}) {
  const [data, setData] = useState<RecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>('unknown');
  const [pagination, setPagination] = useState({
    page: options?.page || 1,
    limit: options?.limit || 10,
    total: 0,
    hasMore: false,
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
          ...(options?.sector && { sector: options.sector }),
          ...(options?.excludeFollowing && { excludeFollowing: 'true' }),
        });

        const response = await fetch(`/api/recommendations?${params}`);

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const result = await response.json();
        setData(result.data || []);
        setPagination(result.pagination || pagination);
        setSource(result.source || 'unknown');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [
    pagination.page,
    pagination.limit,
    options?.category,
    options?.sector,
  ]);

  return {
    recommendations: data,
    isLoading,
    error,
    source,
    pagination,
    nextPage: () =>
      setPagination((p) => ({ ...p, page: p.page + 1 })),
    prevPage: () =>
      setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) })),
  };
}
