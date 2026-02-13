# Plan: Fix Core Web Vitals — CLS, LCP, and Performance

## Problem

PageSpeed Insights (mobile) for `/reviews/bluevua-ro100ropot-uv/` shows:
- **CLS: 0.221** (POOR — must be under 0.1)
- **LCP: 2.6s** (NEEDS IMPROVEMENT — target under 2.5s)
- **6 render-blocking CSS files** (510ms each, 2,880ms document block)
- **Forced reflow: 36ms** from `getBoundingClientRect()` in mousemove
- **3 JS modules loading sequentially** (waterfall dependency chain)
- **Unused preconnect** to amazon.com flagged as waste

## Root Cause Analysis

| Metric | Root Cause | File |
|--------|-----------|------|
| CLS 0.221 | `<img>` elements have NO `width`/`height` attributes. Browser can't reserve space until image loads, then `.content-card` shifts down. | `ProductImage.astro` lines 84-93, 104-112 |
| LCP 2.6s | Hero image uses `loading="lazy"` (default) and is NOT preloaded. BaseLayout has a `preloadHero` prop but it reads from `siteConfig.heroPreloadImage` (a single global value), so individual pages can't specify their own hero. | `BaseLayout.astro` lines 52-55, `ProductImage.astro` defaults |
| CSS blocking | `inlineStylesheets: 'auto'` causes Astro to emit 6+ external `<link>` CSS files per page (one per component style block). Each is render-blocking. | `astro.config.mjs` line 20 |
| Forced reflow | `getBoundingClientRect()` called on every `mousemove` event, then immediately sets CSS custom properties — read-write cycle forces layout recalculation. | `interactions.ts` lines 39-46 |
| JS waterfall | 3 separate `<script src="...">` tags produce 3 sequential module downloads: interactions → analytics → header. ES modules don't parallelize when they're separate entry points. | `BaseLayout.astro` lines 277-278, `HeaderAstro.astro` line 127 |
| Unused preconnect | `<link rel="preconnect" href="https://www.amazon.com">` establishes TCP+TLS handshake but the page never fetches resources from amazon.com — all Amazon URLs are navigation `<a>` links. | `BaseLayout.astro` line 59 |

## 6 Fixes (in priority order)

---

### Fix 1: Eliminate CLS — Add width/height to all `<img>` elements

**File:** `src/components/ProductImage.astro`

**What:** Add `width` and `height` attributes to both the editorial and showcase `<img>` tags. Modern browsers use these to calculate intrinsic aspect ratio BEFORE the image loads, reserving the correct space and preventing layout shift.

**Editorial image (line 84-93):**
```html
<!-- Before -->
<img src={imageSrc} ... class="editorial-image" />

<!-- After -->
<img src={imageSrc} ... class="editorial-image" width="1200" height="800" />
```
Width/height won't affect rendering (the CSS `position: absolute; inset: 0; object-fit: cover` controls the actual display) but they give the browser the 3:2 aspect ratio hint.

**Showcase image (line 104-112):**
```html
<!-- Before -->
<img src={imageSrc} ... class="showcase-image" />

<!-- After -->
<img src={imageSrc} ... class="showcase-image" width="480" height="480" />
```
Product showcase images are square (aspect-square container). The 480x480 hint matches the max-width: 480px container.

**Why this works:** The `width`/`height` attributes set the browser's intrinsic aspect ratio calculation. Combined with the existing `aspect-ratio` CSS from Tailwind classes (`aspect-square`, `aspect-[16/9]`, etc.), the container reserves the correct height immediately. The CSS `width: auto; height: auto; object-fit: contain` still controls the actual rendered size.

**Risk:** Zero. Width/height attributes are hints that are overridden by CSS. The images already have CSS controlling their display dimensions.

**Expected impact:** CLS drops from 0.221 → near 0.

---

### Fix 2: Fix LCP — Preload hero image per-page + eager loading

**Files:** `src/layouts/BaseLayout.astro`, `src/components/ProductImage.astro`, review pages

**Part A — BaseLayout: Accept a hero image URL prop**

Change the `preloadHero` pattern from:
```astro
// Current: reads a global config value
{preloadHero && siteConfig.heroPreloadImage && (
  <link rel="preload" href={siteConfig.heroPreloadImage} as="image" type="image/webp" />
)}
```

To:
```astro
// New: accept the URL directly as a prop
interface Props {
  ...
  heroImage?: string;  // path to hero image for preloading
}

{heroImage && (
  <link rel="preload" href={heroImage} as="image" type="image/webp"
    imagesrcset={`${heroImage.replace('.webp', '-small.webp')} 400w, ${heroImage.replace('.webp', '-medium.webp')} 800w, ${heroImage} 1200w`}
    imagesizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px" />
)}
```

Remove the `preloadHero` boolean and `siteConfig.heroPreloadImage`. Each page passes its own hero image path.

**Part B — ContentLayout: Pass heroImage through**

Add `heroImage?: string` to ContentLayout's Props interface and forward it to BaseLayout.

