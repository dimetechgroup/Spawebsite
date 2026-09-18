# MySpa content CMS (local)

Directus instance holding the editable content of the site.

**Directus is a build dependency, not a runtime one.** `scripts/fetch-content.mjs`
reads from it during `pnpm build` and writes one JSON file per collection into
`data/generated/`, which is what ships. No visitor's browser ever contacts
Directus, so this stack stays bound to `127.0.0.1` and needs no TLS, no public
DNS and no CORS setup.

## What is in the CMS

| Collection | What it feeds |
| --- | --- |
| `articles` | the posts at `/resources/:slug` |
| `home_hero_image` | the product screenshot in the home page hero |
| `modules_image` | the photo and badge in the home page modules section |
| `testimonials` | the home page quote carousel |
| `modules_marquee` | the scrolling capability strip under the feature grid |
| `features_hero_image` | the screenshot at the top of `/features` |
| `demo_video` | the demo, shared by `/features` and the home hero pop-up |
| `anchor_features` | the module cards on `/features` |
| `faq_categories` | the coloured pills on `/faq` |
| `faqs` | the questions on `/faq`, and their FAQPage structured data |
| `contact_details` | the sales phone and email, in all three places they appear |

Each is a separate collection on purpose. Grouping them into one "home page"
record would mean every unrelated edit churns the same row and the same git
diff, and a collection could not be added or dropped on its own.

`demo_video` is one record feeding two places. Change it there and both the
features page section and the "How it works" pop-up on the home page update.

`contact_details` is one record feeding three: the cards on `/contact`, the
footer of every page, and the Organization `contactPoint` in the structured
data. It holds **one** phone number, written the way it should read on the page;
the build strips the spaces itself to produce the E.164 form schema.org needs,
so there is no second field to forget to update.

### What is deliberately NOT in the CMS

**Icons.** A Lucide icon is a live component reference, not data. Most of the
collections above carry none, which is why they moved first.

FAQs used to carry one. Rather than build a join key for it, **the icon was
removed from the FAQ design**, which is what makes `faqs` a collection an editor
can add to without a developer. That is the cheaper trade whenever an icon is
decoration rather than meaning.

`anchor_features` is the exception and shows the pattern for everything that
follows it. Its editable half (name, description, screenshot, alt text, whether
it is hidden) lives in Directus; its icon, colour and grid size live in the
`anchorFeatureStyles` map in `data/index.ts`, joined on an immutable `key`. The
build reads the keys out of that map and **fails if a published card has a key
with no entry**, so a card can never reach the site without an icon.

The practical consequence: an editor can rewrite every card and swap every
screenshot, but **adding a brand new module needs a developer** to add one line
to that map first. Plans, partner cards and values will work the same way unless
their icons are dropped too.

