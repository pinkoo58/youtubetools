import ThumbnailDownloaderClient from './ThumbnailDownloaderClient';

export const metadata = {
  title: "YouTube Thumbnail Downloader – Free Online Tool",
  description: "Download YouTube video thumbnails in high quality (HD, HQ, SD) for free. No signup required.",
  openGraph: {
    title: "YouTube Thumbnail Downloader – Free Online Tool",
    description: "Download YouTube video thumbnails in high quality (HD, HQ, SD) for free. No signup required.",
    url: "https://tools.aipepal.com/youtube-tools/thumbnail-downloader",
    siteName: "AIPepal Tools",
  },
};

export default function ThumbnailDownloader() {
  return <ThumbnailDownloaderClient />;
}