import { NextResponse } from 'next/server';
import { fetchVideoInfo, VideoIdSchema, createErrorResponse, ERROR_CODES } from '@/lib/youtube-api';
import { rateLimiter, getClientIP } from '@/lib/rate-limiter';
import { asyncHandler } from '@/lib/error-handler';

export const POST = asyncHandler(async (request: Request) => {
  // Rate limiting
  const clientIp = getClientIP(request);
  const isAllowed = rateLimiter.isAllowed(clientIp);
  
  if (!isAllowed) {
    return NextResponse.json(
      createErrorResponse('Rate limit exceeded', ERROR_CODES.RATE_LIMITED),
      { status: 429 }
    );
  }

  const body = await request.json();
  const { videoId } = body;

  // Validate video ID
  const validationResult = VideoIdSchema.safeParse(videoId);
  if (!validationResult.success) {
    return NextResponse.json(
      createErrorResponse('Invalid video ID format', ERROR_CODES.INVALID_VIDEO_ID),
      { status: 400 }
    );
  }

  // Fetch basic video info
  const videoInfo = await fetchVideoInfo(validationResult.data);

  // Create response with sanitized data
  const response = {
    title: videoInfo.title.replace(/[<>"'&]/g, '').substring(0, 200),
    channelTitle: videoInfo.author.replace(/[<>"'&]/g, '').substring(0, 100),
    publishedAt: new Date().toISOString(),
    thumbnail: videoInfo.thumbnail,
    regionRestriction: null, // Most videos are available worldwide
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
});