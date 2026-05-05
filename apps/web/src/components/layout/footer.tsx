import * as React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full py-16 border-t border-slate-800 bg-[#0a0c10] text-slate-400 mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-[1280px] mx-auto px-8">
        <div className="flex flex-col gap-6">
          <div className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-primary-highlight)]/20">
              <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>pallet</span>
            </div>
            PaletBroker
          </div>
          <p className="text-sm leading-relaxed opacity-60">
            Profesjonalna platforma logistyczna B2B. Skupiamy się na dostarczaniu najwyższej jakości usług transportu paletowego w Europie.
          </p>
          <div className="mt-2">
            <div className="text-[10px] font-bold text-white uppercase tracking-widest mb-3 opacity-40">Newsletter logistyczny</div>
            <form className="flex gap-2">
              <input type="email" placeholder="Twój e-mail" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs flex-grow outline-none focus:border-[var(--color-primary)] transition-colors" />
              <button type="submit" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Firma</h3>
          <Link className="text-sm hover:text-teal-400 transition-colors" href="/o-nas">O nas</Link>
          <Link className="text-sm hover:text-teal-400 transition-colors" href="/kariera">Kariera</Link>
          <Link className="text-sm hover:text-teal-400 transition-colors" href="/kontakt">Kontakt</Link>
          <Link className="text-sm hover:text-teal-400 transition-colors" href="/blog">Blog logistyczny</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Narzędzia</h3>
          <Link className="text-sm hover:text-teal-400 transition-colors" href="/wycena">Kalkulator palet</Link>
          <Link className="text-sm hover:text-teal-400 transition-colors" href="/sledzenie">Śledzenie przesyłki</Link>
          <Link className="text-sm hover:text-teal-400 transition-colors" href="/api">API & Integracje</Link>
          <Link className="text-sm hover:text-teal-400 transition-colors" href="/typy-palet">Przewodnik po paletach</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Wsparcie</h3>
          <Link className="text-sm hover:text-teal-400 transition-colors" href="/pomoc">Centrum pomocy</Link>
          <Link className="text-sm hover:text-teal-400 transition-colors" href="/regulamin">Regulamin serwisu</Link>
          <Link className="text-sm hover:text-teal-400 transition-colors" href="/polityka-prywatnosci">Polityka prywatności</Link>
          <Link className="text-sm hover:text-teal-400 transition-colors font-bold text-white/20" href="/admin">Panel Administratora</Link>
          <div className="mt-4 flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">System Status: Online</span>
          </div>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-8 mt-16 pt-8 border-t border-slate-900 flex justify-between items-center text-xs opacity-50">
        <p>© {new Date().getFullYear()} PaletBroker Sp. z o.o. Wszystkie prawa zastrzeżone.</p>
        <p>Logistyka napędzana technologią.</p>
      </div>
    </footer>
  );
}
