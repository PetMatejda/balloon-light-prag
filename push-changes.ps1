# PowerShell script to commit and push changes to GitHub

cd "C:\Users\petrm\OneDrive\Dokumenty\Coursor projects\balloon-light-prag"

Write-Host "Checking git status..."
git status

Write-Host "`nAdding all changes..."
git add -A

Write-Host "`nCreating commit..."
git commit -m "Update: Rename Technika to Produkty and add German language support

- Renamed 'Technika' to 'Produkty' in Czech translations
- Added German language support (de.json)
- Updated i18n-config.ts, middleware.ts, lib/translations.ts
- Added Deutsch to LanguageSwitcher"

Write-Host "`nChecking remote configuration..."
$remote = git remote -v
if ($remote) {
    Write-Host "Remote found:"
    Write-Host $remote
    Write-Host "`nPushing to GitHub..."
    git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Successfully pushed to GitHub!"
    } else {
        Write-Host "`n⚠️ Push failed. Please check your remote configuration."
        Write-Host "If remote is not configured, run:"
        Write-Host "git remote add origin https://github.com/YOUR_USERNAME/balloon-light-prag.git"
    }
} else {
    Write-Host "⚠️ No remote configured. Please add GitHub remote:"
    Write-Host "git remote add origin https://github.com/YOUR_USERNAME/balloon-light-prag.git"
    Write-Host "git branch -M main"
    Write-Host "git push -u origin main"
}

