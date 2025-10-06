'use client'

import { useState, useCallback } from 'react';
import { YouTubeToolClient } from '@/components/YouTubeToolClient';
import { Button } from "@/components/ui/button";
import { ClientOnly } from '@/components/ClientOnly';
import { extractVideoId, isValidYouTubeUrl } from '@/utils/youtube';
import { useTranscript } from '@/hooks/useTranscript';
import { useVideoInfo } from '@/hooks/useVideoInfo';
import { downloadTranscript } from '@/utils/download';
import { toolConfigs } from '@/lib/tool-configs';

export default function TranscriptDownloaderClient() {
  const [error, setError] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  
  const { transcript, loading: transcriptLoading, error: transcriptError, fetchTranscript } = useTranscript();
  const { videoInfo, loading: videoLoading, fetchVideoInfo } = useVideoInfo();

  const handleSubmit = useCallback(async (url: string) => {
    setError('');
    
    if (!url.trim()) {
      setError('Please enter a YouTube URL.');
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setError('Invalid YouTube URL. Please paste a valid YouTube video link.');
      return;
    }
    
    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Could not extract video ID from URL.');
      return;
    }

    setCurrentVideoId(videoId);
    try {
      await Promise.all([
        fetchTranscript(videoId),
        fetchVideoInfo(videoId)
      ]);
    } catch (error) {
      console.error('Failed to fetch video data:', error);
      setError('Failed to fetch video data. Please try again.');
    }
  }, [fetchTranscript, fetchVideoInfo]);

  const resultsSection = transcript && videoInfo && currentVideoId && (
    <ClientOnly>
      <section className="mb-16" suppressHydrationWarning>
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Video Transcript</h3>
          <p className="text-gray-600">Copy the transcript or download in your preferred format</p>
        </div>
        
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="relative">
                  <img src={videoInfo.thumbnail} alt="Video thumbnail" className="w-full rounded-xl shadow-lg" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
                      Transcript Ready
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{videoInfo.title}</h4>
                    <p className="text-gray-600 text-lg mb-2">Channel: {videoInfo.author}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Language: {transcript.language}</span>
                      <span>Words: {transcript.wordCount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-bold text-gray-900">Transcript Text</h4>
                <div className="flex gap-3">
                  <Button onClick={() => { if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText(transcript.transcript); } }} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white" suppressHydrationWarning>
                    Copy Text
                  </Button>
                  <Button onClick={() => downloadTranscript(transcript.transcript, videoInfo.title, 'txt')} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                    Download TXT
                  </Button>
                  <Button onClick={() => downloadTranscript(transcript.transcript, videoInfo.title, 'srt')} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
                    Download SRT
                  </Button>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-mono">{transcript.transcript}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ClientOnly>
  );

  return (
    <YouTubeToolClient
      config={toolConfigs['transcript-downloader']}
      onSubmit={handleSubmit}
      loading={transcriptLoading || videoLoading}
      error={error || transcriptError || ''}
      resultsSection={resultsSection}
    />
  );
}