**Part C — ProductImage: Use priority prop for hero instances**

ProductImage already supports `priority={true}` which sets `loading="eager"`, `decoding="sync"`, and `fetchpriority="high"`. Currently the ProductHero component does NOT pass `priority={true}`. Fix:

In `ProductHero.astro` line 28:
```astro
<!-- Before -->
<ProductImage alt={product.name} aspect="square" slug={product.slug} />

<!-- After -->
<ProductImage alt={product.name} aspect="square" slug={product.slug} priority={true} />
```

**Part D — Review pages: Pass heroImage to ContentLayout**

In each review page's ContentLayout call, add the hero image path:
```astro
<ContentLayout
  ...
  heroImage={`/assets/${product.slug}-hero.webp`}
>
```

This requires updating all 27+ review page files (a mechanical change — same pattern in each). Also update category roundups, comparisons, and guide pages similarly.

**Risk:** Low. Preload hints are advisory — if the image doesn't exist, the browser ignores it. Priority loading is already supported by ProductImage.

**Expected impact:** LCP drops from 2.6s → under 2.0s (hero image starts downloading immediately instead of waiting for CSS and HTML parsing).

---

### Fix 3: Eliminate render-blocking CSS — Inline all stylesheets

**File:** `astro.config.mjs`

**What:** Change `inlineStylesheets` from `'auto'` to `'always'`:
```js
build: {
  assets: 'assets',
  inlineStylesheets: 'always',  // was 'auto'
},
```

**Why:** With `'auto'`, Astro emits 6+ external `<link rel="stylesheet">` files per page. Each one is render-blocking — the browser must download and parse ALL of them before painting anything. With `'always'`, all CSS is inlined into `<style>` tags in the HTML `<head>`. This eliminates the 6 separate HTTP requests and their cumulative blocking time.

