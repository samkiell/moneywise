import { connectDB } from "@/lib/db/mongodb";
import { TeamMember, ITeamMemberDocument } from "@/models/TeamMember";
import { ITeamMember } from "@/types";

function toPlainObject(doc: ITeamMemberDocument): ITeamMember {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    role: doc.role,
    bio: doc.bio,
    photo: doc.photo,
    socialLinks: doc.socialLinks,
    displayOrder: doc.displayOrder,
    active: doc.active,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export const teamService = {
  async getActiveMembers(): Promise<ITeamMember[]> {
    if (!process.env.MONGODB_URI) return [];
    await connectDB();
    const docs = await TeamMember.find({ active: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    return (docs as unknown as ITeamMemberDocument[]).map(toPlainObject);
  },

  async getAllMembers(): Promise<ITeamMember[]> {
    if (!process.env.MONGODB_URI) return [];
    await connectDB();
    const docs = await TeamMember.find()
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    return (docs as unknown as ITeamMemberDocument[]).map(toPlainObject);
  },

  async create(data: Partial<ITeamMember>): Promise<ITeamMember> {
    await connectDB();
    const doc = await TeamMember.create(data);
    return toPlainObject(doc);
  },

  async update(id: string, data: Partial<ITeamMember>): Promise<ITeamMember | null> {
    await connectDB();
    const doc = await TeamMember.findByIdAndUpdate(id, data, { new: true });
    return doc ? toPlainObject(doc) : null;
  },

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const result = await TeamMember.findByIdAndDelete(id);
    return !!result;
  },
};
