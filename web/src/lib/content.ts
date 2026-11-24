import { createClient } from '@sanity/client';
import seed from '../data/seed.json';

/* ---------- Types: the shape every page reads (seed.json uses it directly) ---------- */

export type Img = { src: string; alt?: string } | null | undefined;
export type Figure = { image?: Img; caption?: string; placeholder?: string };
export type StoryBlock = { style: string; text: string };

export type Service = {
  slug: string;
  name: string;
  kicker?: string;
  items: string[];
  title: string;
  titleAccent?: string;
  intro: string;
  cover?: Img;
  coverCaption?: string;
  seoDescription?: string;
  signs: { toc: string; heading: string; headingAccent?: string; intro?: string; items: string[] };
  work: { toc: string; heading: string; headingAccent?: string; intro?: string; items: string[] };
  process: { toc: string; heading: string; headingAccent?: string; body: string };
  details: { heading: string; headingAccent?: string; figures: Figure[] };
  projectsHeading: string;
  projectsHeadingAccent?: string;
  faqHeadingAccent?: string;
};

export type Project = {
  slug: string;
  title: string;
  category?: string;
  services: string[];
  summary?: string;
  location?: string;
  disciplines?: string;
  scope?: string;
  partners?: string;
  duration?: string;
  cover?: Img;
  before?: Img;
  after?: Img;
  story: StoryBlock[];
  gallery: Figure[];
};

export type Faq = { question: string; answer: string; home?: boolean; service?: string };
export type Review = { quote: string; author: string; service?: string; rating?: number; source?: string };
export type CrewMember = { name: string; role?: string; photo?: Img };

type Seed = typeof seed;
export type SiteContent = Omit<Seed, 'services' | 'projects' | 'faqs' | 'reviews' | 'crewMembers'> & {
  services: Service[];
  projects: Project[];
  faqs: Faq[];
  reviews: Review[];
  crewMembers: CrewMember[];
};

/* ---------- Sanity ---------- */

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
export const cmsEnabled = Boolean(projectId);

const client = cmsEnabled
  ? createClient({ projectId, dataset, apiVersion: '2025-01-01', useCdn: false, perspective: 'published' })
  : null;

const IMG = `{ "src": asset->url, alt }`;
const FIG = `{ caption, placeholder, "image": image${IMG} }`;
const SLUG = `"slug": slug.current`;

const QUERY = /* groq */ `{
  "settings": *[_type == "siteSettings"][0]{
    phone, email, showCrew, showFaqs, serviceArea, serviceAreaLong, licenseNumber, sisterCompany, footerAbout,
    headerCtaLabel, menuCtaLabel, "menuImage": menuImage${IMG}
  },
  "services": *[_type == "service"] | order(orderRank asc, name asc){
    ${SLUG}, name, kicker, items, title, titleAccent, intro, coverCaption, seoDescription,
    "cover": cover${IMG}, signs, work, process,
    details{ heading, headingAccent, "figures": figures[]${FIG} },
    projectsHeading, projectsHeadingAccent, faqHeadingAccent
  },
  "projects": *[_type == "project"] | order(orderRank asc, _createdAt desc){
    ${SLUG}, title, category, summary, location, disciplines, scope, partners, duration,
    "services": services[]->slug.current,
    "cover": cover${IMG}, "before": before${IMG}, "after": after${IMG},
    "story": story[_type == "block"]{ "style": style, "text": pt::text(@) },
    "gallery": gallery[]${FIG}
  },
  "faqs": *[_type == "faq"] | order(orderRank asc, _createdAt asc){
    question, answer, home, "service": service->slug.current
  },
  "reviews": *[_type == "review"] | order(orderRank asc, _createdAt asc){ quote, author, service, rating, source },
  "crewMembers": *[_type == "crewMember"] | order(orderRank asc){ name, role, "photo": photo${IMG} },
  "home": *[_type == "homepage"][0]{
    seoTitle, seoDescription,
    hero{ ..., "image": image${IMG} },
    fix{ ..., problems[]{ ..., "service": service->slug.current, "image": image${IMG} } },
    featured{ eyebrow, heading, intro, linkLabel, linkLabelShort, "project": project->slug.current },
    plan{ ..., pillars[]{ title, body, "service": service->slug.current }, "figures": figures[]${FIG} },
    crew{ ..., "photo": photo${IMG} },
    faq, cta
  },
  "about": *[_type == "aboutPage"][0]{ ..., "photo": photo${IMG} },
  "contact": *[_type == "contactPage"][0],
  "faqPage": *[_type == "faqPage"][0],
  "workPage": *[_type == "workPage"][0]
}`;

let cache: Promise<SiteContent> | null = null;

/** All site content, fetched once per build. */
export function getSiteContent(): Promise<SiteContent> {
  cache ??= load();
  return cache;
}

async function load(): Promise<SiteContent> {
  if (!client) return seed as unknown as SiteContent;

  const r = await client.fetch(QUERY);
  const missing = ['settings', 'home'].filter((k) => !r?.[k]);
  if (missing.length) {
    throw new Error(
      `Sanity is configured but these documents are missing: ${missing.join(', ')}. ` +
        'Run the seed import in /studio (see README) or publish them in the Studio.'
    );
  }
  // Pages without a CMS document yet fall back to the seed copy.
  return {
    ...r,
    about: r.about ?? seed.about,
    contact: r.contact ?? seed.contact,
    faqPage: r.faqPage ?? seed.faqPage,
    workPage: r.workPage ?? seed.workPage,
    projects: (r.projects ?? []).map((p: Project) => ({ ...p, services: p.services ?? [], story: p.story ?? [], gallery: p.gallery ?? [] })),
  } as SiteContent;
}

/* ---------- Helpers ---------- */

export const serviceHref = (slug: string) => `/services/${slug}/`;
export const projectHref = (slug: string) => `/work/${slug}/`;

/** Sanity CDN images get resized; local seed paths pass through. */
export function imgUrl(src: string, width: number): string {
  if (!src.startsWith('https://cdn.sanity.io/')) return src;
  return `${src}?w=${width}&fit=max&auto=format&q=80`;
}

/** "tel:" href from a display phone number. */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return `tel:+${digits.length === 10 ? '1' + digits : digits}`;
}

export const pad = (n: number) => String(n).padStart(2, '0');
