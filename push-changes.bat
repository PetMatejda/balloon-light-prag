@echo off
cd /d "c:\Users\petrm\OneDrive\Dokumenty\Coursor projects\balloon-light-prag"

echo ========================================
echo Checking Git Status
echo ========================================
git status

echo.
echo ========================================
echo Adding all changes
echo ========================================
git add -A

echo.
echo ========================================
echo Creating commit
echo ========================================
git commit -m "Improve website clarity based on audit: translations, copy improvements, meta descriptions for all languages"

echo.
echo ========================================
echo Setting remote URL
echo ========================================
git remote set-url origin https://github.com/PetMatejda/balloon-light-prag.git

echo.
echo ========================================
echo Setting branch to main
echo ========================================
git branch -M main

echo.
echo ========================================
echo Pushing to GitHub
echo ========================================
git push -u origin main

echo.
echo ========================================
echo Done! Check your repository at:
echo https://github.com/PetMatejda/balloon-light-prag
echo ========================================
pause
