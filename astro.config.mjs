import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.denver-real-estates.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
  image: { responsiveStyles: true },
});
