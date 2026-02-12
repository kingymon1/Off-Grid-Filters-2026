# LAUNCH-CHECKLIST.md — Complete Sign-Off Checklist

> **Purpose:** No site ships until every item in this checklist is confirmed. This document is
> referenced during build (Phase 4) and again before final deployment. Items are organized by
> who performs them (Claude automated, Lighthouse/tool-assisted, or manual human verification).
>
> **Rule:** The project cannot be signed off until every checkbox is marked complete. If an item
> fails, it must be fixed and re-verified before proceeding.

---

## Quick Start — Checklist Runner

Open a **new terminal window** and follow these steps in order:

**Step 1.** Navigate to the project folder:
```bash
cd Off-Grid-Filters-2026
```

**Step 2.** Install dependencies (skip if you already ran this):
```bash
npm install
```

**Step 3.** Start the checklist dashboard:
```bash
npm run checklist
```

**Step 4.** Open your browser and go to:
```
http://localhost:3200
```

**Step 5.** If old results are showing, click the **"Reset"** button (top-left of the controls bar)
to clear them and start fresh.

**Step 6.** Click the **"Run Automated Checks (S1-S5)"** button in the dashboard. This runs
the build pipeline, SEO audit, schema validation, link crawling, and content quality checks.
Results appear in the UI as they complete.

**Step 7.** Scroll down to Sections 6-12 and use the **Pass / Fail / N/A** buttons for each
manual check item (Lighthouse, security headers, accessibility, etc.).

**Step 8.** Use the dropdown next to **"Export"** to download a filtered Markdown report
(Full Report, Failures + Warnings, Failures Only, or Warnings Only).

> **CLI mode (no browser):** If you prefer terminal-only output, run `npm run checklist:auto`
> instead of Step 3. This prints results to stdout and exits with code 1 if any checks fail.
>
> **To stop the server:** Press `Ctrl+C` in the terminal where it's running.

---

## How to Use This Checklist

**During Build (Phase 4):** Claude works through Sections 1-5 autonomously. Every automated
check must pass. Semi-automated checks are verified by running tools and recording results.

**Pre-Deployment (Phase 6):** After images are added (Phase 5), run through the full checklist
again. Sections 6-8 require human verification with specific tools.

**Sign-Off Gate:** Every section has a sign-off line. ALL sections must be signed off before
the site is submitted to Google Search Console.

---

## SECTION 1: BUILD & INFRASTRUCTURE (Automated — Claude)

These checks run during `npm run build` and CI pipeline. All must pass with zero errors.

### 1.1 Build Pipeline

- [ ] `npm install` completes without errors
- [ ] `npm run lint` passes with zero warnings and zero errors
- [ ] `npm run test` passes all tests (22+ schema tests)
- [ ] `npm run build` completes with exit code 0 and zero errors
- [ ] `dist/index.html` exists in build output
- [ ] `dist/sitemap-index.xml` exists and is valid XML
- [ ] `dist/robots.txt` exists
- [ ] `dist/404.html` exists (custom 404 page)
- [ ] `dist/llms.txt` exists and contains all pages with descriptions (no "undefined" entries)
- [ ] `dist/favicon.ico` and `dist/favicon.png` exist
- [ ] Total page count matches expected (70-90+ pages)

### 1.2 File Inventory

Every file listed in CLAUDE.md FILE CHECKLIST must exist:

**Root files (13):**
- [ ] `package.json`
- [ ] `astro.config.mjs`
- [ ] `tailwind.config.ts`
- [ ] `tsconfig.json`
- [ ] `postcss.config.js`
- [ ] `eslint.config.js`
- [ ] `vercel.json`
- [ ] `.gitignore`
- [ ] `.env.example`
- [ ] `product-brief.yaml`
- [ ] `CLAUDE.md`
- [ ] `TEMPLATE-GUIDE.md`
- [ ] `IMAGE-GUIDE.md`

**Infrastructure:**
- [ ] `.github/workflows/ci.yml`
- [ ] `public/robots.txt`
- [ ] `public/favicon.ico`
- [ ] `public/favicon.png`

**Source libraries:**
- [ ] `src/lib/config.ts`
- [ ] `src/lib/image-map.ts`
- [ ] `src/lib/schema.ts`
- [ ] `src/lib/schema.test.ts`

**Layouts:**
- [ ] `src/layouts/BaseLayout.astro`
- [ ] `src/layouts/ContentLayout.astro`

**Components (12):**
- [ ] `src/components/HeaderAstro.astro`
- [ ] `src/components/FooterAstro.astro`
- [ ] `src/components/BreadcrumbsAstro.astro`
- [ ] `src/components/RelatedArticlesAstro.astro`
- [ ] `src/components/StatCard.astro`
- [ ] `src/components/ProTip.astro`
- [ ] `src/components/Callout.astro`
- [ ] `src/components/ProductImage.astro`
- [ ] `src/components/ComparisonTable.astro`
- [ ] `src/components/EmailCapture.astro`
- [ ] `src/components/AffiliateDisclosure.astro`
- [ ] `src/components/ProductHero.astro`

**Pages:**
- [ ] `src/pages/index.astro` (homepage)
- [ ] `src/pages/404.astro`
- [ ] `src/pages/guides/index.astro` (resource hub)
- [ ] `src/pages/llms.txt.ts` (dynamic API route)
- [ ] All product review pages (1 per product)
- [ ] All category roundup pages (1 per category)
- [ ] All comparison pages (1 per comparison)
- [ ] All buyer guide pages
- [ ] All activity guide pages
- [ ] All knowledge base pages

**Scripts:**
- [ ] `scripts/convert-to-webp.mjs`
- [ ] `scripts/generate-local-images.mjs`
- [ ] `scripts/image-gen-server.mjs`

**Research:**
- [ ] `research/product-catalog-research.md`
- [ ] `research/category-research.md`
- [ ] `research/market-research.md`
- [ ] `research/design-decisions.md`
- [ ] `research/site-plan.md`

### 1.3 Configuration Integrity

- [ ] `astro.config.mjs` has correct `site` URL matching production domain
- [ ] `astro.config.mjs` uses `output: 'static'` and `trailingSlash: 'always'`
- [ ] `tailwind.config.ts` maps all CSS custom properties to Tailwind tokens
- [ ] `tsconfig.json` has `@/*` path alias to `./src/*`
- [ ] `vercel.json` has security headers (CSP, X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy)
- [ ] `vercel.json` CSP `form-action` includes `https://buttondown.com`
- [ ] `vercel.json` cache headers: `max-age=86400` for `/assets/*`, `immutable` ONLY for `/_astro/*`
- [ ] `vercel.json` has `.html` to trailing-slash redirect rules
- [ ] `.gitignore` excludes `node_modules`, `dist`, `.astro`, `.env`

