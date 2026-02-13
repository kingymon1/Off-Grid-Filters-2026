# CLAUDE.md — Multi-Product Authority Site Playbook

> **Purpose:** This file contains everything Claude needs to autonomously research a product catalog,
> make all design and content decisions, and build a complete multi-product affiliate authority site.
>
> **How to use:** Fill in `product-brief.yaml` with your site details and product catalog, then tell Claude:
> *"Read CLAUDE.md and build the site."*
>
> **Template type:** Multi-Product Authority Site (v3) — for 15-25 products across 4-8 categories.
> For single-product sites, use the Single-Product Template (v2) instead.

---

## WORK PHILOSOPHY

**Autonomy:** Carry out all work autonomously from start to finish. Do not stop to ask questions
mid-build. If you encounter decisions that need user input, collect them in a list and present
them all at the end — never interrupt the workflow for a single question.

**Research depth:** Do not skimp on research. Go deep. Every product should be thoroughly
understood — real specs, real strengths, real weaknesses. Shallow research produces generic
content that doesn't rank or convert. Spend the time to understand what makes each product
genuinely different.

**Quality bar:** Everything should be world-class — visually and technically. This is non-negotiable:
- **Visually stunning** — modern design, polished animations, smooth interactions, attention to
  spacing, typography, and color. The site should feel premium and authoritative at first glance.
- **Technically superior** — clean code, proper schema markup, fast builds, accessibility,
  WCAG contrast ratios, responsive at every breakpoint, no console errors.
- **Content excellence** — every review, guide, and comparison should read like it was written
  by a genuine expert. Specific data, honest opinions, real trade-offs. Never generic filler.

**No rushing:** Do not cut corners or simplify things to save time. We are not in a hurry.
A thorough 80-page site with excellent content beats a rushed 90-page site with thin content.
Every page should justify its existence.

---

## PHASE 1: RESEARCH (Do this first, before any code)

### 1.1 Product Catalog Research

For EVERY product listed in `product-brief.yaml`:
- Fetch the Amazon page or search: `"[product name] Amazon review features specifications"`
- Extract: full product title, description, bullet points, features
- Extract: dimensions, weight, materials, capacity, flow rate (niche-specific specs)
- Extract: star rating, review count, color/size variations
- Document strengths and weaknesses honestly
- Note what makes this product unique vs others in its category

**CRITICAL: Use the `price` from `product-brief.yaml` as the authoritative price for each product.**
Do NOT guess prices from Amazon pages — they may be outdated. The brief is the source of truth.

Document ALL product findings in `research/product-catalog-research.md`.

### 1.2 Category Research

For each category in `product-brief.yaml`:
- Search: `"best [category name] [current year] review"`
- Understand: what buyers prioritize in this category
- Identify: key comparison criteria (specs that matter most)
- Note: price ranges, entry-level vs premium positioning
- Document: which products from the catalog are strongest in each category

Document in `research/category-research.md`.

### 1.3 Market & Audience Research

Run web searches to understand:

**Target audience:**
- Search: `"[niche] buyer demographics target audience"`
- Identify: primary segments (hobbyists, professionals, beginners, families)
- Document: income level, buying triggers, seasonal patterns
- Identify: the buyer journey (what do people search before buying?)

**Competitor sites:**
- Search: `"best [niche] review sites"`
- Search: `"[niche] buying guide"`
- Identify: top 5-10 authority sites in this niche
- Note: what they do well, what they miss, content gaps to exploit
- Study: their page structure, navigation, content depth

**Content opportunities:**
- Search: `"[niche] buying guide"`
- Search: `"[niche] how to choose"`
- Search: `"[niche] vs [niche] comparison"`
- Search: `"[niche] for [activity]"` for relevant activities
- Map: user intent across the buying journey (awareness → consideration → purchase)
- Identify: question-based searches people ask about this niche

**Use cases & activities:**
- Build a comprehensive list of activity/use-case pages
- Prioritize by search volume potential and relevance
- Aim for 10-15 activity/use-case topics

Document all findings in `research/market-research.md`.

### 1.4 Design Research

Run web searches to determine the right visual direction:

- Search: `"[niche] website design color palette trends [current year]"`
- Search: `"product review site design inspiration [current year]"`
- Search: `"authority review site web design"`
- Look at how top review sites (Wirecutter, RTINGS, etc.) present products

Consider the niche when choosing:
- Color associations (blue = trust, green = nature, orange = energy)
- Authority vs approachability balance
- Clean data presentation for comparison tables

Document decisions in `research/design-decisions.md`.

---

## PHASE 2: DECISIONS (Document before building)

After research, create `research/site-plan.md` with all decisions:

### 2.1 Color Scheme

Choose a color palette based on market research. Define these CSS custom property values (HSL format):

| Token | Purpose | Example |
|-------|---------|---------|
| `--primary` | Brand accent, links, highlights | `210 70% 45%` (blue) |
| `--primary-foreground` | Text ON primary bg (buttons) | `210 10% 98%` (near-white) |
| `--primary-warm` | Hover/active variant of primary | `210 70% 38%` |
| `--accent` | CTA buttons, urgency elements | `35 90% 50%` (amber) |
| `--background` | Page background | `210 15% 6%` (dark) |
| `--foreground` | Body text | `210 10% 95%` (light) |
| `--card` | Card/section backgrounds | `210 12% 9%` |
| `--border` | Borders and dividers | `210 10% 16%` |
| `--muted` | Secondary backgrounds | `210 10% 11%` |
| `--muted-foreground` | Secondary text | `210 8% 62%` |

**CRITICAL: `--primary-foreground` must be LIGHT (near-white), not dark.**
It's used for text on primary-colored buttons. If it's dark, button text is unreadable.
For buttons with gradient primary backgrounds, also use `color: #fff !important` as a fallback.

**WCAG contrast note:** `--muted-foreground` must maintain ≥5.5:1 contrast ratio against card
backgrounds (`--card`). The example value `210 8% 62%` achieves this on dark cards. Do NOT use
lower lightness values (e.g., 55%) — they fail WCAG AA on dark backgrounds.

**Decision framework:**
- Authority/review sites → clean, trustworthy blue or teal primary
- Outdoor/adventure niche → earth tones, forest green
- Technical/scientific niche → cool blues, data-forward
- Lifestyle/home niche → warmer tones, approachable
- Always ensure WCAG 4.5:1 contrast ratio for text

### 2.2 Hero Statement & Homepage Title

**Homepage `<title>` format:**
```
${siteName} | ${niche} Reviews & Buying Guides
```
Use a pipe `|` separator. Keep total ≤60 characters.

**Homepage hero** is an AUTHORITY statement, not a product pitch:
```
[Niche] [Content Type] You Can Trust
```

Example: "Water Filter Reviews You Can Trust"

Supporting copy: 1-2 sentences establishing expertise and what the site offers.

### 2.3 Content Plan

Organize pages into these content types:

**1. Product Reviews (1 per product, 15-25 pages)**
- In-depth review of each product in the catalog
- URL: `/reviews/[product-slug]/`

**2. Category Roundups (1 per category, 4-8 pages)**
- "Best [Category] [Year]" — ranks all products in that category
- URL: `/best-[category-slug]/`

**3. Head-to-Head Comparisons (from brief, 8-15 pages)**
- "[Product A] vs [Product B]: Which Is Better?"
- URL: `/[product-a]-vs-[product-b]/`

**4. Buyer Guides (6-10 pages)**
- Educational content: "How to Choose a [Product Type]"
- URL: `/guides/[guide-slug]/`
- Topics: buying guide, maintenance, sizing, beginner guide, budget guide, common mistakes

**5. Activity/Use-Case Guides (8-12 pages)**
- "[Product Type] for [Activity]: Complete Guide"
- URL: `/[niche]-for-[activity]/`
- Topics: specific activities relevant to the niche

**6. Knowledge Base (6-10 pages)**
- Reference content: "What Is [Technical Term]?", history, types explained
- URL: `/[topic-slug]/`

**7. Resource Hub (1 page)**
- Central index of ALL content organized by type
- URL: `/guides/`

**Target: 70-90+ pages for "comprehensive" scope.**

### 2.4 Navigation Structure

Header navigation for a multi-product authority site:

| Nav Item | Content |
|----------|---------|
| Reviews | Dropdown: 5-7 most popular product reviews |
| Best Of | Dropdown: all category roundup pages |
| Compare | Dropdown: 5-7 most popular comparisons |
| Guides | Dropdown: buyer guides + activity guides |
| Learn | Dropdown: knowledge base articles |
| All Guides | Link to resource hub |

### 2.5 Tone & Voice

Authority sites should sound like a **trusted expert friend** — knowledgeable but not condescending:
- First person plural ("we tested", "we recommend")
- Specific data and measurements over vague claims
- Honest about weaknesses — builds trust for recommendations
- No product is perfect — every review has pros AND cons
- "Best for [use case]" framing instead of "best overall" for everything

### 2.6 Email Capture Configuration

The site includes a Buttondown email capture component that self-hides when no username is
configured. During the build, Claude wires up the component on all appropriate pages. The
site owner activates it post-launch by:

1. Creating a free Buttondown account at https://buttondown.com
2. Setting `email_username` in `product-brief.yaml` to their Buttondown username
3. Rebuilding the site

