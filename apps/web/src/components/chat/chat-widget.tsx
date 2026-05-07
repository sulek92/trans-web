'use client';

import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    { id: 1, text: 'Witaj w PaletBroker! W czym mogę Ci dzisiaj pomóc?', sender: 'agent', time: '10:00' }
  ]);
  const [inputValue, setInputValue] = React.useState('');
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMsg = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => {
      const updated = [...prev, newMsg];
      return updated.length > 200 ? updated.slice(-200) : updated;
    });
    setInputValue('');

    timerRef.current = setTimeout(() => {
      setMessages((prev) => {
        const updated = [...prev, {
          id: Date.now() + 1,
          text: 'Dziękujemy za wiadomość. Nasz konsultant odezwie się w ciągu kilku minut.',
          sender: 'agent',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
        return updated.length > 200 ? updated.slice(-200) : updated;
      });
    }, 1500);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[1000] flex flex-col items-end">
      {isOpen && (
        <div className="w-[380px] h-[550px] bg-white rounded-[32px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="bg-[#1e293b] p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center font-bold">PB</div>
              <div>
                <div className="font-bold text-sm">Wsparcie PaletBroker</div>
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="material-symbols-outlined hover:bg-white/10 p-2 rounded-full transition-colors">close</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex flex-col", m.sender === 'user' ? "items-end" : "items-start")}>
                <div className={cn(
                  "max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm",
                  m.sender === 'user' ? "bg-[var(--color-primary)] text-white rounded-tr-none" : "bg-white text-slate-700 rounded-tl-none"
                )}>
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 font-bold">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Napisz wiadomość..."
              className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
            <button 
              onClick={handleSend}
              className="w-10 h-10 bg-[var(--color-primary)] text-white rounded-xl flex items-center justify-center hover:brightness-110 transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95",
          isOpen ? "bg-slate-800 text-white rotate-90" : "bg-[var(--color-primary)] text-white"
        )}
      >
        <span className="material-symbols-outlined text-[32px]">{isOpen ? 'close' : 'chat_bubble'}</span>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold">1</span>
        )}
      </button>
    </div>
  );
}
