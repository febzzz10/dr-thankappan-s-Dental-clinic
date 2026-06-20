'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppFab } from './WhatsAppFab';
import { CookieConsent } from './CookieConsent';
import { MobileFAQ } from '../home/MobileFAQ';

export function PublicLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      {!isAdmin && <MobileFAQ />}
      {!isAdmin && <Footer />}
      {!isAdmin && <CookieConsent />}
      <WhatsAppFab />
    </>
  );
}
