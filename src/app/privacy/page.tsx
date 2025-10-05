import { generateMetadata } from '@/lib/seo'
import { getBreadcrumbSchema } from '@/lib/structured-data'
import Link from 'next/link'

export const metadata = generateMetadata({
  title: 'Privacy Policy - YouTube Tools',
  description: 'Privacy policy for YouTube Tools. Learn how we protect your data and respect your privacy when using our free YouTube utilities.',
  canonical: 'https://tools.aipepal.com/privacy',
})

export default function PrivacyPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: 'https://tools.aipepal.com' },
    { name: 'Privacy Policy', url: 'https://tools.aipepal.com/privacy' },
  ])

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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
              <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
            </header>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  YouTube Tools operates as a client-side application. We do not collect, store, or process any personal information. All operations are performed locally in your browser.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>We do not require user registration or accounts</li>
                  <li>We do not store YouTube URLs or video data</li>
                  <li>We do not track user behavior or analytics</li>
                  <li>We do not use cookies for tracking purposes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  Since we don't collect personal information, we don't use, share, or sell any user data. Our tools process YouTube data temporarily in your browser to provide the requested functionality.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our tools may interact with YouTube's public APIs to fetch video information. This interaction is governed by YouTube's terms of service and privacy policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
                <p className="text-gray-700 leading-relaxed">
                  All processing happens locally in your browser. No data is transmitted to our servers, ensuring maximum privacy and security for our users.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:privacy@aipepal.com" className="text-red-600 hover:text-red-700">
                    privacy@aipepal.com
                  </a>
                </p>
              </section>
            </div>
          </article>
        </main>
      </div>
    </>
  )
}