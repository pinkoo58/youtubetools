'use client'

import { useState, useMemo } from 'react';
import { YouTubeToolClient } from '@/components/YouTubeToolClient';
import { ClientOnly } from '@/components/ClientOnly';
import { toolConfigs } from '@/lib/tool-configs';
import { extractVideoId } from '@/utils/video-id';

interface VideoData {
  title: string;
  channelTitle: string;
  publishedAt: string;
  regionRestriction: {
    allowed?: string[];
    blocked?: string[];
  } | null;
  thumbnail: string;
}

export default function RegionRestrictionClient() {
  const [error, setError] = useState('');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    setError('');
    setVideoData(null);
    
    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Invalid YouTube URL. Please paste a valid YouTube video link.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/youtube-region', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Failed to fetch video information');
        return;
      }

      setVideoData(result.data);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const restrictionStatus = useMemo(() => {
    if (!videoData?.regionRestriction) {
      return { status: 'available', message: 'Available worldwide', color: 'text-green-600 bg-green-50 border-green-200' };
    }

    const { allowed, blocked } = videoData.regionRestriction;
    
    if (blocked && blocked.length > 0) {
      return { 
        status: 'blocked', 
        message: `Blocked in ${blocked.length} countries`, 
        color: 'text-red-600 bg-red-50 border-red-200',
        countries: blocked
      };
    }
    
    if (allowed && allowed.length > 0) {
      return { 
        status: 'limited', 
        message: `Only available in ${allowed.length} countries`, 
        color: 'text-orange-600 bg-orange-50 border-orange-200',
        countries: allowed
      };
    }

    return { status: 'available', message: 'Available worldwide', color: 'text-green-600 bg-green-50 border-green-200' };
  }, [videoData]);

  const resultsSection = videoData && (
    <ClientOnly>
      <section className="mb-16" suppressHydrationWarning>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img src={videoData.thumbnail} alt="Video thumbnail" className="w-full rounded-xl shadow-md" />
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{videoData.title}</h3>
                  <p className="text-gray-600 mb-2">Channel: {videoData.channelTitle}</p>
                  <p className="text-gray-500 mb-6">Published: {new Date(videoData.publishedAt).toLocaleDateString()}</p>
                  
                  <div className={`inline-flex items-center px-4 py-2 rounded-xl border font-semibold ${restrictionStatus.color}`}>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {restrictionStatus.message}
                  </div>

                  {restrictionStatus.countries && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {restrictionStatus.status === 'blocked' ? 'Blocked Countries:' : 'Available Countries:'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {restrictionStatus.countries.slice(0, 10).map((country, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                            {country}
                          </span>
                        ))}
                        {restrictionStatus.countries.length > 10 && (
                          <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-sm">
                            +{restrictionStatus.countries.length - 10} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ClientOnly>
  );

  return (
    <YouTubeToolClient
      config={toolConfigs['region-restriction-checker']}
      onSubmit={handleSubmit}
      loading={isLoading}
      error={error}
      resultsSection={resultsSection}
    />
  );
}