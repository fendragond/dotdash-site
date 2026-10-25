# ATLASEO — Technical Context Document

> **This document is part of a 3-doc system.**
> - **`ATLASEO_strategy.md`** — vision, positioning, pricing, 12-month plan (read first for business decisions)
> - **`ATLASEO_context.md`** — this file. Technical methods, infrastructure, indexation protocol, hard rules (applies to all projects)
> - **`atlaseo-ma_brief.md`** (or `<client>_brief.md`) — current project being worked on
>
> **Hierarchy**: Strategy is the source of truth for *what* and *why*. Context is the source of truth for *how*. Brief is the source of truth for *this specific project*. When in doubt, strategy wins.
>
> **Last updated**: 2026-08-09 — v2.2 (ODBM REX integration: Resend consolidated as prod-validated standard (result.error, SPF/DKIM/DMARC, DMARC hardening); server-output form backend pattern; skeleton-in-staging promoted to standard client-validation method; CMS recommendation switched Decap→Sveltia; R2 self-hosted media pipeline; grep-able {{TODO}} marker convention; day-1 bootstrap checklist; external-delay kickoff framing; system-layer-is-not-brand principle; Tailwind v4; Cloudflare trailing-slash serving caveat; bilingual FR/EN + RTL starter readiness (post-ODBM). Technical gotchas remain sourced from docs/cursor_gotchas.md)

---

## 1. Tech Stack

| Tool | Role |
|---|---|
| **Astro** | Static site framework — standard for all ATLASEO sites |
| **Tailwind CSS** | Styling — utility-first, Tailwind v4 with the @config pattern |
| **Cloudflare Workers + Static Assets** | Hosting (NOT Pages — deprecated) |
| **Wrangler CLI** | Deployment tool (`wrangler deploy`) |
| **GitHub** | Version control, one repo per client site |
| **Cursor** | AI code generation and maintenance |
| **Claude Pro** | Strategy, content, SEO, briefs, problem solving |
| **Stitch** | Design mockups |

---

## 2. Infrastructure Decisions

### Cloudflare
- Cloudflare Pages is **deprecated** — do not use for new projects
- All new sites use **Workers Static Assets** (Wrangler v4+)
- One Worker = one client site
- `wrangler.toml` (or `wrangler.jsonc`) per project handles static assets + any dynamic routes
- No database needed for current scope

### Contact / CTA Strategy (per client)
- **Option A** — Pure static: WhatsApp link, click-to-call, mailto, socials. Zero backend. Default for simple clients.
- **Option B** — Worker contact form: POST request → validate → send email via Resend. For corporate clients.
- **Option C** — Both: form + floating WhatsApp button. Best for Moroccan market conversion.
- Template ships with both patterns as toggleable components. Decided at project setup, not rebuild.

### Form-Backed Submissions (forms with attachments or sensitive data)

The default for client sites remains Option A (pure static + WhatsApp/mailto). When a project requires file uploads (CVs, documents) **or** the submission of personal data (job applications, leads with PII), the pattern is:

**Frontend form → Worker route (e.g. `/api/candidature`) → Resend API → recipient mailbox** with the uploaded file forwarded as an email attachment.

**Resend** is the standard transactional email provider — validated in production on ODBM — chosen for developer experience and reliable deliverability, with a free tier sufficient for sub-3000 sends/month per client.

**Mandatory components for any such form:**
- Honeypot field (anti-spam, invisible to humans)
- Cloudflare rate limiting at the Worker level
- Explicit CNDP/RGPD consent checkbox, blocking submission if unchecked
- Server-side validation of file type (PDF/DOC/DOCX only by default) and size (max 5MB by default)

**Optional:** archive uploads to Cloudflare R2 if the client requests retention.

