const fs = require('fs');
const path = require('path');

const extractedHero = fs.readFileSync('standalone/extracted-hero.css', 'utf8');
const baseCss = fs.readFileSync('dist/_next/static/chunks/2gepcixj9k_19.css', 'utf8');

// Combine base theme variables + hero styles
const combined = `/* Frontier 5.5 Standalone WebGL2 Hero Styles (Self-contained) */

:root {
  --hero-light: #edebe3;
  --hero-dark: #141413;
  --hero-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --caption: 14px;
  --body-4: 12px;
  --bg-primary: #141413;
  --text-primary: #edebe3;
}

body {
  margin: 0;
  padding: 0;
  background: #141413;
  color: #edebe3;
  font-family: var(--hero-sans);
  overflow-x: hidden;
}

/* Base Stage and Overlay Layout */
.stage {
  isolation: isolate;
  height: 100lvh;
  position: sticky;
  top: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#mh-fx {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

#mh-c2 {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

#mh-ov {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
}

#mh-title {
  fill: #edebe3;
  font-family: var(--hero-sans);
  font-weight: 500;
  filter: url(#mh-title-glow);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.landing {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 80px;
}

.landing .eyebrow {
  margin: 0 0 16px 0;
  font-size: 13px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(237, 235, 227, 0.7);
}

.landing .toc {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 20px;
  pointer-events: auto;
}

.landing .toc a {
  color: rgba(237, 235, 227, 0.75);
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;
}

.landing .toc a:hover {
  color: #fff;
}

.skipbtn {
  display: none;
}

/* Extracted Original Animation Rules */
${extractedHero}
`;

fs.writeFileSync('standalone/hero.css', combined);
console.log('Generated standalone/hero.css successfully');
