import puppeteer from 'puppeteer';

const TARGET_URL = 'https://www.balloonlightprag.cz/products';

async function test() {
  console.log('Testing connection to:', TARGET_URL);
  
  let browser;
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 120000
    });
    console.log('Browser launched');
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('Navigating to page...');
    await page.goto(TARGET_URL, { 
      waitUntil: 'domcontentloaded',
      timeout: 120000 
    });
    console.log('Page loaded');
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Get page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Count images
    const imageCount = await page.evaluate(() => {
      return document.querySelectorAll('img').length;
    });
    console.log('Images found:', imageCount);
    
    // Count links
    const linkCount = await page.evaluate(() => {
      return document.querySelectorAll('a[href]').length;
    });
    console.log('Links found:', linkCount);
    
    // Get some sample links
    const sampleLinks = await page.evaluate(() => {
      const links = [];
      document.querySelectorAll('a[href]').forEach((link, i) => {
        if (i < 10) {
          links.push(link.href);
        }
      });
      return links;
    });
    console.log('Sample links:', sampleLinks);
    
    await browser.close();
    console.log('Test completed successfully');
    
  } catch (error) {
    console.error('Error:', error.message);
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

test();
