import { writeFileSync } from 'fs';

console.log('Script starting...');
writeFileSync('quick-test-output.txt', `Test at ${new Date().toISOString()}\n`);
console.log('File written!');
