#!/usr/bin/env bash
#
# Regenerates the browser-tab / homescreen icons from the brand logo.
# Run from the repo root after changing public/images/MYSPA.png:
#
#   bash scripts/generate-favicons.sh
#
# Why the crop: MYSPA.png is the full wordmark at 877x297 (roughly 3:1). Scaled
# into a ~16px browser tab it becomes an illegible smear, so we use only the
# distinctive mark, the face profile and orange dots on the left, padded out
# to a square. The trailing micro-dots at the far left are cropped away too, or
# the mark floats in whitespace and reads even smaller.
#
# Requires ImageMagick (`convert`).

set -euo pipefail

cd "$(dirname "$0")/.."

SRC=public/images/MYSPA.png
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

[ -f "$SRC" ] || { echo "missing $SRC" >&2; exit 1; }

# 1. Take the left portion (mark, no wordmark) and trim the transparent edges.
convert "$SRC" -crop 440x297+0+0 +repage -trim +repage "$TMP/mark.png"

# 2. Drop the trailing micro-dots, then pad to a square canvas.
convert "$TMP/mark.png" -crop 300x297+110+0 +repage \
  -background none -gravity center -extent 320x320 "$TMP/square.png"

# 3. Tab icons keep transparency.
convert "$TMP/square.png" -filter Lanczos \
  -define icon:auto-resize=48,32,16 public/favicon.ico
convert "$TMP/square.png" -filter Lanczos -resize 96x96 public/favicon-96.png

# 4. Homescreen icons are flattened, because iOS renders transparency as black.
for size in 180 192 512; do
  case $size in
    180) out=public/apple-touch-icon.png ;;
    *)   out="public/icon-${size}.png" ;;
  esac
  convert "$TMP/square.png" -background white -flatten \
    -filter Lanczos -resize "${size}x${size}" "$out"
done

echo "Regenerated:"
identify public/favicon.ico public/favicon-96.png public/apple-touch-icon.png \
  public/icon-192.png public/icon-512.png |
  awk '{printf "  %-30s %s\n", $1, $3}'
