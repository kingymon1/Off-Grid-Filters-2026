# IMAGE-GUIDE.md — Photo Replacement Guide for OffGrid Filters

> Every `<ProductImage>` placeholder on the site needs to be replaced with a real photograph.
> This guide documents every placeholder, what photo should replace it, and the recommended specs.

---

## File Naming Convention

```
[product-slug]-[context].webp
```

Examples:
- `bluevua-ro100ropot-uv-hero.webp`
- `bluevua-ro100ropot-uv-detail.webp`
- `best-countertop-filters-hero.webp`

## Image Directory

All images go in: `public/assets/images/`

Use the `scripts/convert-to-webp.mjs` script to convert source JPG/PNG files to WebP with responsive variants:
```bash
node scripts/convert-to-webp.mjs
```

## Recommended Dimensions per Aspect Ratio

| Aspect | CSS Class | Width | Height | Usage |
|--------|-----------|-------|--------|-------|
| `hero` | `aspect-[16/9]` | 1200px | 675px | Page hero images |
| `wide` | `aspect-[3/2]` | 900px | 600px | Product cards, mini-reviews |
| `square` | `aspect-square` | 600px | 600px | Category icons, featured picks |
| `tall` | `aspect-[2/3]` | 600px | 900px | Product detail, portrait |

---

## Homepage (`src/pages/index.astro`)

### Featured Picks Section
| Placeholder | Recommended Photo | Aspect | Filename |
|---|---|---|---|
| Bluevua RO100ROPOT-UV | Product on countertop, glass carafe visible | square | `bluevua-ro100ropot-uv-featured.webp` |
| Amazon Basics Pitcher | Pitcher on kitchen counter, front angle | square | `amazon-basics-10-cup-pitcher-featured.webp` |
| iSpring RCC7AK | System installed under sink, faucet visible | square | `ispring-rcc7ak-featured.webp` |
| Timain Filter Straw | Straw in use at stream, outdoor setting | square | `timain-filter-straw-featured.webp` |

### Category Browser Section
| Placeholder | Recommended Photo | Aspect | Filename |
|---|---|---|---|
| Countertop & Pitcher | Collection of pitchers on kitchen counter | square | `category-countertop-filters.webp` |
| Under-Sink Filters | RO system under sink cabinet | square | `category-under-sink-filters.webp` |
| Refrigerator Filters | Fridge filter being installed | square | `category-refrigerator-filters.webp` |
| Replacement Filters | Array of different filter cartridges | square | `category-replacement-filters.webp` |
| Survival Filters | Filter straws laid out on map/pack | square | `category-survival-filters.webp` |
| Whole House Filters | Sediment filter housing mounted on pipe | square | `category-whole-house-filters.webp` |

### Latest Reviews Section
| Placeholder | Recommended Photo | Aspect | Filename |
|---|---|---|---|
| 6 product cards | Product lifestyle photos | wide | `[slug]-card.webp` |

---

## Product Review Pages (`src/pages/reviews/*.astro`)

Each review page has 1 hero image.

