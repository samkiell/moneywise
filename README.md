# Money Wise

The official magazine of the OAU Cowrywise Community Writing Team.

We write to inform. We create to inspire. We publish to empower.

---

## 📖 About Money Wise

Money Wise is a modern editorial platform dedicated to financial literacy, career development, digital skills, entrepreneurship, and quality connections within the OAU Cowrywise Community.

We publish high-quality **Stories** (creative narratives, spotlights, interviews, and series) and **Tabloids** (educational and fact-based content on financial literacy, careers, digital skills, entrepreneurship, and community topics).

Our audience includes OAU Cowrywise Community members, students, and young adults interested in personal development and financial empowerment.

### Current Status

**V1** is in active development. Core features include:

- ✅ Homepage with featured content
- ✅ Stories and Tabloids discovery
- ✅ Full publication pages with rich content
- ✅ Team showcase
- ✅ Publication search
- ✅ Newsletter subscriptions
- ✅ Admin CMS (publications, team, subscribers, analytics)
- ✅ First-party analytics dashboard
- ✅ Image uploads via Cloudinary
- ✅ SEO optimization
- ✅ Responsive, accessible design

---

## 🛠 Tech Stack

| Layer              | Technology                                  |
| ------------------ | ------------------------------------------- |
| **Framework**      | Next.js 15 (App Router)                     |
| **Language**       | TypeScript                                  |
| **Styling**        | Tailwind CSS, shadcn/ui                     |
| **Database**       | MongoDB Atlas + Mongoose                    |
| **Authentication** | Auth.js / NextAuth v5                       |
| **Rich Text**      | Tiptap                                      |
| **Image Hosting**  | Cloudinary                                  |
| **Validation**     | Zod                                         |
| **Testing**        | Vitest (unit/integration), Playwright (E2E) |
| **Linting**        | ESLint                                      |
| **Deployment**     | Vercel                                      |

---

## 📁 Repository Structure

```text
moneywise/
├── app/                      # Next.js App Router
│   ├── (public)/             # Public routes
│   │   ├── page.tsx          # Homepage
│   │   ├── stories/          # Stories listing & detail pages
│   │   ├── tabloids/         # Tabloids listing & detail pages
│   │   ├── about/            # About page
│   │   ├── team/             # Team page
│   │   ├── newsletter/       # Newsletter subscription
│   │   └── search/           # Search page
│   ├── admin/                # Protected admin routes
│   │   ├── login/            # Admin login
│   │   ├── dashboard/        # Admin dashboard
│   │   ├── publications/     # Publication management
│   │   ├── team/             # Team management
│   │   ├── subscribers/      # Subscriber management
│   │   ├── newsletters/      # Newsletter management
│   │   └── analytics/        # Analytics dashboard
│   ├── api/                  # API route handlers
│   └── layout.tsx            # Root layout
│
├── components/               # Reusable React components
│   ├── layout/               # Layout components (header, footer, nav)
│   ├── publications/         # Publication cards, lists
│   ├── team/                 # Team member cards
│   ├── newsletter/           # Newsletter subscription forms
│   ├── analytics/            # Analytics charts & tables
│   ├── admin/                # Admin UI (forms, editors)
│   └── ui/                   # Base UI components (buttons, inputs, etc.)
│
├── lib/                      # Utilities & services
│   ├── db/                   # Database connection & setup
│   ├── auth/                 # Authentication helpers
│   ├── analytics/            # Analytics tracking & aggregation
│   ├── cloudinary/           # Cloudinary image utilities
│   ├── validations/          # Zod schemas
│   └── services/             # Business logic (publicationService, etc.)
│
├── models/                   # Mongoose schemas
│   ├── User.ts
│   ├── Publication.ts
│   ├── Category.ts
│   ├── TeamMember.ts
│   ├── Subscriber.ts
│   ├── Newsletter.ts
│   ├── AnalyticsEvent.ts
│   └── AnalyticsDaily.ts
│
├── types/                    # TypeScript type definitions
├── tests/                    # Test files
│   ├── unit/                 # Unit & integration tests
│   └── e2e/                  # Playwright E2E tests
│
├── scripts/                  # Development & build scripts
│   ├── seed.ts               # Database seeding script
│   └── dns-preload.js        # DNS helper for Windows
│
├── docs/                     # Project documentation
│   ├── PRD.md                # Product Requirements Document
│   ├── DOCS.md               # Technical Architecture
│   ├── CONTRIBUTING.md       # Contribution guidelines
│   └── tasks.md              # Delegated tasks
│
├── public/                   # Static assets
├── .env.example              # Environment variables template
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── playwright.config.ts      # Playwright configuration
├── vitest.config.ts          # Vitest configuration
└── package.json              # Project dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** (or yarn/pnpm)
- **MongoDB Atlas** account (free tier works for development)
- **Cloudinary** account (free tier works for development)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/samkiell/moneywise.git
cd moneywise
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env.local
```

