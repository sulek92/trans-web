'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './button';
import { cn } from '../../lib/utils';

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (!mounted) return (
    <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)]/30 animate-pulse" />
  );

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "group relative w-10 h-10 flex items-center justify-center rounded-xl transition-premium overflow-hidden border border-[var(--color-divider)]/30",
        theme === 'dark' 
          ? "bg-[#1e293b] text-yellow-400 border-yellow-500/20 shadow-[0_0_15px_-5px_rgba(234,179,8,0.3)]" 
          : "bg-white text-slate-600 border-slate-200 hover:border-[var(--color-primary)]/30 shadow-sm"
      )}
      aria-label="Przełącz motyw"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Sun Icon */}
        <div className={cn(
          "absolute transition-all duration-500 transform",
          theme === 'light' ? "scale-110 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
        )}>
          <Sun className="w-5 h-5 fill-current" />
        </div>
        
        {/* Moon Icon */}
        <div className={cn(
          "absolute transition-all duration-500 transform",
          theme === 'dark' ? "scale-110 rotate-0 opacity-100" : "scale-50 rotate-90 opacity-0"
        )}>
          <Moon className="w-5 h-5 fill-current" />
        </div>
      </div>

      {/* Hover Effect Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
