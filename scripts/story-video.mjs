// Vertical 1080x1920 "life situation" video for Reels / Shorts / TikTok, built from a small JSON spec.
// Usage: npm i --no-save playwright@1.56.1 && node scripts/story-video.mjs content/videos/<slug>.json
// Spec: { "slug": "...", "hook": "Big question on screen", "hookSub": "small line under it (optional)",
//         "slides": [ { "big": "short point", "small": "one supporting line" }, ... 3–5 ],
//         "comment": "Comment call to action", "follow": "Follow line",
//         "footnote": "optional small print, e.g. NMLS #2490507 or a source" }
// Output: public/social/stories/<slug>.mp4
import { chromium } from 'playwright';
import { readFileSync, renameSync, mkdirSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const spec = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const photo = 'data:image/jpeg;base64,' + readFileSync('public/tamila-aspen.jpg').toString('base64');
const PALETTES = [
  ['#2f6d60', '#173a33'], // forest green (brand)
  ['#2d4a7a', '#152238'], // navy
  ['#b5583a', '#5e2a1c'], // terracotta
  ['#6b3f7a', '#2e1a36'], // plum
  ['#1f7a8c', '#0f3540'], // ocean teal
  ['#a8761f', '#4f3510'], // amber
  ['#8a2f4a', '#3b1220'], // berry
];
const seedOf = (s) => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const bgLayers = (starts, seed) => starts.map((t, i) => {
  const [a, b] = PALETTES[(seed + i) % PALETTES.length];
  return `<div class="bgl" style="z-index:${i - 100};background:radial-gradient(ellipse at 30% 10%,${a} 0%,${b} 100%);animation:bgin .6s ${t}s both"></div>`;
}).join('');
const FPS = 30, HOOK = 3.2, SLIDE = 3.0, END = 5.5;
const n = spec.slides.length;
const endAt = HOOK + n * SLIDE;
const DUR = endAt + END;

const screen = (start, len, inner, cls = '') =>
  `<div class="scr ${cls}" style="animation:inout ${len}s ${start}s both">${inner}</div>`;
const slides = spec.slides.map((s, i) => screen(HOOK + i * SLIDE, SLIDE,
  `<div class="num">${i + 1}/${n}</div><div class="big">${esc(s.big)}</div><div class="small">${esc(s.small)}</div>`)).join('');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1920px;overflow:hidden;font-family:'Noto Sans','DejaVu Sans','Noto Color Emoji',Arial,sans-serif;color:#fff;
 background:radial-gradient(ellipse at 30% 10%,#2f6d60 0%,#255A4F 45%,#173a33 100%)}
.bgl{position:absolute;inset:0}
@keyframes bgin{from{opacity:0}to{opacity:1}}
@keyframes inout{0%{opacity:0;transform:translateY(50px)}12%{opacity:1;transform:none}88%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-30px)}}
@keyframes up{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:none}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes prog{from{width:0}to{width:100%}}
.scr{z-index:1;position:absolute;left:90px;right:90px;top:430px;opacity:0}
.hook .big{font-size:104px;line-height:1.06}
.hook .small{font-size:46px}
.num{font-size:40px;color:#B3CAC7;letter-spacing:3px;font-weight:700}
.big{font-size:88px;line-height:1.1;font-weight:800;margin-top:20px}
.small{font-size:44px;line-height:1.35;color:#D0DEDC;margin-top:34px}
.brand{position:absolute;top:120px;left:90px;font-size:34px;letter-spacing:4px;text-transform:uppercase;color:#B3CAC7;animation:fade .6s .2s both}
.progress{position:absolute;top:190px;left:90px;right:90px;height:8px;background:rgba(255,255,255,.18);border-radius:4px;overflow:hidden}
.progress i{display:block;height:100%;background:#B3CAC7;animation:prog ${endAt}s 0s linear both}
.end{z-index:2;position:absolute;left:80px;right:80px;top:470px;background:#F7FAF9;color:#173a33;border-radius:40px;padding:60px 56px;animation:up .8s ${endAt}s both}
.end h2{font-size:58px;line-height:1.18}
.end .fol{font-size:40px;margin-top:28px;color:#255A4F;font-weight:700}
.who{display:flex;align-items:center;gap:30px;margin-top:46px}
.who img{width:150px;height:150px;border-radius:50%;object-fit:cover;object-position:top}
.nm{font-size:48px;font-weight:800;color:#255A4F}
.rl{font-size:30px;color:#4d6b64;margin-top:6px}
.foot{position:absolute;left:90px;right:90px;bottom:90px;font-size:26px;color:#B3CAC7;line-height:1.35}
</style></head><body>
${bgLayers([0, ...spec.slides.map((_, i) => HOOK + i * SLIDE), endAt], spec.seed ?? seedOf(spec.slug))}
<div class="brand">Real-life real estate</div>
<div class="progress"><i></i></div>
${screen(0, HOOK, `<div class="big">${esc(spec.hook)}</div>${spec.hookSub ? `<div class="small">${esc(spec.hookSub)}</div>` : ''}`, 'hook')}
${slides}
<div class="end">
  <h2>${esc(spec.comment)}</h2>
  <div class="fol">${esc(spec.follow)}</div>
  <div class="who"><img src="${photo}"><div><div class="nm">Tamila Aspen</div><div class="rl">Real Estate Agent &amp; Mortgage Loan Officer<br>(720) 975-6206 · denver-real-estates.com</div></div></div>
</div>
${spec.footnote ? `<div class="foot">${esc(spec.footnote)}</div>` : ''}
</body></html>`;

mkdirSync('public/social/stories', { recursive: true });
const out = resolve(`public/social/stories/${spec.slug}.mp4`);
const tmp = out.replace(/\.mp4$/, '.tmp.mp4');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.getAnimations().forEach((a) => a.pause()));
if (process.env.PREVIEW) { // PREVIEW="1.5,7,20" → JPEG stills only, no video
  for (const t of process.env.PREVIEW.split(',').map(Number)) {
    await page.evaluate((ms) => document.getAnimations().forEach((a) => { a.currentTime = ms; }), t * 1000);
    await page.screenshot({ path: `${process.env.PREVIEW_DIR || '.'}/${spec.slug}-${t}.jpg`, type: 'jpeg', quality: 80 });
  }
  await browser.close(); process.exit(0);
}
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-shortest', '-c:v', 'libx264', '-crf', '20', '-preset', 'veryfast',
  '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
for (let f = 0, total = Math.round(DUR * FPS); f < total; f++) {
  await page.evaluate((ms) => document.getAnimations().forEach((a) => { a.currentTime = ms; }), (f / FPS) * 1000);
  const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
}
ff.stdin.end();
const code = await new Promise((r) => ff.on('close', r));
await browser.close();
if (code !== 0) { console.error('ffmpeg failed', code); process.exit(1); }
renameSync(tmp, out);
console.log('wrote', `public/social/stories/${spec.slug}.mp4`, `${DUR.toFixed(1)}s`);
