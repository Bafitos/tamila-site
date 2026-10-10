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
