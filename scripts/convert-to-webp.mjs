#!/usr/bin/env node

/**
 * Image conversion utility
 * Converts JPG/PNG images to WebP format and creates responsive variants.
 *
 * Usage: node scripts/convert-to-webp.mjs [input-path]
 *
 * If no input path is specified, processes all images in public/assets/
 *
 * Creates:
 *   - [name].webp (full size, quality 85)
 *   - [name]-medium.webp (800px wide)
 *   - [name]-small.webp (400px wide)
 */

import sharp from 'sharp';
import { readdirSync, existsSync, mkdirSync } from 'fs';
import { join, basename, extname } from 'path';

const ASSETS_DIR = 'public/assets';
const SIZES = [
  { suffix: '', width: null, quality: 85 },
  { suffix: '-medium', width: 800, quality: 80 },
  { suffix: '-small', width: 400, quality: 75 },
];

async function convertImage(inputPath) {
  const name = basename(inputPath, extname(inputPath));
  const dir = join(ASSETS_DIR);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  for (const size of SIZES) {
    const outputPath = join(dir, `${name}${size.suffix}.webp`);
    let pipeline = sharp(inputPath);

    if (size.width) {
      pipeline = pipeline.resize(size.width);
    }

    await pipeline.webp({ quality: size.quality }).toFile(outputPath);
    console.log(`  Created: ${outputPath}`);
  }
}

async function main() {
  const inputPath = process.argv[2];

  if (inputPath) {
    console.log(`Converting: ${inputPath}`);
    await convertImage(inputPath);
  } else {
    console.log(`Processing all images in ${ASSETS_DIR}/...`);
    if (!existsSync(ASSETS_DIR)) {
      console.log('No assets directory found. Nothing to convert.');
      return;
    }

    const files = readdirSync(ASSETS_DIR).filter(f =>
      /\.(jpg|jpeg|png)$/i.test(f)
    );

    if (files.length === 0) {
      console.log('No JPG/PNG images found to convert.');
      return;
    }

    for (const file of files) {
      console.log(`Converting: ${file}`);
      await convertImage(join(ASSETS_DIR, file));
    }
  }

  console.log('Done!');
}

main().catch(console.error);
