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

# Entity linking — Wikidata URL for the niche topic (AI search hardening)
# Find yours at https://www.wikidata.org
wikidata_entity: "https://www.wikidata.org/entity/Q842467"

# Email capture — leave empty to hide, set Buttondown username to activate
email_username: ""
email_heading: "Get Filter Picks Delivered"
email_subheading: "One email per week. Honest reviews, no spam."

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

**Built-in features (automatic on every site):**
- **Email capture** — Buttondown form on homepage, resource hub, buyer guides, activity guides (self-hides until username configured)
- **AI search hardening** — per-page dates, entity linking (Wikidata + Amazon), enriched llms.txt, visible "Last updated" dates
- **No SearchAction** in WebSite schema (static sites have no search)

## What's Already Included (Don't Edit)

| File/Dir | Purpose |
|----------|---------|
| `src/components/*.astro` | 10 UI components (including ProductImage with 3-mode rendering, EmailCapture with Buttondown) |
| `src/layouts/*.astro` | 2 page layouts (ContentLayout supports visible `lastUpdated` dates) |
| `src/index.css` | Full design system with animations |
| `src/lib/schema.ts` | Schema.org generators |
| `src/lib/schema.test.ts` | Tests |
| `src/pages/404.astro` | Generic 404 |
| Config files | package.json, tailwind, tsconfig, etc. |
| `scripts/convert-to-webp.mjs` | Image conversion to responsive WebP variants |
| `scripts/image-gen-server.mjs` | AI image generation admin (Gemini API) |
| `scripts/generate-local-images.mjs` | Local SVG-to-WebP fallback generator |
| `public/` | Favicons, robots.txt |
| `.github/workflows/ci.yml` | CI pipeline |

## What Claude Generates

| File/Dir | Purpose |
|----------|---------|
| `src/lib/config.ts` | Full product catalog config |
| `src/lib/image-map.ts` | Static image path map (slug → `/assets/` path) |
| `src/pages/index.astro` | Authority hub homepage |
| `src/pages/reviews/*.astro` | Product review pages |
| `src/pages/best-*.astro` | Category roundup pages |
| `src/pages/*-vs-*.astro` | Comparison pages |
| `src/pages/guides/*.astro` | Buyer guides |
| `src/pages/*-for-*.astro` | Activity guides |
| `src/pages/*.astro` | Knowledge base pages |
| `public/robots.txt` | With your domain |
| `src/pages/llms.txt.ts` | Dynamic AI-discoverable content index with per-page descriptions (Astro API route) |
| research/*.md | Research findings |
| `IMAGE-GUIDE.md` | Complete image system documentation |

**Automatic per-page features Claude adds to every content page:**
- `lastUpdated` prop on ContentLayout (renders visible date)
- Per-page `datePublished`/`dateModified` in Article schema
- Entity linking (`about`/`mentions`) in Article schema
- EmailCapture component on guide pages and homepage

## After the Build

### Deploy to Vercel
1. Push to GitHub
2. Connect repo to Vercel
3. Vercel auto-detects Astro and deploys

### Step 1: Add Real Product Photos (Do This First)
Product photos must be manually downloaded from Amazon before AI images can be generated.
1. For each product in `product-brief.yaml`, download the main product image from Amazon
2. Rename using the naming convention: `[product-slug]-hero.webp`
3. Place in `public/assets/` (flat directory)
4. Run `node scripts/convert-to-webp.mjs` to create responsive variants (small/medium/full)
5. Push to GitHub
6. The `ProductImage` component automatically applies a radial CSS mask to blend away the white Amazon background — no manual editing needed

### Step 2: Generate AI Editorial Images
After product photos are in place, generate the scene/lifestyle images for all other pages.
1. Copy `.env.example` to `.env` and add your `GEMINI_API_KEY`
2. Run `npm run images` for the admin UI, or `npm run images -- --auto`
3. All 101 prompts are pre-configured in `scripts/image-gen-server.mjs`
4. This generates editorial images for: category roundups, comparisons, guides, knowledge base, about page, homepage categories, and featured picks

### Step 3: Register Images in the Map
1. Add slug-to-path entries in `src/lib/image-map.ts`
2. Product photos go in `productSlugs` set (compact showcase with white-bg mask)
3. Scene/editorial photos stay out of `productSlugs` (full-width cover mode)

### Connect Domain
- Point your domain to Vercel
- Update `siteUrl` in `src/lib/config.ts`
- Update `site` in `astro.config.mjs`

## Image System Architecture

The site uses a 3-tier image system:

1. **`ProductImage` component** — renders images in editorial, product showcase, or SVG placeholder mode based on whether an image exists and its type
2. **`image-map.ts`** — static TypeScript map connecting slugs to `/assets/` paths (no filesystem access at build time, works on all platforms including Vercel)
3. **`public/assets/`** — flat directory of WebP images with responsive variants (small/medium/full)

See `IMAGE-GUIDE.md` for the complete inventory, naming conventions, and how to add/replace images.

## Cache Headers

Configured in `vercel.json`:
- **HTML pages**: `max-age=0, must-revalidate` (always fresh)
- **Asset images** (`/assets/*`): `max-age=86400` (24hr, revalidatable — allows image updates)
- **Astro bundles** (`/_astro/*`): `max-age=31536000, immutable` (1yr, hash-based filenames)
- **Sitemaps/robots**: `max-age=86400` (24hr)

**Note:** Asset images intentionally use 24-hour caching instead of immutable. This allows
updated images to propagate within a day. Astro's CSS/JS bundles use immutable caching
because their filenames include content hashes that change on every rebuild.

## Email Capture

The site includes a Buttondown email capture component (`EmailCapture.astro`) that renders on
the homepage, resource hub, buyer guides, and activity guides.

**How it works:**
- The component reads `siteConfig.email.username` from config
- If username is empty (default), the component renders nothing — safe to include on any page
- When the owner sets up Buttondown and fills in the username, it activates automatically
- Each placement uses a different `tag` prop for subscriber segmentation

**To activate after launch:**
1. Create a free account at https://buttondown.com
2. Set `email_username` in `product-brief.yaml` to your Buttondown username
3. Rebuild and deploy

**CSP note:** The `vercel.json` CSP `form-action` directive includes `https://buttondown.com`
to allow the cross-origin form POST.

## AI Search Hardening

Every site built from this template includes AI search optimization out of the box:

| Feature | What it does | Where |
|---------|-------------|-------|
| Per-page dates | `datePublished`/`dateModified` in Article schema from `publishDate` | All content pages |
| Visible dates | "Last updated: [date]" rendered between breadcrumbs and content | All content pages |
| Entity linking | `about`/`mentions` with Wikidata and Amazon `sameAs` URLs | All Article schemas |
| Enriched llms.txt | Per-page descriptions (verdicts, category descriptions, guide descriptions) | `/llms.txt` API route |
| No SearchAction | WebSite schema is clean — no dead search markup | Site-level schema |

**Wikidata entity:** Set `wikidata_entity` in `product-brief.yaml` to the Wikidata URL for your
niche topic. This is used in the `about` property of Article schemas on guide, roundup, and
knowledge base pages.

## Key Differences from Single-Product Template

- **No bias** — all products reviewed honestly, no "our product" favoritism
- **Neutral comparisons** — products each win categories based on real strengths
- **Authority tone** — "we tested" and "we recommend" not "buy now"
- **Softer CTAs** — "Check Price" not "Buy on Amazon"
- **No floating CTA** — trust is built through content, not pressure
- **Homepage = hub** — categories and featured picks, not a sales page
- **Image map system** — static TypeScript map for platform-agnostic image resolution
