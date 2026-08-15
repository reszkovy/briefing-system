#!/bin/bash
# Odświeża briefy w Obsidianie ze wszystkich tablic Trello (boards.json).
# Klucze czytane z briefsync/.env. Użycie:  ./update.sh   (lub  ./update.sh --dry-run)
cd "$(dirname "$0")" || exit 1
exec python3 sync_all.py "$@"
