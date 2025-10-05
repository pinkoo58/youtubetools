import YouTubeToolsHome from './YouTubeToolsHome';
import { generateMetadata } from '@/lib/seo';

export const metadata = generateMetadata({
  title: "YouTube Tools - Free Online Utilities | Download, Extract & Analyze Videos",
  description: "Free YouTube tools collection. Download thumbnails, extract titles, descriptions, tags, transcripts, and check region restrictions. No signup required - 100% free forever.",
  keywords: "youtube tools, thumbnail downloader, transcript extractor, youtube utilities, free tools, youtube seo, video analysis, youtube downloader, caption extractor, youtube tags, video metadata, youtube keywords, region checker",
  canonical: "https://tools.aipepal.com",
});

export default function Home() {
  return <YouTubeToolsHome />;
}