The Resend pattern is **validated in production** (ODBM, first client). Env vars are secrets (never in wrangler vars, never inline) — set locally in `.dev.vars`, in prod via `wrangler secret put`. Key rule: the Resend SDK does not always throw on failure — always check `result.error` on every send. Deliverability: SPF/DKIM/DMARC must be set on the sending domain; start DMARC at `p=none` and harden to `p=quarantine` once deliverability is stable. Implementation details, DNS specifics, and the manual MX `send` record fix live in `docs/cursor_gotchas.md`.

**Server-output pattern (forms without losing static):** when a project needs an on-demand route (contact/candidature backend), the site moves from fully static to `output: 'server'`, while every content page stays prerendered via a per-page `prerender = true` and only the API route is `prerender = false`. This keeps static performance while enabling the backend. Reusable for any future ATLASEO client with a form backend. Astro 6 env access and the exact config are in `docs/cursor_gotchas.md`.

### Staging URL pattern (pre-domain QA) — Skeleton-in-staging

**Skeleton-in-staging** is the standard client-validation method: no abstract mockup is presented to the client; instead the coded skeleton (built from `DESIGN.md`, deployed to the staging URL) is the validation surface. It serves three functions at once: (1) client validation surface that triggers the payment milestone, (2) exhaustive gap detector — every empty slot is a visible hole, more reliable than a theoretical pending list, surfacing unanticipated blind spots (alt text, meta, social `sameAs` URLs), (3) collection-checklist generator — placeholders use a grep-able `{{TODO:...}}` marker, and a final grep on `{{TODO` produces the exhaustive data-collection list for the client. This is a standard method, not an ODBM one-off.

Every Cloudflare Worker exposes a permanent staging URL of the form `[project-name].fahd-d-d01.workers.dev`. This URL is the canonical staging environment used for: client QA, Lighthouse audits, screenshot capture, and any pre-launch verification.

**Critical implication:** a project can be fully built, QA'd, and validated by the client **before** the production domain is acquired or pointed. This decouples build velocity from domain acquisition delays (e.g. ANRT validation for `.ma` domains can take several weeks).

Once the production domain is configured, the staging URL remains active and can be used for future iterations and A/B testing.

### No Database
- Sites are content sites — no user data, no inventory, no real-time needs
- Content lives in Astro content collections (markdown files)
- Persistence needs (if ever): Cloudflare D1 or KV — not MongoDB
- Client content editing → Sveltia CMS (git-based, no DB), our standard since ODBM. Decap is in semi-stagnation; backend-less GitHub OAuth (PKCE) does not exist, so Sveltia runs with a dedicated OAuth Worker plus a dedicated GitHub account the client never sees a token from. Packaged as an opt-in starter module — see `docs/modules/cms.md`. Not every project needs it (a simple vitrine does not).

### Media pipeline (R2 self-hosted)

Standardized since ODBM. Videos and heavy media are compressed (ffmpeg) and self-hosted on a public R2 bucket served through a custom media domain; the `pub-*.r2.dev` URL is fallback only and never referenced in code. The media base URL is centralized in a dedicated data module (kept separate from the site data module to avoid pulling it into the client bundle). Cloudflare Stream is rejected for vitrine sites (low volume, no free tier). Compression params, the `--remote` upload flag, and custom-domain setup are in `docs/cursor_gotchas.md`.

---

## 3. SEO Technical Implementation

> **Strategic SEO decisions (local SEO priority, target audiences, content plan, GEO/AEO) are in `ATLASEO_strategy.md` §5.** This section covers only the technical implementation that's baked into every site template.

### Astro packages standard
- `astro-seo` — meta tags, canonical, OG tags per page
- `@astrojs/sitemap` — auto-generated sitemap
- Custom `SchemaOrg.astro` component for JSON-LD

### JSON-LD Schema components (reusable)
- `LocalBusiness` for doctors, lawyers, professionals with physical location
- `MedicalBusiness` for medical practices specifically (subtype of LocalBusiness)
- `Organization` for companies
- `FAQPage` for pages with structured Q&A sections
- `BreadcrumbList` for all internal pages
- `Service` for pricing/pack pages
- `Article` for blog posts

