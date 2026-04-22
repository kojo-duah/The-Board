import { CONFIG } from "./config.js";
import { timeAgo, esc } from "./ui.js";
// ═════════════════════════════════════════════════
// NEWS
// ═════════════════════════════════════════════════
let allNews = [], newsPage = 0;

// Fetch a single RSS feed, trying rss2json first, then CORS proxies
export async function fetchOneFeed(feed) {
  const items = [];
  const TIMEOUT = 6000;

  // Helper: fetch with timeout
    function fetchT(url) {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), TIMEOUT);
    return fetch(url, { signal: c.signal }).finally(() => clearTimeout(t));
  }

  // ── Strategy 1: rss2json.com (returns JSON, no XML parsing needed) ──
  try {
    const r = await fetchT(CONFIG.rss2jsonUrl + encodeURIComponent(feed.url));
    if (r.ok) {
      const json = await r.json();
      if (json.status === 'ok' && json.items?.length) {
        json.items.forEach(it => {
          let domain = '';
          try { domain = new URL(it.link).hostname.replace('www.',''); } catch { /*ignore invalid URL*/ }
          items.push({ title: it.title, link: it.link, pubDate: it.pubDate, source: feed.name, domain });
        });
        return items;
      }
    }
  } catch { /* try next */ }

  // ── Strategy 2: try each CORS proxy in order ──
  for (const makeUrl of CONFIG.corsProxies) {
    try {
      const r = await fetchT(makeUrl(feed.url));
      if (!r.ok) continue;
      const text = await r.text();
      const xml = new DOMParser().parseFromString(text, 'application/xml');
      const xmlItems = xml.querySelectorAll('item');
      if (xmlItems.length === 0) continue;
      xmlItems.forEach(item => {
        const title   = item.querySelector('title')?.textContent || '';
        const link    = item.querySelector('link')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        let domain = '';
        try { domain = new URL(link).hostname.replace('www.',''); } catch {/*ignore invalid URL*/}
        items.push({ title, link, pubDate, source: feed.name, domain });
      });
      return items; // success — stop trying proxies
    } catch { /* try next proxy */ }
  }

  console.warn(`All proxies failed for [${feed.name}]`);
  return items; // empty
}

export async function fetchNews() {
  const rssFeeds = CONFIG.feeds.filter(f => f.type === 'RSS');
  // Fetch ALL feeds in parallel
  const results = await Promise.allSettled(rssFeeds.map(fetchOneFeed));
  allNews = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value);
  // Sort newest first
  allNews.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate) : 0;
    const db = b.pubDate ? new Date(b.pubDate) : 0;
    return db - da;
  });
  if (allNews.length === 0) {
    allNews = [{ title: "Unable to connect — check network or proxy", source: "System", pubDate: "", link: "", domain: "" }];
  }
  newsPage = 0;
  renderNewsPage();
  renderDots();
}

export function renderNewsPage() {
  const container = document.getElementById('news-items');
  const start = newsPage * CONFIG.itemsPerPage;
  const page = allNews.slice(start, start + CONFIG.itemsPerPage);
  container.innerHTML = page.map((item, i) => {
    const ago = item.pubDate ? timeAgo(new Date(item.pubDate)) : '';
    const qrUrl = item.link
      ? `https://api.qrserver.com/v1/create-qr-code/?size=88x88&margin=0&data=${encodeURIComponent(item.link)}`
      : '';
    return `<div class="news-item" style="animation-delay:${i*0.04}s">
      <div class="news-item-body">
        <div class="news-item-title">${esc(item.title)}</div>
        <div class="news-item-meta">
          <span class="news-item-source">${item.source}</span>
          ${ago ? `<span>·</span><span>${ago}</span>` : ''}
          ${item.domain ? `<span>·</span><span class="news-item-url">${item.domain}</span>` : ''}
        </div>
      </div>
      ${qrUrl ? `<div class="news-qr"><img src="${qrUrl}" alt="QR" loading="lazy"></div>` : ''}
    </div>${i < page.length-1 ? '<div class="news-divider"></div>' : ''}`;
  }).join('');

  // Update source tag to show unique sources on this page
  const sources = [...new Set(page.map(i => i.source))];
  const tag = document.getElementById('news-source-tag');
  if (tag) tag.textContent = sources.join(' · ') || 'Feed';

  updateDots();
}

export function renderDots() {
  const t = Math.ceil(allNews.length / CONFIG.itemsPerPage);
  const el = document.getElementById('carousel-dots');
  el.innerHTML = '';
  for (let i = 0; i < t; i++) {
    const d = document.createElement('div');
    d.className = 'carousel-dot' + (i===0 ? ' active' : '');
    d.addEventListener('click', () => { newsPage = i; renderNewsPage(); });
    el.appendChild(d);
  }
}
export function updateDots() {
  document.querySelectorAll('.carousel-dot').forEach((d,i) => d.classList.toggle('active', i===newsPage));
}
export function cycleNews() {
  const t = Math.ceil(allNews.length / CONFIG.itemsPerPage);
  if (t <= 1) return;
  newsPage = (newsPage+1) % t;
  renderNewsPage();
}