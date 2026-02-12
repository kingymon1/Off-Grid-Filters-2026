# Nano Banana Pro — Image Prompt Sheet for OffGrid Filters

> **How to use:** For each prompt below, upload the listed reference image(s) to Nano Banana Pro
> (select "🍌Create images" → "Thinking" model), then paste the prompt.
>
> **Output specs:** Save all images as PNG/JPG, then run `node scripts/convert-to-webp.mjs`
> to generate responsive WebP variants (small 400w, medium 800w, full 1200w).
>
> **Site aesthetic:** Dark, clean, modern. Deep blue-black backgrounds (#0b0f14).
> Primary accent: ocean blue. Secondary accent: warm amber/orange.
> Style: editorial product photography, NOT stock photo feel.

---

## Global Style Notes for All Prompts

When prompting, keep these consistent across every image:

- **Background tone:** Dark charcoal or deep navy (#0b0f14 to #111827), never white or bright
- **Lighting:** Soft studio sidelighting or moody natural light, subtle blue accent rim lighting
- **Mood:** Clean, trustworthy, editorial — like Wirecutter or RTINGS product photography
- **No text on images** — all text goes in HTML
- **No visible human faces** — hands and silhouettes are fine
- **Products must match the reference images exactly** — maintain logos, colors, and form factor

---

## 1. HOMEPAGE IMAGES (12 images)

### 1a. Featured Picks Section (4 images)

These cards show a single product in a lifestyle setting. Upload one product reference image per prompt.

---

**Image 1 — Best Overall: Bluevua RO100ROPOT-UV**
- **Reference:** Upload `bluevua-ro100ropot-uv-hero.jpeg`
- **Filename:** `bluevua-ro100ropot-uv-featured.webp`
- **Dimensions:** 600×600 (square)
- **Prompt:**

```
Using the attached product image as strict reference, generate a photorealistic product shot of this countertop reverse osmosis water filter system sitting on a modern dark granite kitchen countertop. The glass carafe is filled with crystal-clear water. Soft warm sidelighting from the left, subtle blue LED glow from the product display. Dark moody kitchen background with blurred cabinets. Shallow depth of field, 85mm lens look. Clean editorial product photography style. Dark overall tone.
```

---

**Image 2 — Best Value: Amazon Basics 10-Cup Pitcher**
- **Reference:** Upload `amazon-basics-10-cup-pitcher-hero.jpeg`
- **Filename:** `amazon-basics-10-cup-pitcher-featured.webp`
- **Dimensions:** 600×600 (square)
- **Prompt:**

```
Using the attached product image as strict reference, generate a photorealistic product shot of this water filter pitcher on a dark slate kitchen counter. A clear glass of freshly filtered water sits beside it. Soft natural window light from the right creating gentle highlights on the pitcher surface. Dark moody kitchen background, out-of-focus herbs and cutting board in the distance. Shallow depth of field, editorial product photography. Dark overall tone, clean and minimal.
```

---

**Image 3 — Best Under-Sink: iSpring RCC7AK**
- **Reference:** Upload `ispring-rcc7ak-hero.jpeg`
- **Filename:** `ispring-rcc7ak-featured.webp`
- **Dimensions:** 600×600 (square)
- **Prompt:**

```
Using the attached product image as strict reference, generate a photorealistic shot of this 6-stage under-sink reverse osmosis system installed underneath a modern kitchen sink cabinet. The cabinet door is open, revealing the mounted system with all stages visible. A sleek chrome RO faucet is visible on the countertop above. Soft under-cabinet LED lighting illuminating the system. Dark environment, editorial product photography style. Clean, professional, informative angle.
```

---

**Image 4 — Best for Outdoors: Timain Filter Straw 2-Pack**
- **Reference:** Upload `timain-filter-straw-2pack-hero.jpeg`
- **Filename:** `timain-filter-straw-featured.webp`
- **Dimensions:** 600×600 (square)
- **Prompt:**

```
Using the attached product image as strict reference, generate a photorealistic outdoor shot of this survival water filter straw being used at a clear mountain stream. A hand holds the straw dipping into flowing water between mossy rocks. Golden hour sunlight filtering through pine trees in the background. Shallow depth of field focused on the straw. Adventure photography style, moody natural lighting. No visible face, just hands and the stream. Rich earth tones.
```

---

### 1b. Category Browser Section (6 images)

These are category-level images showing a collection or representative shot. Upload 2-3 product references per category.

---

**Image 5 — Countertop & Pitcher Filters Category**
- **Reference:** Upload `bluevua-ro100ropot-uv-hero.jpeg` + `amazon-basics-10-cup-pitcher-hero.jpeg` + `brita-ultramax-27-cup-dispenser-hero.jpeg`
- **Filename:** `category-countertop-filters.webp`
- **Dimensions:** 600×600 (square)
- **Prompt:**

```
Using the three attached product images as strict reference, generate a photorealistic lifestyle shot of these water filtration products arranged together on a modern dark kitchen countertop. The countertop RO system on the left, the water pitcher in the center, and the large dispenser on the right. Soft diffused overhead lighting with subtle blue accent rim light. Dark slate backsplash background. Editorial product group photography, clean composition, everything visible and identifiable. Dark moody tone.
```

---

**Image 6 — Under-Sink Filters Category**
- **Reference:** Upload `ispring-rcc7ak-hero.jpeg` + `waterdrop-g3p600-hero.jpeg`
- **Filename:** `category-under-sink-filters.webp`
- **Dimensions:** 600×600 (square)
- **Prompt:**

```
Using the attached product images as reference, generate a photorealistic shot looking into an open kitchen cabinet under a dark stone sink. Two different under-sink water filtration systems are visible: a multi-stage RO system on the left and a compact tankless unit on the right. Clean plumbing connections visible. Soft under-cabinet LED lighting. Professional editorial photography, organized and informative. Dark background, modern kitchen aesthetic.
```

---

**Image 7 — Refrigerator Filters Category**
- **Reference:** Upload `everydrop-filter-1-edr1rxd1-hero.jpeg` + `ge-xwfe-hero.jpeg` + `samsung-haf-qin-hero.jpeg`
- **Filename:** `category-refrigerator-filters.webp`
- **Dimensions:** 600×600 (square)
- **Prompt:**

```
Using the three attached refrigerator filter images as strict reference, generate a photorealistic shot of these water filters arranged on a dark surface in front of a modern stainless steel refrigerator (blurred in background). The three filters are laid out at slight angles, each clearly visible. Soft studio sidelighting from the right, subtle reflection on the dark surface. Clean editorial product photography. Dark moody tone, professional and informative.
```

---

**Image 8 — Replacement Filters Category**
- **Reference:** Upload `brita-elite-2pack-hero.jpeg` + `zerowater-5stage-4pack-hero.jpeg` + `pur-pitcher-filter-4pack-hero.jpeg`
- **Filename:** `category-replacement-filters.webp`
- **Dimensions:** 600×600 (square)
- **Prompt:**

```
Using the three attached filter cartridge images as strict reference, generate a photorealistic overhead flat-lay shot of various pitcher replacement filter cartridges arranged on a dark matte surface. The filters are spread out in an organized pattern showing the variety of shapes and designs. Soft diffused top-down lighting with subtle warm highlights. Minimal shadows. Clean editorial product photography, informative and organized. Dark background.
```

---

**Image 9 — Survival & Portable Filters Category**
- **Reference:** Upload `timain-filter-straw-2pack-hero.jpeg` + `membrane-solutions-filter-straw-4pack-hero.jpeg` + `msr-aquatabs-30pack-hero.jpeg`
- **Filename:** `category-survival-filters.webp`
- **Dimensions:** 600×600 (square)
- **Prompt:**

```
Using the three attached product images as strict reference, generate a photorealistic shot of survival water filtration gear laid out on a topographic map beside a hiking backpack. Filter straws and water purification tablets arranged as if being packed for a trip. Warm golden directional light from upper left suggesting late afternoon. Shallow depth of field. Adventure photography style with rich earth tones. Dark overall mood, moody outdoor preparation scene.
```

---

**Image 10 — Whole House & Sediment Filters Category**
- **Reference:** Upload `membrane-solutions-sediment-6pack-hero.jpeg` + `universal-5micron-sediment-filter-hero.jpeg` + `elkay-51300c-watersentry-plus-hero.jpeg`
- **Filename:** `category-whole-house-filters.webp`
- **Dimensions:** 600×600 (square)
- **Prompt:**

```
Using the three attached product images as strict reference, generate a photorealistic shot of sediment water filter cartridges arranged near a whole-house filter housing mounted on a pipe against a dark utility room wall. White string-wound cartridges standing upright beside the blue housing. Overhead shop lighting with a cool blue tint. Industrial but clean aesthetic. Editorial product photography, informative composition. Dark moody background.
```

---

### 1c. Latest Reviews Section (2 lifestyle cards)

These reuse product hero images — no new images needed. The `ProductImage` component will auto-detect by slug. **Skip these.**

---

## 2. CATEGORY ROUNDUP PAGE HEROES (6 images)

Each "Best Of" page needs a hero image showing the category collection. Upload 3-4 product references.

---

**Image 11 — Best Countertop Filters Hero**
- **Reference:** Upload `bluevua-ro100ropot-uv-hero.jpeg` + `bluevua-ro100ropot-lite-uv-hero.jpeg` + `amazon-basics-10-cup-pitcher-hero.jpeg` + `brita-ultramax-27-cup-dispenser-hero.jpeg`
- **Filename:** `best-countertop-filters-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the four attached product images as strict reference, generate a photorealistic wide-format editorial shot of these countertop water filtration products arranged on a long dark marble kitchen island. Products are spaced evenly from left to right in decreasing size. Soft studio lighting from above and left, creating gentle highlights and subtle shadows. A glass of crystal-clear water in the foreground. Dark modern kitchen environment, blurred background. Cinematic wide composition, 16:9 aspect ratio. Clean editorial product photography.
```

---

**Image 12 — Best Under-Sink Filters Hero**
- **Reference:** Upload `pentair-everpure-h1200-hero.jpeg` + `ispring-rcc7ak-hero.jpeg` + `waterdrop-g3p600-hero.jpeg` + `pentair-everpure-h300-hero.jpeg`
- **Filename:** `best-under-sink-filters-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the four attached product images as strict reference, generate a photorealistic wide-format shot looking into a large open under-sink cabinet area. Multiple under-sink water filtration systems are displayed side by side on a dark surface, each clearly visible and identifiable. Clean stainless steel plumbing visible in the background. Soft diffused LED under-cabinet lighting. Professional editorial photography, informative and clean. 16:9 cinematic composition. Dark moody environment.
```

---

**Image 13 — Best Refrigerator Filters Hero**
- **Reference:** Upload `everydrop-filter-1-edr1rxd1-hero.jpeg` + `ge-xwfe-hero.jpeg` + `ge-rpwfe-hero.jpeg` + `samsung-haf-qin-hero.jpeg`
- **Filename:** `best-refrigerator-filters-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the four attached refrigerator filter images as strict reference, generate a photorealistic wide-format shot of these fridge water filters arranged in a line on a dark reflective surface. A modern stainless steel refrigerator is visible in the soft-focus background. Each filter is standing upright, clearly distinguishable. Soft cool-toned studio sidelighting from the right. Subtle reflections on the dark surface. 16:9 cinematic composition. Clean editorial product photography. Dark professional tone.
```

---

**Image 14 — Best Replacement Filters Hero**
- **Reference:** Upload `brita-standard-3pack-hero.jpeg` + `brita-elite-2pack-hero.jpeg` + `zerowater-5stage-4pack-hero.jpeg` + `pur-pitcher-filter-4pack-hero.jpeg`
- **Filename:** `best-replacement-filters-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the four attached filter cartridge images as strict reference, generate a photorealistic wide-format overhead shot of assorted pitcher replacement filter cartridges arranged in a neat grid pattern on a dark matte surface. Different brands and styles clearly visible, some in packaging, some loose. Soft diffused top-down lighting. Minimal shadows, clean and organized. 16:9 cinematic composition. Editorial product photography, informative flat-lay style. Dark background throughout.
```

---

**Image 15 — Best Survival Filters Hero**
- **Reference:** Upload `timain-filter-straw-2pack-hero.jpeg` + `membrane-solutions-filter-straw-4pack-hero.jpeg` + `naturenova-filter-straw-3pack-hero.jpeg` + `msr-aquatabs-30pack-hero.jpeg`
- **Filename:** `best-survival-filters-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the four attached product images as strict reference, generate a photorealistic wide-format shot of survival water filtration gear spread out on a rugged wooden camp table. Filter straws, water purification tablets, and carrying pouches arranged as a gear review layout. A forest stream is softly blurred in the background. Golden hour sidelighting filtering through trees. Adventure photography aesthetic. 16:9 cinematic composition. Rich earth tones, moody natural lighting.
```

---

**Image 16 — Best Whole House Filters Hero**
- **Reference:** Upload `membrane-solutions-sediment-6pack-hero.jpeg` + `universal-5micron-sediment-filter-hero.jpeg` + `elkay-51300c-watersentry-plus-hero.jpeg`
- **Filename:** `best-whole-house-filters-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the three attached product images as strict reference, generate a photorealistic wide-format shot of whole house and sediment water filters displayed on a dark workbench in a utility room. White sediment cartridges standing in a row, with a filter housing and commercial water filter unit beside them. Overhead fluorescent lighting with cool blue tint. Copper and PVC plumbing visible in soft focus behind. 16:9 cinematic composition. Industrial editorial photography. Dark moody professional tone.
```

---

## 3. COMPARISON PAGE HEROES (15 images)

Each comparison shows two products side by side. Upload both product hero images.

---

**Image 17 — Bluevua UV vs iSpring RCC7AK**
- **Reference:** Upload `bluevua-ro100ropot-uv-hero.jpeg` + `ispring-rcc7ak-hero.jpeg`
- **Filename:** `bluevua-uv-vs-ispring-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the two attached product images as strict reference, generate a photorealistic side-by-side comparison shot of these two water filtration systems on a dark surface. The countertop RO system on the left, the under-sink 6-stage system on the right, with clear visual separation between them. A subtle glowing dividing line or gap between the two products. Soft studio sidelighting from both edges, creating rim light on each product. 16:9 cinematic composition. Clean editorial comparison photography. Dark professional background.
```

---

**Image 18 — Bluevua UV vs Bluevua Lite UV**
- **Reference:** Upload `bluevua-ro100ropot-uv-hero.jpeg` + `bluevua-ro100ropot-lite-uv-hero.jpeg`
- **Filename:** `bluevua-uv-vs-bluevua-lite-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the two attached product images as strict reference, generate a photorealistic side-by-side comparison of these two countertop reverse osmosis systems on a dark granite surface. The full-size model on the left, the compact lite model on the right, both with their glass carafes. Subtle size difference clearly visible. Soft studio sidelighting with blue LED glow from both displays. 16:9 cinematic composition. Clean editorial comparison photography. Dark professional background.
```

---

**Image 19 — Brita Standard vs Brita Elite**
- **Reference:** Upload `brita-standard-3pack-hero.jpeg` + `brita-elite-2pack-hero.jpeg`
- **Filename:** `brita-standard-vs-elite-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the two attached filter images as strict reference, generate a photorealistic side-by-side comparison of these two Brita filter types on a dark surface. Standard filters on the left, Elite filters on the right. Each group neatly arranged. A Brita pitcher softly blurred in the background between them. Soft studio lighting from above. 16:9 cinematic composition. Clean editorial comparison photography. Dark matte background.
```

---

**Image 20 — ZeroWater vs Brita Elite**
- **Reference:** Upload `zerowater-5stage-4pack-hero.jpeg` + `brita-elite-2pack-hero.jpeg`
- **Filename:** `zerowater-vs-brita-elite-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the two attached filter images as strict reference, generate a photorealistic side-by-side comparison of these two pitcher filter brands on a dark surface. ZeroWater filters on the left, Brita Elite filters on the right. A TDS meter placed between them as a visual connector. Soft studio sidelighting. 16:9 cinematic composition. Clean editorial comparison photography. Dark professional background.
```

---

**Image 21 — Pentair H-1200 vs Pentair H-300**
- **Reference:** Upload `pentair-everpure-h1200-hero.jpeg` + `pentair-everpure-h300-hero.jpeg`
- **Filename:** `pentair-h1200-vs-h300-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the two attached product images as strict reference, generate a photorealistic side-by-side comparison of these two Pentair Everpure under-sink systems on a dark surface. The larger H-1200 dual-cartridge system on the left, the compact H-300 single-cartridge system on the right. Clean stainless steel fittings visible. Soft studio lighting with slight blue accent. 16:9 cinematic composition. Professional comparison photography. Dark background.
```

---

**Image 22 — GE XWFE vs GE RPWFE**
- **Reference:** Upload `ge-xwfe-hero.jpeg` + `ge-rpwfe-hero.jpeg`
- **Filename:** `ge-xwfe-vs-rpwfe-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the two attached product images as strict reference, generate a photorealistic side-by-side comparison of these two GE refrigerator water filters on a dark reflective surface. XWFE on the left, RPWFE on the right. Both upright, clearly showing their design differences. A modern GE refrigerator softly blurred in the background. Soft cool studio lighting. 16:9 cinematic composition. Editorial comparison photography. Dark professional tone.
```

---

**Image 23 — everydrop Filter 1 vs AQUACREST**
- **Reference:** Upload `everydrop-filter-1-edr1rxd1-hero.jpeg` + `aquacrest-ukf8001-3pack-hero.jpeg`
- **Filename:** `everydrop-vs-aquacrest-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the two attached product images as strict reference, generate a photorealistic side-by-side comparison of these two refrigerator filter brands on a dark surface. The everydrop OEM filter on the left, the AQUACREST third-party pack on the right. Clear visual distinction between single premium filter and multi-pack value option. Soft studio sidelighting. 16:9 cinematic composition. Clean editorial comparison photography. Dark background.
```

---

**Image 24 — iSpring RCC7AK vs Waterdrop G3P600**
- **Reference:** Upload `ispring-rcc7ak-hero.jpeg` + `waterdrop-g3p600-hero.jpeg`
- **Filename:** `ispring-vs-waterdrop-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the two attached product images as strict reference, generate a photorealistic side-by-side comparison of these two under-sink RO systems. The traditional multi-stage iSpring system on the left, the compact tankless Waterdrop unit on the right. Both on a dark surface. Size contrast clearly visible — the iSpring is much larger. Soft studio lighting with cool blue accent. 16:9 cinematic composition. Professional comparison photography. Dark moody background.
```

---

**Image 25 — Timain vs Membrane Solutions Straw**
- **Reference:** Upload `timain-filter-straw-2pack-hero.jpeg` + `membrane-solutions-filter-straw-4pack-hero.jpeg`
- **Filename:** `timain-vs-membrane-solutions-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the two attached product images as strict reference, generate a photorealistic side-by-side comparison of these two survival water filter straw brands on a dark wood surface. Timain straws on the left, Membrane Solutions straws on the right. An outdoor map and compass softly blurred in the background. Warm natural directional lighting from the left. 16:9 cinematic composition. Adventure gear review photography. Rich earth tones, moody.
```

---

**Image 26 — PUR vs Brita Standard**
- **Reference:** Upload `pur-pitcher-filter-4pack-hero.jpeg` + `brita-standard-3pack-hero.jpeg`
- **Filename:** `pur-vs-brita-standard-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the two attached filter images as strict reference, generate a photorealistic side-by-side comparison of PUR and Brita Standard pitcher replacement filters on a dark surface. PUR filters on the left, Brita Standard on the right. A glass of water between them. Soft overhead studio lighting. 16:9 cinematic composition. Clean editorial comparison photography. Dark matte background.
```

---

**Image 27 — Waterdrop WD-PF-01A vs Amazon Basics**
- **Reference:** Upload `waterdrop-wd-pf01a-plus-3pack-hero.jpeg` + `amazon-basics-replacement-3pack-hero.jpeg`
- **Filename:** `waterdrop-pf01a-vs-amazon-basics-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the two attached filter images as strict reference, generate a photorealistic side-by-side comparison of these two pitcher replacement filter packs on a dark surface. Waterdrop filters on the left, Amazon Basics filters on the right. Both packs partially opened showing the cartridges. Soft diffused studio lighting from above. 16:9 cinematic composition. Clean editorial comparison photography. Dark professional background.
```

---

**Image 28 — Samsung HAF-QIN vs everydrop Filter A**
- **Reference:** Upload `samsung-haf-qin-hero.jpeg` + `everydrop-filter-a-edrarxd1-hero.jpeg`
- **Filename:** `samsung-vs-everydrop-a-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the two attached product images as strict reference, generate a photorealistic side-by-side comparison of these two refrigerator filters on a dark reflective surface. Samsung filter on the left, everydrop Filter A on the right. Both upright and clearly visible. Soft studio sidelighting with cool tone. 16:9 cinematic composition. Editorial comparison photography. Dark professional background.
```

---

**Image 29 — Membrane Solutions Sediment vs Universal Sediment**
- **Reference:** Upload `membrane-solutions-sediment-6pack-hero.jpeg` + `universal-5micron-sediment-filter-hero.jpeg`
- **Filename:** `membrane-sediment-vs-universal-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the two attached sediment filter images as strict reference, generate a photorealistic side-by-side comparison of these two sediment filter cartridges on a dark workbench. Membrane Solutions string-wound filters on the left (multiple standing), Universal melt-blown cartridge on the right. A clear filter housing between them. Overhead utility lighting with cool blue cast. 16:9 cinematic composition. Industrial editorial photography. Dark moody background.
```

---

**Image 30 — NatureNova vs Timain Straw**
- **Reference:** Upload `naturenova-filter-straw-3pack-hero.jpeg` + `timain-filter-straw-2pack-hero.jpeg`
- **Filename:** `naturenova-vs-timain-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the two attached product images as strict reference, generate a photorealistic side-by-side comparison of these two survival water filter straw kits on a dark surface. NatureNova kit with straw, water bag, and syringe on the left. Timain straws on the right. Camping gear softly blurred in the background. Warm directional sidelighting. 16:9 cinematic composition. Adventure gear review photography. Moody earth tones.
```

---

**Image 31 — ZeroWater 4-Pack vs 6-Pack**
- **Reference:** Upload `zerowater-5stage-4pack-hero.jpeg` + `zerowater-5stage-6pack-hero.jpeg`
- **Filename:** `zerowater-4pack-vs-6pack-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the two attached product images as strict reference, generate a photorealistic side-by-side comparison of these two ZeroWater filter pack sizes on a dark surface. The 4-pack on the left, the larger 6-pack on the right. Size and quantity difference clearly visible. A ZeroWater pitcher and TDS meter softly blurred in the background. Soft studio lighting from above. 16:9 cinematic composition. Clean editorial comparison photography. Dark background.
```

---

## 4. BUYER GUIDE HEROES (8 images)

These are editorial/lifestyle images. Upload 1-2 relevant product references for context.

---

**Image 32 — How to Choose a Water Filter**
- **Reference:** Upload `bluevua-ro100ropot-uv-hero.jpeg` + `amazon-basics-10-cup-pitcher-hero.jpeg` + `timain-filter-straw-2pack-hero.jpeg`
- **Filename:** `how-to-choose-water-filter-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the attached product images as reference, generate a photorealistic wide shot of a person's hands resting on a dark kitchen counter with three different types of water filters spread out before them — a countertop RO system, a pitcher, and a portable straw filter. The scene suggests decision-making and comparison. Soft overhead lighting, shallow depth of field focused on the products. No face visible, just hands and forearms. 16:9 cinematic composition. Editorial lifestyle photography. Dark moody kitchen environment.
```

---

**Image 33 — Water Filter Maintenance Guide**
- **Reference:** Upload `brita-standard-3pack-hero.jpeg`
- **Filename:** `water-filter-maintenance-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the attached filter image as reference, generate a photorealistic close-up shot of hands carefully replacing a water filter cartridge in a pitcher over a dark granite countertop. The old filter is being removed and a fresh one from the package is nearby. Water droplets visible on the counter surface. Soft warm sidelighting. Shallow depth of field. 16:9 cinematic composition. Editorial how-to photography style. Dark environment, clean and instructional.
```

---

**Image 34 — Water Filter Sizing Guide**
- **Reference:** Upload `bluevua-ro100ropot-uv-hero.jpeg` + `amazon-basics-10-cup-pitcher-hero.jpeg` + `brita-ultramax-27-cup-dispenser-hero.jpeg`
- **Filename:** `water-filter-sizing-guide-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the attached product images as reference, generate a photorealistic shot of three water filtration products lined up on a dark counter in ascending size — a small pitcher on the left, a large dispenser in the center, and a countertop RO system on the right. A measuring tape or ruler is laid along the front edge for scale reference. Soft studio lighting. 16:9 cinematic composition. Informative editorial photography. Dark background, clean and educational.
```

---

**Image 35 — Best Water Filters Under $50**
- **Reference:** Upload `amazon-basics-10-cup-pitcher-hero.jpeg` + `brita-standard-3pack-hero.jpeg` + `timain-filter-straw-2pack-hero.jpeg`
- **Filename:** `best-water-filters-under-50-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the attached product images as reference, generate a photorealistic flat-lay shot of budget-friendly water filtration products arranged on a dark surface with scattered coins and a few small dollar bills nearby suggesting affordability. A pitcher, filter cartridges, and a straw filter visible. Soft top-down diffused lighting. 16:9 cinematic composition. Clean editorial lifestyle photography. Dark matte surface, warm subtle accent lighting.
```

---

**Image 36 — Reverse Osmosis vs Carbon Filters**
- **Reference:** Upload `ispring-rcc7ak-hero.jpeg` + `amazon-basics-10-cup-pitcher-hero.jpeg`
- **Filename:** `reverse-osmosis-vs-carbon-filters-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the two attached product images as reference, generate a photorealistic split-composition image. Left half: an under-sink RO system with its multiple stages visible, representing advanced filtration. Right half: a simple carbon pitcher filter, representing basic filtration. A subtle glowing dividing line between the two halves. Each side lit independently — cool blue on the RO side, warm amber on the pitcher side. 16:9 cinematic composition. Editorial comparison photography. Dark background.
```

---

**Image 37 — Water Filtration Beginner Guide**
- **Reference:** Upload `amazon-basics-10-cup-pitcher-hero.jpeg`
- **Filename:** `water-filtration-beginner-guide-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Generate a photorealistic shot of a single clean glass of water sitting on a dark slate coaster on a minimal dark countertop. The glass is backlit with soft blue-white light, making the water glow. A water pitcher is softly blurred in the background. Extremely clean and simple composition suggesting purity and clarity. 16:9 cinematic composition. Minimal editorial photography. Dark environment with one bright focal point.
```

---

**Image 38 — Common Water Filter Mistakes**
- **Reference:** Upload `brita-standard-3pack-hero.jpeg`
- **Filename:** `water-filter-mistakes-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Generate a photorealistic shot of a discolored, visibly old water filter cartridge sitting on a dark surface next to a clean new replacement filter still in its packaging. The old filter has a brownish-yellow tint suggesting overuse. Dramatic sidelighting emphasizing the contrast between old and new. A glass of slightly cloudy water near the old filter. 16:9 cinematic composition. Editorial photography with a cautionary tone. Dark moody environment.
```

---

**Image 39 — Water Filter Cost Analysis**
- **Reference:** Upload `zerowater-5stage-6pack-hero.jpeg` + `brita-standard-4pack-hero.jpeg`
- **Filename:** `water-filter-cost-analysis-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the attached filter pack images as reference, generate a photorealistic shot of replacement filter packs on a dark desk surface alongside a calculator, a notepad with handwritten numbers, and a few coins. The scene suggests calculating long-term costs. Soft warm desk lamp lighting from the upper left. Shallow depth of field focused on the filters and calculator. 16:9 cinematic composition. Editorial lifestyle photography. Dark moody study/office environment.
```

---

## 5. ACTIVITY GUIDE HEROES (10 images)

Lifestyle/scene images for specific use cases. Upload the most relevant product reference(s).

---

**Image 40 — Water Filters for Camping**
- **Reference:** Upload `timain-filter-straw-2pack-hero.jpeg` + `msr-aquatabs-30pack-hero.jpeg`
- **Filename:** `water-filters-for-camping-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the attached product images as reference, generate a photorealistic campsite scene at dusk. A filter straw and water purification tablets sit on a flat rock beside a campfire (warm glow in background). A clear mountain stream is visible nearby. Pine trees silhouetted against a darkening sky. The filter straw is positioned as if recently used, water droplets on it. Golden hour to blue hour transitional lighting. 16:9 cinematic composition. Adventure lifestyle photography. Rich warm-to-cool tonal range.
```

---

**Image 41 — Water Filters for Hiking**
- **Reference:** Upload `membrane-solutions-filter-straw-4pack-hero.jpeg`
- **Filename:** `water-filters-for-hiking-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the attached product image as reference, generate a photorealistic shot of a hiker's hand holding a filter straw dipped into a clear alpine stream. Rocky mountain terrain and wildflowers in the soft-focus background. Bright natural daylight with the sun partially behind a peak creating rim light on the hand and straw. No face visible. 16:9 cinematic composition. Adventure photography. Vibrant but natural colors, crisp mountain air feeling.
```

---

**Image 42 — Water Filters for Emergencies**
- **Reference:** Upload `timain-filter-straw-2pack-hero.jpeg` + `msr-aquatabs-30pack-hero.jpeg` + `naturenova-filter-straw-3pack-hero.jpeg`
- **Filename:** `water-filters-for-emergencies-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the attached product images as reference, generate a photorealistic shot of an emergency preparedness kit spread out on a dark surface. Water filter straws, purification tablets, a water storage container, a flashlight, and a first aid kit are organized neatly. The water filtration products are the focal point in the center. Dramatic overhead lighting with slight warm cast. 16:9 cinematic composition. Editorial preparedness photography. Dark moody, serious tone.
```

---

**Image 43 — Water Filters for Well Water**
- **Reference:** Upload `membrane-solutions-sediment-6pack-hero.jpeg` + `ispring-rcc7ak-hero.jpeg`
- **Filename:** `water-filters-for-well-water-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the attached product images as reference, generate a photorealistic shot of a whole-house filtration setup in a rural utility room. Sediment filter cartridges and an RO system are visible near copper plumbing connected to a well pump pressure tank. A window shows a rural homestead scene outside. Soft natural light from the window mixed with overhead utility lighting. 16:9 cinematic composition. Documentary-style editorial photography. Moody, authentic rural aesthetic.
```

---

**Image 44 — Water Filters for Apartments**
- **Reference:** Upload `amazon-basics-10-cup-pitcher-hero.jpeg` + `brita-ultramax-27-cup-dispenser-hero.jpeg`
- **Filename:** `water-filters-for-apartments-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the attached product images as reference, generate a photorealistic shot of a small modern apartment kitchen. A water filter pitcher sits on a compact countertop next to a coffee maker. The kitchen is stylish but small, with open shelving and plants. Soft warm morning light from a nearby window. Cozy urban living aesthetic. 16:9 cinematic composition. Lifestyle editorial photography. Warm tones but with the dark overall mood maintained.
```

---

**Image 45 — Water Filters for RV**
- **Reference:** Upload `membrane-solutions-sediment-6pack-hero.jpeg` + `timain-filter-straw-2pack-hero.jpeg`
- **Filename:** `water-filters-for-rv-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the attached product images as reference, generate a photorealistic shot of a water filter being connected to an RV's external water hookup at a campground. A sediment filter housing is visible in the inline setup. The RV is modern, parked with trees in the background. Golden hour sidelighting creating long shadows. 16:9 cinematic composition. RV lifestyle photography. Warm outdoor tones, adventure and self-sufficiency mood.
```

---

**Image 46 — Water Filters for Baby**
- **Reference:** Upload `bluevua-ro100ropot-uv-hero.jpeg`
- **Filename:** `water-filters-for-baby-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Generate a photorealistic shot of a parent's hands preparing baby formula on a dark kitchen counter. A glass of perfectly clear filtered water from a countertop RO system (blurred in background) is being poured carefully. Baby bottle and formula canister visible nearby. Soft warm lighting from above, creating a gentle nurturing atmosphere. No faces visible. 16:9 cinematic composition. Lifestyle editorial photography. Warm tones, dark environment, care and safety mood.
```

---

**Image 47 — Water Filters for Travel**
- **Reference:** Upload `timain-filter-straw-2pack-hero.jpeg` + `msr-aquatabs-30pack-hero.jpeg`
- **Filename:** `water-filters-for-travel-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the attached product images as reference, generate a photorealistic flat-lay shot of travel essentials on a dark surface: a filter straw, water purification tablets, a passport, a reusable water bottle, sunglasses, and a boarding pass. The water filtration items are the focal point in the center. Soft diffused overhead lighting. 16:9 cinematic composition. Travel lifestyle flat-lay photography. Dark surface, organized and editorial.
```

---

**Image 48 — Water Filters for Off-Grid Living**
- **Reference:** Upload `ispring-rcc7ak-hero.jpeg` + `membrane-solutions-sediment-6pack-hero.jpeg`
- **Filename:** `water-filters-for-off-grid-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the attached product images as reference, generate a photorealistic shot of a self-sufficient homestead water filtration station. A multi-stage filter system is mounted on a wooden wall in a rustic but functional utility area. Rain collection barrel visible through a window. A hand turns the filtered water faucet, filling a glass jar. Natural light from the window, warm golden tones. 16:9 cinematic composition. Homesteading lifestyle photography. Rustic-meets-functional aesthetic.
```

---

**Image 49 — Water Filters for Hard Water**
- **Reference:** Upload `ispring-rcc7ak-hero.jpeg`
- **Filename:** `water-filters-for-hard-water-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Generate a photorealistic close-up shot of a TDS meter being dipped into a glass of water on a dark countertop. The digital display shows a high reading. Beside the glass, a second glass of filtered water and a TDS meter showing a low reading. An RO system is softly blurred in the background. Dramatic sidelighting emphasizing the contrast between the two glasses. 16:9 cinematic composition. Editorial informative photography. Dark moody environment.
```

---

## 6. KNOWLEDGE BASE HEROES (8 images)

Educational/reference imagery. Minimal or no product references needed.

---

**Image 50 — What Is Reverse Osmosis?**
- **Reference:** None needed (or optionally upload `ispring-rcc7ak-hero.jpeg`)
- **Filename:** `what-is-reverse-osmosis-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Generate a photorealistic macro close-up of a reverse osmosis membrane being held up to soft blue backlight. The semi-transparent membrane layers are visible in cross-section, showing the tight spiral-wound structure. Water droplets on the membrane surface catching light. Dark background with blue accent lighting. Shallow depth of field. 16:9 cinematic composition. Scientific editorial photography. Dark moody, technically fascinating.
```

---

**Image 51 — NSF Certifications Explained**
- **Filename:** `nsf-certifications-explained-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Generate a photorealistic shot of a water filter cartridge on a dark surface with official certification documents and testing reports spread around it. A magnifying glass hovers over a certification mark on the filter. Soft focused lighting on the certification area. Dark desk surface, office/lab environment. 16:9 cinematic composition. Editorial informative photography. Dark professional environment, trust and verification mood.
```

---

**Image 52 — Understanding TDS**
- **Filename:** `understanding-tds-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Generate a photorealistic shot of a digital TDS meter being dipped into a clear glass of water on a dark surface. The LED display is glowing with a reading. Water ripples around the meter probe. A second empty glass and a water pitcher are softly blurred in the background. Dramatic sidelighting highlighting the meter and water. 16:9 cinematic composition. Scientific editorial photography. Dark environment, technical and educational.
```

---

**Image 53 — PFAS in Drinking Water**
- **Filename:** `pfas-in-drinking-water-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Generate a photorealistic shot of a glass of water on a dark surface being examined with focused light. The water appears clear but there's a sense of invisible contamination. A water testing kit with vials and reagent strips is arranged beside the glass. Lab-style lighting — cool blue with harsh directional overhead. 16:9 cinematic composition. Scientific documentary photography. Dark moody, serious investigative tone.
```

---

**Image 54 — Lead in Drinking Water**
- **Filename:** `lead-in-drinking-water-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Generate a photorealistic close-up of an old corroded lead pipe fitting with a water droplet forming at the joint. The pipe is against a dark concrete or stone wall. A glass of water sits on a surface below, catching the drip. Dramatic focused sidelighting creating harsh shadows on the corroded metal texture. 16:9 cinematic composition. Documentary editorial photography. Dark, serious, cautionary tone.
```

---

**Image 55 — Water Filter Types Explained**
- **Reference:** Upload `ispring-rcc7ak-hero.jpeg` + `amazon-basics-10-cup-pitcher-hero.jpeg` + `timain-filter-straw-2pack-hero.jpeg` + `membrane-solutions-sediment-6pack-hero.jpeg`
- **Filename:** `water-filter-types-explained-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the four attached product images as reference, generate a photorealistic wide shot of different water filter types arranged in a row on a dark surface, from simplest to most complex: a sediment cartridge, a portable straw filter, a pitcher, and a multi-stage RO system. Each represents a different filtration technology. Soft even studio lighting. Labels are NOT needed (those go in HTML). 16:9 cinematic composition. Educational editorial photography. Dark professional background.
```

---

**Image 56 — Is Tap Water Safe?**
- **Filename:** `is-tap-water-safe-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Generate a photorealistic shot of a kitchen faucet running water into a clear glass on a dark countertop. The stream of water is the focal point, caught in crisp detail with motion blur. City lights visible through a window in the soft-focus background, suggesting urban water supply. Soft natural sidelighting. 16:9 cinematic composition. Lifestyle editorial photography. Dark moody environment, questioning and contemplative tone.
```

---

**Image 57 — History of Water Filtration**
- **Filename:** `history-of-water-filtration-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Generate a photorealistic still-life shot on a dark wooden table showing the evolution of water filtration: an antique ceramic water filter vessel on the left, a vintage charcoal filter candle in the center, and a modern carbon filter cartridge on the right. Arranged chronologically left to right. Warm golden sidelighting suggesting candlelight/old world meeting modern. 16:9 cinematic composition. Historical editorial photography. Dark rich tones, museum-like lighting.
```

---

## 7. ABOUT PAGE HERO (1 image)

---

**Image 58 — About OffGrid Filters**
- **Reference:** Upload `bluevua-ro100ropot-uv-hero.jpeg` + `ispring-rcc7ak-hero.jpeg` + `timain-filter-straw-2pack-hero.jpeg`
- **Filename:** `about-hero.webp`
- **Dimensions:** 1200×675 (16:9 hero)
- **Prompt:**

```
Using the attached product images as reference, generate a photorealistic shot of a water filter testing workbench. Multiple filters and testing equipment (TDS meters, graduated cylinders, water samples in vials) are organized on a dark industrial bench surface. A laptop with charts is open in the background. The scene conveys rigorous, methodical product testing. Soft overhead studio lighting with cool blue accents. 16:9 cinematic composition. Behind-the-scenes editorial photography. Dark professional lab/workshop environment.
```

---

## SUMMARY

| Category | Count | Dimensions |
|----------|-------|------------|
| Homepage — Featured Picks | 4 | 600×600 |
| Homepage — Category Browser | 6 | 600×600 |
| Category Roundup Heroes | 6 | 1200×675 |
| Comparison Page Heroes | 15 | 1200×675 |
| Buyer Guide Heroes | 8 | 1200×675 |
| Activity Guide Heroes | 10 | 1200×675 |
| Knowledge Base Heroes | 8 | 1200×675 |
| About Page Hero | 1 | 1200×675 |
| **Total** | **58** | |

> **Note:** The remaining ~26 placeholders from the original IMAGE-GUIDE.md count of 113
> were product review heroes (already done — 29 images) and roundup mini-review images
> (which reuse the product hero images via the `slug` prop in `ProductImage.astro`).

---

## POST-GENERATION WORKFLOW

1. Save all generated images to `public/assets/images/` using the filenames above
2. Run the conversion script:
   ```bash
   node scripts/convert-to-webp.mjs
   ```
3. This generates responsive WebP variants in `public/assets/`:
   - `[filename].webp` (full 1200w)
   - `[filename]-medium.webp` (800w)
   - `[filename]-small.webp` (400w)
4. Update page files to pass the correct `src` or `slug` prop to `<ProductImage>`
5. Rebuild: `npm run build`