**Configuration in `product-brief.yaml`:**
```yaml
email_username: ""   # Buttondown username — leave empty to hide email capture
email_heading: "Get [Niche] Picks Delivered"
email_subheading: "One email per week. Honest reviews, no spam."
```

### 2.7 Entity Linking (AI Search Hardening)

Every page's Article schema should include `about` and/or `mentions` entity references with
`sameAs` URLs. This helps Google and AI systems understand what each page is about.

**Required in `product-brief.yaml`:**
```yaml
wikidata_entity: "https://www.wikidata.org/entity/Q842467"  # Wikidata URL for the niche topic
```

Find the right Wikidata entity by searching https://www.wikidata.org for the niche topic.
Examples: Water Filtration = Q842467, Air Purification = Q1755068, Coffee = Q8486.

### 2.8 Review Philosophy

**Credibility rules:**
- Every product review must have genuine pros AND cons
- No product gets a perfect score — find real weaknesses
- Price-to-value analysis for every product
- "Best for" recommendations (best for beginners, best for budget, best for performance)
- Disclose affiliate relationship clearly
- Never write content that reads like an ad

---

## PHASE 3: BUILD (Create all files)

### 3.1 Infrastructure Files

Create these files in this order:

**1. `package.json`**
```json
{
  "name": "[site-name]",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@astrojs/react": "^4.4.2",
    "@astrojs/sitemap": "^3.7.0",
    "@astrojs/tailwind": "^6.0.2",
    "@vercel/analytics": "^1.6.1",
    "astro": "^5.17.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@eslint/js": "^9.32.0",
    "@types/node": "^22.16.5",
    "@types/react": "^18.3.23",
    "@types/react-dom": "^18.3.7",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.32.0",
    "globals": "^15.15.0",
    "postcss": "^8.5.6",
    "sharp": "^0.34.5",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.3",
    "typescript-eslint": "^8.38.0",
    "vitest": "^4.0.18"
  }
}
```

**2. `astro.config.mjs`** — Set `site` from config, static output, trailing slashes, integrations (sitemap, react, tailwind). Set `build: { inlineStylesheets: 'always' }` to inline all CSS into HTML (eliminates render-blocking `<link>` stylesheet requests — critical for Core Web Vitals). Include `vite: { build: { assetsInlineLimit: 0 } }` to force all scripts to be emitted as external files (prevents Vite from re-inlining small scripts, which would break CSP `script-src 'self'`).

**3. `tailwind.config.ts`** — Map CSS custom properties to Tailwind tokens. Use system font stack (`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`). Include tailwindcss-animate plugin.

**4. `tsconfig.json`** — ES2020, ESNext modules, `@/*` path alias to `./src/*`.

**5. `postcss.config.js`** — Tailwind + Autoprefixer.

**6. `eslint.config.js`** — JS recommended + TypeScript ESLint.

**7. `vercel.json`** — Build config, security headers, cache headers, redirect .html to trailing slash.

**Security headers (all required):**
- `Content-Security-Policy` — `script-src 'self'` (NO `'unsafe-inline'`); `style-src 'self' 'unsafe-inline'` (Astro needs inline styles); `form-action 'self' https://buttondown.com`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (HSTS)
- `Cross-Origin-Opener-Policy: same-origin` (COOP)
- `Access-Control-Allow-Origin: https://[site-domain]` (restrictive CORS — NOT `*`)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), camera=(), microphone=()`

**WHY no `'unsafe-inline'` in `script-src`:** Astro inlines `<script>` content as
`<script type="module">` in built HTML. CSP `script-src 'self'` blocks these. Using external
`.ts` files referenced via `<script src="...">` produces `<script type="module" src="/assets/xxx.hash.js">`
which is allowed by `script-src 'self'`. See Section 3.2a for the external script files.

**Cache headers:**

**IMPORTANT: Vercel uses `path-to-regexp` syntax for route patterns — NOT regex.**
Use `:path*` for wildcards (e.g., `/assets/:path*`), not `\\.(?:css|js)$`.
Regex patterns will cause Vercel build/deployment failures.

**CRITICAL EXCEPTION — Security headers catch-all:** The security headers rule MUST use
`"source": "/(.*)"` — NOT `"source": "/:path*"`. The `/:path*` pattern does NOT match
the bare root path `/` in Vercel's path-to-regexp implementation, causing ALL security
headers (CSP, HSTS, X-Frame-Options, etc.) to be missing on the homepage. The `/(.*)`
pattern is valid path-to-regexp syntax and correctly matches every route including `/`.

- `/assets/:path*` → `Cache-Control: public, max-age=86400, stale-while-revalidate=43200` (images can be replaced at same URL)
- `/_astro/:path*` → `Cache-Control: public, max-age=31536000, immutable` (Astro hash-named bundles)
- Sitemaps → `Cache-Control: public, max-age=86400`

**8. `.gitignore`** — node_modules, dist, .astro, .env, logs, OS files.

**9. `.github/workflows/ci.yml`** — Node 20, npm ci, lint, test, build, verify output.

### 3.2 Source: Config & Utilities

**`src/lib/config.ts`** — Central config file that exports all site-specific data:
```typescript
export const siteConfig = {
  siteName: "",
  tagline: "",
  siteUrl: "",
  affiliateTag: "",
  niche: "",
  // Product catalog
  categories: [...],
  products: [...],
  // Navigation, social proof, etc.
  // Email capture
  email: {
    provider: 'buttondown' as const,
    username: '', // From product-brief.yaml — empty string = EmailCapture hidden
    heading: 'Get [Niche] Picks Delivered',
    subheading: 'One email per week. Honest reviews, no spam.',
    ctaText: 'Subscribe',
  },
}
```

The config must include:
- Full product catalog with all specs researched in Phase 1
- Category definitions with descriptions
- Navigation structure matching Phase 2 decisions
- Social proof stats (total products reviewed, categories covered, etc.)
- Email capture config (provider, username, copy) from `product-brief.yaml`
- `specLabels` — a `Record<string, string>` mapping `ProductSpecs` keys to human-readable
  labels (e.g., `{ capacity: 'Capacity', flowRate: 'Flow Rate' }`). This map drives both
  `ProductHero` and `ComparisonTable` generically — no niche-specific field names in components

This is the SINGLE SOURCE OF TRUTH. All components read from this.

**`src/lib/schema.ts`** — Schema.org JSON-LD generators:
- `generateArticleSchema(props)` — For content pages
- `generateFAQSchema(faqs)` — For FAQ sections
- `generateBreadcrumbSchema(items)` — For breadcrumb navigation
- `generateProductSchema(product)` — For product review pages
- `generateHowToSchema(steps)` — For how-to guides
- `generateOrganizationSchema()` — For brand/site info
- `generateWebSiteSchema()` — For site-level schema (NO SearchAction — the site has no search)
- `generateItemListSchema(items)` — For roundup/list pages
- `generateActivitySchema(activityName)` — For activity/use-case pages (uses `siteConfig.niche` for description)
- `combineSchemas(...schemas)` — Combines multiple schemas into a `@graph` array
- `createPageSchema(props)` — Convenience helper combining article + breadcrumbs + optional FAQ/product

**Entity linking interfaces (for AI search hardening):**
```typescript
export interface EntityRef {
  name: string;
  url: string;    // Wikidata or Amazon sameAs URL
  type?: string;  // Schema.org type, defaults to "Thing"
}
```

`ArticleSchemaProps` accepts two optional entity arrays:
- `mentions?: EntityRef[]` — Products/entities discussed in the content
- `about?: EntityRef[]` — The primary subject(s) of the page

These render as `mentions` and `about` properties in the Article schema with `sameAs` URLs
pointing to Wikidata (for topics) or Amazon (for products), helping AI systems and Google
understand entity relationships.

**Entity linking patterns by page type:**

| Page type | `about` | `mentions` |
|-----------|---------|------------|
| Product review | The reviewed product (type: `Product`, sameAs: Amazon URL) | 2-3 related products from same category |
| Category roundup | The category (sameAs: Wikidata entity for niche) | — |
| Comparison | Both compared products (type: `Product`, sameAs: Amazon URLs) | — |
| Buyer guide | The niche topic (sameAs: Wikidata entity) | — |
| Activity guide | The niche topic (sameAs: Wikidata entity) | — |
| Knowledge base | The niche topic (sameAs: Wikidata entity) | — |

**Wikidata entity:** Use the `wikidata_entity` URL from `product-brief.yaml` as the `sameAs`
URL for topic-level `about` references. Example: `https://www.wikidata.org/entity/Q842467`
for water filtration.

**`src/lib/schema.test.ts`** — Vitest tests for all schema generators (22 tests including
entity linking tests for mentions/about).

**`src/lib/image-map.ts`** — Static image path map for platform-agnostic image resolution.

**Why a static map?** Astro builds run on Vercel's serverless environment where `fs.existsSync`
and `import.meta.glob` don't reliably detect files in `public/`. A static TypeScript map
guarantees correct image resolution across all build environments. **Do NOT use filesystem
detection.** It will work locally but break on Vercel.

Generate this file with entries for EVERY page in the site:

