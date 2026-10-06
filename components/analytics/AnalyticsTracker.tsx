"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function randomId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getOrCreate(storage: Storage, key: string): string {
  try {
    let value = storage.getItem(key);
    if (!value) {
      value = randomId();
      storage.setItem(key, value);
    }
    return value;
  } catch {
    return randomId();
  }
}

/**
 * First-party, privacy-conscious page view tracker.
 * - Sends a random anonymous ID only (no PII).
 * - Honors Do Not Track.
 * - Failures are silent and never affect the page.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || navigator.doNotTrack === "1") return;

    const payload = {
      eventName: "page_view",
      pathname,
      anonymousId: getOrCreate(localStorage, "mw_vid"),
      sessionId: getOrCreate(sessionStorage, "mw_sid"),
      referrer: document.referrer || undefined,
    };

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}
