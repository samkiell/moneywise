import mongoose, { Schema, Model, Document } from "mongoose";
import { ICategory } from "@/types";

export interface ICategoryDocument extends Omit<ICategory, "_id">, Document {}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: "", trim: true },
    type: { type: String, enum: ["story", "tabloid", "all"], default: "all" },
  },
  {
    timestamps: true,
  }
);


export const Category: Model<ICategoryDocument> =
  mongoose.models.Category || mongoose.model<ICategoryDocument>("Category", CategorySchema);