**Trade-off:** HTML size increases by ~15-25KB (the CSS that was in external files is now in the HTML). But since the HTML is already being downloaded (it's the document request), this is faster than making 6 additional round trips. On HTTP/2, the savings are especially significant because the CSS arrives in the same stream as the HTML.

**CSP compatibility:** Our CSP has `style-src 'self' 'unsafe-inline'` — inline styles are already allowed. No CSP issues.

**Risk:** Very low. This is a standard Astro build option. The CSS content is identical, just delivered differently.

**Expected impact:** Eliminates all 6 render-blocking CSS resources. FCP drops significantly (2,880ms document block → near-zero CSS blocking).

---

### Fix 4: Eliminate forced reflow — Cache getBoundingClientRect

**File:** `src/scripts/interactions.ts`

**What:** Replace the per-mousemove `getBoundingClientRect()` call with a cached value that only updates on resize:

```typescript
// Before (lines 38-46):
document.querySelectorAll('.spotlight-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = (card as HTMLElement).getBoundingClientRect();  // FORCED REFLOW every mousemove
    const x = ((e as MouseEvent).clientX - rect.left) + 'px';
    const y = ((e as MouseEvent).clientY - rect.top) + 'px';
    (card as HTMLElement).style.setProperty('--mouse-x', x);
    (card as HTMLElement).style.setProperty('--mouse-y', y);
  });
});

// After:
const cardRects = new WeakMap<Element, DOMRect>();
document.querySelectorAll('.spotlight-card').forEach((card) => {
  cardRects.set(card, card.getBoundingClientRect());
  card.addEventListener('mousemove', (e) => {
    const rect = cardRects.get(card)!;
    const x = ((e as MouseEvent).clientX - rect.left) + 'px';
    const y = ((e as MouseEvent).clientY - rect.top) + 'px';
    (card as HTMLElement).style.setProperty('--mouse-x', x);
    (card as HTMLElement).style.setProperty('--mouse-y', y);
  });
});
window.addEventListener('resize', () => {
  document.querySelectorAll('.spotlight-card').forEach((card) => {
    cardRects.set(card, card.getBoundingClientRect());
  });
}, { passive: true });
```

**Why:** `getBoundingClientRect()` forces the browser to synchronously calculate layout. When called inside `mousemove` (which fires 60+ times/second), this causes 36ms+ of forced reflow per interaction. Caching the rect eliminates this — the value only changes on window resize, not on mouse movement.

**Risk:** Zero. The rect values are identical between mousemove events unless the window resizes. The resize listener ensures accuracy is maintained.

**Expected impact:** Eliminates the 36ms forced reflow warning. Smoother spotlight card interactions on mobile.

---

### Fix 5: Flatten JS waterfall — Merge scripts into single entry point

**Files:** New `src/scripts/main.ts`, `src/layouts/BaseLayout.astro`, `src/components/HeaderAstro.astro`

**What:** Create a single script entry point that imports all three:

```typescript
// src/scripts/main.ts
import './interactions';
import './analytics';
import './header';
```

Update BaseLayout.astro:
```astro
<!-- Before (lines 277-278): -->
<script src="../scripts/interactions.ts"></script>
<script src="../scripts/analytics.ts"></script>

<!-- After: -->
<script src="../scripts/main.ts"></script>
```

Remove the script tag from HeaderAstro.astro (line 127):
```astro
<!-- Remove: -->
<script src="../scripts/header.ts"></script>
```

**Why:** Three separate `<script src="...">` tags produce three separate ES module downloads. Browsers fetch ES modules sequentially (each must be parsed before the next starts). This creates a 3-step waterfall (~600ms on slow networks). A single entry point with imports lets Vite bundle everything into one file (~200ms).

**CSP compatibility:** Still produces a single `<script type="module" src="/assets/main.hash.js">` — CSP `script-src 'self'` still works.

**Risk:** Very low. The three scripts have no ordering dependencies — they each operate on independent DOM elements. Importing them in one file just bundles them together.

**Expected impact:** JS waterfall drops from ~600ms → ~200ms on slow networks.

---

### Fix 6: Remove unused preconnect — Switch to dns-prefetch only

**File:** `src/layouts/BaseLayout.astro`

**What:**
```astro
<!-- Before (line 59): -->
<link rel="preconnect" href="https://www.amazon.com">

<!-- After: remove this line entirely -->
<!-- Keep only dns-prefetch (line 58): -->
<link rel="dns-prefetch" href="https://www.amazon.com">
```

**Why:** `preconnect` establishes a full TCP + TLS handshake (~100-200ms of CPU/network). But the page never fetches resources FROM amazon.com — all Amazon URLs are `<a href>` navigation links. Users only connect to amazon.com when they click a link, at which point `dns-prefetch` (which pre-resolves DNS only, ~20-50ms) is sufficient.

**Risk:** Zero. Removing preconnect for a domain you never fetch from saves resources.

**Expected impact:** Removes the PageSpeed "unused preconnect" warning. Saves ~100-200ms of wasted connection setup.

---

## Implementation Order

1. **Fix 3** (inline CSS) — biggest single impact, 1 line change
2. **Fix 1** (CLS) — critical metric, simple attribute additions
3. **Fix 2** (LCP preload) — requires touching multiple files but mechanical
4. **Fix 5** (JS merge) — moderate impact, clean refactor
5. **Fix 4** (reflow) — targeted fix, low risk
6. **Fix 6** (preconnect) — trivial, removes warning

## Files Modified

| File | Fixes | Change |
|------|-------|--------|
| `astro.config.mjs` | 3 | Change `inlineStylesheets: 'auto'` → `'always'` |
| `src/components/ProductImage.astro` | 1 | Add `width`/`height` to both `<img>` elements |
| `src/components/ProductHero.astro` | 2 | Add `priority={true}` to ProductImage |
| `src/layouts/BaseLayout.astro` | 2, 5, 6 | New `heroImage` prop, remove `preloadHero`/`siteConfig.heroPreloadImage`, single script ref, remove preconnect |
| `src/layouts/ContentLayout.astro` | 2 | Add `heroImage` prop passthrough |
| `src/scripts/main.ts` (NEW) | 5 | Single entry importing interactions + analytics + header |
| `src/scripts/interactions.ts` | 4 | Cache `getBoundingClientRect()` in WeakMap |
| `src/components/HeaderAstro.astro` | 5 | Remove `<script>` tag |
| 27+ review pages | 2 | Add `heroImage` prop to ContentLayout |
| 6+ category roundup pages | 2 | Add `heroImage` prop to ContentLayout |
| 10+ comparison pages | 2 | Add `heroImage` prop to ContentLayout |
| 8+ guide pages | 2 | Add `heroImage` prop to ContentLayout |

## Documentation Updates

| File | Change |
|------|--------|
| `CLAUDE.md` Section 3.1 | Update `inlineStylesheets` from `'auto'` to `'always'`, document why |
| `CLAUDE.md` Section 3.2a | Document `main.ts` as the single script entry point |
| `CLAUDE.md` Section 3.4 | Update BaseLayout to show `heroImage` prop instead of `preloadHero` |
| `CLAUDE.md` Section 3.5 | Add `width`/`height` requirement for ProductImage `<img>` elements |

## Expected Results

| Metric | Before | After (estimated) |
|--------|--------|-------------------|
| CLS | 0.221 (POOR) | < 0.05 (GOOD) |
| LCP | 2.6s (NEEDS IMPROVEMENT) | < 2.0s (GOOD) |
| FCP | 1.3s | < 0.8s |
| Render-blocking resources | 6 CSS files | 0 |
| JS waterfall | 3 sequential modules | 1 bundled module |
| Forced reflow | 36ms | 0ms |
| Unused preconnect | 1 warning | 0 warnings |

## What This Plan Does NOT Do

- **Does not change the visual design** — all CSS remains identical, just delivered inline
- **Does not change site functionality** — scripts work identically, just bundled
- **Does not add new dependencies** — uses only existing Astro/Vite features
- **Does not require rebuilding images** — width/height are hints, not constraints
- **Does not touch content** — no editorial or SEO changes
