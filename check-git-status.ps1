# Check Git Status Script
Write-Host "=== Git Repository Status ===" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (Test-Path .git) {
    Write-Host "✓ Git repository is initialized" -ForegroundColor Green
} else {
    Write-Host "✗ Git repository is NOT initialized" -ForegroundColor Red
    Write-Host "  Run: git init" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "=== Git Configuration ===" -ForegroundColor Cyan
$userName = git config --get user.name
$userEmail = git config --get user.email
Write-Host "User Name: $userName"
Write-Host "User Email: $userEmail"
if (-not $userName -or -not $userEmail) {
    Write-Host "⚠️  Git user not configured!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Remote Configuration ===" -ForegroundColor Cyan
$remote = git remote -v
if ($remote) {
    Write-Host "Remote configured:" -ForegroundColor Green
    Write-Host $remote
} else {
    Write-Host "✗ No remote configured" -ForegroundColor Red
    Write-Host "  You need to add GitHub remote" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Current Branch ===" -ForegroundColor Cyan
$branch = git branch --show-current
Write-Host "Branch: $branch"

Write-Host ""
Write-Host "=== Recent Commits ===" -ForegroundColor Cyan
git log --oneline -5

Write-Host ""
Write-Host "=== Uncommitted Changes ===" -ForegroundColor Cyan
$status = git status --short
if ($status) {
    Write-Host $status
} else {
    Write-Host "No uncommitted changes"
}

