/**
 * Template Reader — reads existing .astro pages as structural templates
 * for AI content generation.
 *
 * Instead of maintaining separate template files, we use real pages as
 * examples. This keeps templates in sync with the codebase automatically.
 *
 * NICHE-AGNOSTIC: Auto-discovers template pages by file pattern instead
 * of hardcoding filenames. Works for any niche (water filters, lawnmowers, etc.)
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('../../', import.meta.url).pathname;
const PAGES_DIR = join(ROOT, 'src/pages');
const GUIDES_DIR = join(PAGES_DIR, 'guides');

/**
 * Find the first .astro file in a directory matching a pattern.
 * @param {string} dir - Directory to search
 * @param {RegExp} pattern - Filename pattern to match
 * @returns {string|null} Filename or null
 */
function findFirstMatch(dir, pattern) {
  try {
    const files = readdirSync(dir).filter(f => f.endsWith('.astro') && pattern.test(f));
    // Sort for determinism, pick first
    files.sort();
    return files[0] || null;
  } catch {
    return null;
  }
}

/**
 * Auto-discover a template page for each content type.
 * Patterns:
 *   comparison    → first *-vs-*.astro in src/pages/
 *   activity-guide → first *-for-*.astro in src/pages/
 *   buyer-guide   → first *.astro in src/pages/guides/ (excluding index.astro)
 *   knowledge     → first *.astro in src/pages/ that imports guides and type='knowledge'
 */
function discoverTemplatePage(type) {
  switch (type) {
    case 'comparison': {
      // Comparisons match *-vs-*.astro
      const file = findFirstMatch(PAGES_DIR, /-vs-/);
      if (file) return { dir: PAGES_DIR, file };
      break;
    }
    case 'activity-guide': {
      // Activity guides match *-for-*.astro
      const file = findFirstMatch(PAGES_DIR, /-for-/);
      if (file) return { dir: PAGES_DIR, file };
      break;
    }
    case 'buyer-guide': {
      // Buyer guides live in src/pages/guides/ (exclude index.astro)
      const file = findFirstMatch(GUIDES_DIR, /^(?!index\.astro$).+\.astro$/);
      if (file) return { dir: GUIDES_DIR, file };
      break;
    }
    case 'knowledge': {
      // Knowledge base pages: .astro files in src/pages/ that aren't comparisons,
      // activity guides, category roundups, index, 404, or about
      const files = readdirSync(PAGES_DIR)
        .filter(f => f.endsWith('.astro'))
        .filter(f => !/-vs-/.test(f))        // not comparison
        .filter(f => !/-for-/.test(f))        // not activity guide
        .filter(f => !/^best-/.test(f))       // not category roundup
        .filter(f => !/^index\.astro$/.test(f))
        .filter(f => !/^404\.astro$/.test(f))
        .filter(f => !/^about\.astro$/.test(f))
        .sort();

      // Pick the first one that imports from guides config (has guides.find)
      for (const file of files) {
        try {
          const content = readFileSync(join(PAGES_DIR, file), 'utf-8');
          if (content.includes("guides.find") && content.includes("'knowledge'")) {
            return { dir: PAGES_DIR, file };
          }
        } catch { /* skip unreadable files */ }
      }

      // Fallback: just use the first non-comparison, non-guide page
      if (files.length > 0) return { dir: PAGES_DIR, file: files[0] };
      break;
    }
  }

  return null;
}

/**
 * Read an existing page of the given content type to use as a structural template.
 * @param {string} type - One of: comparison, activity-guide, buyer-guide, knowledge
 * @returns {{ content: string, path: string }} The template file content and path
 */
export function readTemplate(type) {
  const validTypes = ['comparison', 'activity-guide', 'buyer-guide', 'knowledge'];
  if (!validTypes.includes(type)) {
    throw new Error(`Unknown content type: ${type}. Expected one of: ${validTypes.join(', ')}`);
  }

  const discovered = discoverTemplatePage(type);
  if (!discovered) {
    throw new Error(`No template page found for content type: ${type}. Make sure you have at least one existing page of this type in src/pages/.`);
  }

  const filePath = join(discovered.dir, discovered.file);
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
      return GUIDES_DIR;
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
