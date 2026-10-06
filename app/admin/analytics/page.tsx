import { analyticsService } from "@/lib/services/analytics.service";
import { BarChart3, TrendingUp, Users, Eye, FileText, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  let dailyAggregates: Awaited<ReturnType<typeof analyticsService.getDailyAggregates>> = [];
  let topPages: Awaited<ReturnType<typeof analyticsService.getTopPages>> = [];
  let newsletterStats = { totalSubscribers: 0, recentSubscribers: 0 };

  try {
    const [aggregates, pages, newsletter] = await Promise.all([
      analyticsService.getDailyAggregates({ limit: 14 }),
      analyticsService.getTopPages(5),
      analyticsService.getNewsletterConversion(30),
    ]);
    dailyAggregates = aggregates;
    topPages = pages;
    newsletterStats = newsletter;
  } catch (err) {
    console.warn("Unable to fetch analytics aggregates:", err);
  }

  const totalPageViews = dailyAggregates.reduce((acc, curr) => acc + curr.totalViews, 0);
  const totalUniqueVisitors = dailyAggregates.reduce((acc, curr) => acc + curr.uniqueVisitors, 0);
  const totalPublicationViews = dailyAggregates.reduce((acc, curr) => acc + curr.publicationViews, 0);

  return (
    <div className="p-8 space-y-8 max-w-7xl">
      <div className="border-b border-neutral-border pb-6">
        <span className="editorial-kicker">First-Party Telemetry</span>
        <h1 className="font-serif text-3xl font-bold text-neutral-main mt-1">Analytics & Readership</h1>
        <p className="text-xs text-neutral-secondary mt-1">
          Privacy-conscious, self-hosted readership metrics aggregated server-side. No third-party trackers.
        </p>
      </div>

      {/* Aggregate metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-surface border border-neutral-border rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-secondary">
              Total Page Views (14d)
            </span>
            <Eye className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-3 font-serif text-3xl font-bold text-neutral-main">
            {totalPageViews}
          </div>
          <p className="text-[11px] text-neutral-secondary mt-1">Across all public routes</p>
        </div>

        <div className="p-6 bg-surface border border-neutral-border rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-secondary">
              Unique Visitors (14d)
            </span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-3 font-serif text-3xl font-bold text-neutral-main">
            {totalUniqueVisitors}
          </div>
          <p className="text-[11px] text-neutral-secondary mt-1">Anonymous hashed session identities</p>
        </div>

        <div className="p-6 bg-surface border border-neutral-border rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-secondary">
              Publication Reads
            </span>
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-3 font-serif text-3xl font-bold text-neutral-main">
            {totalPublicationViews}
          </div>
          <p className="text-[11px] text-neutral-secondary mt-1">Stories and Tabloids combined</p>
        </div>

        <div className="p-6 bg-surface border border-neutral-border rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-secondary">
              30-Day Subscriptions
            </span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-3 font-serif text-3xl font-bold text-neutral-main">
            {newsletterStats.recentSubscribers}
          </div>
          <p className="text-[11px] text-neutral-secondary mt-1">Total active: {newsletterStats.totalSubscribers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Top Pages */}
        <div className="bg-surface border border-neutral-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-primary" />
            <h2 className="font-serif text-lg font-bold text-neutral-main">Top Pages</h2>
          </div>
          {topPages.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-secondary">
              No page view records recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {topPages.map((page) => (
                <div key={page.path} className="flex justify-between items-center text-sm py-1.5 border-b border-neutral-border">
                  <span className="font-mono text-xs text-neutral-main">{page.path}</span>
                  <span className="font-semibold text-neutral-secondary">{page.views} views</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Daily Trend Aggregates */}
        <div className="bg-surface border border-neutral-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h2 className="font-serif text-lg font-bold text-neutral-main">Daily Aggregate History</h2>
          </div>
          {dailyAggregates.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-secondary">
              No aggregate rollups computed yet. Daily aggregates run via server-side routines.
            </div>
          ) : (
            <div className="space-y-3">
              {dailyAggregates.slice(0, 5).map((row) => (
                <div key={row.date} className="flex justify-between items-center text-xs py-1.5 border-b border-neutral-border">
                  <span className="font-mono text-neutral-main">{row.date}</span>
                  <div className="flex gap-4 text-neutral-secondary">
                    <span>{row.totalViews} views</span>
                    <span>{row.uniqueVisitors} visitors</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
