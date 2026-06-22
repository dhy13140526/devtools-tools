import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pcgithub.io/devtools-tools/',
  integrations: [sitemap()],
});
