import { connectDB } from "@/lib/db/mongodb";
import { Subscriber, ISubscriberDocument } from "@/models/Subscriber";
import { ISubscriber } from "@/types";

function toPlainObject(doc: ISubscriberDocument): ISubscriber {
  return {
    _id: doc._id.toString(),
    email: doc.email,
    name: doc.name,
    status: doc.status,
    subscribedAt: doc.subscribedAt,
    unsubscribedAt: doc.unsubscribedAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export const subscriberService = {
  async subscribe(email: string, name?: string): Promise<{ success: boolean; alreadySubscribed?: boolean }> {
    await connectDB();
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await Subscriber.findOne({ email: normalizedEmail });
    if (existing) {
      if (existing.status === "active") {
        return { success: true, alreadySubscribed: true };
      }
      existing.status = "active";
      existing.unsubscribedAt = null;
      await existing.save();
      return { success: true };
    }

    await Subscriber.create({
      email: normalizedEmail,
      name: name?.trim() || "",
      status: "active",
      subscribedAt: new Date(),
    });

    return { success: true };
  },

  async getAllSubscribers(page: number = 1, limit: number = 20): Promise<{ subscribers: ISubscriber[]; total: number }> {
    if (!process.env.MONGODB_URI) return { subscribers: [], total: 0 };
    await connectDB();
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      Subscriber.find()
        .sort({ subscribedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Subscriber.countDocuments(),
    ]);

    return {
      subscribers: (docs as unknown as ISubscriberDocument[]).map(toPlainObject),
      total,
    };
  },

  async unsubscribe(email: string): Promise<boolean> {
    await connectDB();
    const result = await Subscriber.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { status: "unsubscribed", unsubscribedAt: new Date() }
    );
    return !!result;
  },
};
