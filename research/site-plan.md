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

## Publishing Schedule

### Wave 1 — February 11, 2026 (Launch Day)
**Reviews (6):**
- Bluevua RO100ROPOT-UV
- Bluevua RO100ROPOT-Lite UV
- Amazon Basics 10-Cup Pitcher
- Brita UltraMax 27-Cup
- Pentair Everpure H-1200
- iSpring RCC7AK

**Category Roundups (2):**
- Best Countertop & Pitcher Filters
- Best Under-Sink Filters

**Guides (1):**
- How to Choose a Water Filter

**Total:** 9 pages

### Wave 2 — February 14, 2026
**Reviews (4):**
- Pentair Everpure H-300
- Waterdrop G3P600
- everydrop Filter 1
- GE XWFE

**Comparisons (3):**
- Bluevua UV vs Lite UV
- iSpring vs Waterdrop
- Pentair H-1200 vs H-300

**Category Roundups (2):**
- Best Refrigerator Filters
- Best Replacement Filters

**Guides (2):**
- Beginner Guide to Water Filtration
- What Is Reverse Osmosis?

**Knowledge Base (1):**
- Water Filter Types Explained

**Total:** 12 pages

### Wave 3 — February 18, 2026
**Reviews (5):**
- GE RPWFE
- Samsung HAF-QIN
- Amazon Basics Replacement 3-Pack
- Brita Standard 3-Pack
- Brita Elite 2-Pack

**Comparisons (3):**
- Bluevua UV vs iSpring RCC7AK
- GE XWFE vs RPWFE
- everydrop Filter 1 vs GE XWFE

**Survival Reviews (2):**
- Timain Filter Straw 2-Pack
- MSR Aquatabs 30-Pack

**Category Roundups (1):**
- Best Survival & Portable Filters

**Guides (3):**
- Water Filters for Camping
- Water Filters for Emergencies
- Water Filter Maintenance Guide

**Knowledge Base (2):**
- NSF Certifications Explained
- Best Water Filters Under $50

**Total:** 16 pages

### Wave 4 — February 22, 2026
**Reviews (4):**
- everydrop Filter A
- AQUACREST UKF8001 6-Pack
- Brita Standard 4-Pack
- Membrane Solutions Filter Straw 4-Pack

**Comparisons (3):**
- Samsung vs everydrop Filter A
- Brita Standard vs Elite
- Brita Elite vs ZeroWater

**Guides (4):**
- Water Filters for Hiking
- Water Filters for Well Water
- Water Filters for Off-Grid Living
- Water Filter Sizing Guide

**Knowledge Base (3):**
- RO vs Carbon Filters
- Understanding TDS
- PFAS in Drinking Water

**Total:** 14 pages

### Wave 5 — February 27, 2026
**Reviews (5):**
- ZeroWater 5-Stage 4-Pack
- PUR Pitcher Filter 4-Pack
- ZeroWater 5-Stage 6-Pack
- Waterdrop WD-PF-01A Plus 3-Pack
- NatureNova Filter Straw 3-Pack

**Comparisons (3):**
- Brita Standard vs PUR
- ZeroWater vs PUR
- Waterdrop Plus vs Brita Elite

**Whole House Reviews (2):**
- Membrane Solutions Sediment 6-Pack
- Universal 5-Micron Sediment

**Category Roundups (1):**
- Best Whole House & Sediment Filters

**Guides (3):**
- Water Filters for Apartments
- Water Filters for RV
- Common Water Filter Mistakes

**Knowledge Base (2):**
- Water Filter Cost Analysis
- Lead in Drinking Water

**Total:** 16 pages

### Wave 6 — March 4, 2026
**Reviews (1):**
- Elkay 51300C WaterSentry Plus

**Comparisons (3):**
- Amazon Basics vs Brita Standard
- Timain vs Membrane Solutions
- Timain vs NatureNova

**Guides (3):**
- Water Filters for Baby
- Water Filters for Travel
- Water Filters for Hard Water

**Knowledge Base (1):**
- Is Tap Water Safe?

**Total:** 8 pages

### Wave 7 — March 11, 2026
**Knowledge Base (1):**
- History of Water Filtration

**Total:** 1 page (site complete)

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
