import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ThumbnailCardProps {
  url: string;
  quality: string;
  resolution: string;
}

export default function ThumbnailCard({ url, quality, resolution }: ThumbnailCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = async () => {
    if (!url || isLoading || typeof document === 'undefined') return;
    
    setIsLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        mode: 'cors',
        cache: 'default',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Validate file type
      if (!blob.type.startsWith('image/')) {
        throw new Error('Invalid file type');
      }
      
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `youtube-thumbnail-${quality}.jpg`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      if (error instanceof Error && error.name !== 'AbortError' && typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const getQualityBadge = () => {
    const badges = {
      'maxresdefault': { color: 'from-emerald-500 to-emerald-600', text: 'HD' },
      'hqdefault': { color: 'from-blue-500 to-blue-600', text: 'HQ' },
      'mqdefault': { color: 'from-orange-500 to-orange-600', text: 'MQ' },
      'default': { color: 'from-gray-500 to-gray-600', text: 'SD' },

    };
    return badges[quality as keyof typeof badges] || badges.default;
  };

  const badge = getQualityBadge();

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1" suppressHydrationWarning>
      {/* Image Container */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={url}
          alt={`YouTube thumbnail ${quality}`}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          suppressHydrationWarning
        />
        
        {/* Quality Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${badge.color} shadow-lg`}>
            {badge.text}
          </span>
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-gray-900 text-lg">{resolution}</h4>
            <p className="text-sm text-gray-500 capitalize">{quality.replace('default', 'standard')} Quality</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Format</div>
            <div className="text-sm font-medium text-gray-600">JPG</div>
          </div>
        </div>
        
        <Button 
          onClick={handleDownload} 
          disabled={isLoading || !imageLoaded}
          className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Downloading...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <span>Download</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}