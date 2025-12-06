#!/bin/bash
# Automatický commit a push změn
# Použití: ./auto-commit.sh "Commit message"

MESSAGE="${1:-Automatický commit změn}"

git add .
git commit -m "$MESSAGE"
git push origin main

echo "Změny byly úspěšně commitovány a pushnuty na GitHub"

