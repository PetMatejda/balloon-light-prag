import puppeteer from 'puppeteer';
import https from 'https';
import http from 'http';
import { createWriteStream, mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TARGET_URL = 'https://www.balloonlightprag.cz/products';
const OUTPUT_DIR = join(__dirname, 'public', 'images', 'products');
const DATA_DIR = join(__dirname, 'scraped-products-data');
const PROGRESS_FILE = join(__dirname, 'scrape-progress.json');

// Create output directories
[OUTPUT_DIR, DATA_DIR].forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Load progress if exists
let progress = { completedPages: [], downloadedImages: [] };
if (existsSync(PROGRESS_FILE)) {
  try {
    progress = JSON.parse(readFileSync(PROGRESS_FILE, 'utf8'));
    console.log(`Resuming from previous progress: ${progress.completedPages.length} pages completed`);
  } catch (e) {
    console.log('Starting fresh scrape');
  }
}

function saveProgress() {
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function normalizeUrl(url, baseUrl) {
  if (!url || url.startsWith('data:')) return null;
  try {
    if (url.startsWith('//')) {
      return 'https:' + url;
    } else if (url.startsWith('/')) {
      return new URL(url, baseUrl).href;
    } else if (!url.startsWith('http')) {
      return new URL(url, baseUrl).href;
    }
    return url;
  } catch (e) {
    return null;
  }
}

function isValidImageUrl(url) {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/);
}

async function downloadImage(url, outputPath, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await new Promise((resolve, reject) => {
        const parsedUrl = parse(url);
        const client = parsedUrl.protocol === 'https:' ? https : http;
        
        const request = client.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 30000
        }, (res) => {
          if (res.statusCode === 301 || res.statusCode === 302) {
            return downloadImage(res.headers.location, outputPath, retries)
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
    } catch (error) {
      if (attempt === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
}

function getFilenameFromUrl(url, index, prefix = 'product') {
  try {
    const parsed = parse(url);
    const pathname = parsed.pathname || '';
    let filename = pathname.split('/').pop() || `${prefix}_${index}`;
    
    if (!filename.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      filename = `${prefix}_${index}.jpg`;
    }
    
    filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    if (!filename.startsWith(prefix)) {
      filename = `${prefix}_${filename}`;
    }
    
    return filename;
  } catch (e) {
    return `${prefix}_${index}_${Date.now()}.jpg`;
  }
}

async function waitForPageLoad(page, waitTime = 8000) {
  await new Promise(resolve => setTimeout(resolve, waitTime));
  
  try {
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const scrollSteps = Math.min(Math.ceil(scrollHeight / viewportHeight) + 2, 10);
    
    for (let i = 0; i < scrollSteps; i++) {
      await page.evaluate((pos) => window.scrollTo(0, pos), i * viewportHeight);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(resolve => setTimeout(resolve, 3000));
  } catch (e) {
    console.log('Scroll error (continuing):', e.message);
  }
}

async function extractProductData(page, url) {
  console.log(`Extracting: ${url}`);
  
  try {
    await page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 120000 
    });
    
    await waitForPageLoad(page, 10000);
    
    const data = await page.evaluate(() => {
      // Remove unwanted elements
      const scripts = document.querySelectorAll('script, style, nav, header, footer');
      scripts.forEach(el => el.remove());
      
      // Extract text
      const main = document.querySelector('main') || document.querySelector('.content') || 
                   document.querySelector('article') || document.body;
      const textContent = main.innerText || main.textContent || '';
      
      // Extract tables
      const tables = [];
      document.querySelectorAll('table').forEach((table, index) => {
        const rows = [];
        table.querySelectorAll('tr').forEach(tr => {
          const cells = [];
          tr.querySelectorAll('td, th').forEach(cell => {
            cells.push(cell.innerText.trim());
          });
          if (cells.length > 0) rows.push(cells);
        });
        if (rows.length > 0) tables.push({ index, rows });
      });
      
      // Extract headings
      const headings = [];
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        headings.push({
          level: heading.tagName.toLowerCase(),
          text: heading.innerText.trim()
        });
      });
      
      // Extract paragraphs
      const paragraphs = [];
      document.querySelectorAll('p').forEach(p => {
        const text = p.innerText.trim();
        if (text.length > 20) paragraphs.push(text);
      });
      
      // Extract images
      const images = new Set();
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || img.getAttribute('data-src') || 
                   img.getAttribute('data-lazy-src') || img.getAttribute('data-original');
        if (src && !src.startsWith('data:')) images.add(src);
      });
      
      // Background images
      document.querySelectorAll('[style*="background"]').forEach(el => {
        const style = el.getAttribute('style');
        const match = style?.match(/url\(["']?([^"')]+)["']?\)/);
        if (match && !match[1].startsWith('data:')) images.add(match[1]);
      });
      
      return {
        textContent,
        tables,
        headings,
        paragraphs,
        imageUrls: Array.from(images)
      };
    });
    
    return { url, ...data, error: null };
    
  } catch (error) {
    console.error(`Error on ${url}:`, error.message);
    return {
      url,
      error: error.message,
      textContent: '',
      tables: [],
      headings: [],
      paragraphs: [],
      imageUrls: []
    };
  }
}

