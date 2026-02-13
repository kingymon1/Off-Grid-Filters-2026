/**
 * Template Reader — reads existing .astro pages as structural templates
 * for AI content generation.
 *
 * Instead of maintaining separate template files, we use real pages as
 * examples. This keeps templates in sync with the codebase automatically.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('../../', import.meta.url).pathname;
const PAGES_DIR = join(ROOT, 'src/pages');

// Map content types to example page files
const TEMPLATE_PAGES = {
  comparison: 'amazon-basics-vs-brita-standard.astro',
  'activity-guide': 'water-filters-for-camping.astro',
  'buyer-guide': join('guides', 'how-to-choose-water-filter.astro'),
  knowledge: 'what-is-reverse-osmosis.astro',
};

/**
 * Read an existing page of the given content type to use as a structural template.
 * @param {string} type - One of: comparison, activity-guide, buyer-guide, knowledge
 * @returns {{ content: string, path: string }} The template file content and path
 */
export function readTemplate(type) {
  const filename = TEMPLATE_PAGES[type];
  if (!filename) {
    throw new Error(`Unknown content type: ${type}. Expected one of: ${Object.keys(TEMPLATE_PAGES).join(', ')}`);
  }

  const filePath = join(PAGES_DIR, filename);
  const content = readFileSync(filePath, 'utf-8');

  return { content, path: filePath };
}

/**
 * Get the output directory for a given content type.
 * @param {string} type - Content type
 * @returns {string} Directory path where new pages should be written
 */
export function getOutputDir(type) {
  switch (type) {
    case 'buyer-guide':
      return join(PAGES_DIR, 'guides');
    case 'comparison':
    case 'activity-guide':
    case 'knowledge':
      return PAGES_DIR;
    default:
      throw new Error(`Unknown content type: ${type}`);
  }
}

/**
 * Get the output filename for a given content type and slug.
 * @param {string} type - Content type
 * @param {string} slug - Page slug
 * @returns {string} Filename (e.g., 'my-guide.astro')
 */
export function getOutputFilename(type, slug) {
  return `${slug}.astro`;
}
