'use client'

import { useState } from 'react';
import { YouTubeToolClient } from '@/components/YouTubeToolClient';
import { Button } from "@/components/ui/button";
import { ClientOnly } from '@/components/ClientOnly';
import { toolConfigs, faqSchemas } from '@/lib/tool-configs';
import { extractVideoId } from '@/utils/video-id';

export default function TagsExtractorClient() {
  const [error, setError] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (url: string) => {
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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch video tags');
      }
      
      setTimeout(() => {
        setTags(result.data?.tags || []);
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

  const resultsSection = tags.length > 0 && (
    <ClientOnly>
      <section className="mb-16" suppressHydrationWarning>
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Video Tags ({tags.length})</h3>
          <p className="text-gray-600">Select tags to copy or copy all at once</p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={selectAll} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                Select All ({tags.length})
              </Button>
              <Button onClick={clearSelection} variant="outline">
                Clear Selection
              </Button>
              <Button onClick={copySelectedTags} disabled={selectedTags.size === 0} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                Copy Selected ({selectedTags.size})
              </Button>
              <Button onClick={copyAllTags} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
                Copy All Tags
              </Button>
            </div>
          </div>

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
    </ClientOnly>
  );

  return (
    <YouTubeToolClient
      config={toolConfigs['tags-extractor']}
      onSubmit={handleSubmit}
      loading={isLoading}
      error={error}
      resultsSection={resultsSection}
      faqSchema={faqSchemas['tags-extractor']}
    />
  );
}