```typescript
// Product slugs — these render in "showcase" mode (compact, centered, radial
// CSS mask to blend away white Amazon product-photo backgrounds)
export const productSlugs = new Set([
  // One entry per product from config.ts products array
  'product-slug-1',
  'product-slug-2',
  // ... all product slugs
]);

// Hero image paths — maps page slugs to /assets/ image paths
// Slugs NOT in productSlugs render in "editorial" mode (full-width, object-fit: cover)
export const heroImages: Record<string, string> = {
  // ── Product review heroes (1 per product) ──
  'product-slug-1': '/assets/product-slug-1-hero.webp',

  // ── Category roundup heroes (1 per category) ──
  'best-category-slug': '/assets/best-category-slug-hero.webp',

  // ── Comparison heroes (1 per comparison) ──
  'product-a-vs-product-b': '/assets/product-a-vs-product-b-hero.webp',

  // ── Buyer guide heroes ──
  'how-to-choose-niche': '/assets/how-to-choose-niche-hero.webp',

  // ── Activity guide heroes ──
  'niche-for-activity': '/assets/niche-for-activity-hero.webp',

  // ── Knowledge base heroes ──
  'topic-slug': '/assets/topic-slug-hero.webp',

  // ── About page ──
  'about': '/assets/about-hero.webp',

  // ── Homepage featured picks (use product slug + "-featured") ──
  'product-slug-1-featured': '/assets/product-slug-1-featured.webp',

  // ── Homepage category browser (use "category-" + category slug) ──
  'category-category-slug': '/assets/category-category-slug.webp',
};
```

**Naming conventions for image files (all in `public/assets/`):**

| Page type | Slug pattern | Filename pattern |
|-----------|-------------|------------------|
| Product review | `product-slug` | `product-slug-hero.webp` |
| Category roundup | `best-category-slug` | `best-category-slug-hero.webp` |
| Comparison | `product-a-vs-product-b` | `product-a-vs-product-b-hero.webp` |
| Buyer guide | `guide-slug` | `guide-slug-hero.webp` |
| Activity guide | `niche-for-activity` | `niche-for-activity-hero.webp` |
| Knowledge base | `topic-slug` | `topic-slug-hero.webp` |
| Homepage featured | `product-slug-featured` | `product-slug-featured.webp` |
| Homepage category | `category-cat-slug` | `category-cat-slug.webp` |

**Every image must have 3 responsive variants:**
- `[name].webp` — full size (1200px wide)
- `[name]-medium.webp` — medium (800px wide)
- `[name]-small.webp` — small (400px wide)

The `ProductImage` component imports from this map and determines render mode:
- Slug in `productSlugs` → **product showcase** (compact, white-bg mask)
- Slug NOT in `productSlugs` → **editorial** (full-width cover)
- No image found → **SVG placeholder** (icon + label fallback)

### 3.2a Source: External Scripts (4 files)

Astro inlines `<script>` content as `<script type="module">` in built HTML. CSP `script-src 'self'`
blocks these inline scripts. To stay CSP-safe, all client-side JavaScript MUST live in external
`.ts` files referenced via `<script src="...">`. This produces
`<script type="module" src="/assets/xxx.hash.js">` in the build output — allowed by CSP.

**`src/scripts/main.ts`** — Single entry point that imports all other scripts:
```typescript
import './interactions';
import './analytics';
import './header';
```
**Why a single entry?** Multiple `<script src="...">` tags produce separate ES module downloads
that load sequentially (JS waterfall). A single entry lets Vite bundle everything into one file,
eliminating the waterfall. Only `main.ts` is referenced in BaseLayout — the other 3 files are
imported by it, not loaded directly.

**`src/scripts/interactions.ts`** — Page interaction behaviors:
- Scroll reveal IntersectionObserver for all 6 reveal variants (`.reveal`, `.reveal-left`, etc.)
- Scroll progress bar width update via `requestAnimationFrame`
- Spotlight card mouse-tracking (updates `--mouse-x`/`--mouse-y` CSS custom properties on mousemove,
  with `getBoundingClientRect()` cached in a `WeakMap` and updated on resize to avoid forced reflow)
- Animated counter IntersectionObserver (eased number animation, 1500ms duration)

**`src/scripts/analytics.ts`** — Vercel Web Analytics:
```typescript
import { inject } from '@vercel/analytics';
inject();
```

**`src/scripts/header.ts`** — Header navigation behaviors:
- Sticky header scroll class toggle (`.scrolled` class added on scroll > 20px)
- Mobile hamburger menu open/close
- Dropdown keyboard navigation (Escape to close, focus management)

**Why external files?** Without this pattern, removing `'unsafe-inline'` from CSP breaks all
JavaScript interactions. The `assetsInlineLimit: 0` setting in `astro.config.mjs` prevents
Vite from re-inlining small scripts during the build.

### 3.3 Source: Global CSS

**`src/index.css`** must include:
- Tailwind directives (@tailwind base, components, utilities)
- CSS custom properties for the color scheme (in `:root` — dark-only)
- Custom utility classes: `.text-gradient`, `.card-[brand]`, `.container-[brand]`
- Glassmorphism header styles
- Skip navigation styles (`.skip-nav`)

**Enhanced animations (world-class feel):**
- 6 scroll reveal variants: `.reveal` (fade-up), `.reveal-left`, `.reveal-right`, `.reveal-blur`, `.reveal-scale`, `.stagger-grid`
- 8 stagger delay classes: `.reveal-delay-1` through `.reveal-delay-8`
- Scroll progress bar: `.scroll-progress` fixed at top with gradient
- 3D tilt cards: `.card-3d` with perspective transform on hover
- Animated counters: `.counter-value` with eased number animation
- Magnetic buttons: `.btn-magnetic` with subtle follow-cursor effect
- Parallax containers: `.parallax-container`, `.parallax-slow`
- Glow effects: `.glow-primary`, `.glow-primary-hover`, `.glow-accent`
- Text animations: `.text-reveal`, `.text-gradient-animated` with `gradient-shift` keyframe
- Spotlight cards: `.spotlight-card` with CSS custom property mouse tracking
- Floating orbs: `.orb`, `.orb-primary`, `.orb-accent` background decorations
- Winner badges: `.winner-badge` for comparison/roundup page winners
- Verdict card: `.verdict-card` with animated gradient top border
- Rating stars: `.star-rating` visual display
- `prefers-reduced-motion` media query disabling ALL animations
- Noise texture overlay on body
- Grid pattern overlay for hero section
- Responsive typography scales
- Button styles with hover transforms

### 3.4 Source: Layouts

**`src/layouts/BaseLayout.astro`** must include:
- HTML shell with `lang="en"`, dark class
- `<head>`: charset, viewport, title, meta description, canonical URL
- Open Graph tags (og:title, og:description, og:image, og:url, og:type)
- Twitter Card tags
- **System fonts only** — no Google Fonts or external font loading. Uses `system-ui, -apple-system,
  BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` which renders instantly with zero CLS.
  **Do NOT add Google Fonts** — web fonts cause CLS (layout shift when the font swaps in) and add
  4+ network requests (preconnect, CSS, woff2). System fonts render in <1ms with perfect scores.
- DNS prefetch for Amazon (`dns-prefetch` only — no `preconnect`, since the page never fetches
  resources from Amazon; all Amazon URLs are navigation `<a>` links)
- **`heroImage` prop** (optional string) — when provided, renders a `<link rel="preload">` for the
  hero image with responsive `imagesrcset`/`imagesizes` attributes. Each content page passes its
  own hero image path (e.g., `/assets/product-slug-hero.webp`). This is critical for LCP — without
  it, the hero image doesn't start downloading until after CSS and HTML are fully parsed.
- Favicon links (ico + png)
- Schema.org JSON-LD slot
- Vercel Analytics import
- `<body>`: skip nav link, scroll progress bar div, slot for content, noise overlay div
- `id="main-content"` on main element
- **Single bundled script entry (CSP-safe, no inline JS):**
  ```html
  <script src="../scripts/main.ts"></script>
  ```
  This imports interactions, analytics, and header scripts via a single entry point.
  Vite bundles them into one file, eliminating the JS waterfall from multiple `<script>` tags.
  **Do NOT use inline `<script>` tags** — Astro inlines them, breaking CSP.

**`src/layouts/ContentLayout.astro`** must include:
- Wraps BaseLayout
- Props: title, description, canonicalUrl, schema, breadcrumbs, relatedArticles, `lastUpdated?: string`, `ogImage?: string`
- **Per-page OG images:** ContentLayout auto-derives `og:image` from the `heroImage` prop when
  no explicit `ogImage` is passed (prepends `siteConfig.siteUrl` to make it absolute). Pages
  that pass `heroImage` get unique social preview images automatically. Falls back to the
  site-wide default OG image when neither `ogImage` nor `heroImage` is provided.
- Renders: Header → Breadcrumbs → **Visible "Last Updated" date** → AffiliateDisclosure → Main Content (slot) → Related Articles → Footer
- The `lastUpdated` prop renders a human-readable date (`<time>` element) between breadcrumbs and
  content. This visible date **must match** the `dateModified` in the page's Article schema —
  Google requires visible dates to correspond to structured data dates.
- Format: "Last updated: February 8, 2026" — styled as small muted text
- Consistent max-width container
- Article schema injection

### 3.5 Source: Components

**All 12 components must read brand/config data from `src/lib/config.ts`.**

