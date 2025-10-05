/**
 * Application configuration and environment variables
 */

import { z } from 'zod';

// Environment variable schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  YOUTUBE_API_KEY: z.string().optional(),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000), // 15 minutes
  LOG_LEVEL: z.enum(['ERROR', 'WARN', 'INFO', 'DEBUG']).default('INFO'),
});

// Parse and validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Invalid environment configuration');
  }
};

export const env = parseEnv();

// Application configuration
export const config = {
  // API Configuration
  api: {
    timeout: 15000, // 15 seconds
    retries: 3,
    rateLimit: {
      maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
      windowMs: env.RATE_LIMIT_WINDOW_MS,
    },
  },
  
  // YouTube Configuration
  youtube: {
    apiKey: env.YOUTUBE_API_KEY,
    maxTranscriptLength: 1000000, // 1MB
    supportedFormats: ['txt', 'srt'] as const,
  },
  
  // Security Configuration
  security: {
    allowedOrigins: [
      'http://localhost:3000',
      'https://localhost:3000',
      // Add production domains here
    ],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  
  // Logging Configuration
  logging: {
    level: env.LOG_LEVEL,
    enableConsole: env.NODE_ENV !== 'production',
    enableFile: env.NODE_ENV === 'production',
  },
  
  // Cache Configuration
  cache: {
    transcript: {
      ttl: 3600, // 1 hour
      maxSize: 100, // Max 100 cached transcripts
    },
    videoInfo: {
      ttl: 7200, // 2 hours
      maxSize: 200, // Max 200 cached video info
    },
  },
} as const;

// Type exports
export type Config = typeof config;
export type Environment = z.infer<typeof envSchema>;