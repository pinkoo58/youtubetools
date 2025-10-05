import { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string
  canonical?: string
  noindex?: boolean
  ogImage?: string
  twitterCard?: 'summary' | 'summary_large_image'
}

export const generateMetadata = (config: SEOConfig): Metadata => {
  const baseUrl = 'https://tools.aipepal.com'
  const defaultImage = `${baseUrl}/og-image.png`
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    robots: config.noindex ? 'noindex, nofollow' : 'index, follow',
    
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.canonical || baseUrl,
      siteName: 'YouTube Tools',
      images: [
        {
          url: config.ogImage || defaultImage,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    
    twitter: {
      card: config.twitterCard || 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [config.ogImage || defaultImage],
    },
    
    alternates: {
      canonical: config.canonical || baseUrl,
    },
    
    other: {
      'last-modified': new Date().toISOString(),
    },
  }
}

export const toolsMetadata = {
  'thumbnail-downloader': {
    title: 'YouTube Thumbnail Downloader - Download HD Thumbnails Free',
    description: 'Download YouTube video thumbnails in HD, HQ, and SD quality. Free online tool to extract and save YouTube thumbnail images instantly.',
    keywords: 'youtube thumbnail downloader, download youtube thumbnail, youtube thumbnail extractor, hd thumbnail, youtube image download',
  },
  'title-description-extractor': {
    title: 'YouTube Title & Description Extractor - Free Online Tool',
    description: 'Extract YouTube video titles and descriptions instantly. Free tool to copy video metadata for content analysis and SEO research.',
    keywords: 'youtube title extractor, youtube description extractor, video metadata, youtube seo tools, content analysis',
  },
  'tags-extractor': {
    title: 'YouTube Tags Extractor - Extract Video Tags & Keywords',
    description: 'Extract YouTube video tags and keywords for SEO analysis. Free tool to discover competitor tags and improve your video optimization.',
    keywords: 'youtube tags extractor, video tags, youtube keywords, seo tags, youtube optimization, competitor analysis',
  },
  'keyword-generator': {
    title: 'YouTube Keyword Generator - Free SEO Keywords Tool',
    description: 'Generate YouTube keywords and tags from any topic. Free keyword research tool for better video SEO and discoverability.',
    keywords: 'youtube keyword generator, youtube seo keywords, video keywords, youtube tags generator, keyword research',
  },
  'region-restriction-checker': {
    title: 'YouTube Region Restriction Checker - Check Video Availability',
    description: 'Check if YouTube videos are blocked in specific countries. Free tool to verify video accessibility across different regions.',
    keywords: 'youtube region checker, video blocked countries, youtube geo restriction, video availability checker',
  },
  'transcript-downloader': {
    title: 'YouTube Transcript Downloader - Download Captions & Subtitles',
    description: 'Download YouTube video transcripts and captions in TXT or SRT format. Free tool to extract video subtitles and closed captions.',
    keywords: 'youtube transcript downloader, download youtube captions, youtube subtitles, video transcript, srt download',
  },
}