import puppeteer from 'puppeteer';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || 'http://localhost:4200';
const label = process.argv[3] || 'section';
const scrollY = parseInt(process.argv[4] || '0');

const screenshotDir = join(__dirname, 'temporary screenshots');
if (!existsSync(screenshotDir)) mkdirSync(screenshotDir, { recursive: true });

const outFile = join(screenshotDir, `section-${label}.png`);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await page.addStyleTag({ content: `.reveal { opacity: 1 !important; transform: translateY(0) !important; transition: none !important; }` });
await new Promise(r => setTimeout(r, 600));
if (scrollY > 0) await page.evaluate(y => window.scrollTo(0, y), scrollY);
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: outFile, fullPage: false });
await browser.close();
console.log(`Saved: ${outFile}`);
