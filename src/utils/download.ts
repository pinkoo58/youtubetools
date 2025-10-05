/**
 * Utility functions for downloading transcript files
 */

/**
 * Downloads transcript as a file
 */
export function downloadTranscript(
  transcript: string,
  title: string,
  format: 'txt' | 'srt'
): void {
  try {
    if (!transcript || typeof transcript !== 'string') {
      throw new Error('Invalid transcript content');
    }
    
    if (!title || typeof title !== 'string') {
      throw new Error('Invalid title');
    }
    
    if (!['txt', 'srt'].includes(format)) {
      throw new Error('Invalid format');
    }
    
    const sanitizedTitle = title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').substring(0, 50) || 'transcript';
    const filename = `${sanitizedTitle}_transcript.${format}`;
    
    let content: string;
    
    if (format === 'srt') {
      content = convertToSRT(transcript);
    } else {
      content = transcript;
    }
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    if (document.body) {
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Failed to download transcript');
  }
}

/**
 * Converts plain text transcript to SRT format
 */
function convertToSRT(transcript: string): string {
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const srtParts: string[] = [];
  
  for (let i = 0; i < sentences.length; i++) {
    const startTime = formatSRTTime(i * 3); // 3 seconds per sentence
    const endTime = formatSRTTime((i + 1) * 3);
    
    srtParts.push(
      `${i + 1}`,
      `${startTime} --> ${endTime}`,
      `${sentences[i].trim()}`,
      ''
    );
  }
  
  return srtParts.join('\n');
}

/**
 * Formats time in SRT format (HH:MM:SS,mmm)
 */
function formatSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  
  // Use template literals for better performance
  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  const s = secs.toString().padStart(2, '0');
  const ms = milliseconds.toString().padStart(3, '0');
  
  return `${h}:${m}:${s},${ms}`;
}