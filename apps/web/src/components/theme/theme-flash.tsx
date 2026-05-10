'use client';

import * as React from 'react';

export function ThemeFlash() {
  React.useLayoutEffect(() => {
    try {
      const t = localStorage.getItem('theme');
      if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme:dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      console.error('Failed to init theme:', e);
    }
  }, []);

  return null;
}
