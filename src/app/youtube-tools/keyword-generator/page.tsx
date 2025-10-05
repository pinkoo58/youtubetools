import KeywordGeneratorClient from './KeywordGeneratorClient';

export const metadata = {
  title: "YouTube Keyword Generator – Free Tag & Keyword Tool",
  description: "Generate YouTube keywords and tags from any topic. Get hundreds of keyword suggestions for better SEO and discoverability. No signup required.",
  openGraph: {
    title: "YouTube Keyword Generator – Free Tag & Keyword Tool",
    description: "Generate YouTube keywords and tags from any topic. Get hundreds of keyword suggestions for better SEO and discoverability. No signup required.",
    url: "https://tools.aipepal.com/youtube-tools/keyword-generator",
    siteName: "AIPepal Tools",
  },
};

export default function KeywordGenerator() {
  return <KeywordGeneratorClient />;
}