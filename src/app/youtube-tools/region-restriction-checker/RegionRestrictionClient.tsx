'use client'

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClientOnly } from '@/components/ClientOnly';
import { Header } from '@/components/Header';
import Script from 'next/script';

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
    /(?:https?:\/\/)?youtu\.be\/([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

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
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch video information');
        return;
      }

      setVideoData(data);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRestrictionStatus = () => {
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
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Header 
          title="YouTube Region Restriction Checker"
          shareTitle="YouTube Region Restriction Checker - Free Tool"
          shareDescription="Check if YouTube videos are blocked in specific countries. Free region restriction checker tool."
          showBackButton={true}
        />

        <main className="container mx-auto px-4 py-12">
          <section className="text-center mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                Check YouTube Video
                <span className="block text-3xl mt-2 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  Region Restrictions
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Verify if YouTube videos are blocked or available in specific countries and regions.
                <span className="block mt-2 text-lg">✨ Free • Fast • No Registration Required</span>
              </p>
              
              <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="relative">
                  <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-2xl shadow-2xl border border-gray-200/50">
                    <div className="flex-1">
                      <Input
                        type="url"
                        placeholder="Paste your YouTube URL here (e.g., https://youtube.com/watch?v=...)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="border-0 text-lg h-14 bg-transparent focus:ring-0 placeholder:text-gray-400"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="h-14 px-8 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Checking...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Check Restrictions</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
                
                <ClientOnly>
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl" suppressHydrationWarning>
                      <p className="text-red-600 flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                      </p>
                    </div>
                  )}
                </ClientOnly>
              </div>
            </div>
          </section>

          <ClientOnly>
            {videoData && (
              <section className="mb-16" suppressHydrationWarning>
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-8">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                          <img
                            src={videoData.thumbnail}
                            alt="Video thumbnail"
                            className="w-full rounded-xl shadow-md"
                          />
                        </div>
                        <div className="md:w-2/3">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">{videoData.title}</h3>
                          <p className="text-gray-600 mb-2">Channel: {videoData.channelTitle}</p>
                          <p className="text-gray-500 mb-6">Published: {new Date(videoData.publishedAt).toLocaleDateString()}</p>
                          
                          <div className={`inline-flex items-center px-4 py-2 rounded-xl border font-semibold ${getRestrictionStatus().color}`}>
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {getRestrictionStatus().message}
                          </div>

                          {getRestrictionStatus().countries && (
                            <div className="mt-4">
                              <h4 className="font-semibold text-gray-900 mb-2">
                                {getRestrictionStatus().status === 'blocked' ? 'Blocked Countries:' : 'Available Countries:'}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {getRestrictionStatus().countries?.slice(0, 10).map((country, index) => (
                                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                    {country}
                                  </span>
                                ))}
                                {getRestrictionStatus().countries && getRestrictionStatus().countries.length > 10 && (
                                  <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-sm">
                                    +{getRestrictionStatus().countries.length - 10} more
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
            )}
          </ClientOnly>

          <section className="mb-16">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Check Region Restrictions?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Global Reach</h4>
                  <p className="text-gray-600">Verify if your content is accessible to your target audience worldwide</p>
                </div>
                
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Content Strategy</h4>
                  <p className="text-gray-600">Plan your content distribution and marketing strategies effectively</p>
                </div>
                
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Troubleshooting</h4>
                  <p className="text-gray-600">Understand why certain videos might not be available in specific regions</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      
      <Script
        id="region-checker-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "YouTube Region Restriction Checker",
            "description": "Check if YouTube videos are blocked in specific countries and regions",
            "url": "https://tools.aipepal.com/youtube-tools/region-restriction-checker",
            "applicationCategory": "Utility"
          })
        }}
      />
    </>
  );
}