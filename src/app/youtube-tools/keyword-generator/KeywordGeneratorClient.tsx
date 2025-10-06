'use client'

import { useState } from 'react';
import { YouTubeToolClient } from '@/components/YouTubeToolClient';
import { Button } from "@/components/ui/button";
import { ClientOnly } from '@/components/ClientOnly';
import { toolConfigs } from '@/lib/tool-configs';

export default function KeywordGeneratorClient() {
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');

  const handleSubmit = async (inputQuery: string) => {
    setIsLoading(true);
    setError('');
    setSuggestions([]);
    setSelectedKeywords(new Set());
    setQuery(inputQuery);
    
    if (!inputQuery.trim()) {
      setError('Please enter a keyword or topic.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/youtube-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: inputQuery.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Failed to generate keywords');
        return;
      }

      setSuggestions(result.data?.suggestions || []);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleKeyword = (keyword: string) => {
    const newSelected = new Set(selectedKeywords);
    if (newSelected.has(keyword)) {
      newSelected.delete(keyword);
    } else {
      newSelected.add(keyword);
    }
    setSelectedKeywords(newSelected);
  };

  const selectAll = () => {
    setSelectedKeywords(new Set(suggestions));
  };

  const clearAll = () => {
    setSelectedKeywords(new Set());
  };

  const copyToClipboard = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = Array.from(selectedKeywords).join(', ');
        await navigator.clipboard.writeText(text);
        // Could add success feedback here
      } else {
        throw new Error('Clipboard not available');
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Could add error feedback here
    }
  };

  const exportCSV = () => {
    if (typeof document === 'undefined' || selectedKeywords.size === 0) {
      return;
    }
    
    try {
      const csvContent = Array.from(selectedKeywords).join('\n');
      const filename = generateCSVFilename(query);
      downloadCSVFile(csvContent, filename);
    } catch (error) {
      console.error('Failed to export CSV:', error);
    }
  };
  
  const generateCSVFilename = (query: string): string => {
    const sanitizedQuery = query.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
    return `youtube-keywords-${sanitizedQuery}.csv`;
  };
  
  const downloadCSVFile = (content: string, filename: string): void => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const resultsSection = suggestions.length > 0 && (
    <ClientOnly>
      <section className="mb-16" suppressHydrationWarning>
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Generated Keywords</h3>
                  <p className="text-gray-600">Found {suggestions.length} suggestions • {selectedKeywords.size} selected</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={selectAll} variant="outline" size="sm">Select All</Button>
                  <Button onClick={clearAll} variant="outline" size="sm">Clear All</Button>
                  <Button onClick={copyToClipboard} disabled={selectedKeywords.size === 0} className="bg-blue-600 hover:bg-blue-700" size="sm">Copy Selected</Button>
                  <Button onClick={exportCSV} disabled={selectedKeywords.size === 0} className="bg-green-600 hover:bg-green-700" size="sm">Export CSV</Button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((keyword, index) => {
                  const isSelected = selectedKeywords.has(keyword);
                  const buttonClass = isSelected ? 'bg-red-100 text-red-800 border-2 border-red-300' : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200';
                  
                  return (
                    <button key={index} onClick={() => toggleKeyword(keyword)} className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${buttonClass}`}>
                      {isSelected && (
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {keyword.replace(/[<>"'&]/g, '')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </ClientOnly>
  );

  return (
    <YouTubeToolClient
      config={toolConfigs['keyword-generator']}
      onSubmit={handleSubmit}
      loading={isLoading}
      error={error}
      resultsSection={resultsSection}
    />
  );
}