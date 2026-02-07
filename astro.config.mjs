import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://example.com', // UPDATE: Replace with your domain from product-brief.yaml,
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap(),
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild',
    },
  },
});
