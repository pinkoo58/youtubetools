/**
 * Centralized error handling for API routes
 */

import { NextResponse } from 'next/server';
import { logger } from './logger';
import { ZodError } from 'zod';
import { ApiError } from './api-client';

export interface ApiErrorInterface extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
}

export interface StandardApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  code?: string;
  timestamp: string;
}

/**
 * Creates standardized API response
 */
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  message?: string,
  code?: string
): StandardApiResponse<T> {
  return {
    success,
    data,
    message: message || (success ? 'Operation successful' : 'Something went wrong. Please try again.'),
    code,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Centralized error handler for API routes
 */
export function handleApiError(error: unknown, context?: string): NextResponse {
  const requestId = Math.random().toString(36).substring(7);
  
  // Log error with context
  logger.error('API Error', {
    requestId,
    context,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
  });

  // Handle different error types
  if (error instanceof ZodError) {
    return NextResponse.json(
      createApiResponse(false, null, 'Invalid input data', 'VALIDATION_ERROR'),
      { status: 400 }
    );
  }

  if (error instanceof ApiError) {
    const statusCode = error.statusCode || 500;
    
    return NextResponse.json(
      createApiResponse(false, null, error.message, error.code),
      { status: statusCode }
    );
  }

  if (error instanceof Error) {
    // Don't expose internal error messages in production
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Something went wrong. Please try again.';
    
    return NextResponse.json(
      createApiResponse(false, null, message, 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }

  // Unknown error type
  return NextResponse.json(
    createApiResponse(false, null, 'Something went wrong. Please try again.', 'UNKNOWN_ERROR'),
    { status: 500 }
  );
}

/**
 * Creates operational errors (safe to show to users)
 */
export function createApiError(
  message: string,
  statusCode: number = 500,
  code?: string,
  isOperational: boolean = true
): ApiError {
  return new ApiError(message, statusCode, code);
}

/**
 * Async wrapper for API route handlers
 */
export function asyncHandler(
  handler: (request: Request, context?: any) => Promise<NextResponse>
) {
  return async (request: Request, context?: any): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleApiError(error, `${request.method} ${request.url}`);
    }
  };
}