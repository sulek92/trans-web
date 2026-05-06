const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function getCmsContent<T = Record<string, unknown>>(slug: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}/cms/pages/${slug}`, {
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
