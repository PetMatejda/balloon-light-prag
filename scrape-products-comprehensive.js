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
const PROGRESS_FILE = join(__dirname, 'scrape-progress-comprehensive.json');

// Create output directories
[OUTPUT_DIR, DATA_DIR].forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Load progress if exists
let progress = { completedPages: [], downloadedImages: [], foundLinks: [] };
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
  
  // Filter out obvious non-product images
  if (lowerUrl.includes('favicon') || 
      lowerUrl.includes('logo') && !lowerUrl.includes('product') ||
      lowerUrl.includes('icon') && lowerUrl.includes('16x16')) {
    return false;
  }
  
  return lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/);
}

async function downloadImage(url, outputPath, retries = 5) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await new Promise((resolve, reject) => {
        const parsedUrl = parse(url);
        const client = parsedUrl.protocol === 'https:' ? https : http;
        
        const request = client.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          timeout: 60000 // 60 seconds timeout for slow loading
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
      const delay = 2000 * (attempt + 1); // Exponential backoff
      console.log(`  Retry ${attempt + 1}/${retries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

function getFilenameFromUrl(url, index, prefix = 'product') {
  try {
    const parsed = parse(url);
    const pathname = parsed.pathname || '';
    let filename = pathname.split('/').pop() || `${prefix}_${index}`;
    
    // Remove query parameters
    filename = filename.split('?')[0];
    
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

async function waitForPageLoad(page, waitTime = 15000) {
  console.log(`  Waiting ${waitTime}ms for page to load...`);
  await new Promise(resolve => setTimeout(resolve, waitTime));
  
  try {
    // Wait for network to be idle
    await page.evaluate(() => {
      return new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', resolve);
        }
      });
    });
    
    // Scroll to trigger lazy loading
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const scrollSteps = Math.min(Math.ceil(scrollHeight / viewportHeight) + 3, 15);
    
    console.log(`  Scrolling through ${scrollSteps} sections...`);
    for (let i = 0; i < scrollSteps; i++) {
      await page.evaluate((pos) => window.scrollTo(0, pos), i * viewportHeight);
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds between scrolls
    }
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Final wait for any lazy-loaded content
    await new Promise(resolve => setTimeout(resolve, 5000));
  } catch (e) {
    console.log('  Scroll error (continuing):', e.message);
  }
}

async function extractProductData(page, url) {
  console.log(`\nExtracting: ${url}`);
  
  try {
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 180000 // 3 minutes timeout
    });
    
    await waitForPageLoad(page, 15000);
    
    const data = await page.evaluate(() => {
      // Remove unwanted elements
      const scripts = document.querySelectorAll('script, style, nav, header, footer, .nav, .header, .footer');
      scripts.forEach(el => el.remove());
      
      // Extract main content
      const main = document.querySelector('main') || 
                   document.querySelector('.content') || 
                   document.querySelector('.product') ||
                   document.querySelector('article') || 
                   document.body;
      
      const textContent = main.innerText || main.textContent || '';
      
      // Extract tables with more detail
      const tables = [];
      document.querySelectorAll('table').forEach((table, index) => {
        const rows = [];
        const caption = table.querySelector('caption')?.innerText.trim() || '';
        
        table.querySelectorAll('tr').forEach(tr => {
          const cells = [];
          tr.querySelectorAll('td, th').forEach(cell => {
            const cellText = cell.innerText.trim();
            const colspan = cell.getAttribute('colspan') || '1';
            const rowspan = cell.getAttribute('rowspan') || '1';
            cells.push({
              text: cellText,
              colspan: parseInt(colspan),
              rowspan: parseInt(rowspan),
              isHeader: cell.tagName === 'TH'
            });
          });
          if (cells.length > 0) rows.push(cells);
        });
        
        if (rows.length > 0) {
          tables.push({ 
            index, 
            caption,
            rows: rows.map(row => row.map(cell => cell.text))
          });
        }
      });
      
      // Extract headings with hierarchy
      const headings = [];
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        headings.push({
          level: heading.tagName.toLowerCase(),
          text: heading.innerText.trim(),
          id: heading.id || ''
        });
      });
      
      // Extract paragraphs
      const paragraphs = [];
      document.querySelectorAll('p').forEach(p => {
        const text = p.innerText.trim();
        if (text.length > 10) paragraphs.push(text);
      });
      
      // Extract lists
      const lists = [];
      document.querySelectorAll('ul, ol').forEach((list, index) => {
        const items = [];
        list.querySelectorAll('li').forEach(li => {
          items.push(li.innerText.trim());
        });
        if (items.length > 0) {
          lists.push({ index, items, type: list.tagName.toLowerCase() });
        }
      });
      
      // Extract all images - more thorough
      const images = new Set();
      
      // Regular img tags
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || 
                   img.getAttribute('data-src') || 
                   img.getAttribute('data-lazy-src') || 
                   img.getAttribute('data-original') ||
                   img.getAttribute('data-srcset')?.split(' ')[0] ||
                   img.getAttribute('srcset')?.split(' ')[0];
        if (src && !src.startsWith('data:')) {
          images.add(src);
        }
      });
      
      // Background images from style attributes
      document.querySelectorAll('[style*="background"]').forEach(el => {
        const style = el.getAttribute('style');
        const matches = style?.matchAll(/url\(["']?([^"')]+)["']?\)/g);
        if (matches) {
          for (const match of matches) {
            if (match[1] && !match[1].startsWith('data:')) {
              images.add(match[1]);
            }
          }
        }
      });
      
      // Background images from computed styles
      document.querySelectorAll('*').forEach(el => {
        try {
          const bgImage = window.getComputedStyle(el).backgroundImage;
          if (bgImage && bgImage !== 'none') {
            const matches = bgImage.matchAll(/url\(["']?([^"')]+)["']?\)/g);
            if (matches) {
              for (const match of matches) {
                if (match[1] && !match[1].startsWith('data:')) {
                  images.add(match[1]);
                }
              }
            }
          }
        } catch (e) {
          // Skip if can't access computed style
        }
      });
      
      // Picture elements
      document.querySelectorAll('picture source').forEach(source => {
        const srcset = source.getAttribute('srcset');
        if (srcset) {
          srcset.split(',').forEach(src => {
            const url = src.trim().split(' ')[0];
            if (url && !url.startsWith('data:')) {
              images.add(url);
            }
          });
        }
      });
      
      return {
        textContent,
        tables,
        headings,
        paragraphs,
        lists,
        imageUrls: Array.from(images),
        html: main.innerHTML || ''
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
      lists: [],
      imageUrls: [],
      html: ''
    };
  }
}

async function findAllProductLinks(page) {
  console.log('\n=== Finding all product links ===');
  
  const foundLinks = new Set();
  const visitedUrls = new Set();
  
  async function crawlPage(url, depth = 0, maxDepth = 3) {
    if (depth > maxDepth || visitedUrls.has(url) || foundLinks.has(url)) {
      return;
    }
    
    visitedUrls.add(url);
    
    try {
      console.log(`  Crawling (depth ${depth}): ${url}`);
      
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 180000 
      });
      
      await waitForPageLoad(page, 12000);
      
      const links = await page.evaluate((baseUrl) => {
        const productLinks = new Set();
        const base = new URL(baseUrl);
        
        // Find all links
        document.querySelectorAll('a[href]').forEach(link => {
          const href = link.getAttribute('href');
          if (!href) return;
          
          let fullUrl;
          try {
            if (href.startsWith('http')) {
              fullUrl = href;
            } else if (href.startsWith('/')) {
              fullUrl = new URL(href, baseUrl).href;
            } else {
              fullUrl = new URL(href, baseUrl).href;
            }
            
            // Check if it's a product-related link
            if (fullUrl.includes(base.hostname) && 
                (fullUrl.includes('/products') || 
                 fullUrl.includes('/product') ||
                 fullUrl.includes('/produkty') ||
                 fullUrl.includes('/produkt'))) {
              productLinks.add(fullUrl);
            }
          } catch (e) {
            // Skip invalid URLs
          }
        });
        
        return Array.from(productLinks);
      }, url);
      
      // Add found links
      links.forEach(link => {
        if (!foundLinks.has(link) && link.includes('balloonlightprag.cz')) {
          foundLinks.add(link);
        }
      });
      
      // Recursively crawl found links
      for (const link of links) {
        if (!visitedUrls.has(link) && depth < maxDepth) {
          await crawlPage(link, depth + 1, maxDepth);
          await new Promise(resolve => setTimeout(resolve, 3000)); // Delay between pages
        }
      }
      
    } catch (error) {
      console.error(`  Error crawling ${url}:`, error.message);
    }
  }
  
  // Start with main products page
  await crawlPage(TARGET_URL, 0, 3);
  
  // Also include the main page
  foundLinks.add(TARGET_URL);
  
  const uniqueLinks = Array.from(foundLinks);
  console.log(`\nFound ${uniqueLinks.length} product pages:`);
  uniqueLinks.forEach((link, i) => console.log(`  ${i + 1}. ${link}`));
  
  return uniqueLinks;
}

async function main() {
  console.log(`\n=== Comprehensive Product Scraping ===`);
  console.log(`Target: ${TARGET_URL}\n`);
  
  let browser;
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ],
      timeout: 180000
    });
    
    console.log('Browser launched. Creating new page...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('Finding all product pages (this may take a while due to slow website)...');
    // Find all product pages
    const productLinks = await findAllProductLinks(page);
    
    // Process each page
    const allProducts = [];
    const allImages = new Set();
    
    for (let i = 0; i < productLinks.length; i++) {
      const link = productLinks[i];
      
      if (progress.completedPages.includes(link)) {
        console.log(`[${i + 1}/${productLinks.length}] Skipping (already done): ${link}`);
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
      
      // Save individual product
      const productFilename = link.split('/').pop() || `product_${i}`;
      const safeFilename = productFilename.replace(/[^a-zA-Z0-9]/g, '_') || `product_${i}`;
      writeFileSync(
        join(DATA_DIR, `${safeFilename}.json`),
        JSON.stringify(productData, null, 2)
      );
      
      // Delay between pages to be respectful
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    // Download images
    console.log(`\n\n=== Downloading ${allImages.size} Images ===\n`);
    
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
        console.log(`[${i + 1}/${imageArray.length}] Downloading: ${filename}`);
        await downloadImage(url, outputPath);
        console.log(`[${i + 1}/${imageArray.length}] ✓ ${filename}`);
        imageMap.set(url, `/images/products/${filename}`);
        progress.downloadedImages.push(url);
        saveProgress();
        successCount++;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between downloads
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
    console.log(`Pages processed: ${productLinks.length}`);
    console.log(`Images found: ${allImages.size}`);
    console.log(`Images downloaded: ${successCount}`);
    console.log(`Images failed: ${failCount}`);
    console.log(`\nData saved to: scraped-products-complete.json`);
    console.log(`Images saved to: ${OUTPUT_DIR}`);
    
    await browser.close();
    
  } catch (error) {
    console.error('\nFatal Error:', error.message);
    console.error(error.stack);
    if (browser) await browser.close();
    process.exit(1);
  }
}

main().catch(console.error);
