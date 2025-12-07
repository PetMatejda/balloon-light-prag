# Instrukce pro scraping produktů

## Co bylo provedeno

1. **Vytvořen důkladný scraping script** (`scrape-products-comprehensive.js`)
   - Prochází všechny produktové stránky a podstránky
   - Zohledňuje pomalé načítání stránky (dlouhé čekací doby, scrollování)
   - Stahuje všechny obrázky produktů
   - Extrahuje všechny texty, tabulky a informace

2. **Vytvořen processing script** (`process-and-update-products.js`)
   - Zpracuje stažená data
   - Extrahuje produktové informace z textů a tabulek

3. **Vytvořen update script** (`update-website-products.js`)
   - Aktualizuje translation files s novými produktovými informacemi

4. **Vytvořen progress check script** (`check-scraping-progress.js`)
   - Kontroluje průběh scrapingu

## Aktuální stav

Scraping script běží na pozadí. Vzhledem k pomalému načítání původní stránky může proces trvat 15-30 minut nebo déle, v závislosti na:
- Počtu produktových stránek
- Rychlosti načítání stránky
- Počtu obrázků ke stažení

## Jak zkontrolovat průběh

Spusťte:
```bash
node check-scraping-progress.js
```

Tento script zobrazí:
- Počet zpracovaných stránek
- Počet stažených obrázků
- Seznam dokončených stránek

## Co dělat po dokončení scrapingu

### Krok 1: Zkontrolujte, že scraping je dokončen
```bash
node check-scraping-progress.js
```

Měli byste vidět soubor `scraped-products-complete.json`.

### Krok 2: Zpracujte stažená data
```bash
node process-and-update-products.js
```

Tento script:
- Extrahuje produktové informace z textů a tabulek
- Vytvoří soubor `processed-products.json`

### Krok 3: Aktualizujte translation files
```bash
node update-website-products.js
```

Tento script aktualizuje všechny translation files (`cs.json`, `en.json`, atd.) s novými produktovými informacemi.

### Krok 4: Ruční aktualizace komponent

Po dokončení automatických aktualizací budete muset ručně:

1. **Aktualizovat `components/ProductShowcase.tsx`**
   - Přidat nové produkty z `processed-products.json`
   - Aktualizovat cesty k obrázkům (obrázky jsou v `public/images/products/`)

2. **Aktualizovat `components/GearShowcase.tsx`**
   - Přidat nové produkty
   - Aktualizovat obrázky

3. **Aktualizovat `components/TechnicalSpecs.tsx`**
   - Přidat nové technické specifikace z tabulek

4. **Zkontrolovat obrázky**
   - Obrázky jsou stažené do `public/images/products/`
   - Zkontrolujte, že všechny obrázky jsou správně načteny

## Struktura stažených dat

- `scraped-products-data/` - JSON soubory pro každou produktovou stránku
- `public/images/products/` - Všechny stažené obrázky produktů
- `scraped-products-complete.json` - Kompletní data všech produktů
- `processed-products.json` - Zpracovaná produktová data připravená pro web

## Poznámky

- Scraping script má dlouhé timeouty (3 minuty na stránku) kvůli pomalému načítání
- Script automaticky scrolluje stránky, aby načetl lazy-loaded obsah
- Obrázky se stahují s retry mechanismem (5 pokusů)
- Progress je ukládán do `scrape-progress-comprehensive.json` pro možnost pokračování při přerušení

## Řešení problémů

Pokud scraping selže:
1. Zkontrolujte, že máte nainstalovaný Puppeteer: `npm install puppeteer`
2. Zkontrolujte internetové připojení
3. Spusťte script znovu - pokračuje od posledního bodu díky progress souboru

Pokud některé obrázky nejsou stažené:
- Script má retry mechanismus
- Můžete spustit script znovu - přeskočí již stažené obrázky
