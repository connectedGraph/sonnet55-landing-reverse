const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

if (!fs.existsSync('extracted')) {
  fs.mkdirSync('extracted', { recursive: true });
}

const chunkDir = path.join('site', '_next', 'static', 'chunks');

// 1. Engine chunk: 0pjggyb0zfktw.js -> moby-hero-engine.formatted.js
const engineCode = fs.readFileSync(path.join(chunkDir, '0pjggyb0zfktw.js'), 'utf8');
fs.writeFileSync('extracted/moby-hero-engine.formatted.js', engineCode);

// 2. React component chunk: 37z3fdjldsrhc.js -> launch-hero-component.formatted.js
const compCode = fs.readFileSync(path.join(chunkDir, '37z3fdjldsrhc.js'), 'utf8');
fs.writeFileSync('extracted/launch-hero-component.formatted.js', compCode);

// 3. Asset loader chunk: 1qexg3o4du98x.js -> hero-assets.formatted.js
const assetCode = fs.readFileSync(path.join(chunkDir, '1qexg3o4du98x.js'), 'utf8');
fs.writeFileSync('extracted/hero-assets.formatted.js', assetCode);

console.log('Files copied to extracted/. Now running prettier...');

try {
  execSync('npx prettier --write "extracted/*.js"', { stdio: 'inherit' });
  console.log('Prettier formatting completed successfully.');
} catch (e) {
  console.error('Prettier formatting warning/error:', e.message);
}