**`HeaderAstro.astro`:**
- Site name/logo (text-based initially)
- Desktop: horizontal nav with dropdown menus for each content type
- Mobile: hamburger menu with expandable sections
- Glassmorphism background (backdrop-blur)
- Sticky positioning
- Active page highlighting
- NO "Buy on Amazon" CTA in nav — authority sites don't hard-sell from the header
- **External script reference** (CSP-safe):
  ```html
  <script src="../scripts/header.ts"></script>
  ```
  Do NOT use inline `<script>` — see Section 3.2a for why.

**`FooterAstro.astro`:**
- Site name and tagline
- Link grid organized by content type (mirrors nav)
- Amazon affiliate disclosure (REQUIRED for compliance):
  *"As an Amazon Associate, [site_name] earns from qualifying purchases."*
- Copyright with current year
- Links to legal pages (Privacy, Terms)

**`BreadcrumbsAstro.astro`:**
- Props: `items: Array<{label, url}>`, auto-generates BreadcrumbList schema
- Home → Category → Current Page format

**`RelatedArticlesAstro.astro`:**
- Props: `articles: Array<{title, url, description}>`, `heading?: string`
- 2-column grid on desktop, 1 on mobile
- Card style with hover animation
- Always 4 articles per page

**`StatCard.astro`:**
- Props: `value: string, label: string`
- Large gradient-text value + small label below
- Used for homepage stats (products reviewed, categories, etc.)

**`ProTip.astro`:**
- Props: `title?: string` (defaults to "Expert Tip")
- Lightning bolt icon + accent border
- Slot for content
- **WCAG contrast:** ProTip header color uses brightened primary `hsl(205 70% 58%)` (vs primary's
  48% lightness) for WCAG AA contrast on dark backgrounds. Do NOT use `hsl(var(--primary))`
  directly — it fails contrast requirements.

**`Callout.astro`:**
- Props: `type?: 'info' | 'warning' | 'tip' | 'danger'`
- Color-coded by type
- Slot for content

**`ProductImage.astro`:**
- Props: `alt: string, aspect?: 'hero'|'square'|'wide'|'tall', icon?: string, caption?: string, slug?: string, src?: string, priority?: boolean`
- **CLS prevention:** All `<img>` elements include `width` and `height` attributes computed from the
  aspect ratio (e.g., `width="1200" height="800"` for `aspect="wide"`). These are intrinsic size
  hints — the CSS still controls rendering, but the browser reserves the correct space before loading.
- **`priority` prop:** When `true`, sets `loading="eager"`, `decoding="sync"`, and `fetchpriority="high"`
  on the `<img>` tag. Use on hero images (ProductHero passes `priority={true}` by default).
- **3-mode rendering system** powered by `src/lib/image-map.ts`:

  **Mode 1: Editorial** (scene/lifestyle photos — roundups, comparisons, guides, knowledge base, about)
  - Triggers when: `slug` resolves to an image AND slug is NOT in `productSlugs`
  - Renders: full-width container with `object-fit: cover`, aspect ratio from `aspect` prop
  - CSS: `.product-image-editorial` → `.editorial-container` (aspect ratio) → `.editorial-image` (absolute fill)
  - Best for: AI-generated scene photos, landscape editorial images

  **Mode 2: Product Showcase** (Amazon product cutouts — review pages, featured picks)
  - Triggers when: `slug` resolves to an image AND slug IS in `productSlugs`
  - Renders: compact centered container (max-width 480px) with dark backdrop gradient
  - CSS mask removes white background: `mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 55%, rgba(0,0,0,0.8) 68%, rgba(0,0,0,0.4) 78%, transparent 90%)`
  - Includes subtle glow effect behind product using `hsl(var(--primary) / 0.1)`
  - Best for: Product photos downloaded from Amazon (white background cutouts)

  **Mode 3: SVG Placeholder** (fallback when no image exists)
  - Triggers when: no image found for the slug
  - Renders: gradient background + dot pattern + contextual SVG icon + label
  - 15+ icons: filter, water, camping, hiking, gravity, pump, bottle, straw, uv, rv, backpack, compare, tools, shield, gear

- **Responsive srcset** auto-generated from the image path:
  - `[name]-small.webp 400w` + `[name]-medium.webp 800w` + `[name].webp 1200w`
  - `sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"`
  - All 3 variant files must exist in `public/assets/` or srcset breaks
- **`src` prop** overrides image-map lookup (used when the same image serves multiple contexts, e.g., category browser cards using `src={/assets/category-slug.webp}`)
- **`slug` prop** controls image-map lookup AND render mode selection
- **EVERY content page MUST have at least one ProductImage** — no exceptions
- Place after the intro paragraph on every page
- **Homepage special cases:**
  - Category browser cards: pass both `src` and `slug` (slug enables editorial mode, src provides the path)
  - Comparison cards on homepage: use `aspect="hero"` (16:9) not `aspect="wide"` (3:2) — cards need shorter images
  - Featured picks: use product slug so they render in showcase mode

**`ComparisonTable.astro`:**
- Props: `products: Product[], features?: Feature[]`
- Product interface: name, asin, tag, rating, price + generic `[key: string]` for niche specs
- **Niche-agnostic:** Default features are auto-derived from `specLabels` in config — only shows
  specs that at least one product has a value for. Pass `features` prop to override.
- Responsive table with optional "Editor's Pick" badge
- CTA row with "Check Price" buttons linking to Amazon with affiliate tag
- **Button contrast CRITICAL:** Primary button uses `color: #fff !important` with `text-shadow`
- All products use the SAME affiliate tag

**`EmailCapture.astro`:**
- Props: `tag?: string` (defaults to `'general'` — used as Buttondown subscriber tag for segmentation)
- Reads `siteConfig.email` from config — if `email.username` is empty, renders nothing (returns undefined)
- **Conditional rendering:** The component is safe to include on any page. It self-hides when
  no Buttondown username is configured, so future sites start with email capture wired in but
  invisible until the owner sets up their Buttondown account and fills in the username.
- Renders: gradient-bordered card with mail icon, heading, subheading, email input + submit button
- Form action: `https://buttondown.com/api/emails/embed-subscribe/{username}` (POST)
- Hidden fields: `embed=1` (Buttondown embed mode), `tag={tag}` (subscriber segmentation)
- Trust line: lock icon + "No spam. Unsubscribe anytime."
- Responsive: stacks input/button vertically on mobile (<640px)
- Button uses `color: #fff !important` with text-shadow (same contrast pattern as all primary buttons)
- **Placement per page type:**

| Page type | Placement | Tag value |
|-----------|-----------|-----------|
| Homepage | Between FAQ section and Final CTA | `homepage` |
| Resource hub (`guides/index.astro`) | After content sections | `resource-hub` |
| Buyer guides | After CTA section, before closing tag | `buying-guide` |
| Activity guides | After CTA section, before closing tag | `activity-guide` |
| Product reviews | NOT included (too transactional) | — |
| Comparisons | NOT included (too transactional) | — |
| Category roundups | NOT included (too transactional) | — |
| Knowledge base | NOT included (informational pages keep focus on content) | — |

**Why these placements:** Educational content (guides) attracts top-of-funnel readers who are
more likely to subscribe. Transactional pages (reviews, comparisons) are closer to purchase
and adding email capture would distract from the conversion path. The homepage captures
browse-mode visitors.

**`AffiliateDisclosure.astro`:**
- No props — reads `siteConfig.brand` from config
- Renders a small disclosure banner at the top of every content page (inside ContentLayout)
- Text: "As an Amazon Associate, [brand] earns from qualifying purchases. Prices and availability are subject to change. Learn more."
- Info icon + link to about page
- Styled as muted, non-intrusive banner with card background
- **Required for Amazon Associates compliance** — must appear on every page with affiliate links

**`ProductHero.astro`:**
- Props: `product: Product` (from `src/lib/config`)
- Used on product review pages — renders a 2-column hero with product image and key details
- Left column: `<ProductImage>` in square aspect
- Right column: key specs grid (up to 6 specs), verdict box with "Best for" callout, and "Check Price on Amazon" CTA button
- **Niche-agnostic:** Iterates over `specLabels` from config to build the specs grid dynamically — no hardcoded field names. Works for any niche as long as `specLabels` maps the right keys.
- Responsive: stacks vertically on mobile (<768px)
- CTA button uses accent gradient with `color: #fff !important` and text-shadow

### 3.6 Source: Pages

#### Homepage (`src/pages/index.astro`)

The homepage is an **authority hub**, not a product landing page.

**1. Hero Section**
- Site name + tagline
- Authority statement: "[Niche] Reviews You Can Trust"
- Supporting copy: what the site offers, how many products reviewed
- Dual CTA: "Browse Reviews" + "Read Buying Guide"
- Stats bar: [X] Products Reviewed, [X] Categories, [X]+ Hours Testing
- `.text-reveal` animation on headline
- Grid pattern overlay + floating orbs for depth

**2. Featured Picks Section ("Our Top Picks")**
- 3-4 "Best for" cards linking to top products:
  - "Best Overall" → top product review
  - "Best Value" → best budget product review
  - "Best for [Activity]" → best niche-specific product review
  - "Best Premium" → best high-end product review
