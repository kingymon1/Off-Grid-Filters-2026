# IMAGE-GUIDE.md — Image System for OffGrid Filters

> This guide documents the image system powering the site: how images are stored, mapped,
> served, and how to add or replace them.

---

## Quick Start: New Product Images

After saving new product images (JPG/PNG/JPEG) to `public/assets/images/`:

```bash
# 1. Convert to WebP + generate responsive variants (auto-scans images/ folder)
node scripts/convert-to-webp.mjs

# 2. Check which products now have images vs still missing
npm run product-links

# 3. Rebuild the site to pick up new images
npm run build

# 4. Commit
git add public/assets/ research/product-links.md
git commit -m "Add product images for [describe which products]"
```

**What each step does:**
1. Removes white backgrounds, converts to WebP, creates 3 responsive variants (`-small`, `-medium`, full) in `public/assets/`
2. Regenerates `research/product-links.md` with `Y`/`-` status markers per product
3. Verifies the build passes — product pages should show real photos instead of SVG placeholders
4. Stages the new WebP files and updated product-links sheet

**Naming requirement:** Source files must match the slug pattern: `[product-slug]-hero.jpeg`
(e.g., `sawyer-squeeze-water-filtration-system-hero.jpeg`). See `research/product-links.md`
for the exact filename each product expects.

---

## Current Status

29 of 58 products have real Amazon photos. 29 survival/portable filter products still use
AI-generated placeholders. All editorial images (roundups, comparisons, guides) are populated.

---

## Architecture Overview

### Image Storage
All images live in: **`public/assets/`** (flat directory, no subdirectories needed)

Each image has 3 responsive variants:
- `[name].webp` — full size (1200px wide)
- `[name]-medium.webp` — medium (800px wide)
- `[name]-small.webp` — small (400px wide)

### Image Map (`src/lib/image-map.ts`)
A static TypeScript map connects page slugs to image paths. The `ProductImage` component
reads from this map at build time — no filesystem access needed.

Two exports:
- **`productSlugs`** — `Set` of 29 product slugs (render in compact showcase mode)
- **`heroImages`** — `Record<string, string>` mapping slugs to `/assets/` paths

### ProductImage Component (`src/components/ProductImage.astro`)
Renders images in one of three modes:
1. **Editorial** — full-width, `object-fit: cover` (for scene/lifestyle photos)
2. **Product showcase** — compact centered, radial mask to blend away white backgrounds
3. **SVG placeholder** — fallback if no image is found (icon + label)

The mode is determined automatically:
- Has image + slug in `productSlugs` → **product showcase**
- Has image + slug NOT in `productSlugs` → **editorial**
- No image found → **SVG placeholder**

### Cache Headers (`vercel.json`)
- `/assets/*` images: `max-age=86400` (24 hours) with `stale-while-revalidate`
- `/_astro/*` bundles: `max-age=31536000, immutable` (1 year, hash-based filenames)

**Important:** Asset images use 24-hour caching (not immutable) because image files can
be replaced with updated versions at the same URL. Astro CSS/JS bundles use immutable
caching because their filenames contain content hashes.

---

## Image Generation

### AI Editorial Images (Gemini API)
Generated via `scripts/image-gen-server.mjs` with 101 prompts covering all pages.

```bash
# Start the admin UI
npm run images

# Or auto-generate all missing images
npm run images -- --auto
```

Requires `GEMINI_API_KEY` in `.env`. Uses `gemini-2.5-flash-image` model.

### Product Photos (Must Be Done First)
Before AI editorial images can be generated, the 29 real product photos must be
manually downloaded from Amazon and uploaded to the repo. This is a prerequisite
because the AI image generation only covers editorial/scene images — not product cutouts.

**Steps:**
1. For each product in `product-brief.yaml`, go to its Amazon listing
2. Download the main product image (the white-background cutout photo)
3. Rename it following the naming convention: `[product-slug]-hero.webp`
   (e.g., `bluevua-ro100ropot-uv-hero.webp`, `ispring-rcc7ak-hero.webp`)
4. Place all images in `public/assets/`
5. Run `node scripts/convert-to-webp.mjs` to generate responsive variants
6. Upload/push to GitHub

These product photos render in **product showcase mode** — the `ProductImage` component
applies a radial CSS mask that blends away the white background so the product floats
naturally on the dark site theme. No manual background removal is needed.

### Responsive Variants
Use `scripts/convert-to-webp.mjs` to create responsive variants from source images:
```bash
node scripts/convert-to-webp.mjs
```

