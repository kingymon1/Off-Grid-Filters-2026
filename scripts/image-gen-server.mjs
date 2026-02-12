#!/usr/bin/env node
/**
 * OffGrid Filters — AI Image Generation Admin
 *
 * Self-contained server for generating product/editorial images
 * using Google's Gemini API, with a built-in admin UI.
 *
 * Usage:
 *   npm run images              # Start admin UI at http://localhost:3100
 *   npm run images -- --auto    # Auto-generate all missing images (CLI)
 *
 * Setup:
 *   1. Copy .env.example to .env
 *   2. Add your GEMINI_API_KEY
 *   3. Run: npm run images
 */

import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ASSETS_DIR = join(ROOT, 'public', 'assets');
const PORT = 3100;

// ─── .env loader (no dependencies) ────────────────────────
async function loadEnv() {
  try {
    const content = await readFile(join(ROOT, '.env'), 'utf-8');
    for (const line of content.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq < 0) continue;
      const key = t.slice(0, eq).trim();
      const val = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  } catch { /* no .env */ }
}

// ─── Sharp (optional — graceful fallback) ─────────────────
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.warn('⚠  Sharp not installed. Images saved as PNG without responsive variants.');
  console.warn('   Run "npm install" to enable WebP conversion.\n');
}

// ─── Style Prefixes ───────────────────────────────────────
const S = {
  product: 'Professional product photography, clean modern setting, soft diffused studio lighting with subtle rim light, shallow depth of field, dark neutral background with subtle gradient, high resolution, ultra-sharp focus, no text, no logos, no watermarks, no human faces visible.',
  lifestyle: 'Professional editorial photograph, authentic natural setting, warm natural lighting, shallow depth of field, high resolution, cinematic color grading, no text, no logos, no watermarks, no visible brand names.',
  educational: 'Clean informational photograph, well-lit, professional composition, modern scientific style, shallow depth of field, high resolution, no text, no logos, no watermarks.',
  collection: 'Professional product arrangement photograph, clean dark surface, soft studio lighting, multiple products artfully arranged, shallow depth of field, high resolution, no text, no logos, no watermarks.',
  comparison: 'Professional product comparison photograph, two products placed side by side on a clean dark surface, evenly lit, symmetrical composition, studio lighting, high resolution, no text, no logos, no watermarks.',
};