Then update `.env.local` with your actual values:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DB_NAME=moneywise

# Auth.js / NextAuth
AUTH_SECRET=generate_with_openssl_rand_base64_32
AUTH_URL=http://localhost:3000

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Application Public URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database Seed Configuration (Development Only)
SEED_ADMIN_EMAIL=admin@oaucowrywise.org
SEED_ADMIN_PASSWORD=your_dev_admin_password_min_8_chars

# Playwright E2E Test Credentials (Optional)
TEST_ADMIN_EMAIL=admin@oaucowrywise.org
TEST_ADMIN_PASSWORD=your_dev_admin_password_min_8_chars
```

> ⚠️ **Never commit `.env.local` or any file containing real secrets to Git.**

### 4. Set Up MongoDB

1. Create a free MongoDB Atlas cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a database named `moneywise`
3. Create a database user with read/write permissions
4. Copy the connection string and add it to `.env.local` as `MONGODB_URI`

Connection string format:

```text
mongodb+srv://username:password@cluster.mongodb.net/moneywise?retryWrites=true&w=majority
```

### 5. Seed the Database (Development)

Run the seed script to populate the database with initial data (categories, sample publications, and admin user):

```bash
npm run db:seed
```

**Requirements:**

- `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` must be set in `.env.local`
- The script is idempotent — it upserts keyed data, so it's safe to run multiple times
- Password is hashed with bcrypt and never printed to console

**Seeded data includes:**

- Five editorial team members (Chief Editor, Copy Editors, Line Editors)
- Five content categories (Financial Literacy, Career, Digital Skills, Entrepreneurship, Connections)
- Sample publications (Stories and Tabloids)
- One admin user (email and password from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`)

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Public pages (no authentication required):**

- Homepage: `/`
- Stories: `/stories`
- Tabloids: `/tabloids`
- About: `/about`
- Team: `/team`
- Search: `/search`
- Newsletter: `/newsletter`

**Admin area (authentication required):**

- Login: `/admin/login`
- Dashboard: `/admin/dashboard`
- Publications: `/admin/publications`
- Team: `/admin/team`
- Subscribers: `/admin/subscribers`
- Newsletters: `/admin/newsletters`
- Analytics: `/admin/analytics`

---

## 🔐 Environment Variables Reference

| Variable | Purpose | Required | Example |
| -------- | ------- | -------- | ------- |
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ | `mongodb+srv://user:pass@cluster.mongodb.net/moneywise?retryWrites=true&w=majority` |
| `MONGODB_DB_NAME` | Database name | ✅ | `moneywise` |
| `AUTH_SECRET` | NextAuth secret (generate with `openssl rand -base64 32`) | ✅ | `your_random_base64_string` |
| `AUTH_URL` | NextAuth callback URL | ✅ | `http://localhost:3000` (dev) or `https://yourdomain.com` (prod) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name | ✅ | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret (server-side only) | ✅ | `your_api_secret` |
| `NEXT_PUBLIC_APP_URL` | Public application URL | ✅ | `http://localhost:3000` (dev) or `https://yourdomain.com` (prod) |
| `SEED_ADMIN_EMAIL` | Admin email for development seeding | ✅ (for `npm run db:seed`) | `admin@oaucowrywise.org` |
| `SEED_ADMIN_PASSWORD` | Admin password for development seeding (min 8 chars) | ✅ (for `npm run db:seed`) | `your_dev_password` |
| `TEST_ADMIN_EMAIL` | Email for Playwright E2E tests | ❌ (defaults to `SEED_ADMIN_EMAIL`) | `admin@oaucowrywise.org` |
| `TEST_ADMIN_PASSWORD` | Password for Playwright E2E tests | ❌ (defaults to `SEED_ADMIN_PASSWORD`) | `your_dev_password` |