- Each card: ProductImage + product name + price + star rating + 1-line verdict + "Read Review" link
- `.spotlight-card` with cursor tracking
- `.stagger-grid` reveal animation

**3. Category Browser Section ("Find Your Perfect [Product]")**
- Card grid with one card per category
- Each card: icon + category name + product count + "View Best Of" link
- Links to category roundup pages
- `.reveal` animation with stagger delays

**4. Latest Reviews Section**
- 4-6 most recent/important product review cards
- Each card: ProductImage + product name + star rating + excerpt + "Read Review" link
- 2-column grid on desktop

**5. How We Test Section (Trust Builder)**
- 3-4 cards explaining the review methodology:
  - "Real-World Testing" — how products are evaluated
  - "Unbiased Reviews" — no sponsorships, affiliate-only
  - "Data-Driven" — specs comparison, not just opinions
  - "Updated Regularly" — prices and info kept current
- Builds authority and trust

**6. Popular Comparisons Section**
- 3-4 most popular head-to-head comparison links
- Card format: "[Product A] vs [Product B]" with thumbnail icons
- Links to comparison pages

**7. FAQ Section**
- 5-7 FAQs about the niche (NOT about the site):
  1. "What [product type] do I need for [common use case]?"
  2. "How much should I spend on a [product type]?"
  3. "[Technical question about the niche]?"
  4. "[Safety/health question]?"
  5. "What's the difference between [type A] and [type B]?"
- FAQPage schema markup

**8. Email Capture Section**
- `<EmailCapture tag="homepage" />`
- Placed between FAQ and Final CTA — captures browse-mode visitors

**9. Final CTA Section**
- "Find Your Perfect [Product]" headline
- CTA to buying guide or resource hub
- Trust badges

#### Product Review Pages (`src/pages/reviews/[product-slug].astro`)

One page per product in the catalog. Follow this structure:

**Section 1: Hero**
- H1: `[Product Full Name] Review [Year]`
- Quick verdict: 1-2 sentence summary + star rating
- Key specs box: price, rating, best for, key feature
- `<ProductImage>` with product icon

**Section 2: Overview**
- What this product is and who it's for
- 2-3 paragraphs of honest positioning
- "Best for" callout box

**Section 3: Key Features & Specs**
- Detailed specs table (niche-specific measurements)
- Feature-by-feature breakdown
- ProTip components for insider knowledge

**Section 4: Pros & Cons**
- Structured pros list (checkmarks)
- Structured cons list (X marks)
- **Every product MUST have real cons** — builds credibility
- **Cons heading color:** Use `hsl(0 70% 62%)` (not 55%) for WCAG AA contrast on dark backgrounds

**Section 5: Performance / Field Testing**
- How the product performs in real-world scenarios
- Specific test results and observations
- Comparison to alternatives where relevant

**Section 6: Value Analysis**
- Price-to-value assessment
- Cost comparison with similar products
- "Worth it if..." / "Skip it if..." framing

**Section 7: FAQ**
- 4-6 product-specific questions
- FAQPage schema

**Section 8: Verdict & CTA**
- Final rating (X/10 or X/5 stars)
- 2-3 sentence verdict
- "Check Price on Amazon" CTA
- Link to category roundup: "See all [category] reviews"

**Every review page also includes:**
- ContentLayout wrapper with breadcrumbs (Home → Reviews → [Product])
- `lastUpdated={product.publishDate}` on ContentLayout
- Product schema with rating
- Article schema with per-page dates and entity linking:
  - `datePublished: product.publishDate`
  - `dateModified: product.publishDate`
  - `about: [{ name: product.name, url: Amazon URL, type: 'Product' }]`
  - `mentions: relatedProducts.slice(0, 3).map(...)` — up to 3 related products as Product entities
- 4 related articles: 2 similar products, 1 category roundup, 1 buyer guide

#### Category Roundup Pages (`src/pages/best-[category-slug].astro`)

One per category. These are high-value SEO pages.

**Section 1: Hero**
- H1: `Best [Category] [Year]: Expert Picks`
- Intro: what this category is, who it's for, how many products tested
- `<ProductImage>` with category-appropriate icon

**Section 2: Quick Picks Summary**
- Table/card grid with all products in this category
- Each: name, price, rating, 1-line verdict, "Best for [X]" badge
- `<ComparisonTable>` with all category products

**Section 3: Individual Product Mini-Reviews**
- For each product in the category (ordered by recommendation):
  - H3: `[Rank]. [Product Name] — Best for [Use Case]`
  - 2-3 paragraph review
  - Pros/cons list
  - `<ProductImage>`
  - "Read Full Review" link + "Check Price" CTA

**Section 4: How We Chose**
- Methodology: what criteria were used to rank
- Key comparison factors for this category

**Section 5: Buying Guide for This Category**
- What to look for when choosing a [category] product
- Key specs explained
- Budget ranges

**Section 6: FAQ**
- 5-7 category-specific questions
- FAQPage schema

**Section 7: CTA**
- Link to #1 pick with "Check Price"
- Link to full buying guide

**Every roundup page also includes:**
- `lastUpdated={category.publishDate}` on ContentLayout
- Article schema with per-page dates and entity linking:
  - `datePublished: category.publishDate`
  - `dateModified: category.publishDate`
  - `about: [{ name: category.name, url: wikidata_entity URL }]`
- ItemList schema listing all products

#### Head-to-Head Comparison Pages (`src/pages/[product-a]-vs-[product-b].astro`)

**Section 1: Hero**
- H1: `[Product A] vs [Product B]: Which Is Better in [Year]?`
- Quick verdict box (`.verdict-card`): winner + 1-line summary
- `<ProductImage>` with compare icon

**Section 2: At a Glance**
- `<ComparisonTable>` with both products
- Side-by-side specs

**Section 3: Category-by-Category Breakdown**
- 5-6 comparison categories relevant to the niche
- Each category has a clear winner with explanation
- **Products must each win some categories** — no one-sided comparisons
- Winner badges (`.winner-badge`) on each category

**Section 4: Who Should Get Which?**
- "Get [Product A] if..." scenarios
- "Get [Product B] if..." scenarios
- Honest, use-case-based recommendations

**Section 5: FAQ**
- 4-6 comparison-specific questions

**Section 6: CTA**
- "Check Price" buttons for BOTH products
- Both use same affiliate tag

**Every comparison page also includes:**
- `lastUpdated={comparison.publishDate}` on ContentLayout
- Article schema with per-page dates and entity linking:
  - `datePublished: comparison.publishDate`
  - `dateModified: comparison.publishDate`
  - `about: [productA as Product entity, productB as Product entity]` — both products with Amazon sameAs URLs

#### Buyer Guide Pages (`src/pages/guides/[guide-slug].astro`)

Educational content following the 8-section content page structure:

**Section 1: Hero + ProductImage**
- H1: `How to Choose a [Product Type]: Complete [Year] Guide`
- Intro establishing the guide's value

**Section 2: Why This Matters**
- Why choosing the right product matters
- Common pain points this guide solves

**Section 3: Key Factors to Consider**
- Detailed breakdown of decision criteria
- Specs explained in plain language
- Numbered or bulleted lists

**Section 4: Deep Dive**
- Detailed technical explanations
- Scenario-based recommendations
- ProTip and Callout components throughout

**Section 5: Common Mistakes**
- 4-5 mistakes with explanations

**Section 6: Product Recommendations**
- "Best for [scenario]" recommendations linking to reviews
- Brief justification for each pick

**Section 7: FAQ**
- 5-7 guide-specific questions

**Section 8: CTA**
- Link to top-pick review
- Link to category roundup

**Section 9: Email Capture**
- `<EmailCapture tag="buying-guide" />`
- Placed after CTA section, before closing tag

**Every buyer guide page also includes:**
- `lastUpdated={guide.publishDate}` on ContentLayout
- Article schema with per-page dates and entity linking:
  - `datePublished: guide.publishDate`
  - `dateModified: guide.publishDate`
  - `about: [{ name: niche topic, url: wikidata_entity URL }]`

#### Activity/Use-Case Guide Pages (`src/pages/[niche]-for-[activity].astro`)

Similar to buyer guides but focused on a specific activity or use case.

**Section 1: Hero + ProductImage**
- H1: `Best [Product Type] for [Activity]: [Year] Guide`

**Section 2: Why [Activity] Needs a [Product Type]**
- Activity-specific justification

**Section 3: What to Look For**
- Activity-specific buying criteria

**Section 4: Top Picks for [Activity]**
- 3-5 recommended products from the catalog
- Each with brief rationale and link to full review

**Section 5: Activity-Specific Tips**
- How to use the product in this specific context
- ProTip components

**Section 6: FAQ**
- Activity-specific questions

**Section 7: CTA**
- Top pick for this activity + "Check Price"

**Section 8: Email Capture**
- `<EmailCapture tag="activity-guide" />`
- Placed after CTA section, before closing tag

**Every activity guide page also includes:**
- `lastUpdated={guide.publishDate}` on ContentLayout
- Article schema with per-page dates and entity linking:
  - `datePublished: guide.publishDate`
  - `dateModified: guide.publishDate`
  - `about: [{ name: niche topic, url: wikidata_entity URL }]`

#### Knowledge Base Pages (`src/pages/[topic-slug].astro`)

Educational/reference content. Follows the standard content page structure but leans informational.

