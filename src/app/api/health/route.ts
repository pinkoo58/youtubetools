import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ&format=json', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HealthCheck/1.0)' }
    });
    
    return NextResponse.json({
      status: 'ok',
      youtube: response.ok ? 'accessible' : 'blocked',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      youtube: 'blocked',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}