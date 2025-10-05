import { NextResponse } from 'next/server';
import { fetchVideoTags, VideoIdSchema, createErrorResponse, ERROR_CODES } from '@/lib/youtube-api';
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

  // Fetch tags with error handling
  let tags: string[];
  try {
    tags = await fetchVideoTags(validationResult.data);
  } catch (error) {
    console.error('Failed to fetch video tags:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      createErrorResponse('Failed to fetch video tags', ERROR_CODES.FETCH_ERROR),
      { status: 500 }
    );
  }

  // Sanitize tags to prevent XSS
  const sanitizedTags = tags.map(tag => 
    typeof tag === 'string' ? tag.replace(/[<>"'&]/g, '').substring(0, 100) : ''
  ).filter(tag => tag.length > 0);

  return NextResponse.json({
    tags: sanitizedTags,
    count: sanitizedTags.length,
    timestamp: new Date().toISOString(),
  });
});