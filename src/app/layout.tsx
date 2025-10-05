import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { UIProvider } from "@/contexts/UIContext";
import { ToastContainer } from "@/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Footer } from "@/components/Footer";
import { ClientOnly } from "@/components/ClientOnly";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/structured-data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tools.aipepal.com'),
  title: {
    default: "YouTube Tools - Free Online Utilities | Download, Extract & Analyze",
    template: "%s | YouTube Tools"
  },
  description: "Free YouTube tools collection. Download thumbnails, extract titles, descriptions, tags, transcripts, and check region restrictions. No signup required - 100% free forever.",
  keywords: [
    "youtube tools", "thumbnail downloader", "transcript extractor", "youtube utilities", 
    "free tools", "youtube seo", "video analysis", "youtube downloader", "caption extractor",
    "youtube tags", "video metadata", "youtube keywords", "region checker", "youtube api tools"
  ],
  authors: [{ name: "AiPEPAL", url: "https://tools.aipepal.com" }],
  creator: "AiPEPAL",
  publisher: "AiPEPAL",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tools.aipepal.com",
    siteName: "YouTube Tools",
    title: "YouTube Tools - Free Online Utilities",
    description: "Free YouTube tools collection. Download thumbnails, extract titles, descriptions, tags, transcripts, and check region restrictions.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YouTube Tools - Free Online Utilities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Tools - Free Online Utilities",
    description: "Free YouTube tools collection. Download thumbnails, extract titles, descriptions, tags, transcripts, and check region restrictions.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://tools.aipepal.com",
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebSiteSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ef4444" />
        <meta name="color-scheme" content="light" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          <UIProvider>
            {children}
            <Footer />
            <ClientOnly>
              <ToastContainer />
            </ClientOnly>
          </UIProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
