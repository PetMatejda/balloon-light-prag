# GitHub Setup Script
Write-Host "=== GitHub Setup for Balloon Light Prag ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git repository already initialized" -ForegroundColor Green
}

Write-Host ""

# Step 2: Configure git user (if not set)
$userName = git config --get user.name
$userEmail = git config --get user.email

if (-not $userName) {
    Write-Host "⚠️  Git user name not configured" -ForegroundColor Yellow
    $inputName = Read-Host "Enter your name (for git commits)"
    if ($inputName) {
        git config user.name $inputName
        Write-Host "✓ User name configured" -ForegroundColor Green
    }
}

if (-not $userEmail) {
    Write-Host "⚠️  Git user email not configured" -ForegroundColor Yellow
    $inputEmail = Read-Host "Enter your email (for git commits)"
    if ($inputEmail) {
        git config user.email $inputEmail
        Write-Host "✓ User email configured" -ForegroundColor Green
    }
}

Write-Host ""

# Step 3: Check remote
$remote = git remote get-url origin 2>$null
if ($remote) {
    Write-Host "✓ Remote already configured: $remote" -ForegroundColor Green
    Write-Host ""
    Write-Host "To push changes, run:" -ForegroundColor Cyan
    Write-Host "  git add -A" -ForegroundColor White
    Write-Host "  git commit -m 'Your commit message'" -ForegroundColor White
    Write-Host "  git push -u origin main" -ForegroundColor White
} else {
    Write-Host "⚠️  No GitHub remote configured" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To configure GitHub remote, you need:" -ForegroundColor Cyan
    Write-Host "1. GitHub username" -ForegroundColor White
    Write-Host "2. Repository name (or create new one)" -ForegroundColor White
    Write-Host "3. Authentication method (Personal Access Token or SSH)" -ForegroundColor White
    Write-Host ""
    
    $setupRemote = Read-Host "Do you want to configure remote now? (y/n)"
    if ($setupRemote -eq "y" -or $setupRemote -eq "Y") {
        $githubUser = Read-Host "Enter your GitHub username"
        $repoName = Read-Host "Enter repository name (or press Enter for 'balloon-light-prag')"
        if (-not $repoName) {
            $repoName = "balloon-light-prag"
        }
        
        Write-Host ""
        Write-Host "Choose authentication method:" -ForegroundColor Cyan
        Write-Host "1. HTTPS (requires Personal Access Token)" -ForegroundColor White
        Write-Host "2. SSH (requires SSH key setup)" -ForegroundColor White
        $authMethod = Read-Host "Enter choice (1 or 2)"
        
        if ($authMethod -eq "1") {
            $remoteUrl = "https://github.com/$githubUser/$repoName.git"
            git remote add origin $remoteUrl
            Write-Host "✓ Remote added: $remoteUrl" -ForegroundColor Green
            Write-Host ""
            Write-Host "⚠️  IMPORTANT: When pushing, you'll need a Personal Access Token" -ForegroundColor Yellow
            Write-Host "   Create one at: https://github.com/settings/tokens" -ForegroundColor Yellow
            Write-Host "   Use the token as password when prompted" -ForegroundColor Yellow
        } elseif ($authMethod -eq "2") {
            $remoteUrl = "git@github.com:$githubUser/$repoName.git"
            git remote add origin $remoteUrl
            Write-Host "✓ Remote added: $remoteUrl" -ForegroundColor Green
            Write-Host ""
            Write-Host "⚠️  Make sure your SSH key is added to GitHub" -ForegroundColor Yellow
            Write-Host "   Check: https://github.com/settings/keys" -ForegroundColor Yellow
        }
        
        # Set main branch
        git branch -M main 2>$null
        
        Write-Host ""
        Write-Host "✓ Setup complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Make sure the repository exists on GitHub" -ForegroundColor White
        Write-Host "2. Run: git add -A" -ForegroundColor White
        Write-Host "3. Run: git commit -m 'Initial commit'" -ForegroundColor White
        Write-Host "4. Run: git push -u origin main" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "=== Current Status ===" -ForegroundColor Cyan
git status --short