### Per-page SEO baseline
- Unique `<title>` ≤60 chars, keyword-rich
- Unique `<meta description>` ≤155 chars, include emoji ☎️ + phone number for CTR boost
- Self-referencing canonical tag matching the actual served URL exactly
- OG tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Meta robots: `index, follow` for content pages; `noindex` for legal pages and aggregator-only pages

### Standard files in every project
- `public/robots.txt` — allow all important pages
- `public/sitemap-index.xml` — only canonical content pages, no thank-you pages or thin content
- `src/components/seo/SchemaOrg.astro`
- `src/components/contact/` — WhatsApp + form variants

### Analytics standard
- GA4 + Cloudflare Web Analytics on every site
- Google Search Console setup within 24h of launch (non-negotiable)
- Track as GA4 conversions: contact form submissions, call clicks, WhatsApp clicks

### Mobile-first baseline (Morocco-specific)
- 85% of Moroccan web traffic is mobile — design and test mobile first
- LCP mobile target: <2.5s (preload hero image mandatory)
- Lighthouse mobile target: ≥90 on all 4 categories
- Lighthouse desktop target: ≥95 on all 4 categories

---

## 4. Workflow Model

### AI Cost Reduction Rule
> **Claude Pro = thinking. Cursor = typing.**

- Use Claude Pro for: strategy, content, French copy, SEO research, page structure, discovery questions, briefs
- Output one `brief.md` per project — Cursor works from this document
- Cursor never re-derives decisions already made in the brief
- Build prompt templates in Claude Pro Projects — one Project per client
- Starter template reduces Cursor usage ~60% vs building from scratch

### Cursor prompt conventions

- **Language:** all Cursor prompts are written in English, regardless of the editorial content language. French content goes inside the prompt as quoted strings or instructions.
- **Format:** prompts are formatted as **plain text inside a code block** (triple backticks with no language tag), never inside blockquotes — this ensures the copy button appears reliably in the Claude UI.
- **Intent-based:** prompts describe **what** to build and **why**, never **what code** to write. Cursor is the one writing code. Embedding actual code in a prompt defeats the workflow.
- **One concern per prompt:** prompts are split into logical chunks — one prompt equals one component, one page, or one feature. Avoid omnibus prompts that bundle unrelated concerns.
- **No git/deploy steps inside prompts:** git commit, push, build, and deploy are never inside Cursor prompts. They are separate manual actions performed by the founder after `npm run dev` validation passes.
- **Content production:** Claude generates final editorial content (copy, JSON, schema). Cursor only places it. This prevents Cursor from rewriting validated French copy into mediocre output.
- **TODO marker convention:** every unvalidated placeholder — any data awaiting client input — is marked with a grep-able `{{TODO:name}}` marker. This is what turns the staging skeleton into an exhaustive gap detector and a collection-checklist generator (see the Skeleton-in-staging method in §2): a final grep on `{{TODO` produces the complete list of data to collect from the client. Marker names are canonical from day 1, no client suffix (one role = one name). On ODBM, skipping day-1 normalization forced a corrective grep audit later — avoid that by fixing canonical names at project start. The never-silently-empty rule and the `isProvided()` guard are in `docs/cursor_gotchas.md`.

### Per-Project Flow
1. **Discovery** — client questionnaire → define pages, CTAs, content needs, SEO targets
2. **Brief** — produce `<client>_brief.md` in Claude Pro (content, structure, SEO, component decisions)
3. **Build** — Cursor generates from brief using starter template
4. **SEO pass** — schema, meta, sitemap, GBP setup, Search Console
5. **Launch** — `wrangler deploy`, domain config in Cloudflare, submit to Google
6. **Handoff** — launch checklist, client doc, maintenance agreement

### Deployment Protocol (Workers Static Assets)

