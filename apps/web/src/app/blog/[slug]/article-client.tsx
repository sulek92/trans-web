'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface Article {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
}

export function ArticleClient({ article }: { article: Article }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--color-background)] pb-32">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent -z-10" />
      {mounted && (
        <div className="absolute top-[20%] -right-48 w-96 h-96 bg-[var(--color-primary)]/10 blur-[120px] rounded-full -z-10 animate-float-slow" />
      )}

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 overflow-hidden px-8">
        <div className="max-w-[900px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-3 text-[var(--color-primary)] font-black uppercase tracking-[0.3em] text-[10px] mb-12 hover:gap-5 transition-all group px-6 py-2 bg-[var(--color-primary)]/5 rounded-full border border-[var(--color-primary)]/10"
            >
              <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">arrow_back</span>
              Baza Wiedzy
            </Link>
            
            <div className="flex justify-center gap-4 mb-10">
              <span className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[var(--color-primary)]/20">
                {article.category || 'Logistyka'}
              </span>
              <span 
                className="px-6 py-2 bg-surface-container text-[var(--color-text-faint)] rounded-xl text-[10px] font-bold uppercase tracking-widest border border-[var(--color-divider)]"
                suppressHydrationWarning
              >
                {mounted && article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' }) : (article.publishedAt ? '...' : 'Szkic')}
              </span>
            </div>

            <h1 className="font-display-bold text-5xl md:text-7xl font-bold text-[var(--color-on-background)] mb-10 tracking-tighter leading-[1.05] drop-shadow-sm">
              {article.title}
            </h1>
            
            <p className="text-[var(--color-text-muted)] text-xl md:text-2xl leading-relaxed font-medium opacity-90 max-w-2xl mx-auto italic">
              "{article.excerpt}"
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="max-w-[900px] mx-auto px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-[var(--color-surface-primary)] rounded-[60px] p-10 md:p-20 border border-[var(--color-divider)] shadow-3xl relative overflow-hidden"
        >
          {/* Carbon Fiber Background Pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
          
          <div className="prose prose-2xl prose-invert max-w-none 
            prose-headings:font-display-bold prose-headings:tracking-tight prose-headings:text-[var(--color-on-background)]
            prose-p:text-[var(--color-text-muted)] prose-p:leading-relaxed prose-p:font-medium prose-p:mb-8
            prose-strong:text-[var(--color-on-background)] prose-strong:font-bold
            prose-a:text-[var(--color-primary)] prose-a:no-underline hover:prose-a:underline prose-a:font-bold
            prose-img:rounded-[40px] prose-img:shadow-3xl prose-img:my-16
            prose-ul:list-disc prose-li:text-[var(--color-text-muted)] prose-li:mb-2
            prose-blockquote:border-[var(--color-primary)] prose-blockquote:bg-[var(--color-primary)]/5 prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:not-italic
          ">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>

          <div className="mt-24 pt-16 border-t border-[var(--color-divider)] flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-6 group">
              <div className="w-20 h-20 rounded-3xl bg-[var(--color-primary)] flex items-center justify-center text-white shadow-2xl shadow-[var(--color-primary)]/20 group-hover:scale-110 transition-premium">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-2">Autor Artykułu</div>
                <div className="text-2xl font-bold text-[var(--color-on-background)] tracking-tight">Ekspert PaletyBroker</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button className="w-14 h-14 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-on-background)] hover:bg-[var(--color-primary)] hover:text-white transition-premium shadow-md border border-[var(--color-divider)]/50">
                <span className="material-symbols-outlined">share</span>
              </button>
              <button className="w-14 h-14 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-on-background)] hover:bg-[var(--color-primary)] hover:text-white transition-premium shadow-md border border-[var(--color-divider)]/50">
                <span className="material-symbols-outlined">bookmark</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* --- FOOTER CTA SECTION --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 p-16 md:p-24 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover, #0d9488)] rounded-[60px] text-white shadow-3xl text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-inner backdrop-blur-md border border-white/10">
              <span className="material-symbols-outlined text-4xl">rocket_launch</span>
            </div>
            <h3 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter leading-none">Chcesz optymalizować <br /> swoją logistykę?</h3>
            <p className="text-xl opacity-90 mb-12 max-w-xl mx-auto leading-relaxed font-medium">
              Skorzystaj z naszej inteligentnej platformy wyceny i sprawdź ile możesz zaoszczędzić na każdej palecie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/wycena" 
                className="bg-white text-[var(--color-primary)] px-12 py-6 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl active:scale-95"
              >
                Bezpłatna Wycena
              </Link>
              <Link 
                href="/blog" 
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-12 py-6 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all active:scale-95"
              >
                Wszystkie Artykuły
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
