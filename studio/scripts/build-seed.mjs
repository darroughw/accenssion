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
const fig = (f) => ({ ...f, image: img(f.image) });
const ref = (id) => (id ? { _type: 'reference', _ref: id } : undefined);
const serviceRef = (slug) => ref(slug && `service-${slug}`);
const slug = (s) => ({ _type: 'slug', current: s });
const block = (b) => ({ _type: 'block', style: b.style, markDefs: [], children: [{ _type: 'span', text: b.text, marks: [] }] });

// Every object inside an array needs a unique _key.
let k = 0;
const keyed = (v) => {
  if (Array.isArray(v)) return v.map((x) => (x && typeof x === 'object' && !Array.isArray(x) ? { _key: `k${++k}`, ...keyed(x) } : keyed(x)));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([a, b]) => [a, keyed(b)]));
  return v;
};

const { settings, services, projects, faqs, home, about, contact, faqPage, workPage, crewMembers, reviews } = seed;
const docs = [];

docs.push({ _id: 'siteSettings', _type: 'siteSettings', ...settings, menuImage: img(settings.menuImage) });

services.forEach((s, i) =>
  docs.push({
    ...s, _id: `service-${s.slug}`, _type: 'service', slug: slug(s.slug), orderRank: i + 1,
    cover: img(s.cover),
    details: { ...s.details, figures: s.details.figures.map(fig) },
  })
);

projects.forEach((p, i) =>
  docs.push({
    ...p, _id: `project-${p.slug}`, _type: 'project', slug: slug(p.slug), orderRank: i + 1,
    services: p.services.map(serviceRef),
    cover: img(p.cover), before: img(p.before), after: img(p.after),
    story: p.story.map(block),
    gallery: p.gallery.map(fig),
  })
);

faqs.forEach((f, i) =>
  docs.push({ _id: `faq-${i + 1}`, _type: 'faq', question: f.question, answer: f.answer, home: !!f.home, service: serviceRef(f.service), orderRank: i + 1 })
);
reviews.forEach((r, i) => docs.push({ _id: `review-${i + 1}`, _type: 'review', ...r, orderRank: i + 1 }));
crewMembers.forEach((m, i) => docs.push({ _id: `crew-${i + 1}`, _type: 'crewMember', ...m, orderRank: i + 1 }));

docs.push({
  _id: 'homepage', _type: 'homepage',
  seoTitle: home.seoTitle, seoDescription: home.seoDescription,
  hero: { ...home.hero, image: img(home.hero.image) },
  fix: { ...home.fix, problems: home.fix.problems.map((p) => ({ ...p, service: serviceRef(p.service), image: img(p.image) })) },
  featured: { ...home.featured, project: ref(`project-${home.featured.project}`) },
  plan: {
    ...home.plan,
    pillars: home.plan.pillars.map((p) => ({ ...p, service: serviceRef(p.service) })),
    figures: home.plan.figures.map(fig),
  },
  crew: home.crew,
  faq: home.faq,
  cta: home.cta,
});
docs.push({ _id: 'aboutPage', _type: 'aboutPage', ...about });
docs.push({ _id: 'contactPage', _type: 'contactPage', ...contact });
docs.push({ _id: 'faqPage', _type: 'faqPage', ...faqPage });
docs.push({ _id: 'workPage', _type: 'workPage', ...workPage });

// Drop undefined fields, add array keys, write one JSON document per line.
const out = docs.map((d) => JSON.stringify(keyed(JSON.parse(JSON.stringify(d))))).join('\n') + '\n';
writeFileSync(resolve(here, '../seed.ndjson'), out);
console.log(`Wrote ${docs.length} documents to studio/seed.ndjson`);
