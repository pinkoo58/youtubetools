const CACHE_NAME = 'youtube-tools-v1'
const urlsToCache = [
  '/',
  '/youtube-tools/thumbnail-downloader',
  '/youtube-tools/transcript-downloader',
  '/youtube-tools/title-description-extractor',
  '/youtube-tools/tags-extractor',
  '/youtube-tools/keyword-generator',
  '/youtube-tools/region-restriction-checker',
  '/manifest.json'
]

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})