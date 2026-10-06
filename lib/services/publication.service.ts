import { connectDB } from "@/lib/db/mongodb";
import { Publication, IPublicationDocument } from "@/models/Publication";
import { IPublication, PublicationType, PublicationStatus } from "@/types";

export interface PublicationFilterOptions {
  type?: PublicationType;
  status?: PublicationStatus;
  category?: string;
  tag?: string;
  featured?: boolean;
  limit?: number;
  skip?: number;
}

function toPlainObject(doc: IPublicationDocument): IPublication {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    type: doc.type,
    excerpt: doc.excerpt,
    content: doc.content,
    coverImage: doc.coverImage,
    author: doc.author,
    category: doc.category,
    tags: doc.tags,
    status: doc.status,
    featured: doc.featured,
    readingTime: doc.readingTime,
    publishedAt: doc.publishedAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export const publicationService = {
  async getPublished(options: PublicationFilterOptions = {}): Promise<{ publications: IPublication[]; total: number }> {
    if (!process.env.MONGODB_URI) return { publications: [], total: 0 };
    await connectDB();
    const query: Record<string, unknown> = { status: "published" };

    if (options.type) query.type = options.type;
    if (options.category) query.category = options.category;
    if (options.tag) query.tags = options.tag;
    if (typeof options.featured === "boolean") query.featured = options.featured;

    const [docs, total] = await Promise.all([
      Publication.find(query)
        .sort({ publishedAt: -1 })
        .skip(options.skip || 0)
        .limit(options.limit || 12)
        .lean(),
      Publication.countDocuments(query),
    ]);

    return {
      publications: (docs as unknown as IPublicationDocument[]).map(toPlainObject),
      total,
    };
  },

  async getFeatured(): Promise<IPublication | null> {
    if (!process.env.MONGODB_URI) return null;
    await connectDB();
    const doc = await Publication.findOne({ status: "published", featured: true })
      .sort({ publishedAt: -1 })
      .lean();

    return doc ? toPlainObject(doc as unknown as IPublicationDocument) : null;
  },

  async getBySlug(slug: string): Promise<IPublication | null> {
    if (!process.env.MONGODB_URI) return null;
    await connectDB();
    const doc = await Publication.findOne({ slug, status: "published" }).lean();
    return doc ? toPlainObject(doc as unknown as IPublicationDocument) : null;
  },

  async getById(id: string): Promise<IPublication | null> {
    if (!process.env.MONGODB_URI) return null;
    await connectDB();
    const doc = await Publication.findById(id).lean();
    return doc ? toPlainObject(doc as unknown as IPublicationDocument) : null;
  },

  async search(searchTerm: string, limit: number = 20): Promise<IPublication[]> {
    if (!process.env.MONGODB_URI) return [];
    await connectDB();
    const regex = new RegExp(searchTerm, "i");
    const docs = await Publication.find({
      status: "published",
      $or: [
        { title: regex },
        { excerpt: regex },
        { author: regex },
        { category: regex },
        { tags: regex },
      ],
    })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    return (docs as unknown as IPublicationDocument[]).map(toPlainObject);
  },

  async create(data: Partial<IPublication>): Promise<IPublication> {
    await connectDB();
    const doc = await Publication.create(data);
    return toPlainObject(doc);
  },

  async update(id: string, data: Partial<IPublication>): Promise<IPublication | null> {
    await connectDB();
    const doc = await Publication.findByIdAndUpdate(id, data, { new: true });
    return doc ? toPlainObject(doc) : null;
  },

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const result = await Publication.findByIdAndDelete(id);
    return !!result;
  },
};
