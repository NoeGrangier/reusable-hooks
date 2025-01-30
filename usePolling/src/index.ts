import { useEffect, useRef, useState } from 'react';

interface UsePollingOptions<T> {
  fetcher: () => Promise<T>;
  interval?: number;
  condition?: (data: T) => boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
}

export function usePolling<T>({
  fetcher,
  interval = 5000,
  condition = () => false,
  onSuccess,
  onError,
  immediate = true,
}: UsePollingOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const poll = async () => {
    try {
      setIsLoading(true);
      const result = await fetcher();
      setData(result);
      setError(null);
      onSuccess?.(result);

      if (!condition(result)) {
        timeoutRef.current = setTimeout(poll, interval);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Polling failed');
      setError(error);
      onError?.(error);
      timeoutRef.current = setTimeout(poll, interval);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      poll();
    }

    return () => {
      stopPolling();
    };
  }, []);

  return {
    data,
    error,
    isLoading,
    startPolling: poll,
    stopPolling,
  };
} 
