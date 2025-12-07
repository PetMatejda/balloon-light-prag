#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Script to push changes to GitHub"""

import subprocess
import sys
import os

def run_command(cmd, description):
    """Run a git command and display the output"""
    print(f"\n{'='*60}")
    print(f"{description}")
    print('='*60)
    
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=r"c:\Users\petrm\OneDrive\Dokumenty\Coursor projects\balloon-light-prag",
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        
        if result.stdout:
            print(result.stdout)
        if result.stderr:
            print(result.stderr, file=sys.stderr)
        
        return result.returncode == 0
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return False

def main():
    repo_path = r"c:\Users\petrm\OneDrive\Dokumenty\Coursor projects\balloon-light-prag"
    
    if not os.path.exists(repo_path):
        print(f"Error: Repository path not found: {repo_path}")
        return 1
    
    print("\n" + "="*60)
    print("PUSHING CHANGES TO GITHUB")
    print("="*60)
    
    # Change to repository directory
    os.chdir(repo_path)
    
    # Check status
    if not run_command("git status", "Step 1: Checking status"):
        return 1
    
    # Add all changes
    if not run_command("git add -A", "Step 2: Adding all changes"):
        return 1
    
    # Create commit
    commit_message = """Improve website clarity based on audit: translations, copy improvements, meta descriptions for all languages

- Počeštění anglických termínů (Shadowless -> Světlo bez stínů, etc.)
- Opraveny gramatické neshody v popisech produktů
- Doplněna chybějící data u SUNCUT balónů
- Sjednoceno názvosloví (Filmy -> Reference)
- Vylepšeno copy v sekci O nás (konkrétní údaje)
- Vylepšena CTA tlačítka (Nezávazně poptat)
- Přidány meta popisy pro všechny podstránky
- Klikatelná adresa pro Google Maps
- Všechny změny aplikovány na všechny jazyky: CS, EN, DE, ES, HU, IT"""
    
    if not run_command(f'git commit -m "{commit_message}"', "Step 3: Creating commit"):
        print("Warning: Commit might have failed or nothing to commit")
    
    # Set remote
    if not run_command("git remote set-url origin https://github.com/PetMatejda/balloon-light-prag.git", "Step 4: Setting remote URL"):
        return 1
    
    # Set branch
    if not run_command("git branch -M main", "Step 5: Setting branch to main"):
        return 1
    
    # Push
    if not run_command("git push -u origin main", "Step 6: Pushing to GitHub"):
        print("\n" + "!"*60)
        print("PUSH FAILED!")
        print("!"*60)
        print("\nPossible reasons:")
        print("- Authentication required (use Personal Access Token)")
        print("- Network connection issue")
        print("- Repository doesn't exist on GitHub")
        print("\nRepository URL: https://github.com/PetMatejda/balloon-light-prag")
        return 1
    
    print("\n" + "="*60)
    print("SUCCESS! Changes pushed to GitHub")
    print("="*60)
    print("\nRepository: https://github.com/PetMatejda/balloon-light-prag")
    return 0

if __name__ == "__main__":
    sys.exit(main())
