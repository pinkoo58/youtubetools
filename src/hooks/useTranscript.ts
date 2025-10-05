/**
 * Enhanced hook for managing transcript fetching with UI feedback
 */

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { useUI } from '@/contexts/UIContext';

interface TranscriptData {
  transcript: string;
  language: string;
  trackName: string;
  wordCount: number;
}

interface UseTranscriptReturn {
  transcript: TranscriptData | null;
  loading: boolean;
  error: string | null;
  fetchTranscript: (videoId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const TRANSCRIPT_KEY = 'transcript';

export function useTranscript(): UseTranscriptReturn {
  const [transcript, setTranscript] = useState<TranscriptData | null>(null);
  const { isLoading, getError, setLoading, setError, setSuccess, clearState } = useUI();

  const fetchTranscript = useCallback(async (videoId: string) => {
    if (!videoId?.trim()) {
      setError(TRANSCRIPT_KEY, 'Video ID is required');
      return;
    }

    try {
      const data = await apiClient.get<TranscriptData>(
        `/transcript?videoId=${encodeURIComponent(videoId)}`,
        {
          onLoadingChange: (loading) => setLoading(TRANSCRIPT_KEY, loading),
          onError: (error) => setError(TRANSCRIPT_KEY, error),
        }
      );

      // Validate response structure
      if (!data?.transcript || typeof data.transcript !== 'string') {
        throw new Error('Invalid transcript data received');
      }

      setTranscript(data);
    } catch (err) {
      // Error is already handled by apiClient
      setTranscript(null);
    }
  }, [setLoading, setError]);

  const clearError = useCallback(() => {
    clearState(TRANSCRIPT_KEY);
  }, [clearState]);

  const reset = useCallback(() => {
    setTranscript(null);
    clearState(TRANSCRIPT_KEY);
  }, [clearState]);

  return {
    transcript,
    loading: isLoading(TRANSCRIPT_KEY),
    error: getError(TRANSCRIPT_KEY),
    fetchTranscript,
    clearError,
    reset,
  };
}