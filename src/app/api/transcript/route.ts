import { NextResponse } from 'next/server';
import { fetchTranscript } from '@/lib/youtube-api';
import { rateLimiter, getClientIP } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';
import { asyncHandler, createApiResponse, createApiError } from '@/lib/error-handler';
import { getValidatedParams, TranscriptRequestSchema } from '@/lib/validation';

/**
 * GET /api/transcript
 * Fetches YouTube video transcript with comprehensive error handling
 */
export const GET = asyncHandler(async (request: Request): Promise<NextResponse> => {
  const startTime = Date.now();
  const clientIP = getClientIP(request);
  
  // Rate limiting check
  if (!rateLimiter.isAllowed(clientIP)) {
    logger.warn('Rate limit exceeded', { ip: clientIP });
    throw createApiError(
      'Too many requests. Please try again later.',
      429,
      'RATE_LIMITED'
    );
  }

  // Validate input parameters
  const { searchParams } = new URL(request.url);
  const { videoId } = getValidatedParams(searchParams, TranscriptRequestSchema);

  logger.info('Fetching transcript', { videoId: videoId.substring(0, 8) + '...', ip: clientIP.substring(0, 8) + '...' });

  // Fetch transcript data
  const transcriptData = await fetchTranscript(videoId);
  
  const duration = Date.now() - startTime;
  logger.info('Transcript fetched successfully', { 
    videoId: videoId.substring(0, 8) + '...', 
    wordCount: transcriptData.wordCount,
    duration: `${duration}ms`,
    ip: clientIP.substring(0, 8) + '...' 
  });

  return NextResponse.json(
    createApiResponse(true, transcriptData, 'Transcript fetched successfully'),
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'X-RateLimit-Remaining': rateLimiter.getRemaining(clientIP).toString(),
      }
    }
  );
});