**Sign-off: Section 1** — [ ] All items verified | Date: ________ | By: ________

---

## SECTION 2: ON-PAGE SEO (Automated — Claude)

Every content page must pass ALL of these checks. Verify by parsing build output.

### 2.1 Title Tags

- [ ] Every page has a unique `<title>` tag
- [ ] No two pages share the same title
- [ ] All titles under 60 characters
- [ ] All titles contain the primary target keyword naturally
- [ ] Homepage title includes site name and niche
- [ ] Review page titles follow: `[Product Name] Review [Year]`
- [ ] Roundup titles follow: `Best [Category] [Year]: Expert Picks`
- [ ] Comparison titles follow: `[Product A] vs [Product B]: Which Is Better in [Year]?`

### 2.2 Meta Descriptions

- [ ] Every page has a unique `<meta name="description">`
- [ ] No two pages share the same meta description
- [ ] All under 160 characters
- [ ] Each contains target keyword + value proposition
- [ ] No generic or placeholder descriptions remain

### 2.3 Heading Hierarchy

- [ ] Every page has exactly one `<h1>`
- [ ] No skipped heading levels (h1 -> h3 without h2)
- [ ] H1 contains primary keyword naturally
- [ ] Heading hierarchy is logical (h1 -> h2 -> h3 -> h4)

### 2.4 Canonical URLs

