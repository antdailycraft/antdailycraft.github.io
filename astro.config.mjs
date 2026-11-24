import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://blog.aidaon.com',
  output: 'static',
  trailingSlash: 'always',
  server: { allowedHosts: ['metis', '.ts.net', 'metis.aidaon.com'] },
  integrations: [sitemap({ filter: (page) => !page.includes('/shortcut/') })],
  vite: { server: { fs: { allow: ['.'] } } },
});
