import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, asChild = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const variants = {
      primary: 'bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-surface-tint)] active:bg-[var(--color-primary-container)]',
      secondary: 'bg-[var(--color-surface-container-low)] text-[var(--color-on-background)] hover:bg-[var(--color-surface-container-highest)]',
      ghost: 'bg-transparent text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] text-[var(--color-on-background)]',
      destructive: 'bg-[var(--color-error)] text-[var(--color-on-error)] hover:bg-[#991b1b]',
    };
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-12 px-6 text-lg',
    };

    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={!asChild ? isLoading || disabled : undefined}
        aria-disabled={asChild && (isLoading || disabled) ? true : undefined}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';
