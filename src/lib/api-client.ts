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
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please try again.', 408, 'TIMEOUT');
    }
    
    throw new ApiError('Network error. Please check your connection.', 0, 'NETWORK_ERROR');
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
          
          // Wait before retry (exponential backoff)
          if (attempt < (retries || 0)) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          }
        }
      }

      // Handle final error
      const errorMessage = lastError instanceof ApiError 
        ? lastError.message 
        : 'Something went wrong. Please try again.';
      
      onError?.(errorMessage);
      throw lastError || new ApiError('Unknown error occurred', 500);
    } finally {
      onLoadingChange?.(false);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
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
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Default API client instance
export const apiClient = new ApiClient('/api');