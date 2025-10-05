'use client'

import { useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { ClientOnly } from '@/components/ClientOnly';
import Link from 'next/link';
import { useTranscript } from '@/hooks/useTranscript';
import { useVideoInfo } from '@/hooks/useVideoInfo';
import { useUI } from '@/contexts/UIContext';
import { downloadTextFile, copyToClipboard, formatTranscriptAsSRT, sanitizeFilename } from '@/utils/youtube';

interface Props {
  videoId: string;
}

const COPY_KEY = 'copy-transcript';
const DOWNLOAD_KEY = 'download-transcript';

export default function TranscriptClient({ videoId }: Props) {
  const { transcript, loading: transcriptLoading, error: transcriptError, fetchTranscript } = useTranscript();
  const { videoInfo, loading: videoInfoLoading, fetchVideoInfo } = useVideoInfo();
  const { isLoading, setLoading, setSuccess, setError } = useUI();
  const [downloadFormat, setDownloadFormat] = useState<'txt' | 'srt'>('txt');

  useEffect(() => {
    if (videoId) {
      fetchTranscript(videoId);
      fetchVideoInfo(videoId);
    }
  }, [videoId, fetchTranscript, fetchVideoInfo]);

  const handleDownloadTranscript = useCallback(async () => {
    if (!transcript?.transcript) return;

    setLoading(DOWNLOAD_KEY, true);
    
    try {
      const content = downloadFormat === 'srt' 
        ? formatTranscriptAsSRT(transcript.transcript)
        : transcript.transcript;
      
      const filename = sanitizeFilename(
        `${videoInfo?.title || videoId}_transcript.${downloadFormat}`
      );
      
      downloadTextFile(content, filename, downloadFormat === 'srt' ? 'text/srt' : 'text/plain');
      setSuccess(DOWNLOAD_KEY, `Transcript downloaded as ${downloadFormat.toUpperCase()}!`);
    } catch (error) {
      setError(DOWNLOAD_KEY, 'Failed to download transcript. Please try again.');
    } finally {
      setLoading(DOWNLOAD_KEY, false);
    }
  }, [transcript, downloadFormat, videoInfo, videoId, setLoading, setSuccess, setError]);

  const handleCopyTranscript = useCallback(async () => {
    if (!transcript?.transcript) return;

    setLoading(COPY_KEY, true);
    
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await copyToClipboard(transcript.transcript);
        setSuccess(COPY_KEY, 'Transcript copied to clipboard!');
      } else {
        setError(COPY_KEY, 'Clipboard not available in this browser.');
      }
    } catch (error) {
      setError(COPY_KEY, 'Failed to copy transcript. Please try again.');
    } finally {
      setLoading(COPY_KEY, false);
    }
  }, [transcript, setLoading, setSuccess, setError]);



  if (transcriptLoading || videoInfoLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transcript...</p>
        </div>
      </div>
    );
  }

  if (transcriptError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 border-b border-blue-700 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <span className="text-xl font-semibold text-white">AiPEPAL.Com</span>
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Transcript Available</h2>
            <p className="text-gray-600 mb-6">{transcriptError}</p>
            <Link href="/youtube-tools/transcript-downloader">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Try Another Video
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 border-b border-blue-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <span className="text-xl font-semibold text-white">AiPEPAL.Com</span>
              </Link>
              <span className="text-white/60">|</span>
              <h1 className="text-lg font-medium text-white/90">Transcript</h1>
            </div>
            <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Video Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Video Thumbnail & Player */}
            <div className="lg:w-1/2">
              <ClientOnly fallback={
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-gray-500">Loading video player...</div>
                </div>
              }>
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4" suppressHydrationWarning>
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </ClientOnly>
              <img 
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt="Video thumbnail"
                className="w-full rounded-lg border border-gray-200 hidden"
              />
            </div>

            {/* Video Details */}
            <div className="lg:w-1/2">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {videoInfo?.title || 'YouTube Video Transcript'}
              </h2>
              {transcript && (
                <div className="text-sm text-gray-600 mb-4 space-y-1">
                  <p>Language: {transcript.trackName} ({transcript.language})</p>
                  <p>Word Count: {transcript.wordCount.toLocaleString()}</p>
                </div>
              )}
              
              <div className="space-y-3">
                <ClientOnly>
                  <div className="flex gap-2 mb-3" suppressHydrationWarning>
                    <button
                      onClick={() => setDownloadFormat('txt')}
                      className={`px-3 py-1 text-sm rounded ${downloadFormat === 'txt' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      TXT
                    </button>
                    <button
                      onClick={() => setDownloadFormat('srt')}
                      className={`px-3 py-1 text-sm rounded ${downloadFormat === 'srt' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      SRT
                    </button>
                  </div>
                </ClientOnly>
                
                <LoadingButton 
                  onClick={handleCopyTranscript}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!transcript}
                  loading={isLoading(COPY_KEY)}
                  loadingText="Copying..."
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  }
                >
                  Copy Transcript
                </LoadingButton>
                
                <LoadingButton 
                  onClick={handleDownloadTranscript}
                  variant="outline"
                  className="w-full"
                  disabled={!transcript}
                  loading={isLoading(DOWNLOAD_KEY)}
                  loadingText="Downloading..."
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                >
                  Download as {downloadFormat.toUpperCase()}
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>

        {/* Transcript Content */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-200 bg-green-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Transcript</h3>
                <p className="text-sm text-gray-600 mt-1">Full transcript available</p>
              </div>
              <Link href="/youtube-tools/transcript-downloader">
                <Button variant="outline" className="bg-blue-600 text-white hover:bg-blue-700">
                  ← Search New Video
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="prose max-w-none">
              <p className="text-gray-800 leading-relaxed text-justify whitespace-pre-wrap">
                {transcript?.transcript}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}