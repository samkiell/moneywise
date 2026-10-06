import { connectDB } from "@/lib/db/mongodb";
import { Newsletter, INewsletterDocument } from "@/models/Newsletter";
import { INewsletter } from "@/types";

function toPlainObject(doc: INewsletterDocument): INewsletter {
  return {
    _id: doc._id.toString(),
    subject: doc.subject,
    slug: doc.slug,
    content: doc.content,
    excerpt: doc.excerpt,
    status: doc.status,
    sentAt: doc.sentAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export const newsletterService = {
  async getSentArchive(limit: number = 20): Promise<INewsletter[]> {
    if (!process.env.MONGODB_URI) return [];
    await connectDB();
    const docs = await Newsletter.find({ status: "sent" })
      .sort({ sentAt: -1 })
      .limit(limit)
      .lean();

    return (docs as unknown as INewsletterDocument[]).map(toPlainObject);
  },

  async getAllNewsletters(): Promise<INewsletter[]> {
    if (!process.env.MONGODB_URI) return [];
    await connectDB();
    const docs = await Newsletter.find()
      .sort({ createdAt: -1 })
      .lean();

    return (docs as unknown as INewsletterDocument[]).map(toPlainObject);
  },

  async getBySlug(slug: string): Promise<INewsletter | null> {
    if (!process.env.MONGODB_URI) return null;
    await connectDB();
    const doc = await Newsletter.findOne({ slug }).lean();
    return doc ? toPlainObject(doc as unknown as INewsletterDocument) : null;
  },

  async create(data: Partial<INewsletter>): Promise<INewsletter> {
    await connectDB();
    const doc = await Newsletter.create(data);
    return toPlainObject(doc);
  },

  async update(id: string, data: Partial<INewsletter>): Promise<INewsletter | null> {
    await connectDB();
    const doc = await Newsletter.findByIdAndUpdate(id, data, { new: true });
    return doc ? toPlainObject(doc) : null;
  },
};
