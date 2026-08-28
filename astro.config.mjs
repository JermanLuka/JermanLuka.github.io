// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Used for canonical URLs, the sitemap, and absolute links in the RSS feed.
  site: 'https://lukajerman.dev',
  // Extensionless URLs with no trailing slash: 'file' emits projects.html
  // instead of projects/index.html, which GitHub Pages serves at /projects
  // with no redirect. 'never' keeps canonicals and the sitemap in step.
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
