import mongoose, { Schema, Model, Document } from "mongoose";
import { IAnalyticsDaily } from "@/types";

export interface IAnalyticsDailyDocument extends Omit<IAnalyticsDaily, "_id">, Document {}

const AnalyticsDailySchema = new Schema<IAnalyticsDailyDocument>(
  {
    date: { type: String, required: true, unique: true, index: true }, // Format: YYYY-MM-DD
    totalViews: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    publicationViews: { type: Number, default: 0 },
    storyViews: { type: Number, default: 0 },
    tabloidViews: { type: Number, default: 0 },
    newsletterSubscribers: { type: Number, default: 0 },
    topPages: [
      {
        path: { type: String, required: true },
        views: { type: Number, default: 0 },
      },
    ],
    topPublications: [
      {
        publicationId: { type: String, required: true },
        title: { type: String, required: true },
        views: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

AnalyticsDailySchema.index({ date: -1 }, { unique: true });

export const AnalyticsDaily: Model<IAnalyticsDailyDocument> =
  mongoose.models.AnalyticsDaily ||
  mongoose.model<IAnalyticsDailyDocument>("AnalyticsDaily", AnalyticsDailySchema);
