#!/usr/bin/env node
/**
 * Sanity check — runs automatically on `npm install` to catch common setup mistakes.
 * Exits silently when everything looks good.
 */

import { existsSync } from 'fs';
import { basename, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const projectName = basename(projectRoot);

let hasError = false;

function warn(msg) {
  console.error(`\n  ⚠️  ${msg}`);
  hasError = true;
}

// 1. Nested directory check — catches `git clone` inside the project folder
const nestedDir = join(projectRoot, projectName);
if (existsSync(join(nestedDir, 'package.json'))) {
  warn(
    `NESTED DIRECTORY DETECTED!\n` +
    `     You have "${projectName}/" inside "${projectName}/".\n` +
    `     This means git clone was run inside the project folder.\n\n` +
    `     Fix: Delete this outer folder and work from the inner one:\n` +
    `       cd ..\n` +
    `       mv ${projectName}/${projectName} ${projectName}-temp\n` +
    `       rm -rf ${projectName}\n` +
    `       mv ${projectName}-temp ${projectName}\n` +
    `       cd ${projectName} && npm install`
  );
}

// 2. Check that key source files exist (catches running from wrong directory)
const requiredFiles = ['astro.config.mjs', 'src/lib/config.ts', 'src/pages/index.astro'];
const missing = requiredFiles.filter(f => !existsSync(join(projectRoot, f)));
if (missing.length > 0) {
  warn(
    `MISSING SOURCE FILES: ${missing.join(', ')}\n` +
    `     Are you in the right directory? Run commands from the project root\n` +
    `     where package.json and astro.config.mjs live side by side.`
  );
}

// 3. Check .env.example exists (reminds about image generation setup)
if (!existsSync(join(projectRoot, '.env.example'))) {
  warn(`Missing .env.example — image generation setup instructions may be lost.`);
}

if (hasError) {
  console.error('\n  Fix the issues above before continuing.\n');
  process.exit(1);
}
