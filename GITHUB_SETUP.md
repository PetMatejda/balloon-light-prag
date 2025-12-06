# Instrukce pro nahrání na GitHub

## 1. Vytvořte nový repository na GitHub

1. Přejděte na https://github.com/new
2. Vytvořte nový repository s názvem např. `balloon-light-prag`
3. NEZAČÍNEJTE s README, .gitignore nebo licencí (ty už máme v projektu)

## 2. Přidejte remote a pushněte

V terminálu v této složce spusťte:

```bash
# Přidejte GitHub repository jako remote (nahraďte YOUR_USERNAME vaším GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/balloon-light-prag.git

# Nebo pokud používáte SSH:
# git remote add origin git@github.com:YOUR_USERNAME/balloon-light-prag.git

# Pushněte na GitHub
git branch -M main
git push -u origin main
```

## 3. Alternativně můžete použít GitHub CLI

Pokud máte nainstalovaný GitHub CLI:

```bash
gh repo create balloon-light-prag --public --source=. --remote=origin --push
```

## Hotovo!

Váš projekt je nyní na GitHubu. 

**Poznámka:** Soubory v `/node_modules` a `.next` se automaticky ignorují díky `.gitignore`.

