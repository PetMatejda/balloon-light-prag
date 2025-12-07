import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROGRESS_FILE = join(__dirname, 'scrape-progress-comprehensive.json');
const DATA_DIR = join(__dirname, 'scraped-products-data');
const IMAGES_DIR = join(__dirname, 'public', 'images', 'products');
const COMPLETE_FILE = join(__dirname, 'scraped-products-complete.json');

console.log('=== Scraping Progress Check ===\n');

// Check progress file
if (existsSync(PROGRESS_FILE)) {
  const progress = JSON.parse(readFileSync(PROGRESS_FILE, 'utf8'));
  console.log('Progress file found:');
  console.log(`  Completed pages: ${progress.completedPages?.length || 0}`);
  console.log(`  Downloaded images: ${progress.downloadedImages?.length || 0}`);
  if (progress.completedPages?.length > 0) {
    console.log('\n  Completed pages:');
    progress.completedPages.forEach((page, i) => {
      console.log(`    ${i + 1}. ${page}`);
    });
  }
} else {
  console.log('Progress file not found - scraping may not have started yet');
}

// Check data directory
if (existsSync(DATA_DIR)) {
  const files = readdirSync(DATA_DIR);
  console.log(`\nData directory: ${files.length} product files found`);
} else {
  console.log('\nData directory does not exist yet');
}

// Check images directory
if (existsSync(IMAGES_DIR)) {
  const files = readdirSync(IMAGES_DIR);
  console.log(`Images directory: ${files.length} images downloaded`);
} else {
  console.log('Images directory does not exist yet');
}

// Check complete file
if (existsSync(COMPLETE_FILE)) {
  const data = JSON.parse(readFileSync(COMPLETE_FILE, 'utf8'));
  console.log(`\nComplete data file found:`);
  console.log(`  Products: ${data.products?.length || 0}`);
  console.log(`  Total images: ${data.summary?.totalImages || 0}`);
  console.log(`  Downloaded: ${data.summary?.downloadedImages || 0}`);
  console.log(`  Failed: ${data.summary?.failedImages || 0}`);
  console.log(`\nScraping appears to be complete!`);
  console.log(`\nNext steps:`);
  console.log(`1. Run: node process-and-update-products.js`);
  console.log(`2. Run: node update-website-products.js`);
} else {
  console.log('\nComplete data file not found - scraping still in progress');
}
