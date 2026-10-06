/**
 * Minimal, dependency-free user-agent classification.
 * Only coarse buckets are stored (privacy-conscious) — never the raw UA string.
 */
export interface ParsedUA {
  deviceCategory: "mobile" | "tablet" | "desktop";
  browser: string;
  os: string;
  isBot: boolean;
}

const BOT_RE = /bot|crawl|spider|slurp|facebookexternalhit|headless|lighthouse|preview|monitor|curl|wget|python-requests/i;

export function parseUserAgent(ua: string | null | undefined): ParsedUA {
  const s = ua ?? "";

  const isBot = !s || BOT_RE.test(s);

  let deviceCategory: ParsedUA["deviceCategory"] = "desktop";
  if (/ipad|tablet|(android(?!.*mobile))/i.test(s)) deviceCategory = "tablet";
  else if (/mobi|iphone|ipod|android/i.test(s)) deviceCategory = "mobile";

  let browser = "Other";
  if (/edg\//i.test(s)) browser = "Edge";
  else if (/opr\/|opera/i.test(s)) browser = "Opera";
  else if (/chrome|crios/i.test(s)) browser = "Chrome";
  else if (/firefox|fxios/i.test(s)) browser = "Firefox";
  else if (/safari/i.test(s)) browser = "Safari";

  let os = "Other";
  if (/windows/i.test(s)) os = "Windows";
  else if (/android/i.test(s)) os = "Android";
  else if (/iphone|ipad|ipod|ios/i.test(s)) os = "iOS";
  else if (/mac os x|macintosh/i.test(s)) os = "macOS";
  else if (/linux/i.test(s)) os = "Linux";

  return { deviceCategory, browser, os, isBot };
}