**Colours and Tailwind classes.** Tailwind generates CSS by scanning source
files at build time, so a class name that exists only in Postgres is never
compiled and silently produces no styling at all. Accents, gradients and theme
tokens therefore stay in the components. The hex values on `article_categories`
are the exception that proves the rule: they are inline style values, not class
names, so they survive the trip through the database.

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
pnpm content     # fetch from Directus into data/generated/
pnpm build       # content fetch, then vite build, then prerender
pnpm build:ci    # same, but fails if Directus is unreachable
```

`scripts/fetch-content.mjs` writes these, and **all of them are committed**:

- `data/generated/articles.json`, imported by `data/index.ts`
- `data/generated/home-hero-image.json`
- `data/generated/modules-image.json`
- `data/generated/testimonials.json`
- `data/generated/modules-marquee.json`
- `data/generated/features-hero-image.json`
- `data/generated/demo-video.json`
- `data/generated/anchor-features.json`
- `data/generated/faqs.json`
- `data/generated/contact-details.json`
- `public/images/articles/<slug>.<ext>`, the article hero images
- `public/images/cms/<name>.<ext>`, every other CMS-managed image

That makes the build hermetic. A teammate or CI can clone and run `pnpm build`
with no access to Directus at all, and will get the last committed content plus
a loud warning. Use `pnpm build:ci` where that fallback would be wrong.

**The demo video is the one exception.** It lands in `public/video/` and is
**gitignored**, because at ~100 MB every version would sit in git history
permanently and could only be removed by rewriting history for everyone.
Whichever machine builds downloads it, so the live site serves its own copy; a
build with no CMS access renders an empty player rather than failing. The fetch
script skips the transfer when the file on disk already matches the CMS, using
its size and an mtime stamped from Directus, so the five-minute cron does not
move 100 MB every time it runs.

Both image directories are owned entirely by the fetch script: anything in them
that no published row points at is deleted on the next run, so archiving a
testimonial or swapping a photo does not leave a file in git forever.

Never hand-edit anything in `data/generated/`. Edit in Directus, run
`pnpm content`, and commit the diff.

### Read time and display date are computed

Neither is stored. `readTime` comes from word count at 220 wpm, overridable per
article via `read_time_override`. The `Aug 17, 2026` display string is formatted
from `date_published`, pinned to UTC so the build machine's timezone cannot
shift a date.

### Validation fails the build

Content problems stop the build rather than shipping a broken page, in the same
spirit as `scripts/prerender.mjs`. Nothing is written at all unless everything
validates, so one bad edit cannot half-publish.

**Articles.** No sections, a malformed or duplicated slug, a missing category or
hero image, `date_modified` before `date_published`, under 700 characters of
prose, a link target that is not a real route, or a link whose `text` does not
appear verbatim in its section body. Long titles and meta descriptions warn.

**Images.** A missing image, or alt text under 10 characters. Alt text is
required rather than optional because these pages are prerendered for crawlers,
so a placeholder like "logo" is a content bug worth blocking.

**Testimonials.** Any empty field, a quote under 80 characters, or two people
whose names produce the same image filename. A quote that starts or ends with a
quotation mark is also an error: the card adds its own, so it would render as
`""like this""`. Quotes over 320 characters warn, because they overflow the card
on a phone.

**Marquee.** Fewer than four published labels, an empty label, or a duplicate.
The strip animates across a list the site doubles, so too few labels leave a
visible gap and a duplicate reads as a rendering fault. Labels over 30
characters warn.

**Module cards.** A key with no entry in `anchorFeatureStyles`, a duplicate key,
any empty field, or a description under 60 characters. Also **exactly four**
published cards must be left un-hidden: `FeaturesPage.tsx` builds the grid from
`anchorFeatures[0]` through `[3]` as four hand-written layout blocks rather than
a loop, so a fifth would never render and a missing fourth would crash the page.
At least one card must be hidden or the "See the List" button opens an empty
panel. Hidden cards that do not fill whole rows of three warn, as do
descriptions over 220 characters.

**Demo video.** A missing video or poster, missing poster alt text, or a video
whose extension is not one browsers play inline. A format the browser cannot
decode shows an empty black box with no error, so it is caught here instead.

**FAQs.** Stricter than the rest, because every published question also becomes
a schema.org `Question` in the page's structured data. A question that does not
end in a question mark, a duplicate question, an answer under 80 characters, or
HTML in an answer are all errors. Google renders an answer with no page around
it, so "see above" or a one-line stub is a real defect rather than a style
quibble. A `youtube_url` that is not a YouTube watch link is an error too, since
the button would otherwise go nowhere.

**Contact details.** A phone number that is not full international form, or an
address that is plainly not an address. The number is published as the
Organization's sales `contactPoint`, so a local format like `0708 178 500` is
wrong everywhere outside Kenya and wrong in the structured data everywhere.
Spacing is free: `+254 708 178 500`, `+254-708-178-500` and `+254708178500` all
produce the same E.164 value.

Category colours must be six-digit hex. The pill is styled inline from these
values, so a Tailwind class name typed into one of those fields would render the
pill unstyled with no error anywhere. That check exists because it is the single
easiest way to reintroduce the problem the whole colour rule above avoids.

## Licence limits worth knowing

This runs on Directus's free **Core** tier, which has hard entitlement caps:

| Entitlement | Limit | Notes |
| --- | --- | --- |
| Seats | 3 | Admin plus two more people |
| Collections | 25 | Currently 13, so ~12 left for plans, partner cards, values etc. |
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