// ─── All Image Prompts ────────────────────────────────────
const IMAGE_PROMPTS = [
  // ══════════════════════════════════════════════════════════
  // PRODUCT REVIEW HEROES (29) — real photos already exist
  // ══════════════════════════════════════════════════════════
  { id: 'review-bluevua-ro100ropot-uv', filename: 'bluevua-ro100ropot-uv-hero.webp', category: 'product-reviews', pagePath: '/reviews/bluevua-ro100ropot-uv/', aspectRatio: '1:1', description: 'Bluevua RO100ROPOT-UV hero', prompt: `${S.product} A premium countertop reverse osmosis water filter system with an elegant glass carafe filled with crystal clear water, blue LED display glowing softly, on a modern dark granite kitchen countertop.` },
  { id: 'review-bluevua-ro100ropot-lite-uv', filename: 'bluevua-ro100ropot-lite-uv-hero.webp', category: 'product-reviews', pagePath: '/reviews/bluevua-ro100ropot-lite-uv/', aspectRatio: '1:1', description: 'Bluevua RO100ROPOT-Lite UV hero', prompt: `${S.product} A compact countertop reverse osmosis system next to a glass carafe, LED display showing filter status indicators, on a modern kitchen counter.` },
  { id: 'review-amazon-basics-10-cup-pitcher', filename: 'amazon-basics-10-cup-pitcher-hero.webp', category: 'product-reviews', pagePath: '/reviews/amazon-basics-10-cup-pitcher/', aspectRatio: '1:1', description: 'Amazon Basics 10-Cup Pitcher hero', prompt: `${S.product} A simple blue translucent 10-cup water filter pitcher on a kitchen counter, water being poured into a glass, clean minimal kitchen background.` },
  { id: 'review-brita-ultramax-27-cup-dispenser', filename: 'brita-ultramax-27-cup-dispenser-hero.webp', category: 'product-reviews', pagePath: '/reviews/brita-ultramax-27-cup-dispenser/', aspectRatio: '1:1', description: 'Brita UltraMax 27-Cup Dispenser hero', prompt: `${S.product} A large white water filter dispenser with front spigot on a kitchen countertop, 27-cup capacity, clean minimal kitchen setting.` },
  { id: 'review-pentair-everpure-h1200', filename: 'pentair-everpure-h1200-hero.webp', category: 'product-reviews', pagePath: '/reviews/pentair-everpure-h1200/', aspectRatio: '1:1', description: 'Pentair Everpure H-1200 hero', prompt: `${S.product} Professional twin water filter cartridges, commercial-grade cylindrical design, stainless steel fittings, on a dark surface.` },
  { id: 'review-pentair-everpure-h300', filename: 'pentair-everpure-h300-hero.webp', category: 'product-reviews', pagePath: '/reviews/pentair-everpure-h300/', aspectRatio: '1:1', description: 'Pentair Everpure H-300 hero', prompt: `${S.product} Complete under-sink water filtration system with filter head, single cartridge, dedicated faucet, and mounting hardware laid out on a surface.` },
  { id: 'review-ispring-rcc7ak', filename: 'ispring-rcc7ak-hero.webp', category: 'product-reviews', pagePath: '/reviews/ispring-rcc7ak/', aspectRatio: '1:1', description: 'iSpring RCC7AK hero', prompt: `${S.product} A 6-stage under-sink reverse osmosis filtration system with all filter canisters visible in a row, tank alongside, installed under a kitchen sink.` },
  { id: 'review-waterdrop-g3p600', filename: 'waterdrop-g3p600-hero.webp', category: 'product-reviews', pagePath: '/reviews/waterdrop-g3p600/', aspectRatio: '1:1', description: 'Waterdrop G3P600 hero', prompt: `${S.product} A sleek modern tankless reverse osmosis unit with a smart LED faucet showing a TDS display, compact design, under a kitchen sink.` },
  { id: 'review-everydrop-filter-1-edr1rxd1', filename: 'everydrop-filter-1-edr1rxd1-hero.webp', category: 'product-reviews', pagePath: '/reviews/everydrop-filter-1-edr1rxd1/', aspectRatio: '1:1', description: 'everydrop Filter 1 hero', prompt: `${S.product} A white cylindrical refrigerator water filter cartridge with a modern refrigerator slightly blurred in the background.` },
  { id: 'review-ge-xwfe', filename: 'ge-xwfe-hero.webp', category: 'product-reviews', pagePath: '/reviews/ge-xwfe/', aspectRatio: '1:1', description: 'GE XWFE hero', prompt: `${S.product} A refrigerator water filter cartridge close-up on a clean surface, a modern stainless steel refrigerator blurred in the background.` },
  { id: 'review-ge-rpwfe', filename: 'ge-rpwfe-hero.webp', category: 'product-reviews', pagePath: '/reviews/ge-rpwfe/', aspectRatio: '1:1', description: 'GE RPWFE hero', prompt: `${S.product} A refrigerator water filter being installed into the rear compartment of a modern French door refrigerator, installation process shot.` },
  { id: 'review-samsung-haf-qin', filename: 'samsung-haf-qin-hero.webp', category: 'product-reviews', pagePath: '/reviews/samsung-haf-qin/', aspectRatio: '1:1', description: 'Samsung HAF-QIN hero', prompt: `${S.product} A compact refrigerator water filter cartridge with quarter-turn installation mechanism detail visible, internal fridge filter design.` },
  { id: 'review-everydrop-filter-a-edrarxd1', filename: 'everydrop-filter-a-edrarxd1-hero.webp', category: 'product-reviews', pagePath: '/reviews/everydrop-filter-a-edrarxd1/', aspectRatio: '1:1', description: 'everydrop Filter A hero', prompt: `${S.product} A refrigerator water filter cartridge with a rotating knob mechanism, modern design, on a clean surface.` },
  { id: 'review-aquacrest-ukf8001-3pack', filename: 'aquacrest-ukf8001-3pack-hero.webp', category: 'product-reviews', pagePath: '/reviews/aquacrest-ukf8001-3pack/', aspectRatio: '1:1', description: 'AQUACREST UKF8001 3-Pack hero', prompt: `${S.product} Three white refrigerator water filter cartridges arranged in a neat row on a clean surface, identical units, value pack display.` },
  { id: 'review-amazon-basics-replacement-3pack', filename: 'amazon-basics-replacement-3pack-hero.webp', category: 'product-reviews', pagePath: '/reviews/amazon-basics-replacement-3pack/', aspectRatio: '1:1', description: 'Amazon Basics Replacement 3-Pack hero', prompt: `${S.product} Three water pitcher replacement filter cartridges, one partially removed from packaging, clean product arrangement.` },
  { id: 'review-brita-standard-3pack', filename: 'brita-standard-3pack-hero.webp', category: 'product-reviews', pagePath: '/reviews/brita-standard-3pack/', aspectRatio: '1:1', description: 'Brita Standard 3-Pack hero', prompt: `${S.product} Three water pitcher replacement filters with a water filter pitcher visible in the soft background, product arrangement.` },
  { id: 'review-brita-standard-4pack', filename: 'brita-standard-4pack-hero.webp', category: 'product-reviews', pagePath: '/reviews/brita-standard-4pack/', aspectRatio: '1:1', description: 'Brita Standard 4-Pack hero', prompt: `${S.product} Four water filter cartridges for a pitcher arranged neatly on a kitchen counter, value pack display.` },
  { id: 'review-brita-elite-2pack', filename: 'brita-elite-2pack-hero.webp', category: 'product-reviews', pagePath: '/reviews/brita-elite-2pack/', aspectRatio: '1:1', description: 'Brita Elite 2-Pack hero', prompt: `${S.product} Two premium water filter cartridges next to a water filter pitcher, emphasizing the premium build quality.` },
  { id: 'review-zerowater-5stage-4pack', filename: 'zerowater-5stage-4pack-hero.webp', category: 'product-reviews', pagePath: '/reviews/zerowater-5stage-4pack/', aspectRatio: '1:1', description: 'ZeroWater 5-Stage 4-Pack hero', prompt: `${S.product} Four advanced 5-stage water filter cartridges with a digital TDS meter showing 000 reading, demonstrating purity.` },
  { id: 'review-zerowater-5stage-6pack', filename: 'zerowater-5stage-6pack-hero.webp', category: 'product-reviews', pagePath: '/reviews/zerowater-5stage-6pack/', aspectRatio: '1:1', description: 'ZeroWater 5-Stage 6-Pack hero', prompt: `${S.product} Six water filter cartridges arranged around a large water filter pitcher/dispenser, bulk value display.` },
  { id: 'review-pur-pitcher-filter-4pack', filename: 'pur-pitcher-filter-4pack-hero.webp', category: 'product-reviews', pagePath: '/reviews/pur-pitcher-filter-4pack/', aspectRatio: '1:1', description: 'PUR Pitcher Filter 4-Pack hero', prompt: `${S.product} Four pitcher water filter cartridges showing a unique lock-fit mechanism design, product detail shot.` },
  { id: 'review-waterdrop-wd-pf01a-plus-3pack', filename: 'waterdrop-wd-pf01a-plus-3pack-hero.webp', category: 'product-reviews', pagePath: '/reviews/waterdrop-wd-pf01a-plus-3pack/', aspectRatio: '1:1', description: 'Waterdrop WD-PF-01A Plus 3-Pack hero', prompt: `${S.product} Three advanced carbon fiber water filter cartridges with a modern water pitcher, showcasing filtration technology.` },
  { id: 'review-timain-filter-straw-2pack', filename: 'timain-filter-straw-2pack-hero.webp', category: 'product-reviews', pagePath: '/reviews/timain-filter-straw-2pack/', aspectRatio: '1:1', description: 'Timain Filter Straw 2-Pack hero', prompt: `${S.product} Two portable water filter straws on an outdoor surface, hiking and camping context, rugged and compact design.` },
  { id: 'review-membrane-solutions-filter-straw-4pack', filename: 'membrane-solutions-filter-straw-4pack-hero.webp', category: 'product-reviews', pagePath: '/reviews/membrane-solutions-filter-straw-4pack/', aspectRatio: '1:1', description: 'Membrane Solutions Filter Straw 4-Pack hero', prompt: `${S.product} Four portable water filter straws fanned out on a surface, one attached to a water bottle, outdoor gear aesthetic.` },
  { id: 'review-naturenova-filter-straw-3pack', filename: 'naturenova-filter-straw-3pack-hero.webp', category: 'product-reviews', pagePath: '/reviews/naturenova-filter-straw-3pack/', aspectRatio: '1:1', description: 'NatureNova Filter Straw 3-Pack hero', prompt: `${S.product} A complete survival water filtration kit laid out: filter straw, foldable water bag, and backwash syringe on a rustic surface.` },
  { id: 'review-msr-aquatabs-30pack', filename: 'msr-aquatabs-30pack-hero.webp', category: 'product-reviews', pagePath: '/reviews/msr-aquatabs-30pack/', aspectRatio: '1:1', description: 'MSR Aquatabs 30-Pack hero', prompt: `${S.product} Water purification tablets scattered near a metal water bottle on an outdoor surface, wilderness setting, camping gear context.` },
  { id: 'review-membrane-solutions-sediment-6pack', filename: 'membrane-solutions-sediment-6pack-hero.webp', category: 'product-reviews', pagePath: '/reviews/membrane-solutions-sediment-6pack/', aspectRatio: '1:1', description: 'Membrane Solutions Sediment 6-Pack hero', prompt: `${S.product} Six white string-wound sediment water filter cartridges standing upright in a row, industrial filtration look.` },
  { id: 'review-universal-5micron-sediment-filter', filename: 'universal-5micron-sediment-filter-hero.webp', category: 'product-reviews', pagePath: '/reviews/universal-5micron-sediment-filter/', aspectRatio: '1:1', description: 'Universal 5-Micron Sediment Filter hero', prompt: `${S.product} A single white sediment filter cartridge standing next to a transparent blue filter housing, whole-house filtration component.` },
  { id: 'review-elkay-51300c-watersentry-plus', filename: 'elkay-51300c-watersentry-plus-hero.webp', category: 'product-reviews', pagePath: '/reviews/elkay-51300c-watersentry-plus/', aspectRatio: '1:1', description: 'Elkay 51300C WaterSentry Plus hero', prompt: `${S.product} A commercial water filter cartridge next to a stainless steel bottle filling station, institutional/commercial setting.` },

  // ══════════════════════════════════════════════════════════
  // HOMEPAGE FEATURED PICKS (4)
  // ══════════════════════════════════════════════════════════
  { id: 'featured-bluevua', filename: 'bluevua-ro100ropot-uv-featured.webp', category: 'featured-picks', pagePath: '/', aspectRatio: '1:1', description: 'Featured: Bluevua RO100ROPOT-UV', prompt: `${S.product} A premium countertop reverse osmosis system with a glass carafe filled with water on a dark granite countertop, warm kitchen ambiance, product glamour shot with soft bokeh background.` },
  { id: 'featured-amazon-basics', filename: 'amazon-basics-10-cup-pitcher-featured.webp', category: 'featured-picks', pagePath: '/', aspectRatio: '1:1', description: 'Featured: Amazon Basics Pitcher', prompt: `${S.product} A blue translucent water filter pitcher on a granite kitchen counter, front angle view, minimalist modern kitchen, morning light from a window.` },
  { id: 'featured-ispring', filename: 'ispring-rcc7ak-featured.webp', category: 'featured-picks', pagePath: '/', aspectRatio: '1:1', description: 'Featured: iSpring RCC7AK', prompt: `${S.product} An under-sink reverse osmosis system installed under a kitchen cabinet, dedicated chrome faucet visible on the countertop above, showing the complete installation.` },
  { id: 'featured-timain', filename: 'timain-filter-straw-featured.webp', category: 'featured-picks', pagePath: '/', aspectRatio: '1:1', description: 'Featured: Timain Filter Straw', prompt: `${S.lifestyle} A portable water filter straw being used to drink from a crystal clear mountain stream, outdoor adventure setting with forest and rocks visible.` },

  // ══════════════════════════════════════════════════════════
  // HOMEPAGE CATEGORY BROWSER (6)
  // ══════════════════════════════════════════════════════════
  { id: 'cat-countertop', filename: 'category-countertop-filters.webp', category: 'category-browser', pagePath: '/', aspectRatio: '1:1', description: 'Category: Countertop & Pitcher Filters', prompt: `${S.collection} An artful collection of water filter pitchers and a countertop RO system arranged together on a modern kitchen counter, variety of sizes and styles.` },
  { id: 'cat-under-sink', filename: 'category-under-sink-filters.webp', category: 'category-browser', pagePath: '/', aspectRatio: '1:1', description: 'Category: Under-Sink Filters', prompt: `${S.product} An under-sink reverse osmosis filtration system with multiple filter stages visible under a kitchen cabinet, professional installation.` },
  { id: 'cat-refrigerator', filename: 'category-refrigerator-filters.webp', category: 'category-browser', pagePath: '/', aspectRatio: '1:1', description: 'Category: Refrigerator Filters', prompt: `${S.product} A refrigerator water filter being installed into a modern stainless steel refrigerator, hands-free view showing the filter and compartment.` },
  { id: 'cat-replacement', filename: 'category-replacement-filters.webp', category: 'category-browser', pagePath: '/', aspectRatio: '1:1', description: 'Category: Replacement Filters', prompt: `${S.collection} An array of different water pitcher replacement filter cartridges laid out in a neat grid pattern on a dark surface, showing variety in design.` },
  { id: 'cat-survival', filename: 'category-survival-filters.webp', category: 'category-browser', pagePath: '/', aspectRatio: '1:1', description: 'Category: Survival & Portable Filters', prompt: `${S.lifestyle} Portable water filter straws and purification tablets arranged on a topographic trail map next to a compass and hiking gear.` },
  { id: 'cat-whole-house', filename: 'category-whole-house-filters.webp', category: 'category-browser', pagePath: '/', aspectRatio: '1:1', description: 'Category: Whole House Filters', prompt: `${S.product} A whole-house sediment filter housing mounted on a water pipe with white filter cartridge visible through transparent housing.` },

  // ══════════════════════════════════════════════════════════
  // CATEGORY ROUNDUP HEROES (6)
  // ══════════════════════════════════════════════════════════
  { id: 'roundup-countertop', filename: 'best-countertop-filters-hero.webp', category: 'category-roundups', pagePath: '/best-countertop-filters/', aspectRatio: '16:9', description: 'Best Countertop Filters hero', prompt: `${S.collection} A panoramic arrangement of various water filter pitchers and countertop RO systems on a long modern kitchen counter, editorial product spread, warm ambient lighting.` },
  { id: 'roundup-under-sink', filename: 'best-under-sink-filters-hero.webp', category: 'category-roundups', pagePath: '/best-under-sink-filters/', aspectRatio: '16:9', description: 'Best Under-Sink Filters hero', prompt: `${S.product} Multiple under-sink reverse osmosis and filtration systems visible under a spacious kitchen cabinet, showing variety of installation types and sizes.` },
  { id: 'roundup-refrigerator', filename: 'best-refrigerator-filters-hero.webp', category: 'category-roundups', pagePath: '/best-refrigerator-filters/', aspectRatio: '16:9', description: 'Best Refrigerator Filters hero', prompt: `${S.collection} An assortment of different refrigerator water filter cartridges displayed on a clean surface, various shapes and sizes lined up for comparison.` },
  { id: 'roundup-replacement', filename: 'best-replacement-filters-hero.webp', category: 'category-roundups', pagePath: '/best-replacement-filters/', aspectRatio: '16:9', description: 'Best Replacement Filters hero', prompt: `${S.collection} A comprehensive collection of pitcher and dispenser replacement filter cartridges organized by type on a dark surface, variety display.` },
  { id: 'roundup-survival', filename: 'best-survival-filters-hero.webp', category: 'category-roundups', pagePath: '/best-survival-filters/', aspectRatio: '16:9', description: 'Best Survival Filters hero', prompt: `${S.lifestyle} Survival water filtration gear spread out on a wooden surface outdoors — filter straws, purification tablets, water bags, backwash syringes — wilderness setting.` },
  { id: 'roundup-whole-house', filename: 'best-whole-house-filters-hero.webp', category: 'category-roundups', pagePath: '/best-whole-house-filters/', aspectRatio: '16:9', description: 'Best Whole House Filters hero', prompt: `${S.product} Multiple sediment filter cartridges of different types next to whole-house filter housings and pipe fittings, industrial filtration components.` },

  // ══════════════════════════════════════════════════════════
  // COMPARISON HEROES (15)
  // ══════════════════════════════════════════════════════════
  { id: 'vs-bluevua-uv-vs-lite', filename: 'bluevua-ro100ropot-uv-vs-bluevua-ro100ropot-lite-uv-hero.webp', category: 'comparisons', pagePath: '/bluevua-ro100ropot-uv-vs-bluevua-ro100ropot-lite-uv/', aspectRatio: '16:9', description: 'Bluevua UV vs Lite UV', prompt: `${S.comparison} Two countertop reverse osmosis water filter systems placed side by side on a kitchen counter — one larger premium model on the left, one more compact model on the right, both with glass carafes.` },
  { id: 'vs-ispring-vs-waterdrop', filename: 'ispring-rcc7ak-vs-waterdrop-g3p600-hero.webp', category: 'comparisons', pagePath: '/ispring-rcc7ak-vs-waterdrop-g3p600/', aspectRatio: '16:9', description: 'iSpring vs Waterdrop', prompt: `${S.comparison} A traditional tank-based reverse osmosis system on the left and a sleek tankless RO unit on the right, both under a kitchen sink, side-by-side comparison.` },
  { id: 'vs-pentair-h1200-vs-h300', filename: 'pentair-everpure-h1200-vs-pentair-everpure-h300-hero.webp', category: 'comparisons', pagePath: '/pentair-everpure-h1200-vs-pentair-everpure-h300/', aspectRatio: '16:9', description: 'Pentair H-1200 vs H-300', prompt: `${S.comparison} Twin water filter cartridges on the left vs a single cartridge complete system on the right, commercial-grade under-sink filtration comparison.` },
  { id: 'vs-bluevua-vs-ispring', filename: 'bluevua-ro100ropot-uv-vs-ispring-rcc7ak-hero.webp', category: 'comparisons', pagePath: '/bluevua-ro100ropot-uv-vs-ispring-rcc7ak/', aspectRatio: '16:9', description: 'Bluevua UV vs iSpring', prompt: `${S.comparison} A countertop RO system with glass carafe on the left and an under-sink 6-stage RO system on the right, two different approaches to reverse osmosis filtration.` },
  { id: 'vs-ge-xwfe-vs-rpwfe', filename: 'ge-xwfe-vs-ge-rpwfe-hero.webp', category: 'comparisons', pagePath: '/ge-xwfe-vs-ge-rpwfe/', aspectRatio: '16:9', description: 'GE XWFE vs RPWFE', prompt: `${S.comparison} Two different refrigerator water filter cartridges placed side by side on a clean surface, similar size but different connector designs.` },
  { id: 'vs-everydrop-vs-ge', filename: 'everydrop-filter-1-vs-ge-xwfe-hero.webp', category: 'comparisons', pagePath: '/everydrop-filter-1-vs-ge-xwfe/', aspectRatio: '16:9', description: 'everydrop Filter 1 vs GE XWFE', prompt: `${S.comparison} Two competing refrigerator filter cartridges from different manufacturers side by side, one white and one gray, different brand designs.` },
  { id: 'vs-samsung-vs-everydrop', filename: 'samsung-haf-qin-vs-everydrop-filter-a-hero.webp', category: 'comparisons', pagePath: '/samsung-haf-qin-vs-everydrop-filter-a/', aspectRatio: '16:9', description: 'Samsung vs everydrop', prompt: `${S.comparison} Two refrigerator water filters from different brands placed side by side for comparison, different form factors and installation mechanisms.` },
  { id: 'vs-brita-standard-vs-elite', filename: 'brita-standard-vs-brita-elite-hero.webp', category: 'comparisons', pagePath: '/brita-standard-vs-brita-elite/', aspectRatio: '16:9', description: 'Brita Standard vs Elite', prompt: `${S.comparison} A standard pitcher filter cartridge on the left and a premium elite carbon block cartridge on the right, clear size and design difference, water filter upgrade comparison.` },
  { id: 'vs-brita-elite-vs-zerowater', filename: 'brita-elite-vs-zerowater-hero.webp', category: 'comparisons', pagePath: '/brita-elite-vs-zerowater/', aspectRatio: '16:9', description: 'Brita Elite vs ZeroWater', prompt: `${S.comparison} A premium pitcher filter on the left and a 5-stage ion exchange filter on the right, two different pitcher filtration technologies, side by side.` },
  { id: 'vs-brita-vs-pur', filename: 'brita-standard-vs-pur-hero.webp', category: 'comparisons', pagePath: '/brita-standard-vs-pur/', aspectRatio: '16:9', description: 'Brita Standard vs PUR', prompt: `${S.comparison} Two competing pitcher filter cartridges from rival brands side by side on a clean surface, similar size but different designs.` },
  { id: 'vs-zerowater-vs-pur', filename: 'zerowater-vs-pur-hero.webp', category: 'comparisons', pagePath: '/zerowater-vs-pur/', aspectRatio: '16:9', description: 'ZeroWater vs PUR', prompt: `${S.comparison} A 5-stage pitcher filter on the left and a 2-in-1 pitcher filter on the right, different filtration approaches, product comparison.` },
  { id: 'vs-waterdrop-vs-brita-elite', filename: 'waterdrop-plus-vs-brita-elite-hero.webp', category: 'comparisons', pagePath: '/waterdrop-plus-vs-brita-elite/', aspectRatio: '16:9', description: 'Waterdrop Plus vs Brita Elite', prompt: `${S.comparison} Two premium water pitcher filter cartridges side by side, one using activated carbon fiber technology and one using carbon block, different approaches.` },
  { id: 'vs-amazon-vs-brita', filename: 'amazon-basics-vs-brita-standard-hero.webp', category: 'comparisons', pagePath: '/amazon-basics-vs-brita-standard/', aspectRatio: '16:9', description: 'Amazon Basics vs Brita Standard', prompt: `${S.comparison} A budget water pitcher filter on the left and a brand-name pitcher filter on the right, value vs brand comparison, similar cartridge designs.` },
  { id: 'vs-timain-vs-membrane', filename: 'timain-vs-membrane-solutions-straw-hero.webp', category: 'comparisons', pagePath: '/timain-vs-membrane-solutions-straw/', aspectRatio: '16:9', description: 'Timain vs Membrane Solutions', prompt: `${S.comparison} Two different portable water filter straws laid side by side on an outdoor rock surface, hiking gear visible, outdoor adventure comparison.` },
  { id: 'vs-timain-vs-naturenova', filename: 'timain-vs-naturenova-straw-hero.webp', category: 'comparisons', pagePath: '/timain-vs-naturenova-straw/', aspectRatio: '16:9', description: 'Timain vs NatureNova', prompt: `${S.comparison} A simple filter straw on the left and a complete filter straw kit with accessories (water bag, backwash syringe) on the right, minimalist vs full kit comparison.` },

  // ══════════════════════════════════════════════════════════
  // BUYER GUIDE HEROES (8)
  // ══════════════════════════════════════════════════════════
  { id: 'guide-how-to-choose', filename: 'how-to-choose-water-filter-hero.webp', category: 'buyer-guides', pagePath: '/guides/how-to-choose-water-filter/', aspectRatio: '16:9', description: 'How to Choose a Water Filter', prompt: `${S.lifestyle} Several different types of water filters arranged on a kitchen counter — a pitcher, under-sink system, and filter straw — representing the choices a buyer faces, warm kitchen setting.` },
  { id: 'guide-maintenance', filename: 'water-filter-maintenance-hero.webp', category: 'buyer-guides', pagePath: '/guides/water-filter-maintenance/', aspectRatio: '16:9', description: 'Water Filter Maintenance Guide', prompt: `${S.lifestyle} Close-up of hands carefully changing a water filter cartridge in a pitcher, maintenance in progress, clean kitchen environment, focus on the filter replacement process.` },
  { id: 'guide-sizing', filename: 'water-filter-sizing-guide-hero.webp', category: 'buyer-guides', pagePath: '/guides/water-filter-sizing-guide/', aspectRatio: '16:9', description: 'Water Filter Sizing Guide', prompt: `${S.lifestyle} Different sized water filters arranged from small single-serve to large family dispenser on a kitchen counter, family kitchen setting, size comparison visual.` },
  { id: 'guide-under-50', filename: 'best-water-filters-under-50-hero.webp', category: 'buyer-guides', pagePath: '/guides/best-water-filters-under-50/', aspectRatio: '16:9', description: 'Best Water Filters Under $50', prompt: `${S.collection} A selection of affordable water filters — pitchers, filter straws, replacement cartridges — arranged on a surface, budget-friendly options, clean presentation.` },
  { id: 'guide-ro-vs-carbon', filename: 'reverse-osmosis-vs-carbon-filters-hero.webp', category: 'buyer-guides', pagePath: '/guides/reverse-osmosis-vs-carbon-filters/', aspectRatio: '16:9', description: 'RO vs Carbon Filters', prompt: `${S.comparison} A reverse osmosis system on one side and a carbon filter pitcher on the other side, split composition showing two fundamentally different filtration technologies.` },
  { id: 'guide-beginner', filename: 'water-filtration-beginner-guide-hero.webp', category: 'buyer-guides', pagePath: '/guides/water-filtration-beginner-guide/', aspectRatio: '16:9', description: 'Beginner Guide to Water Filtration', prompt: `${S.lifestyle} A crystal clear glass of filtered water on a simple wooden table with natural window light, inviting and approachable, beginner-friendly mood.` },
  { id: 'guide-mistakes', filename: 'water-filter-mistakes-hero.webp', category: 'buyer-guides', pagePath: '/guides/water-filter-mistakes/', aspectRatio: '16:9', description: 'Common Water Filter Mistakes', prompt: `${S.lifestyle} A water filter pitcher with an expired filter cartridge, water dripping, representing a common maintenance mistake, cautionary product shot.` },
  { id: 'guide-cost', filename: 'water-filter-cost-analysis-hero.webp', category: 'buyer-guides', pagePath: '/guides/water-filter-cost-analysis/', aspectRatio: '16:9', description: 'Water Filter Cost Analysis', prompt: `${S.educational} A water filter cartridge next to stacked coins and a small calculator on a clean desk, cost analysis concept, financial comparison visual.` },

  // ══════════════════════════════════════════════════════════
  // ACTIVITY GUIDE HEROES (10)
  // ══════════════════════════════════════════════════════════
  { id: 'activity-camping', filename: 'water-filters-for-camping-hero.webp', category: 'activity-guides', pagePath: '/water-filters-for-camping/', aspectRatio: '16:9', description: 'Water Filters for Camping', prompt: `${S.lifestyle} A portable water filter straw being used at a campsite near a clear stream, camping tent and gear visible in the background, golden hour lighting, wilderness setting.` },
  { id: 'activity-hiking', filename: 'water-filters-for-hiking-hero.webp', category: 'activity-guides', pagePath: '/water-filters-for-hiking/', aspectRatio: '16:9', description: 'Water Filters for Hiking', prompt: `${S.lifestyle} A hiker kneeling by a mountain stream using a portable water filter straw, backpack nearby, alpine scenery with pine trees and mountain peaks, adventure photography.` },
  { id: 'activity-emergencies', filename: 'water-filters-for-emergencies-hero.webp', category: 'activity-guides', pagePath: '/water-filters-for-emergencies/', aspectRatio: '16:9', description: 'Water Filters for Emergencies', prompt: `${S.lifestyle} An emergency preparedness kit spread out on a table with water filtration supplies — filter straws, purification tablets, water containers — alongside a flashlight and first aid kit.` },
  { id: 'activity-well-water', filename: 'water-filters-for-well-water-hero.webp', category: 'activity-guides', pagePath: '/water-filters-for-well-water/', aspectRatio: '16:9', description: 'Water Filters for Well Water', prompt: `${S.lifestyle} A rural well pump house with a whole-house water filtration system installed on the main water line, country property setting, showing the connection between well and filtration.` },
  { id: 'activity-apartments', filename: 'water-filters-for-apartments-hero.webp', category: 'activity-guides', pagePath: '/water-filters-for-apartments/', aspectRatio: '16:9', description: 'Water Filters for Apartments', prompt: `${S.lifestyle} A water filter pitcher on a small apartment kitchen counter next to a window with a city view, compact urban living space, modern apartment aesthetic.` },
  { id: 'activity-rv', filename: 'water-filters-for-rv-hero.webp', category: 'activity-guides', pagePath: '/water-filters-for-rv/', aspectRatio: '16:9', description: 'Water Filters for RV', prompt: `${S.lifestyle} A recreational vehicle at a campground with an inline water filter connected at the water hookup, RV lifestyle setting, outdoor living.` },
  { id: 'activity-baby', filename: 'water-filters-for-baby-hero.webp', category: 'activity-guides', pagePath: '/water-filters-for-baby/', aspectRatio: '16:9', description: 'Water Filters for Baby', prompt: `${S.lifestyle} A parent's hands pouring filtered water from a water filter pitcher into a baby bottle in a bright clean nursery kitchen, soft natural lighting, safety and care mood.` },
  { id: 'activity-travel', filename: 'water-filters-for-travel-hero.webp', category: 'activity-guides', pagePath: '/water-filters-for-travel/', aspectRatio: '16:9', description: 'Water Filters for Travel', prompt: `${S.lifestyle} A travel water bottle with built-in filter next to a passport, boarding pass, and travel accessories on a surface, travel preparation scene, wanderlust mood.` },
  { id: 'activity-off-grid', filename: 'water-filters-for-off-grid-hero.webp', category: 'activity-guides', pagePath: '/water-filters-for-off-grid/', aspectRatio: '16:9', description: 'Water Filters for Off-Grid', prompt: `${S.lifestyle} A rustic off-grid cabin with a water filtration setup — gravity filter on the counter and sediment filter on the pipe — homestead self-sufficiency setting, natural surroundings.` },
  { id: 'activity-hard-water', filename: 'water-filters-for-hard-water-hero.webp', category: 'activity-guides', pagePath: '/water-filters-for-hard-water/', aspectRatio: '16:9', description: 'Water Filters for Hard Water', prompt: `${S.educational} A glass of water showing visible mineral deposits and calcium buildup on the rim, next to a TDS meter and a glass of crystal clear filtered water, before-and-after contrast.` },

  // ══════════════════════════════════════════════════════════
  // KNOWLEDGE BASE HEROES (8)
  // ══════════════════════════════════════════════════════════
  { id: 'kb-reverse-osmosis', filename: 'what-is-reverse-osmosis-hero.webp', category: 'knowledge-base', pagePath: '/what-is-reverse-osmosis/', aspectRatio: '16:9', description: 'What Is Reverse Osmosis?', prompt: `${S.educational} Close-up macro shot of a reverse osmosis membrane with water droplets forming on its surface, scientific detail, laboratory aesthetic, shallow depth of field.` },
  { id: 'kb-nsf', filename: 'nsf-certifications-explained-hero.webp', category: 'knowledge-base', pagePath: '/nsf-certifications-explained/', aspectRatio: '16:9', description: 'NSF Certifications Explained', prompt: `${S.educational} A water quality testing laboratory with test equipment, beakers of water samples, and certification documents on a clean lab bench, professional scientific setting.` },
  { id: 'kb-tds', filename: 'understanding-tds-hero.webp', category: 'knowledge-base', pagePath: '/understanding-tds/', aspectRatio: '16:9', description: 'Understanding TDS', prompt: `${S.educational} A digital TDS meter submerged in a glass of water showing a reading on its display, clean laboratory setting, scientific measurement concept.` },
  { id: 'kb-pfas', filename: 'pfas-in-drinking-water-hero.webp', category: 'knowledge-base', pagePath: '/pfas-in-drinking-water/', aspectRatio: '16:9', description: 'PFAS in Drinking Water', prompt: `${S.educational} Water samples being analyzed in a modern testing laboratory, scientific glassware with water samples, pipettes, and analytical equipment, serious research atmosphere.` },
  { id: 'kb-lead', filename: 'lead-in-drinking-water-hero.webp', category: 'knowledge-base', pagePath: '/lead-in-drinking-water/', aspectRatio: '16:9', description: 'Lead in Drinking Water', prompt: `${S.educational} A cross-section of an old corroded water pipe showing mineral buildup and corrosion, next to a modern water testing kit, infrastructure decay concept.` },
  { id: 'kb-filter-types', filename: 'water-filter-types-explained-hero.webp', category: 'knowledge-base', pagePath: '/water-filter-types-explained/', aspectRatio: '16:9', description: 'Water Filter Types Explained', prompt: `${S.collection} An array of different water filtration technologies and components laid out on a surface — carbon block, RO membrane, ceramic filter, UV lamp, ion exchange beads — technology showcase.` },
  { id: 'kb-tap-water', filename: 'is-tap-water-safe-hero.webp', category: 'knowledge-base', pagePath: '/is-tap-water-safe/', aspectRatio: '16:9', description: 'Is Tap Water Safe?', prompt: `${S.lifestyle} A glass of water being filled from a modern kitchen faucet, city skyline visible through the window, everyday moment of questioning water quality.` },
  { id: 'kb-history', filename: 'history-of-water-filtration-hero.webp', category: 'knowledge-base', pagePath: '/history-of-water-filtration/', aspectRatio: '16:9', description: 'History of Water Filtration', prompt: `${S.educational} A vintage brass and glass water purification apparatus next to a modern water filter system, historical progression of filtration technology, museum display aesthetic.` },

  // ══════════════════════════════════════════════════════════
  // ABOUT PAGE (1)
  // ══════════════════════════════════════════════════════════
  { id: 'about', filename: 'about-hero.webp', category: 'about', pagePath: '/about/', aspectRatio: '16:9', description: 'About Page hero', prompt: `${S.lifestyle} A water filter testing workbench with various filters being examined, TDS meters, water samples in glasses, notebooks with data, hands-on review and testing setup, authentic workspace.` },
];

