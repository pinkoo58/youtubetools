import ThumbnailDownloaderClient from './ThumbnailDownloaderClient';
import { generateToolMetadata } from '@/lib/metadata-template';
import { ToolPageTemplate } from '@/components/ToolPageTemplate';

export const metadata = generateToolMetadata({
  toolId: 'thumbnail-downloader',
  path: '/youtube-tools/thumbnail-downloader'
});

export default function ThumbnailDownloader() {
  return (
    <ToolPageTemplate
      toolId="thumbnail-downloader"
      path="/youtube-tools/thumbnail-downloader"
    >
      <ThumbnailDownloaderClient />
    </ToolPageTemplate>
  );
}