// Builds seed.ndjson from web/src/data/seed.json so a fresh Sanity dataset
// starts with the current site content and photos.
//   npm run seed:import   (builds, then runs `sanity dataset import ... --replace`)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(here, '../../web');
const seed = JSON.parse(readFileSync(resolve(webRoot, 'src/data/seed.json'), 'utf8'));

// "/assets/photos/x.jpg" -> image field that the importer uploads from disk.
const img = (i) =>
  i?.src ? { _type: 'image', _sanityAsset: `image@file://${resolve(webRoot, 'public' + i.src)}`, alt: i.alt ?? '' } : undefined;

const ref = (id) => ({ _type: 'reference', _ref: id });

// Every object inside an array needs a unique _key.
let k = 0;
const keyed = (v) => {
  if (Array.isArray(v)) return v.map((x) => (x && typeof x === 'object' && !Array.isArray(x) ? { _key: `k${++k}`, ...keyed(x) } : keyed(x)));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([a, b]) => [a, keyed(b)]));
  return v;
};

const { settings, services, home, project, crewMembers, review, faqs } = seed;
const docs = [];

docs.push({ _id: 'siteSettings', _type: 'siteSettings', ...settings, menuImage: img(settings.menuImage) });

services.forEach((s, i) => docs.push({ _id: `service-${i + 1}`, _type: 'service', ...s, orderRank: i + 1 }));

docs.push({
  _id: 'project-cottage', _type: 'project', ...project,
  slug: { _type: 'slug', current: 'cottage' },
  before: img(project.before), after: img(project.after),
});

crewMembers.forEach((m, i) => docs.push({ _id: `crew-${i + 1}`, _type: 'crewMember', ...m, orderRank: i + 1 }));

docs.push({ _id: 'review-1', _type: 'review', ...review });

faqs.forEach((f, i) => docs.push({ _id: `faq-${i + 1}`, _type: 'faq', ...f }));

docs.push({
  _id: 'homepage', _type: 'homepage',
  seoTitle: home.seoTitle, seoDescription: home.seoDescription,
  hero: { ...home.hero, image: img(home.hero.image) },
  fix: { ...home.fix, problems: home.fix.problems.map((p) => ({ ...p, image: img(p.image) })) },
  featured: { ...home.featured, project: ref('project-cottage') },
  plan: { ...home.plan, figures: home.plan.figures.map((f) => ({ ...f, image: img(f.image) })) },
  crew: home.crew,
  review: ref('review-1'),
  faq: { ...home.faq, items: faqs.map((_, i) => ref(`faq-${i + 1}`)) },
  cta: home.cta,
});

// Drop undefined fields, add array keys, write one JSON document per line.
const out = docs.map((d) => JSON.stringify(keyed(JSON.parse(JSON.stringify(d))))).join('\n') + '\n';
writeFileSync(resolve(here, '../seed.ndjson'), out);
console.log(`Wrote ${docs.length} documents to studio/seed.ndjson`);
