import Link from "next/link";
import { ArrowRight, BookOpen, Newspaper, Sparkles, Compass } from "lucide-react";

export default function HomePage() {
  const pillars = [
    { name: "Financial Literacy", desc: "Building sustainable wealth habits and understanding markets." },
    { name: "Career Development", desc: "Navigating early professional paths and growth." },
    { name: "Digital Literacy", desc: "Harnessing technology, tools, and digital ecosystems." },
    { name: "Entrepreneurial Development", desc: "From concept ideation to sustainable venture building." },
    { name: "Quality Connections", desc: "Cultivating purposeful community and mentorship networks." },
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface border border-neutral-border p-8 md:p-14 rounded-lg shadow-sm">
          <div className="max-w-3xl">
            <span className="editorial-kicker">Money Wise Magazine</span>
            <h1 className="editorial-title text-4xl sm:text-5xl md:text-6xl text-neutral-main mt-4">
              We write to inform. <br />
              <span className="text-primary">We create to inspire.</span> <br />
              We publish to empower.
            </h1>
            <p className="mt-6 text-lg text-neutral-secondary leading-relaxed max-w-2xl">
              The official publication of the Writing Team of the OAU Cowrywise Community. Unpacking financial concepts, student experiences, essays, and career narratives.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/stories"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary hover:bg-brand-dark rounded transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Read Stories
              </Link>
              <Link
                href="/tabloids"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-neutral-main bg-white border border-neutral-border hover:bg-slate-50 rounded transition-colors"
              >
                <Newspaper className="w-4 h-4" />
                Explore Tabloids
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured & Latest Publications Architectural Placeholder Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-neutral-border pb-4 mb-8">
          <div>
            <span className="editorial-kicker">Editorial Focus</span>
            <h2 className="font-serif text-2xl font-bold text-neutral-main mt-1">Recent Publications</h2>
          </div>
          <Link href="/stories" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            Browse Archive <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-neutral-border bg-surface p-8 rounded-lg flex flex-col justify-between">
            <div>
              <span className="inline-block px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-blue-50 text-primary rounded mb-3">
                Stories
              </span>
              <h3 className="font-serif text-xl font-bold text-neutral-main">Creative & Narrative Pieces</h3>
              <p className="mt-2 text-sm text-neutral-secondary">
                Spotlights, personal essays, reflections, and student perspectives from across the Cowrywise community.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-border">
              <Link href="/stories" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
                View all Stories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="border border-neutral-border bg-surface p-8 rounded-lg flex flex-col justify-between">
            <div>
              <span className="inline-block px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 rounded mb-3">
                Tabloids
              </span>
              <h3 className="font-serif text-xl font-bold text-neutral-main">Educational & Fact-Based Analysis</h3>
              <p className="mt-2 text-sm text-neutral-secondary">
                Structured analyses on savings, digital economy, career paths, and financial decisions.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-border">
              <Link href="/tabloids" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
                View all Tabloids <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Community Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-neutral-border pt-12">
          <div className="max-w-2xl mb-8">
            <span className="editorial-kicker">Guiding Principles</span>
            <h2 className="font-serif text-3xl font-bold text-neutral-main mt-1">Five Community Pillars</h2>
            <p className="text-neutral-secondary text-sm mt-2">
              Every issue and article aligns with the core educational values of the OAU Cowrywise Community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, idx) => (
              <div key={pillar.name} className="p-6 bg-surface border border-neutral-border rounded-lg">
                <div className="text-xs font-mono text-primary font-bold">0{idx + 1}</div>
                <h3 className="font-semibold text-neutral-main text-base mt-2">{pillar.name}</h3>
                <p className="text-xs text-neutral-secondary mt-1.5 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
            <div className="p-6 bg-primary text-white rounded-lg flex flex-col justify-between">
              <div>
                <Sparkles className="w-6 h-6 text-brand-yellow mb-2" />
                <h3 className="font-semibold text-base">Meet Our Team</h3>
                <p className="text-xs text-blue-100 mt-1">
                  Discover the writers and editors stewarding Money Wise publications.
                </p>
              </div>
              <Link href="/team" className="mt-4 text-xs font-semibold inline-flex items-center gap-1 text-white hover:underline">
                Meet the Team <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-surface border border-neutral-border p-8 md:p-12 rounded-lg text-center max-w-3xl mx-auto">
          <Compass className="w-8 h-8 text-primary mx-auto mb-3" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-main">
            Stay Updated with Money Wise
          </h2>
          <p className="text-sm text-neutral-secondary mt-2 max-w-md mx-auto">
            Get curated editions, student writing highlights, and financial guides directly in your inbox.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/newsletter"
              className="px-6 py-3 text-sm font-semibold text-white bg-primary hover:bg-brand-dark rounded transition-colors"
            >
              Subscribe to Newsletter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
