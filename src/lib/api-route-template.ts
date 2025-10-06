import { NextResponse } from 'next/server';
import { rateLimiter, getClientIP } from './rate-limiter';
import { logger } from './logger';
import { asyncHandler, createApiResponse, createApiError } from './error-handler';
import { getValidatedParams } from './validation';
import { sanitizeVideoId, sanitizeIP, sanitizeUserAgent, sanitizeError } from './sanitize';
import { z } from 'zod';

interface ApiRouteConfig<T> {
  handler: (input: any) => Promise<T>;
  cacheMaxAge?: number;
  logContext?: string;
  schema?: z.ZodSchema;
  method?: 'GET' | 'POST';
}

export function createApiRoute<T>(config: ApiRouteConfig<T>) {
  return asyncHandler(async (request: Request): Promise<NextResponse> => {
    const startTime = Date.now();
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Rate limiting check
    if (!rateLimiter.isAllowed(clientIP)) {
      logger.warn(`Rate limit exceeded for ${config.logContext || 'API'}`, { 
        ip: sanitizeIP(clientIP), 
        userAgent: sanitizeUserAgent(userAgent) 
      });
      throw createApiError(
        'Too many requests. Please try again later.',
        429,
        'RATE_LIMITED'
      );
    }

    // Extract and validate input parameters
    let input: any;
    if (config.method === 'POST') {
      const body = await request.json();
      const schema = config.schema || z.object({ videoId: z.string().min(1) });
      const validation = schema.safeParse(body);
      if (!validation.success) {
        throw createApiError('Invalid request parameters', 400, 'VALIDATION_ERROR');
      }
      input = validation.data;
    } else {
      const { searchParams } = new URL(request.url);
      const schema = config.schema || z.object({ videoId: z.string().min(1) });
      input = getValidatedParams(searchParams, schema);
    }

    const inputKey = input.videoId || input.query || 'request';
    logger.info(`Processing ${config.logContext || 'data'}`, { 
      input: typeof inputKey === 'string' ? sanitizeVideoId(inputKey) : 'complex',
      ip: sanitizeIP(clientIP), 
      userAgent: sanitizeUserAgent(userAgent),
      environment: process.env.NODE_ENV
    });

    try {
      // Execute handler
      const data = await config.handler(input.videoId || input.query || input);
      
      const duration = Date.now() - startTime;
      logger.info(`${config.logContext || 'Data'} processed successfully`, { 
        input: typeof inputKey === 'string' ? sanitizeVideoId(inputKey) : 'complex',
        duration: `${duration}ms`,
        ip: sanitizeIP(clientIP) 
      });

      return NextResponse.json(
        createApiResponse(true, data, `${config.logContext || 'Data'} processed successfully`),
        {
          headers: {
            'Cache-Control': `public, max-age=${config.cacheMaxAge || 3600}`,
            'X-RateLimit-Remaining': rateLimiter.getRemaining(clientIP).toString(),
          }
        }
      );
    } catch (error) {
      // Enhanced error logging
      logger.error(`${config.logContext || 'API'} processing failed`, {
        input: typeof inputKey === 'string' ? sanitizeVideoId(inputKey) : 'complex',
        ip: sanitizeIP(clientIP),
        userAgent: sanitizeUserAgent(userAgent),
        error: error instanceof Error ? {
          name: sanitizeError(error.name),
          message: sanitizeError(error.message),
          stack: process.env.NODE_ENV === 'development' ? error.stack?.replace(/[\r\n\t]/g, ' ') : undefined
        } : sanitizeError(error),
        environment: process.env.NODE_ENV,
        duration: `${Date.now() - startTime}ms`
      });
      
      throw error;
    }
  });
}