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

export default function TagsExtractorClient() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Invalid YouTube URL. Please paste a valid YouTube video link.');
      setTags([]);
      setIsLoading(false);
      return;
    }

    setError('');
    try {
      const response = await fetch('/api/youtube-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch video tags');
      }
      
      setTimeout(() => {
        setTags(data.tags || []);
        setSelectedTags(new Set());
        setIsLoading(false);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch video tags. Please check the URL and try again.');
      setTags([]);
      setIsLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    const newSelected = new Set(selectedTags);
    if (newSelected.has(tag)) {
      newSelected.delete(tag);
    } else {
      newSelected.add(tag);
    }
    setSelectedTags(newSelected);
  };

  const selectAll = () => {
    setSelectedTags(new Set(tags));
  };

  const clearSelection = () => {
    setSelectedTags(new Set());
  };

  const copySelectedTags = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const tagsToCopy = Array.from(selectedTags).join(', ');
      try {
        await navigator.clipboard.writeText(tagsToCopy);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const copyAllTags = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const allTags = tags.join(', ');
      try {
        await navigator.clipboard.writeText(allTags);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Header 
          title="YouTube Tags Extractor"
          shareTitle="YouTube Tags Extractor - Free SEO Tool"
          shareDescription="Extract YouTube video tags instantly for SEO analysis. Free tool with no registration required."
          showBackButton={true}
        />

        <main className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                Extract YouTube Tags
                <span className="block text-3xl mt-2 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  Instantly
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Extract YouTube video tags and copy selected ones or all at once. Perfect for content creators and SEO analysis.
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span>Extract Tags</span>
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
            {tags.length > 0 && (
              <section className="mb-16" suppressHydrationWarning>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Video Tags ({tags.length})</h3>
                  <p className="text-gray-600">Select tags to copy or copy all at once</p>
                </div>
                
                <div className="max-w-6xl mx-auto">
                  {/* Control Buttons */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                    <div className="flex flex-wrap gap-4 justify-center">
                      <Button
                        onClick={selectAll}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                      >
                        Select All ({tags.length})
                      </Button>
                      <Button
                        onClick={clearSelection}
                        variant="outline"
                      >
                        Clear Selection
                      </Button>
                      <Button
                        onClick={copySelectedTags}
                        disabled={selectedTags.size === 0}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      >
                        Copy Selected ({selectedTags.size})
                      </Button>
                      <Button
                        onClick={copyAllTags}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                      >
                        Copy All Tags
                      </Button>
                    </div>
                  </div>

                  {/* Tags Grid */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <div className="flex flex-wrap gap-3">
                      {tags.map((tag, index) => (
                        <button
                          key={index}
                          onClick={() => toggleTag(tag)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                            selectedTags.has(tag)
                              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-500 shadow-lg'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
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
                  <p className="text-gray-600">Extract video tags in seconds with our optimized processing</p>
                </div>
                
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Selective Copy</h4>
                  <p className="text-gray-600">Choose specific tags or copy all at once - your choice</p>
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
                "name": "How can I extract YouTube video tags?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Paste the YouTube video URL into the input field and click 'Extract Tags'. You can then select specific tags or copy all tags at once."
                }
              },
              {
                "@type": "Question",
                "name": "Is this YouTube Tags Extractor free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, our tool is completely free to use with no registration required."
                }
              }
            ]
          })
        }}
      />
    </>
  );
}