// Category metadata for UI grouping
const CATEGORIES = [
  { id: 'category-roundups', name: 'Category Roundup Heroes', icon: '📊' },
  { id: 'comparisons', name: 'Comparison Page Heroes', icon: '⚖️' },
  { id: 'buyer-guides', name: 'Buyer Guide Heroes', icon: '📖' },
  { id: 'activity-guides', name: 'Activity Guide Heroes', icon: '🏕️' },
  { id: 'knowledge-base', name: 'Knowledge Base Heroes', icon: '🔬' },
  { id: 'featured-picks', name: 'Homepage Featured Picks', icon: '⭐' },
  { id: 'category-browser', name: 'Homepage Category Browser', icon: '🗂️' },
  { id: 'about', name: 'About Page', icon: '👋' },
  { id: 'product-reviews', name: 'Product Review Heroes (existing)', icon: '📸' },
];

// ─── Gemini API ───────────────────────────────────────────
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

async function generateWithGeminiFlash(prompt, aspectRatio, apiKey) {
  const model = 'gemini-2.5-flash-image';
  const url = `${API_BASE}/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Generate a high-quality photograph. ${prompt}` }] }],
      generationConfig: {
        responseModalities: ['IMAGE', 'TEXT'],
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));

  if (!imagePart) {
    const textPart = parts.find(p => p.text);
    throw new Error(`No image in response. Text: ${textPart?.text || 'empty response'}`);
  }

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType,
  };
}

