import { describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { usePolling } from '../src';

describe('usePolling', () => {
  it("Should poll data until the condition is met", async () => {
    const { result } = renderHook(() => usePolling({
      fetcher: () => Promise.resolve('data'),
      condition: (data) => data === 'data',
    }));


    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBe('data');
      expect(result.current.error).toBe(null);
    });
  });

  it('Should have the loading state', async () => {
    const { result } = renderHook(() => usePolling({
      fetcher: () => new Promise((resolve) => setTimeout(() => resolve('data'), 1000)),
      immediate: true,
    }));

    await waitFor(() => {
      expect(result.current.data).toBe(null);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe(null);
    });
  });

  it('Should have the error state', async () => {
    const { result } = renderHook(() => usePolling({
      fetcher: () => Promise.reject(new Error('error')),
      immediate: true,
    }));

    await waitFor(() => {
      expect(result.current.error?.message).toBe('error');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBe(null);
    });
  });
});
