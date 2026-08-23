// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Used for canonical URLs, the sitemap, and absolute links in the RSS feed.
  site: 'https://lukajerman.dev',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
