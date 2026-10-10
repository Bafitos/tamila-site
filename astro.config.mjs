import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Also publish the page list as a single /sitemap.xml (simplest format for Google, Bing and AI crawlers).
const singleSitemap = {
  name: 'single-sitemap',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const out = fileURLToPath(dir);
      copyFileSync(`${out}/sitemap-0.xml`, `${out}/sitemap.xml`);
    },
  },
};

export default defineConfig({
  site: 'https://www.denver-real-estates.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap({ lastmod: new Date() }), singleSitemap],
  image: { responsiveStyles: true },
});
