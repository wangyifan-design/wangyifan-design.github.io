#!/usr/bin/env bash
# Copy images, videos and a few static files from the legacy repo
# (../wangyifan-design.github.io/public) into this project's public/.
# Safe to re-run.

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( dirname "$SCRIPT_DIR" )"
LEGACY="$PROJECT_DIR/../wangyifan-design.github.io/public"

if [ ! -d "$LEGACY" ]; then
  echo "❌ Legacy site not found at: $LEGACY"
  echo "   Expected to find your original repo next to this folder."
  echo "   Edit scripts/setup-assets.sh and update LEGACY=... to your path."
  exit 1
fi

echo "📦 Copying assets from $LEGACY ..."

mkdir -p "$PROJECT_DIR/public"

# Copy image and video directories (these are the bulk of the assets).
for dir in img videos; do
  if [ -d "$LEGACY/$dir" ]; then
    echo "   • $dir/"
    cp -R "$LEGACY/$dir" "$PROJECT_DIR/public/"
  fi
done

# Also copy the legacy css/ directory so the un-migrated HTML pages
# (which we copy below) keep working from the same site root.
if [ -d "$LEGACY/css" ]; then
  echo "   • css/ (for legacy pages)"
  cp -R "$LEGACY/css" "$PROJECT_DIR/public/"
fi

# Copy small individual files (favicons, JSON, verification files).
for f in robots.txt sitemap.xml chat-media.json knowledge.json google2f6bde27b454d612.html; do
  if [ -f "$LEGACY/$f" ]; then
    cp "$LEGACY/$f" "$PROJECT_DIR/public/$f"
  fi
done

# All project pages have been migrated to MDX in src/content/projects/.
# If older versions of those HTML files are still sitting in public/ from
# a previous setup run, remove them so the new clean URLs are canonical.
for f in livingjiagu.html virtualzoo.html redpacket.html patapata.html poster.html ram.html bird.html heidegger.html rockhood.html; do
  if [ -f "$PROJECT_DIR/public/$f" ]; then
    echo "   • removing stale $f (now lives at /projects/${f%.html}/)"
    rm "$PROJECT_DIR/public/$f"
  fi
done

echo "✅ Assets copied. Run \`npm run dev\` to start the dev server."
