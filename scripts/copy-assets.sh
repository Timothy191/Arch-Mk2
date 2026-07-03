#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

SRC="$REPO_ROOT/assets"
DST="$REPO_ROOT/apps/portal/public/assets"

if [ ! -d "$SRC" ]; then
  echo "  [assets] Source directory not found: $SRC"
  exit 0
fi

mkdir -p "$DST"

rsync -a --delete "$SRC/" "$DST/"

echo "  [assets] Synced $SRC → $DST"
