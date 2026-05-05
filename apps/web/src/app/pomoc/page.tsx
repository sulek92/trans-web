'use client';

import * as React from 'react';

function HelpFaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="bg-white rounded-3xl border border-[var(--color-divider)] shadow-sm overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-8 flex items-center justify-between group"
      >
        <h3 className="font-bold text-xl text-[var(--color-on-background)] group-hover:text-[var(--color-primary)] transition-colors">{question}</h3>
        <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--color-primary)]' : 'text-slate-300'}`}>
          expand_more
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="p-8 pt-0 text-[var(--color-on-surface-variant)] leading-relaxed border-t border-slate-50">
          {answer}
          <div className="mt-6 flex items-center gap-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
            Czy to było pomocne?
            <button className="hover:text-emerald-500 transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">thumb_up</span> Tak
            </button>
            <button className="hover:text-red-500 transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">thumb_down</span> Nie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HelpPage() {
  const categories = [
    { title: 'Pierwsze kroki', icon: 'rocket_launch', count: 12 },
    { title: 'Przygotowanie palet', icon: 'inventory_2', count: 8 },
    { title: 'Płatności i faktury', icon: 'payments', count: 5 },
    { title: 'Reklamacje', icon: 'gavel', count: 4 },
  ];

  const faqs = [
    { q: 'Jak przygotować paletę do wysyłki?', a: 'Paleta powinna być stabilna, a towar nie powinien wystawać poza jej obrys. Zalecamy owinięcie całości folią stretch i zabezpieczenie taśmami spinającymi.' },
    { q: 'Czy muszę mieć własną paletę?', a: 'Tak, kurier przyjeżdża odebrać gotową, zapakowaną przesyłkę. Jeśli nie masz palety, możesz ją zakupić w punktach sprzedaży opakowań lub składach palet.' },
    { q: 'Kiedy kurier odbierze moją przesyłkę?', a: 'Większość zleceń złożonych do godziny 11:00 jest odbierana tego samego dnia roboczego. Dokładne godziny zależą od trasy kuriera w Twoim rejonie.' },
    { q: 'Jak otrzymać fakturę VAT?', a: 'Faktury są generowane automatycznie po opłaceniu zamówienia i przesyłane na podany adres e-mail oraz dostępne w panelu klienta.' },
  ];

  return (
    <main className="pt-24 pb-24 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Hero Search */}
        <div className="text-center mb-24 animate-fade-in">
          <h1 className="font-display-bold text-5xl font-bold text-[var(--color-on-background)] mb-6">W czym możemy pomóc?</h1>
          <p className="text-[var(--color-on-surface-variant)] text-xl mb-12">Przeszukaj bazę wiedzy lub wybierz kategorię poniżej.</p>
          
          <div className="max-w-3xl mx-auto relative group">
            <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-2xl group-focus-within:text-[var(--color-primary)] transition-colors">search</span>
            <input 
              className="w-full pl-16 pr-8 py-6 rounded-3xl border border-[var(--color-divider)] shadow-lg focus:border-[var(--color-primary)] outline-none transition-premium text-lg bg-white" 
              placeholder="Wpisz słowa kluczowe, np. 'pakowanie', 'faktura'..." 
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {categories.map((c, i) => (
            <div key={i} className="bg-white p-10 rounded-[40px] border border-[var(--color-divider)] shadow-sm hover:shadow-xl transition-premium hover:-translate-y-2 group cursor-pointer text-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-container-low)] text-[var(--color-primary)] flex items-center justify-center mx-auto mb-6 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-premium">
                <span className="material-symbols-outlined text-3xl">{c.icon}</span>
              </div>
              <h3 className="font-bold text-lg mb-2">{c.title}</h3>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">{c.count} artykułów</div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Najczęściej zadawane pytania</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <HelpFaqItem key={f.q} question={f.q} answer={f.a} />
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-32 bg-[var(--color-primary)] rounded-[50px] p-20 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-[0.03] pointer-events-none"></div>
          <h2 className="text-4xl font-bold mb-6">Nadal masz wątpliwości?</h2>
          <p className="text-xl opacity-80 mb-12 max-w-2xl mx-auto">Nasz zespół wsparcia technicznego i logistycznego jest do Twojej dyspozycji. Średni czas odpowiedzi to mniej niż 2 godziny.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-white text-[var(--color-primary)] px-12 py-5 rounded-2xl font-bold hover:bg-slate-100 transition-premium shadow-xl active:scale-95">Zadzwoń do nas</button>
            <button className="bg-transparent border-2 border-white/30 text-white px-12 py-5 rounded-2xl font-bold hover:bg-white/10 transition-premium active:scale-95">Wyślij e-mail</button>
          </div>
        </div>
      </div>
    </main>
  );
}
