'use client'

import { useState } from 'react';
import { YouTubeToolClient } from '@/components/YouTubeToolClient';
import { Button } from "@/components/ui/button";
import { ClientOnly } from '@/components/ClientOnly';
import { toolConfigs } from '@/lib/tool-configs';
import { extractVideoId } from '@/utils/video-id';

interface VideoInfo {
  title: string;
  description: string;
  thumbnail: string;
  author: string;
}

export default function TitleDescriptionClient() {
  const [error, setError] = useState('');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    
    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Invalid YouTube URL. Please paste a valid YouTube video link.');
      setVideoInfo(null);
      setIsLoading(false);
      return;
    }

    setError('');
    try {
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch video information');
      }
      
      if (result.success && result.data) {
        setVideoInfo(result.data);
      } else {
        throw new Error('Invalid response from server');
      }
      
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch video information. Please check the URL and try again.');
      setVideoInfo(null);
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const resultsSection = videoInfo && (
    <ClientOnly>
      <section className="mb-16" suppressHydrationWarning>
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Video Information</h3>
          <p className="text-gray-600">Copy the information you need</p>
        </div>
        
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="relative">
                  <img src={videoInfo.thumbnail} alt="Video thumbnail" className="w-full rounded-xl shadow-lg" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
                      Preview
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Channel</h4>
                    <p className="text-gray-600 text-lg">{videoInfo.author}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-bold text-gray-900">Video Title</h4>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl mb-6">
                <p className="text-lg text-gray-800 leading-relaxed">{videoInfo.title}</p>
              </div>
              <Button onClick={() => copyToClipboard(videoInfo.title)} className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                Copy Title
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-bold text-gray-900">Video Description</h4>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl mb-6 max-h-80 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{videoInfo.description}</pre>
              </div>
              <Button onClick={() => copyToClipboard(videoInfo.description)} className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                Copy Description
              </Button>
            </div>
          </div>
        </div>
      </section>
    </ClientOnly>
  );

  return (
    <YouTubeToolClient
      config={toolConfigs['title-description-extractor']}
      onSubmit={handleSubmit}
      loading={isLoading}
      error={error}
      resultsSection={resultsSection}
    />
  );
}