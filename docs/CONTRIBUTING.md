# Contributing to Money Wise

## Team Workflow

Money Wise is being developed by a four-person team.

Nobody pushes directly to main.

## Branches

Main branch:

```
main
```

Feature branches:

```
feat/homepage
feat/stories
feat/tabloids
feat/admin
feat/analytics
feat/newsletter
fix/mobile-navigation
```

Use short, descriptive branch names.

## Pull Requests

Every feature should:
- Have a clear scope.
- Be tested locally.
- Pass lint/type checks.
- Include relevant UI testing.
- Avoid unrelated changes.
- Explain what changed and why.

At least one other team member should review meaningful changes before merge.

## Commits

Prefer conventional, readable commits:

```
feat: add publication editor
fix: prevent duplicate newsletter subscriptions
refactor: simplify publication service
docs: update database architecture
chore: update dependencies
```

## Definition of Done

A feature is not done because it works on one developer's machine.

It should:
- Follow the architecture.
- Be responsive.
- Handle loading/error/empty states.
- Validate input.
- Respect authentication and authorization.
- Pass relevant tests.
- Have no obvious accessibility problems.
- Have no unnecessary console errors.
- Be documented when it introduces a new architectural decision.

## Coding Rules

- TypeScript, not JavaScript.
- Avoid any unless genuinely necessary.
- Server Components by default.
- Keep components focused.
- Keep database access out of UI components.
- Put validation in reusable schemas.
- Do not duplicate business logic.
- Do not hardcode database content in public pages.
- Do not commit secrets or .env files.

## Working With MongoDB

Use the centralized database connection.

Do not create a new MongoDB connection in every request or component.

Use Mongoose models/services consistently.

## Working With Analytics

Analytics must be privacy-conscious.

Do not track sensitive user data.

New analytics events should have:
- A clear event name.
- A defined purpose.
- Minimal metadata.
- A documented place in the analytics model.

## Before Opening a PR

Run:

```bash
npm run lint
npm run typecheck
npm test
```

If the project defines additional commands, use those as well.

## Scope Control

If a task says "build X", do not silently redesign unrelated parts of the application.

If you discover a separate issue:
- Fix it only if it blocks the current task.
- Otherwise create an issue for it.

## Source of Truth

Product decisions live in PRD.md.

Technical decisions live in DOCS.md.

Team workflow lives in CONTRIBUTING.md.

When code conflicts with the documentation, stop and resolve the discrepancy rather than inventing a new architecture.

## Local Setup, Seed and E2E

```bash
cp .env.example .env     # fill in MONGODB_URI, AUTH_SECRET, SEED_ADMIN_*, TEST_ADMIN_*
npm run db:seed          # idempotent; safe to run repeatedly
npm run build            # required before E2E (Playwright starts `next start`)
npm run test:e2e         # or: npm run test:e2e:ui
```

- Never point `MONGODB_URI` at production when seeding or running E2E.
- `.env.production` is git-ignored. Use it only locally for `next start`.