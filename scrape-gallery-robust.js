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

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created directory: ${OUTPUT_DIR}`);
}

function normalizeUrl(url, baseUrl) {
  if (!url || url.startsWith('data:')) return null;
  
  if (url.startsWith('//')) {
    return 'https:' + url;
  } else if (url.startsWith('/')) {
    return new URL(url, baseUrl).href;
  } else if (!url.startsWith('http')) {
    return new URL(url, baseUrl).href;
  }
  
  return url;
}

function isValidImageUrl(url) {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return lowerUrl.match(/\.(jpg|jpeg|png|gif|webp)$/);
}

async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const parsedUrl = parse(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const request = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 60000
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, outputPath)
          .then(resolve)
          .catch(reject);
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

function getFilenameFromUrl(url, index) {
  try {
    const parsed = parse(url);
    const pathname = parsed.pathname || '';
    let filename = pathname.split('/').pop() || `gallery_${index}`;
    filename = filename.split('?')[0];
    
    if (!filename.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      filename = `gallery_${index}.jpg`;
    }
    
    filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    if (!filename.startsWith('gallery_')) {
      filename = `gallery_${filename}`;
    }
    
    return filename;
  } catch (e) {
    return `gallery_${index}_${Date.now()}.jpg`;
  }
}

async function main() {
  console.log('=== Starting Gallery Scraper ===');
  console.log(`Target: ${TARGET_URL}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);
  
  const logFile = join(__dirname, 'gallery-scrape-log.txt');
  writeFileSync(logFile, `=== Gallery Scraping Started at ${new Date().toISOString()} ===\n\n`);
  
  const log = (msg) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMsg = `[${timestamp}] ${msg}\n`;
    console.log(`[${timestamp}] ${msg}`);
    writeFileSync(logFile, logMsg, { flag: 'a' });
  };
  
  let browser;
  try {
    log('Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    page.setDefaultNavigationTimeout(300000);
    page.setDefaultTimeout(300000);
    
    log('Navigating to gallery page...');
    try {
      await page.goto(TARGET_URL, { 
        waitUntil: 'domcontentloaded',
        timeout: 300000 
      });
      log('Page loaded (domcontentloaded)');
    } catch (e) {
      log(`Navigation warning: ${e.message}`);
    }
    
    log('Waiting 20 seconds for initial load...');
    await new Promise(resolve => setTimeout(resolve, 20000));
    
    // Get page dimensions
    let previousHeight = 0;
    let currentHeight = await page.evaluate(() => document.body.scrollHeight);
    log(`Initial page height: ${currentHeight}px`);
    
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    
    // Multiple scroll passes
    for (let pass = 0; pass < 3; pass++) {
      log(`\n=== Scroll Pass ${pass + 1}/3 ===`);
      
      currentHeight = await page.evaluate(() => document.body.scrollHeight);
      const scrollSteps = Math.ceil(currentHeight / (viewportHeight * 0.4)) + 5;
      log(`Page height: ${currentHeight}px, Steps: ${scrollSteps}`);
      
      // Scroll down
      for (let i = 0; i < scrollSteps; i++) {
        const pos = Math.min(i * viewportHeight * 0.4, currentHeight);
        await page.evaluate((p) => window.scrollTo({ top: p, behavior: 'auto' }), pos);
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        const newHeight = await page.evaluate(() => document.body.scrollHeight);
        if (newHeight > currentHeight) {
          log(`Height increased: ${currentHeight}px -> ${newHeight}px`);
          currentHeight = newHeight;
        }
      }
      
      // Bottom wait
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' }));
      log('At bottom, waiting 15 seconds...');
      await new Promise(resolve => setTimeout(resolve, 15000));
      
      const finalHeight = await page.evaluate(() => document.body.scrollHeight);
      if (finalHeight === previousHeight) {
        log('Page height stable');
      } else {
        log(`Height changed: ${previousHeight}px -> ${finalHeight}px`);
      }
      previousHeight = finalHeight;
      
      // Scroll to top
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'auto' }));
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    // Final scroll
    log('\n=== Final Scroll ===');
    currentHeight = await page.evaluate(() => document.body.scrollHeight);
    const finalSteps = Math.ceil(currentHeight / (viewportHeight * 0.3)) + 10;
    
    for (let i = 0; i < finalSteps; i++) {
      const pos = Math.min(i * viewportHeight * 0.3, currentHeight);
      await page.evaluate((p) => window.scrollTo({ top: p, behavior: 'auto' }), pos);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' }));
    log('Final wait at bottom (20 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 20000));
    
    // Extract images
    log('\n=== Extracting Images ===');
    const imageUrls = await page.evaluate(() => {
      const images = new Set();
      
      // All img tags
      document.querySelectorAll('img').forEach(img => {
        const sources = [
          img.src,
          img.getAttribute('src'),
          img.getAttribute('data-src'),
          img.getAttribute('data-lazy-src'),
          img.getAttribute('data-original'),
          img.getAttribute('data-lazy'),
          img.getAttribute('data-url'),
          img.getAttribute('data-image'),
        ];
        
        sources.forEach(src => {
          if (src && typeof src === 'string' && !src.startsWith('data:') && src.length > 10) {
            images.add(src);
          }
        });
      });
      
      // Background images
      document.querySelectorAll('[style*="background"], [style*="url("]').forEach(el => {
        const style = el.getAttribute('style');
        if (style) {
          const matches = style.match(/url\(["']?([^"')]+)["']?\)/g);
          if (matches) {
            matches.forEach(match => {
              const urlMatch = match.match(/url\(["']?([^"')]+)["']?\)/);
              if (urlMatch && !urlMatch[1].startsWith('data:')) {
                images.add(urlMatch[1]);
              }
            });
          }
        }
      });
      
      // Picture elements
      document.querySelectorAll('picture source, source[srcset]').forEach(source => {
        const srcset = source.getAttribute('srcset') || source.getAttribute('data-srcset');
        if (srcset) {
          srcset.split(',').forEach(src => {
            const url = src.trim().split(' ')[0];
            if (url && !url.startsWith('data:') && url.length > 10) {
              images.add(url);
            }
          });
        }
      });
      
      // Links to images
      document.querySelectorAll('a[href*=".jpg"], a[href*=".jpeg"], a[href*=".png"], a[href*=".webp"]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('data:') && href.length > 10) {
          images.add(href);
        }
      });
      
      return Array.from(images);
    });
    
    log(`Found ${imageUrls.length} image URLs`);
    
    // Filter and normalize
    const validImages = [];
    const seenUrls = new Set();
    
    imageUrls.forEach(url => {
      const normalized = normalizeUrl(url, TARGET_URL);
      if (normalized && isValidImageUrl(normalized) && !seenUrls.has(normalized)) {
        const lowerUrl = normalized.toLowerCase();
        const isIcon = lowerUrl.includes('icon') && (lowerUrl.includes('16x16') || lowerUrl.includes('32x32') || lowerUrl.includes('favicon'));
        const isLogo = lowerUrl.includes('logo') && (lowerUrl.includes('header') || lowerUrl.includes('nav'));
        
        if (!isIcon && !isLogo) {
          validImages.push(normalized);
          seenUrls.add(normalized);
        }
      }
    });
    
    validImages.sort();
    log(`Found ${validImages.length} valid gallery images`);
    
    if (validImages.length > 0) {
      log('Sample URLs:');
      validImages.slice(0, 5).forEach((url, i) => log(`  ${i + 1}. ${url.substring(0, 80)}...`));
    }
    
    // Download images
    log('\n=== Downloading Images ===');
    let successCount = 0;
    let failCount = 0;
    const downloadedFiles = [];
    
    for (let i = 0; i < validImages.length; i++) {
      const url = validImages[i];
      const filename = getFilenameFromUrl(url, i + 1);
      const outputPath = join(OUTPUT_DIR, filename);
      
      if (existsSync(outputPath)) {
        log(`[${i + 1}/${validImages.length}] Skipped (exists): ${filename}`);
        downloadedFiles.push(`/images/${filename}`);
        successCount++;
        continue;
      }
      
      try {
        await downloadImage(url, outputPath);
        log(`[${i + 1}/${validImages.length}] ✓ ${filename}`);
        downloadedFiles.push(`/images/${filename}`);
        successCount++;
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        log(`[${i + 1}/${validImages.length}] ✗ ${filename} - ${error.message}`);
        failCount++;
      }
    }
    
    log(`\n=== Summary ===`);
    log(`Total found: ${validImages.length}`);
    log(`Downloaded: ${successCount}`);
    log(`Failed: ${failCount}`);
    
    // Save JSON
    if (downloadedFiles.length > 0) {
      writeFileSync(
        join(__dirname, 'downloaded-gallery-images.json'),
        JSON.stringify(downloadedFiles, null, 2)
      );
      log(`\nSaved ${downloadedFiles.length} image paths to downloaded-gallery-images.json`);
    }
    
    await browser.close();
    log('\n=== Completed Successfully ===\n');
    
  } catch (error) {
    log(`\n[ERROR] ${error.message}`);
    log(error.stack);
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

main();
