/**
 * Environment configuration for production deployment
 */

export const config = {
  // Rate limiting
  rateLimit: {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  },
  
  // API timeouts
  timeouts: {
    youtube: parseInt(process.env.YOUTUBE_TIMEOUT || '20000'), // 20 seconds
    transcript: parseInt(process.env.TRANSCRIPT_TIMEOUT || '25000'), // 25 seconds
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'INFO',
    enableDebug: process.env.NODE_ENV === 'development',
  },
  
  // Security
  security: {
    allowedOrigins: [
      'http://localhost:3000',
      'https://localhost:3000', 
      'https://tools.aipepal.com',
      // Add Vercel preview URLs
      ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
      // Add custom domain
      ...(process.env.CUSTOM_DOMAIN ? [`https://${process.env.CUSTOM_DOMAIN}`] : []),
    ].filter(Boolean),
  },
  
  // Feature flags
  features: {
    enableCaching: process.env.ENABLE_CACHING !== 'false',
    enableRateLimit: process.env.ENABLE_RATE_LIMIT !== 'false',
    enableDetailedLogging: process.env.ENABLE_DETAILED_LOGGING === 'true',
  },
  
  // Environment info
  environment: {
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isVercel: !!process.env.VERCEL,
    region: process.env.VERCEL_REGION || 'unknown',
  },
};

export default config;