| Product | Hero Photo Recommendation | Filename |
|---|---|---|
| Bluevua RO100ROPOT-UV | Product on countertop, glass carafe filled with water | `bluevua-ro100ropot-uv-hero.webp` |
| Bluevua RO100ROPOT-Lite UV | Side-by-side with glass carafe, LED display lit | `bluevua-ro100ropot-lite-uv-hero.webp` |
| Amazon Basics 10-Cup Pitcher | Pitcher pouring water into glass, kitchen setting | `amazon-basics-10-cup-pitcher-hero.webp` |
| Brita UltraMax 27-Cup | Dispenser on counter with spigot in use | `brita-ultramax-27-cup-dispenser-hero.webp` |
| Pentair Everpure H-1200 | Twin cartridges, professional kitchen setting | `pentair-everpure-h1200-hero.webp` |
| Pentair Everpure H-300 | Complete system unboxed with all components | `pentair-everpure-h300-hero.webp` |
| iSpring RCC7AK | System installed under sink, all 6 stages visible | `ispring-rcc7ak-hero.webp` |
| Waterdrop G3P600 | Tankless unit under sink, smart faucet on counter | `waterdrop-g3p600-hero.webp` |
| everydrop Filter 1 | Filter with Whirlpool fridge in background | `everydrop-filter-1-edr1rxd1-hero.webp` |
| GE XWFE | Filter next to GE refrigerator, close-up | `ge-xwfe-hero.webp` |
| GE RPWFE | Filter being installed into GE French door fridge | `ge-rpwfe-hero.webp` |
| Samsung HAF-QIN | Filter with Samsung fridge, quarter-turn detail | `samsung-haf-qin-hero.webp` |
| everydrop Filter A | Filter with rotating knob mechanism visible | `everydrop-filter-a-edrarxd1-hero.webp` |
| AQUACREST UKF8001 6-Pack | All 6 filters arranged in a row | `aquacrest-ukf8001-6pack-hero.webp` |
| Amazon Basics Enhanced 3-Pack | 3-pack with one filter removed from packaging | `amazon-basics-replacement-3pack-hero.webp` |
| Brita Standard 3-Pack | Filters with Brita pitcher in background | `brita-standard-3pack-hero.webp` |
| Brita Standard 4-Pack | 4-pack arranged on counter | `brita-standard-4pack-hero.webp` |
| Brita Elite 2-Pack | Elite filters with pitcher, emphasize "Elite" branding | `brita-elite-2pack-hero.webp` |
| ZeroWater 5-Stage 4-Pack | Filters with TDS meter showing 000 | `zerowater-5stage-4pack-hero.webp` |
| ZeroWater 5-Stage 6-Pack | 6-pack with ZeroWater pitcher | `zerowater-5stage-6pack-hero.webp` |
| PUR Pitcher Filter 4-Pack | Filters showing LockFit mechanism | `pur-pitcher-filter-4pack-hero.webp` |
| Waterdrop WD-PF-01A Plus 3-Pack | Filters with Waterdrop pitcher, ACF label visible | `waterdrop-wd-pf01a-plus-3pack-hero.webp` |
| Timain Filter Straw 2-Pack | Both straws on outdoor/camping surface | `timain-filter-straw-2pack-hero.webp` |
| Membrane Solutions 4-Pack | 4 straws fanned out, one attached to bottle | `membrane-solutions-filter-straw-4pack-hero.webp` |
| NatureNova Filter Straw 3-Pack | Kit with straw, water bag, and syringe laid out | `naturenova-filter-straw-3pack-hero.webp` |
| MSR Aquatabs 30-Pack | Tablets on surface near water bottle, outdoor setting | `msr-aquatabs-30pack-hero.webp` |
| Membrane Solutions Sediment 6-Pack | 6 filters standing upright, white string wound visible | `membrane-solutions-sediment-6pack-hero.webp` |
| Universal 5-Micron Sediment | Single cartridge next to filter housing | `universal-5micron-sediment-filter-hero.webp` |
| Elkay 51300C WaterSentry Plus | Filter next to Elkay bottle filling station | `elkay-51300c-watersentry-plus-hero.webp` |

---

## Category Roundup Pages (`src/pages/best-*.astro`)

Each roundup has 1 hero image + 1 image per product in the mini-review section.

| Page | Hero Photo | Filename |
|---|---|---|
| Best Countertop Filters | Array of pitchers and Bluevua on counter | `best-countertop-filters-hero.webp` |
| Best Under-Sink Filters | Multiple RO systems under kitchen cabinet | `best-under-sink-filters-hero.webp` |
| Best Refrigerator Filters | Assorted fridge filters on counter | `best-refrigerator-filters-hero.webp` |
| Best Replacement Filters | Collection of all pitcher filter types | `best-replacement-filters-hero.webp` |
| Best Survival Filters | Survival filters + tablets in outdoor setting | `best-survival-filters-hero.webp` |
| Best Whole House Filters | Sediment filters with pipe housing | `best-whole-house-filters-hero.webp` |

---

## Comparison Pages (`src/pages/*-vs-*.astro`)

Each comparison has 1 hero image showing both products.

| Page | Hero Photo | Filename |
|---|---|---|
| 15 comparison pages | Side-by-side product shot, both visible | `[slug]-hero.webp` |

---

## Guide Pages