> Hard-won lesson from first Cloudflare deployment. Never skip the build step.

**The build/deploy distinction**
- `npm run dev` — local dev server only. Serves directly from `src/`. Changes appear instantly but this has nothing to do with production.
- `npm run build` — compiles everything into `dist/`. This is what Cloudflare gets.
- `npx wrangler deploy` — pushes `dist/` to Cloudflare Workers. Never skip the build before this.

**End-to-end commit/deploy sequence**

The canonical workflow from validated work to live production:

1. **Validate locally** — `npm run dev`, visual + functional check on `localhost:4321`
2. **Single commit** — one commit per page or feature unit (never one commit per micro-change)
3. **Push** — `git push` to `origin main`
4. **Build** — `npm run build` (compiles `src/` into `dist/`)
5. **Deploy** — `npx wrangler deploy` (pushes `dist/` to Cloudflare)

**Cross-reference with existing Windows/PowerShell notes:**
- All five steps run on **separate lines** — never chained with `&&`
- Use `2>$null` instead of `2>/dev/null` where redirection is needed
- Prefer `git add .` over individual path specification for staging

**Until the GitHub Action is set up post-domain, steps 4 and 5 are manual.** After the Action is configured, step 3 alone triggers steps 4 and 5 automatically on every push to `main`.

**Deployment process**

Pre-domain:
1. `npm run build`
2. `npx wrangler deploy`

After domain is configured:
- Set up a GitHub Action to auto-build and deploy on every push to `main`
- From that point: `git push` is enough

**Why this is different from previous projects**
- Cloudflare Pages (used in past projects) auto-builds on every git push — no manual step needed.
- Workers Static Assets (current setup) has no auto-deploy. Wrangler is a manual CLI tool.
- The VS Code three-icon push only does `git push` — Cloudflare never sees it.

**Windows / PowerShell notes**
- `&&` is not a valid command separator — run commands on separate lines
- `2>/dev/null` does not work — use `2>$null` instead
- `true` is not a built-in — use separate commands instead of chaining

---

## 5. Starter Template

### Philosophy
- ATLASEO.ma is **template v1** — every decision made there becomes the reusable starter
- After ATLASEO ships, repo is forked into `atlaseo-starter`
- Every new client = `git clone atlaseo-starter`, then Cursor only touches content + styling

### Standard Sections (components)
- Hero
- Services
- Process / How it works
- Portfolio / Case studies
- Testimonials
- About
- Blog (content collection)
- Contact (WhatsApp CTA and/or form — toggleable)
- Footer

### Standard Files
- `wrangler.jsonc` — Workers Static Assets config
- `astro.config.mjs` — with `@astrojs/sitemap`, `trailingSlash: 'never'`, `site: 'https://domain.ma'` — note: `trailingSlash` governs dev only, not Cloudflare serving; the assets layer redirects `/page` → `/page/` regardless, fixed by `html_handling: 'drop-trailing-slash'` in wrangler.jsonc (see `docs/cursor_gotchas.md`).
- `src/content/` — blog and services collections
- `src/components/seo/` — JSON-LD schema components
- `src/components/contact/` — WhatsApp + form variants
- `public/robots.txt`
- `PROCESS.md` — delivery checklist (see §7)
- `brief.md` — per-project content brief (not committed to starter)

### Reusable components inherited from atlaseo.ma

The atlaseo.ma build is the source for two production-tested components promoted to the starter:

**FAQ Accordion**
A pattern using JS toggle via `data-faq-item` and `data-faq-icon` attributes. Includes automatic `FAQPage` JSON-LD schema generation from the same source data. Arrow icon rotates 180° on open. Single-open or multi-open mode togglable via prop. Mobile-friendly tap targets.