async function generateWithImagen(prompt, aspectRatio, apiKey) {
  const model = 'imagen-3.0-generate-002';
  const url = `${API_BASE}/${model}:predict?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: aspectRatio || '1:1',
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Imagen API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const prediction = data.predictions?.[0];

  if (!prediction?.bytesBase64Encoded) {
    throw new Error('No image in Imagen response');
  }

  return {
    base64: prediction.bytesBase64Encoded,
    mimeType: prediction.mimeType || 'image/png',
  };
}

async function generateImage(prompt, aspectRatio, apiKey, model = 'gemini-2.5-flash-image') {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (model === 'imagen-3.0-generate-002') {
        return await generateWithImagen(prompt, aspectRatio, apiKey);
      }
      return await generateWithGeminiFlash(prompt, aspectRatio, apiKey);
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt + 1) * 1000;
        console.log(`  Retry ${attempt + 1}/${maxRetries} in ${delay / 1000}s...`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

// ─── Image Processing ─────────────────────────────────────
async function saveImage(base64Data, filename) {
  await mkdir(ASSETS_DIR, { recursive: true });
  const buffer = Buffer.from(base64Data, 'base64');
  const baseName = filename.replace('.webp', '');

  if (sharp) {
    // Full size
    const fullImg = sharp(buffer).webp({ quality: 82 });
    await fullImg.toFile(join(ASSETS_DIR, `${baseName}.webp`));

    // Medium (800px wide)
    const medImg = sharp(buffer).resize(800, null, { withoutEnlargement: true }).webp({ quality: 78 });
    await medImg.toFile(join(ASSETS_DIR, `${baseName}-medium.webp`));

    // Small (400px wide)
    const smImg = sharp(buffer).resize(400, null, { withoutEnlargement: true }).webp({ quality: 72 });
    await smImg.toFile(join(ASSETS_DIR, `${baseName}-small.webp`));

    return { format: 'webp', variants: 3 };
  } else {
    // Fallback: save raw PNG
    const pngName = `${baseName}.png`;
    await writeFile(join(ASSETS_DIR, pngName), buffer);
    return { format: 'png', variants: 1 };
  }
}

async function imageExists(filename) {
  try {
    await access(join(ASSETS_DIR, filename));
    return true;
  } catch {
    return false;
  }
}

// ─── HTTP Helpers ─────────────────────────────────────────
function json(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString());
}

// ─── Admin UI HTML ────────────────────────────────────────
function getAdminHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>OffGrid Filters — Image Generator</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0b0e14;--card:#121922;--border:#272f3c;--primary:#2490cc;--primary-dim:#1a6d99;
--accent:#f09520;--text:#f0f2f4;--muted:#858d99;--success:#22c55e;--error:#ef4444;--radius:10px}
body{font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;background:var(--bg);color:var(--text);line-height:1.5;min-height:100vh}
a{color:var(--primary);text-decoration:none}a:hover{text-decoration:underline}

header{position:sticky;top:0;z-index:50;background:rgba(11,14,20,.85);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:1rem 1.5rem}
.header-inner{max-width:1400px;margin:0 auto;display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
.header-inner h1{font-size:1.125rem;font-weight:700;white-space:nowrap}
.header-inner h1 span{color:var(--primary)}
.controls{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;margin-left:auto}
.controls input,.controls select{background:var(--card);color:var(--text);border:1px solid var(--border);padding:.4rem .6rem;border-radius:var(--radius);font-size:.8rem;outline:none}
.controls input:focus,.controls select:focus{border-color:var(--primary)}
.controls input[type=password]{width:240px}
.btn{padding:.4rem .8rem;border:none;border-radius:var(--radius);font-size:.8rem;font-weight:600;cursor:pointer;transition:all .2s}
.btn-primary{background:var(--primary);color:#fff}.btn-primary:hover{background:var(--primary-dim)}
.btn-accent{background:var(--accent);color:#fff}.btn-accent:hover{opacity:.9}
.btn-success{background:var(--success);color:#fff}.btn-success:hover{opacity:.9}
.btn-ghost{background:transparent;color:var(--muted);border:1px solid var(--border)}.btn-ghost:hover{color:var(--text);border-color:var(--muted)}
.btn-danger{background:var(--error);color:#fff}.btn-danger:hover{opacity:.9}
.btn:disabled{opacity:.4;cursor:not-allowed}

.stats{max-width:1400px;margin:1rem auto;padding:0 1.5rem;display:flex;gap:1.5rem;flex-wrap:wrap;align-items:center}
.stat{display:flex;align-items:center;gap:.4rem;font-size:.8rem;color:var(--muted)}
.stat b{color:var(--text);font-size:1rem}
.progress-bar{flex:1;min-width:200px;height:6px;background:var(--card);border-radius:3px;overflow:hidden}
.progress-fill{height:100%;background:linear-gradient(90deg,var(--primary),var(--accent));transition:width .3s;border-radius:3px}

main{max-width:1400px;margin:0 auto;padding:1.5rem}

.category-section{margin-bottom:2rem}
.cat-header{display:flex;align-items:center;gap:.5rem;padding:.75rem 1rem;background:var(--card);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;user-select:none;margin-bottom:.75rem}
.cat-header:hover{border-color:var(--primary)}
.cat-header .icon{font-size:1.25rem}
.cat-header h2{font-size:.95rem;font-weight:600;flex:1}
.cat-header .count{font-size:.75rem;color:var(--muted);padding:.2rem .5rem;background:var(--bg);border-radius:99px}
.cat-header .arrow{color:var(--muted);transition:transform .2s;font-size:.75rem}
.cat-header.collapsed .arrow{transform:rotate(-90deg)}
.cat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1rem}
.cat-grid.hidden{display:none}

.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;transition:border-color .2s}
.card:hover{border-color:hsl(205 40% 30%)}
.card-preview{aspect-ratio:16/9;background:var(--bg);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}
.card-preview.square{aspect-ratio:1/1}
.card-preview img{width:100%;height:100%;object-fit:cover}
.card-preview .placeholder{color:var(--muted);font-size:.75rem;text-align:center;padding:1rem}
.card-preview .status-badge{position:absolute;top:.5rem;right:.5rem;padding:.2rem .5rem;border-radius:99px;font-size:.65rem;font-weight:600}
.badge-exists{background:var(--success);color:#fff}
.badge-generating{background:var(--accent);color:#fff;animation:pulse 1.5s infinite}
.badge-generated{background:var(--primary);color:#fff}
.badge-saved{background:var(--success);color:#fff}
.badge-error{background:var(--error);color:#fff}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}

.card-body{padding:.75rem}
.card-filename{font-size:.7rem;color:var(--muted);font-family:monospace;margin-bottom:.25rem;word-break:break-all}
.card-desc{font-size:.8rem;font-weight:600;margin-bottom:.25rem}
.card-page{font-size:.7rem;color:var(--primary);margin-bottom:.5rem}
.card-prompt{font-size:.7rem;color:var(--muted);line-height:1.4;max-height:2.8em;overflow:hidden;transition:max-height .3s;cursor:pointer;margin-bottom:.5rem}
.card-prompt.expanded{max-height:200px}
.card-actions{display:flex;gap:.4rem;flex-wrap:wrap}
.card-actions .btn{font-size:.7rem;padding:.3rem .6rem}

.toast-container{position:fixed;bottom:1.5rem;right:1.5rem;z-index:100;display:flex;flex-direction:column;gap:.5rem}
.toast{padding:.6rem 1rem;background:var(--card);border:1px solid var(--border);border-radius:var(--radius);font-size:.8rem;animation:slide-in .3s;max-width:360px}
.toast-success{border-color:var(--success)}
.toast-error{border-color:var(--error)}
@keyframes slide-in{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}

.loading-spinner{width:24px;height:24px;border:3px solid var(--border);border-top-color:var(--primary);border-radius:50%;animation:spin .8s linear infinite;margin:auto}
@keyframes spin{to{transform:rotate(360deg)}}

.batch-status{padding:.75rem 1rem;background:var(--card);border:1px solid var(--border);border-radius:var(--radius);margin-bottom:1rem;font-size:.85rem;display:none}
.batch-status.active{display:flex;align-items:center;gap:.75rem}
.batch-status .batch-text{flex:1}
.delay-select{width:80px}
</style>
</head>
<body>

<header>
<div class="header-inner">
  <h1>🔧 <span>OffGrid Filters</span> — Image Generator</h1>
  <div class="controls">
    <input type="password" id="apiKey" placeholder="Gemini API Key" autocomplete="off">
    <select id="model">
      <option value="gemini-2.5-flash-image">Gemini 2.5 Flash Image</option>
      <option value="imagen-3.0-generate-002">Imagen 3</option>
    </select>
    <label style="font-size:.75rem;color:var(--muted)">Delay:
      <select id="delay" class="delay-select">
        <option value="3000">3s</option>
        <option value="6000" selected>6s</option>
        <option value="10000">10s</option>
        <option value="15000">15s</option>
      </select>
    </label>
    <button class="btn btn-accent" id="generateAllBtn" onclick="generateAll()">▶ Generate All Missing</button>
    <button class="btn btn-danger" id="stopBtn" style="display:none" onclick="stopBatch()">⏹ Stop</button>
  </div>
</div>
</header>

<div class="stats" id="statsBar">
  <div class="stat"><b id="statTotal">0</b>/87 total</div>
  <div class="stat"><b id="statExists">0</b> exist</div>
  <div class="stat"><b id="statGenerated">0</b> generated</div>
  <div class="stat"><b id="statMissing">0</b> missing</div>
  <div class="progress-bar"><div class="progress-fill" id="progressFill" style="width:0%"></div></div>
</div>

<div class="batch-status" id="batchStatus">
  <div class="loading-spinner"></div>
  <div class="batch-text">
    <span id="batchText">Generating...</span>
  </div>
  <button class="btn btn-danger btn-sm" onclick="stopBatch()">Stop</button>
</div>

<main id="app">
  <div style="text-align:center;padding:4rem"><div class="loading-spinner"></div><p style="margin-top:1rem;color:var(--muted)">Loading prompts...</p></div>
</main>

<div class="toast-container" id="toasts"></div>

<script>
const API = '';
let state = {
  prompts: [],
  generated: {},
  statuses: {},
  batchRunning: false,
};

// Persist API key and model
const apiKeyEl = document.getElementById('apiKey');
const modelEl = document.getElementById('model');
const delayEl = document.getElementById('delay');
apiKeyEl.value = localStorage.getItem('gemini_api_key') || '';
modelEl.value = localStorage.getItem('gemini_model') || 'gemini-2.5-flash-image';
apiKeyEl.addEventListener('input', () => localStorage.setItem('gemini_api_key', apiKeyEl.value));
modelEl.addEventListener('change', () => localStorage.setItem('gemini_model', modelEl.value));

function toast(msg, type = 'info') {
  const el = document.createElement('div');
  el.className = 'toast toast-' + type;
  el.textContent = msg;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

function getApiKey() {
  const key = apiKeyEl.value.trim();
  if (!key) { toast('Enter your Gemini API key first', 'error'); return null; }
  return key;
}

async function loadPrompts() {
  try {
    const res = await fetch(API + '/api/prompts');
    const data = await res.json();
    state.prompts = data.prompts;
    data.prompts.forEach(p => { state.statuses[p.id] = p.exists ? 'exists' : 'missing'; });
    renderUI();
    updateStats();
  } catch (e) { toast('Failed to load prompts: ' + e.message, 'error'); }
}

function updateStats() {
  const total = state.prompts.length;
  let exists = 0, generated = 0, missing = 0;
  state.prompts.forEach(p => {
    const s = state.statuses[p.id];
    if (s === 'exists' || s === 'saved') exists++;
    else if (s === 'generated') generated++;
    else missing++;
  });
  document.getElementById('statTotal').textContent = exists + generated;
  document.getElementById('statExists').textContent = exists;
  document.getElementById('statGenerated').textContent = generated;
  document.getElementById('statMissing').textContent = missing;
  document.getElementById('progressFill').style.width = ((exists + generated) / total * 100) + '%';
}

function renderUI() {
  const categories = ${JSON.stringify(CATEGORIES)};
  const app = document.getElementById('app');
  let html = '';
  for (const cat of categories) {
    const prompts = state.prompts.filter(p => p.category === cat.id);
    if (!prompts.length) continue;
    const doneCount = prompts.filter(p => ['exists','saved','generated'].includes(state.statuses[p.id])).length;
    const isProductReviews = cat.id === 'product-reviews';
    html += '<div class="category-section">';
    html += '<div class="cat-header' + (isProductReviews ? ' collapsed' : '') + '" onclick="toggleSection(this)">';
    html += '<span class="icon">' + cat.icon + '</span>';
    html += '<h2>' + cat.name + '</h2>';
    html += '<span class="count">' + doneCount + '/' + prompts.length + '</span>';
    html += '<span class="arrow">▼</span>';
    html += '</div>';
    html += '<div class="cat-grid' + (isProductReviews ? ' hidden' : '') + '">';
    for (const p of prompts) {
      const status = state.statuses[p.id] || 'missing';
      const isSquare = p.aspectRatio === '1:1';
      html += '<div class="card" id="card-' + p.id + '">';
      html += '<div class="card-preview' + (isSquare ? ' square' : '') + '" id="preview-' + p.id + '">';
      if (state.generated[p.id]) {
        html += '<img src="data:image/png;base64,' + state.generated[p.id] + '" alt="' + p.description + '">';
      } else if (status === 'exists' || status === 'saved') {
        html += '<img src="/assets/' + p.filename + '?t=' + Date.now() + '" alt="' + p.description + '" onerror="this.parentElement.innerHTML=\\'<div class=placeholder>Image on disk</div>\\'">';
      } else {
        html += '<div class="placeholder">📷 ' + p.description + '</div>';
      }
      const badgeClass = status === 'exists' ? 'badge-exists' : status === 'generating' ? 'badge-generating' : status === 'generated' ? 'badge-generated' : status === 'saved' ? 'badge-saved' : status === 'error' ? 'badge-error' : '';
      const badgeText = status === 'exists' ? '✓ Exists' : status === 'generating' ? '⏳ Generating' : status === 'generated' ? '✓ Generated' : status === 'saved' ? '✓ Saved' : status === 'error' ? '✗ Error' : '';
      if (badgeClass) html += '<span class="status-badge ' + badgeClass + '">' + badgeText + '</span>';
      html += '</div>';
      html += '<div class="card-body">';
      html += '<div class="card-filename">' + p.filename + '</div>';
      html += '<div class="card-desc">' + p.description + '</div>';
      html += '<div class="card-page"><a href="http://localhost:4321' + p.pagePath + '" target="_blank">' + p.pagePath + '</a></div>';
      html += '<div class="card-prompt" onclick="this.classList.toggle(\\'expanded\\')">' + escHtml(p.prompt) + '</div>';
      html += '<div class="card-actions">';
      if (status === 'missing' || status === 'error') {
        html += '<button class="btn btn-accent" onclick="genOne(\\'' + p.id + '\\')">Generate</button>';
      } else if (status === 'generated') {
        html += '<button class="btn btn-success" onclick="saveOne(\\'' + p.id + '\\')">💾 Save</button>';
        html += '<button class="btn btn-ghost" onclick="genOne(\\'' + p.id + '\\')">Regen</button>';
      } else if (status === 'exists' || status === 'saved') {
        html += '<button class="btn btn-ghost" onclick="genOne(\\'' + p.id + '\\')">Regenerate</button>';
      }
      html += '</div></div></div>';
    }
    html += '</div></div>';
  }
  app.innerHTML = html;
}

function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function toggleSection(header) {
  header.classList.toggle('collapsed');
  header.nextElementSibling.classList.toggle('hidden');
}

async function genOne(id) {
  const apiKey = getApiKey();
  if (!apiKey) return;
  const prompt = state.prompts.find(p => p.id === id);
  if (!prompt) return;
  state.statuses[id] = 'generating';
  renderUI(); updateStats();
  try {
    const res = await fetch(API + '/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptId: id, prompt: prompt.prompt, aspectRatio: prompt.aspectRatio, apiKey, model: modelEl.value }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Generation failed');
    state.generated[id] = data.base64;
    state.statuses[id] = 'generated';
    toast('Generated: ' + prompt.description, 'success');
  } catch (e) {
    state.statuses[id] = 'error';
    toast('Error: ' + e.message, 'error');
  }
  renderUI(); updateStats();
}

async function saveOne(id) {
  const prompt = state.prompts.find(p => p.id === id);
  const base64 = state.generated[id];
  if (!prompt || !base64) return;
  try {
    const res = await fetch(API + '/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: prompt.filename, base64 }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Save failed');
    state.statuses[id] = 'saved';
    toast('Saved: ' + prompt.filename + ' (' + data.variants + ' variants)', 'success');
  } catch (e) {
    toast('Save error: ' + e.message, 'error');
  }
  renderUI(); updateStats();
}

async function generateAll() {
  const apiKey = getApiKey();
  if (!apiKey) return;
  const missing = state.prompts.filter(p => state.statuses[p.id] === 'missing' || state.statuses[p.id] === 'error');
  if (!missing.length) { toast('All images already generated!', 'success'); return; }

  state.batchRunning = true;
  document.getElementById('generateAllBtn').style.display = 'none';
  document.getElementById('stopBtn').style.display = '';
  document.getElementById('batchStatus').classList.add('active');

  const delay = parseInt(delayEl.value) || 6000;
  let completed = 0;

  for (const prompt of missing) {
    if (!state.batchRunning) break;
    document.getElementById('batchText').textContent =
      'Generating ' + (completed + 1) + '/' + missing.length + ': ' + prompt.description;
    state.statuses[prompt.id] = 'generating';
    renderUI(); updateStats();

    try {
      const res = await fetch(API + '/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId: prompt.id, prompt: prompt.prompt, aspectRatio: prompt.aspectRatio, apiKey, model: modelEl.value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      state.generated[prompt.id] = data.base64;

      // Auto-save in batch mode
      const saveRes = await fetch(API + '/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: prompt.filename, base64: data.base64 }),
      });
      if (saveRes.ok) {
        state.statuses[prompt.id] = 'saved';
        toast('Saved: ' + prompt.filename, 'success');
      } else {
        state.statuses[prompt.id] = 'generated';
      }
    } catch (e) {
      state.statuses[prompt.id] = 'error';
      toast('Error on ' + prompt.description + ': ' + e.message, 'error');
    }

    completed++;
    renderUI(); updateStats();

    if (state.batchRunning && completed < missing.length) {
      await new Promise(r => setTimeout(r, delay));
    }
  }

  state.batchRunning = false;
  document.getElementById('generateAllBtn').style.display = '';
  document.getElementById('stopBtn').style.display = 'none';
  document.getElementById('batchStatus').classList.remove('active');
  toast('Batch complete! ' + completed + ' images processed.', 'success');
}

function stopBatch() {
  state.batchRunning = false;
  toast('Batch stopped.', 'info');
}

// Serve existing images via proxy (for preview)
loadPrompts();
</script>
</body>
</html>`;
}