**Every knowledge base page also includes:**
- `lastUpdated={guide.publishDate}` on ContentLayout
- Article schema with per-page dates and entity linking:
  - `datePublished: guide.publishDate`
  - `dateModified: guide.publishDate`
  - `about: [{ name: niche topic, url: wikidata_entity URL }]`

#### Resource Hub (`src/pages/guides/index.astro`)

- Central index of ALL content organized by type
- Sections: Reviews, Best Of, Comparisons, Guides, Knowledge Base
- Card grid with hover effects
- CollectionPage schema
- `<EmailCapture tag="resource-hub" />` after content sections
- `about` entity linking to Wikidata entity for niche topic

#### 404 Page (`src/pages/404.astro`)

- On-brand error message
- Link back to homepage
- Browse suggestion

### 3.7 Public Files

**`public/robots.txt`:**
```
User-agent: *
Allow: /
Sitemap: [siteUrl]/sitemap-index.xml

# AI Crawlers
User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /
```

**`src/pages/llms.txt.ts`:** (Dynamic Astro API route)

Instead of a static file, create a dynamic Astro API route that auto-generates the llms.txt
content from `src/lib/config.ts` arrays. This ensures llms.txt stays in sync whenever products,
categories, comparisons, or guides are added or removed — no manual updates needed.

Each line includes a per-page description to help AI systems understand content without
fetching the page. The description is pulled from config data (verdict, category description,
guide description). Comparison titles are generated from product names using `getProductBySlug()`
since the `Comparison` interface has no `title` field — only `productA`, `productB`, and `slug`.

```typescript
import type { APIRoute } from 'astro';
import { SITE_NAME, SITE_URL, products, categories, comparisons, guides, siteConfig, getProductBySlug } from '../lib/config';

export const GET: APIRoute = () => {
  const buyerGuides = guides.filter(g => g.type === 'buyer');
  const activityGuides = guides.filter(g => g.type === 'activity');
  const knowledgeBase = guides.filter(g => g.type === 'knowledge');

  const lines = [
    `# ${SITE_NAME}`,
    `> ${siteConfig.tagline}`,
    '', '## About', siteConfig.productDescription,
    '', '## Product Reviews',
    ...products.map(p => `- ${SITE_URL}/reviews/${p.slug}/ — ${p.name} Review: ${p.verdict}`),
    '', '## Best Of / Roundups',
    ...categories.map(c => `- ${SITE_URL}/best-${c.slug}/ — Best ${c.name}: ${c.description}`),
    '', '## Comparisons',
    ...comparisons.map(c => {
      const a = getProductBySlug(c.productA);
      const b = getProductBySlug(c.productB);
      const title = `${a?.name ?? c.productA} vs ${b?.name ?? c.productB}`;
      return `- ${SITE_URL}/${c.slug}/ — ${title}: Side-by-side specs, performance, and value comparison`;
    }),
    '', '## Buyer Guides',
    ...buyerGuides.map(g => `- ${SITE_URL}/guides/${g.slug}/ — ${g.title}: ${g.description}`),
    '', '## Activity Guides',
    ...activityGuides.map(g => `- ${SITE_URL}/${g.slug}/ — ${g.title}: ${g.description}`),
    '', '## Knowledge Base',
    ...knowledgeBase.map(g => `- ${SITE_URL}/${g.slug}/ — ${g.title}: ${g.description}`),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
  });
};
```

**IMPORTANT:** The `Comparison` interface has NO `title` field. To generate comparison titles
for llms.txt, use `getProductBySlug()` to resolve product names from slugs. Do NOT use
`c.title` — it does not exist and will render as `undefined`.

**`public/assets/og-default.png`** — Default social preview (OG) image:
- 1200x630px PNG generated via Sharp SVG rendering
- Includes: site branding, tagline, CTA button(s) ("Find Your Perfect [Product]" + "Browse Reviews"), trust badges
- Referenced by `siteConfig.seo.defaultOgImage` in config
- Used as fallback for `og:image` and `twitter:image` when no per-page hero image is available
  (ContentLayout auto-derives OG images from `heroImage` — only the homepage and resource hub
  use this default)
- Generate using a Sharp script that renders an SVG template to PNG:
  ```javascript
  // scripts/gen-og.mjs — generates public/assets/og-default.png
  import sharp from 'sharp';
  const svg = `<svg width="1200" height="630">...</svg>`; // branded layout
  await sharp(Buffer.from(svg)).png().toFile('public/assets/og-default.png');
  ```

**`public/favicon.ico`** and **`public/favicon.png`:**
- Generate text-based favicons using the site initial(s)

### 3.8 IMAGE-GUIDE.md

Generate an `IMAGE-GUIDE.md` at the project root that documents:
- The image system architecture (image-map.ts, ProductImage 3-mode rendering, cache headers)
- Image generation workflow (download Amazon photos → generate AI editorial → register in map)
- Every page and its image filename, render mode, and aspect ratio
- File naming convention: `[product-slug]-[context].webp`
- Responsive variant convention: `[name].webp`, `[name]-medium.webp`, `[name]-small.webp`
- Where to place images: `public/assets/` (flat directory, no subdirectories)
- How to add or replace images (Sharp commands for responsive variants)
- Complete image inventory organized by page type

### 3.9 Scripts

**`scripts/convert-to-webp.mjs`:**
- Uses Sharp library to batch-convert JPG/PNG source images to WebP
- Creates 3 responsive variants per image:
  - Full: 1200px wide, quality 82
  - Medium: 800px wide, quality 78
  - Small: 400px wide, quality 72
- Output naming: `[name].webp`, `[name]-medium.webp`, `[name]-small.webp`
- Outputs to `public/assets/`
- Usage: `node scripts/convert-to-webp.mjs`

**`scripts/generate-local-images.mjs`:**
- SVG-to-WebP fallback generator — creates branded placeholder images locally without any API
- Uses Sharp to render SVG templates into WebP images
- Applies the site's color scheme (HSL values from `src/index.css`)
- Includes 40+ contextual SVG icon paths (filter, water, mountain, tent, house, etc.)
- Generates images for all page types with appropriate icons, labels, and gradient backgrounds
- Creates responsive variants (small, medium, full) for each image
- Outputs to `public/assets/`
- Usage: `node scripts/generate-local-images.mjs`
- **Use case:** Initial build when no AI API key is available, or as a baseline before real photos

**`scripts/image-gen-server.mjs`:**
- AI image generation admin — self-contained HTTP server with built-in web UI
- Uses Google Gemini API (`gemini-2.5-flash-image` model) to generate editorial/scene photos
- Reads `GEMINI_API_KEY` from `.env` file
- Contains IMAGE_PROMPTS array with a prompt for EVERY editorial image in the site:
  - Product review heroes (1 per product)
  - Homepage featured picks (3-4 products)
  - Homepage category browser images (1 per category)
  - Category roundup heroes (1 per category)
  - Comparison heroes (1 per comparison)
  - Buyer guide heroes (1 per guide)
  - Activity guide heroes (1 per activity)
  - Knowledge base heroes (1 per article)
  - About page hero (1)
- **5 style prefixes** for different image types:
  - `product`: Professional product photography, studio lighting, dark background
  - `lifestyle`: Editorial photograph, natural setting, cinematic color grading
  - `educational`: Clean informational photograph, scientific style
  - `collection`: Multiple products artfully arranged, studio lighting
  - `comparison`: Two products side by side, symmetrical composition
- Each prompt includes: `id`, `filename`, `category`, `pagePath`, `aspectRatio`, `description`, `prompt`
- Automatically converts AI output to WebP with Sharp
- Creates responsive variants (small, medium, full)
- Saves to `public/assets/`
- **Usage:**
  ```bash
  # Start admin UI at http://localhost:3100
  npm run images

  # Auto-generate all missing images (CLI mode)
  npm run images -- --auto
  ```
- **Setup:** Create `.env` with `GEMINI_API_KEY=your-key-here`
- Add `"images": "node scripts/image-gen-server.mjs"` to package.json scripts

**`scripts/checklist-server.mjs`:**
- Launch checklist runner — self-contained HTTP server with built-in web dashboard
- Automates LAUNCH-CHECKLIST.md Sections 1-5: build pipeline, SEO audit, schema validation,
  internal link crawling, and content quality checks
- Provides pass/fail UI for manual Sections 6-12
- Parses all HTML files in `dist/` for titles, metas, canonicals, headings, OG tags, JSON-LD,
  internal links, affiliate link attributes, content length, placeholder text, and more
- Dashboard always opens clean (never loads stale results from previous sessions)
- Header controls: Reset, Run Automated Checks, Filter dropdown (Full Report / Failures +
  Warnings / Failures Only / Warnings Only), and Export button
- Exports filtered Markdown sign-off reports
- **Usage:**
  ```bash
  # Start dashboard at http://localhost:3200
  npm run checklist

  # Run automated checks in CLI mode (no browser)
  npm run checklist:auto
  ```
- Add `"checklist": "node scripts/checklist-server.mjs"` to package.json scripts

### 3.10 `.env.example`

Create a `.env.example` file (committed to repo, unlike `.env`):
```
# Google Gemini API Key for AI image generation
# Get yours at: https://aistudio.google.com/apikey
GEMINI_API_KEY=
```

---

## PHASE 4: QUALITY (Verify everything works)

**Claude does this.** The site should build and pass all checks before the owner touches images.

**Quick start — run the automated checklist from a fresh terminal:**

1. `cd Off-Grid-Filters-2026` — navigate to the project root
2. `git pull origin main` — **always pull latest code first**
3. `npm install` — install dependencies
4. `npm run checklist` — starts the dashboard server at http://localhost:3200
5. Verify terminal shows `Dashboard v3 — clean start, no stale data` (if not, re-pull and restart)
6. Open **http://localhost:3200** — dashboard always opens clean (never loads old results)
7. Click **"Run Automated Checks (S1-S5)"** — runs build, SEO, schema, linking, and content checks
8. Pick a filter from the **"Filter:"** dropdown, then click **"Export"** to download a report

For CLI-only (no browser): `npm run checklist:auto`

See the **Troubleshooting** section in LAUNCH-CHECKLIST.md if anything looks wrong.

**This phase uses two reference documents:**
- **`LAUNCH-CHECKLIST.md`** — Complete 12-section sign-off checklist. Sections 1-5 are
  automated (Claude completes during build). Sections 6-12 require tools or human verification.
- **`GOOGLE-READINESS.md`** — Google Search Console compliance guide and indexing diagnostics.
  The Pre-Submission Checklist (Section 2) must be fully confirmed before submitting to GSC.

### 4.1 Install & Build
```bash
npm install
npm run lint
npm run test
npm run build
```

Fix any errors before proceeding. All four commands must exit with code 0.

### 4.2 Run Automated Checklist and Fix All Failures

**This is a fix loop, not a one-time check.** Run the automated checklist, read the output,
fix every failure and warning, then run it again. Repeat until the output is clean.

```bash
npm run checklist:auto
```

This runs Sections 1-5 of LAUNCH-CHECKLIST.md in CLI mode and prints results to stdout.
It checks ~50 items across 5 sections:
- **S1: Build & Infrastructure** — file inventory, config integrity, page count, llms.txt
- **S2: On-Page SEO** — unique titles, meta descriptions, heading hierarchy, canonicals, OG tags
- **S3: Structured Data** — schema presence, valid JSON-LD, per-page dates, entity linking, no SearchAction
- **S4: Internal Linking** — zero orphan pages, broken links, affiliate rel attributes, trailing slashes
- **S5: Content Quality** — no placeholder text, word count minimums, ProductImage, review cons, disclosure

**Fix loop:**
1. Run `npm run checklist:auto`
2. Read the full output — every line marked FAIL or WARN
3. Fix the root cause of each failure in the source code
4. Run `npm run build` to rebuild
5. Run `npm run checklist:auto` again
6. Repeat steps 2-5 until output shows **zero failures**

**Common failures to watch for (fix these proactively during the build):**
- **llms.txt "undefined"** — Comparison interface has no `title` field. Use `getProductBySlug()` to resolve names.
- **Affiliate links missing `rel` attributes** — Every Amazon link needs `rel="nofollow sponsored noopener"`. Check ComparisonTable, ProductHero, and all inline CTAs.
- **Article schema missing dates** — Every product, category, comparison, and guide in config needs a `publishDate`. Pass it through to Article schema as both `datePublished` and `dateModified`.
- **Entity linking missing** — Every Article schema needs an `about` property. Reviews: product entity. Guides/roundups: Wikidata niche entity.
- **SearchAction in schema** — WebSite schema must NOT include SearchAction. Static sites have no search.
- **Orphan pages** — Every page needs 2+ inbound links. Resource hub must link to ALL content pages.
- **Placeholder text** — Search for "TODO", "TBD", "lorem ipsum", "[placeholder]", "coming soon" — remove all.
- **Review cons missing** — Every review page must contain the word "Cons" or "Weaknesses" as a heading/label.
- **Related articles count** — Every content page needs exactly 4 related article links.
- **Canonical trailing slash** — All canonical URLs must be absolute (`https://...`) and end with `/`.

