'use client'

import { useState, useMemo, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { useIsClient } from '@/hooks/useIsClient';
import { Header } from '@/components/Header';
import Link from 'next/link';

const tools = [
  {
    id: 'thumbnail-downloader',
    title: 'Thumbnail Downloader',
    description: 'Download YouTube video thumbnails in high quality (HD, HQ, SD)',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
      </svg>
    ),
    href: '/youtube-tools/thumbnail-downloader',
    gradient: 'from-blue-500 to-blue-600',
    tags: ['download', 'thumbnail', 'image', 'hd']
  },
  {
    id: 'title-description-extractor',
    title: 'Title & Description Extractor',
    description: 'Extract YouTube video titles and descriptions instantly',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    href: '/youtube-tools/title-description-extractor',
    gradient: 'from-green-500 to-green-600',
    tags: ['title', 'description', 'extract', 'text']
  },
  {
    id: 'tags-extractor',
    title: 'Tags Extractor',
    description: 'Extract YouTube video tags and keywords for SEO analysis',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    href: '/youtube-tools/tags-extractor',
    gradient: 'from-purple-500 to-purple-600',
    tags: ['tags', 'keywords', 'seo', 'extract']
  },
  {
    id: 'keyword-generator',
    title: 'Keyword Generator',
    description: 'Generate YouTube keywords and tags from any topic for better SEO',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    href: '/youtube-tools/keyword-generator',
    gradient: 'from-indigo-500 to-indigo-600',
    tags: ['keywords', 'generator', 'seo', 'tags', 'autocomplete']
  },
  {
    id: 'region-restriction-checker',
    title: 'Region Restriction Checker',
    description: 'Check if YouTube videos are blocked in specific countries',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    href: '/youtube-tools/region-restriction-checker',
    gradient: 'from-orange-500 to-orange-600',
    tags: ['region', 'restriction', 'blocked', 'country', 'check']
  },
  {
    id: 'transcript-downloader',
    title: 'Transcript Downloader',
    description: 'Download YouTube video transcripts and captions in text or SRT format',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    href: '/youtube-tools/transcript-downloader',
    gradient: 'from-teal-500 to-teal-600',
    tags: ['transcript', 'captions', 'subtitles', 'download', 'text', 'srt']
  }
];

export default function YouTubeToolsHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const isClient = useIsClient();

  // Memoized filtered tools for performance
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;
    
    const query = searchQuery.toLowerCase().trim();
    return tools.filter(tool =>
      tool.title.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header 
        title="YouTube Tools"
        shareTitle="YouTube Tools - Free Online Utilities"
        shareDescription="Free YouTube tools collection. Download thumbnails, extract metadata, and more!"
      />

      <main className="container mx-auto px-4 py-12" role="main">
        <section className="text-center mb-16" aria-labelledby="hero-heading">
          <div className="max-w-4xl mx-auto">
            <h1 id="hero-heading" className="text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
              Free YouTube Tools
              <span className="block text-3xl mt-2 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Powerful YouTube utilities to download thumbnails, extract metadata, check restrictions, and more.
              <span className="block mt-2 text-lg">✨ Free • Fast • No Registration Required</span>
            </p>
            
            <div className="max-w-md mx-auto mb-12" suppressHydrationWarning>
              <div className="relative">
                <label htmlFor="tool-search" className="sr-only">Search YouTube tools</label>
                <Input
                  id="tool-search"
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-12 h-14 text-lg bg-white rounded-2xl shadow-lg border border-gray-200/50 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  aria-describedby="search-description"
                  suppressHydrationWarning
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p id="search-description" className="sr-only">Search through available YouTube tools by name or functionality</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16" aria-labelledby="tools-heading">
          <div className="max-w-6xl mx-auto">
            <h2 id="tools-heading" className="sr-only">Available YouTube Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list" suppressHydrationWarning>
              {filteredTools.map((tool) => (
                <article key={tool.id} role="listitem" className="group">
                  <Link href={tool.href} className="block h-full" aria-describedby={`tool-${tool.id}-desc`}>
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-2 h-full">
                      <div className="p-8">
                        <div className="flex items-start space-x-4">
                          <div className={`w-16 h-16 bg-gradient-to-r ${tool.gradient} rounded-2xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300`} aria-hidden="true">
                            {tool.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                              {tool.title}
                            </h3>
                            <p id={`tool-${tool.id}-desc`} className="text-gray-600 leading-relaxed mb-4">
                              {tool.description}
                            </p>
                            <div className="flex flex-wrap gap-2" role="list" aria-label="Tool tags">
                              {tool.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm" role="listitem">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <svg className="w-6 h-6 text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-16" role="status" aria-live="polite" suppressHydrationWarning>
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools found</h3>
                <p className="text-gray-600">Try searching with different keywords</p>
              </div>
            )}
          </div>
        </section>

        <section className="mb-16" aria-labelledby="features-heading">
          <div className="max-w-6xl mx-auto">
            <h2 id="features-heading" className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Our Tools?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8" role="list">
              <article className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100" role="listitem">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600 text-sm">Instant results with optimized processing</p>
              </article>
              
              <article className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100" role="listitem">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Safe</h3>
                <p className="text-gray-600 text-sm">Secure browser-based processing</p>
              </article>
              
              <article className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100" role="listitem">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Always Free</h3>
                <p className="text-gray-600 text-sm">No hidden costs or registration</p>
              </article>

              <article className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100" role="listitem">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Ready</h3>
                <p className="text-gray-600 text-sm">Works perfectly on all devices</p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}