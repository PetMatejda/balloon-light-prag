# Nastavení automatických commitů na GitHub

## Automatické commity při změnách

Projekt je nastaven tak, aby automaticky prováděl commity a pushy na GitHub při jakýchkoli změnách.

## Jak to funguje

1. **Git Hook** (`.git/hooks/post-commit`): Po každém commitu se automaticky provede push na GitHub
2. **Automatické commity**: Při jakýchkoli změnách v projektu jsou změny automaticky commitovány a pushnuty

## Nastavení (pouze jednou)

Git hook se automaticky nastaví při prvním commitu. Pokud potřebujete hook nastavit ručně:

**Windows (PowerShell):**
```powershell
# Zkontrolujte, zda hook existuje
Test-Path .git\hooks\post-commit

# Pokud ne, vytvořte ho
@"
#!/bin/sh
git push origin main
"@ | Out-File -FilePath .git\hooks\post-commit -Encoding utf8
```

**Linux/Mac:**
```bash
# Zkontrolujte, zda hook existuje
ls -la .git/hooks/post-commit

# Pokud ne, vytvořte ho
cat > .git/hooks/post-commit << 'EOF'
#!/bin/sh
git push origin main
EOF

chmod +x .git/hooks/post-commit
```

## Použití

Od teď budou všechny změny automaticky commitovány a pushnuty na GitHub. Při jakýchkoli úpravách v projektu:

1. Změny se automaticky přidají do staging area
2. Provede se commit s automatickou zprávou
3. Provede se push na GitHub

## Ruční commity

Pokud chcete provést commit s vlastní zprávou, můžete použít:

**PowerShell:**
```powershell
.\auto-commit.ps1 "Vlastní zpráva commitu"
```

**Bash:**
```bash
./auto-commit.sh "Vlastní zpráva commitu"
```

## Poznámka

Git hooks nejsou součástí repozitáře (nejsou commitovány), takže každý vývojář si musí hook nastavit lokálně. Skripty `auto-commit.ps1` a `auto-commit.sh` jsou však součástí repozitáře a mohou být použity k ručním commitům.

