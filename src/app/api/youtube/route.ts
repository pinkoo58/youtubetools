import { NextRequest, NextResponse } from 'next/server';
import { asyncHandler } from '@/lib/error-handler';
import { VideoIdSchema } from '@/lib/validation';
import { fetchVideoInfo, fetchVideoDescription } from '@/lib/youtube-api';

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json();
  const videoId = VideoIdSchema.parse(body.videoId);

  // Fetch video info and description in parallel
  const [videoInfo, description] = await Promise.all([
    fetchVideoInfo(videoId),
    fetchVideoDescription(videoId)
  ]);
  
  return NextResponse.json({
    title: videoInfo.title,
    description: description,
    thumbnail: videoInfo.thumbnail,
    author: videoInfo.author,
  });
});