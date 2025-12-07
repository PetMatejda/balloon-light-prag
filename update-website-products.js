import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROCESSED_DATA_FILE = join(__dirname, 'processed-products.json');
const MESSAGES_DIR = join(__dirname, 'messages');

if (!existsSync(PROCESSED_DATA_FILE)) {
  console.error('Processed data file not found. Please run process-and-update-products.js first.');
  process.exit(1);
}

const processedData = JSON.parse(readFileSync(PROCESSED_DATA_FILE, 'utf8'));

console.log(`Updating website with ${processedData.products.length} products...\n`);

// Map product names to translation keys
const productKeyMap = {
  'balloons': ['balón', 'balloon', 'sférické', 'koule', 'sphere'],
  'ledCube': ['led cube', 'cube', 'kostka'],
  'tube': ['tube', 'tuby', 'sirocco', 'airstar', 'válec'],
  'cloud': ['cloud', 'pad light', 'mrak'],
  'flatLight': ['flat light', 'ploché'],
  'sunCut': ['sun cut', 'suncut'],
  'underwater': ['podvodní', 'underwater', 'vodotěsné']
};

function findProductKey(productName, description) {
  const searchText = `${productName} ${description}`.toLowerCase();
  
  for (const [key, keywords] of Object.entries(productKeyMap)) {
    if (keywords.some(keyword => searchText.includes(keyword))) {
      return key;
    }
  }
  
  return null;
}

// Update translation files
const locales = ['cs', 'en', 'de', 'es', 'hu', 'it'];

locales.forEach(locale => {
  const messagesFile = join(MESSAGES_DIR, `${locale}.json`);
  
  if (!existsSync(messagesFile)) {
    console.log(`Skipping ${locale}.json (file not found)`);
    return;
  }
  
  const messages = JSON.parse(readFileSync(messagesFile, 'utf8'));
  
  // Ensure products structure exists
  if (!messages.products) {
    messages.products = {};
  }
  
  // Update each product
  processedData.products.forEach((product, index) => {
    const productKey = findProductKey(product.name, product.description);
    
    if (productKey && messages.products[productKey]) {
      // Update existing product
      console.log(`  Updating ${locale}.json: ${productKey}`);
      messages.products[productKey].name = product.name || messages.products[productKey].name;
      messages.products[productKey].description = product.description || messages.products[productKey].description;
      messages.products[productKey].power = product.power || messages.products[productKey].power || 'Variabilní';
      messages.products[productKey].sourceType = product.sourceType || messages.products[productKey].sourceType || '--';
      messages.products[productKey].colorTemp = product.colorTemp || messages.products[productKey].colorTemp || '--';
      messages.products[productKey].dimensions = product.dimensions || messages.products[productKey].dimensions || 'Na dotaz';
      messages.products[productKey].type = product.type || messages.products[productKey].type || '--';
    } else if (product.name) {
      // Add new product (use a safe key)
      const safeKey = `product${index + 1}`;
      console.log(`  Adding new product to ${locale}.json: ${safeKey} (${product.name})`);
      
      if (!messages.products[safeKey]) {
        messages.products[safeKey] = {
          name: product.name,
          description: product.description || '',
          type: product.type || '--',
          power: product.power || 'Variabilní',
          sourceType: product.sourceType || '--',
          colorTemp: product.colorTemp || '--',
          dimensions: product.dimensions || 'Na dotaz'
        };
      }
    }
  });
  
  writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
  console.log(`  ✓ Updated ${locale}.json\n`);
});

console.log('Translation files updated!');
console.log('\nNext steps:');
console.log('1. Review the updated translation files');
console.log('2. Update ProductShowcase.tsx and GearShowcase.tsx with new product images');
console.log('3. Update TechnicalSpecs.tsx with new technical specifications');
