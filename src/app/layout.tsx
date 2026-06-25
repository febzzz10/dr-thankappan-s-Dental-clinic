import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { PublicLayoutShell } from '@/components/layout/PublicLayoutShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { getLocalBusinessSchema, getWebSiteSchema } from '@/lib/schemas';
import "@aejkatappaja/phantom-ui/ssr.css";

const baseUrl = 'https://drthankappandental.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Dr.Thankappan's Dental Clinic",
    template: "%s | Dr.Thankappan's Dental Clinic",
  },
  description:
    'Your trusted dental clinic in kochi. A Family Tradition of Dental Excellence.',
  applicationName: "Dr.Thankappan's Dental Clinic",
  referrer: 'origin-when-cross-origin',
  keywords: [
    'dental clinic Kochi',
    'dentist in Kochi',
    'laser dentistry Kochi',
    'advanced dental clinic Kochi',
    'root canal treatment Kochi',
    'dental implants Kochi',
    'teeth whitening Kochi',
    'braces and aligners Kochi',
    'dental cleaning Kochi',
    'crowns and bridges Kochi',
    'smile correction Kochi',
    'gum depigmentation Kochi',
    'clear aligners Kochi',
    'aesthetic dental restorations Kochi',
    'jaw pain relief Kochi',
    'family dentist Kochi',
    'painless dental treatment Kochi',
    'modern dental clinic Kochi',
  ],
  authors: [{ name: "Dr.Thankappan's Dental Clinic" }],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/images/logo.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: "Dr.Thankappan's Dental Clinic",
    description:
      'Your trusted dental clinic in Kochi, Kerala. Expert dental care since 1997 — root canal, cleaning, implants, braces, and more.',
    url: baseUrl,
    siteName: "Dr.Thankappan's Dental Clinic",
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: '/images/logo.png',
        width: 512,
        height: 512,
        alt: "Dr.Thankappan's Dental Clinic",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Dr.Thankappan's Dental Clinic",
    description:
      'Your trusted dental clinic in Kochi, Kerala. Book your appointment online.',
    images: ['/images/logo.png'],
  },
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
  alternates: {
    canonical: baseUrl,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f766e',
};

const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const hydrationScript = {
  __html: `<script>(function(){var o=new MutationObserver(function(m){for(var i=0;i<m.length;i++){for(var j=0;j<m[i].addedNodes.length;j++){var n=m[i].addedNodes[j];if(n.nodeType===1&&n.id&&n.id.indexOf('pronounce')!==-1){n.parentNode&&n.parentNode.removeChild(n)}if(n.nodeType===1&&n.querySelector){var e=n.querySelector('[id*="pronounce"]');if(e)e.parentNode&&e.parentNode.removeChild(e)}}}});o.observe(document.documentElement,{childList:true,subtree:true});setTimeout(function(){o.disconnect()},3000)})();<\/script>`
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} scroll-smooth`}
    >
      <head>
        <link rel="preload" href="/images/bgmobile.webp" as="image" fetchPriority="high" />
        <link rel="llms-txt" href="/llms.txt" title="AI-readable summary" />
        <link rel="humans-txt" href="/humans.txt" />
      </head>
      <body className="font-sans antialiased tap-highlight-none" suppressHydrationWarning style={{ touchAction: 'manipulation' }}>
        <div className="grain-fixed" aria-hidden="true" />
        <span aria-hidden="true" style={{ display: 'none' }} dangerouslySetInnerHTML={hydrationScript} />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-teal-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg">
          Skip to main content
        </a>
        <PublicLayoutShell>
          <JsonLd data={getLocalBusinessSchema()} />
          <JsonLd data={getWebSiteSchema()} />
          {children}
        </PublicLayoutShell>
      </body>
    </html>
  );
}
