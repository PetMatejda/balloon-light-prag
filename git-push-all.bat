@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================
echo PUSH CHANGES TO GITHUB
echo ============================================
echo.

echo [1/6] Checking current status...
git status
echo.

echo [2/6] Adding all changes...
git add -A
if %errorlevel% neq 0 (
    echo ERROR: Failed to add files!
    pause
    exit /b 1
)
echo OK: Files added
echo.

echo [3/6] Creating commit...
git commit -m "Improve website clarity based on audit: translations, copy improvements, meta descriptions for all languages"
if %errorlevel% neq 0 (
    echo WARNING: Commit might have failed or nothing to commit
)
echo.

echo [4/6] Setting remote URL...
git remote set-url origin https://github.com/PetMatejda/balloon-light-prag.git
echo OK: Remote URL set
echo.

echo [5/6] Setting branch to main...
git branch -M main
echo OK: Branch set to main
echo.

echo [6/6] Pushing to GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Push failed!
    echo.
    echo Possible reasons:
    echo - Authentication required (use Personal Access Token)
    echo - Network connection issue
    echo - Repository doesn't exist on GitHub
    echo.
    echo Please check and try again.
    pause
    exit /b 1
)
echo.

echo ============================================
echo SUCCESS! Changes pushed to GitHub
echo ============================================
echo.
echo Repository: https://github.com/PetMatejda/balloon-light-prag
echo.
pause
