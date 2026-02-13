#!/usr/bin/env node
/**
 * OffGrid Filters — Local SVG-to-WebP Image Generator
 *
 * Generates branded editorial/graphic-style images using SVG + Sharp.
 * No AI API needed — creates stylish illustrations with gradients,
 * icons, and text overlays matching the site's dark color scheme.
 *
 * Usage: node scripts/generate-local-images.mjs
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ASSETS_DIR = join(ROOT, 'public', 'assets', 'images');

// ─── Site Color Scheme (from src/index.css) ──────────────
const COLORS = {
  background:      { h: 210, s: 25, l: 5 },   // --background
  foreground:      { h: 210, s: 10, l: 95 },   // --foreground
  card:            { h: 210, s: 18, l: 9 },     // --card
  cardElevated:    { h: 210, s: 18, l: 12 },    // --card-elevated
  primary:         { h: 205, s: 70, l: 48 },    // --primary
  primaryWarm:     { h: 205, s: 70, l: 38 },    // --primary-warm
  accent:          { h: 32,  s: 90, l: 52 },    // --accent
  accentWarm:      { h: 32,  s: 90, l: 42 },    // --accent-warm
  muted:           { h: 210, s: 12, l: 11 },    // --muted
  mutedForeground: { h: 210, s: 8,  l: 55 },    // --muted-foreground
  border:          { h: 210, s: 12, l: 18 },    // --border
};

function hsl(c, alpha) {
  if (alpha !== undefined) return `hsla(${c.h}, ${c.s}%, ${c.l}%, ${alpha})`;
  return `hsl(${c.h}, ${c.s}%, ${c.l}%)`;
}

// ─── SVG Icon Paths ──────────────────────────────────────
// Simple, clean SVG path data for various contextual icons
const ICONS = {
  // Water & Filtration
  waterDrop: 'M12 2C12 2 4 10.5 4 15.5C4 19.64 7.58 23 12 23C16.42 23 20 19.64 20 15.5C20 10.5 12 2 12 2Z',
  filter: 'M3 4h18l-7 9.5V20l-4 2V13.5L3 4z',
  pitcher: 'M6 2h12v2H6V2zM4 6h16l-2 16H6L4 6zm4 4v8h8V10H8z',
  faucet: 'M12 2v6h4v2h-2v2h2a4 4 0 010 8H8a4 4 0 010-8h2v-2H8V8h4V2z',
  glass: 'M7 2h10l-1 18H8L7 2zm1 2l.75 14h6.5L16 4H8z',

  // Nature & Outdoor
  mountain: 'M12 4L2 20h20L12 4zm0 4l6 12H6l6-12z',
  tent: 'M12 2L2 22h20L12 2zm0 6l5 12H7l5-12zM12 2v20',
  tree: 'M12 2l-6 8h3l-4 6h3l-4 6h16l-4-6h3l-4-6h3L12 2z',
  campfire: 'M12 3c-1.5 3-5 5-5 9a5 5 0 0010 0c0-4-3.5-6-5-9zM8 22h8v2H8v-2z',
  sun: 'M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v3m0 16v3m11-11h-3M4 12H1m18.07-7.07l-2.12 2.12M7.05 16.95l-2.12 2.12m14.14 0l-2.12-2.12M7.05 7.05L4.93 4.93',
  wave: 'M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0',

  // Buildings & Home
  house: 'M3 12l9-9 9 9M5 10v10h14V10M9 21v-6h6v6',
  apartment: 'M4 2h16v20H4V2zm4 4h3v3H8V6zm5 0h3v3h-3V6zM8 12h3v3H8v-3zm5 0h3v3h-3v-3zM8 18h3v3H8v-3zm5 0h3v3h-3v-3z',
  rv: 'M2 14h20v4H2v-4zm2-6h12l4 6H4V8zm2 2v2h3v-2H6zm5 0v2h3v-2h-3zM4 18h2v2H4v-2zm14 0h2v2h-2v-2z',

  // People & Activities
  baby: 'M12 4a3 3 0 100 6 3 3 0 000-6zM8 12c-2 0-4 2-4 4v4h16v-4c0-2-2-4-4-4H8z',
  hiking: 'M13.5 5.5a2 2 0 11-4 0 2 2 0 014 0zM10 10l-3 12h2l2-7 3 3v4h2v-5.5l-3-3 1-4 3 3h3V10h-4l-2.5-3L10 10z',
  travel: 'M20 8h-3V5a2 2 0 00-2-2H9a2 2 0 00-2 2v3H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V10a2 2 0 00-2-2zM9 5h6v3H9V5z',

  // Science & Education
  beaker: 'M9 2h6v2h-1v6l4 8v2H6v-2l4-8V4H9V2zm2 2v7L7 19h10l-4-8V4h-2z',
  microscope: 'M12 2a2 2 0 00-2 2v10l-4 6h12l-4-6V4a2 2 0 00-2-2zM8 22h8',
  atom: 'M12 12m-2 0a2 2 0 104 0 2 2 0 10-4 0M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10M12 2a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10M2 12h20',
  shield: 'M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z',
  certificate: 'M4 3h16v14H4V3zm4 4h8M8 9h8M8 11h5M15 17l2 4-2-1-2 1 2-4',

  // Comparison & Guide
  compare: 'M10 3H4a1 1 0 00-1 1v16a1 1 0 001 1h6M14 3h6a1 1 0 011 1v16a1 1 0 01-1 1h-6M12 3v18',
  vsCircle: 'M12 2a10 10 0 100 20 10 10 0 000-20z',
  book: 'M4 19.5A2.5 2.5 0 016.5 17H20V2H6.5A2.5 2.5 0 004 4.5v15zM8 7h8M8 11h6',
  lightbulb: 'M12 2a7 7 0 00-4 12.73V17a1 1 0 001 1h6a1 1 0 001-1v-2.27A7 7 0 0012 2zM9 21h6',
  checklist: 'M4 7h16M4 12h16M4 17h16M8 7l-2 2-1-1M8 12l-2 2-1-1M8 17l-2 2-1-1',

  // Tools & Utilities
  wrench: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
  gauge: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v6l4 2',
  dollar: 'M12 2v20M8 6c0-1.5 1.5-3 4-3s4 1.5 4 3-1.5 3-4 3-4 1.5-4 3 1.5 3 4 3 4-1.5 4-3',
  warning: 'M12 2L2 20h20L12 2zm0 6v6m0 2v2',

  // Misc
  refrigerator: 'M5 2h14v20H5V2zm0 10h14M9 6h1M9 14h1',
  pipe: 'M4 10h6v4H4v-4zm10 0h6v4h-6v-4zm-4 2h4',
  globe: 'M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15 15 0 014 10 15 15 0 01-4 10M12 2a15 15 0 00-4 10 15 15 0 004 10',
  star: 'M12 2l2.94 6.56L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 7.06-.71L12 2z',
  clock: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v6l4 2',
};

// ─── Icon-to-Category Mapping ─────────────────────────────
function getIconForImage(id, category, description) {
  const desc = (description || '').toLowerCase();
  const idLower = (id || '').toLowerCase();

  // Product-specific
  if (desc.includes('pitcher') || desc.includes('dispenser')) return 'pitcher';
  if (desc.includes('ro100') || desc.includes('countertop') || desc.includes('reverse osmosis')) return 'filter';
  if (desc.includes('under-sink') || desc.includes('under sink') || idLower.includes('under-sink')) return 'pipe';
  if (desc.includes('refrigerator') || desc.includes('fridge') || idLower.includes('refrigerator')) return 'refrigerator';
  if (desc.includes('straw') || desc.includes('portable') || desc.includes('survival')) return 'waterDrop';
  if (desc.includes('sediment') || desc.includes('whole house') || idLower.includes('whole-house')) return 'pipe';
  if (desc.includes('replacement')) return 'filter';
  if (desc.includes('tablet') || desc.includes('aquatab')) return 'beaker';
  if (desc.includes('commercial') || desc.includes('elkay')) return 'gauge';

  // Activity guides
  if (desc.includes('camping') || idLower.includes('camping')) return 'tent';
  if (desc.includes('hiking') || idLower.includes('hiking')) return 'hiking';
  if (desc.includes('emergency') || desc.includes('emergencies')) return 'shield';
  if (desc.includes('well water')) return 'pipe';
  if (desc.includes('apartment')) return 'apartment';
  if (desc.includes('rv')) return 'rv';
  if (desc.includes('baby')) return 'baby';
  if (desc.includes('travel')) return 'travel';
  if (desc.includes('off-grid') || desc.includes('off grid')) return 'house';
  if (desc.includes('hard water')) return 'beaker';

  // Knowledge base
  if (desc.includes('reverse osmosis') || desc.includes('what is')) return 'atom';
  if (desc.includes('nsf') || desc.includes('certification')) return 'certificate';
  if (desc.includes('tds')) return 'gauge';
  if (desc.includes('pfas') || desc.includes('lead')) return 'warning';
  if (desc.includes('filter types')) return 'filter';
  if (desc.includes('tap water') || desc.includes('safe')) return 'glass';
  if (desc.includes('history')) return 'clock';

  // Buyer guides
  if (desc.includes('how to choose') || desc.includes('buying')) return 'checklist';
  if (desc.includes('maintenance')) return 'wrench';
  if (desc.includes('sizing')) return 'gauge';
  if (desc.includes('under $50') || desc.includes('budget') || desc.includes('cost')) return 'dollar';
  if (desc.includes('ro vs carbon') || desc.includes('vs')) return 'compare';
  if (desc.includes('beginner')) return 'lightbulb';
  if (desc.includes('mistake')) return 'warning';

  // Category-level
  if (category === 'comparisons') return 'compare';
  if (category === 'buyer-guides') return 'book';
  if (category === 'activity-guides') return 'mountain';
  if (category === 'knowledge-base') return 'atom';
  if (category === 'category-roundups') return 'star';
  if (category === 'featured-picks') return 'star';
  if (category === 'category-browser') return 'filter';
  if (category === 'about') return 'shield';

  return 'waterDrop';
}

// ─── Gradient Styles per Category ────────────────────────
function getGradientStyle(category) {
  switch (category) {
    case 'featured-picks':
      return {
        bg1: COLORS.primary,
        bg2: COLORS.primaryWarm,
        overlay: COLORS.accent,
        overlayOpacity: 0.15,
      };
    case 'category-browser':
      return {
        bg1: COLORS.primaryWarm,
        bg2: { h: 205, s: 60, l: 30 },
        overlay: COLORS.primary,
        overlayOpacity: 0.2,
      };
    case 'category-roundups':
      return {
        bg1: { h: 205, s: 65, l: 35 },
        bg2: { h: 210, s: 50, l: 20 },
        overlay: COLORS.accent,
        overlayOpacity: 0.12,
      };
    case 'comparisons':
      return {
        bg1: { h: 210, s: 40, l: 15 },
        bg2: { h: 210, s: 30, l: 8 },
        overlay: COLORS.primary,
        overlayOpacity: 0.2,
      };
    case 'buyer-guides':
      return {
        bg1: { h: 32, s: 70, l: 35 },
        bg2: { h: 210, s: 30, l: 12 },
        overlay: COLORS.accent,
        overlayOpacity: 0.15,
      };
    case 'activity-guides':
      return {
        bg1: { h: 155, s: 50, l: 30 },
        bg2: { h: 210, s: 30, l: 10 },
        overlay: COLORS.primary,
        overlayOpacity: 0.15,
      };
    case 'knowledge-base':
      return {
        bg1: { h: 260, s: 40, l: 30 },
        bg2: { h: 210, s: 30, l: 10 },
        overlay: COLORS.primary,
        overlayOpacity: 0.12,
      };
    case 'about':
      return {
        bg1: COLORS.primary,
        bg2: { h: 210, s: 25, l: 10 },
        overlay: COLORS.accent,
        overlayOpacity: 0.1,
      };
    default:
      return {
        bg1: COLORS.primary,
        bg2: COLORS.background,
        overlay: COLORS.accent,
        overlayOpacity: 0.1,
      };
  }
}

// ─── SVG Builder ──────────────────────────────────────────
function buildSVG(image, width, height) {
  const iconKey = getIconForImage(image.id, image.category, image.description);
  const iconPath = ICONS[iconKey] || ICONS.waterDrop;
  const style = getGradientStyle(image.category);

  // Determine secondary icon for decorative elements
  const secondaryIconKey = iconKey === 'waterDrop' ? 'filter' : 'waterDrop';
  const secondaryIconPath = ICONS[secondaryIconKey] || ICONS.filter;

  // Title text - clean up for display
  let title = image.description || '';
  // Split long titles into two lines
  let titleLine1 = title;
  let titleLine2 = '';
  if (title.length > 30) {
    const mid = Math.floor(title.length / 2);
    let splitIdx = title.lastIndexOf(' ', mid + 8);
    if (splitIdx < mid - 10) splitIdx = title.indexOf(' ', mid);
    if (splitIdx > 0) {
      titleLine1 = title.slice(0, splitIdx);
      titleLine2 = title.slice(splitIdx + 1);
    }
  }

  const cx = width / 2;
  const cy = height / 2;
  const iconSize = Math.min(width, height) * 0.28;
  const fontSize = Math.min(width, height) * 0.055;
  const subFontSize = fontSize * 0.55;

  // Category label
  const categoryLabels = {
    'featured-picks': 'FEATURED PICK',
    'category-browser': 'CATEGORY',
    'category-roundups': 'BEST OF',
    'comparisons': 'COMPARISON',
    'buyer-guides': 'BUYER GUIDE',
    'activity-guides': 'ACTIVITY GUIDE',
    'knowledge-base': 'KNOWLEDGE BASE',
    'about': 'ABOUT',
    'product-reviews': 'REVIEW',
  };
  const categoryLabel = categoryLabels[image.category] || 'OFFGRID FILTERS';

  // Generate subtle grid pattern
  const gridSpacing = 40;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <!-- Background gradient -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${hsl(style.bg1)}" />
      <stop offset="100%" stop-color="${hsl(style.bg2)}" />
    </linearGradient>

    <!-- Radial glow -->
    <radialGradient id="glowCenter" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="${hsl(style.overlay, 0.25)}" />
      <stop offset="50%" stop-color="${hsl(style.overlay, 0.08)}" />
      <stop offset="100%" stop-color="${hsl(style.overlay, 0)}" />
    </radialGradient>

    <!-- Icon gradient -->
    <linearGradient id="iconGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${hsl(COLORS.foreground, 0.9)}" />
      <stop offset="100%" stop-color="${hsl(COLORS.foreground, 0.5)}" />
    </linearGradient>

    <!-- Accent glow for icon -->
    <radialGradient id="iconGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${hsl(COLORS.primary, 0.35)}" />
      <stop offset="60%" stop-color="${hsl(COLORS.primary, 0.08)}" />
      <stop offset="100%" stop-color="${hsl(COLORS.primary, 0)}" />
    </radialGradient>

    <!-- Top edge accent -->
    <linearGradient id="topAccent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${hsl(COLORS.primary, 0)}" />
      <stop offset="30%" stop-color="${hsl(COLORS.primary, 0.8)}" />
      <stop offset="70%" stop-color="${hsl(COLORS.accent, 0.8)}" />
      <stop offset="100%" stop-color="${hsl(COLORS.accent, 0)}" />
    </linearGradient>

    <!-- Noise texture filter -->
    <filter id="noise" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
      <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
      <feComponentTransfer in="grayNoise" result="alphaNoiseOnly">
        <feFuncA type="linear" slope="0.04" />
      </feComponentTransfer>
      <feBlend in="SourceGraphic" in2="alphaNoiseOnly" mode="overlay"/>
    </filter>

    <!-- Soft shadow for text -->
    <filter id="textShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#000" flood-opacity="0.6"/>
    </filter>

    <!-- Clip for rounded corners on inner elements -->
    <clipPath id="roundClip">
      <rect width="${width}" height="${height}" rx="0" ry="0"/>
    </clipPath>
  </defs>

  <!-- Base background -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

  <!-- Grid pattern -->
  <g opacity="0.05" stroke="${hsl(COLORS.foreground)}" stroke-width="0.5">
    ${Array.from({length: Math.ceil(width/gridSpacing)}, (_, i) =>
      `<line x1="${i*gridSpacing}" y1="0" x2="${i*gridSpacing}" y2="${height}" />`
    ).join('\n    ')}
    ${Array.from({length: Math.ceil(height/gridSpacing)}, (_, i) =>
      `<line x1="0" y1="${i*gridSpacing}" x2="${width}" y2="${i*gridSpacing}" />`
    ).join('\n    ')}
  </g>

  <!-- Radial glow overlay -->
  <rect width="${width}" height="${height}" fill="url(#glowCenter)" />

  <!-- Decorative circles -->
  <circle cx="${width * 0.15}" cy="${height * 0.25}" r="${Math.min(width,height)*0.18}" fill="${hsl(COLORS.primary, 0.04)}" />
  <circle cx="${width * 0.85}" cy="${height * 0.7}" r="${Math.min(width,height)*0.22}" fill="${hsl(COLORS.accent, 0.03)}" />
  <circle cx="${width * 0.7}" cy="${height * 0.15}" r="${Math.min(width,height)*0.08}" fill="${hsl(COLORS.primary, 0.06)}" />

  <!-- Decorative dots -->
  <g opacity="0.08" fill="${hsl(COLORS.foreground)}">
    <circle cx="${width * 0.08}" cy="${height * 0.55}" r="2" />
    <circle cx="${width * 0.12}" cy="${height * 0.55}" r="2" />
    <circle cx="${width * 0.16}" cy="${height * 0.55}" r="2" />
    <circle cx="${width * 0.08}" cy="${height * 0.59}" r="2" />
    <circle cx="${width * 0.12}" cy="${height * 0.59}" r="2" />
    <circle cx="${width * 0.16}" cy="${height * 0.59}" r="2" />
    <circle cx="${width * 0.84}" cy="${height * 0.35}" r="2" />
    <circle cx="${width * 0.88}" cy="${height * 0.35}" r="2" />
    <circle cx="${width * 0.92}" cy="${height * 0.35}" r="2" />
    <circle cx="${width * 0.84}" cy="${height * 0.39}" r="2" />
    <circle cx="${width * 0.88}" cy="${height * 0.39}" r="2" />
    <circle cx="${width * 0.92}" cy="${height * 0.39}" r="2" />
  </g>

  <!-- Decorative lines -->
  <line x1="${width * 0.05}" y1="${height * 0.15}" x2="${width * 0.25}" y2="${height * 0.15}" stroke="${hsl(COLORS.primary, 0.12)}" stroke-width="1" />
  <line x1="${width * 0.75}" y1="${height * 0.85}" x2="${width * 0.95}" y2="${height * 0.85}" stroke="${hsl(COLORS.accent, 0.12)}" stroke-width="1" />

  <!-- Small secondary icons as decoration -->
  <g transform="translate(${width * 0.08}, ${height * 0.72}) scale(${iconSize * 0.015})" opacity="0.06" fill="${hsl(COLORS.foreground)}">
    <path d="${secondaryIconPath}" />
  </g>
  <g transform="translate(${width * 0.85}, ${height * 0.12}) scale(${iconSize * 0.012})" opacity="0.05" fill="${hsl(COLORS.foreground)}">
    <path d="${secondaryIconPath}" />
  </g>

  <!-- Icon glow background -->
  <ellipse cx="${cx}" cy="${cy * 0.78}" rx="${iconSize * 1.2}" ry="${iconSize * 1.2}" fill="url(#iconGlow)" />

  <!-- Main icon -->
  <g transform="translate(${cx - iconSize/2}, ${cy * 0.78 - iconSize/2}) scale(${iconSize / 24})" fill="url(#iconGrad)" stroke="none">
    <path d="${iconPath}" />
  </g>

  <!-- Category label -->
  <text x="${cx}" y="${cy * 0.78 + iconSize * 0.75}" text-anchor="middle"
    font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" font-size="${subFontSize * 0.85}"
    font-weight="700" letter-spacing="0.15em" fill="${hsl(COLORS.primary, 0.8)}">
    ${escapeXml(categoryLabel)}
  </text>

  <!-- Divider line under category -->
  <line x1="${cx - 40}" y1="${cy * 0.78 + iconSize * 0.85}" x2="${cx + 40}" y2="${cy * 0.78 + iconSize * 0.85}"
    stroke="${hsl(COLORS.primary, 0.3)}" stroke-width="1.5" stroke-linecap="round" />

  <!-- Title text -->
  <g filter="url(#textShadow)">
    ${titleLine2 ? `
    <text x="${cx}" y="${cy * 0.78 + iconSize * 1.08}" text-anchor="middle"
      font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" font-size="${fontSize}"
      font-weight="800" fill="${hsl(COLORS.foreground, 0.95)}">
      ${escapeXml(titleLine1)}
    </text>
    <text x="${cx}" y="${cy * 0.78 + iconSize * 1.08 + fontSize * 1.25}" text-anchor="middle"
      font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" font-size="${fontSize}"
      font-weight="800" fill="${hsl(COLORS.foreground, 0.95)}">
      ${escapeXml(titleLine2)}
    </text>
    ` : `
    <text x="${cx}" y="${cy * 0.78 + iconSize * 1.08}" text-anchor="middle"
      font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" font-size="${fontSize}"
      font-weight="800" fill="${hsl(COLORS.foreground, 0.95)}">
      ${escapeXml(titleLine1)}
    </text>
    `}
  </g>

  <!-- Brand watermark -->
  <text x="${width - 20}" y="${height - 14}" text-anchor="end"
    font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" font-size="${subFontSize * 0.7}"
    font-weight="600" letter-spacing="0.05em" fill="${hsl(COLORS.mutedForeground, 0.3)}">
    OFFGRIDFILTERS.COM
  </text>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="${width}" height="3" fill="url(#topAccent)" />

  <!-- Noise overlay -->
  <rect width="${width}" height="${height}" fill="transparent" filter="url(#noise)" />
</svg>`;

  return svg;
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ─── Image Dimensions by Aspect Ratio ────────────────────
function getDimensions(aspectRatio) {
  switch (aspectRatio) {
    case '16:9': return { width: 1200, height: 675 };
    case '1:1':  return { width: 800, height: 800 };
    case '4:3':  return { width: 1200, height: 900 };
    default:     return { width: 1200, height: 675 };
  }
}

// ─── All Image Prompts (non-product-review) ──────────────
const IMAGE_PROMPTS = [
  // HOMEPAGE FEATURED PICKS (4)
  { id: 'featured-bluevua', filename: 'bluevua-ro100ropot-uv-featured.webp', category: 'featured-picks', aspectRatio: '1:1', description: 'Featured: Bluevua RO100ROPOT-UV' },
  { id: 'featured-amazon-basics', filename: 'amazon-basics-10-cup-pitcher-featured.webp', category: 'featured-picks', aspectRatio: '1:1', description: 'Featured: Amazon Basics Pitcher' },
  { id: 'featured-ispring', filename: 'ispring-rcc7ak-featured.webp', category: 'featured-picks', aspectRatio: '1:1', description: 'Featured: iSpring RCC7AK' },
  { id: 'featured-timain', filename: 'timain-filter-straw-featured.webp', category: 'featured-picks', aspectRatio: '1:1', description: 'Featured: Timain Filter Straw' },

  // HOMEPAGE CATEGORY BROWSER (6)
  { id: 'cat-countertop', filename: 'category-countertop-filters.webp', category: 'category-browser', aspectRatio: '1:1', description: 'Category: Countertop & Pitcher Filters' },
  { id: 'cat-under-sink', filename: 'category-under-sink-filters.webp', category: 'category-browser', aspectRatio: '1:1', description: 'Category: Under-Sink Filters' },
  { id: 'cat-refrigerator', filename: 'category-refrigerator-filters.webp', category: 'category-browser', aspectRatio: '1:1', description: 'Category: Refrigerator Filters' },
  { id: 'cat-replacement', filename: 'category-replacement-filters.webp', category: 'category-browser', aspectRatio: '1:1', description: 'Category: Replacement Filters' },
  { id: 'cat-survival', filename: 'category-survival-filters.webp', category: 'category-browser', aspectRatio: '1:1', description: 'Category: Survival & Portable Filters' },
  { id: 'cat-whole-house', filename: 'category-whole-house-filters.webp', category: 'category-browser', aspectRatio: '1:1', description: 'Category: Whole House Filters' },

  // CATEGORY ROUNDUP HEROES (6)
  { id: 'roundup-countertop', filename: 'best-countertop-filters-hero.webp', category: 'category-roundups', aspectRatio: '16:9', description: 'Best Countertop Filters' },
  { id: 'roundup-under-sink', filename: 'best-under-sink-filters-hero.webp', category: 'category-roundups', aspectRatio: '16:9', description: 'Best Under-Sink Filters' },
  { id: 'roundup-refrigerator', filename: 'best-refrigerator-filters-hero.webp', category: 'category-roundups', aspectRatio: '16:9', description: 'Best Refrigerator Filters' },
  { id: 'roundup-replacement', filename: 'best-replacement-filters-hero.webp', category: 'category-roundups', aspectRatio: '16:9', description: 'Best Replacement Filters' },
  { id: 'roundup-survival', filename: 'best-survival-filters-hero.webp', category: 'category-roundups', aspectRatio: '16:9', description: 'Best Survival Filters' },
  { id: 'roundup-whole-house', filename: 'best-whole-house-filters-hero.webp', category: 'category-roundups', aspectRatio: '16:9', description: 'Best Whole House Filters' },

  // COMPARISON HEROES (15)
  { id: 'vs-bluevua-uv-vs-lite', filename: 'bluevua-ro100ropot-uv-vs-bluevua-ro100ropot-lite-uv-hero.webp', category: 'comparisons', aspectRatio: '16:9', description: 'Bluevua UV vs Lite UV' },
  { id: 'vs-ispring-vs-waterdrop', filename: 'ispring-rcc7ak-vs-waterdrop-g3p600-hero.webp', category: 'comparisons', aspectRatio: '16:9', description: 'iSpring vs Waterdrop' },
  { id: 'vs-pentair-h1200-vs-h300', filename: 'pentair-everpure-h1200-vs-pentair-everpure-h300-hero.webp', category: 'comparisons', aspectRatio: '16:9', description: 'Pentair H-1200 vs H-300' },
  { id: 'vs-bluevua-vs-ispring', filename: 'bluevua-ro100ropot-uv-vs-ispring-rcc7ak-hero.webp', category: 'comparisons', aspectRatio: '16:9', description: 'Bluevua UV vs iSpring' },
  { id: 'vs-ge-xwfe-vs-rpwfe', filename: 'ge-xwfe-vs-ge-rpwfe-hero.webp', category: 'comparisons', aspectRatio: '16:9', description: 'GE XWFE vs RPWFE' },
  { id: 'vs-everydrop-vs-ge', filename: 'everydrop-filter-1-vs-ge-xwfe-hero.webp', category: 'comparisons', aspectRatio: '16:9', description: 'everydrop Filter 1 vs GE XWFE' },
  { id: 'vs-samsung-vs-everydrop', filename: 'samsung-haf-qin-vs-everydrop-filter-a-hero.webp', category: 'comparisons', aspectRatio: '16:9', description: 'Samsung vs everydrop' },
  { id: 'vs-brita-standard-vs-elite', filename: 'brita-standard-vs-brita-elite-hero.webp', category: 'comparisons', aspectRatio: '16:9', description: 'Brita Standard vs Elite' },
  { id: 'vs-brita-elite-vs-zerowater', filename: 'brita-elite-vs-zerowater-hero.webp', category: 'comparisons', aspectRatio: '16:9', description: 'Brita Elite vs ZeroWater' },
  { id: 'vs-brita-vs-pur', filename: 'brita-standard-vs-pur-hero.webp', category: 'comparisons', aspectRatio: '16:9', description: 'Brita Standard vs PUR' },
  { id: 'vs-zerowater-vs-pur', filename: 'zerowater-vs-pur-hero.webp', category: 'comparisons', aspectRatio: '16:9', description: 'ZeroWater vs PUR' },
  { id: 'vs-waterdrop-vs-brita-elite', filename: 'waterdrop-plus-vs-brita-elite-hero.webp', category: 'comparisons', aspectRatio: '16:9', description: 'Waterdrop Plus vs Brita Elite' },
  { id: 'vs-amazon-vs-brita', filename: 'amazon-basics-vs-brita-standard-hero.webp', category: 'comparisons', aspectRatio: '16:9', description: 'Amazon Basics vs Brita Standard' },
  { id: 'vs-timain-vs-membrane', filename: 'timain-vs-membrane-solutions-straw-hero.webp', category: 'comparisons', aspectRatio: '16:9', description: 'Timain vs Membrane Solutions' },
  { id: 'vs-timain-vs-naturenova', filename: 'timain-vs-naturenova-straw-hero.webp', category: 'comparisons', aspectRatio: '16:9', description: 'Timain vs NatureNova' },

  // BUYER GUIDE HEROES (8)
  { id: 'guide-how-to-choose', filename: 'how-to-choose-water-filter-hero.webp', category: 'buyer-guides', aspectRatio: '16:9', description: 'How to Choose a Water Filter' },
  { id: 'guide-maintenance', filename: 'water-filter-maintenance-hero.webp', category: 'buyer-guides', aspectRatio: '16:9', description: 'Water Filter Maintenance Guide' },
  { id: 'guide-sizing', filename: 'water-filter-sizing-guide-hero.webp', category: 'buyer-guides', aspectRatio: '16:9', description: 'Water Filter Sizing Guide' },
  { id: 'guide-under-50', filename: 'best-water-filters-under-50-hero.webp', category: 'buyer-guides', aspectRatio: '16:9', description: 'Best Water Filters Under $50' },
  { id: 'guide-ro-vs-carbon', filename: 'reverse-osmosis-vs-carbon-filters-hero.webp', category: 'buyer-guides', aspectRatio: '16:9', description: 'RO vs Carbon Filters' },
  { id: 'guide-beginner', filename: 'water-filtration-beginner-guide-hero.webp', category: 'buyer-guides', aspectRatio: '16:9', description: 'Beginner Guide to Water Filtration' },
  { id: 'guide-mistakes', filename: 'water-filter-mistakes-hero.webp', category: 'buyer-guides', aspectRatio: '16:9', description: 'Common Water Filter Mistakes' },
  { id: 'guide-cost', filename: 'water-filter-cost-analysis-hero.webp', category: 'buyer-guides', aspectRatio: '16:9', description: 'Water Filter Cost Analysis' },

  // ACTIVITY GUIDE HEROES (10)
  { id: 'activity-camping', filename: 'water-filters-for-camping-hero.webp', category: 'activity-guides', aspectRatio: '16:9', description: 'Water Filters for Camping' },
  { id: 'activity-hiking', filename: 'water-filters-for-hiking-hero.webp', category: 'activity-guides', aspectRatio: '16:9', description: 'Water Filters for Hiking' },
  { id: 'activity-emergencies', filename: 'water-filters-for-emergencies-hero.webp', category: 'activity-guides', aspectRatio: '16:9', description: 'Water Filters for Emergencies' },
  { id: 'activity-well-water', filename: 'water-filters-for-well-water-hero.webp', category: 'activity-guides', aspectRatio: '16:9', description: 'Water Filters for Well Water' },
  { id: 'activity-apartments', filename: 'water-filters-for-apartments-hero.webp', category: 'activity-guides', aspectRatio: '16:9', description: 'Water Filters for Apartments' },
  { id: 'activity-rv', filename: 'water-filters-for-rv-hero.webp', category: 'activity-guides', aspectRatio: '16:9', description: 'Water Filters for RV' },
  { id: 'activity-baby', filename: 'water-filters-for-baby-hero.webp', category: 'activity-guides', aspectRatio: '16:9', description: 'Water Filters for Baby' },
  { id: 'activity-travel', filename: 'water-filters-for-travel-hero.webp', category: 'activity-guides', aspectRatio: '16:9', description: 'Water Filters for Travel' },
  { id: 'activity-off-grid', filename: 'water-filters-for-off-grid-hero.webp', category: 'activity-guides', aspectRatio: '16:9', description: 'Water Filters for Off-Grid Living' },
  { id: 'activity-hard-water', filename: 'water-filters-for-hard-water-hero.webp', category: 'activity-guides', aspectRatio: '16:9', description: 'Water Filters for Hard Water' },

  // KNOWLEDGE BASE HEROES (8)
  { id: 'kb-reverse-osmosis', filename: 'what-is-reverse-osmosis-hero.webp', category: 'knowledge-base', aspectRatio: '16:9', description: 'What Is Reverse Osmosis?' },
  { id: 'kb-nsf', filename: 'nsf-certifications-explained-hero.webp', category: 'knowledge-base', aspectRatio: '16:9', description: 'NSF Certifications Explained' },
  { id: 'kb-tds', filename: 'understanding-tds-hero.webp', category: 'knowledge-base', aspectRatio: '16:9', description: 'Understanding TDS' },
  { id: 'kb-pfas', filename: 'pfas-in-drinking-water-hero.webp', category: 'knowledge-base', aspectRatio: '16:9', description: 'PFAS in Drinking Water' },
  { id: 'kb-lead', filename: 'lead-in-drinking-water-hero.webp', category: 'knowledge-base', aspectRatio: '16:9', description: 'Lead in Drinking Water' },
  { id: 'kb-filter-types', filename: 'water-filter-types-explained-hero.webp', category: 'knowledge-base', aspectRatio: '16:9', description: 'Water Filter Types Explained' },
  { id: 'kb-tap-water', filename: 'is-tap-water-safe-hero.webp', category: 'knowledge-base', aspectRatio: '16:9', description: 'Is Tap Water Safe?' },
  { id: 'kb-history', filename: 'history-of-water-filtration-hero.webp', category: 'knowledge-base', aspectRatio: '16:9', description: 'History of Water Filtration' },

  // ABOUT PAGE (1)
  { id: 'about', filename: 'about-hero.webp', category: 'about', aspectRatio: '16:9', description: 'About OffGrid Filters' },
];

// ─── Main ─────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log('  OffGrid Filters - Local Image Generator');
  console.log('  ========================================');
  console.log(`  ${IMAGE_PROMPTS.length} images to generate`);
  console.log(`  Output: ${ASSETS_DIR}`);
  console.log('');

  // Ensure output directory exists
  await mkdir(ASSETS_DIR, { recursive: true });

  let success = 0;
  let errors = 0;

  for (let i = 0; i < IMAGE_PROMPTS.length; i++) {
    const image = IMAGE_PROMPTS[i];
    const { width, height } = getDimensions(image.aspectRatio);
    const baseName = image.filename.replace('.webp', '');

    process.stdout.write(`  [${String(i + 1).padStart(2)}/${IMAGE_PROMPTS.length}] ${image.filename}... `);

    try {
      // Build SVG
      const svg = buildSVG(image, width, height);
      const svgBuffer = Buffer.from(svg);

      // Convert to WebP with Sharp
      // Full size
      await sharp(svgBuffer)
        .webp({ quality: 85 })
        .toFile(join(ASSETS_DIR, `${baseName}.webp`));

      // Medium variant (800px wide)
      await sharp(svgBuffer)
        .resize(800, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(join(ASSETS_DIR, `${baseName}-medium.webp`));

      // Small variant (400px wide)
      await sharp(svgBuffer)
        .resize(400, null, { withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(join(ASSETS_DIR, `${baseName}-small.webp`));

      console.log(`OK (${width}x${height}, 3 variants)`);
      success++;
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      errors++;
    }
  }

  console.log('');
  console.log('  ========================================');
  console.log(`  Done! ${success} succeeded, ${errors} failed`);
  console.log(`  Total files created: ${success * 3} (3 variants each)`);
  console.log('');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