Or generate variants manually with Sharp:
```javascript
import sharp from 'sharp';
await sharp(src).resize(1200, 675, { fit: 'cover' }).webp({ quality: 82 }).toFile('full.webp');
await sharp(src).resize(800, 450, { fit: 'cover' }).webp({ quality: 78 }).toFile('medium.webp');
await sharp(src).resize(400, 225, { fit: 'cover' }).webp({ quality: 72 }).toFile('small.webp');
```

---

## File Naming Convention

```
[slug]-[context].webp
[slug]-[context]-medium.webp
[slug]-[context]-small.webp
```

| Context | Usage | Example |
|---------|-------|---------|
| `hero` | Page hero image (reviews, roundups, guides, comparisons) | `ispring-rcc7ak-hero.webp` |
| `featured` | Homepage featured picks section | `bluevua-ro100ropot-uv-featured.webp` |
| (none) | Category browser images | `category-countertop-filters.webp` |

---

## Recommended Dimensions per Aspect Ratio

| Aspect | CSS Class | Width | Height | Usage |
|--------|-----------|-------|--------|-------|
| `hero` | `aspect-[16/9]` | 1200px | 675px | Page hero images, comparison cards |
| `wide` | `aspect-[3/2]` | 900px | 600px | Product cards, mini-reviews |
| `square` | `aspect-square` | 600px | 600px | Category browser, featured picks |
| `tall` | `aspect-[2/3]` | 600px | 900px | Product detail, portrait |

---

## Complete Image Inventory (121 images)

### Homepage (`src/pages/index.astro`) — 15 images

**Hero Section:**
| Image | Mode | Filename |
|---|---|---|
| Bluevua RO100ROPOT-UV product photo | Product showcase (radial mask) | `bluevua-ro100ropot-uv-hero.webp` |

**Featured Picks (4):**
| Image | Mode | Filename |
|---|---|---|
| Bluevua RO100ROPOT-UV | Product showcase | `bluevua-ro100ropot-uv-featured.webp` |
| Amazon Basics Pitcher | Product showcase | `amazon-basics-10-cup-pitcher-featured.webp` |
| iSpring RCC7AK | Product showcase | `ispring-rcc7ak-featured.webp` |
| Timain Filter Straw | Product showcase | `timain-filter-straw-featured.webp` |

**Category Browser (6):**
| Image | Mode | Filename |
|---|---|---|
| Countertop & Pitcher Filters | Editorial (full-width cover) | `category-countertop-filters.webp` |
| Under-Sink Filters | Editorial | `category-under-sink-filters.webp` |
| Refrigerator Filters | Editorial | `category-refrigerator-filters.webp` |
| Replacement Filters | Editorial | `category-replacement-filters.webp` |
| Survival Filters | Editorial | `category-survival-filters.webp` |
| Whole House Filters | Editorial | `category-whole-house-filters.webp` |

**Comparison Cards (4):**
Uses the same hero images as the comparison pages (editorial mode, `aspect="hero"` 16:9).

### Product Reviews (`src/pages/reviews/*.astro`) — 29 images

Each review has 1 hero image rendered in product showcase mode.

