'use client';

import * as React from 'react';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { LegalClient } from '@/components/layout/legal-client';

export default function TermsPage() {
  const { t } = useTranslation();
  
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <LegalClient 
        title={t.legal.terms.title}
        lastUpdated={t.legal.terms.lastUpdated}
        sections={t.legal.terms.sections}
      />
    </main>
  );
}
