// 1) Sends denver-real-estates.com (no www) to www with a permanent redirect.
// 2) /api/rates: this week's national average mortgage rates (Freddie Mac PMMS),
//    fetched from public sources and cached for 12 hours. Updates itself every week.
// 3) Everything else: the static site.

const FALLBACK = { rate30: 7.40, rate15: 6.73, date: '2026-10-08' }; // last known values
const CACHE_SECONDS = 12 * 60 * 60;

function lastRow(csv, pick) {
  const lines = csv.trim().split(/\r?\n/);
  const head = lines[0].toLowerCase().split(',').map((s) => s.trim());
  const idx = pick(head);
  if (idx.some((i) => i < 0)) return null;
  for (let i = lines.length - 1; i > 0; i--) {
    const c = lines[i].split(',').map((s) => s.trim());
    const r30 = parseFloat(c[idx[1]]);
    const r15 = parseFloat(c[idx[2]]);
    if (Number.isFinite(r30) && Number.isFinite(r15) && r30 > 1 && r30 < 20) {
      let d = c[idx[0]];
      const m = d.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); // Freddie Mac uses m/d/yyyy
      if (m) d = `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`;
      return { rate30: r30, rate15: r15, date: d };
    }
  }
  return null;
}

const SOURCES = [
  {
    url: 'https://fred.stlouisfed.org/graph/fredgraph.csv?id=MORTGAGE30US,MORTGAGE15US',
    pick: (h) => [h.findIndex((x) => x.includes('date')), h.indexOf('mortgage30us'), h.indexOf('mortgage15us')],
  },
  {
    url: 'https://www.freddiemac.com/pmms/docs/PMMS_history.csv',
    pick: (h) => [h.indexOf('date'), h.indexOf('pmms30'), h.indexOf('pmms15')],
  },
];

async function getRates() {
  for (const s of SOURCES) {
    try {
      const r = await fetch(s.url, { headers: { 'User-Agent': 'denver-real-estates.com rate widget' }, cf: { cacheTtl: CACHE_SECONDS } });
      if (!r.ok) continue;
      const row = lastRow(await r.text(), s.pick);
      if (row) return { ...row, source: 'Freddie Mac Primary Mortgage Market Survey (national average)', live: true };
    } catch (_) { /* try next source */ }
  }
  return { ...FALLBACK, source: 'Freddie Mac Primary Mortgage Market Survey (national average)', live: false };
}

async function ratesResponse(request, ctx) {
  const cache = caches.default;
  const key = new Request(new URL('/api/rates', request.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;
  const body = JSON.stringify(await getRates());
  const res = new Response(body, {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': `public, max-age=${CACHE_SECONDS}` },
  });
  ctx.waitUntil(cache.put(key, res.clone()));
  return res;
}


// 3) /api/lead: contact form goes through here, not straight to Formspree,
//    so spam bots can't post to the Formspree address. Spam is dropped
//    silently (the bot sees "ok"); real leads are forwarded to Formspree.
// The real Formspree address lives in the Cloudflare secret FORMSPREE_URL
// (Workers -> tamila-site -> Settings -> Variables and Secrets), never in this
// public repo or in page HTML. The old, already-public form is only a fallback.
const FORMSPREE_FALLBACK = 'https://formspree.io/f/mrpekgaa';
const SITE = 'https://www.denver-real-estates.com';

function isSpam(f) {
  const v = (k) => String(f.get(k) || '').trim();
  if (v('_gotcha')) return 'honeypot';
  const t = Number(v('_t'));
  if (!t || Date.now() - t < 3000 || Date.now() - t > 1000 * 60 * 60 * 24) return 'timing';
  if (!v('goal')) return 'no-goal';
  const text = `${v('name')} ${v('message')}`;
  if (/\[url=|<a\s|https?:\/\/|www\.|\.(top|xyz|ru|cn|click|site|online)\b/i.test(text)) return 'link';
  const digits = v('phone').replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return 'phone';
  if (v('name').length > 60 || v('message').length > 3000) return 'length';
  return '';
}

async function leadResponse(request, env) {
  const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
  if (request.method !== 'POST') return json({ ok: false }, 405);
  const origin = request.headers.get('origin') || '';
  if (origin && origin !== SITE) { console.log('lead filtered: origin', origin); return json({ ok: true, filtered: true }); }
  let f;
  try { f = await request.formData(); } catch { return json({ ok: false }, 400); }
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const done = (body) => wantsJson ? json(body) : Response.redirect(`${SITE}/?sent=1`, 303);
  const reason = isSpam(f);
  if (reason) { console.log('lead filtered:', reason); return done({ ok: true, filtered: true }); }
  const out = new FormData();
  for (const [k, val] of f) if (k !== '_t' && k !== '_gotcha') out.append(k, val);
  const r = await fetch((env && env.FORMSPREE_URL) || FORMSPREE_FALLBACK, { method: 'POST', body: out, headers: { Accept: 'application/json' } });
  console.log('lead forwarded:', (env && env.FORMSPREE_URL) ? 'secret' : 'fallback', r.status);
  if (!r.ok) {
    console.log('formspree error body:', (await r.text()).slice(0, 500));
    return json({ ok: false, errors: [{ message: 'Formspree ' + r.status }] }, 502);
  }
  return done({ ok: true });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    // One hop to the canonical address: https + www.
    if (url.hostname === 'denver-real-estates.com' || url.protocol === 'http:') {
      url.hostname = 'www.denver-real-estates.com';
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === '/api/rates') return ratesResponse(request, ctx);
    if (url.pathname === '/api/lead') return leadResponse(request, env);
    const res = await env.ASSETS.fetch(request);
    // Declare the charset in the HTTP header, not only in the page.
    const type = res.headers.get('content-type') || '';
    if ((type.startsWith('text/') || type.includes('xml') || type.includes('javascript')) && !/charset/i.test(type)) {
      const out = new Response(res.body, res);
      out.headers.set('content-type', `${type}; charset=utf-8`);
      return out;
    }
    return res;
  },
};

export { lastRow }; // for tests
