'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminMobileNav } from '@/components/admin/AdminMobileNav';
import { getMe } from '@/lib/api';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false);
      return;
    }
    getMe()
      .then(() => setChecking(false))
      .catch(() => {
        router.replace('/admin/login?from=' + encodeURIComponent(pathname));
      });
  }, [pathname, router]);

  if (checking && pathname !== '/admin/login') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh bg-slate-50">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-600 focus:text-white focus:rounded-lg">Skip to content</a>
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminMobileNav />
        <div id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
