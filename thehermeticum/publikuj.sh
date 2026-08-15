#!/bin/bash
# Publikacja wg kalendarza w build.py — uruchamiana co tydzień z zadania.
# Build sam decyduje, co jest widoczne: artykuł wychodzi w dniu ze swojej daty.
# Skrypt jest bezpieczny do uruchomienia każdego dnia — bez nowej pozycji
# w kalendarzu po prostu przebuduje to samo.
set -euo pipefail

ROOT="/Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/thehermeticum"
DEPLOY="/private/tmp/claude-501/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/a21d4674-8ccf-47dc-b4f0-214e0778c964/scratchpad/hermeticum-deploy"
cd "$ROOT"

echo "── build $(date '+%Y-%m-%d %H:%M') ──"
STAN=$(python3 build.py | grep '^kalendarz:' || true)
echo "$STAN"

python3 make_contents.py  >/dev/null
python3 make_book.py      >/dev/null
python3 make_practice.py  >/dev/null
python3 make_subscribe.py >/dev/null
python3 make_questions.py >/dev/null
python3 make_brand.py     >/dev/null

# guard: sitemap nie może się skurczyć poniżej znanego minimum
URLE=$(grep -c '<loc>' sitemap.xml)
if [ "$URLE" -lt 130 ]; then
  echo "PRZERWANE: sitemap ma tylko $URLE adresów — coś jest nie tak, nie wdrażam."
  exit 1
fi

mkdir -p "$DEPLOY"
rsync -a --delete \
  --include='/assets/downloads/*.md' \
  --exclude research --exclude content --exclude content-pl \
  --exclude 'book-pl' --exclude 'book-en' --exclude drafts \
  --exclude '*.py' --exclude '*.sh' --exclude index-pl.html \
  --exclude STRUKTURA.md --exclude 'SPRINT*' --exclude '*.md' \
  --exclude '.book-urls' --exclude fonts --exclude 'hero-v*' --exclude '*.mp4' \
  ./ "$DEPLOY/"

# minifikacja tylko na kopii wdrożeniowej — źródło w repo zostaje czytelne
python3 "$ROOT/minify.py" "$DEPLOY/assets/site.css"

cd "$DEPLOY"
D=$(vercel deploy --prod --yes --scope reszkovys-projects 2>&1 \
    | grep -oE "thehermeticum-[a-z0-9]+-reszkovys-projects.vercel.app" | head -1)
if [ -z "$D" ]; then echo "PRZERWANE: deploy nie zwrócił adresu."; exit 1; fi
vercel alias set "$D" www.thehermeticum.com --scope reszkovys-projects >/dev/null 2>&1

echo "wdrożone: $D · adresów w sitemapie: $URLE"
echo "$STAN"
