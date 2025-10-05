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

  // Sanitize suggestions to prevent XSS
  const sanitizedSuggestions = suggestions.map(suggestion => 
    suggestion.replace(/[<>"'&]/g, '').substring(0, 200)
  ).filter(suggestion => suggestion.length > 0);

  return NextResponse.json({
    suggestions: sanitizedSuggestions,
    count: sanitizedSuggestions.length,
    query: query.trim().replace(/[<>"'&]/g, '').substring(0, 100),
    timestamp: new Date().toISOString(),
  });
});

function generateKeywordSuggestions(query: string): string[] {
  const baseQuery = query.toLowerCase();
  const suggestions = new Set<string>();
  
  // Add the original query
  suggestions.add(query);
  
  // Generate suggestions using helper functions
  addPrefixSuggestions(suggestions, query, baseQuery);
  addSuffixSuggestions(suggestions, query, baseQuery);
  addQuestionSuggestions(suggestions, query, baseQuery);
  addCategorySuggestions(suggestions, query, baseQuery);
  addLongTailSuggestions(suggestions, query);
  
  return Array.from(suggestions).slice(0, 50);
}

function addPrefixSuggestions(suggestions: Set<string>, query: string, baseQuery: string): void {
  const prefixes = [
    'how to', 'best', 'top 10', 'tutorial', 'review', 'vs',
    'tips', 'guide', 'learn', 'free', 'easy', 'quick',
    'complete', 'beginner', 'advanced', 'step by step'
  ];
  
  prefixes.forEach(prefix => {
    if (!baseQuery.includes(prefix)) {
      suggestions.add(`${prefix} ${query}`);
    }
  });
}

function addSuffixSuggestions(suggestions: Set<string>, query: string, baseQuery: string): void {
  const suffixes = [
    'tutorial', 'guide', 'tips', 'tricks', 'review', 'explained',
    'for beginners', 'step by step', '2024', '2025', 'free',
    'easy', 'quick', 'complete guide', 'how to', 'best practices',
    'mistakes', 'secrets', 'hacks'
  ];
  
  suffixes.forEach(suffix => {
    if (!baseQuery.includes(suffix)) {
      suggestions.add(`${query} ${suffix}`);
    }
  });
}

function addQuestionSuggestions(suggestions: Set<string>, query: string, baseQuery: string): void {
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'which'];
  questionWords.forEach(word => {
    if (!baseQuery.includes(word)) {
      suggestions.add(`${word} is ${query}`);
      suggestions.add(`${word} to ${query}`);
    }
  });
}

function addCategorySuggestions(suggestions: Set<string>, query: string, baseQuery: string): void {
  const categories = {
    'cooking': ['recipe', 'ingredients', 'kitchen', 'food', 'meal', 'dish'],
    'tech': ['technology', 'software', 'app', 'device', 'gadget', 'digital'],
    'fitness': ['workout', 'exercise', 'health', 'training', 'gym', 'diet'],
    'music': ['song', 'artist', 'album', 'lyrics', 'cover', 'instrumental'],
    'gaming': ['game', 'gameplay', 'walkthrough', 'strategy', 'tips', 'cheats'],
    'education': ['learn', 'study', 'course', 'lesson', 'class', 'school'],
    'business': ['marketing', 'money', 'entrepreneur', 'startup', 'success', 'strategy']
  };
  
  // Use for...of for better performance with large objects
  for (const [category, terms] of Object.entries(categories)) {
    const isRelevantCategory = baseQuery.includes(category) || 
      terms.some(term => baseQuery.includes(term));
    
    if (isRelevantCategory) {
      for (const term of terms) {
        if (!baseQuery.includes(term)) {
          suggestions.add(`${query} ${term}`);
          suggestions.add(`${term} ${query}`);
        }
      }
    }
  }
}

function addLongTailSuggestions(suggestions: Set<string>, query: string): void {
  const longTailModifiers = [
    'for beginners', 'step by step', 'in 5 minutes', 'at home',
    'without equipment', 'on a budget', 'for free', 'mistakes to avoid',
    'pros and cons', 'before and after'
  ];
  
  longTailModifiers.forEach(modifier => {
    suggestions.add(`${query} ${modifier}`);
  });
}