import { createClient } from '@sanity/client';
import seed from '../data/seed.json';

export type SiteContent = typeof seed;
export type Img = { src: string; alt?: string } | null | undefined;

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

export const cmsEnabled = Boolean(projectId);

const client = cmsEnabled
  ? createClient({ projectId, dataset, apiVersion: '2025-01-01', useCdn: false, perspective: 'published' })
  : null;

// Image projection used everywhere an image field appears.
const IMG = `{ "src": asset->url, alt }`;

// One query for the whole homepage, projected into the same shape as seed.json.
const HOME_QUERY = /* groq */ `{
  "settings": *[_type == "siteSettings"][0]{
    phone, email, serviceArea, licenseNumber, sisterCompany, footerAbout,
    headerCtaLabel, menuCtaLabel, "menuImage": menuImage${IMG}
  },
  "services": *[_type == "service"] | order(orderRank asc, name asc){ name, link, items },
  "page": *[_type == "homepage"][0]{
    seoTitle, seoDescription,
    hero{ ..., "image": image${IMG} },
    fix{ ..., problems[]{ ..., "image": image${IMG} } },
    featured{ eyebrow, heading, intro, linkLabel, linkLabelShort,
      "project": project->{ title, location, disciplines, scope, partners, duration,
        "before": before${IMG}, "after": after${IMG} } },
    plan{ ..., figures[]{ caption, "image": image${IMG} } },
    crew{ ..., "photo": photo${IMG} },
    "review": review->{ quote, author, service, rating, source },
    faq{ eyebrow, heading, headingAccent, linkLabel, "items": items[]->{ question, answer } },
    cta
  },
  "crewMembers": *[_type == "crewMember"] | order(orderRank asc){ name, role, "photo": photo${IMG} }
}`;

export async function getSiteContent(): Promise<SiteContent> {
  if (!client) return seed;

  const r = await client.fetch(HOME_QUERY);
  if (!r?.page || !r?.settings) {
    throw new Error(
      'Sanity is configured but the homepage or site settings document is missing. ' +
        'Run the seed import in /studio (see README) or publish both documents.'
    );
  }
  const { featured, review, faq, ...page } = r.page;
  return {
    settings: r.settings,
    services: r.services ?? [],
    home: { ...page, featured, faq },
    project: featured?.project ?? seed.project,
    crewMembers: r.crewMembers ?? [],
    review: review ?? seed.review,
    faqs: faq?.items ?? [],
  } as SiteContent;
}

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
