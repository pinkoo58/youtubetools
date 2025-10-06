import { LegalPageTemplate, generateLegalMetadata } from '@/components/LegalPageTemplate';

export const metadata = generateLegalMetadata(
  'About Us',
  'Learn about YouTube Tools - Free online utilities for content creators and marketers. Our mission, features, and commitment to user privacy.',
  '/about'
);

export default function AboutPage() {
  return (
    <LegalPageTemplate
      title="About YouTube Tools"
      description="Learn about our free YouTube utilities"
      path="/about"
    >
      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            YouTube Tools is a collection of free, easy-to-use utilities designed to help content creators, 
            marketers, and researchers work more efficiently with YouTube content. We believe that powerful 
            tools should be accessible to everyone, regardless of budget or technical expertise.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Thumbnail Downloader</h3>
              <p className="text-gray-600 text-sm">Download YouTube video thumbnails in multiple resolutions instantly.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transcript Extractor</h3>
              <p className="text-gray-600 text-sm">Extract and download video transcripts and captions in TXT or SRT format.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags Extractor</h3>
              <p className="text-gray-600 text-sm">Discover video tags and keywords for SEO analysis and research.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Keyword Generator</h3>
              <p className="text-gray-600 text-sm">Generate relevant keywords and tags for better video discoverability.</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Us?</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>100% Free:</strong> All tools are completely free with no hidden costs or premium tiers</li>
            <li><strong>No Registration:</strong> Use all features without creating an account or providing personal information</li>
            <li><strong>Privacy First:</strong> All processing happens in your browser - we don't store your data</li>
            <li><strong>Fast & Reliable:</strong> Optimized for speed with robust error handling</li>
            <li><strong>Mobile Friendly:</strong> Works perfectly on all devices and screen sizes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technology</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our tools are built with modern web technologies including Next.js, TypeScript, and Tailwind CSS. 
            We prioritize performance, security, and user experience in every aspect of our development process.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            Have questions, suggestions, or need support? We'd love to hear from you! 
            Visit our <a href="/contact" className="text-red-600 hover:text-red-700 underline">contact page</a> 
            or email us directly at <a href="mailto:support@aipepal.com" className="text-red-600 hover:text-red-700 underline">support@aipepal.com</a>.
          </p>
        </section>
      </div>
    </LegalPageTemplate>
  );
}