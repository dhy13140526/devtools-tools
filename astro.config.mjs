import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://devtools-tools-vercel.vercel.app',
  integrations: [sitemap()],
});
