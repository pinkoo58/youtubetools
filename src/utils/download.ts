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
  const sanitizedTitle = title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
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
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Converts plain text transcript to SRT format
 */
function convertToSRT(transcript: string): string {
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let srtContent = '';
  
  sentences.forEach((sentence, index) => {
    const startTime = formatSRTTime(index * 3); // 3 seconds per sentence
    const endTime = formatSRTTime((index + 1) * 3);
    
    srtContent += `${index + 1}\n`;
    srtContent += `${startTime} --> ${endTime}\n`;
    srtContent += `${sentence.trim()}\n\n`;
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