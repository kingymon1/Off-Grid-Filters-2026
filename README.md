# Off-Grid Filters 2026

Water filter reviews and buying guides. Built with Astro, deployed on Vercel.

## Quick Setup

**Copy and paste these commands one at a time:**

```bash
# 1. Clone the project (only do this ONCE)
git clone https://github.com/kingymon1/Off-Grid-Filters-2026.git

# 2. Go into the project folder
cd Off-Grid-Filters-2026

# 3. Install dependencies
npm install

# 4. Build the site
npm run build
```

If `npm install` shows a "NESTED DIRECTORY" error, see [Troubleshooting](#troubleshooting) below.

## Common Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start local dev server at http://localhost:4321 |
| `npm run build` | Build the production site into `dist/` |
| `npm run checklist:auto` | Run all quality checks (should show 59/59 pass) |
| `npm run checklist` | Open quality check dashboard at http://localhost:3200 |
| `npm run images` | Open image generation dashboard at http://localhost:3100 |
| `npm run generate-content:dry` | Preview what the content pipeline would generate |
| `npm run generate-content` | Generate new content from queue (needs API key) |
| `npm run lint` | Check code for errors |
| `npm run test` | Run unit tests |

## Updating the Site

When changes are made on GitHub, pull them to your machine:

```bash
cd Off-Grid-Filters-2026
git pull origin main
npm install
npm run build
```

## Automated Content Pipeline

The site includes an automated content generation pipeline (disabled by default). See [TEMPLATE-GUIDE.md](TEMPLATE-GUIDE.md#automated-content-pipeline-post-launch) for activation steps.

Quick summary:
1. Add `ANTHROPIC_API_KEY` to GitHub secrets
2. Set `enabled: true` in `content-queue.yaml`
3. Add queue entries (comparisons, guides, knowledge base articles)
4. The weekly GitHub Action generates content and opens a PR for review

## Adding Product Images

See [IMAGE-GUIDE.md](IMAGE-GUIDE.md) for step-by-step instructions on downloading product photos and generating editorial images.

## Pre-Launch Checklist

See [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md) for the full 12-section sign-off checklist.

## Troubleshooting

### "NESTED DIRECTORY DETECTED" error

This means the project was cloned inside itself. Fix it:

```bash
# Go up one level
cd ..

# Remove the broken outer folder and keep the inner one
mv Off-Grid-Filters-2026/Off-Grid-Filters-2026 Off-Grid-Filters-2026-temp
rm -rf Off-Grid-Filters-2026
mv Off-Grid-Filters-2026-temp Off-Grid-Filters-2026

# Go back in and install
cd Off-Grid-Filters-2026
npm install
```

### "MISSING SOURCE FILES" error

You're running commands from the wrong folder. Make sure you're inside the project:

```bash
cd Off-Grid-Filters-2026
ls package.json   # This should show "package.json" — if not, you're in the wrong place
```

### Checklist shows failures after pulling

Make sure you rebuild after pulling:

```bash
git pull origin main
npm install
npm run build
npm run checklist:auto
```

### Build fails

```bash
npm run lint    # Check for code errors first
npm run test    # Check for test failures
npm run build   # Then try building again
```
