# AKSUM - Project Context

*Last updated: reflects conversation history through the CMS foundation, public/DB bridge, proxy performance fix, User Management, Settings, Category edit, Save button fix, sign-in hydration fix, and Comments system. Update this file whenever architecture changes.*

---

## 1. Project Overview

- **Name:** AKSUM
- **Purpose:** A premium, bilingual (English/Amharic) Ethiopian global media platform - news, culture, business, opinion, investigations, video, podcasts, magazine, membership.
- **Business goal:** Build a media company with the editorial credibility of NYT/BBC/Bloomberg, but genuinely Ethiopian - bilingual by design, purchasing-power-aware pricing, WhatsApp-native sharing.
- **Target audience:** Primary - Ethiopians in Ethiopia, youth, professionals. Secondary - diaspora, international readers interested in Ethiopia/Africa.
- **Problem being solved:** No existing Ethiopian outlet combines international-grade production values with true bilingual/bicultural product design.
- **Current stage:** Public site now reads real Articles, Categories, and Authors live from Postgres. Full admin CMS operational (Dashboard, Categories with hierarchy, Tags, Media Library, Article CRUD, User Management, Settings, Comments moderation). Video, Podcast, Events, Topics, Photo Stories, and Digital Editions remain on mock data - no admin CRUD exists for them yet.
- **Long-term vision:** Full production media company - real CMS-driven public site (all content types), membership payments, real email delivery, personalization.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | Chosen at project start; user is a JS/Next.js developer |
| Language | TypeScript | Type safety across a large, multi-entity codebase |
| Styling | Tailwind CSS v4 (CSS-first @theme) | Ships with create-next-app; v4's @theme approach used instead of legacy tailwind.config.ts |
| ORM | Prisma 5.22.0 (deliberately, not 7) | Prisma 7 requires native driver adapters (better-sqlite3) that failed to compile on this Windows machine; rolled back to Prisma 5 |
| Database | PostgreSQL via Neon (serverless) | Chosen over local Postgres install to avoid repeating native-module pain. Free-tier auto-suspends on idle; a "Can't reach database server" error after inactivity is normal cold-start behavior, not a bug - retry/restart resolves it |
| Auth | Auth.js / NextAuth v5 (beta) | Credentials + Magic Link + Google in one config. Role now cached in the JWT (see Section 13) for performance |
| i18n | next-intl | Locale-as-route-segment ([locale]), bilingual content modeled as _en/_am field pairs |
| Rich text | TipTap | Stores article body as structured JSON, rendered to HTML server-side via @tiptap/html for public display |
| File storage | Vercel Blob | User's stated preference, simplicity if deploying on Vercel later |
| Password hashing | bcryptjs | Standard for Credentials provider |
| Validation | Zod | All Server Actions validate input before touching the database |
| Icons | lucide-react | Used throughout UI |
| Carousels | embla-carousel-react | Homepage Entertainment/Video/Podcast carousels |

Not yet chosen / Not Yet Implemented:
- Payment provider (Membership checkout is a placeholder form)
- Transactional email provider (magic link prints to terminal in dev mode)
- Real headless CMS (explicitly rejected in favor of custom admin dashboard)

---

## 3. Folder Structure
app/
layout.tsx - TRUE root layout (owns html/body, fonts). Required because /admin sits outside [locale].
globals.css - Tailwind v4 entry (@import "tailwindcss" + @theme block)
[locale]/
layout.tsx - Locale-scoped providers only (NextIntlClientProvider, SessionProvider)
(marketing)/ - Public editorial site (Header/Footer layout)
(app)/ - Authenticated account pages (account, saved, following, preferences, onboarding)
admin/ - Custom CMS admin dashboard. OUTSIDE [locale] intentionally.
layout.tsx - Auth + role gate, sidebar, topbar
page.tsx - Dashboard (stats + recent activity)
categories/ - List, create form; categories/[id]/ - edit page (NEW)
tags/, media/, articles/
users/ - User Management: list + inline role dropdown (NEW)
settings/ - Site settings form, singleton row (NEW)
api/
auth/[...nextauth]/, auth/register/
admin/upload/, admin/media/
saved-articles/, followed-topics/
search/

components/
ui/, layout/, homepage/
article/ - ArticleHeader, ArticleMeta (now includes inline always-visible SaveButton), ArticleBodyRich (NEW - renders TipTap HTML), SaveButton (restyled, no longer hidden below 1024px), ReadingProgressBar, ShareRail (Save button removed from here), CommentSection (NEW - real DB-backed, replaces placeholder)
admin/ - AdminSidebar, AdminTopbar, AdminTable, RichTextEditor, MediaUploader, MediaGrid, MediaPickerModal, ConfirmDeleteButton, StatCard, RecentActivity, UserRoleSelect (NEW)