async function findProductLinks(page) {
  console.log('Finding product links...');
  
  try {
    await page.goto(TARGET_URL, { 
      waitUntil: 'domcontentloaded',
      timeout: 120000 
    });
    
    await waitForPageLoad(page, 10000);
    
    const links = await page.evaluate((baseUrl) => {
      const productLinks = new Set([baseUrl]);
      
      document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        let fullUrl;
        try {
          if (href.startsWith('http')) {
            fullUrl = href;
          } else {
            fullUrl = new URL(href, baseUrl).href;
          }
          
          if (fullUrl.includes('/products') || fullUrl.includes('/product') ||
              fullUrl.includes('/produkty') || fullUrl.includes('/produkt')) {
            productLinks.add(fullUrl);
          }
        } catch (e) {
          // Skip invalid URLs
        }
      });
      
      return Array.from(productLinks);
    }, TARGET_URL);
    
    console.log(`Found ${links.length} product pages`);
    return links;
    
  } catch (error) {
    console.error('Error finding links:', error.message);
    return [TARGET_URL]; // Fallback to main page
  }
}

async function main() {
  console.log(`\n=== Scraping Products ===`);
  console.log(`Target: ${TARGET_URL}\n`);
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 120000
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Find all product pages
    const productLinks = await findProductLinks(page);
    
    // Process each page
    const allProducts = [];
    const allImages = new Set();
    
    for (let i = 0; i < productLinks.length; i++) {
      const link = productLinks[i];
      
      if (progress.completedPages.includes(link)) {
        console.log(`[${i + 1}/${productLinks.length}] Skipping (already done): ${link}`);
        continue;
      }
      
      console.log(`[${i + 1}/${productLinks.length}] Processing: ${link}`);
      
      const productData = await extractProductData(page, link);
      
      productData.imageUrls.forEach(url => {
        const normalized = normalizeUrl(url, link);
        if (normalized && isValidImageUrl(normalized)) {
          allImages.add(normalized);
        }
      });
      
      allProducts.push(productData);
      progress.completedPages.push(link);
      saveProgress();
      
      // Save individual product
      const productFilename = link.split('/').pop() || `product_${i}`;
      writeFileSync(
        join(DATA_DIR, `${productFilename.replace(/[^a-zA-Z0-9]/g, '_')}.json`),
        JSON.stringify(productData, null, 2)
      );
      
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // Download images
    console.log(`\n=== Downloading ${allImages.size} Images ===\n`);
    
    const imageArray = Array.from(allImages);
    let successCount = 0;
    let failCount = 0;
    const imageMap = new Map();
    
    for (let i = 0; i < imageArray.length; i++) {
      const url = imageArray[i];
      const filename = getFilenameFromUrl(url, i + 1, 'product');
      const outputPath = join(OUTPUT_DIR, filename);
      
      if (progress.downloadedImages.includes(url) || existsSync(outputPath)) {
        console.log(`[${i + 1}/${imageArray.length}] Skipped: ${filename}`);
        imageMap.set(url, `/images/products/${filename}`);
        successCount++;
        continue;
      }
      
      try {
        await downloadImage(url, outputPath);
        console.log(`[${i + 1}/${imageArray.length}] ✓ ${filename}`);
        imageMap.set(url, `/images/products/${filename}`);
        progress.downloadedImages.push(url);
        saveProgress();
        successCount++;
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`[${i + 1}/${imageArray.length}] ✗ ${filename}: ${error.message}`);
        failCount++;
      }
    }
    
    // Save complete data
    const completeData = {
      scrapedAt: new Date().toISOString(),
      sourceUrl: TARGET_URL,
      products: allProducts.map(product => ({
        ...product,
        localImages: product.imageUrls
          .map(url => {
            const normalized = normalizeUrl(url, product.url);
            return imageMap.get(normalized) || null;
          })
          .filter(Boolean)
      })),
      summary: {
        totalPages: productLinks.length,
        totalImages: allImages.size,
        downloadedImages: successCount,
        failedImages: failCount
      }
    };
    
    writeFileSync(
      join(__dirname, 'scraped-products-complete.json'),
      JSON.stringify(completeData, null, 2)
    );
    
    console.log(`\n=== Summary ===`);
    console.log(`Pages: ${productLinks.length}`);
    console.log(`Images: ${allImages.size} (${successCount} downloaded, ${failCount} failed)`);
    console.log(`\nData saved to: scraped-products-complete.json`);
    
    await browser.close();
    
  } catch (error) {
    console.error('\nFatal Error:', error.message);
    console.error(error.stack);
    if (browser) await browser.close();
    process.exit(1);
  }
}

main().catch(console.error);
