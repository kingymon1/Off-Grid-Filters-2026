# Plan: Add 29 Legacy Products with Full Reviews + Proper Redirects

## Summary
Add all 29 old-site products to the catalog with full review pages, then redirect
old URLs (`/products/[slug]` and `/reviews/[slug]`) to the new `/reviews/[slug]/` pages
using `legacyUrls` on each product — replacing the current blanket redirect to
`/best-survival-filters/`.

## ASIN Corrections (applied)
- Katadyn Pocket Water Filter: **B000F3S24E** (was incorrectly B079QH92WQ)
- Sawyer Select Series S3: **B079QH92WQ** (confirmed correct)

## Product List (29 products, all survival-filters category)

| # | Product | ASIN | Old URLs |
|---|---------|------|----------|
| 1 | LifeSaver Liberty Bottle | B078YV96R1 | /products/lifesaver-liberty-bottle |
| 2 | LifeStraw Go Series | B08X1QY6T8 | /products/lifestraw-go-series, /reviews/lifestraw-go-series |
| 3 | MSR Guardian Purifier | B0186SMF6S | /products/msr-guardian-purifier |
| 4 | Survivor Filter Pro | B00QFXGSIY | /products/survivor-filter-pro |
| 5 | HydroBlu Clear Flow Bottle | B07N4F4B15 | /products/hydroblu-clear-flow-bottle, /reviews/hydroblu-clear-flow-bottle |
| 6 | Katadyn Vario Water Filter | B000KUVVY4 | /products/katadyn-vario-water-filter |
| 7 | Platypus QuickDraw Microfilter | B08JD4TJHQ | /products/platypus-quickdraw-microfilter-system |
| 8 | MSR MiniWorks EX Microfilter | B000BBGQ5Q | /products/msr-miniworks-ex-microfilter |
| 9 | GRAYL Tap Water Filter | B0B7MLQJ6Q | /products/grayl-tap-water-filter, /reviews/grayl-tap-water-filter |
| 10 | Survivor Filter Squeeze Kit | B08P3CZ7BS | /products/survivor-filter-squeeze-kit |
| 11 | Sawyer Select Series S3 | B079QH92WQ | /products/sawyer-select-series-s3 |
| 12 | Katadyn Pocket Water Filter | B000F3S24E | /products/katadyn-pocket-water-filter |
| 13 | Katadyn Hiker Pro Transparent | B003AYEHHA | /products/katadyn-hiker-pro-transparent-filter |
| 14 | MSR AutoFlow XL Gravity Filter | B07Z8MW3JP | /products/msr-autoflow-xl-gravity-filter |
| 15 | HydroBlu Versa Flow Water Filter | B01N6X4VQP | /products/hydroblu-versa-flow-water-filter, /reviews/hydroblu-versa-flow-water-filter |
| 16 | LifeStraw Flex Advanced | B079QH5C2X | /products/lifestraw-flex-advanced-water-filter |
| 17 | Sawyer Squeeze Filtration System | B005EHPVQW | /products/sawyer-squeeze-water-filtration-system, /reviews/sawyer-squeeze-water-filtration-system |
| 18 | Sawyer Mini Water Filtration System | B00FA2RLX2 | /products/sawyer-products-mini-water-filtration-system, /reviews/sawyer-products-mini-water-filtration-system |
| 19 | HydroBlu Sidekick 2-Stage Straw | B09JKLW5YN | /products/hydroblu-sidekick-2-stage-straw-filter, /reviews/hydroblu-sidekick-2-stage-straw-filter |
| 20 | Survivor Filter Pro X Electric Pump | B08Q7KM59X | /products/survivor-filter-pro-x-electric-pump |
| 21 | GRAYL GeoPress 24oz Purifier Bottle | B07ZQSYQ4T | /products/grayl-geopress-24oz-water-purifier-bottle, /reviews/grayl-geopress-24oz-water-purifier-bottle |
| 22 | MSR TrailShot Pocket Water Filter | B01N0B9G8A | /products/msr-trailshot-pocket-sized-water-filter |
| 23 | HydroBlu Go Flow Gravity Bag | B07Y5Y9K5N | /products/hydroblu-go-flow-water-gravity-bag, /reviews/hydroblu-go-flow-water-gravity-bag |
| 24 | Katadyn BeFree 1.0L Filter Bottle | B06Y2CJ3C3 | /products/katadyn-befree-1-0l-water-filter-bottle, /reviews/katadyn-befree-1-0l-water-filter-bottle |
| 25 | MSR Thru-Link In-Line Water Filter | B089LQ4YDC | /products/msr-thru-link-in-line-water-filter |
| 26 | Survivor Filter Pro X Electric | B09ND8SV8L | /products/survivor-filter-pro-x-electric-water-filter |
| 27 | GRAYL UltraPress 16.9oz Purifier | B09B2VZL94 | /products/grayl-ultrapress-16-9oz-water-purifier-bottle |
| 28 | Platypus GravityWorks 4.0L System | B00G4V4IVQ | /products/platypus-gravityworks-4-0l-water-filter-system |
| 29 | LifeStraw Family 1.0 Gravity Purifier | B002UAO0R6 | /products/lifestraw-family-1-0-portable-gravity-powered-water-purifier, /reviews/lifestraw-family-1-0-portable-gravity-powered-water-purifier |

