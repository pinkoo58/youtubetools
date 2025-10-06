import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { useUI } from '@/contexts/UIContext';

interface UseYouTubeApiOptions<T> {
  endpoint: string;
  fallbackData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UseYouTubeApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchData: (videoId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export function useYouTubeApi<T>(options: UseYouTubeApiOptions<T>): UseYouTubeApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const { isLoading, getError, setLoading, setError, clearState } = useUI();
  
  const key = options.endpoint.replace('/', '');

  const fetchData = useCallback(async (videoId: string) => {
    if (!videoId?.trim()) {
      setError(key, 'Video ID is required');
      return;
    }

    try {
      const result = await apiClient.get<T>(
        `${options.endpoint}?videoId=${encodeURIComponent(videoId)}`,
        {
          onLoadingChange: (loading) => setLoading(key, loading),
          onError: (error) => {
            setError(key, error);
            options.onError?.(error);
          },
        }
      );

      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      if (options.fallbackData) {
        setData(options.fallbackData);
      } else {
        setData(null);
      }
    }
  }, [key, options, setLoading, setError]);

  const clearError = useCallback(() => {
    clearState(key);
  }, [clearState, key]);

  const reset = useCallback(() => {
    setData(null);
    clearState(key);
  }, [clearState, key]);

  return {
    data,
    loading: isLoading(key),
    error: getError(key),
    fetchData,
    clearError,
    reset,
  };
}