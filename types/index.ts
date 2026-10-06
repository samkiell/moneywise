export type PublicationType = "story" | "tabloid";
export type PublicationStatus = "draft" | "review" | "published";

export interface IPublication {
  _id?: string;
  title: string;
  slug: string;
  type: PublicationType;
  excerpt: string;
  content: string; // Structured JSON string or sanitized HTML from Tiptap
  coverImage?: string;
  author: string;
  category: string;
  tags: string[];
  status: PublicationStatus;
  featured: boolean;
  readingTime?: number;
  publishedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserRole = "admin" | "editor";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  type?: "story" | "tabloid" | "all";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITeamMember {
  _id?: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  displayOrder: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SubscriberStatus = "active" | "unsubscribed";

export interface ISubscriber {
  _id?: string;
  email: string;
  name?: string;
  status: SubscriberStatus;
  subscribedAt: Date;
  unsubscribedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type NewsletterStatus = "draft" | "scheduled" | "sent";

export interface INewsletter {
  _id?: string;
  subject: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: NewsletterStatus;
  sentAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAnalyticsEvent {
  _id?: string;
  eventName: string;
  anonymousId?: string;
  sessionId?: string;
  pathname: string;
  publicationId?: string;
  referrer?: string;
  deviceCategory?: string;
  browser?: string;
  os?: string;
  country?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface IAnalyticsDaily {
  _id?: string;
  date: string; // YYYY-MM-DD
  totalViews: number;
  uniqueVisitors: number;
  publicationViews: number;
  storyViews: number;
  tabloidViews: number;
  newsletterSubscribers: number;
  topPages: { path: string; views: number }[];
  topPublications: { publicationId: string; title: string; views: number }[];
}
