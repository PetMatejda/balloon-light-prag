# Check Push Status
Write-Host "=== Checking Push Status ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Local repository status:" -ForegroundColor Yellow
git status --short
Write-Host ""

Write-Host "Last commit:" -ForegroundColor Yellow
git log --oneline -1
Write-Host ""

Write-Host "Remote configuration:" -ForegroundColor Yellow
git remote -v
Write-Host ""

Write-Host "Checking connection to GitHub..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/PetMatejda/balloon-light-prag"
try {
    $response = Invoke-WebRequest -Uri $remoteUrl -Method Head -UseBasicParsing -ErrorAction Stop
    Write-Host "✓ Repository exists on GitHub" -ForegroundColor Green
    Write-Host "  URL: $remoteUrl" -ForegroundColor Cyan
} catch {
    Write-Host "⚠️  Cannot verify repository on GitHub" -ForegroundColor Yellow
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Attempting to check remote branches..." -ForegroundColor Yellow
$remoteBranches = git ls-remote --heads origin 2>&1
if ($remoteBranches -and $remoteBranches -notmatch "fatal") {
    Write-Host "✓ Remote branches found:" -ForegroundColor Green
    Write-Host $remoteBranches
} else {
    Write-Host "⚠️  Could not fetch remote branches" -ForegroundColor Yellow
    Write-Host "  This might mean:" -ForegroundColor White
    Write-Host "    - Repository doesn't exist yet" -ForegroundColor White
    Write-Host "    - Authentication required" -ForegroundColor White
    Write-Host "    - Network issues" -ForegroundColor White
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "If you see your commits above, they are ready to push." -ForegroundColor White
Write-Host "If push failed, you may need to:" -ForegroundColor Yellow
Write-Host "  1. Create repository on GitHub: https://github.com/new" -ForegroundColor White
Write-Host "  2. Use Personal Access Token for authentication" -ForegroundColor White
Write-Host "  3. Run: git push -u origin main" -ForegroundColor White

