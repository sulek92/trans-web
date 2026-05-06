import { MetadataRoute } from 'next';
import { getApiBaseUrl } from '@/lib/api-url';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://paletbroker.pl';
  const apiUrl = getApiBaseUrl();
  
  let dynamicPages: MetadataRoute.Sitemap = [];
  
  try {
    const res = await fetch(`${apiUrl}/cms/pages`, { 
      next: { revalidate: 3600 } 
    });
    
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        dynamicPages = data
          .filter((p: any) => p.slug && p.slug !== 'home')
          .map((p: any) => ({
            url: `${baseUrl}/${p.slug}`,
            lastModified: new Date(p.updatedAt || new Date()),
            changeFrequency: 'monthly',
            priority: 0.7,
          }));
      }
    }
  } catch (error) {
    // Fallback to minimal dynamic pages if API is down
    dynamicPages = [
      {
        url: `${baseUrl}/polityka-prywatnosci`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/regulamin`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/kontakt`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
    ];
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/wycena`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sledzenie`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  let dynamicArticles: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiUrl}/cms/articles?public=true`, { 
      next: { revalidate: 3600 } 
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        dynamicArticles = data.map((a: any) => ({
          url: `${baseUrl}/blog/${a.slug}`,
          lastModified: new Date(a.updatedAt || a.publishedAt || new Date()),
          changeFrequency: 'monthly',
          priority: 0.6,
        }));
      }
    }
  } catch (e) {
    // ignore
  }

  return [...staticPages, ...dynamicPages, ...dynamicArticles];
}
