import Link from "next/link";
import { publicationService } from "@/lib/services/publication.service";
import { IPublication } from "@/types";
import { formatDate } from "@/lib/utils";
import { Search as SearchIcon } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  let results: IPublication[] = [];

  if (query) {
    try {
      results = await publicationService.search(query);
    } catch (err) {
      console.warn("Search failed:", err);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="border-b border-neutral-border pb-8 mb-8">
        <span className="editorial-kicker">Archive Discovery</span>
        <h1 className="editorial-title text-3xl sm:text-4xl text-neutral-main mt-2">
          Search Publications
        </h1>
        <p className="text-neutral-secondary text-sm mt-2">
          Find stories, tabloids, authors, or topics across the Money Wise catalogue.
        </p>

        <form method="GET" action="/search" className="mt-6 flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by title, topic, author, or keywords..."
              className="w-full pl-10 pr-4 py-3 text-sm bg-surface border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-main"
            />
            <SearchIcon className="w-5 h-5 text-neutral-secondary absolute left-3 top-3.5" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 text-sm font-semibold text-white bg-primary hover:bg-brand-dark rounded transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {query ? (
        <div>
          <p className="text-xs text-neutral-secondary mb-6">
            Showing results for <span className="font-semibold text-neutral-main">&ldquo;{query}&rdquo;</span> ({results.length} found)
          </p>

          {results.length === 0 ? (
            <div className="border border-neutral-border bg-surface rounded-lg p-12 text-center text-sm text-neutral-secondary">
              No publications matched your search query. Try broader keywords or browsing by category.
            </div>
          ) : (
            <div className="space-y-6">
              {results.map((item) => (
                <article
                  key={item._id}
                  className="p-6 bg-surface border border-neutral-border rounded-lg flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {item.type} &bull; {item.category}
                    </span>
                    <h2 className="font-serif text-xl font-bold text-neutral-main mt-2 hover:text-primary">
                      <Link href={`/${item.type === "story" ? "stories" : "tabloids"}/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h2>
                    <p className="text-sm text-neutral-secondary mt-2 line-clamp-2">
                      {item.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-neutral-border text-xs text-neutral-secondary flex justify-between">
                    <span>By {item.author}</span>
                    <span>{formatDate(item.publishedAt)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-sm text-neutral-secondary">
          Enter a term above to search through published stories and tabloids.
        </div>
      )}
    </div>
  );
}
