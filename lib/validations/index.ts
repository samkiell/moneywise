import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const subscriberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().max(100).optional(),
});

export const publicationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  type: z.enum(["story", "tabloid"]),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(500),
  content: z.string().min(1, "Content cannot be empty"),
  coverImage: z.string().url("Cover image must be a valid URL").or(z.literal("")).optional(),
  author: z.string().min(2, "Author name required"),
  category: z.string().min(2, "Category required"),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "review", "published"]).default("draft"),
  featured: z.boolean().default(false),
  readingTime: z.number().int().positive().optional(),
});

export const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role is required"),
  bio: z.string().max(500).optional(),
  photo: z.string().url().or(z.literal("")).optional(),
  socialLinks: z
    .object({
      twitter: z.string().url().or(z.literal("")).optional(),
      linkedin: z.string().url().or(z.literal("")).optional(),
      github: z.string().url().or(z.literal("")).optional(),
      instagram: z.string().url().or(z.literal("")).optional(),
    })
    .optional(),
  displayOrder: z.number().int().default(0),
  active: z.boolean().default(true),
});

export const newsletterSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  slug: z.string().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(300).optional(),
  status: z.enum(["draft", "scheduled", "sent"]).default("draft"),
});

export const analyticsEventSchema = z.object({
  eventName: z.string().min(1),
  anonymousId: z.string().optional(),
  sessionId: z.string().optional(),
  pathname: z.string().min(1),
  publicationId: z.string().optional(),
  referrer: z.string().optional(),
  deviceCategory: z.string().optional(),
  browser: z.string().optional(),
  os: z.string().optional(),
  country: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});
