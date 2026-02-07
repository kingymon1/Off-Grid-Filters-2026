# Multi-Product Authority Site Template

## What This Is

A template for building Amazon affiliate authority sites that review and compare multiple products across categories. Think Wirecutter-style — you're the trusted expert, not a product brand.

All infrastructure is pre-built (components, layouts, CSS, animations, config files). Claude researches your product catalog, builds reviews, comparisons, roundups, and guides.

## Single-Product vs Multi-Product

| | Single-Product (v2) | Multi-Product (v3) |
|---|---|---|
| Products | 1 hero + 2-4 competitors | 15-25 products across categories |
| Positioning | Product brand site | Authority/expert review site |
| Homepage | Product landing page | Category hub |
| Tone | "Buy our product" | "We'll help you choose" |
| Comparisons | Our product vs competitor | Product A vs Product B (neutral) |
| Page count | 50+ pages | 70-90+ pages |

## Quick Start (3 Steps)

### Step 1: Create a new repo

Create a new repo on GitHub and upload the entire template folder contents (all files and directories).

### Step 2: Fill in product-brief.yaml

Open `product-brief.yaml` and fill in:

```yaml
site_name: "OffGrid Filters"
domain: "offgridfilters.com"
affiliate_tag: "offgrid0a-20"
niche: "water filters"
tagline: "Expert Water Filter Reviews & Guides"

categories:
  - name: "Gravity Filters"
    slug: "gravity-filters"
  - name: "Pump Filters"
    slug: "pump-filters"
  - name: "Squeeze Filters"
    slug: "squeeze-filters"

products:
  - name: "Katadyn Hiker Pro"
    brand: "Katadyn"
    asin: "B08MB2BNZR"
    price: "74.95"
    category: "pump-filters"
  - name: "Platypus GravityWorks 4.0L"
    brand: "Platypus"
    asin: "B00A9A2HKM"
    price: "109.95"
    category: "gravity-filters"
  # ... 15-25 products total

comparisons:
  - product_a: "Katadyn Hiker Pro"
    product_b: "MSR MiniWorks EX"
  # ... 8-15 comparison pairs
```

### Step 3: Tell Claude to build

Open Claude Code in the project directory and say:

> "Read CLAUDE.md and build the site based on product-brief.yaml"

Claude will:
1. Research every product in your catalog on Amazon
2. Research each category and the competitive landscape
3. Research the market, audience, and content opportunities
4. Choose colors, design, and tone for your niche
5. Plan all content: reviews, roundups, comparisons, guides
6. Generate `src/lib/config.ts` with full product catalog
7. Build 70-90+ pages of content
8. Run lint, test, and build to verify

## What Gets Built

| Page Type | Count | Example |
|-----------|-------|---------|
| Product reviews | 15-25 | "Katadyn Hiker Pro Review 2026" |
| Category roundups | 4-8 | "Best Gravity Filters 2026" |
| Head-to-head comparisons | 8-15 | "Katadyn vs Platypus: Which Is Better?" |
| Buyer guides | 6-10 | "How to Choose a Water Filter" |
| Activity guides | 8-12 | "Water Filters for Thru-Hiking" |
| Knowledge base | 6-10 | "What Does 0.2 Micron Mean?" |
| Homepage + hub + 404 | 3 | Authority hub homepage |
| **Total** | **70-90+** | |

## What's Already Included (Don't Edit)

| File/Dir | Purpose |
|----------|---------|
| `src/components/*.astro` | 9 UI components |
| `src/layouts/*.astro` | 2 page layouts |
| `src/index.css` | Full design system with animations |
| `src/lib/schema.ts` | Schema.org generators |
| `src/lib/schema.test.ts` | Tests |
| `src/pages/404.astro` | Generic 404 |
| Config files | package.json, tailwind, tsconfig, etc. |
| `scripts/convert-to-webp.mjs` | Image conversion |
| `public/` | Favicons, placeholder |
| `.github/workflows/ci.yml` | CI pipeline |

## What Claude Generates

| File/Dir | Purpose |
|----------|---------|
| `src/lib/config.ts` | Full product catalog config |
| `src/pages/index.astro` | Authority hub homepage |
| `src/pages/reviews/*.astro` | Product review pages |
| `src/pages/best-*.astro` | Category roundup pages |
| `src/pages/*-vs-*.astro` | Comparison pages |
| `src/pages/guides/*.astro` | Buyer guides |
| `src/pages/*-for-*.astro` | Activity guides |
| `src/pages/*.astro` | Knowledge base pages |
| `public/robots.txt` | With your domain |
| `public/llms.txt` | AI-discoverable content index |
| `research/*.md` | Research findings |
| `IMAGE-GUIDE.md` | Photo replacement guide |

## After the Build

### Deploy to Vercel
1. Push to GitHub
2. Connect repo to Vercel
3. Vercel auto-detects Astro and deploys

### Add Real Product Photos
1. Read `IMAGE-GUIDE.md` for what photos to add where
2. Place in `public/assets/images/`
3. Run `node scripts/convert-to-webp.mjs`

### Connect Domain
- Point your domain to Vercel
- Update `siteUrl` in `src/lib/config.ts`
- Update `site` in `astro.config.mjs`

## Key Differences from Single-Product Template

- **No bias** — all products reviewed honestly, no "our product" favoritism
- **Neutral comparisons** — products each win categories based on real strengths
- **Authority tone** — "we tested" and "we recommend" not "buy now"
- **Softer CTAs** — "Check Price" not "Buy on Amazon"
- **No floating CTA** — trust is built through content, not pressure
- **Homepage = hub** — categories and featured picks, not a sales page
