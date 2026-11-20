// "<State> vs Colorado" social card (1080x1350) from the verified data behind /moving-to-colorado.
// Usage: npm i --no-save playwright@1.56.1 && node scripts/state-cards.mjs "Washington" ["Utah" ...]
// Output: public/social/states/<state-slug>-vs-colorado.png  → https://www.denver-real-estates.com/social/states/<slug>-vs-colorado.png
import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const costs = JSON.parse(readFileSync('src/data/state-costs.json', 'utf8'));
const afford = JSON.parse(readFileSync('src/data/afford.json', 'utf8'));
const names = process.argv.slice(2);
if (!names.length) { console.error('Give one or more state names'); process.exit(1); }
const outDir = resolve('public/social/states');
mkdirSync(outDir, { recursive: true });
const photo = 'data:image/jpeg;base64,' + readFileSync(resolve('public/tamila-aspen.jpg')).toString('base64');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
const month = (iso) => new Date(iso + 'T12:00:00Z').toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, '-');

function incomeTax(st) {
  const b = st.single || [];
  if (!b.length) return st.incomeNote || 'No state income tax';
  if (b.length === 1) return `Flat ${b[0][1].toFixed(2)}%`;
  return `${b[0][1]}% to ${b[b.length - 1][1]}% (${b.length} brackets)`;
}
const get = (n) => {
  const st = costs.states.find((x) => x.s.toLowerCase() === n.toLowerCase());
  if (!st) throw new Error('Unknown state: ' + n);
  return st;
};

const co = get('Colorado');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });

for (const name of names) {
  const st = get(name);
  const row = (label, a, b) => `<div class="row"><div class="lab">${esc(label)}</div><div class="cells"><div class="cell">${esc(a)}</div><div class="cell">${esc(b)}</div></div></div>`;
  const pm = month(afford.priceMonth);
  const rows = [
    row('State income tax (2026)', incomeTax(st), incomeTax(co)),
    row('Sales tax, state + avg. local (midyear 2026)', `${st.sales.toFixed(2)}%`, `${co.sales.toFixed(2)}%`),
    row('Property tax paid, % of home value (2024)', `${st.prop.toFixed(2)}% (#${st.propRank} of 50)`, `${co.prop.toFixed(2)}% (#${co.propRank} of 50)`),
    row('Avg. homeowners insurance ($300k dwelling)', `${money(st.ins)} a year`, `${money(co.ins)} a year`),
    afford.price[st.s] && row(`Median home sale price (Redfin, ${pm})`, money(afford.price[st.s]), money(afford.price['Colorado'])),
    afford.income[st.s] && row(`Median household income (Census, ${afford.incomeYear})`, money(afford.income[st.s]), money(afford.income['Colorado'])),
  ].filter(Boolean).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    *{box-sizing:border-box;margin:0}
    body{width:1080px;height:1350px;font-family:'Noto Sans','DejaVu Sans',Arial,sans-serif;background:#F7FAF9;color:#1d3b34;display:flex;flex-direction:column}
    .top{background:#255A4F;color:#fff;padding:50px 64px 40px}
    .kicker{font-size:26px;letter-spacing:3px;text-transform:uppercase;opacity:.8}
    h1{font-size:76px;line-height:1.04;margin-top:16px;font-weight:800}
    h1 span{font-weight:300;opacity:.85}
    .sub{font-size:31px;margin-top:14px;opacity:.92}
    .heads{display:flex;gap:20px;padding:28px 64px 4px}
    .heads div{flex:1;font-size:30px;font-weight:800;color:#255A4F;border-bottom:4px solid #255A4F;padding-bottom:8px}
    .body{padding:0 64px;flex:1;overflow:hidden}
    .row{padding:15px 0;border-bottom:1px solid #B3CAC7}
    .lab{font-size:20px;text-transform:uppercase;letter-spacing:1.4px;color:#5c7a73;margin-bottom:7px}
    .cells{display:flex;gap:20px}
    .cell{flex:1;font-size:29px;font-weight:700;line-height:1.25}
    .src{padding:10px 64px 14px;font-size:17px;color:#5c7a73;line-height:1.35}
    .foot{display:flex;align-items:center;gap:26px;background:#fff;padding:26px 64px;border-top:1px solid #D0DEDC}
    .foot img{width:104px;height:104px;border-radius:50%;object-fit:cover;object-position:top}
    .name{font-size:31px;font-weight:800;color:#255A4F}
    .role{font-size:21px;color:#5c7a73;margin-top:4px}
    .url{font-size:22px;margin-top:8px;white-space:nowrap}
  </style></head><body>
    <div class="top"><div class="kicker">Moving to Colorado?</div>
      <h1>${esc(st.s)} <span>vs</span> Colorado</h1><div class="sub">Taxes, Insurance and Home Prices</div></div>
    <div class="heads"><div>${esc(st.s)}</div><div>Colorado</div></div>
    <div class="body">${rows}</div>
    <div class="src">Sources: Tax Foundation 2026; Insurify (Nov 2026); Redfin; U.S. Census ACS. Your own taxes depend on income, county and city.</div>
    <div class="foot"><img src="${photo}"><div><div class="name">Tamila Aspen</div>
      <div class="role">Real Estate Agent &amp; Mortgage Loan Officer · (720) 975-6206</div>
      <div class="url">Your numbers: denver-real-estates.com/moving-to-colorado</div></div></div>
  </body></html>`;
  await page.setContent(html, { waitUntil: 'load' });
  const file = `${outDir}/${slug(st.s)}-vs-colorado.png`;
  await page.screenshot({ path: file });
  console.log('wrote', file.replace(resolve('.') + '/', ''));
}
await browser.close();
