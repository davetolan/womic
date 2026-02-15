# Next Comic Platform

Next Comic Platform is a single-repository Next.js application for publishing and reading comics in a traditional page-by-page format. It combines a fast reader experience with a content workflow powered by Payload CMS, Cloudinary media delivery, and MailerLite email automation.

## Stack

- Next.js (App Router) + TypeScript
- pnpm
- Vercel (deployment)
- Payload CMS (embedded in this repo or hosted externally)
- Cloudinary (image storage, CDN, transformations)
- MailerLite (newsletter/signup automation)

## Project Structure

Example `src/` layout:

```txt
.
├─ public/
├─ src/
│  ├─ app/                # App Router routes, layouts, API routes
│  ├─ components/         # Reusable UI components
│  ├─ lib/                # Integrations, API clients, helpers
│  ├─ types/              # Shared TypeScript types/interfaces
│  └─ styles/             # Global styles and design tokens
├─ .env.local
├─ package.json
├─ pnpm-lock.yaml
└─ tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js LTS (recommended: Node 20+)
- pnpm

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Install dependencies

```bash
pnpm install
```

### Start development server

```bash
pnpm dev
```

### Build for production

```bash
pnpm build
```

### Start production server

```bash
pnpm start
```

### Lint

```bash
pnpm lint
```

## Environment Variables

Use `.env.local` for local development. Do not commit real secrets to git.

```bash
# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Payload CMS
# If Payload is external, point to that hosted URL
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:4000

# Only required when Payload is embedded in this repo
PAYLOAD_SECRET=replace-with-strong-random-secret
DATABASE_URL=postgres://user:password@localhost:5432/next_comic

# Cloudinary
# For unsigned delivery/transforms, cloud name is often enough client-side.
# For server-side uploads/admin operations, use key + secret.
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# MailerLite (server-side only)
MAILERLITE_API_KEY=your-mailerlite-api-key
MAILERLITE_GROUP_ID=your-group-id
```

Security note:

- Never commit `.env.local`.
- Keep API keys and secrets in your deployment provider’s environment variable settings.

## Routing

Primary reader routes:

- `/` - Home page (latest episode, updates, entry point)
- `/archive` - Episode archive/listing
- `/episode/[slug]/[page]` - Page-by-page comic reader

Reader behavior note:

- Navigation is designed around sequential page numbers within an episode (`page`), enabling traditional comic reading flow.

## CMS Content Model (Payload)

Recommended `Episodes` collection fields:

- `title` (string)
- `slug` (unique string)
- `episodeNumber` (number)
- `publishDate` (date)
- `pages[]` (array of page objects with `image`, `altText`, and `pageNumber`)
- `thumbnail` (media/upload)
- `authorNotes` (rich text or long text)
- `seoTitle` (string)
- `seoDescription` (string)

Payload deployment options:

- Embedded: Payload runs in this repository/application runtime.
- External service: Payload is hosted separately; this app consumes it via `PAYLOAD_PUBLIC_SERVER_URL`.

## Media (Cloudinary)

Suggested folder structure:

```txt
comics/{seriesSlug}/episodes/{episodeNumber}/pages/{pageNumber}
comics/{seriesSlug}/episodes/{episodeNumber}/thumbnail
comics/{seriesSlug}/seo/{slug}
```

Example transformation presets:

- Reader display (high quality, responsive): `f_auto,q_auto,c_limit,w_1600`
- Archive thumbnail card: `f_auto,q_auto,c_fill,w_480,h_640,g_auto`
- Small preview: `f_auto,q_auto,c_fill,w_240,h_320,g_auto`

## Email (MailerLite)

Signup flow:

1. User submits newsletter form.
2. Frontend sends request to `/api/subscribe`.
3. API route validates and calls MailerLite.
4. Subscriber is added to a MailerLite group.
5. MailerLite automation sends welcome/onboarding emails.

## Deployment

High-level Vercel flow:

1. Push repository to Git provider.
2. Import project in Vercel.
3. Confirm build settings (`pnpm` is auto-detected via `pnpm-lock.yaml`).
4. Add all required environment variables in Vercel Project Settings.
5. Deploy and verify core routes (`/`, `/archive`, `/episode/[slug]/[page]`).

If using external Payload, also configure its environment variables and CORS/origin settings for the web app domain.

## Publishing Workflow (Artist)

A typical no-code publishing flow in Payload:

1. Create a new Episode entry.
2. Enter metadata: `title`, `slug`, `episodeNumber`, `publishDate`.
3. Upload page images and fill `pages[]` with correct `pageNumber` order.
4. Set page `altText` for accessibility.
5. Upload/select `thumbnail`.
6. Add `authorNotes`, `seoTitle`, and `seoDescription`.
7. Publish the episode.
8. Open the site and confirm `/episode/[slug]/1` and `/archive` display correctly.
9. Trigger or schedule newsletter send in MailerLite.

## Conventions

- Import alias: `@/*` maps to `./src/*`.
- TypeScript strict mode enabled.
- Keep code lint-clean with `pnpm lint`.
- Use consistent formatting and small, reusable components.

## Future Enhancements

- Scheduled episode publishing and embargo support
- Reader progress/bookmark sync
- Chapter/arc tags and advanced archive filters
- Search across episodes and notes
- Automated social share image generation
- A/B testing for subscription CTA placements
