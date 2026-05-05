'use client';

import * as React from 'react';
import { useToastStore } from '@/lib/store/toast-store';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function Toaster() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const Icon = toast.type === 'success' ? CheckCircle : toast.type === 'error' ? AlertCircle : Info;
        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg bg-[var(--color-surface)] animate-in slide-in-from-bottom-5",
              toast.type === 'error' && "border-[var(--color-error)]",
              toast.type === 'success' && "border-[var(--color-success)]",
              (!toast.type || toast.type === 'info') && "border-[var(--color-outline-variant)]"
            )}
          >
            <Icon className={cn(
              "h-5 w-5 shrink-0 mt-0.5",
              toast.type === 'error' ? "text-[var(--color-error)]" : 
              toast.type === 'success' ? "text-[var(--color-success)]" : 
              "text-[var(--color-primary)]"
            )} />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-[var(--color-on-background)]">{toast.title}</h4>
              {toast.description && <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{toast.description}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[var(--color-outline)] hover:text-[var(--color-on-background)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
