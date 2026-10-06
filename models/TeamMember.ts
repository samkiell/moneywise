import mongoose, { Schema, Model, Document } from "mongoose";
import { ITeamMember } from "@/types";

export interface ITeamMemberDocument extends Omit<ITeamMember, "_id">, Document {}

const TeamMemberSchema = new Schema<ITeamMemberDocument>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    bio: { type: String, default: "", trim: true },
    photo: { type: String, default: "" },
    socialLinks: {
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

TeamMemberSchema.index({ active: 1 });
TeamMemberSchema.index({ displayOrder: 1 });
TeamMemberSchema.index({ active: 1, displayOrder: 1 });

export const TeamMember: Model<ITeamMemberDocument> =
  mongoose.models.TeamMember || mongoose.model<ITeamMemberDocument>("TeamMember", TeamMemberSchema);
