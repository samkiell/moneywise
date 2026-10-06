import mongoose, { Schema, Model, Document } from "mongoose";
import { IPublication } from "@/types";

export interface IPublicationDocument extends Omit<IPublication, "_id">, Document {}

const PublicationSchema = new Schema<IPublicationDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    type: { type: String, enum: ["story", "tabloid"], required: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    author: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "review", "published"], default: "draft", required: true },
    featured: { type: Boolean, default: false },
    readingTime: { type: Number, default: 3 },
    publishedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// Indexes defined in DOCS.md
PublicationSchema.index({ status: 1 });
PublicationSchema.index({ type: 1 });
PublicationSchema.index({ publishedAt: -1 });
PublicationSchema.index({ category: 1 });
PublicationSchema.index({ featured: 1 });

// Query optimization compound indexes
PublicationSchema.index({ type: 1, status: 1, publishedAt: -1 });
PublicationSchema.index({ featured: 1, status: 1, publishedAt: -1 });

export const Publication: Model<IPublicationDocument> =
  mongoose.models.Publication || mongoose.model<IPublicationDocument>("Publication", PublicationSchema);
