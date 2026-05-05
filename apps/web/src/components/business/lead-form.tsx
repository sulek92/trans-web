'use client';

export function BusinessLeadForm() {
  return (
    <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-[var(--color-divider)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform"></div>
      <form
        className="space-y-6 relative z-10"
        onSubmit={(e) => {
          e.preventDefault();
          alert('Dziekujemy! Skontaktujemy sie z Toba wkrotce.');
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Firma</label>
            <input required placeholder="Nazwa Twojej firmy" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-medium" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Wolumen (miesięcznie)</label>
            <select className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-medium appearance-none">
              <option>1-10 palet</option>
              <option>11-50 palet</option>
              <option>50+ palet</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Telefon kontaktowy</label>
          <input required type="tel" placeholder="+48 000 000 000" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-medium" />
        </div>
        <button type="submit" className="w-full py-5 rounded-2xl bg-slate-900 text-white font-bold shadow-xl hover:bg-black transition-premium active:scale-95">Zamów darmową wycenę B2B</button>
      </form>
    </div>
  );
}
