import Link from "next/link";
import { publicationService } from "@/lib/services/publication.service";
import { formatDate } from "@/lib/utils";
import { sanitizeContent } from "@/lib/sanitize";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import type { Metadata } from "next";
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd';

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const publication = await publicationService.getBySlug(slug);
    if (!publication) return { title: "Publication Not Found" };

    const canonical = `${process.env.NEXT_PUBLIC_APP_URL}/stories/${slug}`;

    return {
      title: `${publication.title} | Money Wise Stories`,
      description: publication.excerpt,
      alternates: { canonical },
      openGraph: {
        title: publication.title,
        description: publication.excerpt,
        url: canonical,
        type: 'article',
        publishedTime: publication.publishedAt ? new Date(publication.publishedAt).toISOString() : undefined,
        // Uncomment the line below if your publication object includes a cover image URL
        // images: publication.coverImageUrl ? [{ url: publication.coverImageUrl }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: publication.title,
        description: publication.excerpt,
        // Uncomment the line below if your publication object includes a cover image URL
        // images: publication.coverImageUrl ? [publication.coverImageUrl] : undefined,
      },
    };
  } catch {
    return { title: "Story | Money Wise" };
  }
}

export default async function StoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let publication = null;

  try {
    publication = await publicationService.getBySlug(slug);
  } catch (err) {
    console.warn("Error fetching publication:", err);
  }

  if (!publication) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-neutral-main">Story Not Found</h1>
        <p className="text-neutral-secondary text-sm mt-3">
          The requested publication could not be found or has not been published yet.
        </p>
        <Link
          href="/stories"
          className="mt-6 inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Stories
        </Link>
      </div>
    );
  }

  return (
    <>
      <ArticleJsonLd
        headline={publication.title}
        description={publication.excerpt ?? publication.title}
        image={publication.coverImage ?? ''} 
        datePublished={new Date(publication.publishedAt || Date.now()).toISOString()}
        authorName={publication.author}
        canonicalUrl={`${process.env.NEXT_PUBLIC_APP_URL}/stories/${slug}`}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/stories"
          className="inline-flex items-center gap-2 text-sm text-neutral-secondary hover:text-primary mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Stories
        </Link>

        <header className="border-b border-neutral-border pb-8">
          <span className="editorial-kicker">{publication.category}</span>
          <h1 className="editorial-title text-3xl sm:text-4xl md:text-5xl text-neutral-main mt-3">
            {publication.title}
          </h1>
          <p className="text-lg text-neutral-secondary mt-4 leading-relaxed font-serif italic">
            {publication.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-6 text-xs text-neutral-secondary">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-primary" />
              <span>{publication.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{formatDate(publication.publishedAt)}</span>
            </div>
            {publication.readingTime && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                <span>{publication.readingTime} min read</span>
              </div>
            )}
          </div>
        </header>

        <div className="prose prose-slate max-w-none mt-10 py-4 font-serif text-base leading-relaxed text-neutral-main">
          <div dangerouslySetInnerHTML={{ __html: sanitizeContent(publication.content) }} />
        </div>
      </article>
    </>
  );
}