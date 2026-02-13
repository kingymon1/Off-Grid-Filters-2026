/**
 * Config Patcher — programmatically updates config.ts and image-map.ts
 * to register new content entries without manual editing.
 *
 * Uses regex-based insertion to find array closing brackets and insert
 * new entries before them, preserving existing formatting.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('../../', import.meta.url).pathname;
const CONFIG_PATH = join(ROOT, 'src/lib/config.ts');
const IMAGE_MAP_PATH = join(ROOT, 'src/lib/image-map.ts');

/**
 * Add a new comparison entry to config.ts
 * @param {{ productA: string, productB: string, slug: string, publishDate: string }} comp
 */
export function addComparison(comp) {
  let config = readFileSync(CONFIG_PATH, 'utf-8');

  // Check if comparison already exists
  if (config.includes(`slug: '${comp.slug}'`)) {
    console.log(`  Comparison "${comp.slug}" already exists in config.ts — skipping`);
    return;
  }

  const entry = `  { productA: '${comp.productA}', productB: '${comp.productB}', slug: '${comp.slug}', publishDate: '${comp.publishDate}' },`;

  // Find the end of the comparisons array: last entry before `];`
  const comparisonsEndPattern = /(export const comparisons: Comparison\[\] = \[[\s\S]*?)(^\];)/m;
  const match = config.match(comparisonsEndPattern);
  if (!match) {
    throw new Error('Could not find comparisons array in config.ts');
  }

  config = config.replace(comparisonsEndPattern, `$1${entry}\n$2`);
  writeFileSync(CONFIG_PATH, config, 'utf-8');
  console.log(`  Added comparison "${comp.slug}" to config.ts`);
}

/**
 * Add a new guide entry to config.ts
 * @param {{ title: string, slug: string, description: string, type: string, publishDate: string }} guide
 */
export function addGuide(guide) {
  let config = readFileSync(CONFIG_PATH, 'utf-8');

  // Check if guide already exists
  if (config.includes(`slug: '${guide.slug}'`)) {
    console.log(`  Guide "${guide.slug}" already exists in config.ts — skipping`);
    return;
  }

  const entry = `  { title: '${guide.title.replace(/'/g, "\\'")}', slug: '${guide.slug}', description: '${guide.description.replace(/'/g, "\\'")}', type: '${guide.type}', publishDate: '${guide.publishDate}' },`;

  // Find the end of the guides array
  const guidesEndPattern = /(export const guides: GuideConfig\[\] = \[[\s\S]*?)(^\];)/m;
  const match = config.match(guidesEndPattern);
  if (!match) {
    throw new Error('Could not find guides array in config.ts');
  }

  config = config.replace(guidesEndPattern, `$1${entry}\n$2`);
  writeFileSync(CONFIG_PATH, config, 'utf-8');
  console.log(`  Added guide "${guide.slug}" to config.ts`);
}

/**
 * Add a hero image entry to image-map.ts
 * @param {string} slug - Page slug
 */
export function addHeroImage(slug) {
  let imageMap = readFileSync(IMAGE_MAP_PATH, 'utf-8');

  // Check if entry already exists
  if (imageMap.includes(`'${slug}':`)) {
    console.log(`  Image entry "${slug}" already exists in image-map.ts — skipping`);
    return;
  }

  const entry = `  '${slug}': '/assets/${slug}-hero.webp',`;

  // Insert before the closing `};` of heroImages
  const closingPattern = /(export const heroImages: Record<string, string> = \{[\s\S]*?)(^\};)/m;
  const match = imageMap.match(closingPattern);
  if (!match) {
    throw new Error('Could not find heroImages object in image-map.ts');
  }

  imageMap = imageMap.replace(closingPattern, `$1${entry}\n$2`);
  writeFileSync(IMAGE_MAP_PATH, imageMap, 'utf-8');
  console.log(`  Added image entry "${slug}" to image-map.ts`);
}

/**
 * Register a new content item in both config.ts and image-map.ts
 * @param {object} item - Queue item from content-queue.yaml
 */
export function registerContent(item) {
  console.log(`\nRegistering content in config files...`);

  switch (item.type) {
    case 'comparison':
      addComparison({
        productA: item.productA,
        productB: item.productB,
        slug: item.slug,
        publishDate: item.target_date,
      });
      break;

    case 'activity-guide':
      addGuide({
        title: item.title,
        slug: item.slug,
        description: item.description,
        type: 'activity',
        publishDate: item.target_date,
      });
      break;

    case 'buyer-guide':
      addGuide({
        title: item.title,
        slug: item.slug,
        description: item.description,
        type: 'buyer',
        publishDate: item.target_date,
      });
      break;

    case 'knowledge':
      addGuide({
        title: item.title,
        slug: item.slug,
        description: item.description,
        type: 'knowledge',
        publishDate: item.target_date,
      });
      break;

    default:
      throw new Error(`Unknown content type: ${item.type}`);
  }

  addHeroImage(item.slug);
}
