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
const PROGRESS_FILE = join(__dirname, 'scrape-progress-final.json');

// Create output directories
[OUTPUT_DIR, DATA_DIR].forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  }
});

// Load progress if exists
let progress = { completedPages: [], downloadedImages: [] };
if (existsSync(PROGRESS_FILE)) {
  try {
    progress = JSON.parse(readFileSync(PROGRESS_FILE, 'utf8'));
    console.log(`✓ Resuming: ${progress.completedPages.length} pages, ${progress.downloadedImages.length} images`);
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
    if (url.startsWith('//')) return 'https:' + url;
    if (url.startsWith('/')) return new URL(url, baseUrl).href;
    if (!url.startsWith('http')) return new URL(url, baseUrl).href;
    return url;
  } catch (e) {
    return null;
  }
}

function isValidImageUrl(url) {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('favicon') || (lowerUrl.includes('logo') && !lowerUrl.includes('product'))) {
    return false;
  }
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
          timeout: 60000
        }, (res) => {
          if (res.statusCode === 301 || res.statusCode === 302) {
            return downloadImage(res.headers.location, outputPath, retries)
              .then(resolve).catch(reject);
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
      await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
    }
  }
}

function getFilenameFromUrl(url, index) {
  try {
    const parsed = parse(url);
    let filename = parsed.pathname?.split('/').pop() || `product_${index}.jpg`;
    filename = filename.split('?')[0];
    if (!filename.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      filename = `product_${index}.jpg`;
    }
    filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    return `product_${filename}`;
  } catch (e) {
    return `product_${index}_${Date.now()}.jpg`;
  }
}

async function waitForPageLoad(page) {
  console.log('  Waiting for page to load (15 seconds)...');
  await new Promise(resolve => setTimeout(resolve, 15000));
  
  try {
    await page.evaluate(() => {
      return new Promise((resolve) => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', resolve);
      });
    });
    
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const scrollSteps = Math.min(Math.ceil(scrollHeight / viewportHeight) + 2, 10);
    
    console.log(`  Scrolling through ${scrollSteps} sections...`);
    for (let i = 0; i < scrollSteps; i++) {
      await page.evaluate((pos) => window.scrollTo(0, pos), i * viewportHeight);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(resolve => setTimeout(resolve, 5000));
  } catch (e) {
    console.log('  Scroll error (continuing)');
  }
}

async function extractProductData(page, url) {
  console.log(`\n📄 Extracting: ${url}`);
  
  try {
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 180000 
    });
    
    await waitForPageLoad(page);
    
    const data = await page.evaluate(() => {
      document.querySelectorAll('script, style, nav, header, footer').forEach(el => el.remove());
      
      const main = document.querySelector('main') || 
                   document.querySelector('.content') || 
                   document.querySelector('article') || 
                   document.body;
      
      const textContent = main.innerText || main.textContent || '';
      
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
        if (rows.length > 0) {
          tables.push({ index, rows });
        }
      });
      
      const headings = [];
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        headings.push({
          level: heading.tagName.toLowerCase(),
          text: heading.innerText.trim()
        });
      });
      
      const paragraphs = [];
      document.querySelectorAll('p').forEach(p => {
        const text = p.innerText.trim();
        if (text.length > 10) paragraphs.push(text);
      });
      
      const images = new Set();
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || img.getAttribute('data-src') || 
                   img.getAttribute('data-lazy-src') || img.getAttribute('data-original');
        if (src && !src.startsWith('data:')) images.add(src);
      });
      
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
    
    console.log(`  ✓ Extracted: ${data.headings.length} headings, ${data.paragraphs.length} paragraphs, ${data.tables.length} tables, ${data.imageUrls.length} images`);
    return { url, ...data, error: null };
    
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
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

