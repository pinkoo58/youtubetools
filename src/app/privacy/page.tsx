import { LegalPageTemplate, generateLegalMetadata } from '@/components/LegalPageTemplate';

export const metadata = generateLegalMetadata(
  'Privacy Policy',
  'Privacy policy for YouTube Tools. Learn how we protect your data and respect your privacy when using our free YouTube utilities.',
  '/privacy'
);

export default function PrivacyPage() {
  return (
    <LegalPageTemplate
      title="Privacy Policy"
      description="Privacy policy for YouTube Tools"
      path="/privacy"
    >

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
    </LegalPageTemplate>
  );
}