**Notes:**

- `CLOUDINARY_API_SECRET` is only used server-side and is never exposed to the browser.
- Development variables like `SEED_ADMIN_PASSWORD` and `TEST_ADMIN_PASSWORD` should never be production credentials.
- `NEXT_PUBLIC_*` variables are bundled into the browser; only use them for public, non-sensitive data.

---

## 🗄 Database & Seeding

### MongoDB Setup

Money Wise uses **MongoDB Atlas** as the primary data store. The database schema includes:

- **publications** — Stories and Tabloids with rich content, metadata, status (draft/review/published)
- **teamMembers** — Editorial team with photos, bios, social links, display order
- **subscribers** — Newsletter subscribers with email and subscription status
- **users** — Admin and editor accounts with authentication
- **categories** — Content categories (Financial Literacy, Career, etc.)
- **analyticsEvents** — Raw analytics events (page views, searches, newsletter signups)
- **analyticsDaily** — Aggregated daily analytics for dashboard queries

### Running the Seed Script

```bash
npm run db:seed
```

This script:

1. Connects to MongoDB using `MONGODB_URI`
2. Upserts (creates or updates) initial data:
   - Editorial team members
   - Content categories
   - Sample publications
   - Admin user (using `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`)
3. Is idempotent — safe to run multiple times
4. Exits with an error if required environment variables are missing

> **Development only.** Do not use production credentials for seeding.

---

## 🔑 Authentication & Admin Access

### How Authentication Works

Money Wise uses **Auth.js / NextAuth v5** for admin authentication.

- **Public pages** (stories, tabloids, homepage, search, newsletter) require no authentication.
- **Admin area** (`/admin/*`) requires login with an admin or editor account.
- Sessions are managed server-side and stored securely.
- User roles: **Admin** (full CMS access) or **Editor** (publication management only).

### Admin Login

1. Start the development server: `npm run dev`
2. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
3. Enter credentials from `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`
4. You'll be redirected to `/admin/dashboard`

### Environment Variables for Auth

- `AUTH_SECRET` — Used to sign and verify JWT tokens. Generate with:

  ```bash
  openssl rand -base64 32
  ```

- `AUTH_URL` — The callback URL for NextAuth. Must match your deployment domain in production.

> **Security note:** Never commit real credentials to Git. The seed admin is development-only.

---

## 📊 Analytics

Money Wise includes a **first-party analytics system** built directly into the application. It does not rely on Vercel Analytics or third-party providers.

### How It Works

1. **Event Tracking** — The application tracks user interactions:
   - `page_view` — User visits a public page
   - `publication_view` — User opens a publication detail
   - `search` — User performs a search
   - `newsletter_subscribe` — User subscribes to the newsletter
   - `publication_share` — User shares a publication
   - Other custom events as needed

2. **Data Storage** — Events are stored in MongoDB (`analyticsEvents` collection) with:
   - Event name and timestamp
   - Anonymous visitor/session ID
   - Page pathname and referrer
   - Publication ID (if relevant)
   - Device category, browser, OS
   - Country/region (privacy-safe)

3. **Aggregation** — Daily aggregates are computed and stored in `analyticsDaily` for efficient dashboard queries.

### Admin Analytics Dashboard

Admins can view analytics at `/admin/analytics`:

- Total page views and unique visitors
- Publication views and most-read publications
- Stories vs Tabloids performance
- Top pages and referrers
- Newsletter subscription trends
- Search activity
- Device and browser breakdown
- Daily, weekly, and monthly trends

---

## 🧪 Testing & Quality Assurance

### Available Commands

```bash
# Lint code with ESLint
npm run lint

# Type-check with TypeScript
npm run typecheck

# Run unit & integration tests with Vitest
npm test

# Watch mode for tests
npm run test:watch

# Run end-to-end tests with Playwright
npm run test:e2e

# Open Playwright UI for interactive testing
npm run test:e2e:ui

# Build the application
npm run build
```

### Unit & Integration Tests

