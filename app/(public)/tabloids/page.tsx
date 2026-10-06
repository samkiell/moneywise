import Link from "next/link";
import { publicationService } from "@/lib/services/publication.service";
import { IPublication } from "@/types";
import { formatDate } from "@/lib/utils";
import { Newspaper } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TabloidsPage() {
  let tabloids: IPublication[] = [];

  try {
    const res = await publicationService.getPublished({ type: "tabloid" });
    tabloids = res.publications;
  } catch (error) {
    console.warn("Unable to fetch tabloids:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-neutral-border pb-6 mb-10">
        <span className="editorial-kicker">Publications</span>
        <h1 className="editorial-title text-4xl text-neutral-main mt-2">Tabloids</h1>
        <p className="text-neutral-secondary text-base mt-2 max-w-2xl">
          Fact-based analysis, practical guides, financial insights, digital literacy, and community investigative reporting.
        </p>
      </div>

      {tabloids.length === 0 ? (
        <div className="border border-neutral-border bg-surface rounded-lg p-12 text-center max-w-md mx-auto my-8">
          <Newspaper className="w-10 h-10 text-neutral-secondary mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-lg font-bold text-neutral-main">No tabloids published yet</h3>
          <p className="text-xs text-neutral-secondary mt-2">
            The editorial desk is currently preparing the inaugural issues. Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tabloids.map((tabloid) => (
            <article key={tabloid._id} className="border border-neutral-border bg-surface p-6 rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {tabloid.category}
                </span>
                <h2 className="font-serif text-xl font-bold text-neutral-main mt-3 hover:text-primary transition-colors">
                  <Link href={`/tabloids/${tabloid.slug}`}>{tabloid.title}</Link>
                </h2>
                <p className="text-sm text-neutral-secondary mt-2 line-clamp-3">
                  {tabloid.excerpt}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-border text-xs text-neutral-secondary flex justify-between items-center">
                <span>By {tabloid.author}</span>
                <span>{formatDate(tabloid.publishedAt)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
