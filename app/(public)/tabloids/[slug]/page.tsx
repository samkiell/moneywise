import Link from "next/link";
import { publicationService } from "@/lib/services/publication.service";
import { formatDate } from "@/lib/utils";
import { sanitizeContent } from "@/lib/sanitize";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const publication = await publicationService.getBySlug(slug);
    if (!publication) return { title: "Publication Not Found" };
    return {
      title: `${publication.title} | Money Wise Tabloids`,
      description: publication.excerpt,
    };
  } catch {
    return { title: "Tabloid | Money Wise" };
  }
}

export default async function TabloidDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let publication = null;

  try {
    publication = await publicationService.getBySlug(slug);
  } catch (err) {
    console.warn("Error fetching tabloid:", err);
  }

  if (!publication) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-neutral-main">Tabloid Not Found</h1>
        <p className="text-neutral-secondary text-sm mt-3">
          The requested tabloid could not be found or has not been published yet.
        </p>
        <Link
          href="/tabloids"
          className="mt-6 inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Tabloids
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/tabloids"
        className="inline-flex items-center gap-2 text-sm text-neutral-secondary hover:text-primary mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Tabloids
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
  );
}
