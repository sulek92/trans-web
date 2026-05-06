'use client';

import * as React from 'react';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { getCmsContent } from '@/lib/cms';
import { LegalClient } from '@/components/layout/legal-client';

interface CmsLegalSection {
  title?: string;
  content?: string;
}

interface CmsLegalContent {
  lastUpdated?: string;
  sections?: CmsLegalSection[];
}

function normalizeSections(
  sections: CmsLegalSection[] | undefined,
  fallback: { title: string; content: string }[],
) {
  if (!Array.isArray(sections)) return fallback;
  const normalized = sections
    .map((section) => ({
      title: typeof section.title === 'string' ? section.title.trim() : '',
      content: typeof section.content === 'string' ? section.content.trim() : '',
    }))
    .filter((section) => section.title.length > 0 && section.content.length > 0);

  return normalized.length > 0 ? normalized : fallback;
}

export default function PrivacyPolicyPage() {
  const { t, locale } = useTranslation();
  const fallback = React.useMemo(
    () => ({
      title: t.legal.privacy.title,
      lastUpdated: t.legal.privacy.lastUpdated,
      sections: t.legal.privacy.sections,
    }),
    [t],
  );
  const [cmsData, setCmsData] = React.useState<CmsLegalContent | null>(null);

  React.useEffect(() => {
    if (locale !== 'pl') return;
    let isActive = true;

    void (async () => {
      const cms = await getCmsContent<CmsLegalContent>('polityka-prywatnosci');
      if (!isActive || !cms) return;
      setCmsData(cms);
    })();

    return () => {
      isActive = false;
    };
  }, [locale]);

  const data = React.useMemo(() => {
    if (locale !== 'pl' || !cmsData) return fallback;

    const lastUpdated =
      typeof cmsData.lastUpdated === 'string' && cmsData.lastUpdated.trim().length > 0
        ? cmsData.lastUpdated.trim()
        : fallback.lastUpdated;

    return {
      title: fallback.title,
      lastUpdated,
      sections: normalizeSections(cmsData.sections, fallback.sections),
    };
  }, [cmsData, fallback, locale]);

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <LegalClient 
        title={data.title}
        lastUpdated={data.lastUpdated}
        sections={data.sections}
      />
    </main>
  );
}
