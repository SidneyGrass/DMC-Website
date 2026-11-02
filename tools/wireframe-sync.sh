#!/usr/bin/env bash
# Übernimmt den aktuellen Stand des Wireframe-Ordners nach ./wireframe
# und zeigt, was sich seit dem letzten Abgleich geändert hat.
# Aufruf: tools/wireframe-sync.sh "/pfad/zu/Bauwerk HH Wireframe"
set -euo pipefail
SRC="${1:?Pfad zum Wireframe-Ordner angeben}"
cd "$(dirname "$0")/.."
rsync -a --delete --exclude 'Website/' --exclude '.DS_Store' "$SRC"/ wireframe/ 2>/dev/null || {
  find wireframe -type f -delete
  (cd "$SRC" && find . -path ./Website -prune -o -type f ! -name .DS_Store -print0 | xargs -0 -I{} cp --parents {} "$OLDPWD/wireframe/")
}
git add -A wireframe
if git diff --cached --quiet -- wireframe; then
  echo "Wireframe unverändert."
else
  echo "Geänderte Wireframe-Dateien:"
  git diff --cached --stat -- wireframe
fi
