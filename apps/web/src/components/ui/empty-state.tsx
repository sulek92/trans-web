import * as React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface-2)]", className)} {...props}>
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-offset)] text-[var(--color-primary)]">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold font-display text-[var(--color-on-background)]">{title}</h3>
      {description && <p className="mb-6 max-w-sm text-sm text-[var(--color-on-surface-variant)]">{description}</p>}
      {action}
    </div>
  );
}