content/
types/ - TypeScript interfaces (still used as the shared shape for both mock and DB-backed fetchers)
cms/mock/ - Mock data for content types NOT yet bridged: videos, podcasts, events, topics, photoStories, editions
cms/db/ - NEW: mapDbArticleToArticle.ts - the single mapping function from Prisma's Article shape to the app's Article type
cms/fetchers/ - Article/Category/Author fetchers NOW query Prisma directly. Video/Podcast/Event/Topic/PhotoStory/Edition fetchers still read from cms/mock/

lib/
prisma.ts, cn.ts, renderTiptapJson.ts (NEW - TipTap JSON to HTML via @tiptap/html)
admin/
permissions.ts, getDashboardStats.ts
actions/ - categoryActions.ts (now supports parentId), tagActions.ts, mediaActions.ts, articleActions.ts, userActions.ts (NEW), settingsActions.ts (NEW), commentActions.ts (NEW)

prisma/
schema.prisma - User (+slug/bio/beat), Account, Session, VerificationToken, SavedArticle, FollowedTopic, Category (+parentId self-relation), Tag, Media, Article (+isBreaking), ArticleTag, SiteSettings (NEW, singleton), Comment (NEW)

config/ - navigation.ts, categoryAccentColors.ts, pricing.ts
styles/ - tokens.css, typography.css

auth.ts - jwt callback now caches role in the token (was: session callback re-queried DB every time)
proxy.ts - unchanged in structure; dramatically faster now since it no longer triggers a DB query per request
types/next-auth.d.ts
What should never be placed where:
- Do not put database queries directly in Client Components - always via Server Actions or API routes.
- Video/Podcast/Events/Topics/PhotoStories/Editions still expect mock data shape - do not assume they read from Prisma.
- Do not hardcode /en/ in redirects - always thread locale through as a prop (this was fixed in SaveButton and the Follow/Save flow).

---

## 4. Architecture

