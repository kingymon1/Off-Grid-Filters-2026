# Implementation Plan: Email Capture + AI Search Hardening

## A. Email Capture (Lightweight, No Backend)

### Rationale
The site currently has zero owned-audience infrastructure. All revenue depends on search traffic. A simple email capture component builds an owned channel with minimal code.

### Approach: Static form → Buttondown (free tier, no JS SDK needed)
- Buttondown's free tier handles up to 100 subscribers with a simple HTML `<form>` POST
- No API key needed, no JS bundle, no backend — just a form `action` URL
- The site owner creates a Buttondown account and drops their username into `siteConfig`
- If no username is configured, the component doesn't render (zero impact on existing site)

### Changes

**1. `src/lib/config.ts`** — Add email config to `siteConfig`
- Add to `siteConfig` object (around line 1365):
  ```typescript
  email: {
    provider: 'buttondown',
    username: '', // Owner fills this in — empty string = component hidden
    heading: 'Get Filter Picks Delivered',
    subheading: 'One email per week. Honest reviews, no spam.',
    ctaText: 'Subscribe',
  },
  ```

**2. `src/components/EmailCapture.astro`** — New component
- Simple HTML form: email input + submit button
- `action="https://buttondown.com/api/emails/embed-subscribe/{username}"` method POST
- Styled to match the existing `.cta-card` design language (gradient top border, card background)
- Conditionally renders nothing if `siteConfig.email.username` is empty
- `prefers-reduced-motion` respected (no animations)
- Accessible: proper `<label>`, `aria-describedby` for the subheading, `type="email"` with `required`
- No JavaScript needed — pure HTML form submission

**3. Placement** (3 locations — all inside existing page files, no layout changes)

| Location | File | Insert Point | Why |
|----------|------|-------------|-----|
| Homepage: after FAQ, before Final CTA | `src/pages/index.astro` | ~line 325 | High-intent users who've read FAQs |
| Guide pages: before final CTA section | `src/pages/guides/how-to-choose-water-filter.astro` (and other guide pages) | Before final `<h2>` | Users who consumed full guide |
| Resource Hub: after all content sections | `src/pages/guides/index.astro` | Before closing `</ContentLayout>` | Discovery-mode users |

**4. Repeat for all guide pages** — Add `EmailCapture` import + placement in all 8 buyer guides and 10 activity guides. These are the highest-engagement pages.

---

## B. AI Search Hardening (6 changes)

### B1. Per-page `dateModified` instead of global default

**Problem:** Every page currently uses the same `dateModified` (2026-02-08) from `siteConfig.seo.dateModified`. AI crawlers and Google both use freshness as a ranking signal — a single global date wastes this.

**Changes:**

- **`src/lib/config.ts`**: The `Product`, `Comparison`, and `GuideConfig` interfaces already have `publishDate`. No change needed to the data model.
- **`src/lib/schema.ts` → `createPageSchema()`**: Already accepts optional `dateModified` param. No change needed.
- **Content pages** (reviews, comparisons, guides): Pass each item's `publishDate` as both `datePublished` and `dateModified` to the schema. This is already supported by the `createPageSchema` function — the pages just aren't using it. Update each page template to pass the product/guide's `publishDate` instead of relying on the global default.

**Files to edit:**
- `src/pages/reviews/*.astro` — pass `product.publishDate`
- `src/pages/best-*.astro` — use latest product publishDate in that category
- `src/pages/*.astro` (comparisons) — use comparison's publishDate
- `src/pages/guides/*.astro` — use guide's publishDate

### B2. Visible "Last Updated" date on all content pages

**Problem:** `dateModified` is only in JSON-LD (invisible). AI crawlers and Google both look for human-visible freshness signals.

**Changes:**

- **`src/layouts/ContentLayout.astro`**: Add an optional `lastUpdated?: string` prop. When provided, render a small `<time datetime="...">` element below the breadcrumbs or at the top of the article:
  ```html
  <p class="last-updated">Last updated: <time datetime="2026-02-08">February 8, 2026</time></p>
  ```
- Style it as muted text (small, `--muted-foreground` color) so it doesn't distract but is crawlable.
- Pass the date from each content page.

### B3. Richer `llms.txt` with per-page descriptions

**Problem:** Current `llms.txt` lists URLs + titles but no content summaries. Richer context = better AI citation targeting.

**Changes:**

- **`src/lib/config.ts`**: The `Product` interface already has `verdict` (1-sentence summary). `GuideConfig` has `title`. `Comparison` has `slug`, `productA`, `productB`.
- **`src/pages/llms.txt.ts`**: Enhance each line item to include a brief description:
  ```
  - https://offgridfilters.com/reviews/brita-elite-2pack/ — Brita Elite 2-Pack: NSF 401-certified pitcher filter that removes 12 contaminants including 99% of lead.
  ```
  - Products: use `product.verdict`
  - Categories: use `category.description`
  - Comparisons: generate "Compare {productA} vs {productB} — specs, performance, and value"
  - Guides: use guide title + " — Complete guide"