**Sticky Mobile CTA Bar**
A fixed bottom bar visible only on mobile (`md:hidden`), scroll-triggered visibility (appears after 30% scroll, hides on scroll-up). Contains WhatsApp + primary CTA buttons side by side. Uses Tailwind `translate-y` utility classes for show/hide animation — no custom CSS conflict with Tailwind reset (lesson learned from atlaseo.ma debug session).

Both components are ready to be cloned into any new project. Client-specific copy, links, and color overrides are the only customization needed at instantiation.

**Components NOT promoted to the starter (remain atlaseo.ma-specific):**
- `CollaborationStepper` — too tied to ATLASEO's 3-pillar narrative
- Trust Strip card — too tied to the Dr Yousra cas client format

These can be re-promoted later if a second project genuinely needs them.

### Default design tokens (overridable per project)

The starter ships with a **Material Design 3 token system** in `tailwind.config.mjs` covering:
- **Surface scale** — `surface-container-lowest` through `surface-container-highest`
- **Color roles** — `primary`, `secondary`, `on-surface`, `on-surface-variant`
- **Outline scale** — `outline`, `outline-variant`
- **Semantic** — `error`, plus context-specific containers

**Convention:** the token **names** are constant across all projects (never renamed). The token **values** (actual hex colors) are project-specific and overridden per client based on brand, logo, and message.

**Same logic applies to typography:**
The starter ships with Hanken Grotesk (display) + Inter (body) + JetBrains Mono (labels), loaded via `@fontsource` self-hosting, as **default**. Per-project, this default can and should be reviewed and overridden when the client's brand requires a different visual register.

**Concrete example:** the ODBM project (BTP / construction sector) will likely move away from Hanken Grotesk's premium-tech feel toward a more industrial/architectural typeface like **IBM Plex Sans**, **Archivo**, or **Space Grotesk**, paired with a palette built around concrete grays, sand beige, and a safety-orange accent — radically different from ATLASEO's own navy/green identity.

**The starter does not impose visual identity. It imposes the token architecture.**

### Bilingual & RTL readiness (starter capability, post-ODBM)

The starter is now born bilingual FR/EN and RTL-ready — a capability added after ODBM (which shipped monolingual French), so it is a starter capability, not an ODBM lesson. CSS uses logical properties throughout (`margin-inline` / `padding-inline` / `inset-inline` / `text-align: start` — never left/right); this is what makes activating Arabic a matter of adding a locale, with no layout rework. Both locales are prefix-routed (`/fr/`, `/en/`), fr default. A new project inherits this by default; a monolingual project simply ships one locale. RTL specifics (`dir` on `<html>`, directional icon mirroring, forcing `dir="rtl"` to test layout) are in `docs/cursor_gotchas.md`.

---

## 6. Reference Site — dryousra.ma

- **dryousra.ma** — first completed site, served as the learning project for indexation discipline
- Built in plain HTML/CSS, no backend
- Contact: WhatsApp redirect, click-to-call, socials (Option A)
- Maintained but not rebuilt — serves as portfolio reference
- All "Lessons from dryousra.ma" (§8) come from this site's audit

---

## 7. Launch Checklist (PROCESS template — applies to every site)

> Copy this checklist into the project's `brief.md` or a dedicated `PROCESS.md` at project start.

### Bootstrap (day 1)
- [ ] GitHub connector wired the moment the repo is created — never mid-project (ODBM lesson: no code blind spots)
- [ ] Canonical `{{TODO:...}}` marker names defined day 1, no client suffix, one role = one name (see §4 TODO marker convention; skipping this forced a corrective grep audit on ODBM)
- [ ] `public/_headers` host-matching rule set so the staging URL is noindexed before it goes live (a workers.dev staging URL is publicly indexable by default)
- [ ] "Never silently-empty field" rule enforced from the first data module — every absent field is either a visible `{{TODO}}` marker or removed from the model (see `docs/cursor_gotchas.md`)

### External dependencies — frame at kickoff

These are lead-time dependencies to anticipate and announce to the client at project start, not discover near launch:

