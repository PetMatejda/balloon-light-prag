import puppeteer from 'puppeteer';
import https from 'https';
import http from 'http';
import { createWriteStream, mkdirSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TARGET_URL = 'https://www.balloonlightprag.cz/gallery';
const OUTPUT_DIR = join(__dirname, 'public', 'images');

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

function normalizeUrl(url, baseUrl) {
  if (!url || url.startsWith('data:')) return null;
  if (url.startsWith('//')) return 'https:' + url;
  if (url.startsWith('/')) return new URL(url, baseUrl).href;
  if (!url.startsWith('http')) return new URL(url, baseUrl).href;
  return url;
}

function isValidImageUrl(url) {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('favicon') || lowerUrl.includes('icon') && lowerUrl.includes('16x16')) return false;
  return lowerUrl.match(/\.(jpg|jpeg|png|gif|webp)$/);
}

async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const request = client.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 60000
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, outputPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status: ${res.statusCode}`));
      }
      const fileStream = createWriteStream(outputPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(outputPath);
      });
      fileStream.on('error', reject);
    });
    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

function getFilename(url, index) {
  try {
    const parsed = parse(url);
    let filename = parsed.pathname?.split('/').pop() || `gallery_${index}`;
    filename = filename.split('?')[0];
    if (!filename.match(/\.(jpg|jpeg|png|gif|webp)$/i)) filename = `gallery_${index}.jpg`;
    filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    return filename.startsWith('gallery_') ? filename : `gallery_${filename}`;
  } catch (e) {
    return `gallery_${index}_${Date.now()}.jpg`;
  }
}

async function main() {
  const logFile = join(__dirname, 'gallery-scrape-log.txt');
  
  // Create log file immediately and write startup message
  try {
    const startMsg = `=== Started ${new Date().toISOString()} ===\nURL: ${TARGET_URL}\nOutput: ${OUTPUT_DIR}\n\n`;
    writeFileSync(logFile, startMsg);
    // Also write to console
    process.stdout.write(startMsg);
  } catch (e) {
    const errorMsg = `Failed to create log file: ${e.message}\n`;
    process.stderr.write(errorMsg);
  }
  
  const log = (msg) => {
    const ts = new Date().toLocaleTimeString();
    const logMsg = `[${ts}] ${msg}`;
    console.log(logMsg);
    try {
      writeFileSync(logFile, logMsg + '\n', { flag: 'a' });
    } catch (e) {
      console.error('Failed to write to log:', e.message);
    }
  };
  
  try {
    log('=== Gallery Scraper Starting ===');
    log(`URL: ${TARGET_URL}`);
    log(`Output: ${OUTPUT_DIR}`);
    
    let browser;
    log('Launching browser...');
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(180000);
    page.setDefaultTimeout(180000);
    
    log('Loading page...');
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 180000 });
    log('Page loaded, waiting 15 seconds...');
    await new Promise(r => setTimeout(r, 15000));
    
    log('Starting scroll passes...');
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    
    for (let pass = 0; pass < 2; pass++) {
      log(`Pass ${pass + 1}/2`);
      let height = await page.evaluate(() => document.body.scrollHeight);
      const steps = Math.ceil(height / (viewportHeight * 0.5)) + 3;
      
      for (let i = 0; i < steps; i++) {
        const pos = Math.min(i * viewportHeight * 0.5, height);
        await page.evaluate(p => window.scrollTo({ top: p }), pos);
        await new Promise(r => setTimeout(r, 3000));
        
        const newHeight = await page.evaluate(() => document.body.scrollHeight);
        if (newHeight > height) {
          log(`Height: ${height} -> ${newHeight}`);
          height = newHeight;
        }
      }
      
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight }));
      log('At bottom, waiting 10 seconds...');
      await new Promise(r => setTimeout(r, 10000));
    }
    
    log('Extracting images...');
    const imageUrls = await page.evaluate(() => {
      const images = new Set();
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        if (src && !src.startsWith('data:') && src.length > 10) images.add(src);
      });
      document.querySelectorAll('[style*="background"]').forEach(el => {
        const style = el.getAttribute('style');
        const match = style?.match(/url\(["']?([^"')]+)["']?\)/);
        if (match && !match[1].startsWith('data:')) images.add(match[1]);
      });
      return Array.from(images);
    });
    
    log(`Found ${imageUrls.length} image URLs`);
    
    const validImages = [];
    const seen = new Set();
    imageUrls.forEach(url => {
      const normalized = normalizeUrl(url, TARGET_URL);
      if (normalized && isValidImageUrl(normalized) && !seen.has(normalized)) {
        const lower = normalized.toLowerCase();
        if (!lower.includes('favicon') && !(lower.includes('icon') && lower.includes('16x16'))) {
          validImages.push(normalized);
          seen.add(normalized);
        }
      }
    });
    
    validImages.sort();
    log(`Valid images: ${validImages.length}`);
    
    log('Downloading...');
    const downloaded = [];
    let success = 0, fail = 0;
    
    for (let i = 0; i < validImages.length; i++) {
      const url = validImages[i];
      const filename = getFilename(url, i + 1);
      const path = join(OUTPUT_DIR, filename);
      
      if (existsSync(path)) {
        log(`[${i + 1}/${validImages.length}] Skip: ${filename}`);
        downloaded.push(`/images/${filename}`);
        success++;
        continue;
      }
      
      try {
        await downloadImage(url, path);
        log(`[${i + 1}/${validImages.length}] ✓ ${filename}`);
        downloaded.push(`/images/${filename}`);
        success++;
        await new Promise(r => setTimeout(r, 300));
      } catch (e) {
        log(`[${i + 1}/${validImages.length}] ✗ ${filename}: ${e.message}`);
        fail++;
      }
    }
    
    log(`\nDone! Success: ${success}, Failed: ${fail}`);
    
    if (downloaded.length > 0) {
      writeFileSync(
        join(__dirname, 'downloaded-gallery-images.json'),
        JSON.stringify(downloaded, null, 2)
      );
      log(`Saved ${downloaded.length} paths to JSON`);
    }
    
    await browser.close();
    log('Completed!');
    
  } catch (error) {
    const errorMsg = `ERROR: ${error.message}\n${error.stack || ''}`;
    log(errorMsg);
    console.error(errorMsg);
    try {
      writeFileSync(logFile, errorMsg + '\n', { flag: 'a' });
    } catch (e) {
      console.error('Failed to write error to log:', e.message);
    }
    if (typeof browser !== 'undefined' && browser) {
      try {
        await browser.close();
      } catch (e) {
        // Ignore
      }
    }
    process.exit(1);
  }
}

// Wrap in try-catch at top level
try {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
} catch (error) {
  console.error('Fatal error:', error);
  process.exit(1);
}