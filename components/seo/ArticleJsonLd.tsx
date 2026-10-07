import Script from 'next/script';

interface ArticleJsonLdProps {
  headline: string;
  description: string;
  image: string | string[];
  datePublished: string;
  dateModified?: string;
  authorName: string;
  canonicalUrl: string;
}

export function ArticleJsonLd({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  canonicalUrl,
}: ArticleJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image: Array.isArray(image) ? image : [image],
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: { '@type': 'Person', name: authorName },
    publisher: {
      '@type': 'Organization',
      name: 'Money Wise',
      url: baseUrl,
      logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
      parentOrganization: { '@type': 'Organization', name: 'Cowrywise', url: 'https://cowrywise.com' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  };

  return (
    <Script
      id={`article-json-ld-${canonicalUrl}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}