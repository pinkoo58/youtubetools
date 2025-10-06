/**
 * YouTube API utilities for transcript extraction and video information
 * Implements secure, efficient methods for interacting with YouTube services
 */

import { z } from 'zod';

// Input validation schemas
export const VideoIdSchema = z.string()
  .min(11, 'Invalid video ID length')
  .max(11, 'Invalid video ID length')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid video ID format');

export const YouTubeUrlSchema = z.string()
  .url('Invalid URL format')
  .refine(url => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
      /(?:https?:\/\/)?youtu\.be\/([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^&\n?#]+)/,
    ];
    return patterns.some(pattern => pattern.test(url));
  }, 'Invalid YouTube URL');

// Response type definitions
export interface TranscriptResponse {
  transcript: string;
  language: string;
  trackName: string;
  wordCount: number;
  duration?: number;
}

export interface VideoInfo {
  title: string;
  author: string;
  thumbnail: string;
  duration?: string;
}

export interface ApiError {
  error: string;
  code: string;
  details?: string;
}

// Error codes for consistent error handling
export const ERROR_CODES = {
  INVALID_VIDEO_ID: 'INVALID_VIDEO_ID',
  VIDEO_NOT_FOUND: 'VIDEO_NOT_FOUND',
  NO_TRANSCRIPT: 'NO_TRANSCRIPT',
  FETCH_ERROR: 'FETCH_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
} as const;

/**
 * Extracts video ID from various YouTube URL formats
 */
