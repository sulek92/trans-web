import { getApiBaseUrl } from '@/lib/api-url';

export async function getCmsContent<T = Record<string, unknown>>(slug: string): Promise<T | null> {
  const apiUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${apiUrl}/cms/pages/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.content) return null;
    return typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
  } catch {
    return null;
  }
}

export interface CmsPageRecord {
  slug: string;
  title: string;
  content: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isPublished: boolean;
}

export async function getCmsPageRecord(slug: string): Promise<CmsPageRecord | null> {
  const apiUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${apiUrl}/cms/pages/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
