import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyticsService } from "@/lib/services/analytics.service";
import { publicationService } from "@/lib/services/publication.service";
import { parseUserAgent } from "@/lib/analytics/ua";

export const runtime = "nodejs";

// Strict payload: the client may only report a page view. Everything else
// (device, browser, publication, referrer host) is derived server-side.
const trackSchema = z.object({
  eventName: z.literal("page_view"),
  pathname: z.string().min(1).max(300).startsWith("/"),
  anonymousId: z.string().max(64).optional(),
  sessionId: z.string().max(64).optional(),
  referrer: z.string().max(500).optional(),
});

const PUBLICATION_PATH = /^\/(stories|tabloids)\/([a-z0-9]+(?:-[a-z0-9]+)*)$/;

function referrerHost(referrer: string | undefined, ownHost: string): string {
  if (!referrer) return "";
  try {
    const host = new URL(referrer).hostname;
    return host === ownHost ? "" : host; // store host only, never full URLs
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  const ua = parseUserAgent(req.headers.get("user-agent"));
  if (ua.isBot) return new NextResponse(null, { status: 204 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = trackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Never record admin/API traffic as public readership.
  const { pathname, anonymousId, sessionId, referrer } = parsed.data;
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    return new NextResponse(null, { status: 204 });
  }

  const base = {
    pathname,
    anonymousId,
    sessionId,
    referrer: referrerHost(referrer, req.nextUrl.hostname),
    deviceCategory: ua.deviceCategory,
    browser: ua.browser,
    os: ua.os,
  };

  try {
    await analyticsService.recordEvent({ ...base, eventName: "page_view" });

    const match = PUBLICATION_PATH.exec(pathname);
    if (match) {
      const publication = await publicationService.getBySlug(match[2]);
      if (publication) {
        await analyticsService.recordEvent({
          ...base,
          eventName: "publication_view",
          publicationId: publication._id,
          metadata: { type: publication.type },
        });
      }
    }
  } catch (err) {
    // Analytics must never break the reader experience.
    console.warn("Analytics tracking failed:", err);
  }

  return new NextResponse(null, { status: 204 });
}