- [ ] `.ma` domain via ANRT — acquisition/validation can take several weeks; decouple build from it (the staging URL carries QA in the meantime)
- [ ] Google Business Profile — creation plus Google's verification delay; start early, brief the client on the wait
- [ ] New sending-domain deliverability — a fresh domain gets aggressively filtered (ODBM: candidature emails landed in Hotmail spam); set SPF/DKIM/DMARC early and warn the client that reputation builds over time (see `docs/cursor_gotchas.md`)

### Pre-launch
- [ ] All pages built and reviewed
- [ ] Meta tags verified on every page (unique title + description with ☎️ + phone)
- [ ] Canonical tags verified (URL Inspection in GSC)
- [ ] JSON-LD schema validated (schema.org validator)
- [ ] robots.txt reviewed — allows all content pages
- [ ] Sitemap generated — only indexable URLs
- [ ] Internal links verified — no orphan pages, no broken links
- [ ] Lighthouse audit: all pages ≥90 mobile, ≥95 desktop on all 4 categories
- [ ] Lighthouse audit run on the **staging URL** (`[project].fahd-d-d01.workers.dev`) BEFORE custom domain DNS configuration — confirms performance, SEO, accessibility, and best practices are all production-grade before going live
- [ ] Mobile responsive tested on real devices
- [ ] WhatsApp link tested (opens correct conversation)
- [ ] Click-to-call link tested on mobile
- [ ] mailto link tested
- [ ] Images optimized (WebP, proper alt text)
- [ ] Trailing slash convention verified (no trailing slash by default)
- [ ] www redirect verified (www → non-www at Cloudflare)
- [ ] HTTPS enforced at Cloudflare

### Launch day
- [ ] `npm run build` + `npx wrangler deploy`
- [ ] Domain configured in Cloudflare DNS
- [ ] Google Search Console: verify ownership (DNS TXT)
- [ ] Google Search Console: submit sitemap
- [ ] Google Search Console: URL Inspection on key pages → request indexing
- [ ] Google Business Profile created and linked
- [ ] GA4 property created, tracking code verified
- [ ] Cloudflare Web Analytics enabled

### Post-launch (day 3, 7, 30)
- [ ] GSC Coverage report: check for errors
- [ ] GSC URL Inspection: verify indexation of key pages
- [ ] Core Web Vitals report: all "Good"
- [ ] Performance report: check impressions
- [ ] Fix any "Détectée — non indexée" immediately
- [ ] Backlinks: GBP, LinkedIn, 2-3 local directories

---

## 8. Indexation Protocol — Hard Rules

> This is a hard-won lesson from dryousra.ma (12/32 pages indexed, "Détectée — non indexée" on the rest). Every rule below is non-negotiable from day one. Fixing indexation post-launch is expensive in time and energy. Build it right once.

### Root causes of "Détectée — actuellement non indexée"
Google found the page but decided it wasn't worth indexing. This is a **quality/priority signal**, not a technical crawl block. Main causes:
- **Thin content** — page has too little text, too little value, or near-duplicate content across pages
- **Orphan pages** — page exists but no other page on the site links to it
- **Too many pages** — a showcase site with 30+ pages signals low average quality to Google; fewer, richer pages always wins
- **No external authority** — brand new domain with zero backlinks has low crawl priority, especially `.ma` TLDs
- **Redirect errors** — www/non-www inconsistency, HTTP/HTTPS mismatch, or redirect chains confuse Google

### Hard rules — baked into every site from day one

**Page count discipline**
- Landing page: 1–3 pages max
- Showcase site: 5–8 pages max (never exceed 10 without strong justification)
- Every page must justify its existence with unique, substantive content
- Never create a page that is essentially a duplicate of another with slightly different wording
- If content is thin, merge it into a richer parent page — don't publish it as a standalone