| Product | Filename |
|---|---|
| Bluevua RO100ROPOT-UV | `bluevua-ro100ropot-uv-hero.webp` |
| Bluevua RO100ROPOT-Lite UV | `bluevua-ro100ropot-lite-uv-hero.webp` |
| Amazon Basics 10-Cup Pitcher | `amazon-basics-10-cup-pitcher-hero.webp` |
| Brita UltraMax 27-Cup Dispenser | `brita-ultramax-27-cup-dispenser-hero.webp` |
| Pentair Everpure H-1200 | `pentair-everpure-h1200-hero.webp` |
| Pentair Everpure H-300 | `pentair-everpure-h300-hero.webp` |
| iSpring RCC7AK | `ispring-rcc7ak-hero.webp` |
| Waterdrop G3P600 | `waterdrop-g3p600-hero.webp` |
| everydrop Filter 1 | `everydrop-filter-1-edr1rxd1-hero.webp` |
| GE XWFE | `ge-xwfe-hero.webp` |
| GE RPWFE | `ge-rpwfe-hero.webp` |
| Samsung HAF-QIN | `samsung-haf-qin-hero.webp` |
| everydrop Filter A | `everydrop-filter-a-edrarxd1-hero.webp` |
| AQUACREST UKF8001 3-Pack | `aquacrest-ukf8001-3pack-hero.webp` |
| Amazon Basics Enhanced 3-Pack | `amazon-basics-replacement-3pack-hero.webp` |
| Brita Standard 3-Pack | `brita-standard-3pack-hero.webp` |
| Brita Standard 4-Pack | `brita-standard-4pack-hero.webp` |
| Brita Elite 2-Pack | `brita-elite-2pack-hero.webp` |
| ZeroWater 5-Stage 4-Pack | `zerowater-5stage-4pack-hero.webp` |
| ZeroWater 5-Stage 6-Pack | `zerowater-5stage-6pack-hero.webp` |
| PUR Pitcher Filter 4-Pack | `pur-pitcher-filter-4pack-hero.webp` |
| Waterdrop WD-PF-01A Plus 3-Pack | `waterdrop-wd-pf01a-plus-3pack-hero.webp` |
| Timain Filter Straw 2-Pack | `timain-filter-straw-2pack-hero.webp` |
| Membrane Solutions 4-Pack | `membrane-solutions-filter-straw-4pack-hero.webp` |
| NatureNova Filter Straw 3-Pack | `naturenova-filter-straw-3pack-hero.webp` |
| MSR Aquatabs 30-Pack | `msr-aquatabs-30pack-hero.webp` |
| Membrane Solutions Sediment 6-Pack | `membrane-solutions-sediment-6pack-hero.webp` |
| Universal 5-Micron Sediment | `universal-5micron-sediment-filter-hero.webp` |
| Elkay 51300C WaterSentry Plus | `elkay-51300c-watersentry-plus-hero.webp` |

### Category Roundups (`src/pages/best-*.astro`) — 6 images

Each roundup has 1 editorial hero image.

| Page | Filename |
|---|---|
| Best Countertop & Pitcher Filters | `best-countertop-filters-hero.webp` |
| Best Under-Sink Filters | `best-under-sink-filters-hero.webp` |
| Best Refrigerator Filters | `best-refrigerator-filters-hero.webp` |
| Best Replacement Filters | `best-replacement-filters-hero.webp` |
| Best Survival Filters | `best-survival-filters-hero.webp` |
| Best Whole House Filters | `best-whole-house-filters-hero.webp` |

### Comparisons (`src/pages/*-vs-*.astro`) — 15 images

Each comparison has 1 editorial hero image showing both products.

| Page | Filename |
|---|---|
| Bluevua UV vs Lite UV | `bluevua-ro100ropot-uv-vs-bluevua-ro100ropot-lite-uv-hero.webp` |
| Bluevua UV vs iSpring | `bluevua-ro100ropot-uv-vs-ispring-rcc7ak-hero.webp` |
| iSpring vs Waterdrop | `ispring-rcc7ak-vs-waterdrop-g3p600-hero.webp` |
| Brita Standard vs Elite | `brita-standard-vs-brita-elite-hero.webp` |
| Brita Standard vs PUR | `brita-standard-vs-pur-hero.webp` |
| Brita Elite vs ZeroWater | `brita-elite-vs-zerowater-hero.webp` |
| ZeroWater vs PUR | `zerowater-vs-pur-hero.webp` |
| Waterdrop Plus vs Brita Elite | `waterdrop-plus-vs-brita-elite-hero.webp` |
| Amazon Basics vs Brita Standard | `amazon-basics-vs-brita-standard-hero.webp` |
| everydrop 1 vs GE XWFE | `everydrop-filter-1-vs-ge-xwfe-hero.webp` |
| GE XWFE vs GE RPWFE | `ge-xwfe-vs-ge-rpwfe-hero.webp` |
| Samsung vs everydrop A | `samsung-haf-qin-vs-everydrop-filter-a-hero.webp` |
| Pentair H-1200 vs H-300 | `pentair-everpure-h1200-vs-pentair-everpure-h300-hero.webp` |
| Timain vs Membrane Solutions | `timain-vs-membrane-solutions-straw-hero.webp` |
| Timain vs NatureNova | `timain-vs-naturenova-straw-hero.webp` |

### Buyer Guides (`src/pages/guides/*.astro`) — 8 images

