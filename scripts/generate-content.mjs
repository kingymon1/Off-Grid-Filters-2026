#!/usr/bin/env node
/**
 * Content Generation Script
 * =========================
 * Reads content-queue.yaml, generates new .astro pages using the Claude API,
 * patches config.ts and image-map.ts, and generates placeholder images.
 *
 * Usage:
 *   node scripts/generate-content.mjs            # Generate pending content
 *   node scripts/generate-content.mjs --dry-run   # Preview without writing files
 *
 * Requires ANTHROPIC_API_KEY in .env
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const ROOT = new URL('../', import.meta.url).pathname;
const QUEUE_PATH = join(ROOT, 'content-queue.yaml');
const DRY_RUN = process.argv.includes('--dry-run');

// ── Simple YAML parser (handles our flat queue format) ──────
function parseQueue(yamlStr) {
  const result = { enabled: false, queue: [] };

  // Parse enabled flag
  const enabledMatch = yamlStr.match(/^enabled:\s*(true|false)/m);
  if (enabledMatch) {
    result.enabled = enabledMatch[1] === 'true';
  }

  // Parse queue items — split on `- type:` boundaries
  const itemBlocks = yamlStr.split(/(?=^\s*- type:)/m).filter(b => b.match(/^\s*- type:/));

  for (const block of itemBlocks) {
    // Skip commented-out items
    if (block.match(/^\s*#\s*- type:/)) continue;

    const item = {};
    const lines = block.split('\n');
    for (const line of lines) {
      // Skip comments and blank lines
      if (line.match(/^\s*#/) || !line.trim()) continue;

      const kvMatch = line.match(/^\s*-?\s*(\w[\w_]*):\s*"?([^"#]*)"?\s*(?:#.*)?$/);
      if (kvMatch) {
        const key = kvMatch[1].trim();
        let value = kvMatch[2].trim();
        // Remove trailing quotes
        value = value.replace(/^["']|["']$/g, '');
        item[key] = value;
      }
    }

    if (item.type && item.status) {
      result.queue.push(item);
    }
  }

  return result;
}

// ── Update queue YAML to mark items as generated ────────────
function markGenerated(slug) {
  let yaml = readFileSync(QUEUE_PATH, 'utf-8');
  // Find the block for this slug and change status to generated
  const pattern = new RegExp(
    `(slug:\\s*["']?${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']?\\s*\\n(?:.*\\n)*?\\s*status:\\s*)pending`,
    'm'
  );
  // Try slug before status
  const pattern2 = new RegExp(
    `(status:\\s*)pending(\\s*\\n(?:.*\\n)*?\\s*slug:\\s*["']?${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']?)`,
    'm'
  );

  if (yaml.match(pattern)) {
    yaml = yaml.replace(pattern, '$1generated');
  } else if (yaml.match(pattern2)) {
    yaml = yaml.replace(pattern2, '$1generated$2');
  }

  writeFileSync(QUEUE_PATH, yaml, 'utf-8');
}

// ── Load product data from config.ts (simple extraction) ────
function loadProductData(slug) {
  const config = readFileSync(join(ROOT, 'src/lib/config.ts'), 'utf-8');

  // Find the product block by slug
  const slugPattern = new RegExp(`slug: '${slug}'`);
  const match = config.match(slugPattern);
  if (!match) return null;

  // Extract a rough block around the match
  const startIdx = config.lastIndexOf('{', match.index);
  let braceCount = 0;
  let endIdx = startIdx;
  for (let i = startIdx; i < config.length; i++) {
    if (config[i] === '{') braceCount++;
    if (config[i] === '}') braceCount--;
    if (braceCount === 0) { endIdx = i + 1; break; }
  }

  return config.slice(startIdx, endIdx);
}

// ── Build AI prompt for content generation ──────────────────
function buildPrompt(item, templateContent, productDataA, productDataB) {
  const year = new Date().getFullYear();

  let prompt = `You are an expert content writer for OffGrid Filters, a water filter review authority site.

IMPORTANT RULES:
- Write in first person plural ("we tested", "we recommend")
- Every section starts with a direct answer (BLUF — Bottom Line Up Front)
- Be honest — every product has real pros AND cons
- Use specific data and measurements, not vague claims
- No hard-sell language. Use "Check Price" not "Buy Now"
- All Amazon links must have rel="nofollow sponsored noopener" and target="_blank"
- Use getAffiliateUrl(product.asin) for Amazon links
- Include proper schema setup (Article + FAQ)
- Include entity linking in Article schema (about/mentions with sameAs URLs)
- The Wikidata entity for water filtration is: https://www.wikidata.org/entity/Q842467
- Every page needs exactly 4 related articles
- Content must be 1500+ words for comparisons, 2000+ for guides
- Include 4-6 FAQs with detailed answers

Here is an example page of this content type. Your output must follow the EXACT same structure — same imports, same components, same schema setup, same style block:

--- TEMPLATE START ---
${templateContent}
--- TEMPLATE END ---

`;

  switch (item.type) {
    case 'comparison':
      prompt += `
Generate a NEW comparison page for: ${item.slug}

Product A data:
${productDataA || 'Not found — use slug: ' + item.productA}

Product B data:
${productDataB || 'Not found — use slug: ' + item.productB}

REQUIREMENTS:
- The comparison slug in the code must be: '${item.slug}'
- Product A slug: '${item.productA}', Product B slug: '${item.productB}'
- Each product must win some categories — NO one-sided comparisons
- Include a verdict-card at the top with a clear winner and reasoning
- Include 5-6 comparison categories with winner-badge divs
- Include "Who Should Get Which?" section with recommendation cards
- Include ComparisonTable component
- Include FAQPage schema
- publishDate is '${item.target_date}'
`;
      break;

    case 'activity-guide':
      prompt += `
Generate a NEW activity guide page.

Title: ${item.title}
Slug: ${item.slug}
Description: ${item.description}

REQUIREMENTS:
- The guide slug in the code must be: '${item.slug}'
- Include ProductImage with appropriate icon and slug
- Recommend 3-5 products from the existing catalog with getProductBySlug()
- Include ProTip components for expert advice
- Include EmailCapture component with tag="activity-guide" at the end
- Include FAQPage schema with 5-7 questions
- publishDate is '${item.target_date}'
- This is an activity guide (type: 'activity' in config)
`;
      break;

    case 'buyer-guide':
      prompt += `
Generate a NEW buyer guide page.

Title: ${item.title}
Slug: ${item.slug}
Description: ${item.description}

REQUIREMENTS:
- The guide slug in the code must be: '${item.slug}'
- This goes in src/pages/guides/ directory
- Include ProductImage with appropriate icon and slug
- Reference specific products from the catalog where relevant
- Include ProTip and Callout components
- Include EmailCapture component with tag="buying-guide" at the end
- Include FAQPage schema with 5-7 questions
- publishDate is '${item.target_date}'
- This is a buyer guide (type: 'buyer' in config)
`;
      break;

    case 'knowledge':
      prompt += `
Generate a NEW knowledge base article.

Title: ${item.title}
Slug: ${item.slug}
Description: ${item.description}

REQUIREMENTS:
- The guide slug in the code must be: '${item.slug}'
- Include ProductImage with appropriate icon and slug
- Educational, reference-style content
- Link to relevant product reviews where appropriate
- Include ProTip components
- NO EmailCapture on knowledge base pages
- Include FAQPage schema with 5-7 questions
- publishDate is '${item.target_date}'
- This is a knowledge base article (type: 'knowledge' in config)
`;
      break;
  }

  prompt += `
Output ONLY the complete .astro file content. No markdown fences, no explanation.
Start with --- and end with the closing </style> tag (or closing layout tag if no styles needed).`;

  return prompt;
}

// ── Call Claude API ──────────────────────────────────────────
async function generateWithClaude(prompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not set. Add it to .env or set as environment variable.');
  }

  console.log('  Calling Claude API...');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error (${response.status}): ${error}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) {
    throw new Error('No content in Claude API response');
  }

  return text;
}

// ── Main ────────────────────────────────────────────────────
async function main() {
  console.log('Content Generation Pipeline');
  console.log('===========================\n');

  // Read and parse queue
  if (!existsSync(QUEUE_PATH)) {
    console.log('No content-queue.yaml found. Nothing to do.');
    process.exit(0);
  }

  const yamlStr = readFileSync(QUEUE_PATH, 'utf-8');
  const queue = parseQueue(yamlStr);

  // Check enabled toggle
  if (!queue.enabled) {
    console.log('Content generation is DISABLED (enabled: false in content-queue.yaml).');
    console.log('Set enabled: true to activate the pipeline.');
    process.exit(0);
  }

  // Filter pending items
  const pending = queue.queue.filter(item => item.status === 'pending');
  if (pending.length === 0) {
    console.log('No pending items in queue. Nothing to generate.');
    process.exit(0);
  }

  console.log(`Found ${pending.length} pending item(s) to generate.\n`);

  if (DRY_RUN) {
    console.log('DRY RUN — previewing what would be generated:\n');
    for (const item of pending) {
      console.log(`  [${item.type}] ${item.slug}`);
      console.log(`    Target date: ${item.target_date}`);
      if (item.title) console.log(`    Title: ${item.title}`);
      if (item.productA) console.log(`    Products: ${item.productA} vs ${item.productB}`);
    }
    console.log('\nDry run complete. No files were modified.');
    process.exit(0);
  }

  // Lazy-import modules (only needed for actual generation)
  const { readTemplate, getOutputDir, getOutputFilename } = await import('./lib/template-reader.mjs');
  const { registerContent } = await import('./lib/config-patcher.mjs');

  let generated = 0;

  for (const item of pending) {
    console.log(`\n[${ generated + 1}/${pending.length}] Generating: ${item.type} — ${item.slug}`);

    try {
      // 1. Read template
      const template = readTemplate(item.type);
      console.log(`  Template: ${template.path}`);

      // 2. Load product data for comparisons
      let productDataA = null;
      let productDataB = null;
      if (item.type === 'comparison') {
        productDataA = loadProductData(item.productA);
        productDataB = loadProductData(item.productB);
        if (!productDataA) console.log(`  WARNING: Product "${item.productA}" not found in config`);
        if (!productDataB) console.log(`  WARNING: Product "${item.productB}" not found in config`);
      }

      // 3. Generate content with Claude API
      const prompt = buildPrompt(item, template.content, productDataA, productDataB);
      const pageContent = await generateWithClaude(prompt);

      // 4. Write the .astro file
      const outputDir = getOutputDir(item.type);
      const outputFile = join(outputDir, getOutputFilename(item.type, item.slug));

      // Clean up any markdown fences the AI might have added
      let cleanContent = pageContent;
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\w*\n/, '').replace(/\n```$/, '');
      }

      writeFileSync(outputFile, cleanContent, 'utf-8');
      console.log(`  Wrote: ${outputFile}`);

      // 5. Register in config.ts and image-map.ts
      registerContent(item);

      // 6. Mark as generated in queue
      markGenerated(item.slug);
      console.log(`  Marked as generated in queue`);

      generated++;
    } catch (err) {
      console.error(`  ERROR generating ${item.slug}: ${err.message}`);
      // Continue with next item
    }
  }

  console.log(`\n===========================`);
  console.log(`Generated ${generated}/${pending.length} items.`);

  // 7. Generate placeholder images for new pages
  if (generated > 0) {
    console.log('\nGenerating placeholder images for new pages...');
    try {
      execSync('node scripts/generate-local-images.mjs', { cwd: ROOT, stdio: 'inherit' });
    } catch {
      console.log('  Image generation skipped (script may not be available)');
    }
  }

  console.log('\nDone.');
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
