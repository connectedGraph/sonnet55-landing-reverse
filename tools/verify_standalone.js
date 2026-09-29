const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function main() {
  const PORT = 9334;
  console.log(`Starting Edge in headless mode on port ${PORT}...`);
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const tempProfile = path.join(os.tmpdir(), 'edge-standalone-' + Date.now());

  const browser = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tempProfile}`,
    '--no-sandbox',
    '--use-gl=angle',
    '--enable-webgl',
    '--window-size=1440,900',
    'http://127.0.0.1:4175/standalone/'
  ]);

  browser.stderr.on('data', d => {
    const str = d.toString();
    if (str.includes('DevTools listening on')) {
      console.log('DevTools listening detected:', str.trim());
    }
  });

  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch(`http://localhost:${PORT}/json`);
      const list = await res.json();
      if (list && list.length > 0) {
        const page = list.find(p => p.type === 'page') || list[0];
        if (page && page.webSocketDebuggerUrl) {
          wsUrl = page.webSocketDebuggerUrl;
          console.log('Found page target:', page.url);
          break;
        }
      }
    } catch (e) {}
  }

  if (!wsUrl) {
    console.error('Could not connect to Edge');
    browser.kill();
    return;
  }

  const ws = new WebSocket(wsUrl);
  let id = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve } = pending.get(data.id);
      pending.delete(data.id);
      resolve(data.result);
    } else if (data.method === 'Runtime.consoleAPICalled') {
      const args = data.params.args.map(a => a.value || a.description).join(' ');
      console.log(`[Browser Console ${data.params.type}]: ${args}`);
    } else if (data.method === 'Runtime.exceptionThrown') {
      console.error(`[Browser Exception]:`, data.params.exceptionDetails.text, data.params.exceptionDetails.exception?.description);
    }
  };

  await new Promise(r => ws.onopen = r);
  console.log('Connected to CDP WebSocket!');

  await send('Runtime.enable');
  await send('Page.enable');

  console.log('Waiting 5 seconds for standalone Hero shaders & dataset to load...');
  await new Promise(r => setTimeout(r, 5000));

  // Check DOM state
  const evalResult = await send('Runtime.evaluate', {
    expression: `(() => {
      const hero = document.querySelector('section[data-hero-nav]');
      const mhFx = document.querySelector('#mh-fx');
      const mhC2 = document.querySelector('#mh-c2');
      const mhOv = document.querySelector('#mh-ov');
      const title = document.querySelector('#mh-title');
      const status = document.querySelector('#status')?.textContent;
      const canvases = Array.from(document.querySelectorAll('canvas')).map(c => ({ id: c.id, w: c.width, h: c.height }));
      return {
        status,
        canvases,
        hasMhOv: !!mhOv,
        titleText: title?.textContent,
        titleOpacity: window.getComputedStyle(title || document.body).opacity
      };
    })()`,
    returnByValue: true
  });

  console.log('\n=== Standalone Component DOM Status ===');
  console.log(JSON.stringify(evalResult.result.value, null, 2));

  // Capture screenshot
  console.log('Capturing screenshot...');
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  if (screenshot && screenshot.data) {
    const buffer = Buffer.from(screenshot.data, 'base64');
    fs.writeFileSync('standalone-preview.png', buffer);
    console.log(`Saved screenshot to standalone-preview.png (${buffer.length} bytes)`);
  }

  ws.close();
  browser.kill();
  console.log('Standalone test completed.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