| Page | Filename |
|---|---|
| How to Choose a Water Filter | `how-to-choose-water-filter-hero.webp` |
| Water Filter Maintenance | `water-filter-maintenance-hero.webp` |
| Water Filter Sizing Guide | `water-filter-sizing-guide-hero.webp` |
| Best Water Filters Under $50 | `best-water-filters-under-50-hero.webp` |
| RO vs Carbon Filters | `reverse-osmosis-vs-carbon-filters-hero.webp` |
| Beginner Guide to Water Filtration | `water-filtration-beginner-guide-hero.webp` |
| Water Filter Mistakes | `water-filter-mistakes-hero.webp` |
| Water Filter Cost Analysis | `water-filter-cost-analysis-hero.webp` |

### Activity Guides (`src/pages/water-filters-for-*.astro`) — 10 images

| Page | Filename |
|---|---|
| Water Filters for Camping | `water-filters-for-camping-hero.webp` |
| Water Filters for Hiking | `water-filters-for-hiking-hero.webp` |
| Water Filters for Emergencies | `water-filters-for-emergencies-hero.webp` |
| Water Filters for Well Water | `water-filters-for-well-water-hero.webp` |
| Water Filters for Apartments | `water-filters-for-apartments-hero.webp` |
| Water Filters for RV | `water-filters-for-rv-hero.webp` |
| Water Filters for Baby | `water-filters-for-baby-hero.webp` |
| Water Filters for Travel | `water-filters-for-travel-hero.webp` |
| Water Filters for Off-Grid | `water-filters-for-off-grid-hero.webp` |
| Water Filters for Hard Water | `water-filters-for-hard-water-hero.webp` |

### Knowledge Base (`src/pages/*.astro`) — 8 images

| Page | Filename |
|---|---|
| What Is Reverse Osmosis? | `what-is-reverse-osmosis-hero.webp` |
| NSF Certifications Explained | `nsf-certifications-explained-hero.webp` |
| Understanding TDS | `understanding-tds-hero.webp` |
| PFAS in Drinking Water | `pfas-in-drinking-water-hero.webp` |
| Lead in Drinking Water | `lead-in-drinking-water-hero.webp` |
| Water Filter Types Explained | `water-filter-types-explained-hero.webp` |
| Is Tap Water Safe? | `is-tap-water-safe-hero.webp` |
| History of Water Filtration | `history-of-water-filtration-hero.webp` |

### About Page — 1 image

| Page | Filename |
|---|---|
| About OffGrid Filters | `about-hero.webp` |

---

## Adding or Replacing Images

### To replace an existing image:

1. Place the new source image in `public/assets/`
2. Generate responsive variants:
   ```bash
   node -e "
   import('sharp').then(async (m) => {
     const sharp = m.default;
     await sharp('public/assets/SOURCE.webp')
       .resize(1200, 675, { fit: 'cover' }).webp({ quality: 82 })
       .toFile('public/assets/SLUG-hero.webp');
     await sharp('public/assets/SOURCE.webp')
       .resize(800, 450, { fit: 'cover' }).webp({ quality: 78 })
       .toFile('public/assets/SLUG-hero-medium.webp');
     await sharp('public/assets/SOURCE.webp')
       .resize(400, 225, { fit: 'cover' }).webp({ quality: 72 })
       .toFile('public/assets/SLUG-hero-small.webp');
   });
   "
   ```
3. No code changes needed — the image-map already points to the right path

### To add a new page with an image:

1. Create the image variants (as above)
2. Add the slug to `heroImages` in `src/lib/image-map.ts`
3. If it's a product photo (not a scene), also add the slug to `productSlugs`

---

## Photography Guidelines

### Style
- Clean, well-lit product photography or AI-generated editorial scenes
- Natural lighting preferred (kitchen/outdoor settings)
- Dark neutral backgrounds for product showcase mode
- Products should be the clear focal point

### Technical Requirements
- Output format: WebP
- Responsive variants: small (400w), medium (800w), full (1200w)
- Target file sizes: 20-150KB depending on complexity
- Color profile: sRGB

### Content Guidelines
- No visible brand names or logos in editorial images
- No faces of identifiable people
- No text overlays on photos (text goes in HTML)
- Products should look authentic, not overly staged

---

## Image Count Summary

| Page Type | Pages | Images | Total |
|---|---|---|---|
| Homepage | 1 | 15 | 15 |
| Product Reviews | 29 | 1 | 29 |
| Category Roundups | 6 | 1 | 6 |
| Comparisons | 15 | 1 | 15 |
| Buyer Guides | 8 | 1 | 8 |
| Activity Guides | 10 | 1 | 10 |
| Knowledge Base | 8 | 1 | 8 |
| About Page | 1 | 1 | 1 |
| **Total** | **78** | | **~92 unique images (121 with category/featured variants)** |
