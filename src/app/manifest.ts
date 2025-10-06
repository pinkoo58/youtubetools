import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'YouTube Tools - Free Online Utilities',
    short_name: 'YouTube Tools',
    description: 'Free YouTube tools collection. Download thumbnails, extract titles, descriptions, tags, transcripts, and check region restrictions.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ef4444',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
    ],
  }
}