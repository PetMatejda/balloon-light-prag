console.log('Starting scrape test...');

import puppeteer from 'puppeteer';

async function test() {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    console.log('Browser launched successfully!');
    const page = await browser.newPage();
    
    console.log('Navigating to products page...');
    await page.goto('https://www.balloonlightprag.cz/products', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    
    console.log('Page loaded!');
    
    const title = await page.title();
    console.log('Page title:', title);
    
    await browser.close();
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

test();
