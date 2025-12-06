import puppeteer from 'puppeteer';
import https from 'https';
import http from 'http';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TARGET_URL = 'https://www.balloonlightprag.cz';
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
  // Include all images, even icons if they're actual image files
  if (lowerUrl.includes('favicon') && !lowerUrl.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return false;
  }
  return true;
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
    let filename = pathname.split('/').pop() || `image_${index}`;
    
    if (!filename.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      filename = filename + '.jpg';
    }
    
    filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    // Ensure unique filename
    let finalPath = join(OUTPUT_DIR, filename);
    let counter = 1;
    while (existsSync(finalPath)) {
      const ext = filename.match(/\.\w+$/)?.[0] || '.jpg';
      const base = filename.replace(/\.\w+$/, '');
      finalPath = join(OUTPUT_DIR, `${base}_${counter}${ext}`);
      counter++;
    }
    
    return finalPath.split(/[/\\]/).pop();
  } catch (e) {
    return `image_${index}_${Date.now()}.jpg`;
  }
}

async function extractImagesFromPage(page) {
  const imageUrls = new Set();
  
  // Get all img elements
  const imgElements = await page.$$eval('img', imgs => 
    imgs.map(img => ({
      src: img.src,
      srcset: img.srcset,
      dataSrc: img.dataset.src,
      dataLazySrc: img.dataset.lazySrc
    }))
  );
  
  for (const img of imgElements) {
    if (img.src) {
      const normalized = normalizeUrl(img.src, TARGET_URL);
      if (normalized && isValidImageUrl(normalized)) {
        imageUrls.add(normalized);
      }
    }
    if (img.srcset) {
      // Parse srcset
      img.srcset.split(',').forEach(entry => {
        const url = entry.trim().split(/\s+/)[0];
        const normalized = normalizeUrl(url, TARGET_URL);
        if (normalized && isValidImageUrl(normalized)) {
          imageUrls.add(normalized);
        }
      });
    }
    if (img.dataSrc) {
      const normalized = normalizeUrl(img.dataSrc, TARGET_URL);
      if (normalized && isValidImageUrl(normalized)) {
        imageUrls.add(normalized);
      }
    }
    if (img.dataLazySrc) {
      const normalized = normalizeUrl(img.dataLazySrc, TARGET_URL);
      if (normalized && isValidImageUrl(normalized)) {
        imageUrls.add(normalized);
      }
    }
  }
  
  // Get background images from style attributes
  const elementsWithBg = await page.$$eval('[style*="background"]', elements =>
    elements.map(el => el.style.backgroundImage || el.style.background)
  );
  
  for (const bg of elementsWithBg) {
    if (bg) {
      const urlMatch = bg.match(/url\(["']?([^"')]+)["']?\)/);
      if (urlMatch) {
        const normalized = normalizeUrl(urlMatch[1], TARGET_URL);
        if (normalized && isValidImageUrl(normalized)) {
          imageUrls.add(normalized);
        }
      }
    }
  }
  
  // Get images from CSS (check computed styles)
  const allElements = await page.$$('*');
  for (const element of allElements.slice(0, 500)) { // Limit to avoid too many checks
    try {
      const bgImage = await page.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.backgroundImage;
      }, element);
      
      if (bgImage && bgImage !== 'none') {
        const urlMatch = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
        if (urlMatch) {
          const normalized = normalizeUrl(urlMatch[1], TARGET_URL);
          if (normalized && isValidImageUrl(normalized)) {
            imageUrls.add(normalized);
          }
        }
      }
    } catch (e) {
      // Skip errors
    }
  }
  
  // Get images from links (gallery links)
  const links = await page.$$eval('a[href]', links =>
    links.map(link => link.href).filter(href => 
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(href)
    )
  );
  
  links.forEach(url => {
    const normalized = normalizeUrl(url, TARGET_URL);
    if (normalized && isValidImageUrl(normalized)) {
      imageUrls.add(normalized);
    }
  });
  
  return Array.from(imageUrls);
}

async function main() {
  console.log(`Scraping images from: ${TARGET_URL}\n`);
  console.log('Launching browser...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('Navigating to page...');
    await page.goto(TARGET_URL, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    console.log('Waiting for content to load...');
    // Wait a bit for any lazy-loaded images
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Scroll to trigger lazy loading
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Extracting image URLs...');
    const imageUrls = await extractImagesFromPage(page);
    console.log(`Found ${imageUrls.length} unique images.`);
    
    if (imageUrls.length > 0) {
      console.log('\nSample URLs:');
      imageUrls.slice(0, 10).forEach((url, i) => {
        console.log(`  ${i + 1}. ${url}`);
      });
    }
    console.log('');
    
    await browser.close();
    
    // Download images
    if (imageUrls.length === 0) {
      console.log('No images found. The site might use a different loading mechanism.');
      return;
    }
    
    console.log('Downloading images...\n');
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      const filename = getFilenameFromUrl(url, i);
      const outputPath = join(OUTPUT_DIR, filename);
      
      if (existsSync(outputPath)) {
        console.log(`[${i + 1}/${imageUrls.length}] Skipped (exists): ${filename}`);
        successCount++;
        continue;
      }
      
      try {
        await downloadImage(url, outputPath);
        console.log(`[${i + 1}/${imageUrls.length}] Downloaded: ${filename}`);
        successCount++;
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`[${i + 1}/${imageUrls.length}] Failed: ${filename} - ${error.message}`);
        failCount++;
      }
    }
    
    console.log(`\n=== Summary ===`);
    console.log(`Total images found: ${imageUrls.length}`);
    console.log(`Successfully downloaded: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`\nImages saved to: ${OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('Error:', error.message);
    await browser.close();
    process.exit(1);
  }
}

main();