### 4.3 Complete GOOGLE-READINESS.md Pre-Submission Checklist

Work through Section 2 of GOOGLE-READINESS.md. All 7 subsections must pass:
- 2.1 Content Readiness
- 2.2 Technical Readiness
- 2.3 Structured Data Readiness
- 2.4 Crawl Readiness
- 2.5 Internal Linking Readiness
- 2.6 Affiliate Compliance
- 2.7 Security & Deployment

**After Phase 4, Claude's automated work is complete.** The site is fully functional with SVG
placeholder images. Push to GitHub, deploy to Vercel. Then proceed to Phase 5 for real images.

---

## PHASE 5: IMAGES (Post-deploy — manual owner steps)

**The site owner does this, not Claude.** These steps require downloading files from Amazon
and optionally using a Gemini API key. The site is already live and functional with SVG
placeholders — this phase upgrades the visuals.

### 5.1 Download Product Photos from Amazon

**This is a manual step that must be done by the site owner.**

For each product in `product-brief.yaml`:
1. Go to the Amazon product listing
2. Download the main product image (the white-background cutout photo)
3. Rename following the convention: `[product-slug]-hero.webp`
   - Example: `bluevua-ro100ropot-uv-hero.webp`
4. Place in `public/assets/`
5. Generate responsive variants using Sharp:
   ```bash
   node scripts/convert-to-webp.mjs
   ```
6. Commit and push to GitHub

These product photos render in **product showcase mode** — the `ProductImage` component
applies a radial CSS mask that blends away the white background automatically.

### 5.2 Generate AI Editorial Images

After product photos are in place, generate scene/lifestyle images for all other pages:

1. Create `.env` from `.env.example` and add your `GEMINI_API_KEY`
2. Run: `npm run images` (admin UI) or `npm run images -- --auto` (CLI)
3. The script generates images for: roundups, comparisons, guides, knowledge base, about, homepage categories, and featured picks
4. Images are saved to `public/assets/` with responsive variants automatically

**Alternative (no API key):** Run `node scripts/generate-local-images.mjs` to generate
branded SVG-based placeholder images. These look professional but aren't real photos.

### 5.3 Register Images in the Map

After images are in `public/assets/`, ensure every image has an entry in `src/lib/image-map.ts`:
- Product slugs → add to `productSlugs` Set
- All slugs → add to `heroImages` Record with path to `/assets/[filename].webp`

### 5.4 Verify Images

Run `npm run build` and check:
- No pages show SVG placeholder icons
- Product photos render with dark backdrop and radial mask (no white background visible)
- Editorial images fill their containers with `object-fit: cover`
- Homepage hero product image has radial mask (no white background edges)
- Responsive variants load at appropriate breakpoints

---

## COPYWRITING REFERENCE

### Core Philosophy
- **Authority + trust** (NOT sales pressure)
- **Honest reviews** — every product has real pros AND cons
- **Data-driven** — specs, measurements, comparisons
- **User-first** — help the reader make the right decision, not just any purchase
- **Specific** — exact numbers, times, measurements build credibility
- **Amazon affiliate** leverages platform trust — you earn on all products

### CTA Strategy (Different from single-product sites)
- Product review pages: "Check Price on Amazon" (informational, not pushy)
- Roundup pages: "Check Price" per product (let the reader decide)
- Comparison pages: "Check Price" for both products
- Guide pages: "See Our Top Pick" → links to review, not directly to Amazon
- Homepage: "Browse Reviews" or "Read Buying Guide" (NO direct Amazon links)
- **No floating CTAs** — authority sites earn trust through content, not pressure

### Review Writing Pattern
Every product review follows:
1. **Hook:** What this product promises and who it's for
2. **Reality:** How it actually performs (honest, specific)
3. **Context:** How it compares to alternatives
4. **Verdict:** Who should buy it and who shouldn't

### Direct Answer Pattern (BLUF — Bottom Line Up Front)
Every section on every page follows the **direct answer first** principle. The first 1-2
sentences after any heading must directly answer the implicit question of that heading.
Supporting detail, nuance, and explanation follow after.

AI systems and Google's featured snippets pull citations from the **leading sentence** of a
section. If that sentence is preamble instead of an answer, your content won't be cited.

**Good:**
```
## Is the Bluevua RO100ROPOT Worth It?
At $317, the Bluevua RO100ROPOT is worth it for households that want
reverse osmosis + UV sterilization without plumbing installation.
Here's why: [supporting detail]
```

**Bad:**
```
## Is the Bluevua RO100ROPOT Worth It?
When evaluating a countertop RO system, there are several factors to
consider. Price, filtration quality, and ease of installation all
play a role in determining overall value...
```

This applies to: review sections, guide sections, comparison breakdowns, knowledge base
explanations, and FAQ answers. **Never open with throat-clearing preamble.**

### FAQ Answer Pattern
Every FAQ answer follows: **Direct answer** → **Technical explanation** → **Specific recommendation**

### Related Articles Cross-Linking Strategy
Every page links to 4 related articles:
1. Similar product review
2. Category roundup that includes this product
3. Relevant buyer guide
4. Related activity/use-case guide

