'use client'

import { useState, ReactNode } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClientOnly } from './ClientOnly';
import { Header } from './Header';
import Script from 'next/script';

interface ToolConfig {
  title: string;
  subtitle: string;
  description: string;
  shareTitle: string;
  shareDescription: string;
  inputPlaceholder: string;
  buttonText: string;
  loadingText: string;
  buttonIcon: ReactNode;
  inputType?: 'url' | 'text';
  requiresVideoId?: boolean;
}

interface YouTubeToolClientProps {
  config: ToolConfig;
  onSubmit: (input: string) => Promise<void>;
  loading: boolean;
  error: string;
  children?: ReactNode;
  resultsSection?: ReactNode;
  featuresSection?: ReactNode;
  faqSchema?: object;
}

export function YouTubeToolClient({
  config,
  onSubmit,
  loading,
  error,
  children,
  resultsSection,
  featuresSection,
  faqSchema
}: YouTubeToolClientProps) {
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(input);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Header 
          title={config.title}
          shareTitle={config.shareTitle}
          shareDescription={config.shareDescription}
          showBackButton={true}
        />

        <main className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                {config.title}
                <span className="block text-3xl mt-2 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  {config.subtitle}
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {config.description}
                <span className="block mt-2 text-lg">✨ Free • Fast • No Registration Required</span>
              </p>
              
              <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="relative">
                  <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-2xl shadow-2xl border border-gray-200/50">
                    <div className="flex-1">
                      <Input
                        type={config.inputType || 'url'}
                        placeholder={config.inputPlaceholder}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="border-0 text-lg h-14 bg-transparent focus:ring-0 placeholder:text-gray-400"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="h-14 px-8 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>{config.loadingText}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          {config.buttonIcon}
                          <span>{config.buttonText}</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
                
                <ClientOnly>
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl" suppressHydrationWarning>
                      <p className="text-red-600 flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                      </p>
                    </div>
                  )}
                </ClientOnly>
              </div>
            </div>
          </section>

          {/* Results Section */}
          {resultsSection}

          {/* Custom Content */}
          {children}

          {/* Features Section */}
          {featuresSection || <DefaultFeaturesSection />}
        </main>
      </div>
      
      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}
    </>
  );
}

function DefaultFeaturesSection() {
  return (
    <section className="mb-16">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Our Tool?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h4>
            <p className="text-gray-600">Get results in seconds with our optimized processing</p>
          </div>
          
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">100% Safe</h4>
            <p className="text-gray-600">No downloads required. Everything works in your browser securely</p>
          </div>
          
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Always Free</h4>
            <p className="text-gray-600">No hidden costs, no registration. Use it as much as you want</p>
          </div>
        </div>
      </div>
    </section>
  );
}