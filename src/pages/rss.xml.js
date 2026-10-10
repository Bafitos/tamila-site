import { site } from '../data/site.js';
import { posts } from '../data/posts.js';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export function GET() {
  const items = posts.map((p) => `<item><title>${esc(p.title)}</title><link>${site.url}/blog/${p.slug}</link><guid isPermaLink="true">${site.url}/blog/${p.slug}</guid><pubDate>${new Date(p.date + 'T15:00:00Z').toUTCString()}</pubDate><description>${esc(p.description)}</description></item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Tamila Aspen, Denver Real Estate Blog</title><link>${site.url}/blog</link><description>Side-by-side comparisons of Denver-area cities and neighborhoods.</description><language>en-us</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