export function extractVideoId(url: string): string | null {
  try {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
      /(?:https?:\/\/)?youtu\.be\/([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) {
        const videoId = match[1];
        // Validate extracted video ID
        const result = VideoIdSchema.safeParse(videoId);
        return result.success ? videoId : null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetches video information using YouTube oEmbed API
 */
export async function fetchVideoInfo(videoId: string): Promise<VideoInfo> {
  const validatedId = VideoIdSchema.parse(videoId);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // Increased timeout

  try {
    const url = new URL('https://www.youtube.com/oembed');
    url.searchParams.set('url', `https://www.youtube.com/watch?v=${validatedId}`);
    url.searchParams.set('format', 'json');
    
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`${ERROR_CODES.VIDEO_NOT_FOUND}: Video not found or private`);
      }
      if (response.status === 429) {
        throw new Error(`${ERROR_CODES.RATE_LIMITED}: Rate limit exceeded`);
      }
      throw new Error(`${ERROR_CODES.FETCH_ERROR}: HTTP ${response.status}`);
    }

    const data = await response.json();
    
    return {
      title: sanitizeText(data.title || 'Unknown Title'),
      author: sanitizeText(data.author_name || 'Unknown Author'),
      thumbnail: data.thumbnail_url || '',
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`${ERROR_CODES.FETCH_ERROR}: Request timeout`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetches video tags from YouTube page
 */
export async function fetchVideoTags(videoId: string): Promise<string[]> {
  const validatedId = VideoIdSchema.parse(videoId);
  
  try {
    // Get video info first
    const videoInfo = await fetchVideoInfo(validatedId);
    const description = await fetchVideoDescription(validatedId);
    
    // Generate tags from title and description
    const tags = generateTagsFromContent(videoInfo.title, description);
    
    return tags;
  } catch {
    return [];
  }
}

/**
 * Generates tags from video title and description
 */
function generateTagsFromContent(title: string, description: string): string[] {
  const tags = new Set<string>();
  const content = `${title} ${description}`.toLowerCase();
  
  // Extract hashtags
  const hashtags = content.match(/#(\w+)/g);
  if (hashtags) {
    hashtags.forEach(tag => tags.add(tag.substring(1)));
  }
  
  // Common categories and keywords
  const categories = {
    'cricket': ['cricket', 'match', 'final', 'highlights', 'india', 'pakistan', 'asia cup'],
    'sports': ['sports', 'game', 'tournament', 'championship', 'league'],
    'music': ['music', 'song', 'audio', 'sound', 'beat'],
    'gaming': ['gaming', 'game', 'play', 'player', 'gameplay'],
    'tech': ['tech', 'technology', 'review', 'unboxing', 'gadget'],
    'tutorial': ['tutorial', 'how to', 'guide', 'tips', 'tricks'],
    'entertainment': ['entertainment', 'funny', 'comedy', 'fun'],
    'news': ['news', 'breaking', 'update', 'latest'],
    'travel': ['travel', 'trip', 'vacation', 'destination'],
    'food': ['food', 'recipe', 'cooking', 'kitchen']
  };
  
  // Check for category matches
  for (const [category, keywords] of Object.entries(categories)) {
    for (const keyword of keywords) {
      if (content.includes(keyword)) {
        tags.add(category);
        tags.add(keyword);
      }
    }
  }
  
  // Extract words from title (common tags)
  const titleWords = title.toLowerCase().split(/\W+/).filter(word => 
    word.length > 2 && 
    !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'].includes(word)
  );
  
  titleWords.slice(0, 5).forEach(word => tags.add(word));
  
  return Array.from(tags).slice(0, 20); // Limit to 20 tags
}

/**
 * Fetches video description from YouTube page (for title-description extractor only)
 */
export async function fetchVideoDescription(videoId: string): Promise<string> {
  const validatedId = VideoIdSchema.parse(videoId);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const url = new URL('https://www.youtube.com/watch');
    url.searchParams.set('v', validatedId);
    
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });

    if (!response.ok) {
      return '';
    }

    const html = await response.text();
    
    // Try to extract full description from JSON data
    const jsonMatch = html.match(/var ytInitialData = ({.*?});/);
    if (jsonMatch?.[1]) {
      try {
        const data = JSON.parse(jsonMatch[1]);
        const description = extractDescriptionFromData(data);
        if (description) {
          // Preserve line breaks and formatting
          return description.replace(/\\n/g, '\n');
        }
      } catch {
        // Fall through to meta tag extraction
      }
    }
    
    // Fallback: Extract description from meta tag (truncated)
    const descMatch = html.match(/<meta name="description" content="([^"]*)"/i);
    if (descMatch?.[1]) {
      return sanitizeText(descMatch[1]);
    }
    
    return '';
  } catch {
    return '';
  } finally {
    clearTimeout(timeoutId);
  }
}



/**
 * Extracts full description from YouTube's initial data
 */
function extractDescriptionFromData(data: any): string {
  try {
    // Try videoDetails.shortDescription first
    if (data?.videoDetails?.shortDescription) {
      return data.videoDetails.shortDescription;
    }
    
    // Try secondary info renderer with runs for better formatting
    const contents = data?.contents?.twoColumnWatchNextResults?.results?.results?.contents;
    if (contents) {
      for (const content of contents) {
        const secondaryInfo = content?.videoSecondaryInfoRenderer;
        
        if (secondaryInfo?.description?.runs) {
          let description = '';
          for (const run of secondaryInfo.description.runs) {
            if (run.text) {
              description += run.text;
            }
          }
          if (description) return description;
        }
        
        if (secondaryInfo?.attributedDescription?.content) {
          return secondaryInfo.attributedDescription.content;
        }
      }
    }
    
    // Try microformat as fallback
    if (data?.microformat?.playerMicroformatRenderer?.description?.simpleText) {
      return data.microformat.playerMicroformatRenderer.description.simpleText;
    }
    
    return '';
  } catch {
    return '';
  }
}

/**
 * Fetches transcript using YouTube's internal API
 */
export async function fetchTranscript(videoId: string): Promise<TranscriptResponse> {
  const validatedId = VideoIdSchema.parse(videoId);
  
  // Step 1: Get transcript parameters from video page
  const params = await getTranscriptParams(validatedId);
  
  // Step 2: Fetch transcript data using parameters
  const transcriptData = await getTranscriptData(params, validatedId);
  
  return transcriptData;
}

/**
 * Extracts transcript parameters from YouTube video page
 */
async function getTranscriptParams(videoId: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // Increased timeout

  try {
    const url = new URL('https://www.youtube.com/watch');
    url.searchParams.set('v', videoId);
    url.searchParams.set('bpctr', '9999999999');
    url.searchParams.set('hl', 'en');
    
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(`${ERROR_CODES.RATE_LIMITED}: YouTube rate limit exceeded`);
      }
      if (response.status === 404) {
        throw new Error(`${ERROR_CODES.VIDEO_NOT_FOUND}: Video not found`);
      }
      throw new Error(`${ERROR_CODES.FETCH_ERROR}: Failed to fetch video page (${response.status})`);
    }

    const html = await response.text();
    
    // Check if video is available
    if (html.includes('"isLiveContent":true')) {
      throw new Error(`${ERROR_CODES.NO_TRANSCRIPT}: Live videos don't have transcripts`);
    }
    
    if (html.includes('"playabilityStatus":{"status":"UNPLAYABLE"')) {
      throw new Error(`${ERROR_CODES.VIDEO_NOT_FOUND}: Video is not available`);
    }
    
    // Extract transcript endpoint parameters
    const paramsMatch = html.match(/"getTranscriptEndpoint":\{"params":"([^"]+)"/);
    
    if (!paramsMatch?.[1]) {
      throw new Error(`${ERROR_CODES.NO_TRANSCRIPT}: No transcript available for this video`);
    }

    return paramsMatch[1];
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`${ERROR_CODES.FETCH_ERROR}: Request timeout`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetches transcript data using extracted parameters
 */
async function getTranscriptData(params: string, videoId: string): Promise<TranscriptResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // Increased timeout

  try {
    const response = await fetch(
      'https://www.youtube.com/youtubei/v1/get_transcript?prettyPrint=false',
      {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Origin': 'https://www.youtube.com',
          'Referer': `https://www.youtube.com/watch?v=${videoId}`,
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: 'WEB',
              clientVersion: '2.20241215.01.00',
            },
          },
          params,
          externalVideoId: videoId,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(`${ERROR_CODES.RATE_LIMITED}: YouTube API rate limit exceeded`);
      }
      if (response.status === 403) {
        throw new Error(`${ERROR_CODES.NO_TRANSCRIPT}: Access denied to transcript`);
      }
      throw new Error(`${ERROR_CODES.FETCH_ERROR}: Transcript API error (${response.status})`);
    }

    const data = await response.json();
    
    return parseTranscriptData(data);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`${ERROR_CODES.FETCH_ERROR}: Request timeout`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Parses transcript data from YouTube API response
 */
