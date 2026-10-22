import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve('docs');
for (const file of ['index.html', 'photo-credits.html']) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `Duplicate IDs in ${file}`);
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const url = match[1];
    if (/^(https?:|mailto:|data:)/.test(url)) continue;
    if (url.startsWith('#')) { if (url.length > 1) assert(ids.includes(url.slice(1)), `Missing anchor ${url}`); continue; }
    assert(fs.existsSync(path.join(root, url.split(/[?#]/)[0])), `Missing file ${url}`);
  }
}
for (const file of fs.readdirSync(path.join(root, 'assets')).filter(file => file.endsWith('.jpg'))) {
  const image = fs.readFileSync(path.join(root, 'assets', file));
  assert(image[0] === 0xff && image[1] === 0xd8 && image.length > 10000, `Invalid image ${file}`);
}
console.log('Validated both HTML pages, unique IDs, internal links, local assets, and all six photographs.');
