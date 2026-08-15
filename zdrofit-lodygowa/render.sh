#!/usr/bin/env bash
# Render artboardów 1:1 (1 cm = 10 px) do out/*.png
# Użycie:  ./render.sh          → czyste artboardy
#          ./render.sh guides   → wersja kontrolna z liniami cięcia na bryty
set -euo pipefail
cd "$(dirname "$0")"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SRC="file://$(pwd)/artboardy.html"
MODE="${1:-clean}"
[ "$MODE" = "guides" ] && G="&g=1" && SUF="-bryty" || { G=""; SUF=""; }

mkdir -p out
render () { # $1=klucz  $2=szer  $3=wys
  "$CHROME" --headless --disable-gpu --hide-scrollbars \
    --allow-file-access-from-files --force-device-scale-factor=1 \
    --default-background-color=00000000 --virtual-time-budget=8000 \
    --window-size="$2,$3" \
    --screenshot="out/zdrofit-lodygowa-$1$SUF.png" \
    "$SRC?b=$1$G" >/dev/null 2>&1
  echo "  out/zdrofit-lodygowa-$1$SUF.png  ($2 × $3 px)"
}

echo "Render ($MODE):"
render A 7365 2845
render B 3705 2845
render C 1230 2845
echo "Gotowe."
