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

interface VideoInfo {
  title: string;
  description: string;
  thumbnail: string;
  author: string;
}

export default function TitleDescriptionClient() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch video information');
      }
      
      setTimeout(() => {
        setVideoInfo(data);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch video information. Please check the URL and try again.');
      setVideoInfo(null);
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        // You could add a toast notification here
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Header 
          title="YouTube Title & Description Extractor"
          shareTitle="YouTube Title & Description Extractor - Free Tool"
          shareDescription="Extract YouTube video titles and descriptions instantly. Free tool with no registration required."
          showBackButton={true}
        />

        <main className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                Extract YouTube Titles
                <span className="block text-3xl mt-2 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  & Descriptions
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Extract YouTube video titles and descriptions instantly. Support for all video formats including Shorts.
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
                          <span>Extracting...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Extract Info</span>
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

          {/* Results Section */}
          <ClientOnly>
            {videoInfo && (
              <section className="mb-16" suppressHydrationWarning>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Video Information</h3>
                  <p className="text-gray-600">Copy the information you need</p>
                </div>
                
                <div className="max-w-6xl mx-auto space-y-8">
                {/* Video Preview Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div className="relative">
                        <img
                          src={videoInfo.thumbnail}
                          alt="Video thumbnail"
                          className="w-full rounded-xl shadow-lg"
                        />
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
                        <div className="text-sm text-gray-500">
                          Video information extracted successfully
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-2xl font-bold text-gray-900">Video Title</h4>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">Format</div>
                        <div className="text-sm font-medium text-gray-600">Text</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl mb-6">
                      <p className="text-lg text-gray-800 leading-relaxed">{videoInfo.title}</p>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(videoInfo.title, 'title')}
                      className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Copy Title</span>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Description Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-2xl font-bold text-gray-900">Video Description</h4>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">Format</div>
                        <div className="text-sm font-medium text-gray-600">Text</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl mb-6 max-h-80 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{videoInfo.description}</pre>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(videoInfo.description, 'description')}
                      className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Copy Description</span>
                      </div>
                    </Button>
                  </div>
                </div>
                </div>
              </section>
            )}
          </ClientOnly>

          {/* Features Section */}
          <section className="mb-16">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Our Tool?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h4>
                  <p className="text-gray-600">Extract video information in seconds with our optimized processing</p>
                </div>
                
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">100% Safe</h4>
                  <p className="text-gray-600">No downloads required. Everything works in your browser securely</p>
                </div>
                
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Always Free</h4>
                  <p className="text-gray-600">No hidden costs, no registration. Use it as much as you want</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h3>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">How do I extract YouTube video information?</h4>
                  <p className="text-gray-600 leading-relaxed">Simply paste the YouTube video URL into the input field above and click "Extract Info". You'll see the video title, description, thumbnail, and author information that you can copy instantly.</p>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">What video formats are supported?</h4>
                  <p className="text-gray-600 leading-relaxed">Our tool supports all YouTube video formats including regular videos, YouTube Shorts, and live streams. Just paste any valid YouTube URL.</p>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">Is this tool completely free?</h4>
                  <p className="text-gray-600 leading-relaxed">Yes! Our YouTube Title & Description Extractor is 100% free with no registration required. You can use it unlimited times without any restrictions.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How can I extract a YouTube video title and description?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Paste the YouTube video URL into the input field and click 'Extract Info'. The tool will extract the title, description, thumbnail, and author information."
                }
              },
              {
                "@type": "Question",
                "name": "Is this YouTube Title and Description Extractor free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, our tool is completely free to use with no registration required."
                }
              },
              {
                "@type": "Question",
                "name": "Does it work with Shorts?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, the tool supports YouTube Shorts URLs."
                }
              }
            ]
          })
        }}
      />
    </>
  );
}