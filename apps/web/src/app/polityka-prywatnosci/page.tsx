'use client';

import * as React from 'react';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { LegalClient } from '@/components/layout/legal-client';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <LegalClient 
        title={t.legal.privacy.title}
        lastUpdated={t.legal.privacy.lastUpdated}
        sections={t.legal.privacy.sections}
      />
    </main>
  );
}