// ─── HTTP Server ──────────────────────────────────────────
function startServer() {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const path = url.pathname;

    // CORS preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      return res.end();
    }

    try {
      // Admin UI
      if (path === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(getAdminHTML());
      }

      // Serve images from public/assets for preview
      if (path.startsWith('/assets/') && req.method === 'GET') {
        const filePath = join(ROOT, 'public', path);
        try {
          const data = await readFile(filePath);
          const ext = path.split('.').pop();
          const mimeTypes = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg' };
          res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
          return res.end(data);
        } catch {
          res.writeHead(404);
          return res.end('Not found');
        }
      }

      // API: Get all prompts with status
      if (path === '/api/prompts' && req.method === 'GET') {
        const prompts = await Promise.all(
          IMAGE_PROMPTS.map(async (p) => ({
            ...p,
            exists: await imageExists(p.filename),
          }))
        );
        return json(res, 200, { prompts });
      }

      // API: Generate an image
      if (path === '/api/generate' && req.method === 'POST') {
        const body = await readBody(req);
        const { prompt, aspectRatio, apiKey, model } = body;
        if (!apiKey) return json(res, 400, { error: 'API key required' });
        if (!prompt) return json(res, 400, { error: 'Prompt required' });

        console.log(`  Generating: ${body.promptId || 'unknown'}...`);
        const result = await generateImage(prompt, aspectRatio, apiKey, model);
        console.log(`  ✓ Generated (${result.mimeType})`);
        return json(res, 200, { base64: result.base64, mimeType: result.mimeType });
      }

      // API: Save a generated image
      if (path === '/api/save' && req.method === 'POST') {
        const body = await readBody(req);
        const { filename, base64 } = body;
        if (!filename || !base64) return json(res, 400, { error: 'Filename and base64 data required' });

        console.log(`  Saving: ${filename}...`);
        const result = await saveImage(base64, filename);
        console.log(`  ✓ Saved (${result.format}, ${result.variants} variant${result.variants > 1 ? 's' : ''})`);
        return json(res, 200, { success: true, ...result });
      }

      res.writeHead(404);
      res.end('Not found');
    } catch (err) {
      console.error('Server error:', err);
      json(res, 500, { error: err.message });
    }
  });

  server.listen(PORT, () => {
    console.log('');
    console.log('  ╔══════════════════════════════════════════════╗');
    console.log('  ║  OffGrid Filters — Image Generator Admin     ║');
    console.log(`  ║  http://localhost:${PORT}/                       ║`);
    console.log('  ╚══════════════════════════════════════════════╝');
    console.log('');
    console.log(`  ${IMAGE_PROMPTS.length} image prompts loaded`);
    console.log(`  Images save to: public/assets/`);
    console.log(`  Sharp: ${sharp ? '✓ WebP conversion enabled' : '✗ Not installed (PNG fallback)'}`);
    console.log('');
  });
}

