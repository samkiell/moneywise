import { describe, it, expect } from "vitest";
import { loginSchema, subscriberSchema, publicationSchema } from "@/lib/validations";

describe("Validation Schemas", () => {
  it("validates login credentials correctly", () => {
    const valid = loginSchema.safeParse({
      email: "editor@oaucowrywise.org",
      password: "securepassword123",
    });
    expect(valid.success).toBe(true);

    const invalid = loginSchema.safeParse({
      email: "not-an-email",
      password: "123",
    });
    expect(invalid.success).toBe(false);
  });

  it("validates newsletter subscriber email", () => {
    const valid = subscriberSchema.safeParse({
      email: "student@oauife.edu.ng",
      name: "Oluwasegun",
    });
    expect(valid.success).toBe(true);

    const invalid = subscriberSchema.safeParse({
      email: "invalid-email-address",
    });
    expect(invalid.success).toBe(false);
  });

  it("validates publication structure", () => {
    const valid = publicationSchema.safeParse({
      title: "Understanding High-Yield Savings",
      slug: "understanding-high-yield-savings",
      type: "tabloid",
      excerpt: "A comprehensive guide to managing short-term funds on campus.",
      content: "<p>Article body content here</p>",
      author: "Bello Oluwaferanmi Enoch",
      category: "Financial Literacy",
      tags: ["savings", "budgeting"],
      status: "published",
      featured: true,
    });
    expect(valid.success).toBe(true);
  });
});
