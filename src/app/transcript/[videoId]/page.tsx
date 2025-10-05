import { Metadata } from 'next';
import TranscriptClient from './TranscriptClient';

interface Props {
  params: { videoId: string };
}

async function getVideoTitle(videoId: string) {
  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    if (response.ok) {
      const data = await response.json();
      return data.title;
    }
  } catch (error) {
    console.error('Error fetching video title:', error);
  }
  return 'YouTube Video';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const videoTitle = await getVideoTitle(params.videoId);
  
  return {
    title: `Download YouTube Transcript – ${videoTitle}`,
    description: `Instantly get subtitles or captions from ${videoTitle} – online transcript extractor tool.`,
    openGraph: {
      title: `Download YouTube Transcript – ${videoTitle}`,
      description: `Instantly get subtitles or captions from ${videoTitle} – online transcript extractor tool.`,
      url: `https://tools.aipepal.com/transcript/${params.videoId}`,
      siteName: 'AIPepal Tools',
    },
  };
}

export default function TranscriptPage({ params }: Props) {
  return <TranscriptClient videoId={params.videoId} />;
}