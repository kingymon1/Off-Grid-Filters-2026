#!/usr/bin/env node

// ============================================================
// generate-product-links.mjs — Auto-generate product-links.md
// ============================================================
// Reads product catalog and categories from config.ts, generates
// research/product-links.md with Amazon links and image filenames.
// Keeps the reference sheet in sync with the single source of truth.
//
// Usage:
//   node scripts/generate-product-links.mjs          # write file
//   node scripts/generate-product-links.mjs --dry-run # preview only
// ============================================================

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CONFIG_PATH = resolve(ROOT, 'src/lib/config.ts');
const OUTPUT_PATH = resolve(ROOT, 'research/product-links.md');
const ASSETS_DIR = resolve(ROOT, 'public/assets');

const dryRun = process.argv.includes('--dry-run');

// ── Parse config.ts ─────────────────────────────────────────

const source = readFileSync(CONFIG_PATH, 'utf-8');

/**
 * Extract categories array (ordered) from config.ts
 * Returns: [{ name, slug }]
 */
function extractCategories(src) {
  const arrayMatch = src.match(/export const categories:\s*Category\[\]\s*=\s*\[([\s\S]*?)\];\s*\n/);
  if (!arrayMatch) {
    console.error('Could not find categories array in config.ts');
    process.exit(1);
  }

  const categories = [];
  const blockRegex = /\{\s*\n([\s\S]*?)\}/g;
  let match;

  while ((match = blockRegex.exec(arrayMatch[1])) !== null) {
    const block = match[1];
    const name = block.match(/name:\s*'([^']+)'/)?.[1];
    const slug = block.match(/slug:\s*'([^']+)'/)?.[1];
    if (name && slug) {
      categories.push({ name, slug });
    }
  }

  return categories;
}

/**
 * Extract products array from config.ts
 * Returns: [{ name, slug, asin, category }]
 */
function extractProducts(src) {
  // Find the products array — ends at the next `export const` or `];` followed by blank line + export
  const startMatch = src.match(/export const products:\s*Product\[\]\s*=\s*\[/);
  if (!startMatch) {
    console.error('Could not find products array in config.ts');
    process.exit(1);
  }

  const startIdx = startMatch.index + startMatch[0].length;

  // Find matching closing bracket by counting brackets
  let depth = 1;
  let i = startIdx;
  while (i < src.length && depth > 0) {
    if (src[i] === '[') depth++;
    if (src[i] === ']') depth--;
    i++;
  }
  const productsBlock = src.slice(startIdx, i - 1);

  const products = [];
  // Match each product object block
  const objRegex = /\{\s*\n([\s\S]*?)\n\s*\}/g;
  let match;

  while ((match = objRegex.exec(productsBlock)) !== null) {
    const block = match[1];
    const name = block.match(/^\s*name:\s*'([^']+)'/m)?.[1];
    const slug = block.match(/^\s*slug:\s*'([^']+)'/m)?.[1];
    const asin = block.match(/^\s*asin:\s*'([^']+)'/m)?.[1];
    const category = block.match(/^\s*category:\s*'([^']+)'/m)?.[1];

    if (name && slug && asin && category) {
      products.push({ name, slug, asin, category });
    }
  }

  return products;
}

// ── Build output ────────────────────────────────────────────

const categories = extractCategories(source);
const products = extractProducts(source);

// Group products by category slug, preserving config order
const productsByCategory = new Map();
for (const cat of categories) {
  productsByCategory.set(cat.slug, []);
}
for (const product of products) {
  const list = productsByCategory.get(product.category);
  if (list) {
    list.push(product);
  }
}

// ── Check image status ──────────────────────────────────────

function hasImage(slug) {
  return existsSync(resolve(ASSETS_DIR, `${slug}-hero.webp`));
}

let totalWithImages = 0;
for (const p of products) {
  if (hasImage(p.slug)) totalWithImages++;
}

// Build markdown
const lines = [
  '# Product Links — Amazon Listings',
  '',
  '> **Auto-generated from `src/lib/config.ts`** — do not edit manually.',
  '> Run `npm run product-links` to regenerate after adding products.',
  '>',
  '> Quick reference for sourcing product images. Save the main product image',
  '> from each listing, then run through the conversion script:',
  '> ```bash',
  '> node scripts/convert-to-webp.mjs path/to/image.png',
  '> ```',
  '',
  `**Image status: ${totalWithImages} of ${products.length} products have images** (${products.length - totalWithImages} missing)`,
  '',
  '| Status | Meaning |',
  '|--------|---------|',
  '| Y | Image exists in `public/assets/` |',
  '| - | Image missing — needs download |',
  '',
  '---',
];

for (const cat of categories) {
  const catProducts = productsByCategory.get(cat.slug) || [];
  if (catProducts.length === 0) continue;

  const catWithImages = catProducts.filter(p => hasImage(p.slug)).length;

  lines.push('');
  lines.push(`## ${cat.name} (${catWithImages}/${catProducts.length} images)`);
  lines.push('');
  lines.push('| Status | Product | ASIN | Amazon Link | Image Filename |');
  lines.push('|---|---|---|---|---|');

  for (const p of catProducts) {
    const status = hasImage(p.slug) ? 'Y' : '-';
    lines.push(`| ${status} | ${p.name} | ${p.asin} | https://www.amazon.com/dp/${p.asin} | \`${p.slug}-hero.webp\` |`);
  }
}

lines.push('');
lines.push('---');
lines.push('');
lines.push('## Workflow');
lines.push('');
lines.push('1. Click the Amazon link for each product (focus on rows marked `-`)');
lines.push('2. Save the main product image (right-click → Save Image)');
lines.push('3. Rename to match the **Image Filename** column (use `.jpeg` or `.png` extension for the source)');
lines.push('4. Place source files in `public/assets/images/`');
lines.push('5. Run the conversion script (auto-scans `public/assets/images/`):');
lines.push('   ```bash');
lines.push('   node scripts/convert-to-webp.mjs');
lines.push('   ```');
lines.push('6. Update status markers:');
lines.push('   ```bash');
lines.push('   npm run product-links');
lines.push('   ```');
lines.push('7. Rebuild and verify: `npm run build`');
lines.push('');
lines.push('See **IMAGE-GUIDE.md → Quick Start** for the full step-by-step.');
lines.push('');
lines.push('## Notes');
lines.push('');
lines.push(`- All ${products.length} products listed above`);
lines.push('- Amazon links are **without** affiliate tag (these are for your reference, not for the site)');
lines.push('- The site generates affiliate links dynamically using the tag from `config.ts`');
lines.push('- For products with multiple images on Amazon, grab the **first/main** image (usually front-facing product shot on white)');
lines.push('');

const output = lines.join('\n');

// ── Write or preview ────────────────────────────────────────

console.log(`\n📋 Product Links Summary:`);
console.log(`   Categories:  ${categories.length}`);
console.log(`   Products:    ${products.length}`);
console.log(`   With images: ${totalWithImages}/${products.length} (${products.length - totalWithImages} missing)`);
console.log('');

if (dryRun) {
  console.log('   (Dry run — file not written)\n');
  console.log(output);
} else {
  writeFileSync(OUTPUT_PATH, output);
  console.log(`   ✅ research/product-links.md written (${products.length} products)\n`);
}
