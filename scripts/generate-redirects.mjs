#!/usr/bin/env node

// ============================================================
// generate-redirects.mjs — Auto-generate vercel.json redirects
// ============================================================
// Reads product legacyUrls and general redirects from config.ts,
// merges them with existing vercel.json redirects (preserving
// manually-added entries), and writes the updated file.
//
// Usage:
//   node scripts/generate-redirects.mjs          # update vercel.json
//   node scripts/generate-redirects.mjs --dry-run # preview without writing
//
// For site migrations: populate legacyUrls on products in config.ts
// and/or the redirects array, then run this script.
// ============================================================

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const VERCEL_JSON = resolve(ROOT, 'vercel.json');

const dryRun = process.argv.includes('--dry-run');

// ── Parse config.ts for redirect data ────────────────────────
// We parse the TypeScript source directly rather than importing it,
// because config.ts uses TypeScript syntax that Node can't run natively.
// This keeps the script zero-dependency (no ts-node, no tsx).

const configPath = resolve(ROOT, 'src/lib/config.ts');
const configSource = readFileSync(configPath, 'utf-8');

/**
 * Extract product slugs and their legacyUrls from config.ts
 */
function extractProductRedirects(source) {
  const redirects = [];

  // Find all legacyUrls arrays, then look backward for the nearest slug
  const legacyRegex = /legacyUrls:\s*\[([\s\S]*?)\]/g;
  let match;

  while ((match = legacyRegex.exec(source)) !== null) {
    const urlsBlock = match[1];
    const beforeMatch = source.slice(0, match.index);

    // Find the nearest slug: 'some-slug' before this legacyUrls
    const slugMatches = [...beforeMatch.matchAll(/slug:\s*'([^']+)'/g)];
    if (slugMatches.length === 0) continue;
    const slug = slugMatches[slugMatches.length - 1][1];
    const destination = `/reviews/${slug}/`;

    // Extract individual URL strings from the array
    const urlRegex = /'([^']+)'/g;
    let urlMatch;
    while ((urlMatch = urlRegex.exec(urlsBlock)) !== null) {
      redirects.push({
        source: urlMatch[1],
        destination,
        permanent: true,
      });
    }
  }

  return redirects;
}

/**
 * Extract general redirects from the redirects array in config.ts
 */
function extractGeneralRedirects(source) {
  const redirects = [];

  // Match the redirects array
  const arrayMatch = source.match(/export const redirects:\s*Redirect\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (!arrayMatch) return redirects;

  const arrayContent = arrayMatch[1];

  // Match individual redirect objects: { from: '/old', to: '/new' }
  const entryRegex = /\{\s*from:\s*'([^']+)'\s*,\s*to:\s*'([^']+)'\s*\}/g;
  let match;

  while ((match = entryRegex.exec(arrayContent)) !== null) {
    redirects.push({
      source: match[1],
      destination: match[2],
      permanent: true,
    });
  }

  return redirects;
}

// ── Collect all redirects from config ────────────────────────
const productRedirects = extractProductRedirects(configSource);
const generalRedirects = extractGeneralRedirects(configSource);
const configRedirects = [...productRedirects, ...generalRedirects];

// ── Read existing vercel.json ────────────────────────────────
const vercelConfig = JSON.parse(readFileSync(VERCEL_JSON, 'utf-8'));
const existingRedirects = vercelConfig.redirects || [];

// ── Merge: keep manually-added redirects, add/update config ones ──
// "Manually-added" = any redirect whose source doesn't come from config.
// This preserves entries like the .html→trailing-slash redirect.
const configSources = new Set(configRedirects.map(r => r.source));
const manualRedirects = existingRedirects.filter(r => !configSources.has(r.source));

// Final list: manual first (preserves .html redirect at top), then config-generated
const mergedRedirects = [...manualRedirects, ...configRedirects];

// ── Output ───────────────────────────────────────────────────
const added = configRedirects.length;
const kept = manualRedirects.length;
const total = mergedRedirects.length;

console.log(`\n📋 Redirect Summary:`);
console.log(`   Manual (preserved):    ${kept}`);
console.log(`   From config:           ${added}`);
console.log(`   Total:                 ${total}\n`);

if (configRedirects.length > 0) {
  console.log(`   Config-generated redirects:`);
  for (const r of configRedirects) {
    console.log(`     ${r.source} → ${r.destination}`);
  }
  console.log('');
}

if (dryRun) {
  console.log('   (Dry run — vercel.json not modified)\n');
} else {
  vercelConfig.redirects = mergedRedirects;
  writeFileSync(VERCEL_JSON, JSON.stringify(vercelConfig, null, 2) + '\n');
  console.log(`   ✅ vercel.json updated with ${total} redirects\n`);
}
