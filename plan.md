# Plan: Fix SEO Checklist Failures & Warnings

> **Scope:** 2 failures, 5 warnings across Sections 2, 4, and 5.
> **Branch:** `claude/fix-seo-checklist-bgf43`

---

## Issue 1: [FAIL] noindex on content pages (1 page)

**Root cause:** The checklist server (`scripts/checklist-server.mjs:318`) does `html.includes('noindex')` on ALL HTML files including `dist/404.html`. The 404 page correctly has `noindex={true}` — it *should not* be indexed.

**Fix:** Update `scripts/checklist-server.mjs` to skip 404 pages when checking for noindex. At line ~318, wrap the check with a condition: only count noindex if the URL is not `/404/`.

**Files:** `scripts/checklist-server.mjs`

---

## Issue 2: [FAIL] Affiliate links missing rel attributes (39 issues)

**Root cause:** `src/pages/guides/best-water-filters-under-50.astro` has 8 Amazon affiliate links (via `getAffiliateUrl()`) that are missing `rel="nofollow sponsored noopener"`. The checklist counts each missing attribute per link.

**Fix:** Add `rel="nofollow sponsored noopener"` and `target="_blank"` to all 8 `<a>` tags with Amazon affiliate URLs in this file (~lines 90, 100, 106, 112, 118, 127, 133, 139).

**Files:** `src/pages/guides/best-water-filters-under-50.astro`

---

## Issue 3: [WARN] 66 titles over 60 characters

**Root cause:** Three title patterns are too long:

1. **Review pages (29 pages):** `${product.name} Review (${year}) — OffGrid Filters` — product names are 30-60+ chars, making titles 70-100+
2. **Comparison pages (15 pages):** `${productA.name} vs ${productB.name}: Which Is Better? (${year}) — OffGrid Filters` — 90-120+
3. **Category/guide/knowledge pages (~22 pages):** Various patterns with `— OffGrid Filters` suffix

**Fix — two-part approach:**

**Part A: Add `shortName` to products in config.**
Add a `shortName` field to the Product interface and all 29 products in `src/lib/config.ts`. Examples:
- `"Bluevua RO100ROPOT-UV Countertop Reverse Osmosis System"` → shortName: `"Bluevua RO100ROPOT-UV"`
- `"Samsung HAF-QIN/EXP Refrigerator Water Filter (DA97-17376B)"` → shortName: `"Samsung HAF-QIN"`
- `"Brita Standard Replacement Filters (4-Pack)"` → shortName: `"Brita Standard 4-Pack"`

**Part B: Shorten title patterns across all page types.**
- **Reviews (29 files):** Change to `${product.shortName} Review ${year} | OffGrid Filters`
- **Comparisons (15 files):** Change to `${productA.shortName} vs ${productB.shortName} (${year})`  — drop "Which Is Better?" and site suffix
- **Categories (6 files):** Change to `Best ${category.name} ${year} | OffGrid Filters` — drop "Expert Picks"
- **Guides/Knowledge/Activity (~22 files):** Trim any `guide.title` values in config exceeding ~42 chars, or drop the `— OffGrid Filters` suffix for long titles

**Files:**
- `src/lib/config.ts` — add `shortName` to interface + all 29 products
- All 29 `src/pages/reviews/*.astro`
- All 15 `src/pages/*-vs-*.astro`
- All 6 `src/pages/best-*.astro`
- ~22 guide/knowledge/activity pages (only where title exceeds 60 chars)

---

## Issue 4: [WARN] 6 meta descriptions over 160 characters

**Root cause:** Comparison pages and possibly some guide pages have descriptions exceeding 160 chars due to long product names or verbose descriptions.

**Fix:** Build the site first to identify the exact 6 pages (from dist/ HTML output). Then shorten each page's `description` prop to under 160 characters. For comparison pages using product names, use `shortName` from the config changes in Issue 3.

**Files:** Up to 6 page files (identified after build)

---

## Issue 5: [WARN] 1 page with skipped heading levels

**Root cause:** Could not identify from source code alone — the skip may be introduced during Astro rendering (e.g., a component inserting headings at unexpected levels).

**Fix:** Build the site, then search dist/ HTML for the page with skipped heading levels (e.g., H1→H3 or H2→H4). Fix the heading hierarchy in the source .astro file.

**Files:** 1 page file (identified after build)

---

## Issue 6: [WARN] 80 internal links missing trailing slash

**Root cause:** Despite `trailingSlash: 'always'` in astro.config.mjs, 80 links in the built HTML lack trailing slashes. Source .astro files appear correct, so these likely come from:
- Links embedded in JavaScript template strings (FAQ answer HTML strings rendered via `set:html`)
- Component-generated links (ComparisonTable CTA links, RelatedArticles, etc.)
- Config-driven navigation links that are missing trailing slashes in specific contexts

**Fix:** Build the site, then search dist/ HTML for `href="/[^"]*[^/]"` patterns (internal links not ending in `/` or `.ext`). Trace each pattern back to its source. This likely involves fixing a few systematic patterns (e.g., a component generating links without trailing slashes) rather than 80 individual edits.

**Files:** Multiple (identified after build investigation)

---

## Issue 7: [WARN] 7 thin comparison pages (under 1500 words)

**Root cause:** 7 comparison pages are 11-52 words short of the 1500 minimum:
- `brita-standard-vs-pur` (1448w, need +52)
- `everydrop-filter-1-vs-ge-xwfe` (1462w, need +38)
- `ge-xwfe-vs-ge-rpwfe` (1451w, need +49)
- `pentair-everpure-h1200-vs-pentair-everpure-h300` (1489w, need +11)
- `samsung-haf-qin-vs-everydrop-filter-a` (1454w, need +46)
- Plus 2 more (from the "7 thin" count — will identify after build)

**Fix:** Expand content in each thin page by adding depth to the category-by-category breakdown sections. Each category section needs only 10-30 additional words to collectively bring the page over 1500. Add real-world context, testing observations, or technical explanation. The shortfalls are small enough that expanding 2-3 sections per page by a sentence each is sufficient.

**Files:** 7 comparison page files in `src/pages/`

---

## Execution Order

1. **Build** (`npm run build`) to get dist/ output for investigating Issues 4, 5, 6
2. **Investigate** Issues 4, 5, 6 in the dist/ HTML to identify specific pages and patterns
3. **Fix Issue 1** — checklist server noindex exclusion (quick, 1 file)
4. **Fix Issue 2** — affiliate rel attributes (quick, 1 file)
5. **Fix Issue 3** — add shortName to config + shorten titles across ~72 files
6. **Fix Issue 4** — shorten 6 meta descriptions
7. **Fix Issue 5** — fix 1 skipped heading
8. **Fix Issue 6** — fix trailing slash patterns
9. **Fix Issue 7** — expand 7 thin comparison pages
10. **Rebuild + re-run checklist** to verify all fixes pass
11. **Commit and push** to `claude/fix-seo-checklist-bgf43`
