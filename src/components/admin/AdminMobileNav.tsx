'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Calendar, Clock, Users, FileText, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/api';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Users },
  { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
  { href: '/admin/bookings', label: 'Bookings', icon: FileText },
  { href: '/admin/slots', label: 'Slots', icon: Clock },
];

export function AdminMobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // proceed regardless
    }
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
    } catch {
      // proceed regardless
    }
    router.push('/admin/login');
  };

  return (
    <nav className="flex border-b border-slate-200 bg-white px-4 lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-medium transition-colors',
              isActive
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-600 hover:text-slate-700'
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="ml-auto flex items-center gap-2 border-b-2 border-transparent px-4 py-3 text-xs font-medium text-red-600 transition-colors hover:text-red-700 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none"
        aria-label="Logout"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
