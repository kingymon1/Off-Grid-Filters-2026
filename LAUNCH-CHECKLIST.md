# LAUNCH-CHECKLIST.md — Complete Sign-Off Checklist

> **Purpose:** No site ships until every item in this checklist is confirmed. This document is
> referenced during build (Phase 4) and again before final deployment. Items are organized by
> who performs them (Claude automated, Lighthouse/tool-assisted, or manual human verification).
>
> **Rule:** The project cannot be signed off until every checkbox is marked complete. If an item
> fails, it must be fixed and re-verified before proceeding.

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

Run these checks on the live deployed site using the specified tools.

### 6.1 Lighthouse Audit (Run on 5 representative pages)

Test these pages: homepage, 1 product review, 1 category roundup, 1 comparison, 1 guide.

**Run:** Chrome DevTools -> Lighthouse -> Mobile + Desktop

| Metric | Target | Homepage | Review | Roundup | Compare | Guide |
|--------|--------|----------|--------|---------|---------|-------|
| Performance | >= 90 | _____ | _____ | _____ | _____ | _____ |
| Accessibility | >= 90 | _____ | _____ | _____ | _____ | _____ |
| Best Practices | >= 90 | _____ | _____ | _____ | _____ | _____ |
| SEO | >= 95 | _____ | _____ | _____ | _____ | _____ |

### 6.2 Core Web Vitals (PageSpeed Insights)

**Run:** https://pagespeed.web.dev/ on same 5 pages

| Metric | Target | Homepage | Review | Roundup | Compare | Guide |
|--------|--------|----------|--------|---------|---------|-------|
| LCP | < 2.5s | _____ | _____ | _____ | _____ | _____ |
| INP | < 200ms | _____ | _____ | _____ | _____ | _____ |
| CLS | < 0.1 | _____ | _____ | _____ | _____ | _____ |
| FCP | < 1.8s | _____ | _____ | _____ | _____ | _____ |
| TBT | < 200ms | _____ | _____ | _____ | _____ | _____ |

### 6.3 Performance Items

- [ ] No render-blocking CSS or JS flagged by Lighthouse
- [ ] All images use WebP format with responsive `srcset`
- [ ] Images have explicit `width` and `height` (or aspect-ratio CSS) to prevent CLS
- [ ] Google Fonts loaded with `font-display: swap` or equivalent
- [ ] No unused CSS/JS flagged by Lighthouse
- [ ] No console errors in browser DevTools on any page
- [ ] HTTPS on all pages (no mixed content)

**Sign-off: Section 6** — [ ] All scores meet targets | Date: ________ | By: ________

---

## SECTION 7: STRUCTURED DATA VALIDATION (Tool-Assisted — Human)

### 7.1 Google Rich Results Test

**Run:** https://search.google.com/test/rich-results

Test at least 1 URL per page template type:

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

**Run:** https://validator.schema.org/ on same URLs

- [ ] Zero errors on all tested pages
- [ ] No unknown types or properties

### 7.3 Social Preview Testing

**Run:** https://www.opengraph.xyz/ (or Facebook Sharing Debugger)

- [ ] Homepage shows correct title, description, and image in social preview
- [ ] Product review shows correct product-specific preview
- [ ] All pages show valid OG image (no broken image)

**Sign-off: Section 7** — [ ] All validators pass | Date: ________ | By: ________

---

## SECTION 8: SECURITY & HEADERS (Tool-Assisted — Human)

### 8.1 Security Headers

**Run:** https://securityheaders.com/ on the production URL

| Header | Expected Value | Present? |
|--------|---------------|----------|
| Content-Security-Policy | Configured per vercel.json | [ ] |
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` | [ ] |
| X-Content-Type-Options | `nosniff` | [ ] |
| X-Frame-Options | `DENY` or `SAMEORIGIN` | [ ] |
| Referrer-Policy | `strict-origin-when-cross-origin` | [ ] |
| Permissions-Policy | Restricts geolocation, camera, microphone | [ ] |

- [ ] SecurityHeaders.com grade: A or A+
- [ ] No `Server` header leaking software version
- [ ] No `X-Powered-By` header

### 8.2 SSL/HTTPS

- [ ] All pages served over HTTPS
- [ ] HTTP requests redirect to HTTPS
- [ ] No mixed content warnings (HTTP resources on HTTPS page)
- [ ] SSL certificate is valid and not expired

### 8.3 CSP Specific Checks

- [ ] CSP `form-action` includes `https://buttondown.com` (email capture form)
- [ ] Google Fonts load correctly under CSP
- [ ] Vercel Analytics script loads correctly under CSP
- [ ] No CSP violation errors in browser console

