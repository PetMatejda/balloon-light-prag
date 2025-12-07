import puppeteer from 'puppeteer';
import https from 'https';
import http from 'http';
import { createWriteStream, mkdirSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TARGET_URL = 'https://www.balloonlightprag.cz/products';
const OUTPUT_DIR = join(__dirname, 'public', 'images', 'products');
const DATA_DIR = join(__dirname, 'scraped-products-data');

// Create output directories
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created directory: ${OUTPUT_DIR}`);
}

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
  console.log(`Created directory: ${DATA_DIR}`);
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
      reject(new Error('Download timeout'));
    });
  });
}

function getFilenameFromUrl(url, index, prefix = 'product') {
  try {
    const parsed = parse(url);
    const pathname = parsed.pathname || '';
    let filename = pathname.split('/').pop() || `${prefix}_${index}`;
    
    // Ensure filename has an extension
    if (!filename.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      filename = `${prefix}_${index}.jpg`;
    }
    
    // Sanitize filename
    filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    // Add prefix to avoid conflicts
    if (!filename.startsWith(prefix)) {
      filename = `${prefix}_${filename}`;
    }
    
    return filename;
  } catch (e) {
    return `${prefix}_${index}_${Date.now()}.jpg`;
  }
}

async function waitForPageLoad(page, waitTime = 5000) {
  console.log(`Waiting ${waitTime}ms for page to load...`);
  await new Promise(resolve => setTimeout(resolve, waitTime));
  
  // Scroll to trigger lazy loading
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const scrollSteps = Math.ceil(scrollHeight / viewportHeight) + 2;
  
  for (let i = 0; i < scrollSteps; i++) {
    const scrollPosition = (i * viewportHeight);
    await page.evaluate((pos) => {
      window.scrollTo(0, pos);
    }, scrollPosition);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Scroll to bottom
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Final wait
  await new Promise(resolve => setTimeout(resolve, 2000));
}

async function extractProductData(page, url) {
  console.log(`\nExtracting data from: ${url}`);
  
  try {
    await page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
    
    await waitForPageLoad(page, 8000);
    
    // Extract all text content
    const textContent = await page.evaluate(() => {
      // Remove script and style elements
      const scripts = document.querySelectorAll('script, style, nav, header, footer');
      scripts.forEach(el => el.remove());
      
      // Get main content
      const main = document.querySelector('main') || document.querySelector('.content') || document.body;
      return main.innerText || main.textContent || '';
    });
    
    // Extract tables
    const tables = await page.evaluate(() => {
      const tableData = [];
      document.querySelectorAll('table').forEach((table, index) => {
        const rows = [];
        table.querySelectorAll('tr').forEach(tr => {
          const cells = [];
          tr.querySelectorAll('td, th').forEach(cell => {
            cells.push(cell.innerText.trim());
          });
          if (cells.length > 0) {
            rows.push(cells);
          }
        });
        if (rows.length > 0) {
          tableData.push({
            index,
            rows
          });
        }
      });
      return tableData;
    });
    
    // Extract headings
    const headings = await page.evaluate(() => {
      const headingData = [];
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        headingData.push({
          level: heading.tagName.toLowerCase(),
          text: heading.innerText.trim()
        });
      });
      return headingData;
    });
    
    // Extract paragraphs
    const paragraphs = await page.evaluate(() => {
      const paraData = [];
      document.querySelectorAll('p').forEach(p => {
        const text = p.innerText.trim();
        if (text.length > 20) { // Only meaningful paragraphs
          paraData.push(text);
        }
      });
      return paraData;
    });
    
    // Extract all image URLs
    const imageUrls = await page.evaluate(() => {
      const images = new Set();
      
      // Get all img tags
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || 
                   img.getAttribute('data-original') || img.getAttribute('srcset')?.split(' ')[0];
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
    
    return {
      url,
      textContent,
      tables,
      headings,
      paragraphs,
      imageUrls: Array.from(imageUrls)
    };
    
  } catch (error) {
    console.error(`Error extracting data from ${url}:`, error.message);
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
  console.log('Finding all product links...');
  
  await page.goto(TARGET_URL, { 
    waitUntil: 'domcontentloaded',
    timeout: 60000 
  });
  
  await waitForPageLoad(page, 8000);
  
  // Find all links that might be product pages
  const links = await page.evaluate((baseUrl) => {
    const productLinks = new Set();
    const base = new URL(baseUrl);
    
    // Find all links
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      
      let fullUrl;
      if (href.startsWith('http')) {
        fullUrl = href;
      } else if (href.startsWith('/')) {
        fullUrl = new URL(href, baseUrl).href;
      } else {
        fullUrl = new URL(href, baseUrl).href;
      }
      
      // Check if it's a product-related link
      if (fullUrl.includes('/products') || 
          fullUrl.includes('/product') ||
          fullUrl.includes('/produkty') ||
          fullUrl.includes('/produkt')) {
        productLinks.add(fullUrl);
      }
    });
    
    return Array.from(productLinks);
  }, TARGET_URL);
  
  // Also include the main products page
  links.unshift(TARGET_URL);
  
  // Remove duplicates
  const uniqueLinks = [...new Set(links)];
  
  console.log(`Found ${uniqueLinks.length} product-related pages:`);
  uniqueLinks.forEach((link, i) => console.log(`  ${i + 1}. ${link}`));
  
  return uniqueLinks;
}

async function main() {
  console.log(`Scraping products from: ${TARGET_URL}\n`);
  
  let browser;
  try {
    // Launch browser
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 120000
    });
    console.log('Browser launched successfully');
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Find all product pages
    const productLinks = await findProductLinks(page);
    
    // Extract data from each page
    const allProducts = [];
    const allImages = new Set();
    
    for (let i = 0; i < productLinks.length; i++) {
      const link = productLinks[i];
      console.log(`\n[${i + 1}/${productLinks.length}] Processing: ${link}`);
      
      const productData = await extractProductData(page, link);
      
      // Collect all images
      productData.imageUrls.forEach(url => {
        const normalized = normalizeUrl(url, link);
        if (normalized && isValidImageUrl(normalized)) {
          allImages.add(normalized);
        }
      });
      
      allProducts.push(productData);
      
      // Save individual product data
      const productFilename = link.split('/').pop() || `product_${i}`;
      writeFileSync(
        join(DATA_DIR, `${productFilename.replace(/[^a-zA-Z0-9]/g, '_')}.json`),
        JSON.stringify(productData, null, 2)
      );
      
      // Delay between pages
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Download all images
    console.log(`\n\n=== Downloading Images ===`);
    console.log(`Found ${allImages.size} unique images to download.\n`);
    
    const imageArray = Array.from(allImages);
    let successCount = 0;
    let failCount = 0;
    const downloadedFiles = [];
    const imageMap = new Map(); // Map original URL to local filename
    
    for (let i = 0; i < imageArray.length; i++) {
      const url = imageArray[i];
      const filename = getFilenameFromUrl(url, i + 1, 'product');
      const outputPath = join(OUTPUT_DIR, filename);
      
      // Skip if file already exists
      if (existsSync(outputPath)) {
        console.log(`[${i + 1}/${imageArray.length}] Skipped (exists): ${filename}`);
        downloadedFiles.push(`/images/products/${filename}`);
        imageMap.set(url, `/images/products/${filename}`);
        successCount++;
        continue;
      }
      
      try {
        await downloadImage(url, outputPath);
        console.log(`[${i + 1}/${imageArray.length}] Downloaded: ${filename}`);
        downloadedFiles.push(`/images/products/${filename}`);
        imageMap.set(url, `/images/products/${filename}`);
        successCount++;
        
        // Delay to be polite
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`[${i + 1}/${imageArray.length}] Failed: ${filename} - ${error.message}`);
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
    console.log(`Total product pages: ${productLinks.length}`);
    console.log(`Total images found: ${allImages.size}`);
    console.log(`Successfully downloaded: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`\nImages saved to: ${OUTPUT_DIR}`);
    console.log(`Data saved to: ${DATA_DIR}`);
    console.log(`Complete data saved to: scraped-products-complete.json`);
    
    await browser.close();
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

main();
