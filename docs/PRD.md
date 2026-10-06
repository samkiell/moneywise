# Money Wise Product Requirements Document

## 1. Product Overview

Money Wise is the official magazine of the Writing Team of the OAU Cowrywise Community. It exists to promote financial literacy while giving community members a platform for stories, ideas, education, expression, and meaningful conversations.

The product is a modern editorial website, not a generic corporate site.

### Core message

> We write to inform. We create to inspire. We publish to empower.

## 2. Goals

- Publish high-quality Stories and Tabloids.
- Make publications easy to discover and read.
- Showcase the editorial team.
- Allow non-technical editors to manage publications and team members.
- Grow a newsletter audience.
- Provide useful first-party analytics inside the admin dashboard.
- Build a fast, accessible, mobile-first publication platform.

## 3. Audience

- OAU Cowrywise Community members.
- Students and young adults interested in financial literacy and personal development.
- Readers interested in career, digital skills, entrepreneurship, relationships, and community stories.

## 4. Content Pillars

Content is guided by five Cowrywise Community pillars:

1. Financial Literacy
2. Career Development
3. Digital Literacy
4. Entrepreneurial Development
5. Quality Connections

## 5. Public Pages

### Homepage
- Brand introduction
- Featured publication
- Latest Stories
- Latest Tabloids
- Community pillars
- Team preview
- Newsletter CTA

### Stories
Creative and narrative publications including:
- Community spotlights
- Fiction and series
- Poems
- Biographies
- Personal stories
- Interviews

### Tabloids
Educational and fact-based publications including:
- Financial literacy
- Career
- Digital literacy
- Entrepreneurship
- Quality connections
- Subject analysis
- Opinion
- Community news

### Publication detail
- Title
- Cover image
- Excerpt
- Author
- Category
- Tags
- Published date
- Reading time
- Rich article content
- Related publications
- Share actions

### About
Use the approved Money Wise description supplied by the editorial team.

### Meet the Team
Display active editorial team members dynamically from MongoDB.

Current members:
- Chief Editor: Bello Oluwaferanmi Enoch
- Articles Copy Editor: Odedele, Rereloluwa Oluwasegun
- Stories Copy Editor: Fagbewesa Adeola Ayomide
- Stories Line Editor: John Kolade Akande
- Articles Line Editor: Adeshola, Faridah Eniola

### Newsletter
- Subscription form
- Newsletter archive when newsletters are published

### Search
Search publications by title, content, category, tags, and author.

## 6. Newsletter

Visitors can subscribe with their email address.

V1 requirements:
- Validate email.
- Prevent duplicate subscriptions.
- Store subscribers in MongoDB.
- Provide subscriber management in admin.
- Provide a newsletter archive structure.

Email delivery automation is intentionally not part of the first implementation. A provider can be integrated later.

## 7. Admin CMS

Protected admin application.

Routes:

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

### Publication workflow

Draft -> Review -> Published

Editors must be able to:
- Create publications
- Edit publications
- Save drafts
- Submit for review
- Publish
- Unpublish
- Feature/unfeature
- Manage categories and tags
- Upload/select cover images

### Team management

Admins can:
- Add members
- Edit members
- Upload photos
- Change roles
- Reorder members
- Activate/deactivate members

No team member should be hardcoded into the public UI.

## 8. Analytics

Money Wise will use a first-party analytics system built into the application. Vercel Analytics is not required.

Admin analytics should show:
- Total page views
- Unique visitors
- Publication views
- Most-read publications
- Stories vs Tabloids performance
- Top pages
- Newsletter subscriptions
- Search activity
- Referrers
- Device breakdown
- Daily, weekly, and monthly trends
- Publication engagement

Analytics events should be stored in MongoDB and aggregated server-side.

The system should avoid collecting unnecessary personal information. Do not store raw sensitive data.

## 9. Roles

### Admin
- Full CMS access
- Manage users
- Manage publications
- Manage team
- Manage subscribers
- View analytics
- Manage settings

### Editor
- Create/edit publications
- Submit publications for review
- Publish where permitted by policy
- View relevant content analytics
- No user/permission management

Exact permission enforcement should be centralized rather than scattered across components.

## 10. Design

### Brand palette

- Primary Blue: #0055FF
- Primary Dark: #003399
- Background: #F8FAFC
- Surface: #FFFFFF
- Text: #0F172A
- Secondary Text: #64748B
- Border: #E2E8F0
- Accent Yellow: #FFD54A
- Success: #16A34A
- Error: #DC2626

Visual direction:
- Editorial
- Clean
- Modern
- Typography-led
- Mobile-first
- Blue, white, and dark text as the dominant system
- Yellow used as an accent, not the primary color

The site may take inspiration from the Cowrywise visual identity but must have its own Money Wise identity.

## 11. Non-functional requirements

- Responsive across mobile, tablet, and desktop.
- Strong accessibility fundamentals.
- Semantic HTML.
- Keyboard navigation.
- Proper heading hierarchy.
- Alt text for meaningful images.
- Good Core Web Vitals.
- Server Components by default.
- Client Components only when interaction requires them.
- Secure admin routes.
- Server-side validation.
- Rate limiting for public forms.
- No database credentials exposed to clients.
- SEO metadata for every publication.
- Open Graph metadata.
- Sitemap and robots.txt.
- Canonical URLs.
- Article structured data.

## 12. V1 Scope

### Must have
- Homepage
- Stories
- Tabloids
- Publication pages
- About
- Meet the Team
- Search
- Newsletter subscription
- Admin authentication
- Publication CMS
- Team CMS
- Subscriber management
- First-party analytics dashboard
- Image upload
- SEO
- Responsive UI
- MongoDB integration

### Not V1
- Comments
- Likes
- AI writing
- Mobile application
- Social login
- Recommendation engine
- Complex email automation
- Advanced analytics platform
- Public user accounts

## 13. Success Criteria

V1 is ready for launch when:
- Editorial members can manage publications without changing code.
- Team members can be changed from admin.
- Visitors can discover and read publications on mobile and desktop.
- Newsletter subscriptions are reliably stored.
- Admins can understand basic site and publication performance.
- The application passes production security, accessibility, and performance checks.
