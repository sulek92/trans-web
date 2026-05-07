import * as React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, Users, FileText, Settings } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 min-h-[calc(100vh-10rem)]">
      <aside className="w-full md:w-64 shrink-0 border-r border-[var(--color-outline-variant)] pr-4">
        <nav className="flex flex-col gap-2 sticky top-24">
          <Link href="/konto" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-[var(--color-surface-offset)] transition-colors">
            <LayoutDashboard className="h-5 w-5 text-[var(--color-on-surface-variant)]" />
            Pulpit
          </Link>
          <Link href="/konto/zamowienia" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-[var(--color-surface-offset)] text-[var(--color-on-background)] transition-colors">
            <Package className="h-5 w-5 text-[var(--color-primary)]" />
            Zamówienia
          </Link>
          <Link href="/konto/adresy" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-[var(--color-surface-offset)] transition-colors">
            <Users className="h-5 w-5 text-[var(--color-on-surface-variant)]" />
            Książka adresowa
          </Link>
          <Link href="/konto/faktury" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-[var(--color-surface-offset)] transition-colors">
            <FileText className="h-5 w-5 text-[var(--color-on-surface-variant)]" />
            Faktury
          </Link>
          <Link href="/konto/ustawienia" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-[var(--color-surface-offset)] transition-colors">
            <Settings className="h-5 w-5 text-[var(--color-on-surface-variant)]" />
            Ustawienia
          </Link>
        </nav>
      </aside>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