**Content minimums per page**
- Service/specialty page: 300 words minimum, 500+ preferred, 1500+ for SEO-aggressive pages
- About page: 200 words minimum with real, specific information (not filler)
- Homepage: meaningful copy, not just a hero image and a button
- Blog posts (if any): 600 words minimum — never publish below this threshold
- No AI-generated content without human review and enrichment — Google's May 2025 update actively deprioritizes mass AI content lacking E-E-A-T signals

**Internal linking — mandatory structure**
- Every page must be reachable within **2 clicks from the homepage**
- Every page must have **at least one internal link pointing to it** from another page
- No orphan pages — ever. Check before every deploy
- Use descriptive anchor text (e.g. "nos services de création de site web" not "cliquez ici")
- Footer must link to all main pages — this is the safety net for crawl discovery

**Technical — zero tolerance**
- Single canonical URL decided at project start: `domain.ma` (no www) or `www.domain.ma` — never both
- All internal links, sitemap URLs, and canonical tags must use this exact form — no exceptions
- `robots.txt` must allow all important pages — review before every launch
- Every page must have a self-referencing canonical tag (Astro SEO component handles this)
- No redirect chains — if A redirects to B, B must be the final URL, never redirect to C
- HTTP → HTTPS: enforced at Cloudflare level, all internal links already use HTTPS
- Trailing slash: pick one convention (`/about` or `/about/`) and enforce it everywhere in Astro config

**Sitemap discipline**
- Only submit pages that deserve to rank — never include thank-you pages, internal utilities, or thin content
- Sitemap must exactly match canonical URLs (same protocol, same www/non-www, same trailing slash)
- Submit sitemap to Google Search Console on launch day
- After any structural change (new page, URL change, redirect), update and resubmit sitemap

### Google Search Console — launch (run within 24 hours of going live)
- [ ] Verify ownership (DNS TXT record via Cloudflare — easiest method)
- [ ] Submit XML sitemap
- [ ] Run URL Inspection on the 3–5 most important pages → confirm "URL is on Google" or request indexing
- [ ] Check Coverage report for any immediate errors (redirect issues, blocked by robots.txt)
- [ ] Confirm canonical URLs are resolved correctly in URL Inspection
- [ ] Set preferred domain (www vs non-www) in GSC settings

### Google Search Console — ongoing (monthly)
- Check Coverage report: watch for new "Détectée — non indexée" or "Explorée — non indexée" entries
- Check Core Web Vitals report: flag any pages below "Good" threshold
- Check Performance report: identify pages with impressions but 0 clicks (title/meta needs work)
- Never request re-indexing without first fixing the underlying problem — it wastes the daily quota (10–15 requests/day) and delays Google's reassessment

### Backlinks — minimum viable authority for new domains
A brand new `.ma` domain has near-zero crawl priority. Even 3–5 quality backlinks at launch dramatically improve indexation speed. For every client site:
- Google Business Profile (links back to the site — mandatory)
- 2–3 local Moroccan directories relevant to their profession
- Client's social profiles (LinkedIn, Instagram, Facebook) — link to the site in bio
- If a professional association exists (.ma domain), pursue a listing

### What NOT to do (common mistakes)
- ❌ Never create 20+ pages for a 3-service solo professional
- ❌ Never submit the sitemap before fixing redirect errors
- ❌ Never request indexing for a page with thin content — fix first, request after
- ❌ Never publish pages with near-identical content (e.g. "cabinet dentaire Casablanca" and "dentiste Casablanca" as two separate pages — merge them)
- ❌ Never create a page per métier × ville combination (e.g. "SEO dentistes Casablanca" + "SEO dentistes Rabat" + "SEO avocats Casablanca" + …) — pick one dimension only (city OR métier), never both multiplied
- ❌ Never ignore GSC for weeks after launch — check at day 3, day 7, day 30

---

## 9. Lessons from dryousra.ma Audit

> dryousra.ma was audited in May 2026. Strong homepage and service pages. Indexation issues traced to specific, avoidable mistakes. These are the takeaways — apply to every future site.

