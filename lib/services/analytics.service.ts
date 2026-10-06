import { connectDB } from "@/lib/db/mongodb";
import { AnalyticsEvent } from "@/models/AnalyticsEvent";
import { AnalyticsDaily } from "@/models/AnalyticsDaily";
import { Subscriber } from "@/models/Subscriber";
import { Publication } from "@/models/Publication";
import { IAnalyticsDaily } from "@/types";

export interface AnalyticsQueryOptions {
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export interface PublicationMetrics {
  views: number;
  uniqueVisitors: number;
}

export interface NewsletterConversionMetrics {
  totalSubscribers: number;
  recentSubscribers: number;
}

export interface TopPageMetric {
  path: string;
  views: number;
}

export const analyticsService = {
  async recordEvent(data: {
    eventName: string;
    pathname: string;
    anonymousId?: string;
    sessionId?: string;
    publicationId?: string;
    referrer?: string;
    deviceCategory?: string;
    browser?: string;
    os?: string;
    country?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    if (!process.env.MONGODB_URI) return;
    await connectDB();
    await AnalyticsEvent.create({
      ...data,
      timestamp: new Date(),
    });
  },

  async getDailyAggregates(options: AnalyticsQueryOptions = {}): Promise<IAnalyticsDaily[]> {
    if (!process.env.MONGODB_URI) return [];
    await connectDB();
    const query: Record<string, unknown> = {};

    if (options.startDate || options.endDate) {
      query.date = {};
      if (options.startDate) {
        (query.date as Record<string, string>).$gte = options.startDate;
      }
      if (options.endDate) {
        (query.date as Record<string, string>).$lte = options.endDate;
      }
    }

    const docs = await AnalyticsDaily.find(query)
      .sort({ date: -1 })
      .limit(options.limit || 30)
      .lean();

    return docs.map((doc) => ({
      _id: doc._id.toString(),
      date: doc.date,
      totalViews: doc.totalViews,
      uniqueVisitors: doc.uniqueVisitors,
      publicationViews: doc.publicationViews,
      storyViews: doc.storyViews,
      tabloidViews: doc.tabloidViews,
      newsletterSubscribers: doc.newsletterSubscribers,
      topPages: doc.topPages || [],
      topPublications: doc.topPublications || [],
    }));
  },

  async getPublicationPerformance(publicationId: string): Promise<PublicationMetrics> {
    if (!process.env.MONGODB_URI) return { views: 0, uniqueVisitors: 0 };
    await connectDB();

    const [views, uniqueVisitors] = await Promise.all([
      AnalyticsEvent.countDocuments({
        eventName: "publication_view",
        publicationId,
      }),
      AnalyticsEvent.distinct("anonymousId", {
        eventName: "publication_view",
        publicationId,
      }).then((visitors) => visitors.length),
    ]);

    return { views, uniqueVisitors };
  },

  async getNewsletterConversion(days: number = 30): Promise<NewsletterConversionMetrics> {
    if (!process.env.MONGODB_URI) return { totalSubscribers: 0, recentSubscribers: 0 };
    await connectDB();

    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const [totalSubscribers, recentSubscribers] = await Promise.all([
      Subscriber.countDocuments({ status: "active" }),
      Subscriber.countDocuments({
        status: "active",
        subscribedAt: { $gte: sinceDate },
      }),
    ]);

    return { totalSubscribers, recentSubscribers };
  },

  async getTopPages(limit: number = 10): Promise<TopPageMetric[]> {
    if (!process.env.MONGODB_URI) return [];
    await connectDB();

    const results = await AnalyticsEvent.aggregate([
      { $match: { eventName: "page_view" } },
      { $group: { _id: "$pathname", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: limit },
    ]);

    return results.map((r) => ({
      path: r._id,
      views: r.views,
    }));
  },

  /**
   * Computes and upserts the AnalyticsDaily document for a UTC date (YYYY-MM-DD)
   * from raw events.
   */
  async aggregateDay(date: string): Promise<void> {
    if (!process.env.MONGODB_URI) return;
    await connectDB();

    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    const range = { timestamp: { $gte: start, $lt: end } };

    const [
      totalViews,
      visitors,
      publicationViews,
      storyViews,
      tabloidViews,
      newsletterSubscribers,
      topPagesRaw,
      topPubsRaw,
    ] = await Promise.all([
      AnalyticsEvent.countDocuments({ ...range, eventName: "page_view" }),
      AnalyticsEvent.distinct("anonymousId", { ...range, eventName: "page_view", anonymousId: { $ne: "" } }),
      AnalyticsEvent.countDocuments({ ...range, eventName: "publication_view" }),
      AnalyticsEvent.countDocuments({ ...range, eventName: "publication_view", pathname: /^\/stories\// }),
      AnalyticsEvent.countDocuments({ ...range, eventName: "publication_view", pathname: /^\/tabloids\// }),
      AnalyticsEvent.countDocuments({ ...range, eventName: "newsletter_subscribe" }),
      AnalyticsEvent.aggregate([
        { $match: { ...range, eventName: "page_view" } },
        { $group: { _id: "$pathname", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 5 },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { ...range, eventName: "publication_view", publicationId: { $ne: null } } },
        { $group: { _id: "$publicationId", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const pubIds = topPubsRaw.map((p) => String(p._id));
    const pubs = pubIds.length
      ? await Publication.find({ _id: { $in: pubIds } }).select("title").lean()
      : [];
    const titles = new Map(pubs.map((p) => [String(p._id), p.title]));

    await AnalyticsDaily.findOneAndUpdate(
      { date },
      {
        date,
        totalViews,
        uniqueVisitors: visitors.length,
        publicationViews,
        storyViews,
        tabloidViews,
        newsletterSubscribers,
        topPages: topPagesRaw.map((p) => ({ path: String(p._id), views: p.views })),
        topPublications: topPubsRaw
          .filter((p) => titles.has(String(p._id)))
          .map((p) => ({
            publicationId: String(p._id),
            title: titles.get(String(p._id)) as string,
            views: p.views,
          })),
      },
      { upsert: true }
    );
  },

  /**
   * Ensures the last `days` UTC days have aggregates: backfills missing days
   * and always refreshes today. Cheap enough for V1 admin page loads.
   */
  async ensureAggregates(days: number = 14): Promise<void> {
    if (!process.env.MONGODB_URI) return;
    await connectDB();

    const dates: string[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }

    const existing = new Set(
      (await AnalyticsDaily.find({ date: { $in: dates } }).select("date").lean()).map((d) => d.date)
    );

    const today = dates[0];
    for (const date of dates) {
      if (date === today || !existing.has(date)) {
        await this.aggregateDay(date);
      }
    }
  },
};
