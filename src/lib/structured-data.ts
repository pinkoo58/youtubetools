export interface Organization {
  '@context': string
  '@type': string
  name: string
  url: string
  logo: string
  description: string
  sameAs: string[]
}

export interface WebSite {
  '@context': string
  '@type': string
  name: string
  url: string
  description: string
  potentialAction: {
    '@type': string
    target: string
    'query-input': string
  }
}

export interface BreadcrumbList {
  '@context': string
  '@type': string
  itemListElement: Array<{
    '@type': string
    position: number
    name: string
    item: string
  }>
}

export interface WebApplication {
  '@context': string
  '@type': string
  name: string
  url: string
  description: string
  applicationCategory: string
  operatingSystem: string
  offers: {
    '@type': string
    price: string
    priceCurrency: string
  }
}

export const getOrganizationSchema = (): Organization => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AiPEPAL',
  url: 'https://tools.aipepal.com',
  logo: 'https://tools.aipepal.com/logo.png',
  description: 'Free YouTube tools and utilities for content creators and marketers',
  sameAs: []
})

export const getWebSiteSchema = (): WebSite => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'YouTube Tools - Free Online Utilities',
  url: 'https://tools.aipepal.com',
  description: 'Free YouTube tools collection. Download thumbnails, extract titles, descriptions, tags, transcripts, and check region restrictions.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://tools.aipepal.com/?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
})

export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>): BreadcrumbList => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
})

export const getWebApplicationSchema = (name: string, description: string, url: string): WebApplication => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name,
  url,
  description,
  applicationCategory: 'Utility',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  }
})