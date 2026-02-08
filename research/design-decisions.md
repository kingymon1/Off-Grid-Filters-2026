# Design Decisions — OffGrid Filters

> Visual direction, color psychology, and design system decisions.

---

## Color Palette Rationale

### Primary: Ocean Blue (HSL 205 70% 48%)
- **Why:** Blue is the #1 color associated with water, trust, and cleanliness — the three pillars of a water filter review site. Ocean blue specifically evokes clean water (our core product) and authority (our content positioning).
- **WCAG contrast:** 4.8:1 against dark background (passes AA)
- **Usage:** Links, headings, accent borders, highlights, star ratings

### Primary Warm: Deep Ocean (HSL 205 70% 38%)
- **Why:** Darker blue for hover states and gradient endpoints. Creates depth without leaving the blue family.
- **Usage:** Button hover states, gradient accents, active states

### Accent: Warm Amber (HSL 32 90% 52%)
- **Why:** Earth tone complement to ocean blue. Evokes warmth, urgency (for CTAs), and the "outdoor/off-grid" aspect of our brand name.
- **Usage:** CTA buttons, star ratings, "VS" badges, winner badges, attention elements

### Background: Deep Navy (HSL 210 25% 5%)
- **Why:** Dark-mode-only design for a modern, premium feel. The slight blue undertone ties back to the water theme. Dark backgrounds make product cards and data stand out.

### Card: Muted Navy (HSL 210 12% 9%)
- **Why:** Slightly lighter than background for card elevation. Low saturation prevents cards from competing with content.

### Border: Steel Blue (HSL 210 10% 16%)
- **Why:** Subtle borders that define structure without creating visual noise.

---

## Typography Decisions

### Font: Inter (400, 500, 600, 700, 800, 900)
- **Why:** Inter is the modern standard for data-heavy, authority content. Excellent readability at all sizes, strong number rendering (critical for specs tables), and widely trusted in professional contexts.
- **Weight distribution:**
  - 400: Body text, FAQ answers
  - 500: Secondary labels, metadata
  - 600: Subheadings, strong labels
  - 700: Section headings, product names, prices
  - 800: Page titles, hero headlines
  - 900: Hero primary text, stat values

### Scale
- Hero title: clamp(2.5rem, 6vw, 4rem)
- Section titles: 2rem
- H2 content: 1.75rem
- H3 content: 1.25rem
- Body: 1rem (base)
- Small/meta: 0.8125rem
- Tiny/badges: 0.6875rem

---

## Animation Philosophy

### Core Principle: "Subtle Delight, Not Distraction"
Every animation serves a purpose:
1. **Scroll reveals** — guide the eye to new content as user scrolls
2. **Hover states** — confirm interactivity, provide feedback
3. **Loading transitions** — reduce perceived wait time
4. **Counter animations** — make statistics feel dynamic and earned

### Animation System
- **Scroll reveals (6 variants):** fade-up, slide-left, slide-right, blur-in, scale-up, stagger-grid
- **Stagger delays (8 levels):** 100ms–800ms for grid items
- **Scroll progress bar:** Gradient bar at viewport top showing page position
- **Spotlight cards:** Radial gradient follows cursor position for depth
- **Animated counters:** Number counting animation on intersection (1500ms, ease-out)
- **Floating orbs:** Slow-moving background decorations for hero depth
- **3D tilt cards:** Perspective transform on hover (reserved for featured items)

### `prefers-reduced-motion` Compliance
All animations completely disabled when user prefers reduced motion. No exceptions.

---

## Component Design Patterns

### Cards
- Consistent 1rem border-radius
- 1px solid border (border color)
- Hover: border-color transition + translateY(-3px) + box-shadow
- Consistent 2rem padding (1.5rem on mobile)

### Buttons
- Primary: gradient background (primary → primary-warm), white text, 0.75rem radius
- Secondary: transparent/card background, border, foreground text
- CTA: `color: #fff !important` for guaranteed contrast on any background
- Hover: translateY(-2px) + enhanced box-shadow

### Badges/Pills
- 9999px border-radius (pill shape)
- Small text (0.625rem–0.6875rem), uppercase, tight letter-spacing
- Primary background for category tags, accent for "VS" and "Winner"

### Data Presentation
- Specs displayed in grid format (2-col mobile, 4-col desktop)
- Comparison tables with horizontal scroll on mobile
- Pros/cons in side-by-side grid (stacked on mobile)
- Rating displays: large number + gradient text + "/5" suffix

---

## Layout Architecture

### Homepage
- **Hero:** Full-width with grid overlay, floating orbs, centered content
- **Content sections:** Container-width (1200px max) with alternating background tints
- **Card grids:** 1-col mobile → 2-col tablet → 3-4 col desktop

### Content Pages
- **Container:** 1200px max-width
- **Content card:** Card background with padding, contains all article content
- **Sidebar-less:** Clean single-column layout for focused reading
- **Breadcrumbs:** Above content card, light/subtle

### Navigation
- **Desktop:** Horizontal nav with dropdown menus (glassmorphism backdrop-blur)
- **Mobile:** Hamburger menu with expandable accordion sections
- **Sticky:** Stays at top of viewport on scroll

---

## Competitor Design Analysis

### Wirecutter
- Clean, white background, minimal decoration
- Strong product photography
- Simple recommendation cards
- **We adopt:** Clean data presentation, strong heading hierarchy
- **We differentiate:** Dark mode for premium feel, more visual animations

### WaterFilterGuru
- Data-heavy, lots of comparison tables
- Blue color scheme (similar to ours)
- **We adopt:** Thorough spec tables, certification emphasis
- **We differentiate:** Better visual design, more structured layout, better mobile experience

### RTINGS
- Extremely data-forward, scientific approach
- **We adopt:** Rigorous spec comparison methodology
- **We differentiate:** More accessible writing tone, better visual hierarchy

---

## Design Priorities (Ranked)

1. **Readability** — Content is king; nothing should impede reading
2. **Trust signals** — Clean design, data presentation, certifications front and center
3. **Mobile-first** — 60%+ of traffic will be mobile
4. **Performance** — No real images (yet), minimal JS, static site generation
5. **Accessibility** — Skip nav, WCAG contrast, reduced-motion support, semantic HTML
6. **Delight** — Subtle animations that make the site feel alive without distracting
