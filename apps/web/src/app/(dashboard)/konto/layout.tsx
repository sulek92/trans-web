'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Users, FileText, Settings } from 'lucide-react';
import { AuthGuard } from '@/components/auth/auth-guard';

const NAV_ITEMS = [
  { href: '/konto', label: 'Pulpit', icon: LayoutDashboard },
  { href: '/zamowienia', label: 'Zamówienia', icon: Package },
  { href: '/konto/adresy', label: 'Książka adresowa', icon: Users },
  { href: '/konto/faktury', label: 'Faktury', icon: FileText },
  { href: '/konto/ustawienia', label: 'Ustawienia', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 min-h-[calc(100vh-10rem)]">
      <aside className="w-full md:w-64 shrink-0 border-r border-[var(--color-outline-variant)] pr-4">
        <nav className="flex flex-col gap-2 sticky top-24">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--color-surface-offset)] text-[var(--color-on-background)]'
                    : 'hover:bg-[var(--color-surface-offset)]'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
    </AuthGuard>
  );
}
