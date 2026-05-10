import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api-url';
import { ArticleClient } from './article-client';

async function getArticle(slug: string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/cms/articles/${slug}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) return {};

  return {
    title: article.metaTitle || `${article.title} | Blog PaletyBroker`,
    description: article.metaDescription || article.excerpt,
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      images: ['/og-image.png'],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return <ArticleClient article={article} />;
}
