import { fetchVideoInfo } from '@/lib/youtube-api';
import { createApiRoute } from '@/lib/api-route-template';
import { VideoInfoRequestSchema } from '@/lib/validation';

export const GET = createApiRoute({
  handler: fetchVideoInfo,
  cacheMaxAge: 7200,
  logContext: 'video info',
  schema: VideoInfoRequestSchema
});