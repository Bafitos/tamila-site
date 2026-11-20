// Generates a 1080x1350 social image for every blog post: public/social/<slug>.png
// Usage: npm i --no-save playwright && node scripts/social-cards.mjs [slug ...]
// Uses the post's `compare` table. Images are served at https://www.denver-real-estates.com/social/<slug>.png
import { chromium } from 'playwright';
import { posts } from '../src/data/posts.js';
import { mkdirSync, existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const only = process.argv.slice(2);
const outDir = resolve('public/social');
mkdirSync(outDir, { recursive: true });
const photo = 'data:image/jpeg;base64,' + readFileSync(resolve('public/tamila-aspen.jpg')).toString('base64');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const exec = ['/opt/pw-browsers/chromium'].find(existsSync);
const browser = await chromium.launch(exec ? { executablePath: exec } : {});
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });

for (const p of posts) {
  if (only.length && !only.includes(p.slug)) continue;
  const c = p.compare;
  const sub = p.title.includes(':') ? p.title.split(':').slice(1).join(':').trim() : 'Side-by-Side Comparison';
  const rows = c.rows.slice(0, 5).map(([l, a, b]) => `
    <div class="row"><div class="lab">${esc(l)}</div>
      <div class="cells"><div class="cell">${esc(a)}</div><div class="cell">${esc(b)}</div></div></div>`).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    *{box-sizing:border-box;margin:0}
    body{width:1080px;height:1350px;font-family:'Noto Sans','DejaVu Sans',Arial,sans-serif;background:#F7FAF9;color:#1d3b34;display:flex;flex-direction:column}
    .top{background:#255A4F;color:#fff;padding:54px 64px 46px}
    .kicker{font-size:26px;letter-spacing:3px;text-transform:uppercase;opacity:.8}
    h1{font-size:80px;line-height:1.02;margin-top:18px;font-weight:800}
    h1 span{font-weight:300;opacity:.85}
    .sub{font-size:32px;margin-top:16px;opacity:.92;line-height:1.25}
    .heads{display:flex;gap:20px;padding:30px 64px 6px 64px}
    .heads div{flex:1;font-size:30px;font-weight:800;color:#255A4F;border-bottom:4px solid #255A4F;padding-bottom:8px}
    .body{padding:0 64px;flex:1;overflow:hidden}
    .row{padding:16px 0;border-bottom:1px solid #B3CAC7}
    .lab{font-size:21px;text-transform:uppercase;letter-spacing:1.5px;color:#5c7a73;margin-bottom:8px}
    .cells{display:flex;gap:20px}
    .cell{flex:1;font-size:25px;line-height:1.28;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
    .foot{display:flex;align-items:center;gap:26px;background:#fff;padding:30px 64px;border-top:1px solid #D0DEDC}
    .foot img{width:112px;height:112px;border-radius:50%;object-fit:cover;object-position:top}
    .name{font-size:32px;font-weight:800;color:#255A4F}
    .role{font-size:22px;color:#5c7a73;margin-top:4px}
    .url{font-size:25px;margin-top:8px;color:#1d3b34}
  </style></head><body>
    <div class="top"><div class="kicker">Side-by-side comparison</div>
      <h1>${esc(c.a)} <span>vs</span> ${esc(c.b)}</h1><div class="sub">${esc(sub)}</div></div>
    <div class="heads"><div>${esc(c.a)}</div><div>${esc(c.b)}</div></div>
    <div class="body">${rows}</div>
    <div class="foot"><img src="${photo}"><div><div class="name">Tamila Aspen</div>
      <div class="role">Real Estate Agent &amp; Mortgage Loan Officer · (720) 975-6206</div>
      <div class="url">Full comparison: denver-real-estates.com/blog</div></div></div>
  </body></html>`;
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: `${outDir}/${p.slug}.png` });
  console.log('wrote', `public/social/${p.slug}.png`);
}
await browser.close();
