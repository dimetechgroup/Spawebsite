#!/usr/bin/env bash
#
# Nightly backup of everything the CMS holds that is not already in git.
#
# Two things are backed up: the Postgres database (articles, sections,
# categories, testimonials, faqs, marquee labels, module cards, users and
# permissions) and the uploads directory (the original image files, and the
# demo video). Restoring both reconstructs the CMS exactly.
#
# The site content itself has a third copy in git as data/generated/ plus
# public/images/articles/ and public/images/cms/, readable without restoring
# anything.
#
# Install (03:15 daily):
#   15 3 * * * /var/www/myspa/repo/deploy/backup.sh >> /var/www/myspa/state/backup.log 2>&1
set -euo pipefail

BASE="${MYSPA_BASE:-/var/www/myspa}"
REPO="${MYSPA_REPO:-$BASE/repo}"
DIRECTUS_DIR="${MYSPA_DIRECTUS_DIR:-$REPO/directus}"
DEST="${MYSPA_BACKUP_DIR:-$BASE/backups}"
RETAIN_DAYS="${MYSPA_BACKUP_RETAIN_DAYS:-14}"

STAMP=$(date -u '+%Y%m%d-%H%M%S')
mkdir -p "$DEST"

log() { printf '%s  %s\n' "$(date -u '+%Y-%m-%d %H:%M:%SZ')" "$*"; }

log "── backup $STAMP ──"

cd "$DIRECTUS_DIR"

# ── Database ──
DB_FILE="$DEST/directus-db-$STAMP.sql.gz"
if ! docker compose exec -T database pg_dump -U directus --clean --if-exists directus \
     | gzip -9 > "$DB_FILE"; then
  rm -f "$DB_FILE"
  log "FAILED: pg_dump"
  exit 1
fi

# A dump of an empty or broken database still produces a small valid file, so
# check it actually contains the articles table before trusting it.
if ! gunzip -c "$DB_FILE" | grep -q 'CREATE TABLE public.articles'; then
  log "FAILED: dump does not contain the articles table, discarding it"
  rm -f "$DB_FILE"
  exit 1
fi
log "database  $(du -h "$DB_FILE" | cut -f1)  $DB_FILE"

# ── Uploads ──
UPLOADS_FILE="$DEST/directus-uploads-$STAMP.tar.gz"
if ! tar -czf "$UPLOADS_FILE" -C "$DIRECTUS_DIR" uploads; then
  rm -f "$UPLOADS_FILE"
  log "FAILED: tarring uploads"
  exit 1
fi
log "uploads   $(du -h "$UPLOADS_FILE" | cut -f1)  $UPLOADS_FILE"

# ── Prune ──
find "$DEST" -name 'directus-*-*.sql.gz'  -mtime +"$RETAIN_DAYS" -print -delete
find "$DEST" -name 'directus-*-*.tar.gz'  -mtime +"$RETAIN_DAYS" -print -delete

# ── Off-box copy ──
# A backup on the same disk as the thing it backs up is not a backup. Point this
# at object storage, another host, or a mounted volume before relying on it.
if [[ -n "${MYSPA_BACKUP_RSYNC_TARGET:-}" ]]; then
  if rsync -a --delete "$DEST/" "$MYSPA_BACKUP_RSYNC_TARGET"; then
    log "mirrored to $MYSPA_BACKUP_RSYNC_TARGET"
  else
    log "WARNING: off-box mirror to $MYSPA_BACKUP_RSYNC_TARGET failed"
    exit 1
  fi
else
  log "WARNING: MYSPA_BACKUP_RSYNC_TARGET is unset, backups exist only on this host"
fi

log "── backup done ──"
