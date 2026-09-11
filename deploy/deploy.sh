#!/usr/bin/env bash
#
# Builds the site and publishes it atomically.
#
# The site is static, so "deploy" means: produce a new dist/, copy it to a fresh
# release directory, then flip a symlink. The flip is a single atomic rename, so
# a visitor never sees a half-written site and a failed build never takes the
# live site down.
#
# Safe to run by hand or from cron. A lock ensures two builds never overlap.
#
# Usage:  deploy/deploy.sh [--reason "why"]
set -euo pipefail

BASE="${MYSPA_BASE:-/var/www/myspa}"
REPO="${MYSPA_REPO:-$BASE/repo}"
RELEASES="$BASE/releases"
CURRENT="$BASE/current"
STATE="$BASE/state"
LOCK="$STATE/deploy.lock"
LOG="$STATE/deploy.log"
KEEP_RELEASES="${MYSPA_KEEP_RELEASES:-5}"

REASON="manual"
[[ "${1:-}" == "--reason" ]] && REASON="${2:-manual}"

mkdir -p "$RELEASES" "$STATE"

log() { printf '%s  %s\n' "$(date -u '+%Y-%m-%d %H:%M:%SZ')" "$*" | tee -a "$LOG"; }

# Only one deploy at a time. A concurrent run exits quietly rather than queueing,
# because whatever it wanted to publish will be picked up by the next run.
exec 9>"$LOCK"
if ! flock -n 9; then
  log "another deploy holds the lock, skipping ($REASON)"
  exit 0
fi

fail() {
  log "FAILED: $1"
  log "the live site was NOT touched and is still serving the previous release"
  exit 1
}

START=$(date +%s)
log "── deploy start ($REASON) ──"

cd "$REPO" || fail "no repo at $REPO"

# Dependencies only when the lockfile actually moved, so a content-only rebuild
# does not pay for an install it does not need.
LOCK_HASH=$(sha256sum pnpm-lock.yaml | cut -d' ' -f1)
if [[ ! -d node_modules ]] || [[ "$(cat "$STATE/lockfile.sha" 2>/dev/null || true)" != "$LOCK_HASH" ]]; then
  log "installing dependencies"
  pnpm install --frozen-lockfile || fail "pnpm install"
  echo "$LOCK_HASH" > "$STATE/lockfile.sha"
fi

# build:ci refuses to fall back to committed content, so an unreachable CMS or a
# content validation error stops here rather than silently republishing stale or
# broken pages.
log "building"
pnpm build:ci >>"$LOG" 2>&1 || fail "build (see $LOG)"

# ── Sanity-check the artefact before it goes anywhere near the webroot ──
[[ -f dist/index.html ]]  || fail "dist/index.html missing"
[[ -f dist/404.html ]]    || fail "dist/404.html missing"
[[ -f dist/sitemap.xml ]] || fail "dist/sitemap.xml missing"

ARTICLES=$(find dist/resources -mindepth 1 -maxdepth 1 -type d | wc -l)
[[ "$ARTICLES" -ge 1 ]] || fail "no article pages in dist/resources"

# A prerender that captured the loading spinner would still produce valid HTML,
# so check the homepage carries real content rather than just existing.
HOME_BYTES=$(stat -c%s dist/index.html)
[[ "$HOME_BYTES" -gt 20000 ]] || fail "dist/index.html is only $HOME_BYTES bytes, prerender likely failed"
grep -q 'Loading\.\.\.' dist/index.html && fail "dist/index.html contains the Suspense spinner"

log "built ok: $ARTICLES article pages, homepage $((HOME_BYTES / 1024)) KB"

# ── Publish ──
RELEASE="$RELEASES/$(date -u '+%Y%m%d-%H%M%S')"
cp -a dist "$RELEASE" || fail "copying dist to $RELEASE"

# ln -T then mv -T is atomic: readers see either the old or the new target,
# never a missing symlink.
ln -sfn "$RELEASE" "$CURRENT.tmp"
mv -Tf "$CURRENT.tmp" "$CURRENT" || fail "swapping the current symlink"

log "published $RELEASE"

# Keep a few releases so a rollback is just another symlink flip.
if [[ "$(find "$RELEASES" -mindepth 1 -maxdepth 1 -type d | wc -l)" -gt "$KEEP_RELEASES" ]]; then
  find "$RELEASES" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' \
    | sort -n | head -n -"$KEEP_RELEASES" | cut -d' ' -f2- \
    | while read -r old; do
        rm -rf "$old"
        log "pruned $old"
      done
fi

# Record what is live, so content-sync.sh can tell whether the CMS has moved on.
sha256sum "$REPO/data/generated/articles.json" | cut -d' ' -f1 > "$STATE/content.sha"

log "── deploy done in $(( $(date +%s) - START ))s ──"
