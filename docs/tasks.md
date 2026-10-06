# Money Wise: Delegated Foundation Tasks

This document contains assigned tasks for our engineering collaborators on the Money Wise project.

---

## Task 1: Rate Limiting & Abuse Prevention on Public Endpoints
**Assignee:** [Habeeb27](https://github.com/Habeeb27)  
**Branch:** `feat/rate-limiting`  
**Reference:** `docs/PRD.md` (§11, §13), `docs/DOCS.md` (§13)

### Objective
Implement client abuse protection and rate limiting on all public write endpoints to prevent spam, newsletter list bombing, and telemetry abuse.

### Scope & Requirements
1. **Rate Limiting Utility (`lib/rate-limit.ts`):**
   - Implement an IP-based token-bucket or sliding window rate limiter.
   - Must be lightweight and self-contained with in-memory storage (and optional Redis/Upstash adapter if configured in environment variables).
   - Support custom limits per endpoint (e.g., stricter for newsletter signups than for analytics pings).

2. **Target Endpoints:**
   - **Newsletter Subscriptions:** Rate-limit `app/actions/subscriber.actions.ts` (e.g., max 5 requests per IP per 10 minutes).
   - **Analytics Ingestion:** Rate-limit `app/api/analytics/track/route.ts` (e.g., max 60 events per IP per minute).
   - **Staff Login:** Throttle failed login attempts against `app/admin/login/page.tsx` / NextAuth credentials to mitigate brute force.

3. **Behavior & Error Handling:**
   - Return HTTP `429 Too Many Requests` with a descriptive message and standard `Retry-After` header.
   - For server actions (`subscriber.actions.ts`), return a user-friendly error object: `{ error: "Too many requests. Please wait a few minutes before trying again." }`.

4. **Testing & Verification:**
   - Add unit/integration tests in `tests/rate-limit.test.ts`.
   - Ensure `npm run lint`, `npm run typecheck`, and `npm test` continue to pass.

---

## Task 2: SEO Engine — Dynamic Sitemap, Robots.txt & Article Structured Data
**Assignee:** [Opeyemi Olaofe](https://github.com/Opexy431) (@Opexy431)  
**Branch:** `feat/seo-sitemap-metadata`  
**Reference:** `docs/PRD.md` (§11), `docs/DOCS.md` (§11)

### Objective
Complete the production search engine optimization (SEO) foundation across all public publication routes and site sections.

### Scope & Requirements
1. **Dynamic Sitemap (`app/sitemap.ts`):**
   - Utilize Next.js App Router `sitemap()` API.
   - Dynamically fetch all published publications from `publicationService.getPublished({ limit: 1000 })`.
   - Include core static routes (`/`, `/about`, `/team`, `/stories`, `/tabloids`, `/newsletter`, `/search`) with sensible `changeFrequency` and `priority`.
   - Output accessible at `/sitemap.xml`.

2. **Robots Configuration (`app/robots.ts`):**
   - Utilize Next.js `robots()` API.
   - Allow public web indexing across all public routes.
   - Explicitly disallow private administrative paths (`/admin/`, `/admin/*`) and internal API endpoints (`/api/*`).
   - Reference the dynamic sitemap URL (`${NEXT_PUBLIC_APP_URL}/sitemap.xml`).
   - Output accessible at `/robots.txt`.

3. **Article Structured Data (JSON-LD):**
   - Create a reusable JSON-LD component (`components/seo/ArticleJsonLd.tsx`).
   - Inject schema.org `Article` / `NewsArticle` structured data into:
     - `app/(public)/stories/[slug]/page.tsx`
     - `app/(public)/tabloids/[slug]/page.tsx`
   - Include: `headline`, `description`, `image`, `datePublished`, `dateModified`, `author` (Person), `publisher` (Organization with Cowrywise / Money Wise branding), and `mainEntityOfPage`.

4. **Canonical URLs & Open Graph Validation:**
   - Verify `generateMetadata` in story and tabloid pages generates valid canonical URLs, Twitter cards, and Open Graph tags.

5. **Testing & Verification:**
   - Verify `/sitemap.xml` and `/robots.txt` serve valid XML and plain text responses.
   - Add Playwright E2E assertion or unit test validating `<script type="application/ld+json">` presence.
   - Ensure `npm run lint`, `npm run typecheck`, and `npm run build` pass without warnings.