async function findAllProductLinks(page) {
  console.log('\n🔍 Finding all product links...');
  
  const foundLinks = new Set([TARGET_URL]);
  const visitedUrls = new Set();
  
  async function crawlPage(url, depth = 0, maxDepth = 2) {
    if (depth > maxDepth || visitedUrls.has(url)) return;
    visitedUrls.add(url);
    
    try {
      console.log(`  Crawling (depth ${depth}): ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 180000 });
      await waitForPageLoad(page);
      
      const links = await page.evaluate((baseUrl) => {
        const productLinks = new Set();
        document.querySelectorAll('a[href]').forEach(link => {
          const href = link.getAttribute('href');
          if (!href) return;
          
          try {
            let fullUrl;
            if (href.startsWith('http')) {
              fullUrl = href;
            } else {
              fullUrl = new URL(href, baseUrl).href;
            }
            
            if (fullUrl.includes('balloonlightprag.cz') && 
                (fullUrl.includes('/products') || fullUrl.includes('/product') ||
                 fullUrl.includes('/produkty') || fullUrl.includes('/produkt'))) {
              productLinks.add(fullUrl);
            }
          } catch (e) {}
        });
        return Array.from(productLinks);
      }, url);
      
      links.forEach(link => {
        if (!foundLinks.has(link)) {
          foundLinks.add(link);
        }
      });
      
      for (const link of links) {
        if (!visitedUrls.has(link) && depth < maxDepth) {
          await crawlPage(link, depth + 1, maxDepth);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    } catch (error) {
      console.error(`  Error crawling ${url}:`, error.message);
    }
  }
  
  await crawlPage(TARGET_URL, 0, 2);
  
  const uniqueLinks = Array.from(foundLinks);
  console.log(`\n✓ Found ${uniqueLinks.length} product pages`);
  return uniqueLinks;
}

async function main() {
  console.log('\n🚀 === Comprehensive Product Scraping ===');
  console.log(`Target: ${TARGET_URL}\n`);
  
  let browser;
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      timeout: 180000
    });
    console.log('✓ Browser launched');
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    const productLinks = await findAllProductLinks(page);
    
    const allProducts = [];
    const allImages = new Set();
    
    for (let i = 0; i < productLinks.length; i++) {
      const link = productLinks[i];
      
      if (progress.completedPages.includes(link)) {
        console.log(`[${i + 1}/${productLinks.length}] ⏭️  Skipping: ${link}`);
        continue;
      }
      
      console.log(`\n[${i + 1}/${productLinks.length}] Processing: ${link}`);
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
      
      const productFilename = link.split('/').pop() || `product_${i}`;
      const safeFilename = productFilename.replace(/[^a-zA-Z0-9]/g, '_') || `product_${i}`;
      writeFileSync(
        join(DATA_DIR, `${safeFilename}.json`),
        JSON.stringify(productData, null, 2)
      );
      
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    console.log(`\n\n📥 Downloading ${allImages.size} images...\n`);
    
    const imageArray = Array.from(allImages);
    let successCount = 0;
    let failCount = 0;
    const imageMap = new Map();
    
    for (let i = 0; i < imageArray.length; i++) {
      const url = imageArray[i];
      const filename = getFilenameFromUrl(url, i + 1);
      const outputPath = join(OUTPUT_DIR, filename);
      
      if (progress.downloadedImages.includes(url) || existsSync(outputPath)) {
        console.log(`[${i + 1}/${imageArray.length}] ⏭️  ${filename}`);
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
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`[${i + 1}/${imageArray.length}] ✗ ${filename}: ${error.message}`);
        failCount++;
      }
    }
    
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
    
    console.log(`\n\n✅ === Summary ===`);
    console.log(`Pages: ${productLinks.length}`);
    console.log(`Images: ${allImages.size} (${successCount} downloaded, ${failCount} failed)`);
    console.log(`\nData saved to: scraped-products-complete.json`);
    
    await browser.close();
    
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error(error.stack);
    if (browser) await browser.close();
    process.exit(1);
  }
}

main().catch(console.error);
