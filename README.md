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

- **Dark Cinematic Theme** - Precise, technical aesthetic with #050505 background
- **Hero Section** - Full viewport height with dramatic background image and overlay
- **Gear Showcase** - Technical schematic-style cards displaying lighting equipment
- **Technical Specs Table** - Clean, monospace-styled data table with equipment specifications
- **Masonry Gallery** - Responsive image gallery showcasing featured productions

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
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── Hero.tsx            # Hero section component
│   ├── GearShowcase.tsx    # Equipment showcase component
│   ├── TechnicalSpecs.tsx  # Technical specifications table
│   └── Gallery.tsx         # Image gallery component
├── public/
│   └── images/             # Scraped image assets
└── package.json
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

