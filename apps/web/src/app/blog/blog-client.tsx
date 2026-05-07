'use client';

import * as React from 'react';
import Link from 'next/link';
import { useToastStore } from '@/lib/store/toast-store';
import { getApiBaseUrl } from '@/lib/api-url';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
}

export function BlogClient({ 
  articles, 
  newsletterTitle, 
  newsletterDesc 
}: { 
  articles: Article[];
  newsletterTitle: string; 
  newsletterDesc: string 
}) {
  const [isSubscribing, setIsSubscribing] = React.useState(false);
  const { addToast } = useToastStore();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    const form = e.target as HTMLFormElement;
    const email = (form.querySelector('input[type="email"]') as HTMLInputElement).value;

    try {
      const res = await fetch(`${getApiBaseUrl()}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        addToast({
          title: 'Sukces!',
          description: 'Dziękujemy za zapis do newslettera.',
          type: 'success',
        });
        form.reset();
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Błąd zapisu.');
      }
    } catch (error) {
      addToast({
        title: 'Błąd',
        description: error instanceof Error ? error.message : 'Nie udało się zapisać.',
        type: 'error',
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <main className="pb-24 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="mb-16">
          <h1 className="font-display-bold text-5xl font-bold text-[var(--color-on-background)] mb-4">Centrum Wiedzy</h1>
          <p className="text-[var(--color-on-surface-variant)] text-xl">Najnowsze wieści z branży logistycznej, poradniki i technologia.</p>
        </div>

        {articles.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[40px] border border-[var(--color-divider)]">
            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">post_add</span>
            <p className="text-slate-400 font-medium">Obecnie brak nowych artykułów. Zapraszamy wkrótce!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {articles.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-[var(--color-divider)] shadow-sm hover:shadow-xl transition-premium flex flex-col">
                <div className="aspect-video bg-[var(--color-surface-container-low)] flex items-center justify-center group-hover:scale-105 transition-premium overflow-hidden">
                  <span className="material-symbols-outlined text-6xl text-[var(--color-primary)] opacity-40">article</span>
                </div>
                <div className="p-8 flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary-highlight)] px-2 py-1 rounded">{post.category || 'Ogólne'}</span>
                    <span className="text-xs text-[var(--color-on-surface-variant)] font-medium">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Szkic'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--color-on-background)] mb-4 leading-tight group-hover:text-[var(--color-primary)] transition-colors">{post.title}</h2>
                  <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>
                  <div className="mt-auto flex items-center gap-2 text-[var(--color-primary)] font-bold text-sm">
                    Czytaj więcej <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-24 bg-[#005258] rounded-[40px] p-16 text-white text-center relative overflow-hidden">
          {isSubscribing && <div className="absolute inset-0 z-50 bg-[#005258]/80 backdrop-blur-sm flex items-center justify-center animate-fade-in">
             <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>}
          <h2 className="text-3xl font-bold mb-6">{newsletterTitle}</h2>
          <p className="text-lg opacity-80 mb-10 max-w-2xl mx-auto">{newsletterDesc}</p>
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-4">
            <input required type="email" className="flex-grow px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:bg-white/20 transition-all placeholder:text-white/40" placeholder="Twój adres e-mail" />
            <button disabled={isSubscribing} className="bg-white text-[#005258] px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors disabled:opacity-50">
              {isSubscribing ? 'Sekunda...' : 'Zapisz się'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
