#!/usr/bin/env node

/**
 * Image conversion utility
 * Converts JPG/PNG images to WebP format and creates responsive variants.
 * Background removal is OFF by default (product images keep white backgrounds).
 *
 * Usage:
 *   node scripts/convert-to-webp.mjs                    # process all images in images/ and assets/
 *   node scripts/convert-to-webp.mjs photo.png           # process a single file
 *   node scripts/convert-to-webp.mjs --remove-bg         # enable white background removal
 *   node scripts/convert-to-webp.mjs --threshold 30      # custom white threshold (default: 20)
 *
 * Creates:
 *   - [name].webp        (full size, quality 85)
 *   - [name]-medium.webp (800px wide)
 *   - [name]-small.webp  (400px wide)
 */

import sharp from 'sharp';
import { readdirSync, existsSync, mkdirSync } from 'fs';
import { join, basename, extname } from 'path';

const ASSETS_DIR = 'public/assets';
const IMAGES_DIR = 'public/assets/images';
const SIZES = [
  { suffix: '', width: null, quality: 85 },
  { suffix: '-medium', width: 800, quality: 80 },
  { suffix: '-small', width: 400, quality: 75 },
];

// Parse CLI flags
const args = process.argv.slice(2);
const removeBg = args.includes('--remove-bg');
const thresholdIdx = args.indexOf('--threshold');
const WHITE_THRESHOLD = thresholdIdx !== -1 ? parseInt(args[thresholdIdx + 1], 10) : 20;
const inputFiles = args.filter(a => !a.startsWith('--') && (thresholdIdx === -1 || a !== args[thresholdIdx + 1]));

/**
 * Remove white/near-white background pixels by converting them to transparent.
 * Works by flood-filling from the edges: any pixel where R, G, and B are all
 * within WHITE_THRESHOLD of 255 gets its alpha set to 0.
 *
 * Uses a two-pass approach:
 * 1. Mark edge-connected white pixels (flood fill from borders)
 * 2. Set those pixels to transparent
 *
 * This avoids removing white pixels that are part of the product itself
 * (e.g. a white label on a filter) — only the connected background is removed.
 */
async function removeWhiteBackground(inputBuffer) {
  const image = sharp(inputBuffer).ensureAlpha();
  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const visited = new Uint8Array(width * height);
  const minVal = 255 - WHITE_THRESHOLD;

  function isWhite(idx) {
    return data[idx] >= minVal && data[idx + 1] >= minVal && data[idx + 2] >= minVal;
  }

  // Flood fill from edges using a queue (BFS) to find connected white regions
  const queue = [];

  // Seed all edge pixels that are white
  for (let x = 0; x < width; x++) {
    // Top row
    const topIdx = x * channels;
    if (isWhite(topIdx)) { queue.push(x); visited[x] = 1; }
    // Bottom row
    const bottomPixel = (height - 1) * width + x;
    const bottomIdx = bottomPixel * channels;
    if (isWhite(bottomIdx)) { queue.push(bottomPixel); visited[bottomPixel] = 1; }
  }
  for (let y = 1; y < height - 1; y++) {
    // Left column
    const leftPixel = y * width;
    const leftIdx = leftPixel * channels;
    if (isWhite(leftIdx)) { queue.push(leftPixel); visited[leftPixel] = 1; }
    // Right column
    const rightPixel = y * width + (width - 1);
    const rightIdx = rightPixel * channels;
    if (isWhite(rightIdx)) { queue.push(rightPixel); visited[rightPixel] = 1; }
  }

  // BFS flood fill
  while (queue.length > 0) {
    const pixel = queue.shift();
    const x = pixel % width;
    const y = Math.floor(pixel / width);

    const neighbors = [
      y > 0 ? pixel - width : -1,            // up
      y < height - 1 ? pixel + width : -1,    // down
      x > 0 ? pixel - 1 : -1,                // left
      x < width - 1 ? pixel + 1 : -1,        // right
    ];

    for (const n of neighbors) {
      if (n >= 0 && !visited[n] && isWhite(n * channels)) {
        visited[n] = 1;
        queue.push(n);
      }
    }
  }

  // Set visited white pixels to transparent
  let removedCount = 0;
  for (let i = 0; i < width * height; i++) {
    if (visited[i]) {
      data[i * channels + 3] = 0; // alpha = 0
      removedCount++;
    }
  }

  const percentage = ((removedCount / (width * height)) * 100).toFixed(1);
  console.log(`    Removed ${removedCount} bg pixels (${percentage}% of image)`);

  return sharp(data, { raw: { width, height, channels } }).png().toBuffer();
}

async function convertImage(inputPath, shouldRemoveBg) {
  const name = basename(inputPath, extname(inputPath));
  const dir = join(ASSETS_DIR);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  // Read original image buffer
  let sourceBuffer = await sharp(inputPath).toBuffer();

  // Remove background if enabled
  if (shouldRemoveBg) {
    console.log(`    Removing white background (threshold: ${WHITE_THRESHOLD})...`);
    sourceBuffer = await removeWhiteBackground(sourceBuffer);
  }

  for (const size of SIZES) {
    const outputPath = join(dir, `${name}${size.suffix}.webp`);
    let pipeline = sharp(sourceBuffer);

    if (size.width) {
      pipeline = pipeline.resize(size.width);
    }

    await pipeline.webp({ quality: size.quality, alphaQuality: 100 }).toFile(outputPath);
    console.log(`    Created: ${outputPath}`);
  }
}

async function main() {
  console.log(`Background removal: ${removeBg ? 'ON' : 'OFF'} (threshold: ${WHITE_THRESHOLD})`);

  if (inputFiles.length > 0) {
    for (const inputPath of inputFiles) {
      console.log(`\n  Converting: ${inputPath}`);
      await convertImage(inputPath, removeBg);
    }
  } else {
    // Scan both public/assets/images/ (source uploads) and public/assets/ (loose files)
    const scanDirs = [IMAGES_DIR, ASSETS_DIR];
    let totalFound = 0;

    for (const dir of scanDirs) {
      if (!existsSync(dir)) continue;

      const files = readdirSync(dir).filter(f =>
        /\.(jpg|jpeg|png)$/i.test(f)
      );

      if (files.length === 0) continue;

      totalFound += files.length;
      console.log(`\n  Found ${files.length} images in ${dir}/`);

      for (const file of files) {
        console.log(`\n  Converting: ${dir}/${file}`);
        await convertImage(join(dir, file), removeBg);
      }
    }

    if (totalFound === 0) {
      console.log(`\n  No JPG/PNG images found in ${IMAGES_DIR}/ or ${ASSETS_DIR}/`);
      return;
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
