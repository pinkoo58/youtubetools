/**
 * YouTube utility functions for client-side operations
 */

/**
 * Extracts video ID from various YouTube URL formats
 */
import { YOUTUBE_URL_PATTERNS, VALIDATION_LIMITS } from '@/lib/constants';

export function extractVideoId(url: string): string | null {
  if (!url?.trim() || typeof url !== 'string' || url.length > VALIDATION_LIMITS.URL_MAX_LENGTH) {
    return null;
  }

  try {
    // Sanitize URL to prevent XSS
    const sanitizedUrl = url.trim().replace(/[<>"']/g, '');
    
    for (const pattern of YOUTUBE_URL_PATTERNS) {
      const match = sanitizedUrl.match(pattern);
      if (match?.[1]) {
        const videoId = match[1];
        // Strict validation - YouTube video IDs are exactly 11 characters
        if (videoId.length === VALIDATION_LIMITS.VIDEO_ID_LENGTH && /^[a-zA-Z0-9_-]+$/.test(videoId)) {
          return videoId;
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Validates YouTube URL format
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}

/**
 * Downloads text content as a file
 */
export function downloadTextFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download file:', error);
    throw new Error('Failed to download file');
  }
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (!successful) {
        throw new Error('Copy command failed');
      }
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw new Error('Failed to copy to clipboard');
  }
}

/**
 * Formats transcript for SRT download
 */
export function formatTranscriptAsSRT(transcript: string): string {
  const paragraphs = transcript.split('\n\n').filter(p => p.trim());
  let srtContent = '';
  
  paragraphs.forEach((paragraph, index) => {
    const startTime = formatSRTTime(index * 30); // 30 seconds per paragraph
    const endTime = formatSRTTime((index + 1) * 30);
    
    srtContent += `${index + 1}\n`;
    srtContent += `${startTime} --> ${endTime}\n`;
    srtContent += `${paragraph.trim()}\n\n`;
  });
  
  return srtContent;
}

/**
 * Formats time in SRT format (HH:MM:SS,mmm)
 */
function formatSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
}

/**
 * Sanitizes filename for download
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[<>:"/\\|?*]/g, '_') // Replace invalid characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 100); // Limit length
}