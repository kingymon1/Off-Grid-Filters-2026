# Plan: Update CLAUDE.md Template to Match Actual Implementation

## Goal
Make CLAUDE.md fully reproducible — a fresh project using this template should produce
a site identical to the current implementation without any post-build iteration.

---

## 14 Changes to CLAUDE.md

### 1. NEW: Section 3.2a — "Source: External Scripts" (3 files)

Add after the config/utilities section. Document:
- `src/scripts/interactions.ts` — scroll reveal, progress bar, spotlight cards, counters, Google Fonts activation
- `src/scripts/analytics.ts` — Vercel Web Analytics
- `src/scripts/header.ts` — sticky header, mobile menu, dropdown keyboard navigation

Explain WHY: Astro inlines `<script>` content as `<script type="module">` in built HTML.
CSP `script-src 'self'` blocks these inline scripts. External `.ts` files referenced via
`<script src="...">` produce `<script type="module" src="/assets/xxx.hash.js">` — CSP-safe.

### 2. UPDATE: Section 3.1 — astro.config.mjs

Add `assetsInlineLimit: 0` to the vite build config spec:
```js
vite: { build: { assetsInlineLimit: 0 } }
```
Explain: prevents Vite from re-inlining small scripts, breaking CSP.

### 3. UPDATE: Section 3.1 — vercel.json security headers

Add full headers spec including:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Cross-Origin-Opener-Policy: same-origin`
- `Access-Control-Allow-Origin: https://[site-domain]`
- CSP with NO `'unsafe-inline'` in script-src (only in style-src)

### 4. UPDATE: Section 3.1 — vercel.json cache headers

Document split cache rules for `/assets/`:
- `/assets/(.*)\\.(?:css|js)$` → `max-age=31536000, immutable` (hash-named build output)
- `/assets/(.*)\\.(?:webp|png|jpg|svg|ico)$` → `max-age=86400, stale-while-revalidate` (images)

### 5. UPDATE: Section 3.4 — BaseLayout font loading

Replace "Google Fonts link (Inter, weights 400-900)" with deferred pattern:
```html
<link rel="preload" href="...Inter..." as="style">
<link id="google-fonts" href="...Inter..." rel="stylesheet" media="print">
<noscript><link rel="stylesheet" href="...Inter..."></noscript>
```
And document that `interactions.ts` switches `media="print"` → `"all"` on load.

### 6. UPDATE: Section 3.4 — BaseLayout scripts

Replace inline `<script>` tag documentation with external references:
```html
<script src="../scripts/interactions.ts"></script>
<script src="../scripts/analytics.ts"></script>
```

### 7. UPDATE: Section 3.5 — HeaderAstro script

Change from inline `<script>` to:
```html
<script src="../scripts/header.ts"></script>
```

### 8. UPDATE: Section 2.1 — Color scheme table

Change `--muted-foreground` from `210 10% 55%` to `210 8% 62%`.
Add note: "Ensure ≥5.5:1 contrast ratio against card bg for WCAG AA."

### 9. UPDATE: Section 3.5 — ProTip component

Add: "ProTip header color uses brightened primary `hsl(205 70% 58%)` (vs primary's 48%)
for WCAG AA contrast on dark backgrounds."

### 10. NEW: Section 3.7 — OG image generation

Document generating `public/assets/og-default.png`:
- 1200x630px PNG via Sharp SVG rendering
- Site branding, title, CTA button(s), trust badges
- Referenced by `siteConfig.seo.defaultOgImage`
- Used as default for og:image and twitter:image meta tags

### 11. UPDATE: Review page section — cons-list h3 color

Change to `hsl(0 70% 62%)` (not 55%) for WCAG AA contrast on dark backgrounds.

### 12. NEW: CRITICAL RULES — Add CSP rules (25-27)

```
25. **NEVER write inline <script> tags.** Use external `.ts` files in `src/scripts/`
    referenced via `<script src="...">`. Astro inlines them otherwise, breaking CSP.
26. **Set `vite.build.assetsInlineLimit: 0`** to prevent Vite from re-inlining.
27. **Never use inline event handlers** (onload, onclick) — move to external scripts.
```

### 13. UPDATE: File Checklist — Add missing entries

Add new section:
```
### Source: Scripts (3 files)
- [ ] `src/scripts/interactions.ts`
- [ ] `src/scripts/analytics.ts`
- [ ] `src/scripts/header.ts`
```

Add to Public section:
```
- [ ] `public/assets/og-default.png` (1200x630 social preview image)
```

### 14. UPDATE: Section 2.2 — Homepage title format

Change to: `${siteName} | ${niche} Reviews & Buying Guides`
Note: pipe `|` separator, keep total ≤60 characters.

---

## Also update these files

### LAUNCH-CHECKLIST.md
- Add: "Verify no inline `<script type="module">` without `src` (CSP compliance)"
- Add: "Verify HSTS, COOP, Access-Control-Allow-Origin headers present"
- Add: "Verify Google Fonts link has `media='print'` (deferred loading)"
- Add: "Verify `og-default.png` exists at 1200x630"

### GOOGLE-READINESS.md
- Add HSTS/COOP to Section 2.7 (Security & Deployment)

---

## Files to modify
1. `CLAUDE.md` — all 14 changes above
2. `LAUNCH-CHECKLIST.md` — 4 new check items
3. `GOOGLE-READINESS.md` — HSTS/COOP mention
