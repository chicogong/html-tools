#!/usr/bin/env bash

set -euo pipefail

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$repo_root"

version=${VERSION:-$(node -p "require('./package.json').version")}
source_date_epoch=${SOURCE_DATE_EPOCH:-$(git show -s --format=%ct HEAD)}
zip_path="webutils-${version}.zip"
tar_path="webutils-${version}.tar.gz"

if [ ! -d dist ]; then
  echo "dist/ is missing; run npm run build first" >&2
  exit 1
fi

if ! tar --version | head -1 | grep -q 'GNU tar'; then
  echo "deterministic release packaging requires GNU tar" >&2
  exit 1
fi

find dist -exec touch -d "@${source_date_epoch}" {} +

create_archives() {
  rm -f "$zip_path" "$tar_path"
  (
    cd dist
    LC_ALL=C find . -type f -print | LC_ALL=C sort | zip -X -q "../${zip_path}" -@
  )
  tar \
    --sort=name \
    --mtime="@${source_date_epoch}" \
    --owner=0 \
    --group=0 \
    --numeric-owner \
    -czf "$tar_path" \
    -C dist .
}

create_archives
sha256sum "$zip_path" "$tar_path" > SHA256SUMS

# Build again and prove that identical source produces identical release bytes.
create_archives
sha256sum --check SHA256SUMS

zip_entries=$(unzip -Z1 "$zip_path" | sed 's#^\./##')
tar_entries=$(tar -tzf "$tar_path" | sed 's#^\./##')
for required_file in index.html manifest.json sitemap.xml README.md README.en.md SECURITY.md LICENSE NOTICE; do
  if ! grep -Fqx "$required_file" <<<"$zip_entries"; then
    echo "$zip_path is missing $required_file" >&2
    exit 1
  fi
  if ! grep -Fqx "$required_file" <<<"$tar_entries"; then
    echo "$tar_path is missing $required_file" >&2
    exit 1
  fi
done

echo "deterministic release artifacts valid: $zip_path, $tar_path, SHA256SUMS"
