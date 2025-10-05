/**
 * Input validation schemas and utilities
 */

import { z } from 'zod';
import { createApiError } from './error-handler';

// Enhanced video ID validation
export const VideoIdSchema = z.string()
  .min(11, 'Video ID must be exactly 11 characters')
  .max(11, 'Video ID must be exactly 11 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Video ID contains invalid characters')
  .transform((val) => val.trim());

// Request validation schemas
export const TranscriptRequestSchema = z.object({
  videoId: VideoIdSchema,
});

export const VideoInfoRequestSchema = z.object({
  videoId: VideoIdSchema,
});

/**
 * Validates and sanitizes request parameters
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw createApiError(`Validation failed: ${message}`, 400, 'VALIDATION_ERROR');
    }
    throw error;
  }
}

/**
 * Sanitizes text input to prevent XSS
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
}

/**
 * Validates URL parameters from Next.js request
 */
export function getValidatedParams(searchParams: URLSearchParams, schema: z.ZodSchema) {
  const params = Object.fromEntries(searchParams.entries());
  return validateRequest(schema, params);
}