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
   ```
   The dataset must be public (the Sanity default). For a private dataset, add a read token to `content.ts`.

4. Run the editor: `npm run dev` in `studio/` (http://localhost:3333). To host it for the owner, run `npm run deploy`, which publishes it at `https://accession-builders.sanity.studio`.

## Deploy

Host `web/` on Vercel or Netlify:

- Root directory: `web`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`

**Rebuild on publish:** create a deploy hook in the host's settings. Then add a Sanity webhook (sanity.io/manage → API → Webhooks) that POSTs to that URL on create, update and delete. Edits go live a minute or so after the owner hits Publish.

## What the owner can edit

| In the Studio | Shows up as |
|---|---|
| **Homepage** | Every section's headings and copy, hero photo, problem cards, inspection steps, detail photos, the featured project, the featured review and which FAQs appear |
| **Site settings** | Phone, email, license number, service area, sister company, footer text, menu photo |
| **Services** | The four disciplines in the menu and footer |
| **Projects** | Before and after photos plus the location, disciplines, scope, partners and duration list |
| **Reviews**, **FAQs**, **Crew** | Their sections |

Some text fields also have a **phone version**. The mobile design uses shorter copy in places. Leave it blank to use the main text on every screen.

## Content still needed

These placeholders come from the design and appear on the site until they're replaced:

- Photos: a foundation crack, and a crew portrait
- A few lines from Kerney for the crew section
- Featured project: town, partners and duration
- NC General Contractor license number
- Answers for FAQs 2–6, and confirmation of the first answer
- Privacy policy page

## Project structure

```
web/
  src/pages/index.astro        homepage
  src/components/              one component per section, plus shared Button, Logo, etc.
  src/layouts/Base.astro       <head>, header, menu, footer
  src/lib/content.ts           Sanity query and seed fallback
  src/lib/site.js              menu overlay and FAQ accordion
  src/data/seed.json           fallback content, also the source for the Sanity seed
  src/styles/global.css        design tokens and all styles
  public/assets/               icons, logo, photos (metadata stripped)
studio/
  schemaTypes/                 content model
  structure.ts                 Studio sidebar (Homepage and Site settings are singletons)
  scripts/build-seed.mjs       seed.json → seed.ndjson
```

## Notes

- **Photos:** phone photos carry GPS coordinates in their EXIF data, which can reveal a customer's address. Strip the metadata before adding a photo to `web/public` or uploading it to the Studio.
- **Client files:** source material (design reviews, PDFs, the raw photo pulls) stays local and is ignored by git. This repo is public.
