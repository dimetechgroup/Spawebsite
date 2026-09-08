# MySpa content CMS (local)

Directus instance holding the article content published at `/resources/:slug`.

**Directus is a build dependency, not a runtime one.** `scripts/fetch-content.mjs`
reads from it during `pnpm build` and writes `data/generated/articles.json`,
which is what ships. No visitor's browser ever contacts Directus, so this stack
stays bound to `127.0.0.1` and needs no TLS, no public DNS and no CORS setup.

## Running it

```bash
cd directus
cp .env.example .env        # first time only, then fill in the secrets
docker compose up -d
```

Admin UI at http://localhost:8055. Postgres is on host port **5433** to avoid
clashing with a local Postgres on 5432.

```bash
docker compose logs -f directus   # tail logs
docker compose stop               # stop, keep data
docker compose down               # remove containers, keep data
```

Never `docker compose down -v`. The `-v` drops the `db-data` volume, which is
the only copy of your content.

## How content reaches the site

```bash
pnpm content     # fetch from Directus into data/generated/articles.json
pnpm build       # content fetch, then vite build, then prerender
pnpm build:ci    # same, but fails if Directus is unreachable
```

`scripts/fetch-content.mjs` writes two things, and **both are committed**:

- `data/generated/articles.json`, imported by `data/index.ts`
- `public/images/articles/<slug>.<ext>`, the hero images

That makes the build hermetic. A teammate or CI can clone and run `pnpm build`
with no access to Directus at all, and will get the last committed content plus
a loud warning. Use `pnpm build:ci` where that fallback would be wrong.

Never hand-edit `data/generated/articles.json`. Edit in Directus, run
`pnpm content`, and commit the diff.

### Read time and display date are computed

Neither is stored. `readTime` comes from word count at 220 wpm, overridable per
article via `read_time_override`. The `Aug 17, 2026` display string is formatted
from `date_published`, pinned to UTC so the build machine's timezone cannot
shift a date.

### Validation fails the build

Content problems stop the build rather than shipping a broken page, in the same
spirit as `scripts/prerender.mjs`. It refuses to write anything if an article
has no sections, a slug is malformed or duplicated, a category or hero image is
missing, `date_modified` precedes `date_published`, a link target is not a real
route, or a link's `text` does not appear verbatim in its section body. Long
titles and meta descriptions warn instead.

## Licence limits worth knowing

This runs on Directus's free **Core** tier, which has hard entitlement caps:

| Entitlement | Limit | Notes |
| --- | --- | --- |
| Seats | 3 | Admin plus two more people |
| Collections | 25 | Currently 3, so ~22 left for FAQs, plans, testimonials etc. |
| Flows | 5 | A rebuild webhook would use one |
| Custom permission rules | **unavailable** | See below |

Custom permissions are a paid feature, so the scoped read-only build role that
would normally be used here **cannot be created**. Attempting it returns
`custom_permission_rules_enabled is a restricted resource`. Granting the Public
role read access is blocked for the same reason.

The build therefore authenticates with a **static token on the admin user**,
which is a full-access credential living in `.env`. That is an acceptable
trade-off only because Directus is bound to `127.0.0.1` and never exposed. Two
things follow:

- Rotate it by setting a new `token` on the admin user, then updating `.env`.
- **Before exposing Directus publicly**, either buy a licence tier that allows
  custom permission rules and create a properly scoped read-only policy, or keep
  the CMS private and let only the build machine reach it. Do not put an
  admin-equivalent token in a CI environment reachable by others.

## Schema changes

The schema lives in `snapshots/schema.yaml`, which **is committed**. It is the
only reproducible record of the collections, so treat a schema change like a
code change: make it, snapshot it, commit the diff.

```bash
# after changing collections or fields in the admin UI
docker compose exec -T directus node /directus/cli.js \
  schema snapshot --yes /directus/snapshots/schema.yaml

# to rebuild the schema on an empty instance, or pull a teammate's change
docker compose exec -T directus node /directus/cli.js \
  schema apply --yes /directus/snapshots/schema.yaml
```

The CLI is invoked as `node /directus/cli.js`; the image ships no `npx`.

## Content model

Three collections, mirroring the `Article` and `ArticleSection` types in
`types/index.ts` so the fetch script maps CMS rows onto the existing shape
without the renderer changing at all.

| Collection | Purpose |
| --- | --- |
| `articles` | One row per post. `status` gates the build: only `published` is fetched. |
| `article_sections` | Ordered body blocks, edited through the parent article. Cascade-deleted with it. |
| `article_categories` | Category names plus their pill colours, replacing the hardcoded `articleCategoryColors`. |

Two things deliberately have no field, because they are derived at build time
and a stored duplicate is just something an editor can get wrong:

- **`date`** (the `Aug 17, 2026` display string) is formatted from `date_published`.
- **`readTime`** is computed from word count at 220 wpm, unless `read_time_override` is set.

### Editor gotchas worth knowing

- **`slug` is permanent.** Changing it breaks every existing inbound link and
  silently drops the old URL from `sitemap.xml`.
- **`article_sections.body` is plain text.** It renders inside a single `<p>`
  with no HTML parsing, so markdown or tags appear literally as characters.
- **`article_sections.links`** turns words already present in `body` into
  internal links. The `text` must appear in `body` character for character. The
  build fails loudly rather than silently dropping a link that does not match.
- **A section with no `heading`** is a continuation paragraph of the section
  above it. That is intentional and used throughout the existing articles.

## Backups

Content is worth more than the container. To dump and restore:

```bash
docker compose exec -T database pg_dump -U directus directus > backup.sql
docker compose exec -T database psql -U directus -d directus < backup.sql
```

The committed `data/generated/articles.json` also acts as a human-readable,
diffable copy of every published article.