Tests live in `tests/unit/` and are run with Vitest.

```bash
npm test
npm run test:watch
```

### End-to-End Tests

Critical user flows are tested with Playwright. Tests live in `tests/e2e/`.

```bash
npm run test:e2e
```

**Requirements for E2E tests:**

- Must run `npm run build` first
- Requires a seeded development database
- `MONGODB_URI` must point to development MongoDB, never production
- `TEST_ADMIN_EMAIL` and `TEST_ADMIN_PASSWORD` (or seed admin credentials) must be set

**Interactive testing:**

```bash
npm run test:e2e:ui
```

This opens the Playwright inspector where you can step through tests visually.

### Critical Test Flows

The following user journeys should be tested:

1. Visitor opens a publication and reads content
2. Visitor searches for publications
3. Visitor subscribes to the newsletter
4. Admin logs in securely
5. Admin creates a draft publication
6. Admin submits and publishes a publication
7. Admin updates team member details
8. Analytics events are recorded and displayed

---

## 🚢 Deployment

### Vercel (Recommended)

Money Wise is optimized for deployment on **Vercel**:

1. Push your branch to GitHub
2. Create a Pull Request to `main`
3. Vercel automatically creates a preview deployment
4. Once merged to `main`, it deploys to production

**Environment setup:**

- Add all `.env` variables to Vercel project settings
- Use separate values for preview and production environments
- Never commit `.env.local` or secrets to Git

### MongoDB Atlas

The production database runs on **MongoDB Atlas**:

1. Create a production cluster (separate from development)
2. Whitelist Vercel IP addresses in the Atlas firewall
3. Use the production connection string as `MONGODB_URI` in production environment variables

### Cloudinary

Image uploads are handled by **Cloudinary**:

1. Use your production Cloudinary account credentials
2. Store `CLOUDINARY_API_SECRET` only on the server (never in the browser)
3. The application uploads images to your Cloudinary account and embeds optimized URLs

### Preview vs Production

- **Preview Deployments** — Created automatically for every pull request on Vercel
- **Production Deployment** — Triggered when code is merged to `main`

Each environment has its own set of environment variables. Configure them separately in Vercel project settings.

---

## 📚 Documentation

For detailed information about Money Wise, see:

- **[PRD.md](./docs/PRD.md)** — Product vision, features, goals, and audience
- **[DOCS.md](./docs/DOCS.md)** — Technical architecture, stack decisions, and implementation details
- **[CONTRIBUTING.md](./docs/CONTRIBUTING.md)** — How to contribute, branch naming, PR workflow
- **[tasks.md](./docs/tasks.md)** — Delegated engineering tasks and assignments

---

## 🤝 Contributing

### Branch Naming

Create branches with clear, descriptive names:

```text
feat/feature-name          # New feature
fix/bug-description        # Bug fix
docs/documentation-topic   # Documentation
refactor/component-name    # Code refactoring
```

Example:

```bash
git checkout -b feat/rate-limiting
git checkout -b docs/project-readme
```

### Workflow

1. Create a new branch from `main`:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b your-branch-name
   ```

2. Make your changes and commit:

   ```bash
   git add .
   git commit -m "Clear, descriptive commit message"
   ```

3. Push to GitHub:

   ```bash
   git push origin your-branch-name
   ```

4. Open a Pull Request on GitHub:
   - Link the PR to the relevant task or issue
   - Describe your changes clearly
   - Request review from the team
5. Address review feedback and update your branch
6. Once approved, merge to `main`

### Code Quality Standards

Before pushing, ensure:

```bash
npm run lint        # No linting errors
npm run typecheck   # No TypeScript errors
npm test            # All tests pass
npm run build       # Build succeeds
```

### Secrets & Security

> ⚠️ **Critical: Never commit secrets to Git.**

- Do not commit `.env.local`
- Do not include real API keys, passwords, or connection strings in code
- Use `.env.example` to document required variables only
- Rotate compromised credentials immediately

---

## 💬 Questions?

If you have questions about setup, architecture, or contributing:

1. Check the relevant documentation (PRD, DOCS, CONTRIBUTING)
2. Review existing issues on GitHub
3. Ask in the project discussions or reach out to the team

Happy contributing! 🚀