### Data flow - UPDATED, PARTIALLY RESOLVED
[Admin CMS] ---writes---> [Postgres: Article, Category, Tag, Media, User, Comment, SiteSettings]
|
v <-- NOW CONNECTED for Article/Category/Author
|
[Public Site] ---reads---> real DB for: Homepage, Article pages, Category pages, Search, Opinion/Investigations, Author pages, Comments
---reads---> content/cms/mock/* STILL for: Video, Podcast, Events, Topics, Photo Stories, Digital Editions
This is a real, confirmed improvement over the prior state, but NOT a complete bridge - the six content types listed above have no admin CRUD and still serve mock data. Treat any claim of "fully CMS-driven" as false until those are addressed (see Pending Tasks).

### Category hierarchy (NEW)
`Category` now has a self-relation (`parentId` / `parent` / `children`) to support the site's existing `/news/politics`-style subcategory routing. The mapping function (`content/cms/db/mapArticle.ts`) treats an article's category as the "subcategory" if that category has a parent, and uses the parent's slug as the top-level `category` field - this is how the public site's existing `[category]/[[...subcategory]]` route continues to work unchanged.

### Auth/session performance fix (NEW - important)
`session.user.role` is no longer fetched from the database on every request. Instead:
- `auth.ts`'s `jwt` callback queries the DB once, at sign-in, and stores `role` in the JWT.
- The `session` callback just reads `token.role` - no DB call.
- **Tradeoff:** a role change made via `/admin/users` does NOT take effect on that user's already-issued session until they sign out and sign back in. This is called out explicitly in the `UserRoleSelect` UI when an Admin changes their own role.
- Measured impact: `proxy.ts` timings dropped from consistently 400-1500ms per request to single-to-low-double-digit milliseconds.

### Comments (NEW)
Real, database-backed. `Comment` model keyed by `articleSlug` (string, not a foreign key - same pattern as `SavedArticle`/`FollowedTopic`, since not all content types are DB-backed yet). Authenticated users can post; owners or Admin/Editor roles can delete. No moderation queue, no rate-limiting, no pagination yet (see Pending Tasks).

---

## 5. Database Design

| Model | Purpose | Notable changes this round |
|---|---|---|
| User | Auth.js user; role, membershipTier | Added `slug`, `bio`, `beat` (used by the now-live Author pages); added `comments` relation |
| Account, Session, VerificationToken | Auth.js standard tables | Unchanged |
| SavedArticle, FollowedTopic | User's saved articles / followed topics, slug-keyed | Unchanged |
| Category | Real CMS category | Added self-relation: `parentId`, `parent`, `children` - enables subcategory hierarchy |
| Tag | Real CMS tag | Unchanged |
| Media | Uploaded file metadata (Vercel Blob) | Unchanged |
| Article | The real CMS article | Added `isBreaking` boolean (not yet surfaced in the admin form UI - schema-only for now, see Pending Tasks) |
| ArticleTag | Join table | Unchanged |
| **SiteSettings** | NEW - singleton row (`id: "singleton"`) holding site name, taglines, default SEO description, contact email, social links | Created/upserted lazily on first visit to `/admin/settings` |
| **Comment** | NEW - `articleSlug` (string), `content`, `userId` relation | Slug-keyed rather than FK'd to `Article`, consistent with SavedArticle/FollowedTopic pattern |

Enums unchanged: `Role` (SUBSCRIBER, AUTHOR, EDITOR, ADMIN), `ArticleStatus` (DRAFT, SCHEDULED, PUBLISHED, ARCHIVED).

**Needs Verification:** whether additional indexes are needed for query performance at scale.

**Known edge case, not fixed:** `Category.parentId` self-relation has no cycle-prevention beyond excluding a category from being its own direct parent. A multi-level cycle (A -> B -> A) is theoretically possible if someone deliberately constructs one via the edit form. Low real-world risk given expected category count, but not airtight.

---

## 6. Environment Variables

Unchanged from prior version: `DATABASE_URL`, `AUTH_SECRET`, `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (still untested), `BLOB_READ_WRITE_TOKEN`.

---

## 7. Features

| Feature | Status | Notes |
|---|---|---|
| Public site: Homepage, Article, Category, Search, Opinion/Investigations, Author pages | **Done, reading from real Postgres DB** | Confirmed working end-to-end with a real published article |
| Video / Podcast / Events / Topics / Photo Stories / Digital Editions | Done (UI), still on mock data | No admin CRUD exists for these |
| Membership pricing / Newsletter | Done (UI only) | No real payment/email backend |
| Auth: Credentials, Magic Link | Done, tested | |
| Auth: Google | Built, still NOT tested | Needs real OAuth credentials |
| Saved Articles | **Done, tested, discoverability fixed** | SaveButton now inline next to byline, visible at all viewport widths |
| Follow Topic | Done, tested | |
| Admin: Dashboard, Categories, Tags, Media, Articles | Done, tested | Categories now support parent/child hierarchy and have a real edit page |
| Admin: User Management | **Done, tested** | Role dropdown, last-Admin-demotion guard confirmed working |
| Admin: Settings | **Done, tested** | Real persistence confirmed via save-then-reload test |
| Comments | **Done, tested - real feature, not placeholder** | Post, display, delete (owner or moderator), sign-in gating all confirmed |
| Sign-in page hydration warning | **Fixed, confirmed** | Root cause: SessionProvider client fetch racing hydration in HeaderAuthStatus; fixed with a mounted-guard pattern |
| proxy.ts performance | **Fixed, confirmed** | Role moved into JWT; DB query no longer runs per-request |
| ForYouRail | Not Yet Implemented | Deliberately deferred |
| Article.isBreaking | Schema exists, no admin UI toggle yet | |
| body_am (Amharic article body) | Schema exists, no TipTap editor UI for it yet | English-only editing currently |

---

## 8. UI/UX Guidelines

Unchanged from prior version, with one correction: the Save button is **no longer** part of the `hidden lg:flex` ShareRail - it now lives inline next to the byline in `ArticleMeta`, visible at every viewport width. The share-icon rail (WhatsApp/X/Facebook/email/copy-link) remains desktop-only (`hidden lg:flex`) by original design intent.

---

## 9. Coding Standards

Unchanged, plus one new rule:
- When adding any feature that depends on `useSession()` or other client-only state in a component that also renders during SSR, guard the first client render with a `mounted` flag so the initial client render matches the server render exactly - this is the fix pattern used for the sign-in hydration bug and should be reused if similar warnings appear elsewhere.

---

## 10. Current Progress

**Completed this round:** Public site bridged to real DB for Articles/Categories/Authors. Category parent/child hierarchy added, with a real edit page. proxy.ts performance fixed (JWT-cached role). User Management page (list, role change, last-Admin guard). Settings page (real persistence). Save button visibility fixed. Sign-in hydration warning fixed. Full Comments system built and tested.

**Not started:** Bridging Video/Podcast/Events/Topics/PhotoStories/Editions to the database. Google OAuth testing. Real email delivery. ForYouRail. Author-reassignment UI. Admin UI for `isBreaking` and `body_am`. Comment moderation queue/pagination/rate-limiting.

---

## 11. Pending Tasks

**High Priority**
- Bridge the remaining content types (Video, Podcast, Events, Topics, Photo Stories, Digital Editions) to real database models - currently no admin CRUD exists for any of them.
- Complete Google OAuth setup and test.
- Real transactional email provider for magic links.

**Medium Priority**
- Admin UI toggle for `Article.isBreaking` (schema supports it, form doesn't expose it).
- Amharic (`body_am`) TipTap editing in the admin.
- Author-reassignment UI for Editor/Admin when creating/editing articles (currently forced to the logged-in user).
- Comment pagination and basic rate-limiting (currently unlimited, unpaginated).

**Low Priority**
- ForYouRail personalized homepage module.
- Category parent-cycle validation (multi-level cycle currently possible in theory).
- Comment moderation queue / reporting for Editors-Admins beyond simple delete.

**Future Ideas**
- Real payment integration for Membership checkout.
- Full removal of the mock data layer once all content types are bridged.

---

## 12. Known Issues

1. Video/Podcast/Events/Topics/PhotoStories/Editions still mock-data-only - no admin CRUD.
2. Role changes require sign-out/sign-in to take effect (JWT-caching tradeoff, by design - not a bug, but a real UX gap worth a "force re-login" affordance later).
3. Category self-relation has no deep cycle prevention (see Section 5).
4. Comments have no pagination, rate-limiting, or moderation queue - only inline delete by owner/moderator.
5. Prisma pinned to 5.22.0 - Prisma 7's native driver adapters failed to compile on this Windows environment.
6. Neon free-tier cold-start: a "Can't reach database server" error after idle periods is expected behavior, not a bug - retry/restart resolves it.
7. `Article.isBreaking` and `body_am` exist in the schema but have no admin UI yet.

**Resolved this round (moved from prior Known Issues):** Save button visibility, sign-in hydration mismatch, proxy.ts performance, TipTap duplicate link extension warning, empty category dropdown (was a test-data artifact, not a bug).

---

## 13. Important Design Decisions

New decisions this round (append-only, prior table entries unchanged - see original for Prisma 5/Neon/Vercel Blob/custom-CMS/TipTap-JSON/ArticleTag/slug-string/admin-outside-locale/flag-palette decisions):

| Decision | Alternatives considered | Reasoning |
|---|---|---|
| Role cached in JWT instead of re-queried per request | Keep DB lookup in session callback (original approach) | proxy.ts was adding 400-1500ms to nearly every request; JWT caching is the standard Auth.js pattern for this, with an accepted tradeoff of requiring re-login after a role change |
| Category self-relation (parentId) added retroactively | Keep categories flat, fake hierarchy in routing only | The public site's routing/nav already assumed subcategories existed; faking it further would have compounded the mock/DB mismatch instead of resolving it |
| TipTap body rendered server-side via @tiptap/html | Store/render raw HTML directly; render JSON client-side | Keeps the XSS-safety benefit of JSON storage while still producing real server-rendered HTML for the public site |
| Comment.articleSlug as a string, not a foreign key | FK to Article.id | Consistency with the existing SavedArticle/FollowedTopic pattern; also comments needed to work the moment DB-backed articles existed, without waiting on a separate migration |
| HeaderAuthStatus mounted-guard for hydration fix | Investigate/patch whitespace or JSX structure instead | The actual root cause was a client-only session fetch racing hydration, not a markup issue - the mounted-guard is the correct, standard fix for this class of Next.js + Auth.js hydration warning |

---

## 14. API Documentation

Additions this round (prior endpoints unchanged):

**Server Actions:**
- `lib/admin/actions/userActions.ts`: `updateUserRole(userId, newRole)` - Admin-only, includes last-Admin-demotion guard
- `lib/admin/actions/settingsActions.ts`: `updateSiteSettings(formData)` - Admin-only, upserts the singleton SiteSettings row
- `lib/admin/actions/commentActions.ts`: `createComment(formData)` - any signed-in user; `deleteComment(id)` - owner or Admin/Editor
- `lib/admin/actions/categoryActions.ts`: `createCategory`/`updateCategory` now accept `parentId`

---

## 15. Reusable Components

Additions/changes this round:
- **`ArticleBodyRich`** (NEW) - renders server-generated HTML from TipTap JSON via `dangerouslySetInnerHTML`, styled by `article-body-rich.css` (hand-rolled prose styles, no Tailwind Typography plugin in use).
- **`SaveButton`** (changed) - no longer lives only inside the desktop-only ShareRail; now also rendered inline in `ArticleMeta`, always visible.
- **`HeaderAuthStatus`** (changed) - added a `mounted` guard to fix a hydration mismatch; renders an invisible placeholder on first client paint before swapping to real Sign In/Account UI.
- **`CommentSection`** (changed) - full rewrite from a static placeholder to a real Server-Action-backed component with post/list/delete.
- **`UserRoleSelect`** (NEW) - inline role dropdown with optimistic UI, error rollback, and a "sign out and back in" notice when a user changes their own role.

---

## 16-20 (Styling, Performance, Security, Deployment, Testing)

No structural changes this round beyond what's noted above (proxy.ts performance fix belongs conceptually under Section 17, already covered in Section 4/12/13). Deployment and Testing remain **Not Yet Implemented**.

---

## 21. AI Collaboration Guide

Additional rule this round: **Do not assume any given content type (Video, Podcast, Events, Topics, Photo Stories, Digital Editions) reads from the database.** Only Article, Category, and Author-related fetchers were bridged in this round - check `content/cms/fetchers/*` directly before making claims either way.

---

## 22. Development History

Continuing from the prior list (steps 1-11 - see original entries), this round added:

12. Bridged public site fetchers (Article/Category/Author) from mock data to real Prisma queries; added Category self-relation for hierarchy; added TipTap-JSON-to-HTML server rendering.
13. Diagnosed and fixed a Neon "Can't reach database server" error as free-tier cold-start behavior (not a code bug).
14. Fixed proxy.ts performance by moving `role` into the JWT via a new `jwt` callback, eliminating a per-request database query.
15. Built User Management (role changes, last-Admin-demotion guard).
16. Built Settings page (singleton SiteSettings model, real persistence).
17. Built Category edit page (previously create/delete only).
18. Fixed Save button discoverability (moved out of the desktop-only ShareRail into an always-visible position next to the byline).
19. Diagnosed and fixed the sign-in page hydration mismatch (mounted-guard pattern in HeaderAuthStatus).
20. Built a real, database-backed Comments system (previously a static placeholder).

---

## 23. Decision Log

See Section 13 - continue appending new decisions there.

---

## 24. Change Log

| Date | Files Changed | Reason | Summary |
|---|---|---|---|
| Needs Verification | prisma/schema.prisma, content/cms/fetchers/*, content/cms/db/mapArticle.ts | Bridge public site to real DB | Articles/Categories/Authors now DB-backed |
| Needs Verification | auth.ts, proxy.ts | Performance | Role cached in JWT, eliminated per-request DB query |
| Needs Verification | app/admin/users/*, lib/admin/actions/userActions.ts | New feature | User Management UI |
| Needs Verification | app/admin/settings/*, lib/admin/actions/settingsActions.ts, prisma/schema.prisma (SiteSettings) | New feature | Settings page |
| Needs Verification | app/admin/categories/[id]/* | New feature | Category edit page |
| Needs Verification | components/article/SaveButton.tsx, ArticleMeta.tsx, ShareRail.tsx | Bug fix | Save button visibility below 1024px |
| Needs Verification | components/layout/HeaderAuthStatus.tsx | Bug fix | Sign-in page hydration mismatch |
| Needs Verification | prisma/schema.prisma (Comment), components/article/CommentSection.tsx, lib/admin/actions/commentActions.ts | New feature | Real Comments system |

*Continue appending below this line with real dates going forward.*

---

## 25. Future Vision

Unchanged from prior version - see original. Progress toward "fully CMS-driven public site" is now partial (Articles/Categories/Authors done; six content types remain).

---

## 26. Quick Start Guide

Unchanged, with one addition to step 6: after promoting a user to ADMIN via Prisma Studio, that user must sign out and sign back in for the role to take effect (see Section 4, JWT caching).

---

## 27. File Reference Index

New entries this round:
- `content/cms/db/mapArticle.ts` - the single source of truth for converting a Prisma Article (with category/parent/author/tags included) into the app's shared `Article` type. Any new DB-backed fetcher should reuse this rather than re-deriving the shape.
- `lib/renderTiptapJson.ts` - server-side TipTap JSON to HTML conversion; wrap any errors gracefully (returns empty string on failure rather than throwing).
- `auth.ts` - now has both `jwt` and `session` callbacks; role logic lives in `jwt`, not `session`.

---

## 28. Glossary

Unchanged - see original.

---

## 29. Maintenance Rules

Unchanged - see original. This update itself follows the append-only/never-delete-history rule: prior sections not mentioned above are assumed unchanged from the previous version of this document.