function parseTranscriptData(data: any): TranscriptResponse {
  try {
    const texts: string[] = [];
    const jsonStr = JSON.stringify(data);
    
    // Extract text segments using regex pattern
    const segmentMatches = jsonStr.match(
      /"transcriptSegmentRenderer":\{[^}]*"snippet":\{"runs":\[[^\]]*\]/g
    );

    if (!segmentMatches?.length) {
      throw new Error(`${ERROR_CODES.NO_TRANSCRIPT}: No transcript segments found`);
    }

    // Parse each segment
    for (const match of segmentMatches) {
      const runsMatch = match.match(/"runs":\[([^\]]+)\]/);
      if (runsMatch?.[1]) {
        try {
          const runs = JSON.parse(`[${runsMatch[1]}]`);
          for (const run of runs) {
            if (run?.text && typeof run.text === 'string') {
              texts.push(sanitizeText(run.text.trim()));
            }
          }
        } catch {
          // Skip malformed segments
          continue;
        }
      }
    }

    if (texts.length === 0) {
      throw new Error(`${ERROR_CODES.NO_TRANSCRIPT}: No transcript text found`);
    }

    // Format transcript into readable paragraphs
    const formattedTranscript = formatTranscript(texts);
    
    return {
      transcript: formattedTranscript,
      language: 'auto-detected',
      trackName: 'YouTube Auto-generated',
      wordCount: countWords(formattedTranscript),
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes(ERROR_CODES.NO_TRANSCRIPT)) {
      throw error;
    }
    throw new Error(`${ERROR_CODES.PARSE_ERROR}: Failed to parse transcript data`);
  }
}

/**
 * Formats transcript text into readable paragraphs
 */
function formatTranscript(texts: string[]): string {
  const allText = texts.join(' ').replace(/\s+/g, ' ').trim();
  
  if (!allText) {
    throw new Error(`${ERROR_CODES.NO_TRANSCRIPT}: Empty transcript`);
  }

  // Split into sentences and group into paragraphs
  const sentences = allText
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.trim().length > 0);

  const paragraphs: string[] = [];
  const sentencesPerParagraph = 5;

  for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
    const paragraph = sentences
      .slice(i, i + sentencesPerParagraph)
      .join(' ')
      .trim();
    
    if (paragraph) {
      paragraphs.push(paragraph);
    }
  }

  return paragraphs.join('\n\n');
}

/**
 * Sanitizes text to prevent XSS and other security issues
 */
function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .trim();
}

/**
 * Counts words in text
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Creates standardized API error response
 */
export function createErrorResponse(error: string, code: string, status: number = 500) {
  return {
    error,
    code,
    timestamp: new Date().toISOString(),
  };
}