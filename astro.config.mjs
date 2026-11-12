// @ts-check
import { defineConfig } from 'astro/config';

import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Images in blog posts and project write-ups. Without this, each one ships at
// its full original size (some are 2,500px+) into a column at most 720px wide.
// `constrained` makes Astro add smaller copies to srcset, and `sizes` tells the
// browser how wide the column really is, so a phone or laptop downloads only
// what it needs. The full-size file stays as `src`, which is what the
// click-to-zoom link in ProseImageLinks opens.
//
// 720px is the reading column: max-w-3xl (768px) minus the page padding (48px).
const proseImageSizes = {
  name: 'prose-image-sizes',
  element: {
    filter: ['img'],
    visit(node, ctx) {
      ctx.setProperty(node, 'layout', 'constrained');
      ctx.setProperty(node, 'sizes', '(min-width: 768px) 720px, calc(100vw - 40px)');
    },
  },
};

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
  // Sätteri is Astro's default Markdown processor; it is only named here to
  // add the plugin above. Keep its version in package.json equal to the one
  // Astro itself depends on, so only one copy is installed.
  markdown: {
    processor: satteri({ hastPlugins: [proseImageSizes] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
