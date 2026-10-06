# Money Wise Scaffold Agent Prompt

You are scaffolding the Money Wise repository.

Read these files first and treat them as the source of truth:

- docs/PRD.md
- docs/DOCS.md
- docs/CONTRIBUTING.md

## Objective

Create the initial production-ready Next.js application structure for Money Wise.

Do NOT implement the entire product yet.

The immediate goal is a clean, compilable scaffold that establishes the architecture without fake features or unnecessary abstractions.

## Stack

Use:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui where useful
- MongoDB/Mongoose
- Zod
- Auth.js/NextAuth
- Tiptap
- Cloudinary
- Vitest
- Playwright
- ESLint

Do not introduce Supabase, Firebase, Prisma, Express, or another separate backend.

## Requirements

### 1. Project foundation

Set up:
- Next.js
- TypeScript
- Tailwind
- ESLint
- sensible path aliases
- environment variable example
- npm scripts for development, build, lint, typecheck, and tests

### 2. Folder structure

Create the structure described in docs/DOCS.md.

Create placeholder files only where they establish architectural boundaries.

Do not fill the application with dummy components that pretend features are complete.

### 3. MongoDB

Create:
- centralized MongoDB connection utility
- Mongoose model directory
- initial model definitions for:
  - User
  - Publication
  - Category
  - TeamMember
  - Subscriber
  - Newsletter
  - AnalyticsEvent
  - AnalyticsDaily

Add the initial indexes described in DOCS.md.

Do not connect to MongoDB during build if environment variables are unavailable.

### 4. Authentication

Prepare the authentication architecture for admin/editor users.

Do not create insecure hardcoded credentials.

Protect the admin route structure.

### 5. Public routes

Create the route structure for:

/
 /stories
 /stories/[slug]
 /tabloids
 /tabloids/[slug]
 /about
 /team
 /newsletter
 /search

Pages should have clean placeholder UI that follows the Money Wise visual direction.

### 6. Admin routes

Create:

/admin
/admin/login
/admin/dashboard
/admin/publications
/admin/publications/new
/admin/publications/[id]/edit
/admin/team
/admin/subscribers
/admin/newsletters
/admin/analytics

Admin navigation should reflect the actual product areas.

### 7. Analytics architecture

Prepare the service/model boundary for first-party analytics.

Do not use Vercel Analytics.

Create clear functions/interfaces for:
- recording events
- querying daily aggregates
- querying publication performance
- querying newsletter conversion
- querying top pages

The dashboard may initially show empty states rather than fake analytics.

### 8. Design system

Use the approved palette:

Primary Blue: #0055FF
Primary Dark: #003399
Background: #F8FAFC
Surface: #FFFFFF
Text: #0F172A
Secondary Text: #64748B
Border: #E2E8F0
Accent Yellow: #FFD54A

The visual style should be clean, editorial, modern, and typography-led.

Do not make it look like a SaaS dashboard.

### 9. Quality

Before finishing:
- Run lint.
- Run typecheck.
- Run the production build.
- Fix all errors introduced by the scaffold.
- Check responsive structure.
- Check that no secrets are committed.
- Check that no deprecated or unnecessary dependencies were added.

## Do not

- Do not implement fake CMS functionality.
- Do not hardcode editorial team members into the UI.
- Do not hardcode article content as the permanent data source.
- Do not add Supabase.
- Do not add a separate Express server.
- Do not add Vercel Analytics.
- Do not build a custom rich-text editor.
- Do not over-engineer features outside the documented V1 scope.

At the end, provide a concise summary of:
1. Files created.
2. Dependencies added.
3. Architecture established.
4. Commands used to verify the scaffold.
5. Anything intentionally left for the next implementation phase.
