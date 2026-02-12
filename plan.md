# Refined Implementation Plan: Email Capture + AI Search Hardening

> **Scope:** 2 features, ~75 file edits, 1 new file, 1 new component
> **Quality bar:** World-class — every change must match the existing site's polish level.
> **Branch:** `claude/fix-guides-layout-mEX75`

---

## A. Email Capture — Buttondown Integration

### A1. Research Summary

**Provider:** Buttondown (free tier, 100 subscribers → migrate to Kit at scale)
- Pure HTML `<form>` POST — zero JavaScript SDK, zero bundle size impact
- Form action: `https://buttondown.com/api/emails/embed-subscribe/{username}`
- Required fields: `email` (type=email) + `embed` (hidden, value="1")
- Supports hidden `tag` fields for per-placement source tracking
- Double opt-in by default (GDPR/CAN-SPAM compliant)
- Rate limited to 100 req/hr (sufficient for a new site)

**Why NOT Neon/Clerk/Resend:** Those are SaaS infrastructure tools (database, auth, transactional email). An affiliate site doesn't need user accounts or a database — just a newsletter service that handles the full lifecycle: capture → confirm → send → unsubscribe → compliance. Buttondown does all of this with a single form URL.

**Migration path:** Export CSV from Buttondown → import as "confirmed" into Kit (ConvertKit) when approaching 100 subscribers. Kit allows confirmed imports (no re-confirmation emails). The only code change is swapping the form `action` URL — one line in `config.ts`.

### A2. Placement Strategy (Research-Backed)

Based on conversion research for authority/review sites:

| # | Location | Page Type | Insert Point | Rationale | Expected CVR |
|---|----------|-----------|-------------|-----------|-------------|
| 1 | **After FAQ section, before Final CTA** | Homepage | `index.astro` ~line 325 | Highest-intent spot — readers who consumed FAQs are deeply engaged | 2-3% |
| 2 | **Before final CTA section** | All 8 buyer guide pages | `guides/*.astro` | Guide completers are in active buying mode — peak newsletter receptivity | 3-5% |
| 3 | **Before final CTA section** | All 10 activity guide pages | `water-filters-for-*.astro` | Same rationale as buyer guides | 3-5% |
| 4 | **After all content sections** | Resource Hub | `guides/index.astro` | Discovery-mode users exploring the site | 1-2% |

**Why NOT on review pages or comparisons:** These are transactional pages where the user's intent is to evaluate a specific product. Inserting an email form breaks the decision flow and risks undermining trust. The Wirecutter model confirms this — their review pages have zero interruptive capture. Guides and the homepage are informational contexts where "get more of this" is a natural next step.

**Why only 4 touchpoints (not popups/modals/sticky bars):**
- Authority sites earn trust through content, not aggressive capture
- Google penalizes mobile interstitials on first page from search
- Research shows 2-3 touchpoints per page is optimal; beyond 4 erodes trust
- Inline forms convert 2-5% and produce the highest-quality subscribers
- We can always add a non-intrusive sticky bar or exit-intent popup later as a Phase 2

### A3. Component Design: `EmailCapture.astro`

