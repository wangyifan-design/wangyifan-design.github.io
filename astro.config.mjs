// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://wangyifan-design.com',
  integrations: [mdx(), sitemap()],
  build: {
    // Use clean URLs like /about/ instead of /about.html so the new site
    // works the same whether deployed to GitHub Pages, Vercel, or Netlify.
    format: 'directory',
  },
});
