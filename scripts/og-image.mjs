// Renders scripts/og-image.html to public/og-image.jpg, the link preview image.
//
//   node scripts/og-image.mjs
//
// Headless Chrome (or Edge) screenshots the page at 1200x630, then sharp
// (already installed, Astro uses it for images) turns it into a JPEG. A JPEG
// of a photo is far smaller than a PNG, and WhatsApp skips preview images
// much over 300 KB. Set CHROME to the browser's path if it isn't found.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const source = join(root, 'scripts', 'og-image.html');
const output = join(root, 'public', 'og-image.jpg');

const browsers = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(Boolean);

const browser = browsers.find((path) => existsSync(path));
if (!browser) {
  throw new Error('No Chrome or Edge found. Set CHROME to its path.');
}

const temp = mkdtempSync(join(tmpdir(), 'og-'));
const screenshot = join(temp, 'og.png');

try {
  execFileSync(browser, [
    '--headless=new',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=1200,630',
    // Gives the fonts and the portrait time to load before the capture.
    '--virtual-time-budget=3000',
    `--user-data-dir=${join(temp, 'profile')}`,
    `--screenshot=${screenshot}`,
    pathToFileURL(source).href,
  ]);

  await sharp(screenshot)
    .resize(1200, 630, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(output);
} finally {
  rmSync(temp, { recursive: true, force: true });
}

const { width, height } = await sharp(output).metadata();
const kb = Math.round(statSync(output).size / 1024);
console.log(`Wrote public/og-image.jpg: ${width}x${height}, ${kb} KB`);
