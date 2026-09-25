#!/usr/bin/env bash
#
# One checksum over everything scripts/fetch-content.mjs writes.
#
# Sourced by both content-sync.sh, which compares it to decide whether to
# deploy, and deploy.sh, which records it afterwards. They have to agree
# exactly: if the two ever computed it differently, every cron run would see a
# mismatch and rebuild the site forever. That is the only reason this lives in
# its own file rather than in either script.
#
# Usage:  source deploy/content-checksum.sh   (then call checksum_content from $REPO)

# Two things have to be covered or edits publish silently never.
#
# Every generated file, because there is one per collection now and hashing a
# single one would mean a testimonial or marquee edit passes validation, lands
# on disk and never deploys.
#
# And the downloaded images, because swapping a photo in Directus changes the
# file's bytes while its committed path stays identical, so the JSON alone
# would look unchanged. This is what makes "home hero image" an editable thing
# rather than a field nobody can usefully edit.
#
# Sorted with a fixed collation and NUL-delimited, so filenames containing
# spaces and a different locale cannot reorder the list and fake a change.
# sha256sum prints the name beside each digest, so adding, renaming or removing
# a file moves the result even when no other bytes changed.
#
# The repo root is resolved from this file's own location and the paths below
# are relative to it, so the digest does not depend on the caller's working
# directory or on where the repo is checked out. Both of those would otherwise
# be a way for the two callers to disagree.
checksum_content() {
  local repo
  repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)" || return 1
  (
    cd "$repo" || exit 1
    {
      find data/generated -type f -name '*.json' -print0
      find public/images/articles public/images/cms -type f ! -name '.gitkeep' -print0
      # The demo video is gitignored, so this is the ONLY thing that notices a
      # new one: its path never changes, so demo-video.json stays byte-identical
      # when the file behind it is replaced.
      find public/video -type f -print0
    } | LC_ALL=C sort -z | xargs -0 sha256sum | sha256sum | cut -d' ' -f1
  )
}
