const fs = require('fs');
const path = require('path');

const engineRaw = fs.readFileSync('extracted/moby-hero-engine.formatted.js', 'utf8');

// Find the factory function inside TURBOPACK.push:
// (e) => { "use strict"; ... }
const startMarker = '(e) => {';
const startIdx = engineRaw.indexOf(startMarker);
const endIdx = engineRaw.lastIndexOf('},');

if (startIdx === -1 || endIdx === -1) {
  throw new Error('Could not find factory function boundaries');
}

const factoryBody = engineRaw.slice(startIdx + startMarker.length, endIdx);

const esmContent = `// Claude Sonnet 5.5 Hero WebGL2 Engine (Standalone ESM Module)
// Extracted verbatim from Turbopack chunk (module 630276)
// Zero variable-rename / pure code replication

const defaultAssets = {
  455798: new URL('./assets/rotary2.20_lzi6r3olqw.mp4', import.meta.url).href,
  403573: new URL('./assets/rotary2.1vruayv9mptfd.webm', import.meta.url).href,
  767561: new URL('./assets/rotary2.0zsu4u_1fav2-.webp', import.meta.url).href,
  130093: new URL('./assets/tach.3kl7jl8vnvi-m.mp4', import.meta.url).href,
  300427: new URL('./assets/tach.37kg1b_g5jbu4.webm', import.meta.url).href,
  92735: new URL('./assets/tach.10lkzzgnomw3p.webp', import.meta.url).href,
  661626: new URL('./assets/cupola.1w4wtudy57vux.bin', import.meta.url).href,
  862932: new URL('./assets/cupola.gz.3u6ev4phkp353.bin', import.meta.url).href,
};

let _exports = {};

function initEngine(customAssets = {}) {
  const assets = { ...defaultAssets, ...customAssets };
  const e = {
    i(id) {
      if (id === 699275) return { HERO_HEADER_CLEARANCE: 64 };
      return {};
    },
    r(id) {
      return assets[id] || '';
    },
    U: URL,
    s(tuple) {
      if (tuple && tuple[0]) {
        _exports[tuple[0]] = tuple[2];
      }
    }
  };

  // --- BEGIN ORIGINAL ENGINE CODE ---
  ${factoryBody}
  // --- END ORIGINAL ENGINE CODE ---

  return _exports;
}

initEngine();

export const mountLaunchHero = _exports.mountLaunchHero;
export default _exports;
`;

fs.writeFileSync('standalone/moby-hero.esm.js', esmContent);
console.log('Successfully generated standalone/moby-hero.esm.js');
