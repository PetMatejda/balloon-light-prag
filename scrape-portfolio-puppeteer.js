import puppeteer from 'puppeteer';
import https from 'https';
import http from 'http';
import { createWriteStream, mkdirSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TARGET_URL = 'https://www.balloonlightprag.cz/portfolio';
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
      }
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
    }).on('error', reject);
  });
}

function getFilenameFromUrl(url, index) {
  try {
    const parsed = parse(url);
    const pathname = parsed.pathname || '';
    let filename = pathname.split('/').pop() || `portfolio_${index}`;
    
    // Ensure filename has an extension
    if (!filename.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      filename = `portfolio_${index}.jpg`;
    }
    
    // Sanitize filename
    filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    // Add prefix to avoid conflicts
    if (!filename.startsWith('portfolio_')) {
      filename = `portfolio_${filename}`;
    }
    
    return filename;
  } catch (e) {
    return `portfolio_${index}_${Date.now()}.jpg`;
  }
}

async function main() {
  console.log(`Scraping portfolio images from: ${TARGET_URL}\n`);
  
  let browser;
  try {
    // Launch browser
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Navigate to portfolio page
    console.log('Loading portfolio page...');
    await page.goto(TARGET_URL, { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
    
    console.log('Waiting for initial page load...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Wait for network to be idle
    try {
      await page.waitForLoadState?.('networkidle') || await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // Scroll to trigger lazy loading - scroll multiple times
    console.log('Scrolling page to load all images...');
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const scrollSteps = Math.ceil(scrollHeight / viewportHeight) + 2;
    
    for (let i = 0; i < scrollSteps; i++) {
      const scrollPosition = (i * viewportHeight);
      await page.evaluate((pos) => {
        window.scrollTo(0, pos);
      }, scrollPosition);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for images to load
    }
    
    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Scroll back to top slowly
    console.log('Scrolling back to top...');
    for (let i = scrollSteps; i >= 0; i--) {
      const scrollPosition = (i * viewportHeight);
      await page.evaluate((pos) => {
        window.scrollTo(0, pos);
      }, scrollPosition);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Final wait for any remaining images
    console.log('Final wait for all images to load...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Try to click on any expand/collapse buttons or load more buttons
    try {
      const loadMoreButtons = await page.$$('button, a, [class*="load"], [class*="more"], [class*="expand"], [id*="load"], [id*="more"]');
      for (const button of loadMoreButtons) {
        try {
          const text = await page.evaluate(el => el.textContent?.toLowerCase() || '', button);
          if (text.includes('load') || text.includes('more') || text.includes('zobrazit') || text.includes('více')) {
            await button.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (e) {
          // Ignore click errors
        }
      }
    } catch (e) {
      // Ignore if no buttons found
    }
    
    // Extract all image URLs from the page
    console.log('Extracting image URLs...');
    const imageUrls = await page.evaluate(() => {
      const images = new Set();
      
      // Get all img tags
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        if (src && !src.startsWith('data:')) {
          images.add(src);
        }
      });
      
      // Get background images from style attributes
      document.querySelectorAll('[style*="background"]').forEach(el => {
        const style = el.getAttribute('style');
        const match = style.match(/url\(["']?([^"')]+)["']?\)/);
        if (match && !match[1].startsWith('data:')) {
          images.add(match[1]);
        }
      });
      
      // Get background images from computed styles
      document.querySelectorAll('*').forEach(el => {
        const bgImage = window.getComputedStyle(el).backgroundImage;
        if (bgImage && bgImage !== 'none') {
          const match = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
          if (match && !match[1].startsWith('data:')) {
            images.add(match[1]);
          }
        }
      });
      
      return Array.from(images);
    });
    
    console.log(`Found ${imageUrls.length} images on the page.`);
    
    // Filter and normalize URLs
    const validImages = [];
    imageUrls.forEach(url => {
      const normalized = normalizeUrl(url, TARGET_URL);
      if (normalized && isValidImageUrl(normalized)) {
        validImages.push(normalized);
      }
    });
    
    console.log(`Found ${validImages.length} valid image URLs.`);
    if (validImages.length > 0) {
      console.log('Sample URLs:');
      validImages.slice(0, 10).forEach((url, i) => console.log(`  ${i + 1}. ${url}`));
    }
    console.log('');
    
    // Download each image
    console.log('Downloading images...\n');
    let successCount = 0;
    let failCount = 0;
    const downloadedFiles = [];
    
    for (let i = 0; i < validImages.length; i++) {
      const url = validImages[i];
      const filename = getFilenameFromUrl(url, i + 1);
      const outputPath = join(OUTPUT_DIR, filename);
      
      // Skip if file already exists
      if (existsSync(outputPath)) {
        console.log(`[${i + 1}/${validImages.length}] Skipped (exists): ${filename}`);
        downloadedFiles.push(`/images/${filename}`);
        successCount++;
        continue;
      }
      
      try {
        await downloadImage(url, outputPath);
        console.log(`[${i + 1}/${validImages.length}] Downloaded: ${filename}`);
        downloadedFiles.push(`/images/${filename}`);
        successCount++;
        
        // Small delay to be polite
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`[${i + 1}/${validImages.length}] Failed: ${filename} - ${error.message}`);
        failCount++;
      }
    }
    
    console.log(`\n=== Summary ===`);
    console.log(`Total images found: ${validImages.length}`);
    console.log(`Successfully downloaded: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`\nImages saved to: ${OUTPUT_DIR}`);
    
    // Save list of downloaded files
    if (downloadedFiles.length > 0) {
      writeFileSync(
        join(__dirname, 'downloaded-portfolio-images.json'),
        JSON.stringify(downloadedFiles, null, 2)
      );
      console.log(`\nSaved list of downloaded images to: downloaded-portfolio-images.json`);
      console.log(`\nFiles to add to FilmsContent.tsx:`);
      downloadedFiles.forEach(file => console.log(`  '${file}',`));
    }
    
    await browser.close();
    
  } catch (error) {
    console.error('Error:', error.message);
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

main();

