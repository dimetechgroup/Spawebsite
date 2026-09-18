# Production deployment

Runbook for putting Directus on `cms.myspa.co.ke` and having a published
article reach `myspa.co.ke` on its own.

## How publishing works

```
editor publishes an article, testimonial, image or marquee label in Directus
        |
        |  cron, every 5 minutes
        v
deploy/content-sync.sh    fetches content, compares a checksum
        |                 (deploy/content-checksum.sh, shared with deploy.sh,
        |                  covers every generated file AND every downloaded
        |                  image, so a swapped photo publishes too)
        |                 exits silently if nothing changed
        v
deploy/deploy.sh          pnpm build:ci  (fetch -> vite -> prerender)
        |                 sanity-checks dist/
        v
releases/<timestamp>/     copied in, then `current` symlink flipped atomically
        |
        v
live on myspa.co.ke       worst case ~6 minutes after publishing
```

The site stays fully static. Nothing a visitor loads ever contacts Directus, so
the CMS being down affects editing only, never the live site.

**Why cron rather than a webhook.** A webhook would cut the delay to about 90
seconds but needs a listener service, a shared secret, debouncing, and a Directus
Flow. For a blog publishing a few times a month that is a lot of moving parts to
save four minutes. Repeated saves inside one interval naturally collapse into a
single build. If the delay ever becomes a real complaint, a webhook layers on top
of `deploy.sh` without changing anything else.

## Layout on the server

```
/var/www/myspa/
  repo/                    git checkout, also the build workspace
  releases/20260911-143022/ one directory per deploy
  current -> releases/...   DocumentRoot, flipped atomically
  state/                    locks, logs, the content checksum
  backups/                  nightly dumps
```

Everything is overridable with `MYSPA_BASE`, `MYSPA_REPO`, `MYSPA_BACKUP_DIR`.

---

## Step 1: DNS and packages

Point an A record for `cms.myspa.co.ke` at the server, alongside the existing
record for `myspa.co.ke`. Then:

```bash
sudo apt update
sudo apt install -y apache2 certbot python3-certbot-apache \
     docker.io docker-compose-plugin rsync git

# Node 24 and pnpm for the build
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pnpm

# Puppeteer drives a real Chrome to prerender. These are its shared libraries.
sudo apt install -y libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
     libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 \
     libpango-1.0-0 libcairo2 libasound2

sudo a2enmod proxy proxy_http headers ssl rewrite deflate expires
```

The build peaks around **800 MB RSS** because of Chrome. On a 1 GB server it
will be tight; give it swap or use a 2 GB instance.

## Step 2: Directus on the subdomain

```bash
sudo mkdir -p /var/www/myspa && sudo chown "$USER" /var/www/myspa
cd /var/www/myspa
git clone <your-repo-url> repo
cd repo/directus
cp .env.example .env
```

Generate **fresh** secrets. Do not reuse the local development values:

```bash
openssl rand -hex 32       # SECRET
openssl rand -base64 18    # DB_PASSWORD
openssl rand -base64 18    # ADMIN_PASSWORD
```

Add the production settings to `directus/.env`:

```ini
PUBLIC_URL=https://cms.myspa.co.ke
RATE_LIMITER_ENABLED=true
IP_TRUST_PROXY=true
```

`IP_TRUST_PROXY=true` matters: without it the rate limiter sees every request as
coming from Apache and throttles all editors as one client.

```bash
docker compose up -d
sudo cp ../deploy/apache/cms.myspa.co.ke.conf /etc/apache2/sites-available/
sudo a2ensite cms.myspa.co.ke
sudo certbot --apache -d cms.myspa.co.ke
```

Then log in at `https://cms.myspa.co.ke` and **turn on two-factor auth for every
account**. This is an internet-facing admin panel now.

## Step 3: Move the content across

Dump locally and restore on the server. This carries articles, sections,
categories, users, and the Editor policy together, so nothing is rebuilt by hand.

```bash
# on your machine
cd directus
docker compose exec -T database pg_dump -U directus --clean --if-exists directus \
  | gzip > /tmp/directus-local.sql.gz
scp /tmp/directus-local.sql.gz user@server:/tmp/
rsync -a uploads/ user@server:/var/www/myspa/repo/directus/uploads/

# on the server
cd /var/www/myspa/repo/directus
gunzip -c /tmp/directus-local.sql.gz | docker compose exec -T database psql -U directus -d directus
docker compose restart directus
```

The restore brings the local admin user and its static token with it, so
immediately afterwards:

1. Change the admin password in the UI.
2. Rotate the static token (User Directory, the admin user, Token field).
3. Create the editor accounts against the existing Editor role.

You have 3 seats on the Core licence: you plus two editors.

Alternatively, start empty and run
`docker compose exec -T directus node /directus/cli.js schema apply --yes /directus/snapshots/schema.yaml`,
then re-enter the articles by hand. The dump is far less work.

