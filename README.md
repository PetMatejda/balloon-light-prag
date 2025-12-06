# Balloon Light Prag - High-End Film Lighting Website

A cinematic, high-end website for professional film lighting equipment, designed for Directors of Photography (DoPs) and Gaffers.

## Tech Stack

- **Next.js 16** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Lucide React** (icons)

## Features

- **Multilingual Support** - Czech (base), English, Hungarian, Spanish, Italian
- **Language Switcher** - Easy language switching in header
- **Dark Cinematic Theme** - Precise, technical aesthetic with #050505 background
- **Hero Section** - Full viewport height with dramatic background image and overlay
- **Product Showcase** - Technical schematic-style cards displaying lighting equipment
- **Technical Specs Table** - Clean, monospace-styled data table with equipment specifications
- **Masonry Gallery** - Responsive image gallery showcasing featured productions
- **Responsive Design** - Mobile-first approach with adaptive layouts

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Image Assets

All images have been scraped from the original website (balloonlightprag.cz) and stored in `/public/images`. The scraping was done using Puppeteer to handle the JavaScript-rendered React app.

To re-scrape images, run:
```bash
node scrape-images-puppeteer.js
```

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout
│   ├── [locale]/                # Locale-based routing
│   │   ├── layout.tsx           # Locale layout
│   │   ├── page.tsx             # Home page
│   │   ├── o-nas/               # About page
│   │   ├── produkty/            # Products page
│   │   ├── reference/            # References page
│   │   └── kontakt/             # Contact page
│   └── globals.css              # Global styles
├── components/
│   ├── Header.tsx               # Navigation header with language switcher
│   ├── Footer.tsx               # Footer component
│   ├── HeroNew.tsx              # Hero section
│   ├── ProductShowcase.tsx      # Product showcase
│   ├── TechnicalSpecs.tsx       # Technical specifications
│   ├── Gallery.tsx              # Image gallery
│   └── LanguageSwitcher.tsx    # Language selection dropdown
├── messages/                    # Translation files
│   ├── cs.json                  # Czech translations
│   ├── en.json                  # English translations
│   ├── hu.json                  # Hungarian translations
│   ├── es.json                  # Spanish translations
│   └── it.json                  # Italian translations
├── hooks/
│   └── useTranslations.ts       # Translation hook
├── lib/
│   └── translations.ts          # Translation utilities
├── middleware.ts                # Locale detection and routing
├── i18n-config.ts               # i18n configuration
└── public/
    └── images/                  # Image assets
```

## Design Philosophy

The website is designed with a "cinematic darkroom" aesthetic:
- **Typography**: Large sans-serif headlines for impact, monospace for technical specs
- **Color Palette**: Pure black (#050505) background with white/grey text
- **Style**: Technical, precise, like a high-end camera interface
- **Animations**: Subtle Framer Motion animations for smooth, professional feel

## Building for Production

```bash
npm run build
npm start
```

## Deployment

The site is ready to be deployed on Vercel, Netlify, or any platform that supports Next.js.

**Quick Deploy to Vercel:**
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project" and select this repository
3. Vercel will automatically detect Next.js and deploy
4. Your site will be live at `https://your-project.vercel.app`

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)