### SEO Patterns
- Article schema on all content pages
- Product schema with rating on review pages
- FAQPage schema on pages with FAQ sections
- BreadcrumbList schema on all pages
- ItemList schema on roundup pages
- **Per-page `datePublished` and `dateModified`** in Article schema (using `publishDate` from config)
- **Visible "Last updated" dates** matching structured data dates (Google requires correspondence)
- **Entity linking** via `mentions` and `about` in Article schema (Wikidata sameAs for topics, Amazon sameAs for products)
- **No SearchAction** in WebSite schema (static sites have no search — dead markup hurts)
- **Enriched llms.txt** with per-page descriptions for AI crawler discovery
- Meta descriptions: Target keyword + value prop (under 160 chars)
- Natural keyword integration (never stuffed)
- Heading hierarchy: H1 → H2 → H3

---

## CRITICAL RULES (Common Mistakes to Avoid)

### Pricing
1. **NEVER guess prices.** Always use the `price` from `product-brief.yaml` per product.
2. **Store all product data in config.ts** and reference from there.
3. **Update narrative to match actual prices.** Don't call something "affordable" if it's the priciest option.

### Images
4. **EVERY content page must have a `<ProductImage>`** component. No exceptions.
5. **Import ProductImage** at the top of every content page.
6. **Homepage uses ProductImage** in featured picks section.
7. **Use `src/lib/image-map.ts`** for all image path resolution. Never use `fs.existsSync` or `import.meta.glob` to detect images — they don't work reliably on Vercel.
8. **Product photos** (white background cutouts) go in `productSlugs` set → renders with radial mask.
9. **Editorial/scene photos** stay out of `productSlugs` → renders full-width with `object-fit: cover`.
10. **All images need 3 responsive variants**: `[name].webp` (1200w), `[name]-medium.webp` (800w), `[name]-small.webp` (400w).

### Cache Headers
11. **Never use `immutable` on `/assets/*` images.** Images can be replaced at the same URL. Use `max-age=86400` with `stale-while-revalidate` instead. Only `/_astro/*` bundles (hash-named) should be `immutable`.
11.5. **Vercel uses `path-to-regexp` syntax in `vercel.json`, NOT regex.** Use `/assets/:path*` not `/assets/(.*)` for asset routes. Exception: the security headers catch-all MUST use `"source": "/(.*)"` because `/:path*` does not match the bare root path `/`, causing all security headers to be missing on the homepage.
12. **After replacing images**, allow up to 24 hours for CDN cache to expire, or instruct users to hard-refresh.

### Button/Text Contrast
13. **Never rely on CSS custom properties for button text color in Astro scoped styles.** Use `color: #fff !important` with `text-shadow` for text on primary-colored buttons.
14. **`--primary-foreground` must be near-white.** If it's dark, all buttons become unreadable.

### Reviews & Comparisons
15. **Every product must have real cons.** A review with only pros reads as an ad.
16. **Comparisons must be balanced.** Each product wins some categories.
17. **No "best overall" that wins everything.** Use "best for [specific use case]" framing.
18. **All products use the SAME affiliate tag.** You earn commission on every product.

### Authority & Trust
19. **No hard-sell language.** "Check Price" not "Buy Now." "We recommend" not "You need this."
20. **Disclose affiliate relationship** in footer on every page.
21. **No fake urgency.** No "limited time" or "selling fast" language.

### CSS Grid Overflow
22. **Always set `min-width: 0` on CSS Grid children that contain text.** Grid items default to `min-width: auto`, which prevents them from shrinking below their content width — causing text overflow in multi-column layouts (e.g., the resource hub card grid).

### Email Capture
22.5. **EmailCapture component self-hides when `email.username` is empty.** Always include the
   component on the pages listed in the placement table — it's safe to render even without a
   Buttondown account configured.
22.6. **CSP form-action must whitelist `https://buttondown.com`** in `vercel.json`. Without this,
   the email form POST will be blocked by Content Security Policy.
22.7. **Use `tag` prop for subscriber segmentation.** Each page type gets a different tag value
   (homepage, buying-guide, activity-guide, resource-hub) so the site owner can segment their
   email list by acquisition source.

### AI Search Hardening
22.8. **Every page must have per-page `datePublished` and `dateModified`** in its Article schema,
   using the `publishDate` from config. Do NOT rely on site-level default dates.
22.9. **Visible dates must match structured data dates.** Pass `lastUpdated={item.publishDate}`
   to ContentLayout on every content page. Google penalizes mismatches between visible and
   structured data dates.
22.10. **Use entity linking on every Article schema.** `about` for the page's primary subject,
   `mentions` for referenced products. Use Wikidata URLs for topics (from `product-brief.yaml`
   `wikidata_entity`), Amazon URLs for products.
22.11. **Do NOT add SearchAction to WebSite schema.** Static sites have no search functionality.
   Dead markup signals low quality to search engines.
22.12. **llms.txt must include per-page descriptions.** Product reviews include verdicts, categories
   include descriptions, guides include descriptions. Comparison titles must be generated from
   product names (the Comparison interface has no `title` field).

### CSP (Content Security Policy)
25. **NEVER write inline `<script>` tags.** Use external `.ts` files in `src/scripts/` referenced
    via `<script src="...">`. Astro inlines them otherwise, producing `<script type="module">`
    which CSP `script-src 'self'` blocks. See Section 3.2a.
26. **Set `vite.build.assetsInlineLimit: 0`** in `astro.config.mjs` to prevent Vite from
    re-inlining small scripts during the build.
27. **Never use inline event handlers** (`onload`, `onclick`, `onmouseover`, etc.) in HTML —
    CSP blocks them. Move all behavior to external scripts.

### Build
28. **Always run `npm run build`** before committing. Fix all errors.
29. **Dark mode only** — deliberate design choice. Don't add light mode unless requested.

---

## FILE CHECKLIST

When complete, the project should contain:

### Root (15 files)
- [ ] `package.json`
- [ ] `astro.config.mjs`
- [ ] `tailwind.config.ts`
- [ ] `tsconfig.json`
- [ ] `postcss.config.js`
- [ ] `eslint.config.js`
- [ ] `vercel.json`
- [ ] `.gitignore`
- [ ] `.env.example`
- [ ] `product-brief.yaml`
- [ ] `CLAUDE.md`
- [ ] `TEMPLATE-GUIDE.md`
- [ ] `IMAGE-GUIDE.md` (generated)
- [ ] `LAUNCH-CHECKLIST.md` (12-section sign-off checklist)
- [ ] `GOOGLE-READINESS.md` (Google Search Console compliance guide)

### .github (1 file)
- [ ] `.github/workflows/ci.yml`

### Public (5+ files)
- [ ] `public/robots.txt`
- [ ] `src/pages/llms.txt.ts` (dynamic API route — auto-generated from config)
- [ ] `public/favicon.ico`
- [ ] `public/favicon.png`
- [ ] `public/assets/og-default.png` (1200x630 social preview image)

### Source: Lib (4 files)
- [ ] `src/lib/config.ts`
- [ ] `src/lib/image-map.ts`
- [ ] `src/lib/schema.ts`
- [ ] `src/lib/schema.test.ts`

### Source: Scripts (4 files)
- [ ] `src/scripts/main.ts` (single entry point — imports the other 3)
- [ ] `src/scripts/interactions.ts`
- [ ] `src/scripts/analytics.ts`
- [ ] `src/scripts/header.ts`

### Source: CSS (1 file)
- [ ] `src/index.css`

### Source: Layouts (2 files)
- [ ] `src/layouts/BaseLayout.astro`
- [ ] `src/layouts/ContentLayout.astro`

### Source: Components (12 files)
- [ ] `src/components/HeaderAstro.astro`
- [ ] `src/components/FooterAstro.astro`
- [ ] `src/components/BreadcrumbsAstro.astro`
- [ ] `src/components/RelatedArticlesAstro.astro`
- [ ] `src/components/StatCard.astro`
- [ ] `src/components/ProTip.astro`
- [ ] `src/components/Callout.astro`
- [ ] `src/components/ProductImage.astro`
- [ ] `src/components/ComparisonTable.astro`
- [ ] `src/components/EmailCapture.astro`
- [ ] `src/components/AffiliateDisclosure.astro`
- [ ] `src/components/ProductHero.astro`

### Source: Pages
- [ ] `src/pages/index.astro` (homepage — authority hub)
- [ ] `src/pages/404.astro`
- [ ] `src/pages/guides/index.astro` (resource hub)
- [ ] `src/pages/reviews/[product-slug].astro` (1 per product, 15-25 pages)
- [ ] `src/pages/best-[category-slug].astro` (1 per category, 4-8 pages)
- [ ] `src/pages/[product-a]-vs-[product-b].astro` (8-15 comparison pages)
- [ ] `src/pages/guides/[guide-slug].astro` (6-10 buyer guides)
- [ ] `src/pages/[niche]-for-[activity].astro` (8-12 activity guides)
- [ ] `src/pages/[topic-slug].astro` (6-10 knowledge base pages)

### Research (5 files, generated during Phase 1)
- [ ] `research/product-catalog-research.md`
- [ ] `research/category-research.md`
- [ ] `research/market-research.md`
- [ ] `research/design-decisions.md`
- [ ] `research/site-plan.md`

### Scripts (4 files)
- [ ] `scripts/convert-to-webp.mjs`
- [ ] `scripts/generate-local-images.mjs`
- [ ] `scripts/image-gen-server.mjs`
- [ ] `scripts/checklist-server.mjs`
