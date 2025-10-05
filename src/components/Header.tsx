'use client'

import Link from 'next/link';
import { SocialShare } from './SocialShare';
import { ClientOnly } from './ClientOnly';

interface HeaderProps {
  title?: string;
  shareTitle?: string;
  shareDescription?: string;
  showBackButton?: boolean;
}

export function Header({ 
  title = "YouTube Tools",
  shareTitle,
  shareDescription,
  showBackButton = false
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50" role="banner" suppressHydrationWarning>
      <nav className="container mx-auto px-4 py-4" role="navigation" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center" aria-hidden="true">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-label="YouTube icon">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <ClientOnly>
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy</Link>
              </div>
            </ClientOnly>
            <SocialShare title={shareTitle} description={shareDescription} />
            {showBackButton && (
              <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}