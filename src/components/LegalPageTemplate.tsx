import { ReactNode } from 'react';
import { generateMetadata } from '@/lib/seo';
import { getBreadcrumbSchema } from '@/lib/structured-data';
import Link from 'next/link';

interface LegalPageTemplateProps {
  title: string;
  description: string;
  path: string;
  children: ReactNode;
}

export function LegalPageTemplate({ title, description, path, children }: LegalPageTemplateProps) {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: 'https://tools.aipepal.com' },
    { name: title, url: `https://tools.aipepal.com${path}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50">
          <nav className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <span className="text-xl font-bold">YouTube Tools</span>
            </Link>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <article className="bg-white rounded-2xl shadow-lg p-8">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
              <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
            </header>
            {children}
          </article>
        </main>
      </div>
    </>
  );
}

export function generateLegalMetadata(title: string, description: string, path: string) {
  return generateMetadata({
    title: `${title} - YouTube Tools`,
    description,
    canonical: `https://tools.aipepal.com${path}`,
  });
}