### ✅ What worked — replicate this
- Homepage copy: clear value proposition, real credibility signals (social proof, credentials, stats), strong CTAs
- Service pages: good depth, structured content (zones traitées, déroulement, FAQ, cross-links), proper title tags with location keywords
- Meta descriptions: written, specific, keyword-aware
- Canonical tags: present on every page
- CTA pattern: WhatsApp + click-to-call — correct for Moroccan market

### ❌ Mistake 1 — Thin "intent" navigation pages
dryousra.ma had 8 "besoins" pages (rajeunir, lèvres, rides, taches, etc.) each with ~120 words, a bullet list, 2 FAQ entries, and a CTA. Google crawled them, found near-zero unique value vs the service pages they linked to, and marked them all "Détectée — non indexée." These 8 thin pages dragged down the entire domain's quality signal.

**Rule going forward:**
- Navigation/aggregator pages (grouping by intent, symptom, or category) are useful for UX but must either have 300+ words of real, unique content — OR be `noindex`ed
- Default decision: `noindex` aggregator pages unless you're writing them properly
- Never create a page just to link to other pages — that's what the nav and internal links are for
- In Astro: add `<meta name="robots" content="noindex">` via the SEO component on any page that serves navigation purposes only

### ❌ Mistake 2 — Canonical / URL extension mismatch
The canonical tag declared `https://dryousra.ma/soins/injections/botox` (no extension) but the actual served URL was `https://dryousra.ma/soins/injections/botox.html`. Google sees two versions of every page, has to pick one, and logs redirect errors in GSC.

**Rule going forward:**
- Astro outputs clean URLs by default (`/botox` not `/botox.html`) — never override this
- The canonical tag must exactly match the URL Google will actually land on
- Verify canonical = actual URL on every page before launch using GSC URL Inspection tool
- Never mix `.html` extension URLs with clean URLs on the same site

### ❌ Mistake 3 — Too many pages for the site's authority
32 pages on a brand new `.ma` domain with limited backlinks = Google spreads its crawl budget thin and deprioritizes low-signal pages. The site would have indexed faster and more completely with 10 well-crafted pages at launch, and besoins/secondary pages added later once the domain had authority.

**Rule going forward:**
- Launch with the minimum viable page set (5–8 pages for showcase sites)
- Add secondary pages only after core pages are indexed and the domain has traction
- Never launch 30+ pages on a new domain — even if the content exists

---

## 10. Technical Principles

> Strategic principles (positioning, market philosophy, anti-models) are in `ATLASEO_strategy.md` §9. This section covers technical/methodological principles only.

- **No over-engineering**: if static works, use static. No DB if not needed. No SSR if static suffices.
- **One Worker per site**: self-contained, easy client handoff. Never share infrastructure between client projects.
- **Template first, customize second**: never build from scratch after v1. If a new requirement can't be met by the template, the template gets updated, then the project inherits.
- **System layer is not brand**: status colors (success green, error red on toasts) and the system-layer radius (notifications, modals, lightbox) are functional, not brand tokens. They stay as documented semantic constants and are never introduced into the client's brand token set — even when the brand register differs (e.g. a 0px-corner brand still has a small radius on system notifications). A status green is a status, never a brand color. Keep these exceptions explicitly documented per project so they read as deliberate, not as drift.
- **SEO is not an afterthought**: schema, sitemap, GBP setup are part of every delivery, not optional upgrades.
- **Mobile-first**: 85% of Moroccan traffic is mobile. Test on real devices, not just DevTools.
- **WhatsApp is a primary conversion channel in Morocco**: always include it as a CTA, prominent on mobile.
- **Process emerges from building, not from planning**: document as you go. Update this file and the launch checklist whenever a new lesson appears.

---

**End of document.**

> This document is a living reference. Update it whenever a new technical lesson appears. Version in Git.