// ─── CLI Auto Mode ────────────────────────────────────────
async function autoMode() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('✗ GEMINI_API_KEY not set. Add it to .env or set as environment variable.');
    process.exit(1);
  }

  const model = process.argv.includes('--imagen') ? 'imagen-3.0-generate-002' : 'gemini-2.5-flash-image';
  const delay = parseInt(process.argv.find(a => a.startsWith('--delay='))?.split('=')[1] || '6000');

  console.log('');
  console.log('  OffGrid Filters — Auto Image Generation');
  console.log(`  Model: ${model}`);
  console.log(`  Delay: ${delay / 1000}s between requests`);
  console.log(`  Sharp: ${sharp ? '✓ WebP' : '✗ PNG fallback'}`);
  console.log('');

  const missing = [];
  for (const p of IMAGE_PROMPTS) {
    if (p.category === 'product-reviews') continue; // Skip existing product photos
    const exists = await imageExists(p.filename);
    if (!exists) missing.push(p);
  }

  console.log(`  ${missing.length} images to generate (${IMAGE_PROMPTS.length - 29 - missing.length} already exist)`);
  console.log('');

  let success = 0;
  let errors = 0;

  for (let i = 0; i < missing.length; i++) {
    const p = missing[i];
    process.stdout.write(`  [${i + 1}/${missing.length}] ${p.filename}... `);

    try {
      const result = await generateImage(p.prompt, p.aspectRatio, apiKey, model);
      const saved = await saveImage(result.base64, p.filename);
      console.log(`✓ (${saved.format}, ${saved.variants} variants)`);
      success++;
    } catch (err) {
      console.log(`✗ ${err.message}`);
      errors++;
    }

    if (i < missing.length - 1) {
      await new Promise(r => setTimeout(r, delay));
    }
  }

  console.log('');
  console.log(`  Done! ${success} generated, ${errors} errors, ${IMAGE_PROMPTS.length - 29 - missing.length} already existed.`);
  console.log('');
}

// ─── Main ─────────────────────────────────────────────────
await loadEnv();

if (process.argv.includes('--auto')) {
  await autoMode();
} else {
  startServer();
}