**Visual design — matches existing site language:**
- Card container: `.cta-card` pattern (gradient top border, `hsl(var(--card))` background, `border-radius: 1.5rem`)
- Section padding matching adjacent sections
- `.reveal` scroll animation (consistent with all other sections)
- Accent gradient top border (same as CTA card: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))`)

**Layout:**
```
┌──────────────────────────────────────────────┐
│ ═══ gradient top border ═══                  │
│                                              │
│   📧  Get Filter Picks Delivered             │  ← heading (h2 weight)
│   One email per week. Honest reviews,        │  ← subheading (muted)
│   no spam.                                   │
│                                              │
│   ┌──────────────────────┐ ┌──────────────┐  │
│   │ you@example.com      │ │  Subscribe   │  │  ← email input + CTA button
│   └──────────────────────┘ └──────────────┘  │
│                                              │
│   🔒 No spam. Unsubscribe anytime.          │  ← trust line (small, muted)
│                                              │
└──────────────────────────────────────────────┘
```

**HTML structure:**
```html
<section class="section email-section">
  <div class="container">
    <div class="email-card reveal">
      <div class="email-icon"><!-- mail SVG --></div>
      <h2 class="email-heading">{heading from config}</h2>
      <p class="email-subheading">{subheading from config}</p>
      <form
        action="https://buttondown.com/api/emails/embed-subscribe/{username}"
        method="post"
        class="email-form"
      >
        <input type="email" name="email" placeholder="you@example.com" required
               aria-label="Email address" autocomplete="email" />
        <input type="hidden" name="embed" value="1" />
        <input type="hidden" name="tag" value="{placement-tag}" />
        <button type="submit" class="btn-primary">{ctaText from config}</button>
      </form>
      <p class="email-trust">
        <svg><!-- lock icon --></svg>
        No spam. Unsubscribe anytime.
      </p>
    </div>
  </div>
