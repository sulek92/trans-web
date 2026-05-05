import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex items-start gap-3">
        <div className="flex items-center h-5 mt-0.5 relative">
          <input
            id={checkboxId}
            type="checkbox"
            className={cn(
              "peer appearance-none h-4 w-4 shrink-0 rounded border border-[var(--color-outline-variant)] bg-[var(--color-surface)] checked:bg-[var(--color-primary)] checked:border-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
              error && "border-[var(--color-error)]",
              className
            )}
            ref={ref}
            {...props}
          />
          <Check className="h-3 w-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  "text-sm font-medium leading-none cursor-pointer text-[var(--color-on-background)]",
                  props.disabled && "cursor-not-allowed opacity-50"
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className={cn(
                "text-sm text-[var(--color-on-surface-variant)] mt-1.5",
                props.disabled && "opacity-50"
              )}>
                {description}
              </p>
            )}
            {error && <span className="text-xs text-[var(--color-error)] mt-1 inline-block">{error}</span>}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
