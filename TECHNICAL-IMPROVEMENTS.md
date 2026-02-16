# Technical Improvements — Suggested Refactors

> **Status:** Proposals only — none of these are in progress.
> **PageSpeed Impact:** None. Every change below is build-time only — the rendered HTML/CSS/JS
> is identical, so the 4x100 PageSpeed Insights score is unaffected.

---

## Priority 1: Direct SEO Value

### 1.1 Per-Page `dateModified` Tracking

**Effort:** Low | **SEO impact:** High | **PSI risk:** None

All 119 pages currently share `dateModified: 2026-02-08`. Google's freshness algorithms
distinguish between genuine editorial updates and bulk publishes — a single shared date
dilutes the freshness signal.

**What to do:**

Add a `lastModified` field to products, categories, comparisons, and guides in `config.ts`
(separate from `publishDate`). Default to `publishDate` when not set. Update it only when
content genuinely changes (revised verdict, updated price, new comparison data).

```typescript
// config.ts — per-product example
{
  name: 'Waterdrop G3P600',
  slug: 'waterdrop-g3p600',
  publishDate: '2026-02-08',
  lastModified: '2026-03-12',  // <-- updated when review was revised
  // ...
}
```

Pass `lastModified ?? publishDate` to both ContentLayout's `lastUpdated` prop and the
Article schema's `dateModified` field.

**Why it matters for AI search:** When Perplexity or ChatGPT search chooses which source to
cite for "best water filter 2026," they weight recency of structured data dates. Staggered,
genuine update dates across pages signal ongoing editorial maintenance — which ranks higher
than 119 pages all stamped with the same date.

**Rules:**
- Only update `lastModified` when content actually changes — Google penalizes cosmetic date bumps
- Stagger naturally (5-10 pages per week as prices change or new info emerges)
- Visible "Last updated" date must always match `dateModified` in schema (already enforced)

---

## Priority 2: Reduce Boilerplate

### 2.1 Extract Shared Page Logic into Helpers

**Effort:** Low | **SEO impact:** None | **PSI risk:** None

Every review page repeats ~50 lines of identical frontmatter: imports, schema generation,
related articles construction, publication gating. Same pattern across comparisons and guides.

**What to do:**

Create helper functions in `src/lib/config.ts` (or a new `src/lib/page-helpers.ts`):

```typescript
// Example: collapses 50 lines of review frontmatter into 1 call
export function buildReviewPageData(slug: string) {
  const product = getProductBySlug(slug);
  if (!product) throw new Error(`Product slug "${slug}" not found in config`);

  const relatedProducts = getRelatedProducts(product);
  const category = categories.find(c => c.slug === product.category);

  const articleSchema = generateArticleSchema({
    title: `${product.name} Review`,
    description: product.verdict,
    url: `/reviews/${product.slug}/`,
    datePublished: product.publishDate,
    dateModified: product.lastModified ?? product.publishDate,
    about: [{ name: product.name, url: `https://www.amazon.com/dp/${product.asin}`, type: 'Product' }],
    mentions: relatedProducts.slice(0, 3).map(p => ({
      name: p.name, url: `https://www.amazon.com/dp/${p.asin}`, type: 'Product',
    })),
  });

  const relatedArticles = [
    ...relatedProducts.slice(0, 2).map(p => ({
      title: `${p.name} Review`,
      url: `/reviews/${p.slug}/`,
      description: p.verdict,
    })),
    ...(category ? [{
      title: `Best ${category.name}`,
      url: `/best-${category.slug}/`,
      description: category.description,
    }] : []),
    // 4th article filled per-page (guide or knowledge base link)
  ];

  return { product, relatedProducts, category, articleSchema, relatedArticles };
}
```

Similar helpers for comparisons (`buildComparisonPageData`) and guides (`buildGuidePageData`).

**Lines saved:** ~2,500 across 56 reviews + 15 comparisons + 28 guides.

### 2.2 Content Collections (Larger Refactor)

**Effort:** Medium-High | **SEO impact:** Neutral if content depth is preserved | **PSI risk:** None

Astro's built-in Content Collections would let you replace 56 individual review `.astro` files
with one `[...slug].astro` template + 56 Markdown/MDX content files. Same pattern for
comparisons and guides.

**What to do:**
- Move unique review prose (overview, performance analysis, pros/cons, verdict) into
  `src/content/reviews/[slug].md` files
- Create a single `src/pages/reviews/[...slug].astro` dynamic route
- Use `getStaticPaths()` to generate all 56 pages from config + content collection

**Lines saved:** ~7,000+ (eliminates duplicated boilerplate across all review pages).

**Critical warning:** The prose content must remain just as specific and authoritative as it
is now. The risk with this refactor is that writers start producing shorter, more formulaic
text because the content lives in markdown stubs. A review that says "The G3P600's 600 GPD
tankless design eliminates the pressurized tank that the iSpring RCC7AK requires" gets cited
by AI search. A template-generated "This product has good flow rate" does not.

**Recommendation:** Do Section 2.1 (helpers) first. It captures 80% of the deduplication
value with 20% of the effort and zero risk to content quality. Revisit content collections
later if the page count grows past ~80 reviews.

---

## Priority 3: Defensive Quality

### 3.1 Config Validation Tests

**Effort:** Low | **SEO impact:** Prevents regressions | **PSI risk:** None

Only `schema.test.ts` exists (22 tests). The config is the single source of truth for 119
pages — a broken cross-reference ships broken pages.

**What to add** (in `src/lib/config.test.ts`):

- Every product has all required fields (`name`, `slug`, `asin`, `price`, `rating`, `category`, `publishDate`)
- Every product's `category` references a valid category slug
- Every comparison's `productA` and `productB` reference valid product slugs
- Every guide's `slug` is unique across all guide types
- No duplicate product slugs
- Every product slug in `image-map.ts` `productSlugs` exists in config
- Every product in config has a `heroImages` entry in `image-map.ts`
- All `publishDate` values are valid ISO date strings
- No product has an empty `verdict` (used in llms.txt and OG descriptions)

**Why it matters:** The existing `checklist-server.mjs` catches issues post-build. Unit tests
catch them pre-build, before broken pages are generated. Faster feedback loop, less wasted
build time.

### 3.2 Descriptive Error Boundaries

**Effort:** Low | **SEO impact:** Prevents broken pages from shipping | **PSI risk:** None

Every review page uses `getProductBySlug('slug')!` (non-null assertion). A typo produces a
cryptic null reference error at build time — or worse, a broken page that deploys.

**What to do:**

Replace the non-null assertion pattern with a helper that throws a descriptive error:

```typescript
export function requireProduct(slug: string): Product {
  const product = getProductBySlug(slug);
  if (!product) {
    throw new Error(
      `[Build Error] Product slug "${slug}" not found in config.ts. ` +
      `Available slugs: ${products.map(p => p.slug).join(', ')}`
    );
  }
  return product;
}
```

The build halts immediately with a message that tells you exactly what's wrong and what
slugs are available. Same pattern for `requireCategory`, `requireGuide`, etc.

---

## Priority 4: Code Organization

### 4.1 Split `config.ts`

**Effort:** Low-Medium | **SEO impact:** None | **PSI risk:** None

At 2,624 lines, `config.ts` handles products, categories, comparisons, guides, navigation,
email config, social proof stats, and helper functions. Splitting it improves readability
and makes diffs more reviewable when adding products.

**Suggested structure:**

```
src/lib/
  config.ts          → re-exports everything + helper functions
  products.ts        → products array
  categories.ts      → categories array
  comparisons.ts     → comparisons array
  guides.ts          → guides array (buyer, activity, knowledge)
  navigation.ts      → nav structure + social proof stats