</section>
```

**Props:**
```typescript
interface Props {
  tag?: string;  // Source tracking tag, e.g., "homepage", "buying-guide", "resource-hub"
}
```

**Conditional rendering:** If `siteConfig.email.username` is empty string, the entire component renders nothing. Zero impact on existing site until the owner creates a Buttondown account.

**Accessibility:**
- `<label>` or `aria-label` on email input
- `type="email"` with `required` attribute
- `autocomplete="email"` for autofill
- Focus-visible ring matching site's primary color
- Form is keyboard-navigable (input → button via Tab)
- `prefers-reduced-motion` respected (no animations)

**Mobile:**
- Input and button stack vertically below 640px
- Input gets full width, button gets full width below it
- Large tap targets (min 48px height)
- No modal/popup — pure inline, zero Google interstitial penalty risk

### A4. Config Changes: `src/lib/config.ts`

Add to `siteConfig` object (after `navigation`):

```typescript
email: {
  provider: 'buttondown' as const,
  username: '',  // Owner fills this — empty = component hidden
  heading: 'Get Filter Picks Delivered',
  subheading: 'One email per week. Honest reviews, no spam.',
  ctaText: 'Subscribe',
},
```

**Why configurable:** Heading/subheading/CTA text in config allows A/B testing different copy without touching the component. The owner can try "Weekly Water Filter Picks" vs "Get Expert Picks Before You Buy" by editing one file.

### A5. CSP Header Update: `vercel.json`

The current CSP `form-action` directive is `'self'` only. Native form POST to `buttondown.com` will be blocked.

**Change:**
```
form-action 'self'
```
**To:**
```
form-action 'self' https://buttondown.com
```

This is a one-line edit in the CSP header value at `vercel.json` line 57.

### A6. Post-Submit UX

**Default behavior (Phase 1):** Native form POST redirects to Buttondown's hosted confirmation page. This is acceptable for launch — it's a clean page that says "Check your email to confirm."

**Phase 2 enhancement (not in this PR):** Configure custom redirect URLs in Buttondown dashboard to point to a `/subscribe/thank-you/` page on the site. Alternatively, intercept with JavaScript `fetch()` for inline success messaging. This is a future optimization, not needed for launch.

---

## B. AI Search Hardening (5 Changes)

### B1. Per-Page `dateModified` in Schema

**Problem:** Every page currently uses `siteConfig.seo.dateModified` (2026-02-08). Google and AI systems use freshness as a ranking signal — a global date wastes this for "best X 2026" queries.

**Research finding:** Google cross-references structured data dates with visible page dates. They must match. Only update `dateModified` when content actually changes.

**Changes:**
- **Review pages** (`src/pages/reviews/*.astro`, 29 files): Pass `product.publishDate` to `generateProductSchema()` and `generateArticleSchema()` calls. The `createPageSchema()` helper already accepts `datePublished` and `dateModified` params — the pages just aren't using them.
- **Category roundup pages** (`src/pages/best-*.astro`, 6 files): Use the latest `publishDate` among products in that category.
- **Comparison pages** (`src/pages/*.astro`, 15 files): Use `comparison.publishDate` (currently all `2026-02-08`).
- **Guide pages** (`src/pages/guides/*.astro` + `src/pages/water-filters-for-*.astro`, 18 files): Use `guide.publishDate`.

**No config changes needed** — all interfaces already have `publishDate` fields.

### B2. Visible "Last Updated" Date on Content Pages

**Problem:** `dateModified` is only in JSON-LD (invisible to users). Google explicitly recommends "a prominent, user-visible date labeled as 'Published' or 'Last updated.'" AI systems also prefer pages with visible freshness signals.

**Research finding:** Dates must match between visible content and structured data. Inconsistency is flagged as manipulation.

**Changes:**

**`src/layouts/ContentLayout.astro`** — Add optional `lastUpdated` prop:

```typescript
interface Props {
  // ... existing props ...
  lastUpdated?: string;  // ISO date string, e.g., "2026-02-08"
}
```

When provided, render after breadcrumbs, before the article card:

```html
<p class="last-updated">
  Last updated: <time datetime="2026-02-08">February 8, 2026</time>
</p>
```

**Styling:**
- `font-size: 0.8125rem` (13px) — same as `.resource-meta`
- `color: hsl(var(--muted-foreground))` — doesn't compete with content
- Positioned right after breadcrumbs, left-aligned
- `margin-bottom: 0.5rem` — tight spacing before article card

**All content pages** pass their respective dates via this prop. The format function converts ISO dates to human-readable: "February 8, 2026".

### B3. Richer `llms.txt` with Per-Page Descriptions

**Problem:** Current `llms.txt` lists URLs + titles but no content summaries. Richer context = better AI citation targeting.

**Research finding:** While no major AI platform has confirmed reading `llms.txt` yet, it costs zero to maintain (auto-generated from config) and the format is aligned with how LLMs process Markdown.

**Changes to `src/pages/llms.txt.ts`:**

1. **Products:** Append `product.verdict` as description
   ```
   - https://offgridfilters.com/reviews/brita-elite-2pack/ — Brita Elite 2-Pack Review: NSF 401-certified pitcher filter removing 12+ contaminants including 99% of lead.
   ```

2. **Categories:** Append `category.description`
   ```
   - https://offgridfilters.com/best-countertop-filters/ — Best Countertop & Pitcher Filters: Our ranked picks for no-install water filtration.
   ```

3. **Comparisons:** Fix the `c.title` bug (Comparison interface has no `title` field). Generate title from product names:
   ```typescript
   ...comparisons.map(c => {
     const a = getProductBySlug(c.productA);
     const b = getProductBySlug(c.productB);
     const title = `${a?.name ?? c.productA} vs ${b?.name ?? c.productB}`;
     return `- ${SITE_URL}/${c.slug}/ — ${title}: Side-by-side specs, performance, and value comparison`;
   }),
   ```

4. **Guides:** Append `guide.description`
   ```
   - https://offgridfilters.com/guides/how-to-choose-water-filter/ — How to Choose a Water Filter: Complete guide to choosing the right filter for your water, budget, and household.
   ```

### B4. Remove Broken `SearchAction` from WebSite Schema

**Problem:** `generateWebSiteSchema()` declares a `SearchAction` with a URL template, but the site has no search functionality. This is dead markup pointing to a non-existent endpoint.

**Research finding:** Google deprecated the Sitelinks Search Box rich result in June 2025. There is no benefit to including `SearchAction` even if search existed. No penalty for having it, but removing dead markup keeps schema clean and focused.

**Changes:**

**`src/lib/schema.ts` → `generateWebSiteSchema()`:**
```typescript
// Before
export function generateWebSiteSchema() {
  return {
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: { ... }  // REMOVE THIS
  };
}

// After
export function generateWebSiteSchema() {
  return {
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}
```

**`src/lib/schema.test.ts`:** Update the `generateWebSiteSchema` test to no longer assert `potentialAction` exists. Instead verify just `@type`, `name`, `url`.

### B5. Entity Linking via `mentions` and `about` Schema Properties

**Problem:** No `mentions`/`about` schema properties. These help AI systems understand entity relationships and increase citation probability.

**Research finding:** Pages with comprehensive entity-linked schema get a 36% citation advantage in AI-generated summaries. `about` declares the primary topic; `mentions` declares secondary entities. `sameAs` links to Wikipedia/Wikidata for disambiguation.

**Changes:**

**`src/lib/schema.ts` → `generateArticleSchema()`:**

Extend the `ArticleSchemaProps` interface:

```typescript
export interface ArticleSchemaProps {
  // ... existing props ...
  mentions?: Array<{ name: string; url: string; type?: string }>;
  about?: Array<{ name: string; url: string; type?: string }>;
}
```

When provided, add to the Article schema output:

```json
"mentions": [
  { "@type": "Product", "name": "Brita Elite 2-Pack", "sameAs": "https://amazon.com/dp/B0CX5PV6LC" }
],
"about": [
  { "@type": "Thing", "name": "Water Filtration", "sameAs": "https://www.wikidata.org/entity/Q842467" }
]
```

**Page-level integration:**

- **Review pages (29 files):** `about` = the reviewed product (type: Product, sameAs: Amazon URL). `mentions` = related products in the same category.
- **Comparison pages (15 files):** `about` = both compared products. `mentions` = category roundup.
- **Guide pages (18 files):** `about` = the guide topic (type: Thing). `mentions` = recommended products.
- **Category roundups (6 files):** `about` = the category (type: Thing). `mentions` = all products in the category.

**`src/lib/schema.test.ts`:** Add tests for:
- Article schema with `mentions` array
- Article schema with `about` array
- Article schema with both `mentions` and `about`
- Article schema with neither (backward compatibility)

### B5a. What We're NOT Implementing (and Why)

**Speakable schema — SKIPPED:**
Research conclusively shows speakable is beta-only, restricted to English-language US news content, and is on Google's deprecation shortlist for January 2026. It does not apply to affiliate review sites. Would add complexity with zero benefit.

**Interactive quiz lead magnet — DEFERRED:**
Research shows quizzes convert 70% better than static offers. A "Find Your Perfect Water Filter" quiz would be excellent, but it requires React client-side state management, multi-step form logic, and conditional routing — a separate feature that deserves its own focused implementation. Not in scope for this PR.

**Exit-intent popup — DEFERRED:**
Research shows 2.95-4.68% conversion rate, but authority sites benefit more from non-intrusive capture. Adding this later as a Phase 2 optimization if inline form performance plateaus below 2%.

---

## C. CSP & Security

### C1. Vercel CSP Header Update

**File:** `vercel.json` line 57

**Current `form-action` directive:** `form-action 'self'`
**Updated:** `form-action 'self' https://buttondown.com`

This is the ONLY security-relevant change. The form POST goes directly to Buttondown's embed-subscribe endpoint. No JavaScript SDK, no additional `connect-src` needed, no CORS concerns with native form submission.

---

## D. File Change Summary

| # | File | Change | Description |
|---|------|--------|-------------|
| 1 | `src/lib/config.ts` | Edit | Add `email` config block to `siteConfig` |
| 2 | `src/components/EmailCapture.astro` | **New** | Email capture form component |
| 3 | `vercel.json` | Edit | Add `https://buttondown.com` to CSP `form-action` |
| 4 | `src/lib/schema.ts` | Edit | Add `mentions`/`about` to ArticleSchema, remove SearchAction |
| 5 | `src/lib/schema.test.ts` | Edit | Update WebSite test, add mentions/about tests |
| 6 | `src/layouts/ContentLayout.astro` | Edit | Add `lastUpdated` prop + visible date display |
| 7 | `src/pages/llms.txt.ts` | Edit | Add descriptions, fix comparison title bug |
| 8 | `src/pages/index.astro` | Edit | Add EmailCapture between FAQ and Final CTA |
| 9 | `src/pages/guides/index.astro` | Edit | Add EmailCapture before closing tag |
| 10-17 | `src/pages/guides/*.astro` (8 files) | Edit | Add EmailCapture + lastUpdated + per-page dates + mentions/about |
| 18-27 | `src/pages/water-filters-for-*.astro` (10 files) | Edit | Add EmailCapture + lastUpdated + per-page dates + mentions/about |
| 28-56 | `src/pages/reviews/*.astro` (29 files) | Edit | Per-page dates + mentions/about schema |
| 57-62 | `src/pages/best-*.astro` (6 files) | Edit | Per-page dates + mentions/about schema |
| 63-77 | `src/pages/*.astro` (comparisons, 15 files) | Edit | Per-page dates + about schema |

**Total: 1 new file, ~76 file edits**

---

## E. Execution Order

### Phase 1: Foundation (config + component + schema)
1. `src/lib/config.ts` — Add email config block
2. `src/components/EmailCapture.astro` — Create the component with full styling
3. `src/lib/schema.ts` — Add mentions/about to ArticleSchema, remove SearchAction
4. `src/lib/schema.test.ts` — Update tests (must pass before continuing)
5. `src/layouts/ContentLayout.astro` — Add lastUpdated prop + visible date
6. `src/pages/llms.txt.ts` — Enrich descriptions, fix comparison bug
7. `vercel.json` — Add buttondown.com to CSP form-action

### Phase 2: Homepage
8. `src/pages/index.astro` — Add EmailCapture between FAQ and CTA sections

### Phase 3: Guide pages (18 files)
9. All 8 buyer guide pages — Add EmailCapture + lastUpdated + per-page dates + entity schema
10. All 10 activity guide pages — Same changes as buyer guides

### Phase 4: Review pages (29 files)
11. All 29 review pages — Per-page dates + mentions/about entity schema

### Phase 5: Roundup pages (6 files)
12. All 6 category roundup pages — Per-page dates + entity schema

### Phase 6: Comparison pages (15 files)
13. All 15 comparison pages — Per-page dates + about entity schema

### Phase 7: Resource Hub
14. `src/pages/guides/index.astro` — Add EmailCapture

### Phase 8: Verify
15. `npm run test` — All schema tests pass
16. `npm run lint` — No lint errors
17. `npm run build` — Full build succeeds, all 80 pages output
18. Spot-check: verify EmailCapture renders conditionally (hidden when username is empty)
19. Spot-check: verify visible dates appear on content pages
20. Spot-check: verify llms.txt includes descriptions and no broken comparison titles

### Phase 9: Ship
21. Commit with descriptive message
22. Push to `claude/fix-guides-layout-mEX75`

---

## F. Success Criteria

- [ ] `npm run test` passes (19 existing + 3-4 new schema tests)
- [ ] `npm run lint` passes
- [ ] `npm run build` produces 80 pages with zero errors
- [ ] EmailCapture component renders on homepage, 8 buyer guides, 10 activity guides, resource hub (20 pages total)
- [ ] EmailCapture renders nothing when `siteConfig.email.username` is empty
- [ ] Every content page shows visible "Last updated" date
- [ ] `llms.txt` output includes per-page descriptions with no undefined/null values
- [ ] WebSite schema no longer includes SearchAction
- [ ] Article schema on review pages includes `mentions` and `about` properties
- [ ] CSP header allows form-action to buttondown.com
- [ ] No console errors in built output
- [ ] All existing functionality unchanged — no regressions
