/**
 * Centralized API client with error handling and loading states
 */

import { StandardApiResponse } from './error-handler';

export interface ApiClientOptions {
  timeout?: number;
  retries?: number;
  onLoadingChange?: (loading: boolean) => void;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Enhanced fetch with timeout and retry logic
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = 30000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    // Validate URL to prevent SSRF
    const urlObj = new URL(url);
    const allowedHosts = ['localhost', '127.0.0.1', 'www.youtube.com', 'youtube.com', 'youtubei.googleapis.com'];
    
    if (!allowedHosts.includes(urlObj.hostname)) {
      throw new ApiError('Invalid request destination', 400, 'INVALID_URL');
    }
    
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timed out. Please try again.', 408, 'TIMEOUT');
      }
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new ApiError('Network error. Please check your connection.', 0, 'NETWORK_ERROR');
      }
    }
    
    throw new ApiError('Request failed. Please try again.', 0, 'REQUEST_ERROR');
  }
}

/**
 * Centralized API client
 */
export class ApiClient {
  private baseUrl: string;
  private defaultOptions: ApiClientOptions;

  constructor(baseUrl: string = '', options: ApiClientOptions = {}) {
    this.baseUrl = baseUrl;
    this.defaultOptions = {
      timeout: 30000,
      retries: 3,
      ...options,
    };
  }

  /**
   * Generic API request method
   */
  async request<T>(
    endpoint: string,
    options: RequestInit & ApiClientOptions = {}
  ): Promise<T> {
    const {
      timeout,
      retries,
      onLoadingChange,
      onError,
      onSuccess,
      ...fetchOptions
    } = { ...this.defaultOptions, ...options };

    const url = `${this.baseUrl}${endpoint}`;
    let lastError: Error | null = null;

    // Set loading state
    onLoadingChange?.(true);

    try {
      for (let attempt = 0; attempt <= (retries || 0); attempt++) {
        try {
          const response = await fetchWithTimeout(url, {
            ...fetchOptions,
            timeout,
            headers: {
              'Content-Type': 'application/json',
              ...fetchOptions.headers,
            },
          });

          const data: StandardApiResponse<T> = await response.json();

          if (!response.ok) {
            throw new ApiError(
              data.message || `HTTP ${response.status}`,
              response.status,
              data.code
            );
          }

          if (!data.success) {
            throw new ApiError(
              data.message || 'Request failed',
              response.status,
              data.code
            );
          }

          // Success callback
          if (data.message && onSuccess) {
            onSuccess(data.message);
          }

          return data.data as T;
        } catch (error) {
          lastError = error as Error;
          
          // Don't retry on client errors (4xx) or last attempt
          if (
            error instanceof ApiError && 
            (error.statusCode >= 400 && error.statusCode < 500) ||
            attempt === (retries || 0)
          ) {
            break;
          }
          
          // Wait before retry (exponential backoff with jitter)
          if (attempt < (retries || 0)) {
            const baseDelay = Math.pow(2, attempt) * 1000;
            const jitter = Math.random() * 1000;
            await new Promise(resolve => setTimeout(resolve, baseDelay + jitter));
          }
        }
      }

      // Handle final error with proper sanitization
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (lastError instanceof ApiError) {
        errorMessage = lastError.message.substring(0, 200); // Limit error message length
      } else if (lastError instanceof Error) {
        errorMessage = 'Request failed. Please try again.';
      }
      
      onError?.(errorMessage);
      
      const finalError = lastError || new ApiError('Unknown error occurred', 500);
      
      // Log error for debugging (sanitized)
      console.error('API request failed:', {
        endpoint: endpoint.substring(0, 100),
        error: finalError.message.substring(0, 200)
      });
      
      throw finalError;
    } finally {
      onLoadingChange?.(false);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
    // Validate endpoint to prevent SSRF
    if (!endpoint.startsWith('/') && !endpoint.startsWith('http')) {
      throw new ApiError('Invalid endpoint format', 400, 'INVALID_ENDPOINT');
    }
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options: ApiClientOptions = {}
  ): Promise<T> {
    // Validate endpoint to prevent SSRF
    if (!endpoint.startsWith('/') && !endpoint.startsWith('http')) {
      throw new ApiError('Invalid endpoint format', 400, 'INVALID_ENDPOINT');
    }
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Default API client instance
export const apiClient = new ApiClient('/api');