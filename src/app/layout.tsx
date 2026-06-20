import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { PublicLayoutShell } from '@/components/layout/PublicLayoutShell';

export const metadata: Metadata = {
  title: {
    default: "Dr.Thankappan's Dental Clinic",
    template: "%s | Dr.Thankappan's Dental Clinic",
  },
  description:
    'Expert dental care in Bangalore. Professional, gentle, and affordable dentistry for the whole family.',
  icons: {
    icon: [
      { url: '/images/logo.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: "Dr.Thankappan's Dental Clinic",
    description:
      'Expert dental care in Bangalore. Professional, gentle, and affordable dentistry for the whole family.',
    type: 'website',
    locale: 'en_IN',
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
        <link rel="preload" href="/images/bgclinic-1920.webp" as="image" fetchPriority="high" />
        <link rel="preload" href="/images/bgmobile.webp" as="image" fetchPriority="high" />
      </head>
      <body className="font-sans antialiased tap-highlight-none" suppressHydrationWarning style={{ touchAction: 'manipulation' }}>
        <div className="grain-fixed" aria-hidden="true" />
        <span aria-hidden="true" style={{ display: 'none' }} dangerouslySetInnerHTML={hydrationScript} />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-teal-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg">
          Skip to main content
        </a>
        <PublicLayoutShell>{children}</PublicLayoutShell>
      </body>
    </html>
  );
}
