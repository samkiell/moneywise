import mongoose, { Schema, Model, Document } from "mongoose";
import { ISubscriber } from "@/types";

export interface ISubscriberDocument extends Omit<ISubscriber, "_id">, Document {}

const SubscriberSchema = new Schema<ISubscriberDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: "", trim: true },
    status: { type: String, enum: ["active", "unsubscribed"], default: "active", required: true },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

SubscriberSchema.index({ status: 1 });

export const Subscriber: Model<ISubscriberDocument> =
  mongoose.models.Subscriber || mongoose.model<ISubscriberDocument>("Subscriber", SubscriberSchema);
