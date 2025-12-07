# Instrukce pro pushnutí na GitHub

## ✅ Nakonfigurováno:
- **GitHub Username**: PetMatejda
- **Repository**: balloon-light-prag
- **Remote URL**: https://github.com/PetMatejda/balloon-light-prag.git

## 📋 Postup pro pushnutí:

### 1. Zkontrolujte, zda repository existuje na GitHubu
Otevřete: https://github.com/PetMatejda/balloon-light-prag

Pokud repository **NEEXISTUJE**, vytvořte ho:
1. Jděte na: https://github.com/new
2. Repository name: `balloon-light-prag`
3. **NEMARKUJTE** žádné checkboxy (README, .gitignore, licence)
4. Klikněte "Create repository"

### 2. Spusťte tyto příkazy v terminálu:

```bash
# Zkontrolujte remote
git remote -v

# Pokud není správně nastaveno:
git remote set-url origin https://github.com/PetMatejda/balloon-light-prag.git

# Nastavte branch na main
git branch -M main

# Přidejte všechny změny
git add -A

# Vytvořte commit
git commit -m "Update: Rename Technika to Produkty and add German language support"

# Pushněte na GitHub
git push -u origin main
```

### 3. Autentizace

Při pushnutí budete požádáni o přihlášení:
- **Username**: `PetMatejda`
- **Password**: Použijte **Personal Access Token** (ne vaše GitHub heslo!)

#### Jak vytvořit Personal Access Token:
1. Jděte na: https://github.com/settings/tokens
2. Klikněte "Generate new token" → "Generate new token (classic)"
3. Název: `balloon-light-prag-push`
4. Vyberte scope: `repo` (plný přístup k repository)
5. Klikněte "Generate token"
6. **Zkopírujte token** (zobrazí se jen jednou!)
7. Použijte ho jako heslo při pushnutí

### 4. Alternativa: Použijte GitHub CLI

Pokud máte nainstalovaný GitHub CLI:
```bash
gh auth login
gh repo create PetMatejda/balloon-light-prag --public --source=. --remote=origin --push
```

## ✅ Po úspěšném pushnutí:

Váš kód bude dostupný na:
**https://github.com/PetMatejda/balloon-light-prag**

## 🔍 Zkontrolujte stav:

```bash
git status
git log --oneline -1
git remote -v
```

