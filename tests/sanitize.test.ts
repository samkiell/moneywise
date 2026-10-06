import { describe, it, expect } from "vitest";
import { sanitizeContent } from "@/lib/sanitize";

describe("HTML Content Sanitizer", () => {
  it("preserves safe semantic formatting elements from Tiptap", () => {
    const safeHtml =
      "<h2>Introduction</h2><p>This is <strong>bold</strong> and <em>italic</em>.</p><ul><li>Item 1</li></ul>";
    const cleaned = sanitizeContent(safeHtml);
    expect(cleaned).toContain("<h2>Introduction</h2>");
    expect(cleaned).toContain("<strong>bold</strong>");
    expect(cleaned).toContain("<em>italic</em>");
    expect(cleaned).toContain("<li>Item 1</li>");
  });

  it("strips malicious script tags and inline JavaScript event handlers", () => {
    const maliciousHtml =
      '<p>Harmless text</p><script>alert("xss")</script><img src="x" onerror="alert(1)" />';
    const cleaned = sanitizeContent(maliciousHtml);
    expect(cleaned).not.toContain("<script>");
    expect(cleaned).not.toContain("alert");
    expect(cleaned).not.toContain("onerror");
  });

  it("secures links with noopener, noreferrer, and target blank", () => {
    const linkedHtml = '<p>Read more on <a href="https://example.com">Example</a>.</p>';
    const cleaned = sanitizeContent(linkedHtml);
    expect(cleaned).toContain('href="https://example.com"');
    expect(cleaned).toContain('target="_blank"');
    expect(cleaned).toContain('rel="noopener noreferrer nofollow"');
  });

  it("strips dangerous javascript: protocol URLs", () => {
    const xssLink = '<a href="javascript:stealData()">Click here</a>';
    const cleaned = sanitizeContent(xssLink);
    expect(cleaned).not.toContain("javascript:");
  });
});
