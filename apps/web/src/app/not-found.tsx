'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-primary)] opacity-[0.03] rounded-full blur-[120px]"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500 opacity-[0.02] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-[180px] font-display-bold font-bold text-slate-900 leading-none tracking-tighter opacity-10 select-none">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <div className="w-40 h-40 bg-white rounded-[40px] shadow-3xl border border-slate-50 flex items-center justify-center rotate-12 group hover:rotate-0 transition-premium">
               <span className="material-symbols-outlined text-7xl text-[var(--color-primary)]">package_2</span>
             </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Zgubiona paleta?</h2>
          <p className="text-xl text-slate-400 max-w-md mx-auto leading-relaxed">
            Strona, której szukasz, nie została znaleziona w naszym systemie logistycznym. Wróćmy na główny szlak.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            href="/" 
            className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-premium shadow-2xl active:scale-95 flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined text-xl">home</span>
            Strona główna
          </Link>
          <Link 
            href="/sledzenie" 
            className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-premium shadow-sm active:scale-95 flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined text-xl">location_searching</span>
            Śledź przesyłkę
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-24 pt-12 border-t border-slate-50"
        >
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
            Status: Page Not Found • System: PaletBroker OS
          </p>
        </motion.div>
      </div>
    </main>
  );
}