### Buyer Guides (`src/pages/guides/*.astro`)
| Page | Hero Photo | Filename |
|---|---|---|
| How to Choose | Person examining water filter options | `how-to-choose-water-filter-hero.webp` |
| Maintenance | Hand changing a filter cartridge | `water-filter-maintenance-hero.webp` |
| Sizing Guide | Family in kitchen with various filter sizes | `water-filter-sizing-guide-hero.webp` |
| Under $50 | Budget filters arranged by price | `best-water-filters-under-50-hero.webp` |
| RO vs Carbon | Split image: RO system and carbon pitcher | `reverse-osmosis-vs-carbon-filters-hero.webp` |
| Beginner Guide | Clean glass of water, simple setting | `water-filtration-beginner-guide-hero.webp` |
| Mistakes | Person looking confused at filter options | `water-filter-mistakes-hero.webp` |
| Cost Analysis | Calculator/spreadsheet with filter costs | `water-filter-cost-analysis-hero.webp` |

### Activity Guides (`src/pages/water-filters-for-*.astro`)
| Page | Hero Photo | Filename |
|---|---|---|
| Camping | Filter straw in use at campsite | `water-filters-for-camping-hero.webp` |
| Hiking | Hiker using filter straw at mountain stream | `water-filters-for-hiking-hero.webp` |
| Emergencies | Emergency kit with water filtration supplies | `water-filters-for-emergencies-hero.webp` |
| Well Water | Well pump with whole-house filter system | `water-filters-for-well-water-hero.webp` |
| Apartments | Pitcher on apartment kitchen counter | `water-filters-for-apartments-hero.webp` |
| RV | RV with inline water filter at hookup | `water-filters-for-rv-hero.webp` |
| Baby | Parent preparing formula with filtered water | `water-filters-for-baby-hero.webp` |
| Travel | Travel water bottle with filter, airport/hotel | `water-filters-for-travel-hero.webp` |
| Off-Grid | Cabin/homestead with water filtration setup | `water-filters-for-off-grid-hero.webp` |
| Hard Water | Glass with mineral deposits, TDS meter | `water-filters-for-hard-water-hero.webp` |

### Knowledge Base (`src/pages/*.astro`)
| Page | Hero Photo | Filename |
|---|---|---|
| What Is RO? | Cross-section diagram or RO membrane close-up | `what-is-reverse-osmosis-hero.webp` |
| NSF Certifications | NSF certification marks/logos | `nsf-certifications-explained-hero.webp` |
| Understanding TDS | TDS meter in water, reading display | `understanding-tds-hero.webp` |
| PFAS | Water testing/lab setting | `pfas-in-drinking-water-hero.webp` |
| Lead in Water | Old pipe/faucet, water testing | `lead-in-drinking-water-hero.webp` |
| Filter Types | Array of different filter technologies | `water-filter-types-explained-hero.webp` |
| Tap Water Safe? | Glass of water from tap, city setting | `is-tap-water-safe-hero.webp` |
| History | Vintage/historical water purification | `history-of-water-filtration-hero.webp` |

---

## Photography Guidelines

### Style
- Clean, well-lit product photography
- Natural lighting preferred (kitchen/outdoor settings)
- Neutral or lifestyle backgrounds (not studio white)
- Products should be the clear focal point
- Show products in context of use where possible

### Technical Requirements
- Source format: JPG or PNG at 2x resolution
- Output format: WebP (via convert-to-webp.mjs script)
- Responsive variants: small (400w), medium (800w), full (1200w)
- Max file size target: 100KB (hero), 60KB (card), 40KB (thumbnail)
- Color profile: sRGB

### Content Guidelines
- No visible brand names of competitors (avoid trademark issues)
- No faces of identifiable people (privacy)
- No text overlays on photos (text goes in HTML)
- Clean, uncluttered compositions
- Products should look authentic, not overly staged

---

## Total Placeholder Count

| Page Type | Pages | Placeholders/Page | Total |
|---|---|---|---|
| Homepage | 1 | ~12 | 12 |
| Product Reviews | 29 | 1 | 29 |
| Category Roundups | 6 | 1 + products | ~30 |
| Comparisons | 15 | 1 | 15 |
| Buyer Guides | 8 | 1 | 8 |
| Activity Guides | 10 | 1 | 10 |
| Knowledge Base | 8 | 1 | 8 |
| **Total** | | | **~112 images** |
