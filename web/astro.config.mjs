import { defineConfig } from 'astro/config';

// Static site. Content is pulled from Sanity at build time; publishing in the
// Studio triggers a rebuild via a deploy hook (see README).
export default defineConfig({
  site: 'https://accessionbuilders.com',
});
