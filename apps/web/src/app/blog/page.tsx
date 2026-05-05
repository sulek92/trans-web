'use client';

import * as React from 'react';
import Link from 'next/link';

export default function BlogPage() {
  const [isSubscribing, setIsSubscribing] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    setTimeout(() => {
      alert('Dziękujemy za zapis do newslettera! Sprawdź swoją skrzynkę.');
      setIsSubscribing(false);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };
  const posts = [
    {
      id: 1,
      title: 'Jak przygotować paletę do transportu międzynarodowego?',
      excerpt: 'Dowiedz się, jakie wymogi muszą spełniać palety EPAL i jak zabezpieczyć towar przed długą trasą.',
      category: 'Poradniki',
      date: '05 Maj 2024',
      image: 'inventory_2'
    },
    {
      id: 2,
      title: 'Dopłata paliwowa w 2024 - co musisz wiedzieć?',
      excerpt: 'Analiza rynku paliw i jej wpływ na stawki transportowe w branży TSL.',
      category: 'Rynek',
      date: '02 Maj 2024',
      image: 'oil_barrel'
    },
    {
      id: 3,
      title: 'Automatyzacja logistyki w Twoim e-commerce',
      excerpt: 'Jak integracja API z PaletBroker może skrócić czas obsługi zamówień o 40%.',
      category: 'Technologia',
      date: '28 Kwiecień 2024',
      image: 'robot_2'
    }
  ];

  return (
    <main className="pt-24 pb-24 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="mb-16">
          <h1 className="font-display-bold text-5xl font-bold text-[var(--color-on-background)] mb-4">Centrum Wiedzy</h1>
          <p className="text-[var(--color-on-surface-variant)] text-xl">Najnowsze wieści z branży logistycznej, poradniki i technologia.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group bg-white rounded-2xl overflow-hidden border border-[var(--color-divider)] shadow-sm hover:shadow-xl transition-premium flex flex-col">
              <div className="aspect-video bg-[var(--color-surface-container-low)] flex items-center justify-center group-hover:scale-105 transition-premium overflow-hidden">
                <span className="material-symbols-outlined text-6xl text-[var(--color-primary)] opacity-40">{post.image}</span>
              </div>
              <div className="p-8 flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary-highlight)] px-2 py-1 rounded">
                    {post.category}
                  </span>
                  <span className="text-xs text-[var(--color-on-surface-variant)] font-medium">{post.date}</span>
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-on-background)] mb-4 leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                  {post.title}
                </h2>
                <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center gap-2 text-[var(--color-primary)] font-bold text-sm">
                  Czytaj więcej
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter / CTA */}
        <div className="mt-24 bg-[#005258] rounded-[40px] p-16 text-white text-center relative overflow-hidden">
          {isSubscribing && <div className="absolute inset-0 z-50 bg-[#005258]/80 backdrop-blur-sm flex items-center justify-center animate-fade-in">
             <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>}
          <h2 className="text-3xl font-bold mb-6">Zostań ekspertem w logistyce</h2>
          <p className="text-lg opacity-80 mb-10 max-w-2xl mx-auto">Zapisz się do newslettera i otrzymuj raz w miesiącu wyselekcjonowane treści o rynku TSL oraz ekskluzywne rabaty na wysyłki.</p>
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
