/**
 * Custom hook for managing video information fetching
 */

import { useState, useCallback } from 'react';

interface VideoInfo {
  title: string;
  author: string;
  thumbnail: string;
}

interface UseVideoInfoReturn {
  videoInfo: VideoInfo | null;
  loading: boolean;
  error: string | null;
  fetchVideoInfo: (videoId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export function useVideoInfo(): UseVideoInfoReturn {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideoInfo = useCallback(async (videoId: string) => {
    if (!videoId) {
      setError('Video ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/video-info?videoId=${encodeURIComponent(videoId)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      const apiResponse = await response.json();

      if (!response.ok) {
        throw new Error(apiResponse.message || `HTTP ${response.status}`);
      }

      setVideoInfo(apiResponse.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch video info';
      setError(errorMessage);
      // Set fallback video info
      setVideoInfo({
        title: 'YouTube Video Transcript',
        author: 'Unknown',
        thumbnail: '',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setVideoInfo(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    videoInfo,
    loading,
    error,
    fetchVideoInfo,
    clearError,
    reset,
  };
}