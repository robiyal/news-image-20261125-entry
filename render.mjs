import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire('/home/hatch/workspace/playwright-automation/package.json');
const { chromium } = require('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(here, 'broadsheet.html');
const out = process.argv[2] || path.join(here, 'entry.png');

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
const shot = await page.screenshot({ path: out, type: 'png' });
await browser.close();
const st = fs.statSync(out);
console.log('wrote', out, st.size, 'bytes =', (st.size / 1024).toFixed(1), 'KB');
console.log('overflow:', (dims.pageScrollW > 2400 || dims.pageScrollH > 3200) ? 'YES — FIX (pageScrollH=' + dims.pageScrollH + ')' : 'none');