```

Each file exports its array/object. `config.ts` imports and re-exports them all, so
existing imports throughout the codebase (`from '../lib/config'`) continue to work
without changes.

### 4.2 Homepage Sub-Components

**Effort:** Low | **SEO impact:** None | **PSI risk:** None

`src/pages/index.astro` at 1,269 lines is the largest page. Extract each section into a
component:

```
src/components/
  HomepageHero.astro
  FeaturedPicks.astro
  CategoryBrowser.astro
  LatestReviews.astro
  HowWeTest.astro
  PopularComparisons.astro
  HomepageFaq.astro
```

Total LOC stays the same, but each file is ~150 lines instead of one 1,269-line file.
Easier to find and edit specific sections.

---

## What NOT to Change

These architectural decisions are load-bearing for the 4x100 PSI score. Do not modify them:

| Decision | Why it matters |
|---|---|
| System fonts only (no Google Fonts) | Zero CLS, zero render-blocking font requests |
| External `.ts` scripts via `src/scripts/main.ts` | CSP `script-src 'self'` compliance |
| `assetsInlineLimit: 0` in Astro config | Prevents Vite from re-inlining scripts (breaks CSP) |
| `build.inlineStylesheets: 'always'` | Eliminates render-blocking `<link>` stylesheet requests |
| `width`/`height` attributes on all `<img>` | Prevents CLS from image loading |
| `{ passive: true }` on scroll/resize listeners | Required for Lighthouse scroll performance audit |
| GPU-composited animations only (`transform`/`opacity`) | Avoids "non-composited animations" Lighthouse failure |
| Single script entry point (no JS waterfall) | One bundled file instead of sequential module loads |
| `<link rel="preload">` for hero images | LCP optimization — hero starts downloading immediately |
| Dark mode only | Intentional design choice, not a gap |

---

## Implementation Order

If tackling these improvements, this order minimizes risk and maximizes value:

1. **Per-page `dateModified`** — biggest SEO win, smallest code change
2. **Config validation tests** — safety net before any refactoring
3. **Descriptive error boundaries** — small change, prevents silent failures
4. **Extract shared page logic** — reduces boilerplate with zero output change
5. **Split `config.ts`** — better maintainability for future product additions
6. **Homepage sub-components** — readability improvement
7. **Content collections** — largest refactor, do last (if at all)

Each step can be done independently. Run `npm run build && npm run checklist:auto` after
each change to verify nothing shifted.
