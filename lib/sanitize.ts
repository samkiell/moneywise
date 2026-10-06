import sanitizeHtml from "sanitize-html";

/**
 * Allow-list matching exactly what the Tiptap editor can produce
 * (StarterKit + Link + Image). Everything else is stripped.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "h1",
    "h2",
    "h3",
    "strong",
    "em",
    "s",
    "ul",
    "ol",
    "li",
    "blockquote",
    "hr",
    "a",
    "img",
    "code",
    "pre",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "title"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https"] },
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer nofollow" },
    }),
  },
};

/** Sanitizes editor HTML. Use on write AND on render (defence in depth). */
export function sanitizeContent(html: string): string {
  return sanitizeHtml(html ?? "", OPTIONS);
}
