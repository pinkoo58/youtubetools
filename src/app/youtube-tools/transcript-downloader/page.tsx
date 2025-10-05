import TranscriptDownloaderClient from './TranscriptDownloaderClient'
import { generateMetadata } from '@/lib/seo'
import { toolsMetadata } from '@/lib/seo'
import { getBreadcrumbSchema, getWebApplicationSchema } from '@/lib/structured-data'

export const metadata = generateMetadata({
  title: toolsMetadata['transcript-downloader'].title,
  description: toolsMetadata['transcript-downloader'].description,
  keywords: toolsMetadata['transcript-downloader'].keywords,
  canonical: 'https://tools.aipepal.com/youtube-tools/transcript-downloader',
})

export default function TranscriptDownloader() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: 'https://tools.aipepal.com' },
    { name: 'YouTube Tools', url: 'https://tools.aipepal.com' },
    { name: 'Transcript Downloader', url: 'https://tools.aipepal.com/youtube-tools/transcript-downloader' },
  ])

  const appSchema = getWebApplicationSchema(
    'YouTube Transcript Downloader',
    'Download YouTube video transcripts and captions in TXT or SRT format. Free tool to extract video subtitles and closed captions.',
    'https://tools.aipepal.com/youtube-tools/transcript-downloader'
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(appSchema),
        }}
      />
      <TranscriptDownloaderClient />
    </>
  )
}