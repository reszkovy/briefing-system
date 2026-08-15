#!/bin/bash
# Codzienny update Obsidiana: odśwież briefy ze wszystkich tablic + zbuduj notatkę dnia.
# Uruchamiane przez launchd raz dziennie. Log: briefsync/daily.log
cd "$(dirname "$0")" || exit 1
{
  echo "════════ $(date '+%Y-%m-%d %H:%M:%S') — daily run ════════"
  PY=/usr/bin/python3
  "$PY" sync_all.py
  "$PY" daily_note.py
  echo ""
} >> daily.log 2>&1