## Step 4: Make the server able to build

```bash
cd /var/www/myspa/repo
cp .env.example .env
```

Set in `.env`:

```ini
DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=<the rotated admin static token>
```

`DIRECTUS_URL` is the **loopback** address, not the public one. The build runs on
this machine, so it has no reason to leave it, and the token never crosses the
network.

Verify by hand before automating anything:

```bash
pnpm install --frozen-lockfile
pnpm build:ci
```

That must print the prerendered route list and `all routes prerendered`. If
Puppeteer cannot launch, it is almost always a missing library from step 1;
`node -e "import('puppeteer').then(p=>p.launch())"` reports which.

## Step 5: First deploy

```bash
sudo cp deploy/apache/myspa.co.ke.conf /etc/apache2/sites-available/
sudo a2ensite myspa.co.ke
chmod +x deploy/*.sh
./deploy/deploy.sh --reason "first deploy"
sudo certbot --apache -d myspa.co.ke -d www.myspa.co.ke
sudo systemctl reload apache2
```

`deploy.sh` builds, sanity-checks `dist/`, copies it into `releases/`, and flips
`current`. It refuses to publish if the homepage is suspiciously small, still
contains the loading spinner, or has no article pages, so a broken build leaves
the previous release serving.

**Rollback** is a symlink flip:

```bash
ln -sfn /var/www/myspa/releases/<older> /var/www/myspa/current.tmp
mv -Tf /var/www/myspa/current.tmp /var/www/myspa/current
```

## Step 6: The cron jobs

```bash
crontab -e
```

```cron
MAILTO=you@dimetechgroup.com

# Publish content changes. Silent unless something changed or broke.
*/5 * * * * /var/www/myspa/repo/deploy/content-sync.sh >> /var/www/myspa/state/cron.log 2>&1

# Nightly backup.
15 3 * * * /var/www/myspa/repo/deploy/backup.sh >> /var/www/myspa/state/backup.log 2>&1
```

`content-sync.sh` exits non-zero when Directus is unreachable or its content
fails validation, so `MAILTO` turns those into mail. Set it to an address you
actually read, otherwise a silently stuck pipeline looks identical to a quiet
week.

### Verify the loop

Publish a throwaway article in Directus, wait for the next interval, and check:

```bash
tail -f /var/www/myspa/state/cron.log
curl -sI https://myspa.co.ke/resources/<slug> | head -1     # 200
curl -s  https://myspa.co.ke/sitemap.xml | grep <slug>      # present
```

Then archive it and confirm the URL returns 404 and leaves the sitemap.

## Step 9: Backups

`backup.sh` dumps Postgres and tars `uploads/` nightly, keeping 14 days. It
verifies the dump actually contains the articles table before trusting it, so a
silently empty backup fails loudly rather than sitting there looking fine.

Set an off-box target, because a backup on the same disk as the database is not
a backup:

```bash
export MYSPA_BACKUP_RSYNC_TARGET="user@backup-host:/srv/myspa-backups/"
```

The script warns on every run until this is set.

There is a third copy of the content that needs no restore at all:
`data/generated/` and both image directories (`public/images/articles/` and
`public/images/cms/`) are committed to git and human-readable. Losing the entire
CMS costs you the editing interface, not the content.

**The demo video is the exception.** It is gitignored, so the CMS database and
its uploads directory are its only copies. That is what the nightly uploads tar
is for, and it is the strongest reason to set `MYSPA_BACKUP_RSYNC_TARGET`.

**Restore drill**, worth doing once:

```bash
gunzip -c backups/directus-db-<stamp>.sql.gz \
  | docker compose exec -T database psql -U directus -d directus
tar -xzf backups/directus-uploads-<stamp>.tar.gz -C /var/www/myspa/repo/directus/
docker compose restart directus
```

---

## Operational notes

**Deploying code changes** is separate from content and stays manual:

```bash
cd /var/www/myspa/repo && git pull && ./deploy/deploy.sh --reason "code update"
```

**Build time** is about 77 seconds at 6 articles and grows roughly 3 seconds per
article, since every route is prerendered on every build. Around 50 articles
that is a 2.5 minute build, which is still well inside the 5 minute cron window.
Past that, prerender only changed routes.

**Editors cannot preview drafts.** The static site only contains published
content, so there is no way to see a draft as it will look. Expect this request.
The clean answer is a `noindex` preview route that fetches from Directus at
runtime, which is the one place a runtime fetch belongs.

**Nothing writes back to git.** The server fetches content into its working
copy but never commits, so `data/generated/` in git drifts behind production
over time. Refresh it deliberately from a development machine:

```bash
pnpm content && git add data/generated public/images/articles public/images/cms && git commit
```

`public/video/` is deliberately absent from that list: the demo video is
gitignored and lives only in the CMS and on whichever machines have built.
