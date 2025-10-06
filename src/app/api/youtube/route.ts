import { fetchVideoInfo, fetchVideoDescription } from '@/lib/youtube-api';
import { createApiRoute } from '@/lib/api-route-template';
import { VideoInfoRequestSchema } from '@/lib/validation';

function sanitizeOutput(text: string, maxLength?: number): string {
  const sanitized = text.replace(/[<>"'&]/g, '');
  return maxLength ? sanitized.substring(0, maxLength) : sanitized;
}

async function handleVideoRequest(videoId: string) {
  // Fetch video info and description in parallel
  const [videoInfo, description] = await Promise.all([
    fetchVideoInfo(videoId),
    fetchVideoDescription(videoId)
  ]);
  
  return {
    title: sanitizeOutput(videoInfo.title, 200),
    description: sanitizeOutput(description), // No character limit for description
    thumbnail: videoInfo.thumbnail,
    author: sanitizeOutput(videoInfo.author, 100),
  };
}

export const POST = createApiRoute({
  handler: handleVideoRequest,
  cacheMaxAge: 3600,
  logContext: 'video info',
  schema: VideoInfoRequestSchema,
  method: 'POST'
});