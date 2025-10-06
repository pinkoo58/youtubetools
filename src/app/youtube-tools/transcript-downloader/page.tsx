import TranscriptDownloaderClient from './TranscriptDownloaderClient'
import { generateToolMetadata } from '@/lib/metadata-template'
import { ToolPageTemplate } from '@/components/ToolPageTemplate'

export const metadata = generateToolMetadata({
  toolId: 'transcript-downloader',
  path: '/youtube-tools/transcript-downloader'
});

export default function TranscriptDownloader() {
  return (
    <ToolPageTemplate
      toolId="transcript-downloader"
      path="/youtube-tools/transcript-downloader"
      breadcrumbName="Transcript Downloader"
    >
      <TranscriptDownloaderClient />
    </ToolPageTemplate>
  )
}