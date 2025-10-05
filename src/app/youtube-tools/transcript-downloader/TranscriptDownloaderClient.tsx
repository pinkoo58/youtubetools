'use client'

import { useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClientOnly } from '@/components/ClientOnly';
import { Header } from '@/components/Header';
import { extractVideoId, isValidYouTubeUrl } from '@/utils/youtube';
import { useTranscript } from '@/hooks/useTranscript';
import { useVideoInfo } from '@/hooks/useVideoInfo';
import { downloadTranscript } from '@/utils/download';

export default function TranscriptDownloaderClient() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  
  const { transcript, loading: transcriptLoading, error: transcriptError, fetchTranscript } = useTranscript();
  const { videoInfo, loading: videoLoading, fetchVideoInfo } = useVideoInfo();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!url.trim()) {
      setError('Please enter a YouTube URL.');
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setError('Invalid YouTube URL. Please paste a valid YouTube video link.');
      return;
    }
    
    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Could not extract video ID from URL.');
      return;
    }

    setCurrentVideoId(videoId);
    await Promise.all([
      fetchTranscript(videoId),
      fetchVideoInfo(videoId)
    ]);
  }, [url, fetchTranscript, fetchVideoInfo]);

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header 
        title="YouTube Transcript Downloader"
        shareTitle="YouTube Transcript Downloader - Free Tool"
        shareDescription="Download YouTube video transcripts and captions in multiple formats. Free tool with no registration required."
        showBackButton={true}
      />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
              Download YouTube Transcripts
              <span className="block text-3xl mt-2 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                & Captions
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Extract and download YouTube video transcripts in multiple formats. Support for all video types.
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
                      onChange={handleUrlChange}
                      className="border-0 text-lg h-14 bg-transparent focus:ring-0 placeholder:text-gray-400"
                      required
                      aria-describedby={error ? "url-error" : undefined}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={transcriptLoading || videoLoading}
                    className="h-14 px-8 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {(transcriptLoading || videoLoading) ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Get Transcript</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
              
              <ClientOnly>
                {(error || transcriptError) && (
                  <div id="url-error" className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl" suppressHydrationWarning>
                    <p className="text-red-600 flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{error || transcriptError}</span>
                    </p>
                  </div>
                )}
              </ClientOnly>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <ClientOnly>
          {transcript && videoInfo && currentVideoId && (
            <section className="mb-16" suppressHydrationWarning>
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Video Transcript</h3>
              <p className="text-gray-600">Copy the transcript or download in your preferred format</p>
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
                          Transcript Ready
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">{videoInfo.title}</h4>
                        <p className="text-gray-600 text-lg mb-2">Channel: {videoInfo.author}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Language: {transcript.language}</span>
                          <span>Words: {transcript.wordCount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transcript Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-2xl font-bold text-gray-900">Transcript Text</h4>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => {
                          if (typeof navigator !== 'undefined' && navigator.clipboard) {
                            navigator.clipboard.writeText(transcript.transcript);
                          }
                        }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                        suppressHydrationWarning
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Text
                      </Button>
                      <Button
                        onClick={() => downloadTranscript(transcript.transcript, videoInfo.title, 'txt')}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download TXT
                      </Button>
                      <Button
                        onClick={() => downloadTranscript(transcript.transcript, videoInfo.title, 'srt')}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download SRT
                      </Button>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-mono">{transcript.transcript}</pre>
                  </div>
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
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Multiple Formats</h4>
                <p className="text-gray-600">Download transcripts as SRT or plain text format for any use case</p>
              </div>
              
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h4>
                <p className="text-gray-600">Extract video transcripts in seconds with our optimized processing</p>
              </div>
              
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
                <h4 className="text-xl font-semibold text-gray-900 mb-3">How do I download YouTube transcripts?</h4>
                <p className="text-gray-600 leading-relaxed">Simply paste the YouTube video URL into the input field above and click "Get Transcript". You'll be redirected to a page where you can view and download the transcript in multiple formats.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">What transcript formats are available?</h4>
                <p className="text-gray-600 leading-relaxed">Our tool supports downloading transcripts in both SRT (SubRip) format for subtitles and plain text format for easy reading and editing.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Is this transcript downloader free?</h4>
                <p className="text-gray-600 leading-relaxed">Yes! Our YouTube Transcript Downloader is 100% free with no registration required. You can download unlimited transcripts without any restrictions.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}