**Also fix the existing bug:** Line 23 references `c.title` on comparisons, but the `Comparison` interface has no `title` field. Fix to generate title from product names.

### B4. `speakable` schema on key pages

**Problem:** No `speakable` markup. Google uses this to identify which content section to read aloud or quote in AI Overviews.

**Changes:**

- **`src/lib/schema.ts`**: Add a new `generateSpeakableSchema()` function:
  ```typescript
  export function generateSpeakableSchema(cssSelectors: string[]) {
    return {
      "@type": "WebPage",
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: cssSelectors,
      },
    };
  }
  ```
- **`src/lib/schema.test.ts`**: Add tests for the new function.
- **Content pages**: Add speakable schema targeting the verdict/summary sections:
  - Review pages: target the `.verdict-card` or quick verdict section
  - Roundup pages: target the "Quick Picks" summary
  - Comparison pages: target the `.verdict-card` winner declaration
  - Guide pages: target the intro paragraph

### B5. Remove broken `SearchAction` from WebSite schema

**Problem:** `generateWebSiteSchema()` declares a `SearchAction` with a URL template, but the site has no search functionality. This is a broken promise to crawlers.

**Changes:**

- **`src/lib/schema.ts` → `generateWebSiteSchema()`**: Remove the `potentialAction` / `SearchAction` block entirely. Keep just `@type`, `name`, `url`.
- **`src/lib/schema.test.ts`**: Update the corresponding test.

### B6. Entity linking via `mentions` schema

**Problem:** No `mentions`/`about` schema properties. These help AI understand relationships between content and real-world entities.

**Changes:**

- **`src/lib/schema.ts` → `generateArticleSchema()`**: Add optional `mentions` and `about` properties:
  ```typescript
  export interface ArticleSchemaProps {
    // ... existing props ...
    mentions?: Array<{ name: string; url: string; type?: string }>;
    about?: Array<{ name: string; url: string; type?: string }>;
  }
  ```
  When provided, these render as:
  ```json
  "mentions": [{ "@type": "Product", "name": "Brita Elite", "sameAs": "https://amazon.com/dp/..." }],
  "about": [{ "@type": "Thing", "name": "Water Filtration" }]
  ```
- **Review pages**: Pass the reviewed product as `about`, and compared/related products as `mentions`.
- **Comparison pages**: Pass both products as `about`.
- **Guide pages**: Pass recommended products as `mentions`.
- **`src/lib/schema.test.ts`**: Add tests for mentions/about properties.

---

## File Change Summary

| File | Change Type | Description |
|------|------------|-------------|
| `src/lib/config.ts` | Edit | Add `email` config block to `siteConfig` |
| `src/components/EmailCapture.astro` | **New** | Email capture form component |
| `src/pages/index.astro` | Edit | Add EmailCapture between FAQ and Final CTA |
| `src/pages/guides/index.astro` | Edit | Add EmailCapture before closing tag |
| `src/pages/guides/*.astro` (8 files) | Edit | Add EmailCapture before final CTA |
| `src/pages/water-filters-for-*.astro` (10 files) | Edit | Add EmailCapture before final CTA |
| `src/layouts/ContentLayout.astro` | Edit | Add `lastUpdated` prop + visible date |
| `src/pages/reviews/*.astro` (29 files) | Edit | Pass per-page dates + speakable + mentions |
| `src/pages/best-*.astro` (6 files) | Edit | Pass per-page dates + speakable |
| `src/pages/*.astro` (comparisons, 15 files) | Edit | Pass per-page dates + speakable + about |
| `src/pages/llms.txt.ts` | Edit | Add descriptions, fix comparison title bug |
| `src/lib/schema.ts` | Edit | Add `speakable`, `mentions`/`about`, remove `SearchAction` |
| `src/lib/schema.test.ts` | Edit | Add tests for new schema functions, update existing |

**Total: ~1 new file, ~75 file edits**

---

## Execution Order

1. `src/lib/config.ts` — add email config (foundation for EmailCapture)
2. `src/components/EmailCapture.astro` — create the component
3. `src/lib/schema.ts` — add speakable, mentions/about, remove SearchAction
4. `src/lib/schema.test.ts` — update tests
5. `src/layouts/ContentLayout.astro` — add lastUpdated prop
6. `src/pages/llms.txt.ts` — enrich descriptions, fix bug
7. `src/pages/index.astro` — add EmailCapture
8. `src/pages/guides/index.astro` — add EmailCapture
9. Batch: all guide pages — add EmailCapture + lastUpdated + speakable
10. Batch: all review pages — per-page dates + speakable + mentions
11. Batch: all roundup pages — per-page dates + speakable
12. Batch: all comparison pages — per-page dates + speakable + about
13. `npm run test` — verify schema tests pass
14. `npm run build` — verify full build succeeds
15. Commit and push to `claude/fix-guides-layout-mEX75`
