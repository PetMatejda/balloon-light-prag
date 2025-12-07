import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_FILE = join(__dirname, 'scraped-products-complete.json');
const MESSAGES_DIR = join(__dirname, 'messages');
const PRODUCTS_IMAGES_DIR = join(__dirname, 'public', 'images', 'products');

// Load scraped data
if (!existsSync(DATA_FILE)) {
  console.error('Scraped data file not found. Please run scrape-products-comprehensive.js first.');
  process.exit(1);
}

const scrapedData = JSON.parse(readFileSync(DATA_FILE, 'utf8'));

console.log(`Processing ${scrapedData.products.length} products...`);

// Extract product information from scraped data
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
    headings: product.headings || [],
    paragraphs: product.paragraphs || [],
    lists: product.lists || [],
    technicalSpecs: {}
  };
  
  // Extract name from headings (prefer h1, then h2)
  const h1 = product.headings?.find(h => h.level === 'h1');
  const h2 = product.headings?.find(h => h.level === 'h2');
  info.name = h1?.text || h2?.text || '';
  
  // Clean up name
  if (info.name) {
    info.name = info.name.replace(/\s+/g, ' ').trim();
  }
  
  // Extract description from paragraphs
  if (product.paragraphs && product.paragraphs.length > 0) {
    // Take first meaningful paragraph
    info.description = product.paragraphs.find(p => p.length > 50) || product.paragraphs[0] || '';
    info.description = info.description.replace(/\s+/g, ' ').trim();
  }
  
  // Extract technical specs from tables
  if (product.tables && product.tables.length > 0) {
    product.tables.forEach(table => {
      table.rows.forEach(row => {
        if (row.length >= 2) {
          const key = row[0].toLowerCase();
          const value = row[1];
          
          if (key.includes('výkon') || key.includes('power') || key.includes('output') || key.includes('příkon')) {
            info.power = value;
            info.technicalSpecs.wattage = value;
          }
          if (key.includes('typ') || key.includes('type') || key.includes('zdroj')) {
            info.type = value;
            info.sourceType = value;
          }
          if (key.includes('kelvin') || key.includes('teplota') || key.includes('color') || key.includes('barva')) {
            info.colorTemp = value;
          }
          if (key.includes('rozměr') || key.includes('dimension') || key.includes('velikost') || key.includes('size')) {
            info.dimensions = value;
          }
          if (key.includes('cri')) {
            info.technicalSpecs.cri = value;
          }
          if (key.includes('stmí') || key.includes('dimming')) {
            info.technicalSpecs.dimming = value;
          }
          if (key.includes('hmotnost') || key.includes('weight')) {
            info.technicalSpecs.weight = value;
          }
          if (key.includes('napětí') || key.includes('voltage')) {
            info.technicalSpecs.voltage = value;
          }
        }
      });
    });
  }
  
  // Try to extract from text content
  const text = product.textContent || '';
  
  // Extract power (look for patterns like "1200W", "2.5KW", etc.)
  if (!info.power) {
    const powerMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:KW|kW|W|kw)/i);
    if (powerMatch) {
      info.power = powerMatch[0];
      info.technicalSpecs.wattage = powerMatch[0];
    }
  }
  
  // Extract Kelvin (look for patterns like "3200K", "5600K", "2700K-6500K")
  if (!info.colorTemp) {
    const kelvinMatch = text.match(/(\d+)\s*K(?:\s*\/\s*(\d+)\s*K)?/i);
    if (kelvinMatch) {
      if (kelvinMatch[2]) {
        info.colorTemp = `${kelvinMatch[1]}K / ${kelvinMatch[2]}K`;
      } else {
        info.colorTemp = `${kelvinMatch[1]}K`;
      }
    }
  }
  
  // Extract type (HMI, Tungsten, LED)
  if (!info.type) {
    if (text.match(/HMI/i)) {
      info.type = 'HMI';
      info.sourceType = 'HMI';
    }
    if (text.match(/Tungsten|Halogen/i)) {
      info.type = info.type ? `${info.type} / Tungsten` : 'Tungsten';
      info.sourceType = info.sourceType ? `${info.sourceType} / Tungsten` : 'Tungsten';
    }
    if (text.match(/LED/i)) {
      info.type = info.type ? `${info.type} / LED` : 'LED';
      info.sourceType = info.sourceType ? `${info.sourceType} / LED` : 'LED';
    }
  }
  
  return info;
}

// Process all products
const processedProducts = scrapedData.products
  .filter(p => !p.error && (p.headings?.length > 0 || p.paragraphs?.length > 0))
  .map(extractProductInfo)
  .filter(p => p.name || p.description); // Only products with some info

console.log(`\nExtracted ${processedProducts.length} valid products:\n`);
processedProducts.forEach((p, i) => {
  console.log(`${i + 1}. ${p.name || 'Unnamed Product'}`);
  console.log(`   Description: ${p.description.substring(0, 80)}...`);
  console.log(`   Images: ${p.images.length}`);
  console.log(`   Power: ${p.power || 'N/A'}`);
  console.log(`   Type: ${p.type || 'N/A'}`);
  console.log(`   Color Temp: ${p.colorTemp || 'N/A'}`);
  console.log(`   Tables: ${p.tables.length}`);
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
console.log('2. Run update-website-products.js to update the website');
