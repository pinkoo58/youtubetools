/**
 * Application constants and configuration values
 */

// YouTube thumbnail qualities
export const THUMBNAIL_QUALITIES = [
  { key: 'maxresdefault', resolution: '1280x720 (HD)', label: 'HD' },
  { key: 'hqdefault', resolution: '480x360 (HQ)', label: 'HQ' },
  { key: 'mqdefault', resolution: '320x180 (MQ)', label: 'MQ' },
  { key: 'default', resolution: '120x90 (Default)', label: 'SD' },
] as const;

// API endpoints
export const API_ENDPOINTS = {
  TRANSCRIPT: '/api/transcript',
  VIDEO_INFO: '/api/video-info',
} as const;

// File formats
export const SUPPORTED_FORMATS = {
  TRANSCRIPT: ['txt', 'srt'],
  IMAGE: ['jpg', 'jpeg', 'png'],
} as const;

// Validation limits
export const VALIDATION_LIMITS = {
  URL_MAX_LENGTH: 2048,
  VIDEO_ID_LENGTH: 11,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  REQUEST_TIMEOUT: 30000, // 30 seconds
} as const;

// YouTube URL patterns
export const YOUTUBE_URL_PATTERNS = [
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
  /(?:https?:\/\/)?youtu\.be\/([^&\n?#]+)/,
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^&\n?#]+)/,
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
] as const;

// Error messages
export const ERROR_MESSAGES = {
  INVALID_URL: 'Invalid YouTube URL. Please paste a valid YouTube video link.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  NO_VIDEO_ID: 'Could not extract video ID from URL.',
  RATE_LIMITED: 'Too many requests. Please wait before trying again.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  COPIED: 'Copied to clipboard!',
  DOWNLOADED: 'Download started!',
  PROCESSED: 'Processing completed!',
} as const;