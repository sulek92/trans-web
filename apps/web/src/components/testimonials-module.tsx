"use client";

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getApiBaseUrl } from '@/lib/api-url';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { cn } from '@/lib/utils';

type Testimonial = {
  id?: string;
  name: string;
  role: string;
  text: string;
  avatar: string;
  avatarImage: string;
  isActive?: boolean;
  sortOrder?: number;
};

type CmsManagedImageProps = {
  src?: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  imgClassName?: string;
};

const CmsManagedImage = React.memo(function CmsManagedImage({
  src,
  fallbackSrc,
  alt,
  className = '',
  imgClassName = '',
}: CmsManagedImageProps) {
  const [hasError, setHasError] = React.useState(false);
  const resolvedSrc = React.useMemo(() => {
    if (hasError) return fallbackSrc;
    return (src || '').trim() || fallbackSrc;
  }, [src, fallbackSrc, hasError]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        className={cn("object-cover", imgClassName)}
        onError={() => setHasError(true)}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
});

interface TestimonialsModuleProps {
  fallbackTestimonials?: Testimonial[];
}

export function TestimonialsModule({ fallbackTestimonials }: TestimonialsModuleProps) {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>(fallbackTestimonials || []);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/cms/testimonials`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setTestimonials(data.filter((t: Testimonial) => t.isActive !== false));
            return;
          }
        }
      } catch {
        // keep fallback
      }
      setTestimonials(fallbackTestimonials || []);
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  React.useEffect(() => {
    if (testimonials.length > 0) {
      setLoading(false);
    }
  }, [testimonials]);

  if (loading) {
    return (
      <section className="py-32 bg-[var(--color-surface-primary)] dark:bg-slate-900 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const totalTestimonials = testimonials.length;
  const nextTestimonial = () => setActiveIndex((prev) => (prev + 1) % totalTestimonials);
  const prevTestimonial = () => setActiveIndex((prev) => (prev - 1 + totalTestimonials) % totalTestimonials);

  return (
    <section className="py-32 bg-[var(--color-background)] overflow-hidden transition-colors duration-500">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12 text-left">
          <div className="max-w-2xl">
            <span className="text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase text-[11px] mb-6 block">{t.home.testimonialsLabel}</span>
            <h2 className="text-5xl lg:text-6xl font-bold text-[var(--color-on-background)] mb-8 tracking-tight">{t.home.testimonialsTitle}</h2>
            <p className="text-[var(--color-text-muted)] text-xl leading-relaxed opacity-80">{t.home.testimonialsDesc}</p>
          </div>
          <div className="flex gap-6">
            <button aria-label="Poprzednia opinia" onClick={prevTestimonial} className="w-16 h-16 rounded-[24px] border border-[var(--color-divider)] flex items-center justify-center bg-[var(--color-surface-primary)] text-[var(--color-on-background)] hover:bg-[var(--color-primary)] hover:text-white hover:border-transparent transition-premium active:scale-90 shadow-sm">
              <span className="material-symbols-outlined text-2xl">west</span>
            </button>
            <button aria-label="Następna opinia" onClick={nextTestimonial} className="w-16 h-16 rounded-[24px] border border-[var(--color-divider)] flex items-center justify-center bg-[var(--color-surface-primary)] text-[var(--color-on-background)] hover:bg-[var(--color-primary)] hover:text-white hover:border-transparent transition-premium active:scale-90 shadow-sm">
              <span className="material-symbols-outlined text-2xl">east</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-visible">
            <div
              className="flex transition-transform duration-1000 cubic-bezier(0.23, 1, 0.32, 1)"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                  viewport={{ once: true }}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-[var(--color-surface-secondary)] p-12 lg:p-24 rounded-[64px] border border-[var(--color-divider)] relative group overflow-hidden shadow-2xl text-left">
                    <div className="absolute top-0 right-0 p-16 text-[var(--color-primary)] opacity-[0.05] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
                      <span className="material-symbols-outlined text-[240px]">format_quote</span>
                    </div>
                    <div className="relative z-10">
                      <div className="flex gap-1.5 mb-12">
                        {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined text-amber-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                      </div>
                      <p className="text-3xl lg:text-5xl text-[var(--color-on-background)] font-bold leading-[1.2] mb-16 tracking-tight">&ldquo;{t.text}&rdquo;</p>
                      <div className="flex items-center gap-8">
                        {t.avatarImage ? (
                          <CmsManagedImage
                            src={t.avatarImage}
                            fallbackSrc="/images/avatars/client-1.webp"
                            alt={t.name}
                            className="w-20 h-20 rounded-[28px] overflow-hidden border-4 border-[var(--color-surface-primary)] shadow-2xl"
                            imgClassName="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-[28px] bg-[var(--color-primary-highlight)] flex items-center justify-center text-[var(--color-primary)] shadow-inner">
                            <span className="material-symbols-outlined text-4xl">{t.avatar}</span>
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-2xl tracking-tight text-[var(--color-on-background)]">{t.name}</div>
                          <div className="text-[11px] text-[var(--color-primary)] font-bold uppercase tracking-[0.2em] mt-2">{t.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots navigation */}
        <div className="flex justify-center gap-3 mt-16">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${i === activeIndex ? 'bg-[var(--color-primary)] w-8' : 'bg-[var(--color-divider)] hover:bg-[var(--color-text-faint)]'}`}
              aria-label={`Opinia ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
