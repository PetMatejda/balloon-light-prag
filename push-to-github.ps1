# Push to GitHub Script
Write-Host "=== Pushing to GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Configure remote
Write-Host "Configuring remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/PetMatejda/balloon-light-prag.git
Write-Host "✓ Remote configured" -ForegroundColor Green

# Set branch to main
Write-Host "Setting branch to main..." -ForegroundColor Yellow
git branch -M main
Write-Host "✓ Branch set to main" -ForegroundColor Green

# Add all changes
Write-Host "Adding all changes..." -ForegroundColor Yellow
git add -A
$status = git status --short
if ($status) {
    Write-Host "Files to commit:" -ForegroundColor Cyan
    Write-Host $status
} else {
    Write-Host "No changes to commit" -ForegroundColor Yellow
}

# Commit
Write-Host ""
Write-Host "Creating commit..." -ForegroundColor Yellow
$commitMessage = @"
Fix: Add missing noGravity and stative products to all language files

- Added noGravity and stative products to en.json, de.json, hu.json, es.json, it.json
- Fixed duplicate main() call in scrape-gallery-simple.js
- All language files now have consistent structure matching cs.json
"@

git commit -m $commitMessage
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Commit created" -ForegroundColor Green
} else {
    Write-Host "⚠️  Commit failed or no changes to commit" -ForegroundColor Yellow
}

# Push
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "Repository: https://github.com/PetMatejda/balloon-light-prag.git" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  If prompted for credentials:" -ForegroundColor Yellow
Write-Host "   - Username: PetMatejda" -ForegroundColor White
Write-Host "   - Password: Use Personal Access Token (not your GitHub password)" -ForegroundColor White
Write-Host "   - Create token at: https://github.com/settings/tokens" -ForegroundColor White
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "View your repository at: https://github.com/PetMatejda/balloon-light-prag" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Push failed. Possible reasons:" -ForegroundColor Red
    Write-Host "   1. Authentication required (Personal Access Token)" -ForegroundColor Yellow
    Write-Host "   2. Repository doesn't exist on GitHub yet" -ForegroundColor Yellow
    Write-Host "   3. Network issues" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To create the repository on GitHub:" -ForegroundColor Cyan
    Write-Host "   1. Go to: https://github.com/new" -ForegroundColor White
    Write-Host "   2. Repository name: balloon-light-prag" -ForegroundColor White
    Write-Host "   3. Don't initialize with README" -ForegroundColor White
    Write-Host "   4. Click 'Create repository'" -ForegroundColor White
    Write-Host "   5. Run this script again" -ForegroundColor White
}

