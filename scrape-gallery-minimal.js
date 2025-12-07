import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logFile = join(__dirname, 'gallery-scrape-log.txt');

// Write immediately on load
writeFileSync(logFile, `=== Script loaded at ${new Date().toISOString()} ===\n`);
writeFileSync(logFile, `Directory: ${__dirname}\n`, { flag: 'a' });
writeFileSync(logFile, `Log file: ${logFile}\n\n`, { flag: 'a' });

async function main() {
  try {
    writeFileSync(logFile, 'Starting main function...\n', { flag: 'a' });
    
    writeFileSync(logFile, 'Importing puppeteer...\n', { flag: 'a' });
    const puppeteer = await import('puppeteer');
    writeFileSync(logFile, 'Puppeteer imported!\n', { flag: 'a' });
    
    writeFileSync(logFile, 'Launching browser...\n', { flag: 'a' });
    const browser = await puppeteer.default.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    writeFileSync(logFile, 'Browser launched!\n', { flag: 'a' });
    
    const page = await browser.newPage();
    writeFileSync(logFile, 'Page created\n', { flag: 'a' });
    
    writeFileSync(logFile, 'Navigating to gallery (this may take a while)...\n', { flag: 'a' });
    await page.goto('https://www.balloonlightprag.cz/gallery', { 
      waitUntil: 'domcontentloaded',
      timeout: 120000 
    });
    writeFileSync(logFile, 'Page loaded!\n', { flag: 'a' });
    
    writeFileSync(logFile, 'Waiting 10 seconds for content to load...\n', { flag: 'a' });
    await new Promise(r => setTimeout(r, 10000));
    
    // Scroll to load images
    writeFileSync(logFile, 'Scrolling page...\n', { flag: 'a' });
    const height = await page.evaluate(() => document.body.scrollHeight);
    const viewport = await page.evaluate(() => window.innerHeight);
    const steps = Math.ceil(height / viewport) + 2;
    
    for (let i = 0; i < steps; i++) {
      await page.evaluate(p => window.scrollTo({ top: p }), i * viewport * 0.5);
      await new Promise(r => setTimeout(r, 3000));
    }
    
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight }));
    await new Promise(r => setTimeout(r, 10000));
    
    writeFileSync(logFile, 'Extracting images...\n', { flag: 'a' });
    const images = await page.evaluate(() => {
      const imgUrls = new Set();
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        if (src && !src.startsWith('data:') && src.length > 10) {
          imgUrls.add(src);
        }
      });
      return Array.from(imgUrls);
    });
    
    writeFileSync(logFile, `Found ${images.length} images\n`, { flag: 'a' });
    
    await browser.close();
    writeFileSync(logFile, 'Browser closed - Done!\n', { flag: 'a' });
    
  } catch (error) {
    const errorMsg = `\nERROR: ${error.message}\n${error.stack}\n`;
    writeFileSync(logFile, errorMsg, { flag: 'a' });
    process.exit(1);
  }
}

main();
