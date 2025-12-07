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
  
  // Extract src attributes from img tags
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
  
  // Check for background-image in style attributes
  const styleRegex = /style=["'][^"']*background(?:-image)?:\s*url\(["']?([^"')]+)["']?\)/gi;
  while ((match = styleRegex.exec(html)) !== null) {
    let imageUrl = match[1];
    let normalized = normalizeUrl(imageUrl, baseUrl);
    if (normalized && isValidImageUrl(normalized)) {
      imageUrls.add(normalized);
    }
  }
  
  // Check for image URLs in JSON data
  const jsonRegex = /"(?:https?:\/\/[^"]+\.(?:jpg|jpeg|png|gif|webp|svg)[^"]*)"/gi;
  while ((match = jsonRegex.exec(html)) !== null) {
    let imageUrl = match[1] || match[0].replace(/"/g, '');
    let normalized = normalizeUrl(imageUrl, baseUrl);
    if (normalized && isValidImageUrl(normalized)) {
      imageUrls.add(normalized);
    }
  }
  
  // Look for common image paths in portfolio/gallery context
  const portfolioRegex = /(?:src|href|data-src)=["']([^"']*(?:portfolio|gallery|project|film|poster|movie)[^"']*\.(?:jpg|jpeg|png|gif|webp|svg)[^"']*)["']/gi;
  while ((match = portfolioRegex.exec(html)) !== null) {
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
  const lowerUrl = url.toLowerCase();
  
  // Filter out icons, logos, and small images
  if (lowerUrl.includes('icon') || lowerUrl.includes('favicon') || lowerUrl.includes('logo')) {
    if (!lowerUrl.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return false;
    }
  }
  
  // Prefer portfolio/gallery/film related images
  if (lowerUrl.includes('portfolio') || lowerUrl.includes('gallery') || 
      lowerUrl.includes('project') || lowerUrl.includes('film') || 
      lowerUrl.includes('poster') || lowerUrl.includes('movie')) {
    return true;
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
  
  try {
    // Fetch the portfolio page
    console.log('Fetching HTML...');
    const html = await fetchHTML(TARGET_URL);
    console.log('HTML fetched successfully.\n');
    
    // Save HTML for debugging
    writeFileSync(join(__dirname, 'debug-portfolio-html.html'), html);
    console.log('Saved HTML to debug-portfolio-html.html for inspection.\n');
    
    // Extract image URLs
    console.log('Extracting image URLs...');
    const imageUrls = extractImageUrls(html, 'https://www.balloonlightprag.cz');
    console.log(`Found ${imageUrls.length} unique images.`);
    if (imageUrls.length > 0) {
      console.log('Sample URLs:');
      imageUrls.slice(0, 10).forEach((url, i) => console.log(`  ${i + 1}. ${url}`));
    }
    console.log('');
    
    // Download each image
    console.log('Downloading images...\n');
    let successCount = 0;
    let failCount = 0;
    const downloadedFiles = [];
    
    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      const filename = getFilenameFromUrl(url, i + 1);
      const outputPath = join(OUTPUT_DIR, filename);
      
      // Skip if file already exists
      if (existsSync(outputPath)) {
        console.log(`[${i + 1}/${imageUrls.length}] Skipped (exists): ${filename}`);
        downloadedFiles.push(`/images/${filename}`);
        successCount++;
        continue;
      }
      
      try {
        await downloadImage(url, outputPath);
        console.log(`[${i + 1}/${imageUrls.length}] Downloaded: ${filename}`);
        downloadedFiles.push(`/images/${filename}`);
        successCount++;
        
        // Small delay to be polite
        await new Promise(resolve => setTimeout(resolve, 300));
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
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();

