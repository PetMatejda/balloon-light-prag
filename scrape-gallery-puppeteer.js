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

// Create output directory if it doesn't exist
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
  
  // Filter out icons, logos, and small images
  if (lowerUrl.includes('icon') || lowerUrl.includes('favicon') || 
      lowerUrl.includes('logo') || lowerUrl.includes('sprite')) {
    if (!lowerUrl.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return false;
    }
  }
  
  // Include all image files
  return lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/);
}

async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const parsedUrl = parse(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, outputPath)
          .then(resolve)
          .catch(reject);
      }
      
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download: ${url} - Status: ${res.statusCode}`));
      }
      
      const fileStream = createWriteStream(outputPath);
      res.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(outputPath);
      });
      
      fileStream.on('error', reject);
    }).on('error', reject).on('timeout', () => {
      reject(new Error(`Timeout downloading: ${url}`));
    });
  });
}

function getFilenameFromUrl(url, index) {
  try {
    const parsed = parse(url);
    const pathname = parsed.pathname || '';
    let filename = pathname.split('/').pop() || `gallery_${index}`;
    
    // Remove query parameters
    filename = filename.split('?')[0];
    
    // Ensure filename has an extension
    if (!filename.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      filename = `gallery_${index}.jpg`;
    }
    
    // Sanitize filename
    filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    // Add prefix to avoid conflicts
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
  console.log(`Target URL: ${TARGET_URL}`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
  
  const logFile = join(__dirname, 'gallery-scrape-log.txt');
  
  // Initialize log file
  writeFileSync(logFile, `=== Gallery Scraping Started at ${new Date().toISOString()} ===\n\n`);
  
  const log = (msg) => {
    const timestamp = new Date().toISOString();
    const logMsg = `[${timestamp}] ${msg}\n`;
    console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
    try {
      writeFileSync(logFile, logMsg, { flag: 'a' });
    } catch (e) {
      console.error('Failed to write to log file:', e.message);
    }
  };
  
  log(`Scraping gallery images from: ${TARGET_URL}\n`);
  
  let browser;
  try {
    // Launch browser
    log('Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set much longer timeout for slow loading
    page.setDefaultNavigationTimeout(300000); // 5 minutes
    page.setDefaultTimeout(300000);
    
    // Navigate to gallery page with very long timeout
    log('Loading gallery page (this may take a while due to slow loading)...');
    try {
      await page.goto(TARGET_URL, { 
        waitUntil: 'domcontentloaded',
        timeout: 300000 
      });
    } catch (e) {
      log(`Navigation timeout, but continuing anyway: ${e.message}`);
    }
    
    log('Waiting for initial page load (20 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 20000)); // Much longer initial wait
    
    // Wait for network to be idle with multiple attempts
    log('Waiting for network to stabilize...');
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        await page.waitForLoadState?.('networkidle') || await new Promise(resolve => setTimeout(resolve, 10000));
        log(`Network idle check ${attempt + 1}/5`);
      } catch (e) {
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
    
    // Get initial page dimensions
    let previousHeight = 0;
    let currentHeight = await page.evaluate(() => document.body.scrollHeight);
    let stableCount = 0;
    
    // Scroll to trigger lazy loading - very thorough with smaller increments
    log('Scrolling page to load all images (this may take several minutes)...');
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    
    // Multiple scroll passes to ensure everything loads
    for (let pass = 0; pass < 3; pass++) {
      log(`\n=== Scroll Pass ${pass + 1}/3 ===`);
      
      // Get current page height (may have changed)
      currentHeight = await page.evaluate(() => document.body.scrollHeight);
      const scrollSteps = Math.ceil(currentHeight / (viewportHeight * 0.5)) + 5; // Smaller increments
      
      log(`Page height: ${currentHeight}px, Viewport: ${viewportHeight}px, Scroll steps: ${scrollSteps}`);
      
      // Scroll down very slowly with smaller increments
      for (let i = 0; i < scrollSteps; i++) {
        const scrollPosition = Math.min(i * viewportHeight * 0.5, currentHeight);
        await page.evaluate((pos) => {
          window.scrollTo({ top: pos, behavior: 'auto' });
        }, scrollPosition);
        
        // Wait longer for slow loading
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds per scroll step
        
        // Check if page height changed (new content loaded)
        const newHeight = await page.evaluate(() => document.body.scrollHeight);
        if (newHeight > currentHeight) {
          log(`Page height increased from ${currentHeight}px to ${newHeight}px - more content loaded!`);
          currentHeight = newHeight;
        }
      }
      
      // Scroll to absolute bottom
      await page.evaluate(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
      });
      log('Scrolled to bottom, waiting 15 seconds for images to load...');
      await new Promise(resolve => setTimeout(resolve, 15000));
      
      // Check if height is stable
      const finalHeight = await page.evaluate(() => document.body.scrollHeight);
      if (finalHeight === previousHeight) {
        stableCount++;
        log(`Page height stable (${stableCount}/3)`);
      } else {
        stableCount = 0;
        log(`Page height changed: ${previousHeight}px -> ${finalHeight}px`);
      }
      previousHeight = finalHeight;
      
      // Scroll back to top slowly
      log('Scrolling back to top...');
      for (let i = scrollSteps; i >= 0; i--) {
        const scrollPosition = Math.max(i * viewportHeight * 0.5, 0);
        await page.evaluate((pos) => {
          window.scrollTo({ top: pos, behavior: 'auto' });
        }, scrollPosition);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Final wait between passes
      log('Waiting 10 seconds before next pass...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    
    // Final comprehensive scroll
    log('\n=== Final comprehensive scroll ===');
    currentHeight = await page.evaluate(() => document.body.scrollHeight);
    const finalScrollSteps = Math.ceil(currentHeight / (viewportHeight * 0.3)) + 10;
    
    for (let i = 0; i < finalScrollSteps; i++) {
      const scrollPosition = Math.min(i * viewportHeight * 0.3, currentHeight);
      await page.evaluate((pos) => {
        window.scrollTo({ top: pos, behavior: 'auto' });
      }, scrollPosition);
      await new Promise(resolve => setTimeout(resolve, 4000));
    }
    
    // Final wait at bottom
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
    });
    log('Final wait at bottom (20 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 20000));
    
    // Try to click on any expand/collapse buttons or load more buttons
    try {
      log('Looking for load more buttons...');
      const loadMoreButtons = await page.$$('button, a, [class*="load"], [class*="more"], [class*="expand"], [id*="load"], [id*="more"], [class*="show"], [class*="view"]');
      log(`Found ${loadMoreButtons.length} potential buttons`);
      for (const button of loadMoreButtons) {
        try {
          const text = await page.evaluate(el => el.textContent?.toLowerCase() || '', button);
          const className = await page.evaluate(el => el.className?.toLowerCase() || '', button);
          if (text.includes('load') || text.includes('more') || text.includes('zobrazit') || 
              text.includes('více') || text.includes('show') || text.includes('view') ||
              className.includes('load') || className.includes('more') || className.includes('expand')) {
            log(`Clicking button with text: ${text}`);
            await button.click();
            await new Promise(resolve => setTimeout(resolve, 5000));
            // Scroll again after clicking
            await page.evaluate(() => {
              window.scrollTo(0, document.body.scrollHeight);
            });
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        } catch (e) {
          // Ignore click errors
        }
      }
    } catch (e) {
      // Ignore if no buttons found
    }
    
    // Extract all image URLs from the page - very thorough extraction
    log('Extracting image URLs (comprehensive scan)...');
    const imageUrls = await page.evaluate(() => {
      const images = new Set();
      
      // Get all img tags with various attributes - check all possible sources
      document.querySelectorAll('img').forEach(img => {
        // Check multiple possible attributes
        const sources = [
          img.src,
          img.getAttribute('src'),
          img.getAttribute('data-src'),
          img.getAttribute('data-lazy-src'),
          img.getAttribute('data-original'),
          img.getAttribute('data-lazy'),
          img.getAttribute('data-url'),
          img.getAttribute('data-image'),
          img.getAttribute('data-full'),
          img.getAttribute('data-large'),
          img.getAttribute('data-medium'),
          img.getAttribute('data-srcset')?.split(',')[0]?.trim().split(' ')[0],
          img.getAttribute('srcset')?.split(',')[0]?.trim().split(' ')[0],
          img.getAttribute('data-lazy-srcset')?.split(',')[0]?.trim().split(' ')[0],
        ];
        
        sources.forEach(src => {
          if (src && typeof src === 'string' && !src.startsWith('data:') && src.length > 10) {
            // Try to get full resolution version if it's a thumbnail
            let fullSrc = src;
            if (src.includes('thumb') || src.includes('thumbnail') || src.includes('small')) {
              fullSrc = src.replace(/thumb(?:nail)?/gi, '').replace(/small/gi, 'large');
            }
            images.add(fullSrc);
            images.add(src); // Also keep original
          }
        });
      });
      
      // Get background images from style attributes
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
      
      // Get background images from computed styles
      document.querySelectorAll('*').forEach(el => {
        try {
          const bgImage = window.getComputedStyle(el).backgroundImage;
          if (bgImage && bgImage !== 'none' && bgImage !== 'initial') {
            const matches = bgImage.match(/url\(["']?([^"')]+)["']?\)/g);
            if (matches) {
              matches.forEach(match => {
                const urlMatch = match.match(/url\(["']?([^"')]+)["']?\)/);
                if (urlMatch && !urlMatch[1].startsWith('data:')) {
                  images.add(urlMatch[1]);
                }
              });
            }
          }
        } catch (e) {
          // Ignore errors
        }
      });
      
      // Get images from picture elements
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
        const src = source.getAttribute('src') || source.getAttribute('data-src');
        if (src && !src.startsWith('data:') && src.length > 10) {
          images.add(src);
        }
      });
      
      // Get images from links that might be gallery images
      document.querySelectorAll('a[href*=".jpg"], a[href*=".jpeg"], a[href*=".png"], a[href*=".webp"], a[href*=".gif"]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('data:') && href.length > 10) {
          images.add(href);
        }
      });
      
      // Get images from data attributes
      document.querySelectorAll('[data-image], [data-img], [data-photo], [data-picture]').forEach(el => {
        const dataImage = el.getAttribute('data-image') || 
                        el.getAttribute('data-img') || 
                        el.getAttribute('data-photo') ||
                        el.getAttribute('data-picture');
        if (dataImage && !dataImage.startsWith('data:') && dataImage.length > 10) {
          images.add(dataImage);
        }
      });
      
      // Get images from gallery-specific selectors
      document.querySelectorAll('[class*="gallery"] img, [id*="gallery"] img, [class*="photo"] img, [class*="image"] img').forEach(img => {
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        if (src && !src.startsWith('data:') && src.length > 10) {
          images.add(src);
        }
      });
      
      return Array.from(images);
    });
    
    log(`Found ${imageUrls.length} images on the page.`);
    
    // Filter and normalize URLs
    const validImages = [];
    const seenUrls = new Set();
    
    imageUrls.forEach(url => {
      const normalized = normalizeUrl(url, TARGET_URL);
      if (normalized && isValidImageUrl(normalized) && !seenUrls.has(normalized)) {
        // Filter out icons, logos, and very small images, but be more lenient
        const lowerUrl = normalized.toLowerCase();
        const isIcon = lowerUrl.includes('icon') && (lowerUrl.includes('16x16') || lowerUrl.includes('32x32') || lowerUrl.includes('favicon'));
        const isLogo = lowerUrl.includes('logo') && (lowerUrl.includes('header') || lowerUrl.includes('nav'));
        const isSprite = lowerUrl.includes('sprite');
        
        if (!isIcon && !isLogo && !isSprite) {
          validImages.push(normalized);
          seenUrls.add(normalized);
        }
      }
    });
    
    // Sort by URL to get consistent ordering
    validImages.sort();
    
    log(`Found ${validImages.length} valid image URLs.`);
    if (validImages.length > 0) {
      log('Sample URLs:');
      validImages.slice(0, 10).forEach((url, i) => log(`  ${i + 1}. ${url}`));
    }
    log('');
    
    // Download each image
    log('Downloading images...\n');
    let successCount = 0;
    let failCount = 0;
    const downloadedFiles = [];
    
    for (let i = 0; i < validImages.length; i++) {
      const url = validImages[i];
      const filename = getFilenameFromUrl(url, i + 1);
      const outputPath = join(OUTPUT_DIR, filename);
      
      // Skip if file already exists
      if (existsSync(outputPath)) {
        log(`[${i + 1}/${validImages.length}] Skipped (exists): ${filename}`);
        downloadedFiles.push(`/images/${filename}`);
        successCount++;
        continue;
      }
      
      try {
        await downloadImage(url, outputPath);
        log(`[${i + 1}/${validImages.length}] Downloaded: ${filename}`);
        downloadedFiles.push(`/images/${filename}`);
        successCount++;
        
        // Small delay to be polite
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        log(`[ERROR] [${i + 1}/${validImages.length}] Failed: ${filename} - ${error.message}`);
        failCount++;
      }
    }
    
    log(`\n=== Summary ===`);
    log(`Total images found: ${validImages.length}`);
    log(`Successfully downloaded: ${successCount}`);
    log(`Failed: ${failCount}`);
    log(`\nImages saved to: ${OUTPUT_DIR}`);
    
    // Save list of downloaded files
    if (downloadedFiles.length > 0) {
      writeFileSync(
        join(__dirname, 'downloaded-gallery-images.json'),
        JSON.stringify(downloadedFiles, null, 2)
      );
      log(`\nSaved list of downloaded images to: downloaded-gallery-images.json`);
      log(`\nFiles to add to Gallery.tsx:`);
      downloadedFiles.forEach(file => log(`  '${file}',`));
    }
    
    await browser.close();
    log('\n=== Scraping completed successfully ===\n');
    
  } catch (error) {
    const errorMsg = `[ERROR] ${error.message}\n${error.stack}\n`;
    console.error('Error:', error.message);
    console.error(error.stack);
    try {
      writeFileSync(logFile, errorMsg, { flag: 'a' });
    } catch (e) {
      // Ignore
    }
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

main();
