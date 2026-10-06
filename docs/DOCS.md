# Money Wise Technical Documentation

## 1. Architecture

Money Wise is a full-stack Next.js application.

```
Browser
  |
  v
Next.js App Router
  |
  +-- Server Components
  +-- Client Components
  +-- Server Actions
  +-- Route Handlers
  |
  v
Application Services
  |
  v
MongoDB Atlas
  |
  +-- users
  +-- publications
  +-- categories
  +-- teamMembers
  +-- subscribers
  +-- newsletters
  +-- analyticsEvents
  +-- analyticsDaily
```

No separate Express/Node API is required for V1.

## 2. Stack

- Next.js App Router
- TypeScript
- MongoDB Atlas
- Mongoose
- Tailwind CSS
- shadcn/ui where appropriate
- Tiptap for rich-text editing
- Zod for validation
- Auth.js/NextAuth for admin authentication
- Cloudinary for image storage and delivery
- Vercel for deployment
- Vitest for unit/integration tests
- Playwright for critical end-to-end flows
- ESLint for code quality

## 3. Repository Structure

```
app/
  (public)/
    page.tsx
    stories/
    tabloids/
    about/
    team/
    newsletter/
    search/
  admin/
    login/
    dashboard/
    publications/
    team/
    subscribers/
    newsletters/
    analytics/
  api/

components/
  layout/
  publications/
  team/
  newsletter/
  analytics/
  admin/
  ui/

lib/
  db/
  auth/
  analytics/
  cloudinary/
  validations/
  services/

models/
  User.ts
  Publication.ts
  Category.ts
  TeamMember.ts
  Subscriber.ts
  Newsletter.ts
  AnalyticsEvent.ts
  AnalyticsDaily.ts

types/
public/

supabase/ # DO NOT CREATE THIS DIRECTORY
docs/
  PRD.md
  DOCS.md
  CONTRIBUTING.md
  AGENT-SCAFFOLD.md
```

The final implementation may adjust the exact structure if there is a strong technical reason, but responsibilities must remain separated.

## 4. Database

MongoDB is the source of application data.

### Publication

Core fields:
- title
- slug
- type: story | tabloid
- excerpt
- content
- coverImage
- author
- category
- tags
- status: draft | review | published
- featured
- publishedAt
- createdAt
- updatedAt

Use a unique index for slug.

### TeamMember

- name
- role
- bio
- photo
- socialLinks
- displayOrder
- active
- createdAt
- updatedAt

### Subscriber

- email
- name if collected
- status
- subscribedAt
- unsubscribedAt where applicable

Use a unique index for email.

### User

- name
- email
- password/auth identity as required by Auth.js
- role: admin | editor
- active
- createdAt
- updatedAt

### Category

- name
- slug
- description
- type where needed
- createdAt
- updatedAt

## 5. Analytics Architecture

Money Wise owns its analytics.

### Event model

An analytics event can contain:
- event name
- anonymous visitor ID
- session ID
- pathname
- publication ID when relevant
- referrer
- device category
- browser
- OS
- country/region only when reasonably available and privacy-safe
- timestamp
- metadata needed for the event

Do not collect passwords, raw form contents, or unnecessary personally identifiable information.

### Event types

Examples:
- page_view
- publication_view
- search
- newsletter_subscribe
- publication_share
- outbound_click

### Aggregation

Raw events can be retained for a defined period. Daily aggregates should power most admin charts.

Analytics dashboard should query aggregated data where possible instead of scanning all raw events for every request.

## 6. MongoDB Indexes

At minimum:
- publications.slug unique
- publications.status
- publications.type
- publications.publishedAt
- publications.category
- publications.featured
- teamMembers.active
- teamMembers.displayOrder
- subscribers.email unique
- analyticsEvents.timestamp
- analyticsEvents.eventName
- analyticsEvents.publicationId
- analyticsDaily.date

Add compound indexes based on real query patterns.

## 7. Data Access Rules

Client components must never connect directly to MongoDB.

Use:

```
Client Component
    |
    v
Server Action / Route Handler
    |
    v
Service layer
    |
    v
Mongoose model
    |
    v
MongoDB
```

Database connection logic must be centralized and reused.

## 8. Rich Text

Use Tiptap for the editorial editor.

Do not build a custom rich-text editor.

Publication content should be stored in a structured representation that can safely be rendered by the application.

Sanitize/render safely. Never trust arbitrary HTML from editors or request payloads.

## 9. Images

MongoDB stores image metadata, not image binaries.

Cloudinary should handle:
- Upload
- Transformation
- Optimization
- CDN delivery

Store only the necessary Cloudinary identifiers/URLs in MongoDB.

## 10. Authentication

Only admin/editor areas require authentication.

Protect all /admin routes server-side.

Do not rely only on hiding UI controls for authorization.

Every privileged server action must verify the authenticated user's role.

## 11. SEO

Each publication should generate:
- title
- description
- canonical URL
- Open Graph metadata
- Twitter/X metadata
- Article structured data

Generate sitemap and robots.txt through Next.js.

## 12. Performance

Rules:
- Server Components by default.
- Use Client Components only for interactive UI.
- Use Next.js image optimization.
- Paginate publication/admin lists.
- Avoid unnecessary client-side data fetching.
- Cache public content where appropriate.
- Keep admin analytics queries efficient.
- Do not load the entire publication collection into the browser.

## 13. Security

- Validate all external input with Zod.
- Rate-limit newsletter and other public endpoints.
- Protect admin routes.
- Enforce authorization server-side.
- Keep secrets in environment variables.
- Never expose MongoDB connection strings.
- Never expose Cloudinary private credentials.
- Sanitize rich content.
- Avoid logging sensitive information.

## 14. Environment Variables

Expected values include:

```env
MONGODB_URI=
MONGODB_DB_NAME=

AUTH_SECRET=
AUTH_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

NEXT_PUBLIC_APP_URL=
```

Only variables that genuinely need a NEXT_PUBLIC_ prefix should use one.

## 15. Environments

- Local development
- Vercel preview
- Production

Pull requests should use preview deployments.

## 16. Testing

Critical flows:
1. Visitor opens a publication.
2. Visitor searches.
3. Visitor subscribes to newsletter.
4. Admin logs in.
5. Admin creates a draft.
6. Admin submits/publishes a publication.
7. Admin updates a team member.
8. Analytics records and displays events.

Use Vitest for business logic and Playwright for critical browser flows.

## 17. Deployment

Production target: Vercel.

Database: MongoDB Atlas.

Images: Cloudinary.

The deployment must provide separate environment variables for preview and production.

## 18. Technical Principles

1. Keep the architecture boring and maintainable.
2. Prefer server-side logic for sensitive operations.
3. Avoid unnecessary dependencies.
4. Do not duplicate business logic between pages and API handlers.
5. Do not hardcode editorial content that belongs in the database.
6. Do not over-engineer V1.
7. Optimize based on actual usage rather than guesses.
