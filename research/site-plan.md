# Site Plan — OffGrid Filters

> Complete site architecture, content plan, and publishing schedule.

---

## Site Identity

- **Name:** OffGrid Filters
- **URL:** https://offgridfilters.com
- **Tagline:** Expert Water Filter Reviews & Guides
- **Niche:** Water filtration products (countertop, under-sink, refrigerator, pitcher replacement, survival/portable, whole-house)
- **Monetization:** Amazon Associates affiliate program
- **Affiliate Tag:** offgridfilter-20

---

## Content Architecture

### Total Pages: 77+

| Content Type | Count | URL Pattern |
|---|---|---|
| Homepage | 1 | `/` |
| Product Reviews | 29 | `/reviews/[product-slug]/` |
| Category Roundups | 6 | `/best-[category-slug]/` |
| Comparisons | 15 | `/[product-a]-vs-[product-b]/` |
| Buyer Guides | 8 | `/guides/[guide-slug]/` |
| Activity Guides | 10 | `/[niche]-for-[activity]/` |
| Knowledge Base | 8 | `/[topic-slug]/` |
| Resource Hub | 1 | `/guides/` |
| 404 Page | 1 | `/404` |

---

## Navigation Structure

### Desktop Header (Dropdown Menus)

**Reviews:**
- Bluevua RO100ROPOT-UV
- iSpring RCC7AK
- Waterdrop G3P600
- Brita UltraMax
- GE XWFE
- Timain Filter Straw

**Best Of:**
- Best Countertop Filters
- Best Under-Sink Filters
- Best Refrigerator Filters
- Best Replacement Filters
- Best Survival Filters
- Best Whole House Filters

**Compare:**
- Bluevua UV vs Lite UV
- iSpring vs Waterdrop
- Brita Standard vs Elite
- GE XWFE vs RPWFE
- Brita Elite vs ZeroWater

**Guides:**
- How to Choose a Water Filter
- Beginner Guide
- Budget Filters Under $50
- RO vs Carbon Filters
- Filter Cost Analysis

**Learn:**
- What Is Reverse Osmosis?
- NSF Certifications Explained
- Understanding TDS
- PFAS in Drinking Water
- Water Filter Types

**All Guides** → `/guides/`

---

## Publishing Strategy

### Bulk Launch — February 8, 2026

All 79 pages go live simultaneously on launch day for maximum authority signal.

**Content totals at launch:**
- Product Reviews: 29
- Category Roundups: 6
- Head-to-Head Comparisons: 15
- Buyer Guides: 8
- Activity Guides: 10
- Knowledge Base: 8
- Resource Hub: 1
- Homepage + 404: 2

**Rationale:** A bulk launch presents the site as a complete, authoritative resource from day one.
Google sees a fully interlinked content hub rather than a thin site that slowly adds pages.
All internal cross-links (navigation, related articles, comparison references) work immediately
with zero risk of 404s from staggered publication gates.

---

## SEO Strategy

### Schema Markup
- **Homepage:** WebSite + FAQPage
- **Reviews:** Product (with rating) + FAQPage + BreadcrumbList
- **Roundups:** ItemList + FAQPage + BreadcrumbList
- **Comparisons:** Article + FAQPage + BreadcrumbList
- **Guides:** Article + FAQPage + BreadcrumbList
- **Knowledge Base:** Article + FAQPage + BreadcrumbList
- **Resource Hub:** Article + BreadcrumbList

### Internal Linking Strategy
Every page links to 4 related articles:
1. Similar content (same category/type)
2. Category roundup
3. Relevant buyer guide
4. Related activity/knowledge base page

### Technical SEO
- Static site generation (Astro) for fastest possible page loads
- Trailing slash URLs for consistency
- Canonical URLs on every page
- Sitemap generation via @astrojs/sitemap
- robots.txt with AI crawler allowances
- llms.txt for AI search engine visibility

---

## Tone & Voice Guidelines

### Authority Voice
- First person plural: "we tested", "we recommend", "our team"
- Specific data over vague claims: "removes 99% of lead" not "removes lead"
- Honest about weaknesses: "The main drawback is..." not silence about flaws
- Use-case framing: "Best for families" not "Best overall"

### Trust Markers
- Every review has real pros AND cons
- Price source clearly stated (Amazon)
- Affiliate relationship disclosed in footer
- No fake urgency ("limited time", "selling fast")
- No "best overall" that wins everything

### CTA Language
- Reviews: "Check Price on Amazon" (informational)
- Roundups: "Check Price" per product (neutral)
- Comparisons: "Check Price" for both products (let reader decide)
- Guides: "See Our Top Pick" → links to review page
- Homepage: "Browse Reviews" / "Read Buying Guide" (no direct Amazon links)

---

## Design System Summary

### Colors (Dark Mode Only)
- Primary: Ocean Blue (HSL 205 70% 48%)
- Accent: Warm Amber (HSL 32 90% 52%)
- Background: Deep Navy (HSL 210 25% 5%)
- Foreground: Near White (HSL 210 10% 95%)

### Typography
- Font: Inter (Google Fonts, weights 400-900)
- Scale: Responsive clamp-based sizing

### Components (9)
- HeaderAstro (glassmorphism sticky nav)
- FooterAstro (link grid + affiliate disclosure)
- BreadcrumbsAstro (auto breadcrumbs with schema)
- RelatedArticlesAstro (4-article grid)
- StatCard (gradient counter)
- ProTip (expert callout)
- Callout (colored info/warning/tip/danger)
- ProductImage (SVG placeholder with 20 icons)
- ComparisonTable (responsive specs comparison)

### Animations
- 6 scroll reveal variants
- Spotlight card mouse tracking
- Animated counters
- Scroll progress bar
- Floating orbs
- Gradient text animation
- All respect `prefers-reduced-motion`
