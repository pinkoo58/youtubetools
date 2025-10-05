import { NextResponse } from 'next/server';
import { fetchVideoInfo } from '@/lib/youtube-api';
import { rateLimiter, getClientIP } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';
import { asyncHandler, createApiResponse, createApiError } from '@/lib/error-handler';
import { getValidatedParams, VideoInfoRequestSchema } from '@/lib/validation';

/**
 * GET /api/video-info
 * Fetches YouTube video information with comprehensive error handling
 */
export const GET = asyncHandler(async (request: Request): Promise<NextResponse> => {
  const startTime = Date.now();
  const clientIP = getClientIP(request);
  
  // Rate limiting check
  if (!rateLimiter.isAllowed(clientIP)) {
    logger.warn('Rate limit exceeded for video-info', { ip: clientIP });
    throw createApiError(
      'Too many requests. Please try again later.',
      429,
      'RATE_LIMITED'
    );
  }

  // Validate input parameters
  const { searchParams } = new URL(request.url);
  const { videoId } = getValidatedParams(searchParams, VideoInfoRequestSchema);

  logger.info('Fetching video info', { videoId: videoId.substring(0, 8) + '...', ip: clientIP.substring(0, 8) + '...' });

  // Fetch video information
  const videoInfo = await fetchVideoInfo(videoId);
  
  const duration = Date.now() - startTime;
  logger.info('Video info fetched successfully', { 
    videoId: videoId.substring(0, 8) + '...', 
    title: videoInfo.title.substring(0, 50) + '...',
    duration: `${duration}ms`,
    ip: clientIP.substring(0, 8) + '...' 
  });

  return NextResponse.json(
    createApiResponse(true, videoInfo, 'Video information fetched successfully'),
    {
      headers: {
        'Cache-Control': 'public, max-age=7200',
        'X-RateLimit-Remaining': rateLimiter.getRemaining(clientIP).toString(),
      }
    }
  );
});