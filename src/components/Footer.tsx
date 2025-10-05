'use client'

import Link from "next/link";
import { ClientOnly } from './ClientOnly';

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">YouTube Tools</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Free online utilities for YouTube content creators and marketers. Extract, download, and analyze video data effortlessly.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/youtube-tools/thumbnail-downloader" className="text-gray-400 hover:text-white transition-colors">Thumbnail Downloader</Link></li>
              <li><Link href="/youtube-tools/transcript-downloader" className="text-gray-400 hover:text-white transition-colors">Transcript Downloader</Link></li>
              <li><Link href="/youtube-tools/tags-extractor" className="text-gray-400 hover:text-white transition-colors">Tags Extractor</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">More Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/youtube-tools/title-description-extractor" className="text-gray-400 hover:text-white transition-colors">Title & Description</Link></li>
              <li><Link href="/youtube-tools/keyword-generator" className="text-gray-400 hover:text-white transition-colors">Keyword Generator</Link></li>
              <li><Link href="/youtube-tools/region-restriction-checker" className="text-gray-400 hover:text-white transition-colors">Region Checker</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © <ClientOnly fallback="2024">{new Date().getFullYear()}</ClientOnly> YouTube Tools by AiPEPAL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}