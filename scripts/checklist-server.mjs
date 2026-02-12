#!/usr/bin/env node
/**
 * OffGrid Filters — Launch Checklist Runner
 *
 * Self-contained server with built-in web UI that automates Sections 1-5
 * of LAUNCH-CHECKLIST.md and provides a dashboard for manual Sections 6-12.
 *
 * Usage:
 *   npm run checklist              # Start dashboard at http://localhost:3200
 *   npm run checklist -- --auto    # Run automated checks (CLI, no UI)
 *
 * Prerequisites:
 *   npm install                    # Must install deps first
 *   npm run build                  # Must have a dist/ folder for HTML checks
 */

import { createServer } from 'node:http';
import { readFile, writeFile, readdir, access, stat } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const RESULTS_FILE = join(ROOT, 'checklist-results.json');
const PORT = 3200;

// ─── Results Storage ──────────────────────────────────────
async function loadResults() {
  try {
    const raw = await readFile(RESULTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { lastRun: null, sections: {}, manual: {} };
  }
}

async function saveResults(results) {
  results.lastRun = new Date().toISOString();
  await writeFile(RESULTS_FILE, JSON.stringify(results, null, 2));
}

// ─── File Helpers ─────────────────────────────────────────
async function fileExists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function getAllHtmlFiles(dir) {
  const files = [];
  async function walk(d) {
    let entries;
    try { entries = await readdir(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const full = join(d, e.name);
      if (e.isDirectory()) await walk(full);
      else if (e.name.endsWith('.html')) files.push(full);
    }
  }
  await walk(dir);
  return files;
}

async function readHtml(filepath) {
  try { return await readFile(filepath, 'utf-8'); } catch { return ''; }
}

function urlFromFile(filepath) {
  const rel = relative(DIST, filepath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  return '/' + rel.replace(/\/index\.html$/, '/').replace(/\.html$/, '/');
}

// ─── Shell Helper ─────────────────────────────────────────
function runCmd(cmd, opts = {}) {
  try {
    const out = execSync(cmd, { cwd: ROOT, encoding: 'utf-8', timeout: 300000, stdio: ['pipe', 'pipe', 'pipe'], ...opts });
    return { ok: true, output: out.trim() };
  } catch (e) {
    return { ok: false, output: (e.stdout || '') + '\n' + (e.stderr || ''), code: e.status };
  }
}

// ─── HTML Parsing Helpers ─────────────────────────────────
function extractTag(html, tag) {
  const m = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return m ? m[1].trim() : null;
}

function extractMeta(html, name) {
  // name= or property=
  const m = html.match(new RegExp(`<meta\\s+(?:name|property)=["']${name}["']\\s+content=["']([^"']*)["']`, 'i'))
    || html.match(new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+(?:name|property)=["']${name}["']`, 'i'));
  return m ? m[1] : null;
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)
    || html.match(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
  return m ? m[1] : null;
}

function extractHeadings(html) {
  const headings = [];
  const re = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(html))) {
    headings.push({ level: parseInt(m[1]), text: m[2].replace(/<[^>]+>/g, '').trim() });
  }
  return headings;
}

function extractJsonLd(html) {
  const schemas = [];
  const re = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try { schemas.push(JSON.parse(m[1])); } catch { schemas.push({ _parseError: true, _raw: m[1].slice(0, 200) }); }
  }
  return schemas;
}

function extractLinks(html) {
  const links = [];
  const re = /<a\s+([^>]*)>/gi;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    const href = (attrs.match(/href=["']([^"']*)["']/i) || [])[1] || '';
    const rel = (attrs.match(/rel=["']([^"']*)["']/i) || [])[1] || '';
    const target = (attrs.match(/target=["']([^"']*)["']/i) || [])[1] || '';
    links.push({ href, rel, target });
  }
  return links;
}

function countWords(html) {
  // Strip tags, decode entities, count words
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

// ─── Automated Checks ────────────────────────────────────
// Each check returns { id, label, status: 'pass'|'fail'|'warn', detail }

async function runSection1() {
  const checks = [];

  // 1.1 Build Pipeline
  const npmInstall = runCmd('npm install --prefer-offline 2>&1');
  checks.push({ id: '1.1.npm-install', label: 'npm install completes without errors', status: npmInstall.ok ? 'pass' : 'fail', detail: npmInstall.ok ? 'Exit code 0' : npmInstall.output.slice(-500) });

  const npmLint = runCmd('npm run lint 2>&1');
  checks.push({ id: '1.1.npm-lint', label: 'npm run lint passes', status: npmLint.ok ? 'pass' : 'fail', detail: npmLint.ok ? 'Zero warnings, zero errors' : npmLint.output.slice(-500) });

  const npmTest = runCmd('npm run test 2>&1');
  checks.push({ id: '1.1.npm-test', label: 'npm run test passes all tests', status: npmTest.ok ? 'pass' : 'fail', detail: npmTest.ok ? 'All tests passed' : npmTest.output.slice(-500) });

  const npmBuild = runCmd('npm run build 2>&1');
  checks.push({ id: '1.1.npm-build', label: 'npm run build completes with exit code 0', status: npmBuild.ok ? 'pass' : 'fail', detail: npmBuild.ok ? 'Build succeeded' : npmBuild.output.slice(-500) });

  // Build output checks
  const distFiles = [
    ['dist/index.html', 'dist/index.html exists'],
    ['dist/sitemap-index.xml', 'dist/sitemap-index.xml exists'],
    ['dist/robots.txt', 'dist/robots.txt exists'],
    ['dist/404.html', 'dist/404.html exists (custom 404)'],
    ['dist/llms.txt', 'dist/llms.txt exists'],
    ['dist/favicon.ico', 'dist/favicon.ico exists'],
    ['dist/favicon.png', 'dist/favicon.png exists'],
  ];
  for (const [path, label] of distFiles) {
    const exists = await fileExists(join(ROOT, path));
    checks.push({ id: `1.1.${path.replace(/[\/.]/g, '-')}`, label, status: exists ? 'pass' : 'fail', detail: exists ? 'Found' : 'Missing' });
  }

  // Check llms.txt for undefined
  if (await fileExists(join(DIST, 'llms.txt'))) {
    const llms = await readFile(join(DIST, 'llms.txt'), 'utf-8');
    const hasUndefined = llms.includes('undefined');
    checks.push({ id: '1.1.llms-no-undefined', label: 'llms.txt has no "undefined" entries', status: hasUndefined ? 'fail' : 'pass', detail: hasUndefined ? 'Found "undefined" in llms.txt' : 'Clean' });
  }

  // Page count
  const htmlFiles = await getAllHtmlFiles(DIST);
  const count = htmlFiles.length;
  checks.push({ id: '1.1.page-count', label: `Total page count (${count}) is 70-90+`, status: count >= 70 ? 'pass' : count >= 50 ? 'warn' : 'fail', detail: `${count} HTML files in dist/` });

  // 1.2 File Inventory
  const sourceFiles = [
    'package.json', 'astro.config.mjs', 'tailwind.config.ts', 'tsconfig.json',
    'postcss.config.js', 'eslint.config.js', 'vercel.json', '.gitignore', '.env.example',
    'product-brief.yaml', 'CLAUDE.md', 'IMAGE-GUIDE.md',
    '.github/workflows/ci.yml', 'public/robots.txt', 'public/favicon.ico', 'public/favicon.png',
    'src/lib/config.ts', 'src/lib/image-map.ts', 'src/lib/schema.ts', 'src/lib/schema.test.ts',
    'src/layouts/BaseLayout.astro', 'src/layouts/ContentLayout.astro',
    'src/components/HeaderAstro.astro', 'src/components/FooterAstro.astro',
    'src/components/BreadcrumbsAstro.astro', 'src/components/RelatedArticlesAstro.astro',
    'src/components/StatCard.astro', 'src/components/ProTip.astro',
    'src/components/Callout.astro', 'src/components/ProductImage.astro',
    'src/components/ComparisonTable.astro', 'src/components/EmailCapture.astro',
    'src/components/AffiliateDisclosure.astro', 'src/components/ProductHero.astro',
    'src/pages/index.astro', 'src/pages/404.astro', 'src/pages/guides/index.astro',
    'src/pages/llms.txt.ts',
    'scripts/convert-to-webp.mjs', 'scripts/generate-local-images.mjs', 'scripts/image-gen-server.mjs',
    'research/product-catalog-research.md', 'research/category-research.md',
    'research/market-research.md', 'research/design-decisions.md', 'research/site-plan.md',
  ];
  let missingFiles = [];
  for (const f of sourceFiles) {
    const exists = await fileExists(join(ROOT, f));
    if (!exists) missingFiles.push(f);
  }
  checks.push({
    id: '1.2.file-inventory', label: `File inventory (${sourceFiles.length - missingFiles.length}/${sourceFiles.length} present)`,
    status: missingFiles.length === 0 ? 'pass' : 'fail',
    detail: missingFiles.length === 0 ? 'All files present' : `Missing: ${missingFiles.join(', ')}`
  });

  // 1.3 Configuration Integrity
  if (await fileExists(join(ROOT, 'astro.config.mjs'))) {
    const astroConf = await readFile(join(ROOT, 'astro.config.mjs'), 'utf-8');
    checks.push({ id: '1.3.astro-site', label: 'astro.config.mjs has site URL', status: astroConf.includes('site:') ? 'pass' : 'fail', detail: astroConf.includes('site:') ? 'site property found' : 'Missing site property' });
    checks.push({ id: '1.3.astro-static', label: 'astro.config.mjs uses static output', status: astroConf.includes("'static'") || astroConf.includes('"static"') ? 'pass' : 'warn', detail: 'Checked for output: static' });
    checks.push({ id: '1.3.astro-trailing', label: 'astro.config.mjs has trailingSlash', status: astroConf.includes('trailingSlash') ? 'pass' : 'fail', detail: 'Checked for trailingSlash config' });
  }

  if (await fileExists(join(ROOT, 'vercel.json'))) {
    const vercel = await readFile(join(ROOT, 'vercel.json'), 'utf-8');
    const hasCSP = vercel.includes('Content-Security-Policy') || vercel.includes('content-security-policy');
    const hasXFrame = vercel.includes('X-Frame-Options') || vercel.includes('x-frame-options');
    const hasButtondown = vercel.includes('buttondown.com');
    checks.push({ id: '1.3.vercel-csp', label: 'vercel.json has CSP header', status: hasCSP ? 'pass' : 'fail', detail: hasCSP ? 'CSP found' : 'Missing CSP' });
    checks.push({ id: '1.3.vercel-xframe', label: 'vercel.json has X-Frame-Options', status: hasXFrame ? 'pass' : 'fail', detail: hasXFrame ? 'Found' : 'Missing' });
    checks.push({ id: '1.3.vercel-buttondown', label: 'CSP form-action includes buttondown.com', status: hasButtondown ? 'pass' : 'fail', detail: hasButtondown ? 'Found' : 'Missing — email form will be blocked' });
  }

  return checks;
}

async function runSection2() {
  const checks = [];
  const htmlFiles = await getAllHtmlFiles(DIST);
  if (htmlFiles.length === 0) {
    checks.push({ id: '2.0.no-dist', label: 'Build output exists', status: 'fail', detail: 'No HTML files in dist/. Run npm run build first.' });
    return checks;
  }

  const titles = new Map();
  const metas = new Map();
  const canonicals = [];
  let pagesWithoutTitle = 0;
  let pagesWithoutMeta = 0;
  let pagesWithoutCanonical = 0;
  let titleOver60 = 0;
  let metaOver160 = 0;
  let pagesWithoutH1 = 0;
  let pagesWithMultipleH1 = 0;
  let skippedHeadings = 0;
  let pagesWithoutOgTitle = 0;
  let pagesWithoutOgDesc = 0;
  let pagesWithoutOgImage = 0;
  let pagesWithoutLang = 0;
  let pagesWithNoindex = 0;

  for (const file of htmlFiles) {
    const html = await readHtml(file);
    const url = urlFromFile(file);

    // Title
    const title = extractTag(html, 'title');
    if (!title) pagesWithoutTitle++;
    else {
      titles.set(url, title);
      if (title.length > 60) titleOver60++;
    }

    // Meta description
    const desc = extractMeta(html, 'description');
    if (!desc) pagesWithoutMeta++;
    else {
      metas.set(url, desc);
      if (desc.length > 160) metaOver160++;
    }

    // Canonical
    const canon = extractCanonical(html);
    if (!canon) pagesWithoutCanonical++;
    else canonicals.push({ url, canonical: canon });

    // Headings
    const headings = extractHeadings(html);
    const h1s = headings.filter(h => h.level === 1);
    if (h1s.length === 0) pagesWithoutH1++;
    if (h1s.length > 1) pagesWithMultipleH1++;

    // Check for skipped levels
    for (let i = 1; i < headings.length; i++) {
      if (headings[i].level > headings[i - 1].level + 1) {
        skippedHeadings++;
        break;
      }
    }

    // OG tags
    if (!extractMeta(html, 'og:title')) pagesWithoutOgTitle++;
    if (!extractMeta(html, 'og:description')) pagesWithoutOgDesc++;
    if (!extractMeta(html, 'og:image')) pagesWithoutOgImage++;

    // HTML fundamentals
    if (!html.includes('lang="en"') && !html.includes("lang='en'")) pagesWithoutLang++;
    if (html.includes('noindex')) pagesWithNoindex++;
  }

  // 2.1 Title Tags
  checks.push({ id: '2.1.has-title', label: 'Every page has a <title> tag', status: pagesWithoutTitle === 0 ? 'pass' : 'fail', detail: pagesWithoutTitle === 0 ? 'All pages have titles' : `${pagesWithoutTitle} pages missing title` });

  // Unique titles
  const titleValues = [...titles.values()];
  const uniqueTitles = new Set(titleValues);
  const dupTitles = titleValues.length - uniqueTitles.size;
  checks.push({ id: '2.1.unique-titles', label: 'No duplicate titles', status: dupTitles === 0 ? 'pass' : 'fail', detail: dupTitles === 0 ? 'All unique' : `${dupTitles} duplicate titles` });
  checks.push({ id: '2.1.title-length', label: 'All titles under 60 characters', status: titleOver60 === 0 ? 'pass' : 'warn', detail: titleOver60 === 0 ? 'All within limit' : `${titleOver60} titles over 60 chars` });

  // 2.2 Meta Descriptions
  checks.push({ id: '2.2.has-meta', label: 'Every page has a meta description', status: pagesWithoutMeta === 0 ? 'pass' : 'fail', detail: pagesWithoutMeta === 0 ? 'All pages have descriptions' : `${pagesWithoutMeta} pages missing` });

  const metaValues = [...metas.values()];
  const uniqueMetas = new Set(metaValues);
  const dupMetas = metaValues.length - uniqueMetas.size;
  checks.push({ id: '2.2.unique-metas', label: 'No duplicate meta descriptions', status: dupMetas === 0 ? 'pass' : 'fail', detail: dupMetas === 0 ? 'All unique' : `${dupMetas} duplicates` });
  checks.push({ id: '2.2.meta-length', label: 'All meta descriptions under 160 chars', status: metaOver160 === 0 ? 'pass' : 'warn', detail: metaOver160 === 0 ? 'All within limit' : `${metaOver160} over 160 chars` });

  // 2.3 Heading Hierarchy
  checks.push({ id: '2.3.h1-present', label: 'Every page has exactly one H1', status: pagesWithoutH1 === 0 && pagesWithMultipleH1 === 0 ? 'pass' : 'fail', detail: `${pagesWithoutH1} missing H1, ${pagesWithMultipleH1} with multiple H1s` });
  checks.push({ id: '2.3.no-skipped', label: 'No skipped heading levels', status: skippedHeadings === 0 ? 'pass' : 'warn', detail: skippedHeadings === 0 ? 'Hierarchy intact' : `${skippedHeadings} pages with skipped levels` });

  // 2.4 Canonical URLs
  checks.push({ id: '2.4.has-canonical', label: 'Every page has a canonical URL', status: pagesWithoutCanonical === 0 ? 'pass' : 'fail', detail: pagesWithoutCanonical === 0 ? 'All present' : `${pagesWithoutCanonical} missing` });

  let nonAbsolute = canonicals.filter(c => !c.canonical.startsWith('https://')).length;
  checks.push({ id: '2.4.absolute-canonical', label: 'Canonical URLs are absolute (https://)', status: nonAbsolute === 0 ? 'pass' : 'fail', detail: nonAbsolute === 0 ? 'All absolute' : `${nonAbsolute} non-absolute` });

  let noTrailingSlash = canonicals.filter(c => !c.canonical.endsWith('/')).length;
  checks.push({ id: '2.4.trailing-slash', label: 'Canonical URLs have trailing slash', status: noTrailingSlash === 0 ? 'pass' : 'fail', detail: noTrailingSlash === 0 ? 'All have trailing slash' : `${noTrailingSlash} missing trailing slash` });

  // 2.5 OG Tags
  checks.push({ id: '2.5.og-title', label: 'Every page has og:title', status: pagesWithoutOgTitle === 0 ? 'pass' : 'fail', detail: pagesWithoutOgTitle === 0 ? 'All present' : `${pagesWithoutOgTitle} missing` });
  checks.push({ id: '2.5.og-desc', label: 'Every page has og:description', status: pagesWithoutOgDesc === 0 ? 'pass' : 'fail', detail: pagesWithoutOgDesc === 0 ? 'All present' : `${pagesWithoutOgDesc} missing` });
  checks.push({ id: '2.5.og-image', label: 'Every page has og:image', status: pagesWithoutOgImage === 0 ? 'pass' : 'fail', detail: pagesWithoutOgImage === 0 ? 'All present' : `${pagesWithoutOgImage} missing` });

  // 2.6 HTML Fundamentals
  checks.push({ id: '2.6.lang', label: 'html lang="en" on every page', status: pagesWithoutLang === 0 ? 'pass' : 'fail', detail: pagesWithoutLang === 0 ? 'All present' : `${pagesWithoutLang} missing lang` });
  checks.push({ id: '2.6.noindex', label: 'No noindex on content pages', status: pagesWithNoindex === 0 ? 'pass' : 'fail', detail: pagesWithNoindex === 0 ? 'None found' : `${pagesWithNoindex} pages with noindex` });

  return checks;
}

async function runSection3() {
  const checks = [];
  const htmlFiles = await getAllHtmlFiles(DIST);
  if (htmlFiles.length === 0) {
    checks.push({ id: '3.0.no-dist', label: 'Build output exists', status: 'fail', detail: 'Run npm run build first.' });
    return checks;
  }

  let pagesWithSchema = 0;
  let parseErrors = 0;
  let undefinedInSchema = 0;
  let nullInSchema = 0;
  let hasSearchAction = 0;
  let totalSchemas = 0;
  let reviewPagesWithProduct = 0;
  let reviewPagesTotal = 0;
  let faqSchemaCount = 0;
  let breadcrumbSchemaCount = 0;
  let articleSchemaCount = 0;
  let articleWithDates = 0;
  let articleWithAbout = 0;
  let itemListCount = 0;

  function checkForBadValues(obj, path = '') {
    if (obj === undefined || obj === 'undefined') { undefinedInSchema++; return; }
    if (obj === null) { nullInSchema++; return; }
    if (typeof obj === 'object' && obj !== null) {
      for (const [k, v] of Object.entries(obj)) {
        checkForBadValues(v, path + '.' + k);
      }
    }
  }

  for (const file of htmlFiles) {
    const html = await readHtml(file);
    const url = urlFromFile(file);
    const schemas = extractJsonLd(html);

    if (schemas.length > 0) pagesWithSchema++;
    totalSchemas += schemas.length;

    for (const schema of schemas) {
      if (schema._parseError) { parseErrors++; continue; }
      checkForBadValues(schema);

      // Flatten @graph
      const items = schema['@graph'] ? schema['@graph'] : [schema];
      for (const item of items) {
        const type = item['@type'];
        if (type === 'Product') {
          if (url.includes('/reviews/')) reviewPagesWithProduct++;
        }
        if (type === 'FAQPage') faqSchemaCount++;
        if (type === 'BreadcrumbList') breadcrumbSchemaCount++;
        if (type === 'ItemList') itemListCount++;
        if (type === 'Article') {
          articleSchemaCount++;
          if (item.datePublished && item.dateModified) articleWithDates++;
          if (item.about) articleWithAbout++;
        }
        if (JSON.stringify(item).includes('SearchAction')) hasSearchAction++;
      }
    }

    if (url.includes('/reviews/')) reviewPagesTotal++;
  }

  checks.push({ id: '3.1.schemas-present', label: `Pages with schema markup (${pagesWithSchema}/${htmlFiles.length})`, status: pagesWithSchema > htmlFiles.length * 0.8 ? 'pass' : 'warn', detail: `${pagesWithSchema} of ${htmlFiles.length} pages have JSON-LD` });

  checks.push({ id: '3.1.product-schema', label: `Product schema on review pages (${reviewPagesWithProduct}/${reviewPagesTotal})`, status: reviewPagesWithProduct >= reviewPagesTotal ? 'pass' : 'fail', detail: `${reviewPagesWithProduct} of ${reviewPagesTotal} reviews have Product schema` });

  checks.push({ id: '3.1.faq-schema', label: `FAQPage schemas found: ${faqSchemaCount}`, status: faqSchemaCount > 0 ? 'pass' : 'warn', detail: `${faqSchemaCount} FAQ schemas` });

  checks.push({ id: '3.1.breadcrumb-schema', label: `BreadcrumbList schemas found: ${breadcrumbSchemaCount}`, status: breadcrumbSchemaCount > 0 ? 'pass' : 'warn', detail: `${breadcrumbSchemaCount} breadcrumb schemas` });

  checks.push({ id: '3.1.itemlist-schema', label: `ItemList schemas found: ${itemListCount}`, status: itemListCount > 0 ? 'pass' : 'warn', detail: `${itemListCount} ItemList schemas` });

  // 3.2 Schema Quality
  checks.push({ id: '3.2.parse-errors', label: 'All JSON-LD is valid JSON', status: parseErrors === 0 ? 'pass' : 'fail', detail: parseErrors === 0 ? 'All parseable' : `${parseErrors} parse errors` });

  checks.push({ id: '3.2.no-undefined', label: 'No undefined values in schema', status: undefinedInSchema === 0 ? 'pass' : 'fail', detail: undefinedInSchema === 0 ? 'Clean' : `${undefinedInSchema} undefined values` });

  checks.push({ id: '3.2.no-null', label: 'No null values in schema', status: nullInSchema === 0 ? 'pass' : 'warn', detail: nullInSchema === 0 ? 'Clean' : `${nullInSchema} null values` });

  checks.push({ id: '3.2.no-search-action', label: 'No SearchAction in any schema', status: hasSearchAction === 0 ? 'pass' : 'fail', detail: hasSearchAction === 0 ? 'Clean' : `${hasSearchAction} SearchAction(s) found` });

  checks.push({ id: '3.2.article-dates', label: `Article schemas with per-page dates (${articleWithDates}/${articleSchemaCount})`, status: articleWithDates >= articleSchemaCount ? 'pass' : 'fail', detail: `${articleWithDates} of ${articleSchemaCount} have both datePublished and dateModified` });

  checks.push({ id: '3.2.entity-linking', label: `Article schemas with entity linking (${articleWithAbout}/${articleSchemaCount})`, status: articleWithAbout >= articleSchemaCount * 0.8 ? 'pass' : 'warn', detail: `${articleWithAbout} of ${articleSchemaCount} have about property` });

  return checks;
}

async function runSection4() {
  const checks = [];
  const htmlFiles = await getAllHtmlFiles(DIST);
  if (htmlFiles.length === 0) {
    checks.push({ id: '4.0.no-dist', label: 'Build output exists', status: 'fail', detail: 'Run npm run build first.' });
    return checks;
  }

  // Build link graph
  const internalLinks = new Map(); // url -> Set of urls it links to
  const inboundLinks = new Map(); // url -> Set of urls linking to it
  const allUrls = new Set();
  let brokenLinks = 0;
  let brokenLinkDetails = [];
  let affiliateIssues = 0;
  let affiliateIssueDetails = [];
  let nofollowInternal = 0;
  let noTrailingSlashInternal = 0;

  for (const file of htmlFiles) {
    const url = urlFromFile(file);
    allUrls.add(url);
    internalLinks.set(url, new Set());
    if (!inboundLinks.has(url)) inboundLinks.set(url, new Set());
  }

  for (const file of htmlFiles) {
    const html = await readHtml(file);
    const url = urlFromFile(file);
    const links = extractLinks(html);

    for (const link of links) {
      const href = link.href;
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;

      // Amazon affiliate links
      if (href.includes('amazon.com')) {
        const hasNofollow = link.rel.includes('nofollow');
        const hasSponsored = link.rel.includes('sponsored');
        const hasNoopener = link.rel.includes('noopener');
        if (!hasNofollow || !hasSponsored || !hasNoopener) {
          affiliateIssues++;
          if (affiliateIssueDetails.length < 5) affiliateIssueDetails.push(`${url}: missing rel attrs on Amazon link`);
        }
        continue;
      }

      // External links
      if (href.startsWith('http') && !href.includes('offgridfilters.com')) continue;

      // Internal links
      let resolved = href;
      if (resolved.startsWith('/')) {
        // Normalize
        if (!resolved.endsWith('/') && !resolved.includes('.')) {
          noTrailingSlashInternal++;
          resolved += '/';
        }
      } else if (!resolved.startsWith('http')) {
        // Relative
        continue; // skip complex relative resolution
      }

      if (link.rel.includes('nofollow') && !href.includes('amazon.com')) {
        nofollowInternal++;
      }

      internalLinks.get(url)?.add(resolved);
      if (inboundLinks.has(resolved)) {
        inboundLinks.get(resolved).add(url);
      }

      // Check if link target exists
      if (resolved.startsWith('/') && !allUrls.has(resolved) && !resolved.includes('#') && !resolved.includes('.xml') && !resolved.includes('.txt') && !resolved.includes('.ico') && !resolved.includes('.png')) {
        brokenLinks++;
        if (brokenLinkDetails.length < 10) brokenLinkDetails.push(`${url} -> ${resolved}`);
      }
    }
  }

  // Orphan pages (no inbound links beyond self)
  let orphanPages = [];
  for (const [url, inbound] of inboundLinks) {
    if (url === '/') continue; // Homepage won't have many inbound
    if (url === '/404/') continue; // 404 is special
    if (inbound.size < 1) orphanPages.push(url);
  }

  checks.push({ id: '4.1.no-orphans', label: `Zero orphan pages (${orphanPages.length} found)`, status: orphanPages.length === 0 ? 'pass' : 'fail', detail: orphanPages.length === 0 ? 'All pages have inbound links' : `Orphans: ${orphanPages.slice(0, 10).join(', ')}` });

  // 4.3 Related articles cross-linking — automated check
  let pagesWithoutRelated = [];
  let pagesWithWrongCount = [];
  for (const file of htmlFiles) {
    const html = await readHtml(file);
    const url = urlFromFile(file);
    // Skip homepage, 404, resource hub — they don't use RelatedArticles
    if (url === '/' || url === '/404/' || url === '/guides/') continue;
    // Count related article links inside a related-articles section
    const relatedMatch = html.match(/related-articles|RelatedArticles|related-reads/i);
    if (!relatedMatch) {
      pagesWithoutRelated.push(url);
    } else {
      // Count links inside the related articles section (look for the section and count <a> tags)
      const relatedSection = html.slice(html.search(/related-articles|RelatedArticles|related-reads/i));
      const sectionEnd = relatedSection.indexOf('</section>') > 0 ? relatedSection.indexOf('</section>') + 10 : relatedSection.indexOf('</footer>');
      const section = sectionEnd > 0 ? relatedSection.slice(0, sectionEnd) : relatedSection.slice(0, 2000);
      const linkCount = (section.match(/<a\s/gi) || []).length;
      if (linkCount < 4) pagesWithWrongCount.push(`${url} (${linkCount} links, need 4)`);
    }
  }
  const contentPages = htmlFiles.length - 3; // minus homepage, 404, resource hub
  const pagesWithRelated = contentPages - pagesWithoutRelated.length;
  checks.push({ id: '4.3.related-articles', label: `Related articles present (${pagesWithRelated}/${contentPages} content pages)`, status: pagesWithoutRelated.length === 0 ? 'pass' : 'fail', detail: pagesWithoutRelated.length === 0 ? 'All content pages have related articles' : `Missing on: ${pagesWithoutRelated.slice(0, 8).join(', ')}${pagesWithoutRelated.length > 8 ? ` +${pagesWithoutRelated.length - 8} more` : ''}` });
  checks.push({ id: '4.3.related-count', label: `Related articles have 4 links each (${pagesWithWrongCount.length} issues)`, status: pagesWithWrongCount.length === 0 ? 'pass' : 'warn', detail: pagesWithWrongCount.length === 0 ? 'All have 4+ links' : `Issues: ${pagesWithWrongCount.slice(0, 5).join('; ')}` });

  checks.push({ id: '4.5.broken-links', label: `Zero broken internal links (${brokenLinks} found)`, status: brokenLinks === 0 ? 'pass' : 'fail', detail: brokenLinks === 0 ? 'All links resolve' : `Broken: ${brokenLinkDetails.join('; ')}` });

  checks.push({ id: '4.5.no-nofollow-internal', label: `No nofollow on internal links (${nofollowInternal} found)`, status: nofollowInternal === 0 ? 'pass' : 'warn', detail: nofollowInternal === 0 ? 'Clean' : `${nofollowInternal} internal links with nofollow` });

  checks.push({ id: '4.5.trailing-slash', label: `All internal links have trailing slash`, status: noTrailingSlashInternal === 0 ? 'pass' : 'warn', detail: noTrailingSlashInternal === 0 ? 'All correct' : `${noTrailingSlashInternal} missing trailing slash` });

  // 5.4 Affiliate compliance (checking here since we already parsed links)
  checks.push({ id: '4.5.affiliate-rel', label: `Affiliate links have rel="nofollow sponsored noopener" (${affiliateIssues} issues)`, status: affiliateIssues === 0 ? 'pass' : 'fail', detail: affiliateIssues === 0 ? 'All correct' : `${affiliateIssueDetails.join('; ')}` });

  return checks;
}

async function runSection5() {
  const checks = [];
  const htmlFiles = await getAllHtmlFiles(DIST);
  if (htmlFiles.length === 0) {
    checks.push({ id: '5.0.no-dist', label: 'Build output exists', status: 'fail', detail: 'Run npm run build first.' });
    return checks;
  }

  let placeholderCount = 0;
  let placeholderPages = [];
  let thinPages = [];
  let reviewsWithoutCons = [];
  let pagesWithoutProductImage = 0;

  const placeholderPatterns = [/lorem ipsum/i, /\bTODO\b/, /\bTBD\b/, /\[placeholder\]/i, /coming soon/i];

  for (const file of htmlFiles) {
    const html = await readHtml(file);
    const url = urlFromFile(file);
    const words = countWords(html);

    // Placeholder text
    for (const pat of placeholderPatterns) {
      if (pat.test(html)) {
        placeholderCount++;
        if (placeholderPages.length < 5) placeholderPages.push(url);
        break;
      }
    }

    // Content length
    const isReview = url.includes('/reviews/');
    const isGuide = url.includes('/guides/') && url !== '/guides/';
    const isComparison = url.includes('-vs-');
    const isKnowledge = !isReview && !isGuide && !isComparison && url !== '/' && url !== '/404/' && url !== '/guides/';

    if (isReview && words < 1500) thinPages.push(`${url} (${words}w, need 1500+)`);
    if (isGuide && words < 2000) thinPages.push(`${url} (${words}w, need 2000+)`);
    if (isComparison && words < 1500) thinPages.push(`${url} (${words}w, need 1500+)`);

    // Check for ProductImage (look for product-image class or SVG placeholder pattern)
    const hasProductImage = html.includes('product-image') || html.includes('productimage') || html.includes('ProductImage');
    if (!hasProductImage && url !== '/' && url !== '/404/' && url !== '/guides/') {
      pagesWithoutProductImage++;
    }

    // Review quality: check for cons
    if (isReview) {
      // Look for cons section markers
      const hasCons = html.includes('Cons') || html.includes('cons') || html.includes('Weaknesses') || html.includes('❌') || html.includes('✗');
      if (!hasCons) reviewsWithoutCons.push(url);
    }
  }

  // 5.1 Placeholder text
  checks.push({ id: '5.1.no-placeholder', label: `No placeholder text remaining (${placeholderCount} found)`, status: placeholderCount === 0 ? 'pass' : 'fail', detail: placeholderCount === 0 ? 'Clean' : `Found on: ${placeholderPages.join(', ')}` });

  // 5.1 Content length
  checks.push({ id: '5.1.content-length', label: `Content length meets minimums (${thinPages.length} thin)`, status: thinPages.length === 0 ? 'pass' : 'warn', detail: thinPages.length === 0 ? 'All substantial' : `Thin: ${thinPages.slice(0, 5).join('; ')}` });

  // 5.1 ProductImage
  checks.push({ id: '5.1.product-image', label: `ProductImage on content pages (${pagesWithoutProductImage} missing)`, status: pagesWithoutProductImage === 0 ? 'pass' : 'warn', detail: pagesWithoutProductImage === 0 ? 'All present' : `${pagesWithoutProductImage} pages without ProductImage` });

  // 5.2 Review quality
  checks.push({ id: '5.2.reviews-have-cons', label: `Every review has cons (${reviewsWithoutCons.length} missing)`, status: reviewsWithoutCons.length === 0 ? 'pass' : 'fail', detail: reviewsWithoutCons.length === 0 ? 'All have cons' : `Missing: ${reviewsWithoutCons.slice(0, 5).join(', ')}` });

  // Check affiliate disclosure in footer
  let footerDisclosure = 0;
  for (const file of htmlFiles) {
    const html = await readHtml(file);
    if (html.includes('Amazon Associate') || html.includes('amazon associate')) footerDisclosure++;
  }
  checks.push({ id: '5.4.affiliate-disclosure', label: `Affiliate disclosure present (${footerDisclosure}/${htmlFiles.length})`, status: footerDisclosure >= htmlFiles.length * 0.95 ? 'pass' : 'fail', detail: `${footerDisclosure} of ${htmlFiles.length} pages have disclosure` });

  return checks;
}

// ─── Run All Automated Checks ─────────────────────────────
async function runAllAutomated() {
  const results = await loadResults();
  const startTime = Date.now();

  console.log('\n  Running Section 1: Build & Infrastructure...');
  results.sections['1'] = await runSection1();
  console.log(`    ${results.sections['1'].filter(c => c.status === 'pass').length}/${results.sections['1'].length} passed`);

  console.log('  Running Section 2: On-Page SEO...');
  results.sections['2'] = await runSection2();
  console.log(`    ${results.sections['2'].filter(c => c.status === 'pass').length}/${results.sections['2'].length} passed`);

  console.log('  Running Section 3: Structured Data & Schema...');
  results.sections['3'] = await runSection3();
  console.log(`    ${results.sections['3'].filter(c => c.status === 'pass').length}/${results.sections['3'].length} passed`);

  console.log('  Running Section 4: Internal Linking...');
  results.sections['4'] = await runSection4();
  console.log(`    ${results.sections['4'].filter(c => c.status === 'pass').length}/${results.sections['4'].length} passed`);

  console.log('  Running Section 5: Content Quality...');
  results.sections['5'] = await runSection5();
  console.log(`    ${results.sections['5'].filter(c => c.status === 'pass').length}/${results.sections['5'].length} passed`);

  await saveResults(results);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  // Summary
  let totalPass = 0, totalFail = 0, totalWarn = 0;
  for (const s of Object.values(results.sections)) {
    for (const c of s) {
      if (c.status === 'pass') totalPass++;
      else if (c.status === 'fail') totalFail++;
      else if (c.status === 'warn') totalWarn++;
    }
  }

  console.log('');
  console.log(`  Done in ${elapsed}s — ${totalPass} passed, ${totalFail} failed, ${totalWarn} warnings`);
  console.log(`  Results saved to checklist-results.json`);
  console.log('');

  return results;
}

// ─── Manual Check Sections (metadata for UI) ──────────────
const MANUAL_SECTIONS = [
  {
    id: '6', title: 'Performance & Core Web Vitals',
    description: 'Run Lighthouse and PageSpeed Insights on 5 representative pages.',
    items: [
      'Lighthouse Performance >= 90 on all 5 pages',
      'Lighthouse Accessibility >= 90 on all 5 pages',
      'Lighthouse Best Practices >= 90 on all 5 pages',
      'Lighthouse SEO >= 95 on all 5 pages',
      'LCP < 2.5s on all tested pages',
      'CLS < 0.1 on all tested pages',
      'No render-blocking resources flagged',
      'No console errors in DevTools',
    ]
  },
  {
    id: '7', title: 'Structured Data Validation (Tools)',
    description: 'Use Google Rich Results Test and Schema.org Validator.',
    items: [
      'Zero errors in Google Rich Results Test (8 URLs)',
      'Product pages eligible for Product rich results',
      'FAQ pages eligible for FAQ rich results',
      'Breadcrumbs detected on all pages',
      'Schema.org Validator: zero errors',
      'Social preview (opengraph.xyz) shows correct title/image',
    ]
  },
  {
    id: '8', title: 'Security & Headers',
    description: 'Check SecurityHeaders.com grade and SSL/HTTPS.',
    items: [
      'SecurityHeaders.com grade A or A+',
      'All security headers present (CSP, HSTS, X-Frame-Options, etc.)',
      'HTTPS on all pages (lock icon)',
      'HTTP redirects to HTTPS',
      'No mixed content warnings',
      'CSP allows Buttondown form submission',
      'CSP allows Google Fonts',
      'No CSP violation errors in console',
    ]
  },
  {
    id: '9', title: 'Accessibility',
    description: 'Test keyboard navigation, visual accessibility, screen reader.',
    items: [
      'Tab reaches all interactive elements',
      'Focus indicators visible',
      'Skip navigation link works',
      'No keyboard traps',
      'Mobile menu is keyboard-accessible',
      'Text readable at 320px to 1920px',
      'Content usable at 200% browser zoom',
      'prefers-reduced-motion disables animations',
      'Color is not sole means of info',
      'Button text is readable on all backgrounds',
    ]
  },
  {
    id: '10', title: 'Robots, Sitemap & Crawl Readiness',
    description: 'Verify robots.txt, sitemap, llms.txt, and 404 handling.',
    items: [
      'robots.txt accessible and correct',
      'Sitemap accessible with all URLs',
      'Sitemap URLs match canonical URLs',
      'llms.txt accessible with all pages listed',
      'Custom 404 page with proper 404 status code',
      'AI crawlers explicitly allowed in robots.txt',
    ]
  },
  {
    id: '11', title: 'Images & Media',
    description: 'Verify product photos, editorial images, and responsive variants.',
    items: [
      'Every product has a hero image',
      'Product images render with radial CSS mask',
      'All images have 3 responsive variants',
      'Editorial images render full-width cover',
      'No SVG placeholders remaining on any page',
      'All images in WebP format',
      'All images have descriptive alt text',
      'Image file sizes < 200KB',
    ]
  },
  {
    id: '12', title: 'Google Search Console',
    description: 'Submit site to GSC and monitor indexing progress.',
    items: [
      'Site live at production URL',
      'DNS fully propagated',
      'GSC property added and verified',
      'Sitemap submitted — status: Success',
      'URL Inspection run on 5 priority pages',
      'Week 1: pages appearing in Indexed',
      'Week 2: majority indexed (>50%)',
      'Week 4: 95%+ indexed',
    ]
  },
];

// ─── Dashboard HTML ───────────────────────────────────────
function getDashboardHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>OffGrid Filters — Launch Checklist</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0b0e14;--card:#121922;--border:#272f3c;--primary:#2490cc;--primary-dim:#1a6d99;
--accent:#f09520;--text:#f0f2f4;--muted:#858d99;--success:#22c55e;--error:#ef4444;--warn:#eab308;--radius:10px}
body{font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;min-height:100vh}
a{color:var(--primary);text-decoration:none}a:hover{text-decoration:underline}

header{position:sticky;top:0;z-index:50;background:rgba(11,14,20,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:.75rem 1.5rem}
.header-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
.header-inner h1{font-size:1rem;font-weight:700;white-space:nowrap}
.header-inner h1 span{color:var(--primary)}
.controls{display:flex;align-items:center;gap:.5rem;margin-left:auto}
.btn{padding:.45rem .9rem;border:none;border-radius:var(--radius);font-size:.8rem;font-weight:600;cursor:pointer;transition:all .15s}
.btn-primary{background:var(--primary);color:#fff}.btn-primary:hover{background:var(--primary-dim)}
.btn-accent{background:var(--accent);color:#fff}.btn-accent:hover{opacity:.9}
.btn-ghost{background:transparent;color:var(--muted);border:1px solid var(--border)}.btn-ghost:hover{color:var(--text);border-color:var(--muted)}
.btn:disabled{opacity:.4;cursor:not-allowed}

.summary{max-width:1200px;margin:1rem auto;padding:0 1.5rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:center}
.summary-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:.6rem 1rem;text-align:center;min-width:100px}
.summary-card .num{font-size:1.5rem;font-weight:800}
.summary-card .lbl{font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:.5px}
.num-pass{color:var(--success)}.num-fail{color:var(--error)}.num-warn{color:var(--warn)}.num-total{color:var(--primary)}
.progress-bar{flex:1;min-width:200px;height:8px;background:var(--card);border-radius:4px;overflow:hidden;border:1px solid var(--border)}
.progress-fill{height:100%;background:linear-gradient(90deg,var(--primary),var(--success));transition:width .4s;border-radius:4px}

.status-banner{max-width:1200px;margin:.5rem auto;padding:.5rem 1.5rem;display:none}
.status-banner.active{display:flex;align-items:center;gap:.75rem;padding:.6rem 1rem;background:var(--card);border:1px solid var(--accent);border-radius:var(--radius);font-size:.85rem;color:var(--accent)}
.spinner{width:18px;height:18px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}

main{max-width:1200px;margin:0 auto;padding:1.5rem}

.section{margin-bottom:1.5rem}
.section-header{display:flex;align-items:center;gap:.6rem;padding:.65rem 1rem;background:var(--card);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;user-select:none;transition:border-color .15s}
.section-header:hover{border-color:var(--primary)}
.section-header .badge{font-size:.65rem;padding:.15rem .45rem;border-radius:99px;font-weight:600;margin-left:.25rem}
.badge-pass{background:var(--success);color:#fff}.badge-fail{background:var(--error);color:#fff}.badge-warn{background:var(--warn);color:#000}.badge-info{background:var(--border);color:var(--muted)}
.section-header .num-badge{font-size:.7rem;padding:.1rem .4rem;border-radius:99px;background:var(--bg);color:var(--muted)}
.section-header h2{font-size:.9rem;font-weight:600;flex:1}
.section-header .arrow{color:var(--muted);transition:transform .2s;font-size:.7rem}
.section-header.collapsed .arrow{transform:rotate(-90deg)}
.section-body{margin-top:.5rem;display:grid;gap:.35rem}
.section-body.hidden{display:none}

.check-item{display:flex;align-items:flex-start;gap:.6rem;padding:.45rem .8rem;background:var(--card);border:1px solid var(--border);border-radius:8px;font-size:.82rem;transition:border-color .15s}
.check-item:hover{border-color:hsl(205 30% 25%)}
.check-icon{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.65rem;flex-shrink:0;margin-top:2px}
.icon-pass{background:var(--success);color:#fff}.icon-fail{background:var(--error);color:#fff}.icon-warn{background:var(--warn);color:#000}.icon-info{background:var(--border);color:var(--muted)}.icon-pending{background:var(--border);color:var(--muted)}
.check-text{flex:1;min-width:0}
.check-label{font-weight:500}
.check-detail{font-size:.72rem;color:var(--muted);margin-top:.1rem;word-break:break-word}

.manual-item{display:flex;align-items:center;gap:.6rem;padding:.5rem .8rem;background:var(--card);border:1px solid var(--border);border-radius:8px;font-size:.82rem}
.manual-item .check-text{flex:1}
.manual-btns{display:flex;gap:.3rem;flex-shrink:0}
.manual-btns .btn{font-size:.7rem;padding:.25rem .5rem}
.btn-sm-pass{background:transparent;color:var(--success);border:1px solid var(--success)}.btn-sm-pass.active{background:var(--success);color:#fff}
.btn-sm-fail{background:transparent;color:var(--error);border:1px solid var(--error)}.btn-sm-fail.active{background:var(--error);color:#fff}
.btn-sm-na{background:transparent;color:var(--muted);border:1px solid var(--border)}.btn-sm-na.active{background:var(--border);color:var(--text)}

.section-desc{font-size:.75rem;color:var(--muted);padding:0 .8rem;margin-bottom:.4rem}

.toast-container{position:fixed;bottom:1.5rem;right:1.5rem;z-index:100;display:flex;flex-direction:column;gap:.5rem}
.toast{padding:.5rem .9rem;background:var(--card);border:1px solid var(--border);border-radius:var(--radius);font-size:.8rem;animation:slide-in .3s;max-width:340px}
.toast-success{border-color:var(--success)}.toast-error{border-color:var(--error)}
@keyframes slide-in{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
</style>
</head>
<body>

<header>
<div class="header-inner">
  <h1><span>OffGrid Filters</span> — Launch Checklist</h1>
  <div class="controls">
    <button class="btn btn-ghost" id="resetBtn" onclick="resetResults()">Reset</button>
    <button class="btn btn-accent" id="runBtn" onclick="runAutomated()">Run Automated Checks (S1-S5)</button>
    <select id="exportFilter" style="background:var(--card);color:var(--text);border:1px solid var(--border);padding:.4rem .5rem;border-radius:var(--radius);font-size:.75rem">
      <option value="all">Full Report</option>
      <option value="issues">Failures + Warnings</option>
      <option value="fail">Failures Only</option>
      <option value="warn">Warnings Only</option>
    </select>
    <button class="btn btn-ghost" onclick="exportReport()">Export</button>
  </div>
</div>
</header>

<div class="summary" id="summaryBar">
  <div class="summary-card"><div class="num num-pass" id="sumPass">-</div><div class="lbl">Passed</div></div>
  <div class="summary-card"><div class="num num-fail" id="sumFail">-</div><div class="lbl">Failed</div></div>
  <div class="summary-card"><div class="num num-warn" id="sumWarn">-</div><div class="lbl">Warnings</div></div>
  <div class="summary-card"><div class="num num-total" id="sumTotal">-</div><div class="lbl">Total</div></div>
  <div class="progress-bar"><div class="progress-fill" id="progressFill" style="width:0%"></div></div>
</div>

<div class="status-banner" id="statusBanner">
  <div class="spinner"></div>
  <span id="statusText">Running automated checks...</span>
</div>

<main id="app">
  <div style="text-align:center;padding:3rem;color:var(--muted)">Loading checklist data...</div>
</main>

<div class="toast-container" id="toasts"></div>

<script>
let state = { sections: {}, manual: {}, lastRun: null };

const SECTION_META = {
  '1': { title: 'Build & Infrastructure', auto: true },
  '2': { title: 'On-Page SEO', auto: true },
  '3': { title: 'Structured Data & Schema', auto: true },
  '4': { title: 'Internal Linking & Architecture', auto: true },
  '5': { title: 'Content Quality', auto: true },
  '6': { title: 'Performance & Core Web Vitals', auto: false },
  '7': { title: 'Structured Data Validation', auto: false },
  '8': { title: 'Security & Headers', auto: false },
  '9': { title: 'Accessibility', auto: false },
  '10': { title: 'Robots, Sitemap & Crawl', auto: false },
  '11': { title: 'Images & Media', auto: false },
  '12': { title: 'Google Search Console', auto: false },
};

const MANUAL_SECTIONS = ${JSON.stringify(MANUAL_SECTIONS)};

function toast(msg, type='info') {
  const el = document.createElement('div');
  el.className = 'toast toast-' + type;
  el.textContent = msg;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

async function loadState() {
  try {
    const r = await fetch('/api/results');
    state = await r.json();
  } catch { state = { sections: {}, manual: {}, lastRun: null }; }
  render();
}

function updateSummary() {
  let pass=0, fail=0, warn=0, total=0;
  for (const [k,checks] of Object.entries(state.sections)) {
    for (const c of checks) {
      total++;
      if (c.status==='pass') pass++;
      else if (c.status==='fail') fail++;
      else if (c.status==='warn') warn++;
    }
  }
  for (const [k,v] of Object.entries(state.manual||{})) {
    total++;
    if (v==='pass') pass++;
    else if (v==='fail') fail++;
  }
  document.getElementById('sumPass').textContent=pass;
  document.getElementById('sumFail').textContent=fail;
  document.getElementById('sumWarn').textContent=warn;
  document.getElementById('sumTotal').textContent=total;
  document.getElementById('progressFill').style.width = total ? (pass/total*100)+'%' : '0%';
}

function render() {
  const app = document.getElementById('app');
  let html = '';

  // Automated sections 1-5
  for (let i=1; i<=5; i++) {
    const sid = ''+i;
    const meta = SECTION_META[sid];
    const checks = state.sections[sid] || [];
    const passCount = checks.filter(c=>c.status==='pass').length;
    const failCount = checks.filter(c=>c.status==='fail').length;
    const warnCount = checks.filter(c=>c.status==='warn').length;

    html += '<div class="section">';
    html += '<div class="section-header" onclick="toggleSection(this)">';
    html += '<span class="num-badge">S'+sid+'</span>';
    html += '<h2>'+meta.title+'</h2>';
    if (checks.length) {
      if (failCount) html += '<span class="badge badge-fail">'+failCount+' fail</span>';
      if (warnCount) html += '<span class="badge badge-warn">'+warnCount+' warn</span>';
      html += '<span class="badge badge-pass">'+passCount+'/'+checks.length+'</span>';
    } else {
      html += '<span class="badge badge-info">Not run</span>';
    }
    html += '<span class="arrow">▼</span>';
    html += '</div>';
    html += '<div class="section-body'+(checks.length?'':' hidden')+'">';
    if (!checks.length) {
      html += '<div class="check-item"><div class="check-icon icon-pending">?</div><div class="check-text"><div class="check-label">Click "Run Automated Checks" to start</div></div></div>';
    }
    for (const c of checks) {
      const iconCls = c.status==='pass'?'icon-pass':c.status==='fail'?'icon-fail':c.status==='warn'?'icon-warn':'icon-info';
      const iconChar = c.status==='pass'?'✓':c.status==='fail'?'✗':c.status==='warn'?'!':'i';
      html += '<div class="check-item">';
      html += '<div class="check-icon '+iconCls+'">'+iconChar+'</div>';
      html += '<div class="check-text"><div class="check-label">'+esc(c.label)+'</div>';
      if (c.detail) html += '<div class="check-detail">'+esc(c.detail)+'</div>';
      html += '</div></div>';
    }
    html += '</div></div>';
  }

  // Manual sections 6-12
  for (const ms of MANUAL_SECTIONS) {
    const sid = ms.id;
    const meta = SECTION_META[sid];
    let passCount=0, failCount=0, total=ms.items.length;
    for (let j=0;j<ms.items.length;j++) {
      const key=sid+'.'+j;
      const v=state.manual?.[key];
      if (v==='pass') passCount++;
      if (v==='fail') failCount++;
    }

    html += '<div class="section">';
    html += '<div class="section-header collapsed" onclick="toggleSection(this)">';
    html += '<span class="num-badge">S'+sid+'</span>';
    html += '<h2>'+meta.title+'</h2>';
    if (passCount||failCount) {
      if (failCount) html += '<span class="badge badge-fail">'+failCount+' fail</span>';
      html += '<span class="badge badge-pass">'+passCount+'/'+total+'</span>';
    } else {
      html += '<span class="badge badge-info">Manual</span>';
    }
    html += '<span class="arrow">▼</span>';
    html += '</div>';
    html += '<div class="section-body hidden">';
    html += '<div class="section-desc">'+esc(ms.description)+'</div>';
    for (let j=0;j<ms.items.length;j++) {
      const key=sid+'.'+j;
      const v=state.manual?.[key]||'';
      html += '<div class="manual-item">';
      html += '<div class="check-text"><div class="check-label">'+esc(ms.items[j])+'</div></div>';
      html += '<div class="manual-btns">';
      html += '<button class="btn btn-sm-pass'+(v==='pass'?' active':'')+'" onclick="setManual(\\''+key+'\\',\\'pass\\')">Pass</button>';
      html += '<button class="btn btn-sm-fail'+(v==='fail'?' active':'')+'" onclick="setManual(\\''+key+'\\',\\'fail\\')">Fail</button>';
      html += '<button class="btn btn-sm-na'+(v==='na'?' active':'')+'" onclick="setManual(\\''+key+'\\',\\'na\\')">N/A</button>';
      html += '</div></div>';
    }
    html += '</div></div>';
  }

  app.innerHTML = html;
  updateSummary();
}

function toggleSection(el) {
  el.classList.toggle('collapsed');
  el.nextElementSibling.classList.toggle('hidden');
}

async function setManual(key, value) {
  if (!state.manual) state.manual = {};
  state.manual[key] = state.manual[key] === value ? '' : value;
  try {
    await fetch('/api/manual', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({key, value: state.manual[key]})
    });
  } catch(e) { toast('Save error: '+e.message,'error'); }
  render();
}

async function runAutomated() {
  const btn = document.getElementById('runBtn');
  const banner = document.getElementById('statusBanner');
  btn.disabled = true;
  btn.textContent = 'Running...';
  banner.classList.add('active');
  document.getElementById('statusText').textContent = 'Running automated checks (Sections 1-5)... This may take a few minutes.';

  try {
    const r = await fetch('/api/run', {method:'POST'});
    const data = await r.json();
    if (data.error) throw new Error(data.error);
    state = data;
    toast('Automated checks complete!','success');
  } catch(e) {
    toast('Error: '+e.message,'error');
  }

  btn.disabled = false;
  btn.textContent = 'Run Automated Checks (S1-S5)';
  banner.classList.remove('active');
  render();
}

async function exportReport() {
  const filter = document.getElementById('exportFilter').value;
  try {
    const r = await fetch('/api/report?filter='+filter);
    const text = await r.text();
    const blob = new Blob([text], {type:'text/markdown'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const suffix = filter === 'all' ? '' : '-'+filter;
    a.download = 'checklist-report'+suffix+'-'+new Date().toISOString().slice(0,10)+'.md';
    a.click();
    URL.revokeObjectURL(url);
    toast('Report downloaded ('+filter+')','success');
  } catch(e) { toast('Export error: '+e.message,'error'); }
}

async function resetResults() {
  if (!confirm('Clear all checklist results and start fresh?')) return;
  try {
    const r = await fetch('/api/reset', {method:'POST'});
    state = await r.json();
    toast('Results cleared — ready for a fresh run','success');
  } catch(e) { toast('Reset error: '+e.message,'error'); }
  render();
}

function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

loadState();
</script>
</body>
</html>`;
}

// ─── Report Generator ─────────────────────────────────────
// filter: 'all' (default), 'fail', 'warn', 'issues' (fail+warn)
function generateReport(results, filter = 'all') {
  const filterLabel = { all: 'Full Report', fail: 'Failures Only', warn: 'Warnings Only', issues: 'Failures + Warnings' }[filter] || 'Full Report';
  const lines = [
    `# Launch Checklist Report — ${filterLabel}`,
    `Generated: ${new Date().toISOString()}`,
    '',
  ];

  function includeCheck(status) {
    if (filter === 'all') return true;
    if (filter === 'fail') return status === 'fail';
    if (filter === 'warn') return status === 'warn';
    if (filter === 'issues') return status === 'fail' || status === 'warn';
    return true;
  }

  // Automated sections
  for (let i = 1; i <= 5; i++) {
    const checks = results.sections['' + i] || [];
    const filtered = checks.filter(c => includeCheck(c.status));
    if (filter !== 'all' && filtered.length === 0) continue;
    const pass = checks.filter(c => c.status === 'pass').length;
    lines.push(`## Section ${i}: ${['','Build & Infrastructure','On-Page SEO','Structured Data','Internal Linking','Content Quality'][i]}`);
    lines.push(`**${pass}/${checks.length} passed**`);
    lines.push('');
    for (const c of filtered) {
      const icon = c.status === 'pass' ? '[PASS]' : c.status === 'fail' ? '[FAIL]' : '[WARN]';
      lines.push(`- ${icon} ${c.label}`);
      if (c.detail && c.status !== 'pass') lines.push(`  - ${c.detail}`);
    }
    lines.push('');
  }

  // Manual sections
  for (const ms of MANUAL_SECTIONS) {
    const items = [];
    for (let j = 0; j < ms.items.length; j++) {
      const key = ms.id + '.' + j;
      const v = results.manual?.[key] || 'pending';
      if (!includeCheck(v === 'fail' ? 'fail' : v === 'pass' ? 'pass' : 'pending')) continue;
      const icon = v === 'pass' ? '[PASS]' : v === 'fail' ? '[FAIL]' : v === 'na' ? '[N/A]' : '[ ]';
      items.push(`- ${icon} ${ms.items[j]}`);
    }
    if (filter !== 'all' && items.length === 0) continue;
    lines.push(`## Section ${ms.id}: ${ms.title}`);
    lines.push(...items);
    lines.push('');
  }

  return lines.join('\n');
}

// ─── HTTP Server ──────────────────────────────────────────
function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString());
}

function startServer() {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const path = url.pathname;

    if (req.method === 'OPTIONS') {
      res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
      return res.end();
    }

    try {
      // Dashboard
      if (path === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(getDashboardHTML());
      }

      // API: Get results
      if (path === '/api/results' && req.method === 'GET') {
        const results = await loadResults();
        return json(res, 200, results);
      }

      // API: Reset — clear all saved results
      if (path === '/api/reset' && req.method === 'POST') {
        const fresh = { lastRun: null, sections: {}, manual: {} };
        await saveResults(fresh);
        return json(res, 200, fresh);
      }

      // API: Run automated checks
      if (path === '/api/run' && req.method === 'POST') {
        const results = await runAllAutomated();
        return json(res, 200, results);
      }

      // API: Set manual check
      if (path === '/api/manual' && req.method === 'POST') {
        const body = await readBody(req);
        const results = await loadResults();
        if (!results.manual) results.manual = {};
        results.manual[body.key] = body.value;
        await saveResults(results);
        return json(res, 200, { ok: true });
      }

      // API: Export report — accepts ?filter=all|fail|warn|issues
      if (path === '/api/report' && req.method === 'GET') {
        const filter = url.searchParams.get('filter') || 'all';
        const results = await loadResults();
        const report = generateReport(results, filter);
        res.writeHead(200, { 'Content-Type': 'text/markdown; charset=utf-8' });
        return res.end(report);
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
    console.log('  ╔═══════════════════════════════════════════════╗');
    console.log('  ║  OffGrid Filters — Launch Checklist Runner     ║');
    console.log(`  ║  http://localhost:${PORT}/                        ║`);
    console.log('  ╚═══════════════════════════════════════════════╝');
    console.log('');
    console.log('  Sections 1-5:  Automated (click "Run" in the UI)');
    console.log('  Sections 6-12: Manual (pass/fail each item in the UI)');
    console.log('  Results saved to: checklist-results.json');
    console.log('');
  });
}

// ─── CLI Auto Mode ────────────────────────────────────────
async function autoMode() {
  console.log('');
  console.log('  OffGrid Filters — Launch Checklist (CLI Mode)');
  console.log('  ═══════════════════════════════════════════════');
  const results = await runAllAutomated();

  let totalFail = 0;
  for (const s of Object.values(results.sections)) {
    totalFail += s.filter(c => c.status === 'fail').length;
  }

  // Print failures
  if (totalFail > 0) {
    console.log('  ── Failures ──');
    for (const [sid, checks] of Object.entries(results.sections)) {
      for (const c of checks) {
        if (c.status === 'fail') {
          console.log(`  [FAIL] S${sid}: ${c.label}`);
          if (c.detail) console.log(`         ${c.detail}`);
        }
      }
    }
    console.log('');
  }

  process.exit(totalFail > 0 ? 1 : 0);
}

// ─── Main ─────────────────────────────────────────────────
if (process.argv.includes('--auto')) {
  await autoMode();
} else {
  startServer();
}
