#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import os
from urllib.parse import urljoin, urlparse
import re
from pathlib import Path

TARGET_URL = 'https://www.balloonlightprag.cz'
OUTPUT_DIR = Path('public/images')
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def fetch_html(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()
    return response.text

def extract_image_urls(html, base_url):
    soup = BeautifulSoup(html, 'html.parser')
    image_urls = set()
    
    # Find all img tags
    for img in soup.find_all('img'):
        for attr in ['src', 'srcset', 'data-src', 'data-lazy-src', 'data-srcset']:
            if img.get(attr):
                urls = img.get(attr).split(',')
                for url in urls:
                    url = url.strip().split()[0]  # Handle srcset format
                    if url and not url.startswith('data:'):
                        full_url = urljoin(base_url, url)
                        if is_image_url(full_url):
                            image_urls.add(full_url)
    
    # Find images in style attributes
    for elem in soup.find_all(style=True):
        style = elem['style']
        bg_urls = re.findall(r'url\(["\']?([^"\')]+)["\']?\)', style)
        for url in bg_urls:
            if not url.startswith('data:'):
                full_url = urljoin(base_url, url)
                if is_image_url(full_url):
                    image_urls.add(full_url)
    
    # Find images in links (common for galleries)
    for link in soup.find_all('a', href=True):
        href = link['href']
        if re.search(r'\.(jpg|jpeg|png|gif|webp|svg)$', href, re.IGNORECASE):
            full_url = urljoin(base_url, href)
            image_urls.add(full_url)
    
    # Look for images in script tags (JSON data)
    for script in soup.find_all('script'):
        if script.string:
            json_urls = re.findall(r'"(https?://[^"]+\.(?:jpg|jpeg|png|gif|webp|svg)[^"]*)"', script.string, re.IGNORECASE)
            image_urls.update(json_urls)
    
    return list(image_urls)

def is_image_url(url):
    if not url:
        return False
    url_lower = url.lower()
    # Exclude favicons and small icons unless they're actual image files
    if 'favicon' in url_lower or ('icon' in url_lower and not re.search(r'\.(jpg|jpeg|png|gif|webp)$', url_lower)):
        return False
    return True

def get_filename_from_url(url):
    parsed = urlparse(url)
    filename = os.path.basename(parsed.path) or 'image.jpg'
    if not re.search(r'\.(jpg|jpeg|png|gif|webp|svg)$', filename, re.IGNORECASE):
        filename += '.jpg'
    # Sanitize filename
    filename = re.sub(r'[^a-zA-Z0-9._-]', '_', filename)
    return filename

def download_image(url, output_path):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    response = requests.get(url, headers=headers, timeout=30, stream=True)
    response.raise_for_status()
    
    with open(output_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    
    return output_path

def main():
    print(f'Scraping images from: {TARGET_URL}\n')
    
    try:
        # Fetch HTML
        print('Fetching HTML...')
        html = fetch_html(TARGET_URL)
        print('HTML fetched successfully.\n')
        
        # Save HTML for debugging
        with open('debug-html.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print('Saved HTML to debug-html.html for inspection.\n')
        
        # Extract image URLs
        print('Extracting image URLs...')
        image_urls = extract_image_urls(html, TARGET_URL)
        print(f'Found {len(image_urls)} unique images.')
        if image_urls:
            print('Sample URLs:')
            for i, url in enumerate(image_urls[:5], 1):
                print(f'  {i}. {url}')
        print()
        
        # Download images
        print('Downloading images...\n')
        success_count = 0
        fail_count = 0
        
        for i, url in enumerate(image_urls, 1):
            filename = get_filename_from_url(url)
            output_path = OUTPUT_DIR / filename
            
            # Skip if exists
            if output_path.exists():
                print(f'[{i}/{len(image_urls)}] Skipped (exists): {filename}')
                success_count += 1
                continue
            
            try:
                download_image(url, output_path)
                print(f'[{i}/{len(image_urls)}] Downloaded: {filename}')
                success_count += 1
            except Exception as e:
                print(f'[{i}/{len(image_urls)}] Failed: {filename} - {str(e)}')
                fail_count += 1
        
        print(f'\n=== Summary ===')
        print(f'Total images found: {len(image_urls)}')
        print(f'Successfully downloaded: {success_count}')
        print(f'Failed: {fail_count}')
        print(f'\nImages saved to: {OUTPUT_DIR.absolute()}')
        
    except Exception as e:
        print(f'Error: {str(e)}')
        import traceback
        traceback.print_exc()
        exit(1)

if __name__ == '__main__':
    main()

