import { fetchVideoTags } from '@/lib/youtube-api';
import { createApiRoute } from '@/lib/api-route-template';
import { z } from 'zod';

const TagsRequestSchema = z.object({
  videoId: z.string().min(1)
});

async function handleTagsRequest(videoId: string) {
  const tags = await fetchVideoTags(videoId);
  
  // Sanitize tags to prevent XSS
  const sanitizedTags = tags.map(tag => 
    typeof tag === 'string' ? tag.replace(/[<>"'&]/g, '').substring(0, 100) : ''
  ).filter(tag => tag.length > 0);

  return {
    tags: sanitizedTags,
    count: sanitizedTags.length,
    timestamp: new Date().toISOString(),
  };
}

export const POST = createApiRoute({
  handler: handleTagsRequest,
  cacheMaxAge: 3600,
  logContext: 'video tags',
  schema: TagsRequestSchema,
  method: 'POST'
});