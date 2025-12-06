# Návod na nasazení webu

## 🚀 Nasazení na Vercel (doporučeno)

Vercel je nejjednodušší způsob, jak nasadit Next.js aplikaci. Je zdarma pro osobní projekty a automaticky nasazuje z GitHubu.

### Krok 1: Vytvořte účet na Vercel
1. Jděte na https://vercel.com
2. Přihlaste se pomocí GitHub účtu (stejný, který máte pro tento projekt)

### Krok 2: Importujte projekt
1. Po přihlášení klikněte na **"Add New..."** → **"Project"**
2. Vyberte repozitář `PetMatejda/balloon-light-prag`
3. Vercel automaticky detekuje Next.js a nastaví konfiguraci

### Krok 3: Konfigurace (obvykle není potřeba měnit)
- **Framework Preset**: Next.js (automaticky detekováno)
- **Root Directory**: `./` (nechat prázdné)
- **Build Command**: `npm run build` (automaticky)
- **Output Directory**: `.next` (automaticky)
- **Install Command**: `npm install` (automaticky)

### Krok 4: Deploy
1. Klikněte na **"Deploy"**
2. Vercel automaticky:
   - Nainstaluje závislosti
   - Spustí build
   - Nasadí web
3. Po dokončení dostanete URL ve formátu: `https://balloon-light-prag-xxxxx.vercel.app`

### Krok 5: Vlastní doména (volitelné)
1. V projektu na Vercel jděte do **Settings** → **Domains**
2. Přidejte svou doménu (např. `www.balloonlightprag.cz`)
3. Postupujte podle instrukcí pro nastavení DNS záznamů

### Automatické nasazení
- Každý push do `main` branch automaticky nasadí novou verzi
- Vercel vytvoří preview URL pro každý Pull Request

---

## 🌐 Alternativní možnosti nasazení

### Netlify
1. Jděte na https://netlify.com
2. Přihlaste se pomocí GitHub
3. Klikněte na **"Add new site"** → **"Import an existing project"**
4. Vyberte repozitář a nastavte:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

### Vlastní server (VPS)
1. SSH na server
2. Naklonujte repozitář: `git clone https://github.com/PetMatejda/balloon-light-prag.git`
3. Nainstalujte Node.js (verze 18+)
4. Spusťte:
   ```bash
   npm install
   npm run build
   npm start
   ```
5. Nastavte reverse proxy (nginx/Apache) pro port 3000

---

## 📝 Poznámky

- Web je staticky generovaný (SSG), takže je velmi rychlý
- Všechny jazykové verze jsou předvygenerované
- Obrázky jsou optimalizované Next.js Image komponentou
- SSL certifikát je automaticky poskytnut na Vercel/Netlify

---

## 🔗 Užitečné odkazy

- [Vercel dokumentace](https://vercel.com/docs)
- [Next.js deployment](https://nextjs.org/docs/deployment)
- [GitHub repozitář](https://github.com/PetMatejda/balloon-light-prag)

