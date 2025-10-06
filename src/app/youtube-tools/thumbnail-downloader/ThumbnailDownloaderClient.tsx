'use client'

import { useState } from 'react';
import { YouTubeToolClient } from '@/components/YouTubeToolClient';
import ThumbnailCard from "@/components/ThumbnailCard";
import { ClientOnly } from '@/components/ClientOnly';
import { toolConfigs, faqSchemas } from '@/lib/tool-configs';
import { extractVideoId } from '@/utils/video-id';

const THUMBNAIL_QUALITIES = [
  { key: 'maxresdefault', resolution: '1280x720 (HD)', label: 'HD' },
  { key: 'hqdefault', resolution: '480x360 (HQ)', label: 'HQ' },
  { key: 'mqdefault', resolution: '320x180 (MQ)', label: 'MQ' },
  { key: 'default', resolution: '120x90 (Default)', label: 'SD' },
];

export default function ThumbnailDownloaderClient() {
  const [error, setError] = useState('');
  const [thumbnails, setThumbnails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    
    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Invalid YouTube URL. Please paste a valid YouTube video link.');
      setThumbnails([]);
      setIsLoading(false);
      return;
    }

    setError('');
    const thumbs = THUMBNAIL_QUALITIES.map(q => ({
      url: `https://img.youtube.com/vi/${videoId}/${q.key}.jpg`,
      quality: q.key,
      resolution: q.resolution,
    }));
    
    setTimeout(() => {
      setThumbnails(thumbs);
      setIsLoading(false);
    }, 500);
  };

  const resultsSection = thumbnails.length > 0 && (
    <ClientOnly>
      <section className="mb-16" suppressHydrationWarning>
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Available Thumbnails</h3>
          <p className="text-gray-600">Choose your preferred quality and download instantly</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {thumbnails.map((thumb, index) => (
            <ThumbnailCard key={index} {...thumb} />
          ))}
        </div>
      </section>
    </ClientOnly>
  );

  return (
    <YouTubeToolClient
      config={toolConfigs['thumbnail-downloader']}
      onSubmit={handleSubmit}
      loading={isLoading}
      error={error}
      resultsSection={resultsSection}
      faqSchema={faqSchemas['thumbnail-downloader']}
    />
  );
}