import https from 'https';
import http from 'http';
import { createWriteStream, mkdirSync, existsSync, writeFileSync } from 'fs';
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

async function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = parse(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractImageUrls(html, baseUrl) {
  const imageUrls = new Set();
  
  // Extract src attributes from img tags (more flexible regex)
  const imgRegex = /<img[^>]+(?:src|srcset|data-src|data-lazy-src|data-srcset)=["']([^"']+)["']/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    let imageUrl = match[1];
    
    // Handle srcset (might have multiple URLs)
    if (imageUrl.includes(',')) {
      const urls = imageUrl.split(',').map(u => u.trim().split(/\s+/)[0]);
      urls.forEach(url => {
        let normalized = normalizeUrl(url, baseUrl);
        if (normalized && isValidImageUrl(normalized)) {
          imageUrls.add(normalized);
        }
      });
      continue;
    }
    
    let normalized = normalizeUrl(imageUrl, baseUrl);
    if (normalized && isValidImageUrl(normalized)) {
      imageUrls.add(normalized);
    }
  }
  
  // Also check for background-image in style attributes
  const styleRegex = /style=["'][^"']*background(?:-image)?:\s*url\(["']?([^"')]+)["']?\)/gi;
  while ((match = styleRegex.exec(html)) !== null) {
    let imageUrl = match[1];
    let normalized = normalizeUrl(imageUrl, baseUrl);
    if (normalized && isValidImageUrl(normalized)) {
      imageUrls.add(normalized);
    }
  }
  
  // Check for image URLs in JSON data (common in React/Vue apps)
  const jsonRegex = /"(?:https?:\/\/[^"]+\.(?:jpg|jpeg|png|gif|webp|svg)[^"]*)"/gi;
  while ((match = jsonRegex.exec(html)) !== null) {
    let imageUrl = match[1] || match[0].replace(/"/g, '');
    let normalized = normalizeUrl(imageUrl, baseUrl);
    if (normalized && isValidImageUrl(normalized)) {
      imageUrls.add(normalized);
    }
  }
  
  // Look for common image paths
  const pathRegex = /(?:src|href|data-src)=["']([^"']*(?:images?|img|photo|gallery|assets)[^"']*\.(?:jpg|jpeg|png|gif|webp|svg)[^"']*)["']/gi;
  while ((match = pathRegex.exec(html)) !== null) {
    let imageUrl = match[1];
    let normalized = normalizeUrl(imageUrl, baseUrl);
    if (normalized && isValidImageUrl(normalized)) {
      imageUrls.add(normalized);
    }
  }
  
  return Array.from(imageUrls);
}

function normalizeUrl(url, baseUrl) {
  if (!url || url.startsWith('data:')) return null;
  
  // Convert relative URLs to absolute
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
  // Filter out icons, logos, and very small images, but include everything else
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('icon') || lowerUrl.includes('favicon')) {
    // Still include if it's a photo/image file
    if (!lowerUrl.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return false;
    }
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
        // Follow redirects
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

function getFilenameFromUrl(url) {
  try {
    const parsed = parse(url);
    const pathname = parsed.pathname || '';
    const filename = pathname.split('/').pop() || 'image';
    
    // Ensure filename has an extension
    if (!filename.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      return filename + '.jpg';
    }
    
    // Sanitize filename
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  } catch (e) {
    return 'image_' + Date.now() + '.jpg';
  }
}

async function main() {
  console.log(`Scraping images from: ${TARGET_URL}\n`);
  
  try {
    // Fetch the main page
    console.log('Fetching HTML...');
    const html = await fetchHTML(TARGET_URL);
    console.log('HTML fetched successfully.\n');
    
    // Save HTML for debugging
    writeFileSync(join(__dirname, 'debug-html.html'), html);
    console.log('Saved HTML to debug-html.html for inspection.\n');
    
    // Extract image URLs
    console.log('Extracting image URLs...');
    const imageUrls = extractImageUrls(html, TARGET_URL);
    console.log(`Found ${imageUrls.length} unique images.`);
    if (imageUrls.length > 0) {
      console.log('Sample URLs:');
      imageUrls.slice(0, 5).forEach((url, i) => console.log(`  ${i + 1}. ${url}`));
    }
    console.log('');
    
    // Download each image
    console.log('Downloading images...\n');
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      const filename = getFilenameFromUrl(url);
      const outputPath = join(OUTPUT_DIR, filename);
      
      // Skip if file already exists
      if (existsSync(outputPath)) {
        console.log(`[${i + 1}/${imageUrls.length}] Skipped (exists): ${filename}`);
        successCount++;
        continue;
      }
      
      try {
        await downloadImage(url, outputPath);
        console.log(`[${i + 1}/${imageUrls.length}] Downloaded: ${filename}`);
        successCount++;
        
        // Small delay to be polite
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
    process.exit(1);
  }
}

main();
