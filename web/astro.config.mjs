import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { readFileSync, writeFileSync } from 'node:fs';

// Static site. Content is pulled from Sanity at build time; publishing in the
// Studio triggers a rebuild via a deploy hook (see README).

const env = { ...loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), ''), ...process.env };

// "Show on the site" switches from Site settings (Sanity, or seed.json when Sanity isn't configured).
async function sectionSwitches() {
  const id = env.PUBLIC_SANITY_PROJECT_ID;
  if (id) {
    const q = encodeURIComponent('*[_id=="siteSettings"][0]{showCrew, showFaqs}');
    const res = await fetch(`https://${id}.apicdn.sanity.io/v2025-02-19/data/query/${env.PUBLIC_SANITY_DATASET || 'production'}?query=${q}`);
    return (await res.json()).result ?? {};
  }
  return JSON.parse(readFileSync(new URL('./src/data/seed.json', import.meta.url), 'utf8')).settings;
}
const { showFaqs = false } = await sectionSwitches();

// Old Wix site URLs -> new pages (permanent, so Google moves the rankings over).
const OLD_SITE = [
  ['/home', '/'],
  ['/floor-system-repairs', '/services/structural/'],
  ['/stone-work', '/services/outdoor-living/'],
  ['/custom-carpentry', '/services/interiors/'],
  ['/team-3', '/about/'],
];

// Writes Netlify's _redirects. While Questions is switched off, /faq/ goes to the
// homepage (302 = temporary; "!" overrides the built page).
const netlifyRedirects = {
  name: 'netlify-redirects',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const lines = OLD_SITE.map(([from, to]) => `${from}  ${to}  301`);
      if (!showFaqs) lines.push('/faq  /  302!');
      writeFileSync(new URL('_redirects', dir), lines.join('\n') + '\n');
    },
  },
};

export default defineConfig({
  site: 'https://accessionbuilders.com',
  integrations: [
    sitemap({ filter: (page) => !page.includes('/contact/thanks/') && (showFaqs || !page.includes('/faq/')) }),
    netlifyRedirects,
  ],
});
