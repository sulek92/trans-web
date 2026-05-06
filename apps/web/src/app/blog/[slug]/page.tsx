import * as React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getApiBaseUrl } from '@/lib/api-url';
import Link from 'next/link';
import { BlogPostClient } from './blog-post-client';

async function getArticle(slug: string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/cms/articles/${slug}`, { 
      cache: 'no-store' 
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return { title: 'Artykuł nie znaleziony' };

  return {
    title: article.metaTitle || `${article.title} | Blog PaletBroker`,
    description: article.metaDescription || article.excerpt,
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
    }
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);

  if (!article || (!article.isPublished && process.env.NODE_ENV === 'production')) {
    notFound();
  }

  return (
    <BlogPostClient>
      <main className="pt-40 pb-32 bg-[var(--color-background)] min-h-screen">
        <div className="max-w-[840px] mx-auto px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-16 animate-fade-in">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Start</Link>
            <span className="material-symbols-outlined text-[12px] opacity-30">chevron_right</span>
            <Link href="/blog" className="hover:text-[var(--color-primary)] transition-colors">Wiedza</Link>
            <span className="material-symbols-outlined text-[12px] opacity-30">chevron_right</span>
            <span className="text-[var(--color-primary)]">{article.category || 'Artykuł'}</span>
          </nav>

          <article className="space-y-16">
            <header className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-primary-highlight)] text-[var(--color-primary)] rounded-full text-[10px] font-bold uppercase tracking-widest">
                  <span className="material-symbols-outlined text-xs">local_offer</span>
                  {article.category || 'Logistyka'}
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                  {article.title}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-8 text-sm text-slate-400 font-bold uppercase tracking-widest border-y border-slate-50 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-xl">person</span>
                  </div>
                  <span>Redakcja PaletBroker</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-200 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  {new Date(article.publishedAt || article.createdAt).toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-200 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {Math.ceil((article.content?.length || 0) / 1000) + 2} min czytania
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-8 top-0 bottom-0 w-1.5 bg-[var(--color-primary)] rounded-full opacity-20"></div>
                <p className="text-2xl text-slate-600 leading-relaxed font-medium italic">
                  {article.excerpt}
                </p>
              </div>
            </header>

            {/* Premium Article Image Placeholder / Actual if exists */}
            {article.imageUrl && (
              <div className="relative aspect-[16/9] rounded-[48px] overflow-hidden shadow-2xl">
                 <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose prose-xl prose-slate max-w-none 
              prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight
              prose-p:text-slate-700 prose-p:leading-[1.8] prose-p:text-lg
              prose-strong:text-slate-900 prose-strong:font-bold
              prose-a:text-[var(--color-primary)] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-[40px] prose-img:shadow-premium
              prose-blockquote:border-l-[6px] prose-blockquote:border-[var(--color-primary)] prose-blockquote:bg-slate-50 prose-blockquote:py-8 prose-blockquote:px-12 prose-blockquote:rounded-r-[32px] prose-blockquote:not-italic prose-blockquote:font-bold prose-blockquote:text-slate-900 prose-blockquote:text-2xl
              prose-li:text-slate-700 prose-li:marker:text-[var(--color-primary)]
            ">
              <ReactMarkdown>{article.content || ''}</ReactMarkdown>
            </div>

            <footer className="pt-24 mt-24 border-t border-slate-100">
              <div className="bg-slate-900 rounded-[56px] p-12 md:p-16 text-white relative overflow-hidden group shadow-3xl">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--color-primary)] opacity-20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="space-y-4 text-center md:text-left max-w-md">
                    <h4 className="font-bold text-3xl tracking-tight">Wsparcie w logistyce Twojej firmy</h4>
                    <p className="text-white/60 text-lg">Zacznij wysyłać palety taniej i bezpieczniej z PaletBroker.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                      <span className="material-symbols-outlined">share</span> Udostępnij
                    </button>
                    <Link href="/" className="px-10 py-5 bg-[var(--color-primary)] text-white rounded-2xl font-bold hover:bg-[var(--color-primary-hover)] transition-premium shadow-2xl shadow-[var(--color-primary)]/20 active:scale-95 flex items-center justify-center gap-3">
                      Nadaj przesyłkę <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="mt-16 text-center">
                 <Link href="/blog" className="text-sm font-bold text-slate-400 uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">west</span> Wróć do listy artykułów
                 </Link>
              </div>
            </footer>
          </article>
        </div>
      </main>
    </BlogPostClient>
  );
}
