import { cookies } from 'next/headers';
import { CennikClient } from './cennik-client';
import { getApiBaseUrl } from '@/lib/api-url';

async function fetchServerSide(url: string) {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
    const res = await fetch(url, {
      headers: { Cookie: allCookies },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function CennikPage() {
  const apiUrl = getApiBaseUrl();
  const [pricingRules, cmsPage] = await Promise.all([
    fetchServerSide(`${apiUrl}/admin/pricing-rules`),
    fetchServerSide(`${apiUrl}/cms/pages/cennik`),
  ]);

  const rules = Array.isArray(pricingRules) ? pricingRules : [];
  let cmsData = null;
  if (cmsPage?.content) {
    try {
      cmsData = JSON.parse(cmsPage.content);
    } catch { /* ignore */ }
  }

  return <CennikClient initialRules={rules} initialCmsData={cmsData} />;
}
