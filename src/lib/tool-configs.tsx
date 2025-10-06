import { ReactNode } from 'react';

export interface ToolConfig {
  title: string;
  subtitle: string;
  description: string;
  shareTitle: string;
  shareDescription: string;
  inputPlaceholder: string;
  buttonText: string;
  loadingText: string;
  buttonIcon: ReactNode;
  inputType?: 'url' | 'text';
  requiresVideoId?: boolean;
}

// Common icons
export const icons = {
  download: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  extract: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
    </svg>
  ),
  tags: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  generate: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  check: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

export const toolConfigs: Record<string, ToolConfig> = {
  'thumbnail-downloader': {
    title: 'Download YouTube Thumbnails',
    subtitle: 'in High Quality',
    description: 'Extract and download YouTube video thumbnails instantly. Support for all video formats including Shorts.',
    shareTitle: 'YouTube Thumbnail Downloader - Free High Quality Downloads',
    shareDescription: 'Download YouTube video thumbnails in high quality instantly. Free tool with no registration required.',
    inputPlaceholder: 'Paste your YouTube URL here (e.g., https://youtube.com/watch?v=...)',
    buttonText: 'Get Thumbnails',
    loadingText: 'Processing...',
    buttonIcon: icons.extract,
    inputType: 'url',
    requiresVideoId: true
  },
  'transcript-downloader': {
    title: 'Download YouTube Transcripts',
    subtitle: '& Captions',
    description: 'Extract and download YouTube video transcripts in multiple formats. Support for all video types.',
    shareTitle: 'YouTube Transcript Downloader - Free Tool',
    shareDescription: 'Download YouTube video transcripts and captions in multiple formats. Free tool with no registration required.',
    inputPlaceholder: 'Paste your YouTube URL here (e.g., https://youtube.com/watch?v=...)',
    buttonText: 'Get Transcript',
    loadingText: 'Processing...',
    buttonIcon: icons.download,
    inputType: 'url',
    requiresVideoId: true
  },
  'tags-extractor': {
    title: 'Extract YouTube Tags',
    subtitle: 'Instantly',
    description: 'Extract YouTube video tags and copy selected ones or all at once. Perfect for content creators and SEO analysis.',
    shareTitle: 'YouTube Tags Extractor - Free SEO Tool',
    shareDescription: 'Extract YouTube video tags instantly for SEO analysis. Free tool with no registration required.',
    inputPlaceholder: 'Paste your YouTube URL here (e.g., https://youtube.com/watch?v=...)',
    buttonText: 'Extract Tags',
    loadingText: 'Extracting...',
    buttonIcon: icons.tags,
    inputType: 'url',
    requiresVideoId: true
  },
  'keyword-generator': {
    title: 'Generate YouTube Keywords',
    subtitle: '& Tags for Better SEO',
    description: 'Discover hundreds of keyword suggestions based on YouTube\'s autocomplete data.',
    shareTitle: 'YouTube Keyword Generator - Free SEO Keywords & Tags',
    shareDescription: 'Generate YouTube keywords and tags from any topic using autocomplete data. Free SEO tool for better video rankings.',
    inputPlaceholder: 'Enter a topic or keyword (e.g., how to cook pasta)',
    buttonText: 'Generate Keywords',
    loadingText: 'Generating...',
    buttonIcon: icons.generate,
    inputType: 'text',
    requiresVideoId: false
  },
  'title-description-extractor': {
    title: 'Extract YouTube Title',
    subtitle: '& Description',
    description: 'Extract YouTube video titles and descriptions instantly. Perfect for content analysis and research.',
    shareTitle: 'YouTube Title & Description Extractor - Free Tool',
    shareDescription: 'Extract YouTube video titles and descriptions instantly. Free tool with no registration required.',
    inputPlaceholder: 'Paste your YouTube URL here (e.g., https://youtube.com/watch?v=...)',
    buttonText: 'Extract Info',
    loadingText: 'Extracting...',
    buttonIcon: icons.extract,
    inputType: 'url',
    requiresVideoId: true
  },
  'region-restriction-checker': {
    title: 'Check YouTube Region',
    subtitle: 'Restrictions',
    description: 'Check if YouTube videos are blocked in specific countries. Verify regional availability instantly.',
    shareTitle: 'YouTube Region Restriction Checker - Free Tool',
    shareDescription: 'Check if YouTube videos are blocked in specific countries. Free tool with no registration required.',
    inputPlaceholder: 'Paste your YouTube URL here (e.g., https://youtube.com/watch?v=...)',
    buttonText: 'Check Regions',
    loadingText: 'Checking...',
    buttonIcon: icons.check,
    inputType: 'url',
    requiresVideoId: true
  }
};

// Common FAQ schemas
export const faqSchemas = {
  'thumbnail-downloader': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How can I download a YouTube thumbnail?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Paste the YouTube video URL into the input field and click 'Get Thumbnails'. Then select the desired quality and click 'Download'."
        }
      },
      {
        "@type": "Question",
        "name": "Is this YouTube Thumbnail Downloader free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our tool is completely free to use with no registration required."
        }
      }
    ]
  },
  'tags-extractor': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How can I extract YouTube video tags?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Paste the YouTube video URL into the input field and click 'Extract Tags'. You can then select specific tags or copy all tags at once."
        }
      },
      {
        "@type": "Question",
        "name": "Is this YouTube Tags Extractor free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our tool is completely free to use with no registration required."
        }
      }
    ]
  }
};