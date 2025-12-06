# 🚀 Jak nahrát projekt na GitHub

## Krok 1: Vytvořte nový repository na GitHub

1. Otevřete https://github.com/new ve vašem prohlížeči
2. Zadejte název: `balloon-light-prag` (nebo jakýkoliv jiný)
3. **NEMARKUJTE** žádné checkboxy (README, .gitignore, licence)
4. Klikněte na "Create repository"

## Krok 2: Připojte lokální repozitář k GitHubu

Otevřete terminál ve složce `balloon-light-prag` a spusťte:

```bash
# Přidejte GitHub repository (nahraďte YOUR_USERNAME vaším GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/balloon-light-prag.git

# Změňte název větve na main (pokud ještě není)
git branch -M main

# Nahrajte projekt na GitHub
git push -u origin main
```

## Alternativa: Použití GitHub CLI

Pokud máte nainstalovaný GitHub CLI (`gh`):

```bash
gh repo create balloon-light-prag --public --source=. --remote=origin --push
```

Tento příkaz automaticky vytvoří repository a nahraje kód!

## ✅ Hotovo!

Váš projekt je nyní na GitHubu. Můžete ho sdílet nebo pokračovat ve vývoji.

---

**Poznámka:** Pokud budete požádáni o autentizaci, použijte GitHub Personal Access Token místo hesla.

