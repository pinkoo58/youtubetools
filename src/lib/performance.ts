// Performance monitoring and optimization utilities

export const measureWebVitals = async () => {
  if (typeof window !== 'undefined') {
    try {
      // Measure Core Web Vitals
      const webVitals = await import('web-vitals' as any)
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitals
      getCLS(console.log)
      getFID(console.log)
      getFCP(console.log)
      getLCP(console.log)
      getTTFB(console.log)
    } catch {
      // Silently fail if web-vitals is not available
    }
  }
}

export const preloadCriticalResources = () => {
  if (typeof window !== 'undefined') {
    // Preload critical fonts
    const fontPreloads = [
      'https://fonts.gstatic.com/s/geist/v1/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa0ZL7W0Q5n-wU.woff2',
    ]
    
    fontPreloads.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      // Validate href to prevent XSS
      try {
        const url = new URL(href)
        if (url.protocol === 'https:' || url.protocol === 'http:') {
          link.href = href
          if (document.head) {
            document.head.appendChild(link)
          }
        }
      } catch (e) {
        console.warn('Invalid font preload URL:', href)
      }
    })

    // Preconnect to external domains
    const preconnectDomains = [
      'https://www.youtube.com',
      'https://img.youtube.com',
      'https://i.ytimg.com',
    ]
    
    preconnectDomains.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      // Validate href to prevent XSS
      try {
        const url = new URL(href)
        if (url.protocol === 'https:' || url.protocol === 'http:') {
          link.href = href
          if (document.head) {
            document.head.appendChild(link)
          }
        }
      } catch (e) {
        console.warn('Invalid preconnect URL:', href)
      }
    })
  }
}

export const optimizeImages = () => {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    // Lazy load images
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.classList.remove('lazy')
            observer.unobserve(img)
          }
        }
      })
    })

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img)
    })
  }
}

export const enableServiceWorker = async () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered:', registration)
    } catch (error) {
      console.log('Service Worker registration failed:', error)
    }
  }
}

// Debounce function for performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function for performance optimization
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}