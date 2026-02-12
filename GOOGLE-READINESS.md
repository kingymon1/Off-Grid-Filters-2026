# GOOGLE-READINESS.md — Google Search Console Compliance & Indexing Guide

> **Purpose:** This document addresses every known reason Google rejects indexing affiliate site
> pages. It serves as both a preventive guide during build AND a diagnostic tool if pages are
> not indexed after submission. The site cannot be submitted to Google Search Console until
> every item in the "Pre-Submission Checklist" is confirmed.
>
> **Why this exists:** Previous sites built with earlier versions of this template had pages
> rejected by Google. This document ensures that problem is solved permanently.

---

## Table of Contents

1. [Why Google Rejects Affiliate Pages](#1-why-google-rejects-affiliate-pages)
2. [Pre-Submission Checklist](#2-pre-submission-checklist)
3. [Google's Helpful Content Requirements](#3-googles-helpful-content-requirements)
4. [Technical SEO Compliance](#4-technical-seo-compliance)
5. [Structured Data for Rich Results](#5-structured-data-for-rich-results)
6. [Affiliate Link Compliance](#6-affiliate-link-compliance)
7. [Content Quality Standards](#7-content-quality-standards)
8. [Post-Submission Diagnostics](#8-post-submission-diagnostics)
9. [Recovery Procedures](#9-recovery-procedures)

---

## 1. Why Google Rejects Affiliate Pages

Google makes indexing decisions based on both **site-level** and **page-level** quality signals.
For affiliate sites specifically, the December 2025 core update affected **71% of affiliate
sites** — the highest of any category. Understanding why is critical.

### The Two Rejection Types

**"Discovered — Currently Not Indexed"**
- Google found the URL but will NOT crawl it.
- This is a **site-level quality signal**. Google is inferring (from other pages on your domain)
  that this page is probably not worth visiting.
- **Fix:** Improve overall site quality. Build backlinks. Increase content depth across the
  entire site. This is not a single-page fix.

**"Crawled — Currently Not Indexed"**
- Google crawled the page, analyzed its content, and **deliberately chose NOT to index it**.
- This is a **page-level quality decision**. The content failed Google's quality threshold.
- **Fix:** Improve that specific page's content depth, uniqueness, internal linking, and
  information gain.

### The Top 10 Reasons Google Rejects Affiliate Pages

Ranked by how commonly they cause indexing failures:

| Rank | Cause | Type | How We Prevent It |
|------|-------|------|-------------------|
| 1 | **Thin content** — insufficient unique text | Page-level | 1500+ words per review, 2000+ per guide |
| 2 | **No information gain** — restates existing content | Page-level | Original analysis, specific insights, honest opinions |
| 3 | **Weak internal linking** — orphan pages | Page-level | 3+ contextual links to every page, max 3-click depth |
| 4 | **Site-level quality too low** — too many thin pages | Site-level | Every page must justify its existence at full quality |
| 5 | **Duplicate/overlapping content** — multiple pages same intent | Page-level | Unique angle per page, no keyword cannibalization |
| 6 | **New domain, no backlinks** — zero authority signals | Site-level | Accept 3-6 month ramp-up, target long-tail first |
| 7 | **Duplicate titles/meta descriptions** | Page-level | Every page unique title + description |
| 8 | **Canonical tag mismatches** — sitemap vs canonical disagreement | Technical | Trailing slash consistency, exact URL matching |
| 9 | **Missing `rel="sponsored"` on affiliate links** | Compliance | Every Amazon link: `rel="nofollow sponsored noopener"` |
| 10 | **No E-E-A-T signals** — no author, no expertise evidence | Site-level | About page, methodology, disclosure, visible dates |

### Critical Threshold

If over **5% of pages** are not indexed, Google may view the entire site as low-quality,
leading to cascading indexing failures. **Every page must be worth indexing.**

---

## 2. Pre-Submission Checklist

**Do not submit to Google Search Console until every item below is confirmed.**

### 2.1 Content Readiness

- [ ] Every product review has 1500+ words of original analysis
- [ ] Every review has genuine pros (3+) AND genuine cons (2+)
- [ ] Every guide has 2000+ words of substantive content
- [ ] Every comparison has balanced results (no one-sided outcomes)
- [ ] No placeholder text on any page ("lorem", "TODO", "TBD", "[placeholder]")
- [ ] No boilerplate content blocks repeated across pages
- [ ] Each page targets a unique primary keyword (no cannibalization)
- [ ] FAQ questions are unique per page (not repeated across pages)
- [ ] Price data matches `product-brief.yaml` exactly on every page

### 2.2 Technical Readiness

- [ ] `npm run build` succeeds with zero errors
- [ ] Every page has a unique `<title>` tag under 60 characters
- [ ] Every page has a unique `<meta name="description">` under 160 characters
- [ ] Every page has exactly one `<h1>`
- [ ] Every page has a self-referencing `<link rel="canonical">` with trailing slash
- [ ] Canonical URLs exactly match sitemap URLs (protocol + path + trailing slash)
- [ ] No `<meta name="robots" content="noindex">` on any content page
- [ ] HTML lang attribute: `<html lang="en">`
- [ ] All internal links resolve to 200 (zero broken links)
- [ ] Custom 404 page returns proper 404 status code

### 2.3 Structured Data Readiness

- [ ] JSON-LD schema on every content page (valid JSON, no errors)
- [ ] Article schema with per-page `datePublished` and `dateModified`
- [ ] Product schema with `offers` (price, currency, availability) on review pages
- [ ] `aggregateRating` with real rating values on review pages
- [ ] FAQPage schema on pages with FAQ sections
- [ ] BreadcrumbList schema on all content pages
- [ ] ItemList schema on category roundup pages
- [ ] No `SearchAction` in WebSite schema
- [ ] Entity linking (`about`/`mentions` with `sameAs` URLs) on all Article schemas
- [ ] Visible dates on page match `dateModified` in schema

### 2.4 Crawl Readiness

- [ ] `robots.txt` allows all pages: `User-agent: * / Allow: /`
- [ ] `robots.txt` has `Sitemap:` directive with absolute URL
- [ ] AI crawlers explicitly allowed (GPTBot, Claude-Web, PerplexityBot, Applebot-Extended)
- [ ] `sitemap-index.xml` exists and is valid XML
- [ ] All sitemap URLs return 200 status
- [ ] No redirect URLs in sitemap
- [ ] No `noindex` pages in sitemap
- [ ] `llms.txt` generates correctly (no "undefined" entries)

### 2.5 Internal Linking Readiness

- [ ] Zero orphan pages — every page has 2+ contextual internal links pointing to it
- [ ] All pages reachable within 3 clicks of homepage
- [ ] Resource hub (`/guides/`) links to every content page
- [ ] Related articles (4 per page) are contextually relevant
- [ ] Navigation dropdowns cover all content types
- [ ] Footer link grid covers all content types
- [ ] No internal links use `rel="nofollow"`

### 2.6 Affiliate Compliance

- [ ] All affiliate links: `rel="nofollow sponsored noopener"`
- [ ] All affiliate links: `target="_blank"`
- [ ] Amazon Associates disclosure in footer on every page
- [ ] AffiliateDisclosure component in ContentLayout (every content page)
- [ ] No hard-sell language ("Check Price" not "Buy Now")
- [ ] No fake urgency
- [ ] Consistent affiliate tag across all links

### 2.7 Security & Deployment

- [ ] HTTPS enabled on all pages
- [ ] Security headers configured (CSP, HSTS, X-Frame-Options)
- [ ] No mixed content (HTTP resources on HTTPS page)
- [ ] DNS properly configured and propagated

**Gate:** All 7 subsections confirmed → proceed to Google Search Console submission.

---

## 3. Google's Helpful Content Requirements

Google's Helpful Content System is integrated into every core update. It runs continuously.
Affiliate sites are evaluated more strictly than other content types.

### The Core Test Google Applies

> "Does this content provide significant added benefits that would make a user want to visit
> this site in search results instead of the original source of the content?"

If the answer is "No" for any page, that page will not be indexed.

### What Google Requires from Affiliate Content (Official Documentation)

From Google's "Write High-Quality Reviews" guidance:

1. **Evaluate from a user's perspective** — not from a sales perspective
2. **Demonstrate you are knowledgeable** — show genuine expertise
3. **Provide evidence** — visuals, links, data from your own experience
4. **Share quantitative measurements** — specific numbers, not vague claims
5. **Explain what sets something apart** from competitors
6. **Cover comparable things** to consider
7. **Describe key design choices** and their effect on users
8. **Focus on the most important decision-making factors**
9. **Include links to other useful resources** to help readers decide
10. **When recommending something as "the best," include first-hand supporting evidence**
11. **Ensure ranked lists have enough content** to stand on their own

### What Gets Penalized (Confirmed by December 2025 Update)

- Templated "best product" listicles without in-depth insights
- Content that summarizes manufacturer specs without original analysis
- AI-generated content without expert oversight, human editing, and original insights
- Sites that exist solely to monetize clicks through affiliate links
- High-volume publishing without substantial depth per page
- Content that would not exist if search engines did not exist

### The Information Gain Standard

Google's "information gain score" measures how unique your content is compared to what's
already indexed for the same query. To rank, your content must add information that doesn't
already exist elsewhere:

- Original testing data or observations
- Personal opinions based on genuine experience
- Expert commentary not available elsewhere
- Specific use-case recommendations other reviews don't cover
- Comparative analysis from actual usage, not just specs

### Content Self-Assessment

Before submitting, every content page should pass this test:

> "If someone read the top 3 Google results for this page's target keyword, would they learn
> something NEW by reading this page?"

If the answer is "No," the page needs more original analysis before submission.

---

## 4. Technical SEO Compliance

### 4.1 URL Structure

- Trailing slashes on all URLs (enforced by Astro config)
- Lowercase, hyphen-separated slugs
- Clean hierarchy: `/reviews/[slug]/`, `/best-[slug]/`, `/guides/[slug]/`
- No URL parameters that create duplicate content
- No session IDs or tracking parameters in URLs

### 4.2 Canonical Tags — The #1 Technical Cause of Indexing Failure

Canonical tag mismatches between sitemap and page are the most common technical cause of
"Duplicate without user-selected canonical" issues.

**Requirements:**
- Every page has a self-referencing canonical tag
- Canonical uses absolute URL: `https://[domain]/[path]/`
- Canonical includes trailing slash (matching `trailingSlash: 'always'`)
- Sitemap URL exactly matches canonical URL (byte-for-byte)
- No HTTP/HTTPS mismatches
- No www/non-www mismatches
- No trailing slash inconsistencies

**Verification:** Compare sitemap URLs against canonical tags on built pages.

### 4.3 HTTP Status Codes

- All content pages return 200
- Non-existent pages return 404 (not 200 with empty content)
- No redirect chains (A -> B -> C)
- No redirect loops
- `.html` URLs redirect to trailing-slash versions (configured in vercel.json)

### 4.4 Rendering

The site uses Astro static generation, which means all HTML is pre-rendered. This eliminates
JavaScript rendering issues that affect SPAs. However, verify:

- All content visible in page source (not loaded via client-side JS)
- No content hidden behind JavaScript interactions that Googlebot can't trigger
- No `display: none` on content that should be indexed

### 4.5 Server Response

- TTFB (Time to First Byte) < 200ms (Vercel edge achieves this)
- No intermittent 5xx errors
- Consistent availability (no downtime during critical crawl periods)

---

## 5. Structured Data for Rich Results

### 5.1 What Triggers Rich Results in Google SERPs

| Schema Type | Rich Result | Expected CTR Lift | Our Implementation |
|------------|-------------|-------------------|-------------------|
| Product + AggregateRating | Star ratings in SERP | 20-30% | Product schema on review pages |
| Review with positiveNotes/negativeNotes | Pros/Cons boxes | 15-25% | **Gap — needs Review schema with structured pros/cons** |
| FAQPage | FAQ accordion in SERP | 10-20% | FAQPage on pages with FAQs |
| BreadcrumbList | Breadcrumb trail in SERP | 5-10% | BreadcrumbList on all pages |
| ItemList | Carousel/list in SERP | 25%+ | ItemList on roundup pages |
| Article | Published date, author in SERP | Moderate | Article on all content pages |

### 5.2 Known Gap: Review Schema with Structured Pros/Cons

Google supports `positiveNotes` and `negativeNotes` properties in Review schema, which
trigger dedicated Pros/Cons boxes in search results. The site has pros/cons data in config.ts
but does NOT currently generate Review schema with these properties.

**To implement:**
- Add `generateReviewSchema()` to `src/lib/schema.ts`
- Include `positiveNotes` (ItemList of pros) and `negativeNotes` (ItemList of cons)
- Add to product review page schemas alongside existing Product schema

### 5.3 Schema Validation Protocol

**Before submission, validate with 3 tools:**

1. **Google Rich Results Test** (https://search.google.com/test/rich-results)
   - Tests what Google will actually see
   - Shows which rich result types are eligible
   - Must show zero errors

2. **Schema.org Validator** (https://validator.schema.org/)
   - Validates against the Schema.org specification
   - Catches properties that exist but aren't used correctly
   - Must show zero errors

3. **Vitest schema tests** (`npm run test`)
   - Unit tests for schema generators
   - Catches regression errors during development
   - Must pass 22+ tests

### 5.4 Schema Accuracy Rules

Google's structured data guidelines state that schema MUST accurately represent visible page
content. Violations can trigger manual actions:

- Schema `price` must match the price displayed on the page
- Schema `ratingValue` must match the star rating displayed
- Schema `dateModified` must match the visible "Last updated" date
- FAQ schema questions must appear as visible questions on the page
- Product schema `name` must match the product name displayed
- Do NOT add schema for content that isn't visible on the page

---

## 6. Affiliate Link Compliance

### 6.1 Google's Requirements

Google requires all affiliate links to use `rel="sponsored"`. Since 2019, Google treats
`rel="nofollow"`, `rel="sponsored"`, and `rel="ugc"` as hints. Using both `nofollow` and
`sponsored` together provides maximum compliance:

```html
<a href="https://amazon.com/dp/..." target="_blank" rel="nofollow sponsored noopener">
  Check Price on Amazon
</a>
```

### 6.2 Audit Checklist

- [ ] Every `<a>` tag with an Amazon URL has `rel="nofollow sponsored noopener"`
- [ ] No affiliate links use `rel="nofollow"` alone (missing `sponsored`)
- [ ] No affiliate links are missing `rel` attributes entirely
- [ ] `target="_blank"` on all affiliate links (opens in new tab)
- [ ] Consistent affiliate tag across all links (`?tag=[affiliate-tag]`)
- [ ] No internal links accidentally have `rel="nofollow"` or `rel="sponsored"`

### 6.3 Known Issue: ProductHero.astro

The `ProductHero.astro` component currently uses `rel="noopener noreferrer nofollow"` which
is missing `sponsored`. This must be fixed to `rel="noopener noreferrer nofollow sponsored"`
before submission.

### 6.4 Amazon Associates Program Requirements

Beyond Google compliance, Amazon Associates requires:

- Clear disclosure: "As an Amazon Associate, [site] earns from qualifying purchases."
- Disclosure visible on every page with affiliate links
- No misleading price representations (prices must match `product-brief.yaml`)
- No claiming Amazon endorsement or sponsorship
- No link cloaking (direct Amazon URLs only, no redirect services)
- 3 qualifying sales within 180 days of account creation
- Content must be publicly accessible (not behind paywalls)

---

## 7. Content Quality Standards

### 7.1 Content Depth Minimums

| Page Type | Minimum Words | Minimum Sections | Minimum Internal Links |
|-----------|-------------|-----------------|----------------------|
| Product Review | 1,500 | 8 (hero, overview, features, pros/cons, performance, value, FAQ, verdict) | 6+ (category, related reviews, guides) |
| Category Roundup | 2,000 | 7 (hero, quick picks, mini-reviews, methodology, buying guide, FAQ, CTA) | 8+ (every product review + guides) |
| Comparison | 1,500 | 6 (hero, at-a-glance, breakdown, who should get which, FAQ, CTA) | 4+ (both product reviews + guides) |
| Buyer Guide | 2,000 | 9 (hero, why it matters, key factors, deep dive, mistakes, recommendations, FAQ, CTA, email) | 6+ (product reviews + roundups) |
| Activity Guide | 1,500 | 8 (hero, why, what to look for, top picks, tips, FAQ, CTA, email) | 5+ (product reviews + buyer guides) |
| Knowledge Base | 1,000 | 5+ (topic-dependent) | 3+ (related guides + reviews) |

### 7.2 Review Authenticity Signals

Google's review system specifically looks for these signals. Each review should include:

- [ ] Specific quantitative data (capacity, flow rate, dimensions — not "good capacity")
- [ ] Honest weaknesses discovered through analysis (not minor nitpicks)
- [ ] "Best for [specific use case]" recommendation (not "best overall")
- [ ] Comparison to 1-2 alternatives with specific differentiators
- [ ] Price-to-value assessment (is the price justified by the features?)
- [ ] "Worth it if..." / "Skip it if..." clear guidance
- [ ] ProTip or Callout with genuine expert insight
- [ ] Verdict that takes a clear position (not "it depends on what you need")

### 7.3 Content That Google Explicitly Penalizes

**Never include any of these:**

- Generic product descriptions copied from Amazon/manufacturer
- Vague superlatives ("amazing", "incredible", "must-have") without supporting data
- Fake urgency ("limited time", "selling fast", "only X left")
- Misleading claims or exaggerated performance statements
- "Best overall" for a product that doesn't earn it in every category
- Identical intro/conclusion templates across pages
- Content that reads like an advertisement rather than an expert assessment
- FAQ questions that are really just keyword stuffing disguised as questions

### 7.4 E-E-A-T Implementation

| Signal | How We Implement It |
|--------|-------------------|
| **Experience** | "We tested", "in our analysis" language; specific observations; original product insights |
| **Expertise** | Detailed technical knowledge; "How We Test" methodology; comprehensive spec analysis |
| **Authoritativeness** | Consistent niche coverage; content clusters; cross-linked comprehensive content |
| **Trustworthiness** | Transparent disclosure; honest cons; no fake urgency; visible dates; privacy policy |

---

## 8. Post-Submission Diagnostics

### 8.1 Google Search Console Coverage Report

After submitting to GSC, check the Page Indexing report weekly.

**Healthy signals:**
- "Valid" count increasing weekly
- "Excluded" count only includes pages you intentionally excluded
- Zero "Error" pages
- Zero "Valid with warnings"

**Warning signals:**
- Pages stuck in "Discovered — Currently Not Indexed" for 2+ weeks
- Pages in "Crawled — Currently Not Indexed"
- "Soft 404" entries
- "Duplicate without user-selected canonical" entries
- "Page with redirect" entries

### 8.2 URL Inspection Tool — Page-by-Page Diagnosis

For any page not indexing, use the URL Inspection tool in GSC:

1. Enter the URL
2. Check "Coverage" section:
   - **Crawled?** If not, the issue is site-level (Google won't visit)
   - **Indexable?** If crawled but not indexable, check for noindex tags
   - **Indexed?** If indexable but not indexed, the content didn't meet quality threshold
3. Check "Enhancements" section:
   - Structured data detected?
   - Any structured data errors?
4. Click "View Tested Page":
   - Does the rendered HTML match what you expect?
   - Is all content visible?
   - Any JavaScript errors?

### 8.3 Diagnostic Decision Tree

```
Page not indexed
├── Status: "Discovered — Currently Not Indexed"
│   ├── Less than 2 weeks old → Wait (normal for new sites)
│   ├── More than 2 weeks old → Site-level quality issue
│   │   ├── Check: Are other pages from the site indexed?
│   │   │   ├── Yes → This page may have weaker signals; add internal links
│   │   │   └── No → Domain-level quality issue; improve all content + build backlinks
│   │   └── Action: Improve overall site quality, not just this page
│   └── Check: Does the page have internal links pointing to it?
│       ├── Yes → Quality issue
│       └── No → Orphan page; add contextual internal links
│
├── Status: "Crawled — Currently Not Indexed"
│   ├── Check content quality:
│   │   ├── Is the content thin (< 1000 words)?
│   │   ├── Does it add unique value vs existing Google results?
│   │   ├── Are there genuine pros AND cons?
│   │   └── Is there original analysis (not just specs)?
│   ├── Check technical issues:
│   │   ├── Is canonical tag correct and self-referencing?
│   │   ├── Does another page on the site target the same keyword?
│   │   └── Is the page returning 200 status?
│   └── Action: Improve specific page content, add internal links, fix technical issues
│
├── Status: "Duplicate without user-selected canonical"
│   ├── Check: Do two URLs serve the same content? (www vs non-www, HTTP vs HTTPS, trailing slash)
│   ├── Check: Is canonical tag present and correct?
│   ├── Check: Does sitemap URL match canonical URL?
│   └── Action: Add/fix canonical tags, set up 301 redirects, update sitemap
│
├── Status: "Soft 404"
│   ├── Check: Does the page return 200 but have very little content?
│   ├── Check: Is the page a redirect to an unrelated page?
│   └── Action: Add substantial content or return actual 404/410 status
│
└── Status: "Page with redirect"
    ├── Check: Is the URL in sitemap but redirecting elsewhere?
    └── Action: Update sitemap to use final destination URLs
```

---

## 9. Recovery Procedures

### 9.1 If Pages Are Not Indexed After 4 Weeks

**Step 1: Audit the unindexed pages**
- List all URLs in "Crawled - Not Indexed" and "Discovered - Not Indexed"
- For each, assess: content depth, uniqueness, internal link count

**Step 2: Prioritize fixes**
- Fix the highest-value pages first (category roundups, main buyer guide)
- These are most likely to get indexed and help the rest of the site

**Step 3: Improve content**
- Add 500+ words of original analysis to each thin page
- Add specific data points, unique observations, comparison context
- Ensure genuine pros AND cons

**Step 4: Strengthen internal linking**
- Add 2-3 new contextual links to each unindexed page from already-indexed pages
- Ensure unindexed pages are linked from the homepage or resource hub

**Step 5: Request re-indexing**
- Use URL Inspection tool on improved pages
- Click "Request Indexing"
- Do NOT mass-submit — fix root causes first, then request 5-10 at a time

**Step 6: Wait 2-4 weeks**
- Google's re-evaluation is not instant
- Monitor coverage report weekly
- Document changes for each fix cycle

### 9.2 If Site-Level Quality Is the Issue

Indicators: Most pages are "Discovered - Not Indexed" (not even crawled).

**Actions:**
1. Review ALL pages for quality — remove or significantly improve any weak pages
2. Ensure 0% thin content (every page has substantial, unique value)
3. Build external backlinks from relevant niche sites
4. Verify "How We Test" methodology is prominent and credible
5. Ensure about page establishes author expertise
6. Consider consolidating thin pages into fewer, more comprehensive pages
7. Accept that new domains need 3-6 months to build authority

### 9.3 If Hit by a Core Update

Indicators: Sudden traffic drop coinciding with a confirmed Google core update.

**Actions:**
1. Do NOT make panic changes immediately
2. Wait for the update to finish rolling out (typically 2 weeks)
3. Analyze which pages lost traffic and why
4. Cross-reference lost pages against the Content Quality Standards in Section 7
5. Improve content based on findings
6. Recovery from core updates typically takes 1-3 months after improvements

### 9.4 Emergency: Manual Action

If Google issues a manual action (visible in GSC under "Security & Manual Actions"):

1. Read the specific issue cited
2. Fix ALL instances of the violation across the entire site
3. Submit a reconsideration request explaining what was fixed
4. Wait for Google's response (can take weeks)
5. If rejected, fix remaining issues and resubmit

---

## Appendix A: Tools Reference

| Tool | URL | What It Checks |
|------|-----|---------------|
| Google Search Console | https://search.google.com/search-console | Indexing, coverage, enhancements, manual actions |
| Google Rich Results Test | https://search.google.com/test/rich-results | Structured data eligibility for rich results |
| Schema.org Validator | https://validator.schema.org/ | Schema.org specification compliance |
| PageSpeed Insights | https://pagespeed.web.dev/ | Core Web Vitals, performance scoring |
| Lighthouse (Chrome DevTools) | Built into Chrome | Performance, accessibility, SEO, best practices |
| SecurityHeaders.com | https://securityheaders.com/ | HTTP security header analysis |
| OpenGraph.xyz | https://www.opengraph.xyz/ | Social media preview testing |
| Facebook Sharing Debugger | https://developers.facebook.com/tools/debug | Facebook/OG tag validation |
| Mobile-Friendly Test | https://search.google.com/test/mobile-friendly | Mobile rendering verification |
| XML Sitemap Validator | https://www.xml-sitemaps.com/validate-xml-sitemap.html | Sitemap XML validation |

## Appendix B: Google's Affiliate Site Quality Self-Assessment

From Google's official documentation. Answer honestly for each page:

1. Does this content provide original information, research, or analysis?
2. Does this content provide a substantial, complete description of the topic?
3. Does this content provide insightful analysis or interesting information beyond the obvious?
4. If this content draws on other sources, does it avoid simply copying and add substantial value?
5. Does the main heading provide a descriptive, helpful summary of the content?
6. Is this content something you'd bookmark, share, or recommend?
7. Would you expect to see this content in a printed magazine or encyclopedia?
8. Does this content provide substantial value compared to other pages in search results?
9. Does this content have any spelling or style issues?
10. Is this content mass-produced or outsourced to many creators without proper oversight?
11. Would you trust information from this site about financial, health, or safety topics?
12. Would you recognize this site as an authoritative source if mentioned by name?

**Every page should earn a "Yes" on questions 1-8 and "No" on questions 9-10.**

## Appendix C: Timeline Expectations for New Affiliate Sites

| Milestone | Expected Timeframe | Notes |
|-----------|-------------------|-------|
| First page indexed | 1-7 days | After GSC submission and URL Inspection request |
| 50% of pages indexed | 2-4 weeks | Depends on content quality and internal linking |
| 95%+ pages indexed | 4-8 weeks | Site-level quality must be strong |
| First rich results appear | 2-6 weeks | After structured data is indexed |
| Meaningful organic traffic | 3-6 months | New domain "sandbox" period |
| Full authority established | 6-12 months | Requires backlinks and consistent quality |
| Competitive rankings | 12-24 months | For competitive keywords in the niche |

**Critical:** Do not be discouraged by slow early results. This is normal for new domains.
Focus on content quality and building a few quality backlinks during months 1-6.