**Sign-off: Section 8** — [ ] All security checks pass | Date: ________ | By: ________

---

## SECTION 9: ACCESSIBILITY (Manual — Human)

### 9.1 Keyboard Navigation

- [ ] Tab key reaches all interactive elements (links, buttons, form inputs)
- [ ] Focus indicators are visible on all interactive elements
- [ ] Skip navigation link appears on focus and jumps to `#main-content`
- [ ] No keyboard traps (can tab out of every element)
- [ ] Mobile hamburger menu is keyboard-accessible
- [ ] Dropdown navigation menus are keyboard-accessible

### 9.2 Visual Accessibility

- [ ] Text is readable at all breakpoints (320px to 1920px+)
- [ ] Content remains usable at 200% browser zoom (no clipping or overlap)
- [ ] `prefers-reduced-motion` disables ALL animations (verify with OS accessibility setting)
- [ ] Color is never the sole means of conveying information
- [ ] Button text is readable on all button backgrounds (contrast check)

### 9.3 Screen Reader (Optional but Recommended)

- [ ] Page reads in logical order with NVDA/VoiceOver
- [ ] Images have descriptive alt text
- [ ] Decorative images have `alt=""`
- [ ] Form labels are announced correctly
- [ ] Landmark regions are present (`<main>`, `<nav>`, `<header>`, `<footer>`)

**Sign-off: Section 9** — [ ] Accessibility verified | Date: ________ | By: ________

---

## SECTION 10: ROBOTS, SITEMAP & CRAWL READINESS (Automated + Manual)

### 10.1 robots.txt

- [ ] File accessible at `[domain]/robots.txt`
- [ ] `User-agent: *` with `Allow: /`
- [ ] `Sitemap:` directive with absolute URL to `sitemap-index.xml`
- [ ] AI crawlers explicitly allowed:
  - [ ] `User-agent: GPTBot` → `Allow: /`
  - [ ] `User-agent: Claude-Web` → `Allow: /`
  - [ ] `User-agent: PerplexityBot` → `Allow: /`
  - [ ] `User-agent: Applebot-Extended` → `Allow: /`
- [ ] No accidental `Disallow:` blocking content pages
- [ ] No accidental blocking of CSS or JS files

### 10.2 Sitemap

- [ ] `sitemap-index.xml` accessible at `[domain]/sitemap-index.xml`
- [ ] All content pages present in sitemap
- [ ] No non-200 URLs in sitemap (no 404s, no redirects)
- [ ] No `noindex` pages in sitemap
- [ ] All sitemap URLs use HTTPS
- [ ] All sitemap URLs use trailing slashes (matching canonical URLs)
- [ ] Sitemap URLs exactly match canonical URLs on each page (protocol, path, trailing slash)
- [ ] `<lastmod>` dates present and accurate (not all set to same date)
- [ ] Under 50,000 URLs per sitemap (well under for this site)

### 10.3 llms.txt

- [ ] Accessible at `[domain]/llms.txt`
- [ ] Contains site name and tagline
- [ ] Lists all product review URLs with verdicts
- [ ] Lists all category roundup URLs with descriptions
- [ ] Lists all comparison URLs with product names (no "undefined")
- [ ] Lists all buyer guide URLs with descriptions
- [ ] Lists all activity guide URLs with descriptions
- [ ] Lists all knowledge base URLs with descriptions
- [ ] No empty or placeholder entries

### 10.4 404 Handling

- [ ] Non-existent URLs return proper 404 status code (not 200)
- [ ] Custom 404 page renders (not blank or generic server error)
- [ ] 404 page has link back to homepage
- [ ] 404 page has on-brand design

**Sign-off: Section 10** — [ ] Crawl readiness verified | Date: ________ | By: ________

---

## SECTION 11: IMAGES & MEDIA (Post-Phase 5 — Human)

Complete this section only after adding real images in Phase 5.

### 11.1 Product Images

