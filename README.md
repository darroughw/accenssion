# Accession Builders website

Marketing site for Accession Builders, a residential specialty contractor in King, NC: foundation and crawl space repair, water and moisture, interiors, and outdoor living.

- **`web/`**: the site. [Astro](https://astro.build), built as static HTML.
- **`studio/`**: the content editor. [Sanity Studio](https://www.sanity.io), where the owner edits copy, photos, projects, reviews and FAQs.

The homepage follows the Figma design "Accession Builders — Homepage (Combined: A + Signature)": desktop frame `89:1284`, mobile frame `90:1436`.

## How it fits together

```
Sanity Studio ──publish──▶ Sanity dataset ──webhook──▶ host rebuilds web/ ──▶ static site
                                   ▲
                       web/ fetches it at build time
```

`web/` reads content once, at build time, in [`web/src/lib/content.ts`](web/src/lib/content.ts):

- **No Sanity project configured**: content comes from [`web/src/data/seed.json`](web/src/data/seed.json). The site builds and runs with no accounts.
- **`PUBLIC_SANITY_PROJECT_ID` set**: content comes from Sanity, projected into the same shape as `seed.json`, so the components don't change.

## Run it locally

Requires Node 22.23.4 or newer (Astro's minimum).

```sh
cd web
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to web/dist
```

## Connect Sanity (one-time setup)

1. Create the project and dataset:
   ```sh
   cd studio
   npm install
   npx sanity login
   npx sanity init --env    # create a new project with a "production" dataset; writes .env
   ```
   Make sure `studio/.env` contains `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET=production` (see `studio/.env.example`).

2. Load the current site content and photos into Sanity:
   ```sh
   npm run seed:import      # builds seed.ndjson from web/src/data/seed.json, then imports it
   ```
   This **replaces** documents with the same IDs. Run it once on a fresh dataset, not after the owner has started editing.

3. Point the site at Sanity. Create `web/.env` from `web/.env.example`:
   ```sh
   PUBLIC_SANITY_PROJECT_ID=<your project id>
   PUBLIC_SANITY_DATASET=production
   PUBLIC_FORM_ENDPOINT=        # optional, see Contact form
   ```
   The dataset must be public (the Sanity default). For a private dataset, add a read token to `content.ts`.

4. Run the editor: `npm run dev` in `studio/` (http://localhost:3333). To host it for the owner, run `npm run deploy`, which publishes it at `https://accession-builders.sanity.studio`.

## Deploy

Host `web/` on Vercel or Netlify:

- Root directory: `web`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, and `PUBLIC_FORM_ENDPOINT` if not using Netlify Forms

**Rebuild on publish:** create a deploy hook in the host's settings. Then add a Sanity webhook (sanity.io/manage → API → Webhooks) that POSTs to that URL on create, update and delete. Edits go live a minute or so after the owner hits Publish.

## Pages

| URL | Page | Built from |
|---|---|---|
| `/` | Homepage | Figma "Homepage (Combined: A + Signature)" |
| `/services/` | Services overview | Site design system |
| `/services/<slug>/` | One page per service (4) | Structure and copy from the Figma "Service page — Crawl space & foundation" (Craft design), restyled to match the homepage |
| `/work/` | Projects, filterable by service | Site design system |
| `/work/<slug>/` | Project story | Site design system |
| `/about/` | About, how we work (`#how-we-work`), crew | Site design system |
| `/faq/` | All questions, grouped by service | Site design system |
| `/contact/` | Free inspection form | Site design system |
| `/contact/thanks/` | Form confirmation | Site design system |
| `/privacy/` | Privacy policy | Site design system |
| `/404` | Not found | Site design system |

Only the homepage and the crawl space service page were designed in Figma. The other pages reuse the homepage's components, type and colors. Service and project pages are generated from the CMS, so a new service or project gets a page automatically.

## Contact form

The form on `/contact/` sends to one of two places:

- **Netlify Forms** (default): works with no setup when the site is hosted on Netlify. Submissions appear in the Netlify dashboard, and email notifications are set there.
- **Any form service** (Formspree, Basin, etc.): set `PUBLIC_FORM_ENDPOINT` in `web/.env` to the endpoint URL. Use this when hosting on Vercel.

Either way, the form redirects to `/contact/thanks/` and has a hidden honeypot field for spam.

### Email via Resend (Netlify)

`web/netlify/functions/submission-created.mjs` runs automatically after every Netlify Forms submission that passes the spam filter. It sends two emails through [Resend](https://resend.com) from `inspections@accessionbuilders.com`:

1. **To Kerney:** the full request. Replying goes straight to the homeowner when they left an email.
2. **To the homeowner** (only if they left an email): a short confirmation with the phone number.

The inbox and phone come from **Site settings** in the Studio, so changing them there carries over.

Netlify environment variables:

| Variable | |
|---|---|
| `RESEND_API_KEY` | Required. A Resend API key with "Sending access" for accessionbuilders.com. |
| `NOTIFY_EMAIL` | Optional. Send requests somewhere other than the Site settings email. |
| `FROM_EMAIL` | Optional. Default `Accession Builders <inspections@accessionbuilders.com>`. |
| `SEND_CONFIRMATION` | Optional. `false` turns off the homeowner confirmation. |

Submissions are still stored under Netlify → Forms → inspection, so nothing is lost if an email fails. Function logs are under Netlify → Logs → Functions.

## What the owner can edit

| In the Studio | Shows up as |
|---|---|
| **Pages → Homepage** | Every homepage section: hero, problem cards, inspection steps, featured project, pillars, detail photos, crew intro, CTA |
| **Pages → About, Our work, Questions, Contact** | Headings, intros, "How we work" steps, thank-you message, SEO |
| **Services** | The four service pages, plus the menu and footer lists |
| **Projects** | Project pages and cards. Tag a project with services to show it on those service pages |
| **FAQs** | The Questions page. Tick "Show on the homepage" or pick a service to show a question there too |
| **Reviews** | The first review by order is featured on the homepage and About page |
| **Crew** | Crew lists on the homepage and About page |
| **Site settings** | Phone, email, license number, service area, sister company, footer text, menu photo |

Some text fields also have a **phone version**. The mobile design uses shorter copy in places. Leave it blank to use the main text on every screen.

## Content still needed

Placeholders appear in [brackets] on the site until they're replaced. The main ones:

- **Photos:** foundation crack, crew portrait, About page photo, a bathroom and a finished basement for Interiors
- **Kerney's words:** crew and About intros, how fast he calls back, the sister company relationship
- **Projects:** stories for all three; town, partners and duration for the cottage; at least one Interiors and one Outdoor living project
- **Interiors:** confirm the list of interior work Accession takes on
- **FAQs:** answers for most questions, and confirmation of the ones drafted
- **Legal:** NC General Contractor license number; have the privacy policy reviewed (published; update it if analytics or new services are added)
- **Review copy:** the Water & moisture, Interiors and Outdoor living service pages were drafted to match the crawl space page. Kerney should read them for accuracy

## Project structure

```
web/
  src/pages/                   one file per route; services/[slug] and work/[slug] are generated
  src/components/              page sections and shared pieces (PageHeader, ProjectCard, FaqList, Figures, ...)
  src/layouts/Base.astro       <head>, SEO tags, structured data, header, menu, footer
  src/lib/content.ts           types, Sanity query, seed fallback
  src/lib/site.js              menu overlay, FAQ accordion, "On this page" highlighting
  src/data/seed.json           fallback content, also the source for the Sanity seed
  src/styles/global.css        design tokens and all styles
  public/assets/               icons, logo, photos (metadata stripped)
studio/
  schemaTypes/                 content model (pages.ts holds the About/Work/FAQ/Contact singletons)
  structure.ts                 Studio sidebar
  scripts/build-seed.mjs       seed.json → seed.ndjson
```

## Notes

- **Photos:** phone photos carry GPS coordinates in their EXIF data, which can reveal a customer's address. Strip the metadata before adding a photo to `web/public` or uploading it to the Studio.
- **Client files:** source material (design reviews, PDFs, the raw photo pulls) stays local and is ignored by git. This repo is public.
