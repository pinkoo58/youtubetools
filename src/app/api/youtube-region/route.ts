import { fetchVideoInfo } from '@/lib/youtube-api';
import { createApiRoute } from '@/lib/api-route-template';
import { z } from 'zod';

const RegionRequestSchema = z.object({
  videoId: z.string().min(1)
});

async function handleRegionRequest(videoId: string) {
  const videoInfo = await fetchVideoInfo(videoId);

  return {
    title: videoInfo.title.replace(/[<>"'&]/g, '').substring(0, 200),
    channelTitle: videoInfo.author.replace(/[<>"'&]/g, '').substring(0, 100),
    publishedAt: new Date().toISOString(),
    thumbnail: videoInfo.thumbnail,
    regionRestriction: null, // Most videos are available worldwide
    timestamp: new Date().toISOString(),
  };
}

export const POST = createApiRoute({
  handler: handleRegionRequest,
  cacheMaxAge: 7200,
  logContext: 'region restriction',
  schema: RegionRequestSchema,
  method: 'POST'
});