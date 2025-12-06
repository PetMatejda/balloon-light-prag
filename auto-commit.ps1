# Automatický commit a push změn pro PowerShell
# Použití: .\auto-commit.ps1 "Commit message"

param(
    [string]$Message = "Automatický commit změn"
)

Set-Location $PSScriptRoot

git add .
git commit -m $Message
git push origin main

Write-Host "Změny byly úspěšně commitovány a pushnuty na GitHub" -ForegroundColor Green

