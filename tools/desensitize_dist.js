const fs = require('fs');
const path = require('path');

let html = fs.readFileSync('dist/index.html', 'utf8');

// 1. Desensitize brand names & models
html = html.replace(/Claude Sonnet 5\.5/g, 'Frontier 5.5');
html = html.replace(/Claude Sonnet 5/g, 'Frontier 5');
html = html.replace(/Claude Sonnet/g, 'Frontier 5.5');
html = html.replace(/Sonnet 5\.5/g, 'Frontier 5.5');
html = html.replace(/Claude Code/g, 'Terminal Agent');
html = html.replace(/Claude Cowork/g, 'Collaborative Agent');
html = html.replace(/Claude\.ai/g, 'Frontier Studio');
html = html.replace(/Claude/g, 'Frontier');
html = html.replace(/Anthropic/g, 'Frontier AI');

// 2. Remove third-party trackers & tracking scripts
html = html.replace(/https:\/\/(?:www-cdn\.anthropic\.com|cdn\.sanity\.io|claude\.com|assets\.claude\.ai)[^"']*/g, '#');

// 3. Fix Turbopack base path for GitHub Pages relative loading
const baseScript = `<script>window.TURBOPACK_CHUNK_BASE_PATH = "./_next/";</script>`;
if (!html.includes('window.TURBOPACK_CHUNK_BASE_PATH')) {
  html = html.replace('<head>', '<head>' + baseScript);
}

// 4. Change absolute /_next/ to ./_next/ for CSS and preload links in head
html = html.replace(/href="\/_next\//g, 'href="./_next/');
html = html.replace(/src="\/_next\//g, 'src="./_next/');

fs.writeFileSync('dist/index.html', html);
console.log('Successfully desensitized dist/index.html and updated base path');
