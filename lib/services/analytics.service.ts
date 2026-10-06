import { connectDB } from "@/lib/db/mongodb";
import { AnalyticsEvent } from "@/models/AnalyticsEvent";
import { AnalyticsDaily } from "@/models/AnalyticsDaily";
import { Subscriber } from "@/models/Subscriber";
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
};
