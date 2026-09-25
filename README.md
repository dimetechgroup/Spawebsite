# MySpa

Marketing site for MySpa, spa and salon management software sold in Kenya.
React and TypeScript on Vite, Tailwind, prerendered to static HTML.

## Where the documentation is

Three files, each next to the thing it describes. Start with whichever matches
what you are doing.

| If you are | Read |
| --- | --- |
| running the site locally, or changing a page | this file |
| editing content, or adding a CMS collection | [`directus/README.md`](directus/README.md) |
| deploying, or fixing a deploy | [`deploy/README.md`](deploy/README.md) |

## Running it

```bash
pnpm install
pnpm dev
```

That serves the site against the content already committed in
`data/generated/`, so it works with no CMS running.

To edit content you also need Directus:

```bash
cd directus
cp .env.example .env    # then fill in the three secrets
docker compose up -d    # admin UI at http://localhost:8055
```

Then `pnpm content` pulls the published content into `data/generated/` and
downloads its images. See [`directus/README.md`](directus/README.md).

## How the content pipeline works

**Directus is a build dependency, not a runtime one.** The site never contacts
the CMS. `scripts/fetch-content.mjs` reads Directus at build time and writes one
JSON file per collection into `data/generated/`, which `data/index.ts` imports,
and those files are committed.

That is what makes the build hermetic: clone the repo and `pnpm build` works
with no CMS access at all. It is also what keeps SEO intact, because
`seo/routes.ts` derives the route list synchronously at module init, which is
what `scripts/prerender.mjs` needs to snapshot every route and write the
sitemap. A runtime fetch would resolve after the route list is read, so articles
would silently vanish from the sitemap, and social crawlers never run JS anyway.

```bash
pnpm content     # fetch from Directus into data/generated/
pnpm build       # content fetch, then vite build, then prerender
pnpm build:ci    # same, but fails if Directus is unreachable
```

Never hand-edit `data/generated/`. Edit in Directus, run `pnpm content`, commit
the diff.

## Two rules worth knowing before you add a field

**Icons cannot go in the CMS.** A Lucide icon is a live component reference, not
data. A collection whose items have icons needs an immutable `key` joining to a
hardcoded map, as `anchorFeatures` does in `data/index.ts`; the build fails if a
published row has a key with no entry. The cheaper alternative is to drop the
icon from the design, which is what made `faqs` a collection an editor can add
to without a developer.

**Tailwind class names cannot go in the CMS either.** Tailwind builds its
stylesheet by scanning source files, so a class that exists only in Postgres is
never compiled and silently produces no styling at all. Hex values are fine,
because they are inline style values rather than class names. That is why
category colours work and `bg-[#207D40]` would not.

## Layout

```
components/          17 components, no separate pages/ directory
data/index.ts        every content export, CMS-backed or hardcoded
data/generated/      written by scripts/fetch-content.mjs, committed
types/index.ts       the shapes data/index.ts exports
seo/                 route list, metadata and JSON-LD
scripts/             content fetch and prerender
deploy/              deploy scripts and the runbook
directus/            the CMS: compose file, schema snapshot, its runbook
```
