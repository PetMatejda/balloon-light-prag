# PowerShell script to push changes to GitHub
Set-Location "c:\Users\petrm\OneDrive\Dokumenty\Coursor projects\balloon-light-prag"

Write-Host "=== Checking Git Status ===" -ForegroundColor Cyan
git status

Write-Host "`n=== Adding all changes ===" -ForegroundColor Cyan
git add -A

Write-Host "`n=== Creating commit ===" -ForegroundColor Cyan
git commit -m "Improve website clarity based on audit: translations, copy improvements, meta descriptions for all languages

- Počeštění anglických termínů (Shadowless -> Světlo bez stínů, etc.)
- Opraveny gramatické neshody v popisech produktů
- Doplněna chybějící data u SUNCUT balónů
- Sjednoceno názvosloví (Filmy -> Reference)
- Vylepšeno copy v sekci O nás (konkrétní údaje)
- Vylepšena CTA tlačítka (Nezávazně poptat)
- Přidány meta popisy pro všechny podstránky
- Klikatelná adresa pro Google Maps
- Všechny změny aplikovány na všechny jazyky: CS, EN, DE, ES, HU, IT"

Write-Host "`n=== Setting remote URL ===" -ForegroundColor Cyan
git remote set-url origin https://github.com/PetMatejda/balloon-light-prag.git

Write-Host "`n=== Setting branch to main ===" -ForegroundColor Cyan
git branch -M main

Write-Host "`n=== Pushing to GitHub ===" -ForegroundColor Cyan
git push -u origin main

Write-Host "`n=== Done! ===" -ForegroundColor Green
Write-Host "Check your repository at: https://github.com/PetMatejda/balloon-light-prag" -ForegroundColor Yellow
