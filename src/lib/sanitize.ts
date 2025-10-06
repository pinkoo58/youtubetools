/**
 * Security utilities for input sanitization
 */

/**
 * Sanitizes video ID for logging
 */
export function sanitizeVideoId(videoId: string): string {
  return videoId.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 8) + '...';
}

/**
 * Sanitizes IP address for logging
 */
export function sanitizeIP(ip: string): string {
  return ip.replace(/[^0-9.:]/g, '').substring(0, 8) + '...';
}

/**
 * Sanitizes user agent for logging
 */
export function sanitizeUserAgent(userAgent: string): string {
  return userAgent.replace(/[\r\n\t]/g, '').substring(0, 50) + '...';
}

/**
 * Sanitizes error messages for logging
 */
export function sanitizeError(error: unknown): string {
  return String(error).replace(/[\r\n\t]/g, '').substring(0, 200);
}