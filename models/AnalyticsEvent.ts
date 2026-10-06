import mongoose, { Schema, Model, Document } from "mongoose";
import { IAnalyticsEvent } from "@/types";

export interface IAnalyticsEventDocument extends Omit<IAnalyticsEvent, "_id">, Document {}

const AnalyticsEventSchema = new Schema<IAnalyticsEventDocument>(
  {
    eventName: { type: String, required: true, trim: true },
    anonymousId: { type: String, default: "", trim: true },
    sessionId: { type: String, default: "", trim: true },
    pathname: { type: String, required: true, trim: true },
    publicationId: { type: String, default: null, trim: true },
    referrer: { type: String, default: "", trim: true },
    deviceCategory: { type: String, default: "desktop", trim: true },
    browser: { type: String, default: "", trim: true },
    os: { type: String, default: "", trim: true },
    country: { type: String, default: "", trim: true },
    timestamp: { type: Date, default: Date.now, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: false,
  }
);

// Indexes defined in DOCS.md
AnalyticsEventSchema.index({ timestamp: -1 });
AnalyticsEventSchema.index({ eventName: 1 });
AnalyticsEventSchema.index({ publicationId: 1 });

// Query optimization compound indexes
AnalyticsEventSchema.index({ eventName: 1, timestamp: -1 });
AnalyticsEventSchema.index({ publicationId: 1, timestamp: -1 });
AnalyticsEventSchema.index({ pathname: 1, timestamp: -1 });

export const AnalyticsEvent: Model<IAnalyticsEventDocument> =
  mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEventDocument>("AnalyticsEvent", AnalyticsEventSchema);