- [ ] Every product has a hero image in `public/assets/`
- [ ] Product images registered in `productSlugs` set in `image-map.ts`
- [ ] Product images render with radial CSS mask (no white background visible)
- [ ] Product images have 3 responsive variants (`-small.webp`, `-medium.webp`, `.webp`)

### 11.2 Editorial Images

- [ ] Category roundup heroes present
- [ ] Comparison heroes present
- [ ] Buyer guide heroes present
- [ ] Activity guide heroes present
- [ ] Knowledge base heroes present
- [ ] Homepage featured picks images present
- [ ] Homepage category browser images present
- [ ] About page hero present
- [ ] All editorial images registered in `heroImages` map in `image-map.ts`
- [ ] All editorial images have 3 responsive variants
- [ ] Editorial images render full-width with `object-fit: cover` (not cropped awkwardly)

### 11.3 Image Quality

- [ ] All images are in WebP format
- [ ] No SVG placeholder icons remaining on any content page
- [ ] Responsive `srcset` loading correct variant at each breakpoint
- [ ] No broken images (all `<img>` tags resolve)
- [ ] All images have descriptive `alt` text
- [ ] Image file sizes are reasonable (< 200KB for full-size WebP)

**Sign-off: Section 11** — [ ] All images verified | Date: ________ | By: ________

---

## SECTION 12: GOOGLE SEARCH CONSOLE SUBMISSION (Manual — Human)

This is the final step. Do not proceed until ALL previous sections are signed off.

### 12.1 Prerequisites

- [ ] Site is live and accessible at production URL
- [ ] All Sections 1-11 signed off
- [ ] DNS fully propagated (verify with `dig` or DNS lookup tool)
- [ ] HTTPS working correctly

### 12.2 Google Search Console Setup

- [ ] Add property in Google Search Console (URL prefix method)
- [ ] Verify ownership (DNS TXT record, HTML file, or meta tag)
- [ ] Submit sitemap: `[domain]/sitemap-index.xml`
- [ ] Confirm sitemap status shows "Success" (not "Has errors" or "Couldn't fetch")

### 12.3 Initial Indexing

- [ ] Use URL Inspection tool on homepage — request indexing
- [ ] Use URL Inspection tool on 3-5 highest-priority pages — request indexing:
  - Homepage
  - Top product review
  - Main category roundup
  - Primary buyer guide
  - Most popular comparison
- [ ] Verify "URL is on Google" or "Indexing requested" for each

### 12.4 Post-Submission Monitoring (Check at 1 week, 2 weeks, 4 weeks)

**Week 1 check:**
- [ ] Pages starting to appear in "Valid" section of coverage report
- [ ] No pages in "Error" status
- [ ] Record: _____ valid, _____ excluded, _____ error

**Week 2 check:**
- [ ] Majority of pages indexed (> 50%)
- [ ] No "Crawled - Currently Not Indexed" issues
- [ ] No "Soft 404" flags
- [ ] No "Duplicate without user-selected canonical" issues
- [ ] Record: _____ valid, _____ excluded, _____ error

**Week 4 check:**
- [ ] 95%+ of content pages indexed
- [ ] Rich results appearing in "Enhancements" section:
  - [ ] Product snippets detected
  - [ ] FAQ snippets detected
  - [ ] Breadcrumb snippets detected
  - [ ] Review snippets detected
- [ ] No structured data errors in "Enhancements"
- [ ] Record: _____ valid, _____ excluded, _____ error

### 12.5 Troubleshooting (If Pages Are Not Indexed After 4 Weeks)

If > 5% of pages remain unindexed, work through this diagnostic:

1. **Check page-level quality:** Is the unindexed page thin? Does it add unique value?
2. **Check internal linking:** Does the page have 2+ contextual internal links pointing to it?
3. **Check canonical tags:** Does the canonical match the sitemap URL exactly?
4. **Check for duplicate content:** Is another page on the site covering the same topic?
5. **Check with URL Inspection:** What status does Google report? ("Crawled not indexed" vs "Discovered not indexed")
6. **For "Discovered not indexed":** This is a site-level quality signal — improve overall site quality, build backlinks
7. **For "Crawled not indexed":** This is a page-level quality issue — improve that specific page's content depth, uniqueness, and internal linking

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
