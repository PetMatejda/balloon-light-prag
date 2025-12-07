import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Test script starting...');
console.log('Current dir:', __dirname);

const testFile = join(__dirname, 'test-output.txt');
try {
  writeFileSync(testFile, `Test at ${new Date().toISOString()}\n`);
  console.log('File written successfully:', testFile);
} catch (e) {
  console.error('Error writing file:', e.message);
}
