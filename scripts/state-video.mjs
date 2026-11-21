// Vertical 1080x1920, 30 fps, ~18 s video "<State> vs Colorado" for Reels / Shorts / TikTok.
// Data: src/data/state-costs.json + src/data/afford.json (same as /moving-to-colorado and state-cards.mjs).
// Usage: npm i --no-save playwright@1.56.1 && node scripts/state-video.mjs "Washington"
// Output: public/social/states/<slug>-vs-colorado.mp4 (H.264 + silent AAC, faststart)
import { chromium } from 'playwright';
import { readFileSync, renameSync, mkdirSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const name = process.argv[2];
if (!name) { console.error('Give a state name'); process.exit(1); }
const costs = JSON.parse(readFileSync('src/data/state-costs.json', 'utf8'));
const afford = JSON.parse(readFileSync('src/data/afford.json', 'utf8'));
const get = (n) => { const s = costs.states.find((x) => x.s.toLowerCase() === n.toLowerCase()); if (!s) throw new Error('Unknown state ' + n); return s; };
const st = get(name), co = get('Colorado');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
const month = (iso) => new Date(iso + 'T12:00:00Z').toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const slug = st.s.toLowerCase().replace(/[^a-z]+/g, '-');
const tax = (x) => { const b = x.single || []; if (!b.length) return x.incomeNote ? 'None on wages' : 'None'; if (b.length === 1) return `${b[0][1].toFixed(2)}% flat`; return `${b[0][1]}–${b[b.length - 1][1]}%`; };
const photo = 'data:image/jpeg;base64,' + readFileSync('public/tamila-aspen.jpg').toString('base64');

const rows = [
  ['State income tax', tax(st), tax(co)],
  ['Sales tax (state + local)', `${st.sales.toFixed(2)}%`, `${co.sales.toFixed(2)}%`],
  ['Property tax (% of value)', `${st.prop.toFixed(2)}%`, `${co.prop.toFixed(2)}%`],
  ['Home insurance / year', money(st.ins), money(co.ins)],
  afford.price[st.s] && [`Median home price (${month(afford.priceMonth)})`, money(afford.price[st.s]), money(afford.price['Colorado'])],
].filter(Boolean);

const FPS = 30, ROW0 = 2.4, STEP = 2.1;
const endAt = ROW0 + rows.length * STEP + 0.6;
const DUR = endAt + 5.5;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1920px;overflow:hidden;font-family:'Noto Sans','DejaVu Sans',Arial,sans-serif;color:#fff;
 background:radial-gradient(ellipse at 30% 10%,#2f6d60 0%,#255A4F 45%,#173a33 100%)}
@keyframes up{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:none}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes out{from{opacity:1}to{opacity:.12}}
@keyframes grow{from{width:0}to{width:100%}}
.wrap{position:absolute;inset:0;padding:150px 80px 0}
.kick{font-size:40px;letter-spacing:5px;text-transform:uppercase;color:#B3CAC7;animation:fade .6s .1s both}
h1{font-size:112px;line-height:1.02;font-weight:800;margin-top:22px;animation:up .8s .3s both}
h1 span{font-weight:300;color:#B3CAC7}
.heads{display:flex;margin-top:60px;animation:fade .6s 1.4s both}
.heads div{flex:1;font-size:44px;font-weight:800;color:#D0DEDC}
.row{margin-top:34px;padding-bottom:26px;border-bottom:2px solid rgba(208,222,220,.25);opacity:0}
.lab{font-size:34px;color:#B3CAC7;text-transform:uppercase;letter-spacing:2px}
.vals{display:flex;margin-top:10px}
.vals div{flex:1;font-size:74px;font-weight:800;line-height:1.05}
.main{animation:out .6s ${endAt}s both}
.end{position:absolute;left:80px;right:80px;bottom:220px;background:#F7FAF9;color:#173a33;border-radius:40px;padding:56px 56px 60px;animation:up .8s ${endAt + 0.1}s both}
.end h2{font-size:56px;line-height:1.15}
.url{font-size:35px;font-weight:800;color:#255A4F;margin-top:18px;white-space:nowrap}
.bar{height:8px;background:#255A4F;border-radius:4px;margin-top:26px;animation:grow 1.2s ${endAt + 0.8}s both}
.who{display:flex;align-items:center;gap:30px;margin-top:40px}
.who img{width:150px;height:150px;border-radius:50%;object-fit:cover;object-position:top}
.nm{font-size:48px;font-weight:800;color:#255A4F}
.rl{font-size:30px;color:#4d6b64;margin-top:6px}
.follow{font-size:36px;line-height:1.3;margin-top:36px;font-weight:700;animation:fade .6s ${endAt + 1.6}s both}
.src{position:absolute;left:80px;right:80px;bottom:90px;font-size:24px;color:#B3CAC7;animation:fade .6s 1.4s both}
</style></head><body>
<div class="wrap main">
  <div class="kick">Moving to Colorado?</div>
  <h1>${esc(st.s)} <span>vs</span><br>Colorado</h1>
  <div class="heads"><div>${esc(st.s)}</div><div>Colorado</div></div>
  ${rows.map(([l, a, b], i) => `<div class="row" style="animation:up .7s ${ROW0 + i * STEP}s both"><div class="lab">${esc(l)}</div><div class="vals"><div>${esc(a)}</div><div>${esc(b)}</div></div></div>`).join('')}
</div>
<div class="end">
  <h2>Compare with your own income and home price</h2>
  <div class="url">denver-real-estates.com/moving-to-colorado</div>
  <div class="bar"></div>
  <div class="who"><img src="${photo}"><div><div class="nm">Tamila Aspen</div><div class="rl">Real Estate Agent · (720) 975-6206</div></div></div>
  <div class="follow">Comment your state below — we'll compare it next.<br><span style="font-weight:400">Follow for a new state every week.</span></div>
</div>
<div class="src">Sources: Tax Foundation 2026 · Insurify Nov 2026 · Redfin</div>
</body></html>`;

mkdirSync('public/social/states', { recursive: true });
const out = resolve(`public/social/states/${slug}-vs-colorado.mp4`);
const tmp = out.replace(/\.mp4$/, '.tmp.mp4');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.getAnimations().forEach((a) => a.pause()));

const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error',
  '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo',
  '-shortest', '-c:v', 'libx264', '-crf', '20', '-preset', 'veryfast', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
const total = Math.round(DUR * FPS);
for (let f = 0; f < total; f++) {
  const ms = (f / FPS) * 1000;
  await page.evaluate((t) => document.getAnimations().forEach((a) => { a.currentTime = t; }), ms);
  const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
}
ff.stdin.end();
const code = await new Promise((r) => ff.on('close', r));
await browser.close();
if (code !== 0) { console.error('ffmpeg failed', code); process.exit(1); }
renameSync(tmp, out);
console.log('wrote', `public/social/states/${slug}-vs-colorado.mp4`, `${DUR.toFixed(1)}s`);
