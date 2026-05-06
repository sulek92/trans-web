/** CMS Admin Dashboard - central hub for content management. */
'use client';

import * as React from 'react';
import Link from 'next/link';
import { getApiBaseUrl } from '@/lib/api-url';

type Stats = {
  pages: number;
  articles: number;
  media: number;
};

export default function CmsDashboard() {
  const [stats, setStats] = React.useState<Stats>({ pages: 0, articles: 0, media: 0 });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pagesRes, articlesRes, mediaRes] = await Promise.all([
          fetch(`${getApiBaseUrl()}/cms/pages`),
          fetch(`${getApiBaseUrl()}/cms/articles`),
          fetch(`${getApiBaseUrl()}/cms/media`)
        ]);

        const [pages, articles, media] = await Promise.all([
          pagesRes.ok ? pagesRes.json() : [],
          articlesRes.ok ? articlesRes.json() : [],
          mediaRes.ok ? mediaRes.json() : []
        ]);

        setStats({
          pages: Array.isArray(pages) ? pages.length : 0,
          articles: Array.isArray(articles) ? articles.length : 0,
          media: Array.isArray(media) ? media.length : 0
        });
      } catch (error) {
        console.error('Failed to fetch CMS stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const navCards = [
    {
      title: 'Strony CMS',
      desc: 'Zarządzaj statycznymi stronami, ofertami i treścią strony głównej.',
      icon: 'description',
      href: '/admin/cms/pages',
      color: 'bg-blue-50 text-blue-600',
      count: stats.pages
    },
    {
      title: 'Artykuły i Blog',
      desc: 'Publikuj aktualności, poradniki i artykuły eksperckie.',
      icon: 'article',
      href: '/admin/cms/articles',
      color: 'bg-amber-50 text-amber-600',
      count: stats.articles
    },
    {
      title: 'Biblioteka Mediów',
      desc: 'Przesyłaj i organizuj zdjęcia oraz pliki graficzne.',
      icon: 'image',
      href: '/admin/cms/media',
      color: 'bg-purple-50 text-purple-600',
      count: stats.media
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-display-bold font-bold tracking-tight">System CMS</h1>
        <p className="text-slate-500 text-lg">Witaj w centrum zarządzania treścią PaletBroker. Wybierz obszar, który chcesz edytować.</p>
      </header>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {navCards.map((card) => (
          <Link 
            key={card.href} 
            href={card.href}
            className="group relative bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-[var(--color-primary)]/20 transition-all duration-500 overflow-hidden"
          >
            <div className={`w-16 h-16 ${card.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
              <span className="material-symbols-outlined text-3xl">{card.icon}</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold tracking-tight">{card.title}</h3>
                {loading ? (
                  <div className="h-6 w-8 bg-slate-100 animate-pulse rounded" />
                ) : (
                  <span className="text-sm font-bold bg-slate-50 px-3 py-1 rounded-full text-slate-400">{card.count}</span>
                )}
              </div>
              <p className="text-slate-500 leading-relaxed">{card.desc}</p>
            </div>

            <div className="mt-8 flex items-center text-[var(--color-primary)] font-bold text-sm gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 transition-transform duration-500">
              Otwórz moduł <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>

            {/* Decorative background element */}
            <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${card.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-1000`} />
          </Link>
        ))}
      </div>

      {/* Shortcuts / Tips Section */}
      <div className="bg-slate-900 text-white rounded-[40px] p-12 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
          <span className="material-symbols-outlined text-[200px]">auto_awesome</span>
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
              Szybka Porada
            </div>
            <h2 className="text-3xl font-bold leading-tight">Edytuj sekcję Hero bezpośrednio na stronie głównej</h2>
            <p className="text-slate-400 text-lg">Przejdź do edycji strony &quot;home&quot;, aby zmienić napisy na banerze głównym, dodać nowe opinie klientów lub zaktualizować logotypy partnerów.</p>
            <Link 
              href="/admin/cms/pages/edit/home" 
              className="inline-flex items-center gap-4 bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all active:scale-95"
            >
              Edytuj Home <span className="material-symbols-outlined">edit</span>
            </Link>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-2">
              <div className="font-bold">Optymalizacja SEO</div>
              <div className="text-xs text-slate-500">Każda strona posiada pola Meta Title i Description dla Google.</div>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-2">
              <div className="font-bold">Media Library</div>
              <div className="text-xs text-slate-500">Wgrywaj pliki WebP dla lepszej wydajności strony.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
