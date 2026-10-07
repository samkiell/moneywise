import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests under the limit", () => {
    const result = rateLimit("test:allow", 5, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("blocks a request once the limit is reached", () => {
    const key = "test:block";
    for (let i = 0; i < 5; i++) {
      rateLimit(key, 5, 60_000);
    }

    const sixth = rateLimit(key, 5, 60_000);
    expect(sixth.allowed).toBe(false);
    expect(sixth.remaining).toBe(0);
    expect(sixth.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks different keys independently", () => {
    const keyA = "test:ip-a";
    const keyB = "test:ip-b";

    for (let i = 0; i < 5; i++) {
      rateLimit(keyA, 5, 60_000);
    }

    const blockedA = rateLimit(keyA, 5, 60_000);
    const allowedB = rateLimit(keyB, 5, 60_000);

    expect(blockedA.allowed).toBe(false);
    expect(allowedB.allowed).toBe(true);
  });

  it("allows requests again after the window passes", () => {
    const key = "test:window-reset";

    for (let i = 0; i < 5; i++) {
      rateLimit(key, 5, 60_000);
    }
    expect(rateLimit(key, 5, 60_000).allowed).toBe(false);

    // Move time forward past the window
    vi.advanceTimersByTime(60_001);

    const afterWindow = rateLimit(key, 5, 60_000);
    expect(afterWindow.allowed).toBe(true);
  });

  it("resetRateLimit clears an existing entry", () => {
    const key = "test:reset";

    for (let i = 0; i < 5; i++) {
      rateLimit(key, 5, 60_000);
    }
    expect(rateLimit(key, 5, 60_000).allowed).toBe(false);

    resetRateLimit(key);

    expect(rateLimit(key, 5, 60_000).allowed).toBe(true);
  });
});