import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_FILE = join(__dirname, 'scraped-products-complete.json');
const MESSAGES_DIR = join(__dirname, 'messages');

// Load scraped data
if (!existsSync(DATA_FILE)) {
  console.error('Scraped data file not found. Please run scrape-products-robust.js first.');
  process.exit(1);
}

const scrapedData = JSON.parse(readFileSync(DATA_FILE, 'utf8'));

console.log(`Processing ${scrapedData.products.length} products...`);

// Extract product information
function extractProductInfo(product) {
  const info = {
    name: '',
    description: '',
    type: '',
    power: '',
    sourceType: '',
    colorTemp: '',
    dimensions: '',
    images: product.localImages || [],
    tables: product.tables || [],
    technicalSpecs: {}
  };
  
  // Extract name from headings
  const h1 = product.headings?.find(h => h.level === 'h1');
  const h2 = product.headings?.find(h => h.level === 'h2');
  info.name = h1?.text || h2?.text || '';
  
  // Extract description from paragraphs
  if (product.paragraphs && product.paragraphs.length > 0) {
    info.description = product.paragraphs[0];
  }
  
  // Extract technical specs from tables
  if (product.tables && product.tables.length > 0) {
    product.tables.forEach(table => {
      table.rows.forEach(row => {
        if (row.length >= 2) {
          const key = row[0].toLowerCase();
          const value = row[1];
          
          if (key.includes('výkon') || key.includes('power') || key.includes('output')) {
            info.power = value;
            info.technicalSpecs.wattage = value;
          }
          if (key.includes('typ') || key.includes('type')) {
            info.type = value;
            info.sourceType = value;
          }
          if (key.includes('kelvin') || key.includes('teplota') || key.includes('color')) {
            info.colorTemp = value;
          }
          if (key.includes('rozměr') || key.includes('dimension')) {
            info.dimensions = value;
          }
          if (key.includes('cri')) {
            info.technicalSpecs.cri = value;
          }
          if (key.includes('stmí') || key.includes('dimming')) {
            info.technicalSpecs.dimming = value;
          }
        }
      });
    });
  }
  
  // Try to extract from text content
  const text = product.textContent || '';
  
  // Extract power
  if (!info.power) {
    const powerMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:KW|kW|W|kw)/i);
    if (powerMatch) {
      info.power = powerMatch[0];
      info.technicalSpecs.wattage = powerMatch[0];
    }
  }
  
  // Extract Kelvin
  if (!info.colorTemp) {
    const kelvinMatch = text.match(/(\d+)\s*K/i);
    if (kelvinMatch) {
      info.colorTemp = kelvinMatch[0];
    }
  }
  
  return info;
}

// Process all products
const processedProducts = scrapedData.products
  .filter(p => !p.error)
  .map(extractProductInfo)
  .filter(p => p.name || p.description); // Only products with some info

console.log(`\nExtracted ${processedProducts.length} valid products:\n`);
processedProducts.forEach((p, i) => {
  console.log(`${i + 1}. ${p.name || 'Unnamed Product'}`);
  console.log(`   Images: ${p.images.length}`);
  console.log(`   Power: ${p.power || 'N/A'}`);
  console.log(`   Type: ${p.type || 'N/A'}`);
  console.log('');
});

// Save processed data
const processedData = {
  scrapedAt: scrapedData.scrapedAt,
  sourceUrl: scrapedData.sourceUrl,
  products: processedProducts,
  summary: scrapedData.summary
};

writeFileSync(
  join(__dirname, 'processed-products.json'),
  JSON.stringify(processedData, null, 2)
);

console.log('Processed data saved to: processed-products.json');
console.log('\nNext steps:');
console.log('1. Review processed-products.json');
console.log('2. Update GearShowcase.tsx with new products');
console.log('3. Update TechnicalSpecs.tsx with new specs');
console.log('4. Update messages/*.json with new translations');
