@echo off
echo ========================================
echo Push to GitHub - Balloon Light Prag
echo ========================================
echo.

echo [1/5] Configuring remote...
git remote remove origin 2>nul
git remote add origin https://github.com/PetMatejda/balloon-light-prag.git
echo Remote configured: https://github.com/PetMatejda/balloon-light-prag.git
echo.

echo [2/5] Setting branch to main...
git branch -M main
echo.

echo [3/5] Adding all changes...
git add -A
echo.

echo [4/5] Creating commit...
git commit -m "Update: Rename Technika to Produkty and add German language support"
echo.

echo [5/5] Pushing to GitHub...
echo.
echo IMPORTANT: When prompted for credentials:
echo   Username: PetMatejda
echo   Password: Use Personal Access Token (NOT your GitHub password!)
echo.
echo If you need to create a token:
echo   1. Go to: https://github.com/settings/tokens
echo   2. Generate new token (classic)
echo   3. Select scope: repo
echo   4. Copy token and use it as password
echo.
pause
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Code pushed to GitHub!
    echo ========================================
    echo View your repository:
    echo https://github.com/PetMatejda/balloon-light-prag
) else (
    echo.
    echo ========================================
    echo Push failed. Possible reasons:
    echo   1. Repository doesn't exist on GitHub
    echo   2. Authentication failed
    echo   3. Network issues
    echo ========================================
    echo.
    echo If repository doesn't exist:
    echo   1. Go to: https://github.com/new
    echo   2. Name: balloon-light-prag
    echo   3. Don't check any boxes
    echo   4. Click Create repository
    echo   5. Run this script again
)

echo.
pause

