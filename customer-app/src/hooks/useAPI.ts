import { useState, useEffect } from 'react';

interface UseAPIOptions {
  dependencies?: any[];
  skip?: boolean;
}

interface UseAPIResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Generic hook for making API calls with loading and error states
 */
export function useAPI<T>(
  apiCall: () => Promise<T>,
  options: UseAPIOptions = {}
): UseAPIResult<T> {
  const { dependencies = [], skip = false } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (skip) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = async () => {
    await fetchData();
  };

  return { data, loading, error, refetch };
}
