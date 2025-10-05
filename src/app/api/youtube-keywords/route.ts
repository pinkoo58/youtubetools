import { NextResponse } from 'next/server';
import { rateLimiter, getClientIP } from '@/lib/rate-limiter';
import { asyncHandler } from '@/lib/error-handler';

export const POST = asyncHandler(async (request: Request) => {
  // Rate limiting
  const clientIp = getClientIP(request);
  const isAllowed = rateLimiter.isAllowed(clientIp);
  
  if (!isAllowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { query } = body;

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  // Generate keyword suggestions
  const suggestions = generateKeywordSuggestions(query.trim());

  return NextResponse.json({
    suggestions,
    count: suggestions.length,
    query: query.trim(),
    timestamp: new Date().toISOString(),
  });
});

function generateKeywordSuggestions(query: string): string[] {
  const baseQuery = query.toLowerCase();
  const suggestions = new Set<string>();
  
  // Add the original query
  suggestions.add(query);
  
  // Common YouTube search prefixes
  const prefixes = [
    'how to',
    'best',
    'top 10',
    'tutorial',
    'review',
    'vs',
    'tips',
    'guide',
    'learn',
    'free',
    'easy',
    'quick',
    'complete',
    'beginner',
    'advanced',
    'step by step'
  ];
  
  // Common YouTube search suffixes
  const suffixes = [
    'tutorial',
    'guide',
    'tips',
    'tricks',
    'review',
    'explained',
    'for beginners',
    'step by step',
    '2024',
    '2025',
    'free',
    'easy',
    'quick',
    'complete guide',
    'how to',
    'best practices',
    'mistakes',
    'secrets',
    'hacks'
  ];
  
  // Generate combinations with prefixes
  prefixes.forEach(prefix => {
    if (!baseQuery.includes(prefix)) {
      suggestions.add(`${prefix} ${query}`);
    }
  });
  
  // Generate combinations with suffixes
  suffixes.forEach(suffix => {
    if (!baseQuery.includes(suffix)) {
      suggestions.add(`${query} ${suffix}`);
    }
  });
  
  // Question variations
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'which'];
  questionWords.forEach(word => {
    if (!baseQuery.includes(word)) {
      suggestions.add(`${word} is ${query}`);
      suggestions.add(`${word} to ${query}`);
    }
  });
  
  // Related terms based on common categories
  const categories = {
    'cooking': ['recipe', 'ingredients', 'kitchen', 'food', 'meal', 'dish'],
    'tech': ['technology', 'software', 'app', 'device', 'gadget', 'digital'],
    'fitness': ['workout', 'exercise', 'health', 'training', 'gym', 'diet'],
    'music': ['song', 'artist', 'album', 'lyrics', 'cover', 'instrumental'],
    'gaming': ['game', 'gameplay', 'walkthrough', 'strategy', 'tips', 'cheats'],
    'education': ['learn', 'study', 'course', 'lesson', 'class', 'school'],
    'business': ['marketing', 'money', 'entrepreneur', 'startup', 'success', 'strategy']
  };
  
  // Add category-specific suggestions
  Object.entries(categories).forEach(([category, terms]) => {
    if (baseQuery.includes(category) || terms.some(term => baseQuery.includes(term))) {
      terms.forEach(term => {
        if (!baseQuery.includes(term)) {
          suggestions.add(`${query} ${term}`);
          suggestions.add(`${term} ${query}`);
        }
      });
    }
  });
  
  // Long-tail variations
  const longTailModifiers = [
    'for beginners',
    'step by step',
    'in 5 minutes',
    'at home',
    'without equipment',
    'on a budget',
    'for free',
    'mistakes to avoid',
    'pros and cons',
    'before and after'
  ];
  
  longTailModifiers.forEach(modifier => {
    suggestions.add(`${query} ${modifier}`);
  });
  
  return Array.from(suggestions).slice(0, 50); // Limit to 50 suggestions
}