import mongoose, { Schema, Model, Document } from "mongoose";
import { INewsletter } from "@/types";

export interface INewsletterDocument extends Omit<INewsletter, "_id">, Document {}

const NewsletterSchema = new Schema<INewsletterDocument>(
  {
    subject: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: "", trim: true },
    status: { type: String, enum: ["draft", "scheduled", "sent"], default: "draft", required: true },
    sentAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

NewsletterSchema.index({ status: 1 });
NewsletterSchema.index({ sentAt: -1 });

export const Newsletter: Model<INewsletterDocument> =
  mongoose.models.Newsletter || mongoose.model<INewsletterDocument>("Newsletter", NewsletterSchema);
