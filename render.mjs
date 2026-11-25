// Render broadsheet.html to a 2400x3200 PNG with Playwright + Chromium.
//   node render.mjs [output-path]
// Defaults to entry-raw.png beside this file. The browser is the cached
// Chromium 1148 build (the Playwright 1.65.1 package lives in
// ~/workspace/playwright-automation/); the VM's egress proxy blocks live
// navigation, but local file pages render fine.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire('/home/hatch/workspace/playwright-automation/package.json');
const { chromium } = require('playwright');

async function main() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const htmlPath = path.join(here, 'broadsheet.html');
  const outPath = process.argv[2] || path.join(here, 'entry-raw.png');

  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium-1148/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage({ viewport: { width: 2400, height: 3200 }, deviceScaleFactor: 1 });
  await page.goto('file://' + htmlPath);
  await page.waitForLoadState('load');
  await page.waitForTimeout(400);

  const dims = await page.evaluate(() => {
    const pg = document.querySelector('.page');
    return {
      scrollW: document.documentElement.scrollWidth,
      scrollH: document.documentElement.scrollHeight,
      pageScrollW: pg.scrollWidth,
      pageScrollH: pg.scrollHeight,
      pageClientH: pg.clientHeight,
    };
  });
  console.log('dims:', JSON.stringify(dims));

  await page.screenshot({ path: outPath, type: 'png' });
  await browser.close();

  const size = fs.statSync(outPath).size;
  console.log('wrote', outPath, size, 'bytes =', (size / 1024).toFixed(1), 'KB');
  const overflowing = dims.pageScrollW > 2400 || dims.pageScrollH > 3200;
  console.log('overflow:', overflowing ? 'YES — FIX (pageScrollH=' + dims.pageScrollH + ')' : 'none');
  if (overflowing) process.exit(1);
}

main();
