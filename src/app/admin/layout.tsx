'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminMobileNav } from '@/components/admin/AdminMobileNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/admin/login') return;
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth_token='));
    if (!token) {
      router.replace('/admin/login?from=' + encodeURIComponent(pathname));
    }
  }, [pathname, router]);

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
