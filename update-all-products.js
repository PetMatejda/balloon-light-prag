import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COMPLETE_DATA_FILE = join(__dirname, 'scraped-products-complete.json');
const DATA_DIR = join(__dirname, 'scraped-products-data');
const MESSAGES_DIR = join(__dirname, 'messages');

if (!existsSync(COMPLETE_DATA_FILE)) {
  console.error('Complete data file not found. Please run scraping first.');
  process.exit(1);
}

const completeData = JSON.parse(readFileSync(COMPLETE_DATA_FILE, 'utf8'));

console.log('Processing scraped products data...\n');

// Map product URLs to product keys
const productUrlMap = {
  'balloon': 'balloons',
  'cube': 'ledCube',
  'tube': 'tube',
  'matrace': 'cloud',
  'flat-light': 'flatLight',
  'stative': 'stative',
  'suncut': 'sunCut',
  'no-gravity-light': 'noGravity',
  'underwater': 'underwater'
};

// Extract product info from individual files
const products = [];

const productFiles = readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
console.log(`Found ${productFiles.length} product files\n`);

productFiles.forEach(file => {
  const filePath = join(DATA_DIR, file);
  const productData = JSON.parse(readFileSync(filePath, 'utf8'));
  
  if (productData.error) return;
  
  const url = productData.url;
  const productKey = Object.keys(productUrlMap).find(key => url.includes(key));
  
  if (!productKey) {
    // Try to find from main products page
    if (url.includes('/products')) {
      return; // Skip main products page
    }
  }
  
  const info = {
    key: productUrlMap[productKey] || file.replace('.json', ''),
    name: '',
    description: '',
    type: '',
    power: '',
    sourceType: '',
    colorTemp: '',
    dimensions: '',
    images: [],
    tables: productData.tables || [],
    technicalSpecs: {}
  };
  
  // Extract name from headings
  const h1 = productData.headings?.find(h => h.level === 'h1' && !h.text.includes('Naše produkty') && !h.text.includes('Další produkty'));
  info.name = h1?.text || '';
  
  // Extract description from paragraphs (first meaningful paragraph)
  if (productData.paragraphs && productData.paragraphs.length > 0) {
    const desc = productData.paragraphs.find(p => 
      p.length > 50 && 
      !p.includes('Možnosti:') && 
      !p.includes('Detailní popis')
    ) || productData.paragraphs[0];
    info.description = desc || '';
  }
  
  // Extract from tables
  if (productData.tables && productData.tables.length > 0) {
    productData.tables.forEach(table => {
      table.rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return; // Skip header
        
        if (row.length >= 3) {
          // Model, Size, Power format
          const model = row[0];
          const size = row[1];
          const power = row[2];
          
          if (!info.power && power) {
            info.power = power;
          }
          if (!info.dimensions && size) {
            info.dimensions = size;
          }
        }
      });
    });
  }
  
  // Extract from text content
  const text = productData.textContent || '';
  
  // Extract type
  if (text.includes('LED RGBWW')) {
    info.type = 'LED';
    info.sourceType = 'LED RGBWW';
  }
  if (text.includes('Tungsten')) {
    info.type = info.type ? `${info.type} / Tungsten` : 'Tungsten';
    info.sourceType = info.sourceType ? `${info.sourceType} / Tungsten` : 'Tungsten';
  }
  if (text.includes('HMI')) {
    info.type = info.type ? `${info.type} / HMI` : 'HMI';
    info.sourceType = info.sourceType ? `${info.sourceType} / HMI` : 'HMI';
  }
  if (text.includes('Mix')) {
    info.type = info.type ? `${info.type} / Mix` : 'Mix';
  }
  
  // Extract power
  if (!info.power) {
    const powerMatch = text.match(/(\d+(?:\s*-\s*\d+)?)\s*(?:KW|kW|W|kw)/i);
    if (powerMatch) {
      info.power = powerMatch[0];
    }
  }
  
  // Extract color temp
  const kelvinMatch = text.match(/(\d+)\s*K(?:\s*\/\s*(\d+)\s*K)?/i);
  if (kelvinMatch) {
    if (kelvinMatch[2]) {
      info.colorTemp = `${kelvinMatch[1]}K / ${kelvinMatch[2]}K`;
    } else {
      info.colorTemp = `${kelvinMatch[1]}K`;
    }
  }
  
  // Get images from complete data
  const mainProduct = completeData.products.find(p => p.url === url);
  if (mainProduct && mainProduct.localImages) {
    info.images = mainProduct.localImages.filter(img => 
      img && !img.includes('logo') && !img.includes('magnifying')
    );
  }
  
  if (info.name) {
    products.push(info);
    console.log(`✓ Processed: ${info.name} (${info.key})`);
  }
});

console.log(`\nProcessed ${products.length} products\n`);

// Update translation files
const locales = ['cs', 'en', 'de', 'es', 'hu', 'it'];

locales.forEach(locale => {
  const messagesFile = join(MESSAGES_DIR, `${locale}.json`);
  
  if (!existsSync(messagesFile)) {
    console.log(`Skipping ${locale}.json (file not found)`);
    return;
  }
  
  const messages = JSON.parse(readFileSync(messagesFile, 'utf8'));
  
  if (!messages.products) {
    messages.products = {};
  }
  
  products.forEach(product => {
    if (messages.products[product.key]) {
      // Update existing
      messages.products[product.key].name = product.name || messages.products[product.key].name;
      messages.products[product.key].description = product.description || messages.products[product.key].description;
      messages.products[product.key].power = product.power || messages.products[product.key].power || 'Variabilní';
      messages.products[product.key].sourceType = product.sourceType || messages.products[product.key].sourceType || '--';
      messages.products[product.key].colorTemp = product.colorTemp || messages.products[product.key].colorTemp || '--';
      messages.products[product.key].dimensions = product.dimensions || messages.products[product.key].dimensions || 'Na dotaz';
      messages.products[product.key].type = product.type || messages.products[product.key].type || '--';
    } else {
      // Add new
      messages.products[product.key] = {
        name: product.name,
        description: product.description || '',
        type: product.type || '--',
        power: product.power || 'Variabilní',
        sourceType: product.sourceType || '--',
        colorTemp: product.colorTemp || '--',
        dimensions: product.dimensions || 'Na dotaz'
      };
    }
  });
  
  writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
  console.log(`✓ Updated ${locale}.json`);
});

// Save processed products for component updates
writeFileSync(
  join(__dirname, 'processed-products-final.json'),
  JSON.stringify({ products }, null, 2)
);

console.log('\n✓ Translation files updated!');
console.log('\nNext: Update components with new product data and images');
