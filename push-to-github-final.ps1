# Final Push to GitHub Script
Write-Host "=== Push to GitHub - Balloon Light Prag ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Ensure git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Step 2: Configure remote
Write-Host "Configuring GitHub remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/PetMatejda/balloon-light-prag.git
Write-Host "✓ Remote configured: https://github.com/PetMatejda/balloon-light-prag.git" -ForegroundColor Green

# Step 3: Set branch to main
Write-Host "Setting branch to main..." -ForegroundColor Yellow
git branch -M main 2>$null
Write-Host "✓ Branch set to main" -ForegroundColor Green

# Step 4: Configure git user if needed
$userName = git config --get user.name
$userEmail = git config --get user.email

if (-not $userName) {
    git config user.name "PetMatejda"
    Write-Host "✓ Git user name configured" -ForegroundColor Green
}

if (-not $userEmail) {
    git config user.email "petmatejda@users.noreply.github.com"
    Write-Host "✓ Git user email configured" -ForegroundColor Green
}

# Step 5: Add all changes
Write-Host ""
Write-Host "Adding all changes..." -ForegroundColor Yellow
git add -A
$changes = git status --short
if ($changes) {
    Write-Host "Files to commit:" -ForegroundColor Cyan
    Write-Host $changes
} else {
    Write-Host "No new changes to commit" -ForegroundColor Yellow
}

# Step 6: Create commit
Write-Host ""
Write-Host "Creating commit..." -ForegroundColor Yellow
$commitMessage = "Update: Rename Technika to Produkty and add German language support"
git commit -m $commitMessage 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Commit created successfully" -ForegroundColor Green
} else {
    $existingCommits = git log --oneline -1 2>$null
    if ($existingCommits) {
        Write-Host "✓ Using existing commit" -ForegroundColor Green
    } else {
        Write-Host "⚠️  No changes to commit or commit failed" -ForegroundColor Yellow
    }
}

# Step 7: Show current status
Write-Host ""
Write-Host "=== Current Status ===" -ForegroundColor Cyan
Write-Host "Repository: https://github.com/PetMatejda/balloon-light-prag" -ForegroundColor White
Write-Host "Branch: main" -ForegroundColor White
$lastCommit = git log --oneline -1 2>$null
if ($lastCommit) {
    Write-Host "Last commit: $lastCommit" -ForegroundColor White
}

# Step 8: Attempt push
Write-Host ""
Write-Host "=== Pushing to GitHub ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT: You will be prompted for credentials" -ForegroundColor Yellow
Write-Host ""
Write-Host "When prompted:" -ForegroundColor Cyan
Write-Host "  Username: PetMatejda" -ForegroundColor White
Write-Host "  Password: Use Personal Access Token (NOT your GitHub password!)" -ForegroundColor White
Write-Host ""
Write-Host "If you don't have a token yet:" -ForegroundColor Yellow
Write-Host "  1. Go to: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "  2. Click 'Generate new token' → 'Generate new token (classic)'" -ForegroundColor White
Write-Host "  3. Name: balloon-light-prag" -ForegroundColor White
Write-Host "  4. Select scope: repo (full control)" -ForegroundColor White
Write-Host "  5. Click 'Generate token'" -ForegroundColor White
Write-Host "  6. COPY THE TOKEN (you'll see it only once!)" -ForegroundColor White
Write-Host "  7. Use it as password when prompted" -ForegroundColor White
Write-Host ""
Write-Host "Checking if repository exists on GitHub..." -ForegroundColor Yellow

# Try to check if repo exists
$repoExists = $false
try {
    $response = Invoke-WebRequest -Uri "https://github.com/PetMatejda/balloon-light-prag" -Method Head -UseBasicParsing -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $repoExists = $true
        Write-Host "✓ Repository exists on GitHub" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Repository might not exist yet or is private" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "If repository doesn't exist, create it first:" -ForegroundColor Cyan
    Write-Host "  1. Go to: https://github.com/new" -ForegroundColor White
    Write-Host "  2. Repository name: balloon-light-prag" -ForegroundColor White
    Write-Host "  3. Choose Public or Private" -ForegroundColor White
    Write-Host "  4. DO NOT check any boxes (README, .gitignore, license)" -ForegroundColor White
    Write-Host "  5. Click 'Create repository'" -ForegroundColor White
    Write-Host "  6. Then run this script again" -ForegroundColor White
    Write-Host ""
}

if ($repoExists) {
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    Write-Host ""
    
    # Push with explicit output
    git push -u origin main 2>&1 | ForEach-Object {
        Write-Host $_
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
        Write-Host "View your repository: https://github.com/PetMatejda/balloon-light-prag" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "❌ Push failed. Common reasons:" -ForegroundColor Red
        Write-Host "  1. Authentication failed (check your token)" -ForegroundColor Yellow
        Write-Host "  2. Repository doesn't exist (create it first)" -ForegroundColor Yellow
        Write-Host "  3. Network issues" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Try running: git push -u origin main" -ForegroundColor Cyan
    }
} else {
    Write-Host ""
    Write-Host "Please create the repository on GitHub first, then run:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Cyan

