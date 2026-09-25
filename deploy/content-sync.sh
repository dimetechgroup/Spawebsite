#!/usr/bin/env bash
#
# Cron entry point. Asks Directus whether the published content has changed and
# rebuilds the site only if it has.
#
# This is the whole publish pipeline. An editor sets an article to published in
# Directus, and within one cron interval it is live. No webhook, no listener, no
# shared secret, and repeated saves inside an interval collapse into one build.
#
# Install (every 5 minutes, as the deploy user):
#   */5 * * * * /var/www/myspa/repo/deploy/content-sync.sh >> /var/www/myspa/state/cron.log 2>&1
#
# Exits non-zero when the CMS is unreachable or its content fails validation, so
# cron's MAILTO (or your monitoring) surfaces it.
set -euo pipefail

BASE="${MYSPA_BASE:-/var/www/myspa}"
REPO="${MYSPA_REPO:-$BASE/repo}"
STATE="$BASE/state"

mkdir -p "$STATE"

log() { printf '%s  %s\n' "$(date -u '+%Y-%m-%d %H:%M:%SZ')" "$*"; }

cd "$REPO"

# shellcheck source=./content-checksum.sh
source "$REPO/deploy/content-checksum.sh"

# A deploy in flight will publish whatever is current when it finishes, so there
# is nothing to do and nothing to report.
if [[ -f "$STATE/deploy.lock" ]] && ! flock -n "$STATE/deploy.lock" true 2>/dev/null; then
  exit 0
fi

# Pull the published content. --require-cms means an unreachable Directus is an
# error rather than a silent fall back to the committed copy, which for a cron
# job is the difference between "you get told" and "nothing ever updates again".
if ! OUTPUT=$(node scripts/fetch-content.mjs --require-cms 2>&1); then
  log "content fetch failed, not deploying:"
  printf '%s\n' "$OUTPUT"
  exit 1
fi

NEW_SHA=$(checksum_content)
OLD_SHA=$(cat "$STATE/content.sha" 2>/dev/null || echo "none")

if [[ "$NEW_SHA" == "$OLD_SHA" ]]; then
  # Nothing to say. Cron runs constantly and a quiet run should stay quiet.
  exit 0
fi

log "content changed ($OLD_SHA -> $NEW_SHA), deploying"
exec "$REPO/deploy/deploy.sh" --reason "content change"
