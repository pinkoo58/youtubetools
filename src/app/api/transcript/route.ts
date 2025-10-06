import { fetchTranscript } from '@/lib/youtube-api';
import { createApiRoute } from '@/lib/api-route-template';
import { TranscriptRequestSchema } from '@/lib/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = createApiRoute({
  handler: fetchTranscript,
  cacheMaxAge: 3600,
  logContext: 'transcript',
  schema: TranscriptRequestSchema
});