'use client'

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClientOnly } from '@/components/ClientOnly';
import { Header } from '@/components/Header';
import Script from 'next/script';

export default function KeywordGeneratorClient() {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuggestions([]);
    setSelectedKeywords(new Set());
    
    if (!query.trim()) {
      setError('Please enter a keyword or topic.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/youtube-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to generate keywords');
        return;
      }

      setSuggestions(data.suggestions || []);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleKeyword = (keyword: string) => {
    const newSelected = new Set(selectedKeywords);
    if (newSelected.has(keyword)) {
      newSelected.delete(keyword);
    } else {
      newSelected.add(keyword);
    }
    setSelectedKeywords(newSelected);
  };

  const selectAll = () => {
    setSelectedKeywords(new Set(suggestions));
  };

  const clearAll = () => {
    setSelectedKeywords(new Set());
  };

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const text = Array.from(selectedKeywords).join(', ');
      navigator.clipboard.writeText(text);
    }
  };

  const exportCSV = () => {
    if (typeof document !== 'undefined') {
      const csv = Array.from(selectedKeywords).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `youtube-keywords-${query.replace(/\s+/g, '-')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Header 
          title="YouTube Keyword Generator"
          shareTitle="YouTube Keyword Generator - Free SEO Keywords & Tags"
          shareDescription="Generate YouTube keywords and tags from any topic using autocomplete data. Free SEO tool for better video rankings."
          showBackButton={true}
        />

        <main className="container mx-auto px-4 py-12">
          <section className="text-center mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                Generate YouTube Keywords
                <span className="block text-3xl mt-2 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  & Tags for Better SEO
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Discover hundreds of keyword suggestions based on YouTube's autocomplete data.
                <span className="block mt-2 text-lg">✨ Free • Unlimited • Export Ready</span>
              </p>
              
              <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="relative">
                  <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-2xl shadow-2xl border border-gray-200/50">
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder="Enter a topic or keyword (e.g., how to cook pasta)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
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
                          <span>Generating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span>Generate Keywords</span>
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
            {suggestions.length > 0 && (
              <section className="mb-16" suppressHydrationWarning>
                <div className="max-w-6xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">Generated Keywords</h3>
                          <p className="text-gray-600">Found {suggestions.length} suggestions • {selectedKeywords.size} selected</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button onClick={selectAll} variant="outline" size="sm">
                            Select All
                          </Button>
                          <Button onClick={clearAll} variant="outline" size="sm">
                            Clear All
                          </Button>
                          <Button 
                            onClick={copyToClipboard} 
                            disabled={selectedKeywords.size === 0}
                            className="bg-blue-600 hover:bg-blue-700"
                            size="sm"
                          >
                            Copy Selected
                          </Button>
                          <Button 
                            onClick={exportCSV} 
                            disabled={selectedKeywords.size === 0}
                            className="bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            Export CSV
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((keyword, index) => (
                          <button
                            key={index}
                            onClick={() => toggleKeyword(keyword)}
                            className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              selectedKeywords.has(keyword)
                                ? 'bg-red-100 text-red-800 border-2 border-red-300'
                                : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                            }`}
                          >
                            {selectedKeywords.has(keyword) && (
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            {keyword}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </ClientOnly>

          <section className="mb-16">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">How to Use YouTube Keywords</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Video Titles</h4>
                  <p className="text-gray-600">Use keywords in your video titles to improve search rankings and click-through rates</p>
                </div>
                
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Video Tags</h4>
                  <p className="text-gray-600">Add relevant tags to help YouTube understand your content and suggest it to viewers</p>
                </div>
                
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Descriptions</h4>
                  <p className="text-gray-600">Include keywords naturally in your video descriptions for better SEO performance</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      
      <Script
        id="keyword-generator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "YouTube Keyword Generator",
            "description": "Generate YouTube keywords and tags from any topic using autocomplete data",
            "url": "https://tools.aipepal.com/youtube-tools/keyword-generator",
            "applicationCategory": "SEO Tool"
          })
        }}
      />
    </>
  );
}