## Steps

### Step 1: Research all 29 products
- Fetch Amazon pages by ASIN for specs, features, ratings, review counts
- Use prices from product-brief.yaml if listed, otherwise research current prices
- Document pros, cons, verdicts, "best for" positioning for each
- Identify specs: flow rate, micron rating, weight, capacity, dimensions, filtration tech

### Step 2: Add all 29 products to config.ts
- Add each to the `products` array in the survival-filters category
- Include `legacyUrls` array on each product with old URL paths
- Set publish dates using existing PUBLISH_WAVES

### Step 3: Replace blanket redirects with per-product legacyUrls
- Remove the wildcard `/products/:path+` redirect from config.ts redirects array
- Remove the 11 individual `/reviews/` blanket redirects
- Keep section redirects: `/products` → `/guides/`, `/roundups` → `/guides/`, `/contact` → `/`
- Keep roundup wildcard: `/roundups/:path+` → `/best-survival-filters/`
- Per-product redirects now generated from `legacyUrls` via `npm run redirects`

### Step 4: Create 29 review pages
- One `.astro` file per product in `src/pages/reviews/`
- Follow existing review page structure (ProductHero, overview, specs, pros/cons, FAQ, CTA)
- Use existing review pages as structural templates
- Each page ~200-300 lines with genuine researched content

### Step 5: Update image-map.ts
- Add all 29 product slugs to the `productSlugs` Set
- Add all 29 hero image entries to `heroImages` Record
- SVG placeholders render automatically until real images are added later

### Step 6: Update best-survival-filters.astro roundup
- Expand from 4 products to 33 (4 existing + 29 new)
- Organize by filter type sub-sections (bottle, pump, squeeze/straw, gravity)

### Step 7: Update supporting files
- Resource hub: ensure all new review pages are linked
- Navigation: update dropdown if needed (survival category is more prominent now)
- llms.txt: auto-generated from config, no manual changes needed

### Step 8: Run redirects script
- `npm run redirects` generates vercel.json entries from both legacyUrls and redirects array

### Step 9: Build & verify
- `npm run build` — must pass with 0 errors
- `npm run checklist:auto` — fix any failures
- Verify old URL paths map to correct new review pages in vercel.json

### Step 10: Commit & push

## Notes
- No images needed upfront — SVG placeholders handle it (Phase 5 in CLAUDE.md)
- The survival category grows from 4 to 33 products
- Old section/roundup redirects stay as blanket rules
- Only product-specific redirects change from blanket → per-product legacyUrls
- Total page count grows from ~80 to ~109
