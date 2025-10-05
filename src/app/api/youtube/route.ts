import { NextRequest, NextResponse } from 'next/server';
import { asyncHandler } from '@/lib/error-handler';
import { VideoIdSchema } from '@/lib/validation';
import { fetchVideoInfo, fetchVideoDescription } from '@/lib/youtube-api';

export const POST = asyncHandler(async (request: Request) => {
  const body = await request.json();
  const videoId = VideoIdSchema.parse(body.videoId);

  // Fetch video info and description in parallel
  const [videoInfo, description] = await Promise.all([
    fetchVideoInfo(videoId),
    fetchVideoDescription(videoId)
  ]);
  
  return NextResponse.json({
    title: sanitizeOutput(videoInfo.title),
    description: sanitizeOutput(description),
    thumbnail: videoInfo.thumbnail,
    author: sanitizeOutput(videoInfo.author),
  });
});

function sanitizeOutput(text: string): string {
  return text.replace(/[<>"'&]/g, '').substring(0, 1000);
}