- [ ] Every page has a self-referencing `<link rel="canonical">`
- [ ] Canonical URLs use absolute paths (full https:// URL)
- [ ] Canonical URLs include trailing slash (matching `trailingSlash: 'always'`)
- [ ] Canonical URLs match sitemap URLs exactly (protocol, slashes, casing)
- [ ] No page has a canonical pointing to a different page (unless intentional)

### 2.5 Open Graph & Social Tags

- [ ] Every page has `og:title` (matches or is close to `<title>`)
- [ ] Every page has `og:description`
- [ ] Every page has `og:image` (valid URL, ideally 1200x630)
- [ ] Every page has `og:url` (matches canonical)
- [ ] Every page has `og:type` (`article` for content, `website` for homepage)
- [ ] Every page has `twitter:card` (`summary_large_image`)
- [ ] Every page has `twitter:title` and `twitter:description`

### 2.6 HTML Fundamentals

- [ ] `<html lang="en">` on every page
- [ ] `<meta charset="UTF-8">` on every page
- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1">` on every page
- [ ] DNS prefetch for Amazon: `<link rel="dns-prefetch" href="https://www.amazon.com">`
- [ ] Preconnect for Google Fonts: `<link rel="preconnect" href="https://fonts.googleapis.com">`
- [ ] No `<meta name="robots" content="noindex">` on any content page
- [ ] No duplicate `<meta>` tags on any page

**Sign-off: Section 2** — [ ] All items verified | Date: ________ | By: ________

---

## SECTION 3: STRUCTURED DATA & SCHEMA (Automated — Claude)

Verify by parsing JSON-LD from build output. Every schema must be valid JSON.

### 3.1 Schema Presence by Page Type

**Product review pages — each must have:**
- [ ] Article schema with `headline`, `datePublished`, `dateModified`, `author`, `publisher`
- [ ] Product schema with `name`, `description`, `image`, `offers` (price, priceCurrency, availability), `aggregateRating`
- [ ] Review schema with `positiveNotes` and `negativeNotes` (structured pros/cons for Google rich result eligibility)
- [ ] FAQPage schema (if page has FAQ section)
- [ ] BreadcrumbList schema (Home -> Reviews -> [Product Name])
- [ ] Entity linking: `about` = reviewed product (type: Product, sameAs: Amazon URL)
- [ ] Entity linking: `mentions` = up to 3 related products (type: Product, sameAs: Amazon URLs)

**Category roundup pages — each must have:**
- [ ] Article schema with per-page dates
- [ ] ItemList schema listing all products in category
- [ ] FAQPage schema
- [ ] BreadcrumbList schema
- [ ] Entity linking: `about` = category topic (sameAs: Wikidata entity URL)

**Comparison pages — each must have:**
- [ ] Article schema with per-page dates
- [ ] FAQPage schema
- [ ] BreadcrumbList schema
- [ ] Entity linking: `about` = both products (type: Product, sameAs: Amazon URLs)

**Buyer guide pages — each must have:**
- [ ] Article schema with per-page dates
- [ ] FAQPage schema
- [ ] BreadcrumbList schema
- [ ] Entity linking: `about` = niche topic (sameAs: Wikidata entity URL)

**Activity guide pages — each must have:**
- [ ] Article schema with per-page dates
- [ ] FAQPage schema
- [ ] BreadcrumbList schema
- [ ] Entity linking: `about` = niche topic (sameAs: Wikidata entity URL)

**Knowledge base pages — each must have:**
- [ ] Article schema with per-page dates
- [ ] BreadcrumbList schema
- [ ] Entity linking: `about` = niche topic (sameAs: Wikidata entity URL)

**Homepage:**
- [ ] WebSite schema (NO SearchAction)
- [ ] Organization schema
- [ ] FAQPage schema
- [ ] ItemList schema (featured picks)

**Resource hub:**
- [ ] CollectionPage schema
- [ ] Entity linking: `about` = niche topic (sameAs: Wikidata entity URL)

### 3.2 Schema Quality

- [ ] All JSON-LD is syntactically valid JSON (parseable without errors)
- [ ] No `undefined`, `null`, or empty string values in schema output
- [ ] `datePublished` and `dateModified` use ISO 8601 format (YYYY-MM-DD)
- [ ] `datePublished` and `dateModified` are per-page (not site-wide defaults)
- [ ] `aggregateRating.ratingValue` is between 1 and 5
- [ ] `aggregateRating.reviewCount` is a positive integer
- [ ] Product `offers.price` matches the price in `product-brief.yaml` / config.ts
- [ ] Product `offers.priceCurrency` is "USD"
- [ ] Product `offers.availability` is a valid Schema.org URL
- [ ] No `SearchAction` exists anywhere in any schema
- [ ] `sameAs` URLs in entity linking are valid (Wikidata URLs or Amazon URLs)
- [ ] Author and Publisher objects are consistent across all pages
- [ ] Schema `@graph` array combines multiple schemas correctly (no nesting errors)

### 3.3 Visible-to-Schema Correspondence

- [ ] Visible "Last updated" date on every content page matches `dateModified` in its Article schema
- [ ] Star ratings displayed visually match `aggregateRating.ratingValue` in Product schema
- [ ] Prices displayed on page match `offers.price` in Product schema
- [ ] Product names in schema match product names displayed on page
- [ ] FAQ questions in schema match FAQ questions visible on page
- [ ] Breadcrumb text in schema matches breadcrumb text displayed on page

**Sign-off: Section 3** — [ ] All items verified | Date: ________ | By: ________

---

## SECTION 4: INTERNAL LINKING & SITE ARCHITECTURE (Automated — Claude)

These are the checks that prevent Google's "Discovered - Currently Not Indexed" and
"Crawled - Currently Not Indexed" rejections.

### 4.1 Zero Orphan Pages

- [ ] Every product review page is linked from at least: its category roundup page, the resource hub, and the header/footer navigation
- [ ] Every category roundup page is linked from: the homepage, the header navigation, the resource hub, and at least 2 product review pages
- [ ] Every comparison page is linked from: the homepage (popular comparisons section), the header navigation, the resource hub, and both compared product review pages
- [ ] Every buyer guide is linked from: the header navigation, the resource hub, the homepage, and at least 2 product review pages (via related articles)
- [ ] Every activity guide is linked from: the header navigation, the resource hub, and at least 2 product review pages (via related articles)
- [ ] Every knowledge base page is linked from: the header navigation, the resource hub, and at least 1 guide page

### 4.2 Click Depth

- [ ] All content pages are reachable within 3 clicks of the homepage
- [ ] Navigation dropdowns provide direct links to high-priority pages
- [ ] Resource hub (`/guides/`) indexes every content page on the site
- [ ] Footer link grid covers all content types

### 4.3 Cross-Linking

- [ ] Every content page has a `RelatedArticlesAstro` component with exactly 4 related articles
- [ ] Related articles are contextually relevant (not random):
  - 1 similar product review
  - 1 category roundup that includes this product
  - 1 relevant buyer guide
  - 1 related activity/use-case guide
- [ ] Product review pages link to their category roundup ("See all [category] reviews")
- [ ] Category roundup pages link to full reviews ("Read Full Review") for every listed product
- [ ] Comparison pages link to full reviews for both compared products
- [ ] Buyer guides link to recommended products via "See Our Top Pick"
- [ ] Activity guides link to recommended products and relevant buyer guides
- [ ] No circular-only linking (page A -> B -> A with no other connections)

### 4.4 Navigation Completeness

- [ ] Header has dropdown menus for: Reviews, Best Of, Compare, Guides, Learn
- [ ] Header dropdowns include 5-7 most popular items per category
- [ ] "All Guides" link in header goes to resource hub
- [ ] Mobile hamburger menu has all the same sections as desktop
- [ ] Footer link grid organized by content type mirrors header structure
- [ ] Breadcrumbs are present and correct on every content page

### 4.5 Link Health

- [ ] Zero broken internal links (all `<a href>` pointing to internal pages resolve to 200)
- [ ] No internal links with `rel="nofollow"` (nofollow is only for external/affiliate links)
- [ ] All internal links use trailing slashes (matching `trailingSlash: 'always'`)
- [ ] No internal links point to redirect URLs (all point to final destination)
- [ ] No internal links use absolute URLs where relative would work (reduces errors)
- [ ] Anchor text is descriptive (no "click here", "read more", or bare URLs)

**Sign-off: Section 4** — [ ] All items verified | Date: ________ | By: ________

---

## SECTION 5: CONTENT QUALITY (Automated + Manual — Claude)

These checks prevent Google's Helpful Content System from penalizing the site.

### 5.1 Per-Page Content Checks (Every Content Page)

- [ ] No placeholder text remains (no "lorem ipsum", "TODO", "TBD", "[placeholder]", "coming soon")
- [ ] H1 contains target keyword naturally (not stuffed)
- [ ] Content length is substantial (reviews: 1500+ words, guides: 2000+ words, comparisons: 1500+ words, knowledge base: 1000+ words)
- [ ] At least 1 ProductImage component present
- [ ] At least 1 CTA with affiliate link (on pages that warrant it)
- [ ] Affiliate disclosure visible (via AffiliateDisclosure component in ContentLayout)
- [ ] EmailCapture component present where required (guides, homepage, resource hub)
- [ ] Visible "Last updated" date present

### 5.2 Review Quality (Every Product Review)

- [ ] Every product has genuine pros (minimum 3)
- [ ] Every product has genuine cons (minimum 2) — **no review has only pros**
- [ ] Verdict is specific and mentions who should/shouldn't buy
- [ ] "Best for [use case]" framing used (not "best overall" for everything)
- [ ] Price-to-value analysis present
- [ ] Comparison context provided (mentions alternatives)
- [ ] Specific data points cited (measurements, capacities, ratings — not vague claims)
- [ ] No manufacturer spec sheet rehash — original analysis and insights present
- [ ] ProTip or Callout components add genuine expert knowledge
- [ ] FAQ answers follow: Direct answer -> Technical explanation -> Recommendation

### 5.3 Comparison Quality

- [ ] Both products in every comparison win at least some categories — no one-sided results
- [ ] Verdict card gives clear winner with specific reasoning
- [ ] "Get [Product A] if..." / "Get [Product B] if..." use-case recommendations present
- [ ] ComparisonTable component present with both products
- [ ] Winner badges distributed across categories (not all to one product)

### 5.4 Affiliate Compliance

- [ ] All affiliate links use `rel="nofollow sponsored noopener"` (check every `<a>` to Amazon)
- [ ] All affiliate links open in new tab (`target="_blank"`)
- [ ] All products use the SAME affiliate tag from config
- [ ] Amazon Associates disclosure in footer on every page: "As an Amazon Associate, [site] earns from qualifying purchases."
- [ ] AffiliateDisclosure component renders on every content page (via ContentLayout)
- [ ] No hard-sell language: "Check Price" not "Buy Now"
- [ ] No fake urgency: no "limited time", "selling fast", "only X left"
- [ ] No misleading claims about products
- [ ] Prices displayed match `product-brief.yaml` exactly (never guessed)

### 5.5 Content Uniqueness

- [ ] No two pages target the same primary keyword
- [ ] No content blocks repeated verbatim across multiple pages (boilerplate)
- [ ] Each page has a unique angle that justifies its existence
- [ ] FAQ questions don't repeat across pages (each FAQ set is page-specific)
- [ ] Meta descriptions are all unique (verified in Section 2.2)

### 5.6 Information Gain

- [ ] Reviews include specific observations beyond manufacturer specs
- [ ] Comparisons include original analysis, not just side-by-side specs
- [ ] Guides include actionable advice and specific recommendations
- [ ] Knowledge base articles explain concepts in a way that adds value beyond Wikipedia
- [ ] "How We Test" methodology section on homepage establishes credibility

**Sign-off: Section 5** — [ ] All items verified | Date: ________ | By: ________

---

## SECTION 6: PERFORMANCE & CORE WEB VITALS (Tool-Assisted — Human)

Run these checks on the **live deployed site**. You need Google Chrome.

### 6.1 Lighthouse Audit (Run on 5 representative pages)

Test these 5 pages: homepage, 1 product review, 1 category roundup, 1 comparison, 1 guide.

**How to run Lighthouse (repeat for each of the 5 pages):**
1. Open the page in Google Chrome
2. Press `F12` (or right-click → "Inspect") to open Developer Tools
3. Click the **"Lighthouse"** tab at the top of DevTools (you may need to click `>>` to find it)
4. Under "Mode" select **Navigation**
5. Under "Device" select **Mobile** (run mobile first — Google indexes mobile-first)
6. Check all categories: Performance, Accessibility, Best Practices, SEO
7. Click **"Analyze page load"**
8. Wait for the audit to complete (30-60 seconds)
9. Record the 4 scores in the table below
10. Repeat with **Desktop** selected if you want both (mobile is the priority)

| Metric | Target | Homepage | Review | Roundup | Compare | Guide |
|--------|--------|----------|--------|---------|---------|-------|
| Performance | >= 90 | _____ | _____ | _____ | _____ | _____ |
| Accessibility | >= 90 | _____ | _____ | _____ | _____ | _____ |
| Best Practices | >= 90 | _____ | _____ | _____ | _____ | _____ |
| SEO | >= 95 | _____ | _____ | _____ | _____ | _____ |

**If a score is below target:** Expand that section in the Lighthouse report. It lists
every failing audit with a description and fix suggestion. Address the red/orange items first.

### 6.2 Core Web Vitals (PageSpeed Insights)

Test the same 5 pages using Google's PageSpeed Insights.

**How to run PageSpeed Insights (repeat for each of the 5 pages):**
1. Go to https://pagespeed.web.dev/
2. Paste the full URL of the page (e.g., `https://offgridfilters.com/reviews/bluevua-ro100ropot-uv/`)
3. Click **"Analyze"**
4. Wait for the results (15-30 seconds)
5. Look at the **"Diagnostics"** section — it shows LCP, FCP, TBT, CLS, and Speed Index
6. Record the values in the table below
7. Note: INP requires real user data (CrUX). If no field data exists yet, use TBT as proxy

| Metric | Target | Homepage | Review | Roundup | Compare | Guide |
|--------|--------|----------|--------|---------|---------|-------|
| LCP | < 2.5s | _____ | _____ | _____ | _____ | _____ |
| INP | < 200ms | _____ | _____ | _____ | _____ | _____ |
| CLS | < 0.1 | _____ | _____ | _____ | _____ | _____ |
| FCP | < 1.8s | _____ | _____ | _____ | _____ | _____ |
| TBT | < 200ms | _____ | _____ | _____ | _____ | _____ |

### 6.3 Performance Items

Check these while you have Lighthouse and DevTools open:

- [ ] No render-blocking CSS or JS flagged by Lighthouse (check "Performance" → "Opportunities")
- [ ] All images use WebP format with responsive `srcset` (check "Performance" → "Diagnostics")
- [ ] Images have explicit `width` and `height` (or aspect-ratio CSS) to prevent CLS
- [ ] Google Fonts loaded with `font-display: swap` or equivalent
- [ ] No unused CSS/JS flagged by Lighthouse (check "Performance" → "Diagnostics")
- [ ] No console errors in browser DevTools (click the **"Console"** tab in DevTools — should be empty/clean)
- [ ] HTTPS on all pages — the URL bar shows a lock icon, no "Not Secure" warning

**Sign-off: Section 6** — [ ] All scores meet targets | Date: ________ | By: ________

---

## SECTION 7: STRUCTURED DATA VALIDATION (Tool-Assisted — Human)

### 7.1 Google Rich Results Test

This tool checks whether Google can read your structured data and which rich result types
(star ratings, FAQ dropdowns, breadcrumbs, pros/cons) your pages are eligible for.

**How to run (repeat for 8 URLs — one per page template type):**
1. Go to https://search.google.com/test/rich-results
2. Paste a page URL (e.g., `https://offgridfilters.com/reviews/bluevua-ro100ropot-uv/`)
3. Click **"TEST URL"**
4. Wait for the test to complete (10-30 seconds)
5. The results page shows:
   - **Green checkmarks** = detected and eligible for rich results (good)
   - **Yellow warnings** = detected but has optional fields missing (acceptable)
   - **Red errors** = broken schema that will NOT generate rich results (must fix)
6. Record the results in the table below
7. Under "Detected items" note which types appear (e.g., "Product", "FAQ", "Breadcrumb")

| Page Type | URL Tested | Errors | Warnings | Rich Types Detected |
|-----------|-----------|--------|----------|-------------------|
| Homepage | __________ | _____ | _____ | _________________ |
| Product Review | __________ | _____ | _____ | _________________ |
| Category Roundup | __________ | _____ | _____ | _________________ |
| Comparison | __________ | _____ | _____ | _________________ |
| Buyer Guide | __________ | _____ | _____ | _________________ |
| Activity Guide | __________ | _____ | _____ | _________________ |
| Knowledge Base | __________ | _____ | _____ | _________________ |
| Resource Hub | __________ | _____ | _____ | _________________ |

- [ ] Zero errors across all tested pages
- [ ] Product pages show: Product, Review/AggregateRating eligible
- [ ] Product pages show: Review with Pros/Cons (positiveNotes/negativeNotes) eligible
- [ ] FAQ sections show: FAQPage eligible
- [ ] Roundup pages show: ItemList eligible
- [ ] Breadcrumbs show: BreadcrumbList eligible on all pages

### 7.2 Schema.org Validator

This tool validates against the Schema.org specification (catches issues Google's tool misses).

**How to run (test the same 8 URLs):**
1. Go to https://validator.schema.org/
2. Click the **"Fetch URL"** tab
3. Paste the same URL you tested in 7.1
4. Click **"Run"**
5. Check for errors (red) and warnings (yellow)
6. Repeat for each of the 8 URLs

- [ ] Zero errors on all tested pages
- [ ] No unknown types or properties

### 7.3 Social Preview Testing

This checks how your pages look when shared on Facebook, Twitter/X, LinkedIn, and Slack.

**How to run:**
1. Go to https://www.opengraph.xyz/
2. Paste your homepage URL
3. The tool shows a preview of how the page appears when shared on social media
4. Check: correct title, description, and image showing
5. Repeat for 1 product review URL

- [ ] Homepage shows correct title, description, and image in social preview
- [ ] Product review shows correct product-specific preview
- [ ] All pages show valid OG image (no broken image)

**Sign-off: Section 7** — [ ] All validators pass | Date: ________ | By: ________

---

## SECTION 8: SECURITY & HEADERS (Tool-Assisted — Human)

### 8.1 Security Headers

**How to run:**
1. Go to https://securityheaders.com/
2. Enter your production URL (e.g., `https://offgridfilters.com`)
3. Click **"Scan"**
4. The tool shows a letter grade (A+ to F) and lists each security header
5. Check each header in the table below against the results
6. Green = present and correct, Red = missing or misconfigured

| Header | Expected Value | Present? |
|--------|---------------|----------|
| Content-Security-Policy | Configured per vercel.json | [ ] |
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` | [ ] |
| X-Content-Type-Options | `nosniff` | [ ] |
| X-Frame-Options | `DENY` or `SAMEORIGIN` | [ ] |
| Referrer-Policy | `strict-origin-when-cross-origin` | [ ] |
| Permissions-Policy | Restricts geolocation, camera, microphone | [ ] |

- [ ] SecurityHeaders.com grade: A or A+
- [ ] No `Server` header leaking software version (scroll down in results to check)
- [ ] No `X-Powered-By` header (scroll down in results to check)

### 8.2 SSL/HTTPS

**How to check:**
1. Visit your site in Chrome — look at the URL bar:
   - Lock icon = HTTPS working correctly
   - "Not Secure" warning = HTTPS is broken (must fix before launch)
2. Try visiting `http://offgridfilters.com` (without the S) — it should redirect to `https://`
3. Open DevTools (`F12`) → **Console** tab → look for "Mixed Content" warnings (there should be none)

- [ ] All pages served over HTTPS (lock icon in URL bar)
- [ ] HTTP requests redirect to HTTPS (try `http://` — should redirect)
- [ ] No mixed content warnings (no "Mixed Content" in DevTools Console)
- [ ] SSL certificate is valid and not expired (click the lock icon → "Connection is secure")

### 8.3 CSP Specific Checks

**How to check:**
1. If the site has an email capture form (Buttondown configured), try submitting a test email
   - If the form submits successfully, CSP `form-action` is correct
   - If blocked, the Console will show a CSP violation error mentioning `form-action`
2. Open DevTools (`F12`) → **Console** tab
3. Browse through 3-4 pages
4. Look for any red errors mentioning "Content Security Policy" or "CSP"
5. Check that fonts load correctly (text should be in Inter font, not a fallback serif/sans-serif)

- [ ] CSP `form-action` includes `https://buttondown.com` (email capture form submits OK)
- [ ] Google Fonts load correctly under CSP (text appears in Inter font)
- [ ] Vercel Analytics script loads correctly under CSP (no CSP errors in console)
- [ ] No CSP violation errors in browser console

**Sign-off: Section 8** — [ ] All security checks pass | Date: ________ | By: ________

---

## SECTION 9: ACCESSIBILITY (Manual — Human)

### 9.1 Keyboard Navigation

**How to test:** Put your mouse/trackpad aside. You will navigate the site using only the keyboard.

1. Open the homepage in Chrome
2. Press `Tab` repeatedly to move focus through the page
3. Watch for a **visible highlight/outline** around each element as you tab to it
4. The first `Tab` press should reveal a "Skip to main content" link at the top of the page
5. Press `Enter` on that skip link — the page should jump past the navigation to the main content
6. Continue tabbing — you should reach every link, button, and form input on the page
7. When you reach the navigation menu, press `Enter` or `Space` to open dropdowns
8. Press `Escape` to close dropdowns
9. If you ever get "stuck" and can't tab away from an element, that's a keyboard trap (must fix)
10. Repeat on 1 product review page and 1 guide page

- [ ] Tab key reaches all interactive elements (links, buttons, form inputs)
- [ ] Focus indicators are visible on all interactive elements (you can see where you are)
- [ ] Skip navigation link appears on first Tab press and jumps to `#main-content`
- [ ] No keyboard traps (you can always tab away from every element)
- [ ] Mobile hamburger menu is keyboard-accessible (resize browser to mobile width, test)
- [ ] Dropdown navigation menus open/close with keyboard

### 9.2 Visual Accessibility

**How to test zoom:**
1. Open any page in Chrome
2. Press `Ctrl` + `+` (Windows/Linux) or `Cmd` + `+` (Mac) repeatedly until you reach 200% zoom
3. Scroll through the entire page — text and content should still be readable with no overlap
4. Press `Ctrl` + `0` (or `Cmd` + `0`) to reset zoom

**How to test reduced motion:**
- **Windows:** Settings → Accessibility → Visual Effects → turn OFF "Animation effects"
- **Mac:** System Preferences → Accessibility → Display → check "Reduce motion"
- **After enabling:** Reload the site. All animations, scroll reveals, and transitions should be disabled

**How to test responsive:**
1. Open DevTools (`F12`) → click the device toggle icon (looks like a phone/tablet, top-left of DevTools)
2. Set width to `320px` — check text is still readable, no horizontal scrollbar
3. Set width to `768px` — check layout adjusts properly
4. Set width to `1920px` — check nothing looks stretched or broken

- [ ] Text is readable at all breakpoints (320px to 1920px+)
- [ ] Content remains usable at 200% browser zoom (no clipping or overlap)
- [ ] `prefers-reduced-motion` disables ALL animations (verify with OS setting above)
- [ ] Color is never the sole means of conveying information (e.g., pros aren't just green, cons aren't just red — they also have icons/text labels)
- [ ] Button text is readable on all button backgrounds (white text on colored buttons is legible)

### 9.3 Screen Reader (Optional but Recommended)

**How to test (Mac):**
1. Press `Cmd` + `F5` to turn on VoiceOver
2. Use `Ctrl` + `Option` + Right Arrow to move through page elements
3. Listen — content should read in a logical order (heading → content → next section)
4. Press `Cmd` + `F5` again to turn off VoiceOver

**How to test (Windows):**
1. Download NVDA (free) from https://www.nvaccess.org/
2. Launch NVDA, then open your site in Chrome
3. Press `Tab` to move through elements — NVDA will read each one aloud
4. Press `H` to jump between headings — they should be in logical order

- [ ] Page reads in logical order with NVDA/VoiceOver
- [ ] Images have descriptive alt text (screen reader announces what the image shows)
- [ ] Decorative images have `alt=""` (screen reader skips them silently)
- [ ] Form labels are announced correctly (email input announces "Email address" or similar)
- [ ] Landmark regions are present (screen reader can jump between header, nav, main, footer)

**Sign-off: Section 9** — [ ] Accessibility verified | Date: ________ | By: ________

---

## SECTION 10: ROBOTS, SITEMAP & CRAWL READINESS (Automated + Manual)

### 10.1 robots.txt

**How to check:**
1. Open your browser and go to `https://[your-domain]/robots.txt`
2. You should see a plain text file (not a 404 or error page)
3. Read through it and verify the items below

- [ ] File accessible at `[domain]/robots.txt` (loads as plain text, not 404)
- [ ] Contains `User-agent: *` with `Allow: /`
- [ ] Contains `Sitemap:` line with full URL to `sitemap-index.xml` (e.g., `Sitemap: https://offgridfilters.com/sitemap-index.xml`)
- [ ] AI crawlers explicitly allowed (look for these lines in the file):
  - [ ] `User-agent: GPTBot` → `Allow: /`
  - [ ] `User-agent: Claude-Web` → `Allow: /`
  - [ ] `User-agent: PerplexityBot` → `Allow: /`
  - [ ] `User-agent: Applebot-Extended` → `Allow: /`
- [ ] No accidental `Disallow:` lines blocking content pages
- [ ] No lines blocking CSS or JS files

### 10.2 Sitemap

**How to check:**
1. Go to `https://[your-domain]/sitemap-index.xml` in your browser
2. You should see XML content (a structured list of URLs). If you see a 404, the sitemap is missing
3. Click through to the individual sitemap files listed in the index
4. Spot-check 5-10 URLs from the sitemap — click them and confirm they load (200 status, not 404 or redirect)
5. Count the total URLs — should be 70-90+ matching your page count

- [ ] `sitemap-index.xml` accessible at `[domain]/sitemap-index.xml` (loads as XML)
- [ ] All content pages present in sitemap (count matches expected page count)
- [ ] Spot-checked URLs all load correctly (no 404s, no redirects)
- [ ] No `noindex` pages in sitemap
- [ ] All sitemap URLs use `https://` (not `http://`)
- [ ] All sitemap URLs end with trailing slash `/` (matching canonical URLs)
- [ ] Sitemap URLs exactly match canonical URLs on each page (compare a few — protocol, path, trailing slash must be identical)
- [ ] `<lastmod>` dates present and accurate (look for `<lastmod>` tags in the XML — dates should vary across pages, not all be the same)
- [ ] Under 50,000 URLs per sitemap (will be well under for this site)

### 10.3 llms.txt

**How to check:**
1. Go to `https://[your-domain]/llms.txt` in your browser
2. You should see a plain text file organized by section (Product Reviews, Best Of, etc.)
3. Read through and verify the items below

- [ ] Accessible at `[domain]/llms.txt` (loads as plain text, not 404)
- [ ] Contains site name and tagline at the top
- [ ] Lists all product review URLs with verdict descriptions
- [ ] Lists all category roundup URLs with descriptions
- [ ] Lists all comparison URLs with both product names (no "undefined" in any line)
- [ ] Lists all buyer guide URLs with descriptions
- [ ] Lists all activity guide URLs with descriptions
- [ ] Lists all knowledge base URLs with descriptions
- [ ] No empty or placeholder entries (every line has a URL + description)

### 10.4 404 Handling

**How to check:**
1. Go to a URL that doesn't exist, e.g., `https://[your-domain]/this-page-does-not-exist/`
2. You should see a custom-designed 404 page (not a blank white page or generic server error)
3. The page should have your site's branding, a helpful message, and a link back to the homepage
4. To verify the actual status code: open DevTools (`F12`) → **Network** tab → reload the page →
   click the first entry → check "Status Code" — it should say `404` (not `200`)

- [ ] Non-existent URLs return proper 404 status code (check Network tab — must say 404, not 200)
- [ ] Custom 404 page renders (has site branding, not blank or generic)
- [ ] 404 page has link back to homepage
- [ ] 404 page has on-brand design (matches the rest of the site)

**Sign-off: Section 10** — [ ] Crawl readiness verified | Date: ________ | By: ________

---

## SECTION 11: IMAGES & MEDIA (Post-Phase 5 — Human)

Complete this section only after adding real images in Phase 5. Before Phase 5, pages will
show SVG placeholder icons — that is expected and not a failure.

### 11.1 Product Images

**How to check:**
1. Open a product review page (e.g., `/reviews/bluevua-ro100ropot-uv/`)
2. The product image should show the actual product photo on a dark background
3. The white background from the Amazon product photo should be blended away by a radial mask
   (you should NOT see a white rectangle around the product)
4. Check `public/assets/` in the project folder — each product should have 3 files:
   `[slug]-hero.webp`, `[slug]-hero-medium.webp`, `[slug]-hero-small.webp`

- [ ] Every product has a hero image in `public/assets/`
- [ ] Product images registered in `productSlugs` set in `image-map.ts`
- [ ] Product images render with radial CSS mask (no white background visible around product)
- [ ] Product images have 3 responsive variants (`-small.webp`, `-medium.webp`, `.webp`)

### 11.2 Editorial Images

**How to check:**
1. Browse through category roundup, comparison, guide, and knowledge base pages
2. Each should have a full-width hero image (a scene/lifestyle photo, not a product cutout)
3. The image should fill its container edge-to-edge without awkward cropping
4. Check the homepage: featured picks section should show product images, category browser
   section should show scene images

- [ ] Category roundup heroes present (browse each roundup page)
- [ ] Comparison heroes present (browse each comparison page)
- [ ] Buyer guide heroes present (browse each guide page)
- [ ] Activity guide heroes present (browse each activity page)
- [ ] Knowledge base heroes present (browse each knowledge base page)
- [ ] Homepage featured picks images present
- [ ] Homepage category browser images present
- [ ] About page hero present
- [ ] All editorial images registered in `heroImages` map in `image-map.ts`
- [ ] All editorial images have 3 responsive variants
- [ ] Editorial images render full-width with `object-fit: cover` (not cropped awkwardly)

### 11.3 Image Quality

**How to check:**
1. Browse through 10-15 pages across all types — no page should show an SVG placeholder icon
   (a gray box with a line drawing icon). Every page should have a real photo
2. Open DevTools (`F12`) → **Network** tab → reload a page → filter by "Img"
   - Check that image files end in `.webp` (not `.jpg` or `.png`)
   - Check file sizes in the "Size" column — full-size images should be under 200KB
3. Resize the browser window narrow (mobile width) — images should swap to smaller variants
   (check Network tab — you should see `-small.webp` files loading instead of full-size)

- [ ] All images are in WebP format (check file extensions in Network tab)
- [ ] No SVG placeholder icons remaining on any content page (browse all pages)
- [ ] Responsive `srcset` loading correct variant at each breakpoint (resize and check Network tab)
- [ ] No broken images — no missing image icons on any page (browse all pages)
- [ ] All images have descriptive `alt` text (hover over images — tooltip shows alt text; or check Lighthouse Accessibility)
- [ ] Image file sizes are reasonable (< 200KB for full-size WebP — check Network tab)

**Sign-off: Section 11** — [ ] All images verified | Date: ________ | By: ________

---

## SECTION 12: GOOGLE SEARCH CONSOLE SUBMISSION (Manual — Human)

This is the final step. Do not proceed until ALL previous sections are signed off.

### 12.1 Prerequisites

Before starting this section, confirm these are complete:

- [ ] Site is live and accessible at production URL (open it in a browser — it should load)
- [ ] All Sections 1-11 signed off (look above — every section sign-off line must be checked)
- [ ] DNS fully propagated (see "How to check DNS" below)
- [ ] HTTPS working correctly (lock icon in browser URL bar)

**How to check DNS propagation:**
1. Go to https://www.whatsmydns.net/
2. Enter your domain (e.g., `offgridfilters.com`)
3. Select record type **A** and click **Search**
4. You should see green checkmarks across most/all locations worldwide
5. If some locations show red X or different IP addresses, wait 24-48 hours and check again
6. Do NOT proceed to GSC setup until DNS is fully propagated (all green)

### 12.2 Google Search Console Setup

**How to set up Google Search Console (one-time setup):**

1. Go to https://search.google.com/search-console/
2. Sign in with the Google account that will manage this site
3. Click **"Add property"** (button at top-left, or on the welcome page)
4. Choose **"URL prefix"** (the right-hand option, NOT "Domain")
5. Enter the full URL: `https://[your-domain]/` (include `https://` and trailing slash)
6. Click **"Continue"**

**How to verify ownership (choose ONE method):**

- **Option A — HTML file (Recommended, simplest for Vercel):**
  1. GSC will give you an HTML file to download (e.g., `google1234567890abcdef.html`)
  2. Save this file in your project's `public/` folder
  3. Commit, push, and wait for Vercel to redeploy
  4. Go back to GSC and click **"Verify"**
  5. It should say "Ownership verified" with a green checkmark

- **Option B — DNS TXT record:**
  1. GSC will give you a TXT record value (e.g., `google-site-verification=abc123...`)
  2. Go to your domain registrar's DNS settings (Namecheap, Cloudflare, etc.)
  3. Add a new **TXT** record with host `@` and the value GSC provided
  4. Wait 5-10 minutes for DNS propagation
  5. Go back to GSC and click **"Verify"**

- **Option C — Meta tag:**
  1. GSC will give you a `<meta>` tag to add to your homepage
  2. Add it to `src/layouts/BaseLayout.astro` inside the `<head>`
  3. Commit, push, and wait for Vercel to redeploy
  4. Go back to GSC and click **"Verify"**

**How to submit the sitemap:**

1. In GSC, click **"Sitemaps"** in the left sidebar
2. In the "Add a new sitemap" box, type: `sitemap-index.xml`
3. Click **"Submit"**
4. Wait 1-2 minutes, then refresh the page
5. Under "Submitted sitemaps" the status should show **"Success"**
6. If it shows "Has errors" or "Couldn't fetch":
   - Check that `https://[your-domain]/sitemap-index.xml` loads in your browser
   - If it loads in the browser but GSC can't fetch it, wait 24 hours and resubmit

- [ ] Property added in Google Search Console (URL prefix method)
- [ ] Ownership verified (green checkmark in GSC)
- [ ] Sitemap submitted: `[domain]/sitemap-index.xml`
- [ ] Sitemap status shows **"Success"** (not "Has errors" or "Couldn't fetch")

### 12.3 Initial Indexing

**How to request indexing for priority pages:**

1. In GSC, click **"URL Inspection"** in the left sidebar (or use the search bar at the top)
2. Paste your **homepage URL** (e.g., `https://offgridfilters.com/`) and press Enter
3. Wait for GSC to inspect the URL (5-15 seconds)
4. If it says "URL is not on Google", click **"Request Indexing"**
5. Wait for the request to process (may take 1-2 minutes)
6. You should see "Indexing requested" confirmation
7. Repeat steps 2-6 for each of these priority pages:
   - Homepage: `https://[your-domain]/`
   - Top product review: `https://[your-domain]/reviews/[your-top-product-slug]/`
   - Main category roundup: `https://[your-domain]/best-[your-main-category]/`
   - Primary buyer guide: `https://[your-domain]/guides/[your-main-guide]/`
   - Most popular comparison: `https://[your-domain]/[comparison-slug]/`

**Note:** Google limits indexing requests to ~10 per day. Start with the 5 highest-priority
pages above. The remaining pages will be discovered organically via sitemap and internal links.

- [ ] URL Inspection run on homepage — status recorded: ________________
- [ ] URL Inspection run on top product review — status recorded: ________________
- [ ] URL Inspection run on main category roundup — status recorded: ________________
- [ ] URL Inspection run on primary buyer guide — status recorded: ________________
- [ ] URL Inspection run on most popular comparison — status recorded: ________________
- [ ] All inspected pages show "URL is on Google" or "Indexing requested"

### 12.4 Post-Submission Monitoring

**Set calendar reminders** for the 3 check-in dates below. Google typically takes 2-4 weeks
to fully crawl and index a new site. Do not panic if coverage is low in Week 1.

**How to check the coverage report (same steps for all 3 check-ins):**

1. Go to https://search.google.com/search-console/
2. Click **"Pages"** in the left sidebar (formerly called "Coverage")
3. Look at the chart at the top — it shows:
   - **Green bar** = "Indexed" (pages Google has accepted)
   - **Gray bar** = "Not indexed" (pages Google knows about but hasn't accepted yet)
   - **Red bar** = "Error" (pages with problems — must fix)
4. Below the chart, click each status to see which specific pages are in that group
5. Record the numbers in the table below

**Week 1 check** (date: ________):
- [ ] Pages starting to appear in "Indexed" (green) section
- [ ] No pages in "Error" (red) status
- [ ] Record: _____ indexed, _____ not indexed, _____ error

**Week 2 check** (date: ________):
- [ ] Majority of pages indexed (> 50% — check green bar vs gray bar)
- [ ] No "Crawled - Currently Not Indexed" issues (check "Not indexed" → look for this reason)
- [ ] No "Soft 404" flags (check "Not indexed" → look for "Soft 404")
- [ ] No "Duplicate without user-selected canonical" issues (check "Not indexed" → look for this reason)
- [ ] Record: _____ indexed, _____ not indexed, _____ error

**Week 4 check** (date: ________):

First check the Pages report:
- [ ] 95%+ of content pages indexed (green bar should be much larger than gray)
- [ ] Record: _____ indexed, _____ not indexed, _____ error

Then check the Rich Results / Enhancements report:
1. In GSC, look in the left sidebar under **"Enhancements"** (or **"Shopping"** for product data)
2. Click each enhancement type to see if Google detected your structured data:

- [ ] Product snippets detected (click "Product" under Enhancements)
- [ ] FAQ snippets detected (click "FAQs" under Enhancements)
- [ ] Breadcrumb snippets detected (click "Breadcrumbs" under Enhancements)
- [ ] Review snippets detected (click "Review snippet" under Enhancements)
- [ ] No structured data errors in any Enhancements report (all items show "Valid", not "Error")

**Note:** Not all enhancement types appear immediately. If you don't see "FAQs" or "Product"
in the sidebar yet, Google may not have processed enough pages. Check again in a few days.

### 12.5 Troubleshooting (If Pages Are Not Indexed After 4 Weeks)

If > 5% of pages remain unindexed, work through this diagnostic step by step:

**Step 1: Identify the problem type**
1. In GSC, go to **Pages** → click on the **"Not indexed"** section
2. Look at the "Why pages aren't indexed" table — it shows specific reasons
3. Find your unindexed pages and note the reason given. The two most common are:
   - **"Discovered - Currently Not Indexed"** = Google found the URL but decided not to crawl it (site-level quality issue)
   - **"Crawled - Currently Not Indexed"** = Google crawled the page but decided not to index it (page-level quality issue)

**Step 2: For "Discovered - Currently Not Indexed"**
This means Google doesn't think your site is important enough to crawl these pages. Fix by:
1. Improving the overall site quality (better content, more unique insights)
2. Building backlinks from other websites (guest posts, social media, forum contributions)
3. Ensuring strong internal linking — every unindexed page should have 3+ internal links pointing to it
4. Waiting — new sites naturally build authority over 2-3 months

**Step 3: For "Crawled - Currently Not Indexed"**
This means Google crawled the page but found it too thin or duplicative. Fix by:
1. Open the specific page URL in GSC URL Inspection to see Google's assessment
2. Check: Is the content unique? Does it add value beyond what other pages on your site already cover?
3. Check: Is the content deep enough? (Reviews should be 1500+ words, guides 2000+)
4. Check: Does the canonical tag match the sitemap URL exactly?
5. Check: Is there another page on your site covering the same topic? If so, merge them or differentiate
6. After making improvements, use URL Inspection → "Request Indexing" again

**Step 4: For "Duplicate without user-selected canonical"**
This means Google thinks two of your pages are the same content. Fix by:
1. Check that canonical URLs include trailing slashes and match sitemap URLs exactly
2. Check that `vercel.json` redirects `.html` to trailing-slash versions
3. Check that no two pages have nearly identical content
4. Use URL Inspection on the affected page — Google will show which URL it chose as canonical

**Step 5: For "Soft 404"**
This means Google thinks the page has so little content it might as well be a 404. Fix by:
1. Open the page — does it have substantial content? (Not just a heading and a few sentences)
2. Add more depth: more sections, more analysis, more unique information
3. Use URL Inspection → "Request Indexing" after improving

**Step 6: Re-check**
After making any fixes above:
1. Commit and push changes, wait for Vercel to redeploy
2. Use URL Inspection on each fixed page → click "Request Indexing"
3. Set a calendar reminder to check coverage again in 1 week
4. Repeat the diagnostic if pages are still not indexed

**Reference:** See `GOOGLE-READINESS.md` for a comprehensive guide to Google indexing issues,
prevention strategies, and the full diagnostic decision tree (Section 8 and Section 9).

**Sign-off: Section 12** — [ ] GSC setup complete, monitoring in progress | Date: ________ | By: ________

---

## FINAL SIGN-OFF

All 12 sections must be individually signed off before the site is considered launch-complete.

| Section | Description | Signed Off? | Date | By |
|---------|------------|-------------|------|-----|
| 1 | Build & Infrastructure | [ ] | | |
| 2 | On-Page SEO | [ ] | | |
| 3 | Structured Data & Schema | [ ] | | |
| 4 | Internal Linking & Architecture | [ ] | | |
| 5 | Content Quality | [ ] | | |
| 6 | Performance & Core Web Vitals | [ ] | | |
| 7 | Structured Data Validation (Tools) | [ ] | | |
| 8 | Security & Headers | [ ] | | |
| 9 | Accessibility | [ ] | | |
| 10 | Robots, Sitemap & Crawl Readiness | [ ] | | |
| 11 | Images & Media | [ ] | | |
| 12 | Google Search Console | [ ] | | |

**Site launch status:** [ ] NOT READY / [ ] APPROVED FOR LAUNCH

**Launch date:** ________________

**Signed by:** ________________
