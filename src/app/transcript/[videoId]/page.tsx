import { Metadata } from 'next';
import TranscriptClient from './TranscriptClient';

interface Props {
  params: Promise<{ videoId: string }>;
}

async function getVideoTitle(videoId: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const url = new URL('https://www.youtube.com/oembed');
    url.searchParams.set('url', `https://www.youtube.com/watch?v=${videoId}`);
    url.searchParams.set('format', 'json');
    
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TranscriptBot/1.0)' }
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.title === 'string') {
        return data.title.substring(0, 200);
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      console.error('Error fetching video title:', error.message);
    }
  }
  return 'YouTube Video';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { videoId } = await params;
  const videoTitle = await getVideoTitle(videoId);
  
  return {
    title: `Download YouTube Transcript – ${videoTitle}`,
    description: `Instantly get subtitles or captions from ${videoTitle} – online transcript extractor tool.`,
    openGraph: {
      title: `Download YouTube Transcript – ${videoTitle}`,
      description: `Instantly get subtitles or captions from ${videoTitle} – online transcript extractor tool.`,
      url: `https://tools.aipepal.com/transcript/${videoId}`,
      siteName: 'AIPepal Tools',
    },
  };
}

export default async function TranscriptPage({ params }: Props) {
  const { videoId } = await params;
  return <TranscriptClient videoId={videoId} />;
}