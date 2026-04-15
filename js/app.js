// ═════════════════════════════════════════════════
// CONFIG
// ═════════════════════════════════════════════════
const CONFIG = {
  // Location is auto-detected via GPS. This is the fallback if denied.
  fallback: { name: "Denver, CO", lat: 39.7385, lon: -104.9849, tz: "America/Denver" },
  location: { name: "Detecting…", lat: 39.7385, lon: -104.9849 },
  weather: {
    apiUrl: "https://api.open-meteo.com/v1/forecast",
    params: {
      current: "temperature_2m,weather_code,is_day,wind_speed_10m",
      daily: "temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Denver",
      temperature_unit: "fahrenheit",
      wind_speed_unit: "mph",
      precipitation_unit: "inch",
      forecast_days: 5
    }
  },
  feeds: [
    // ── Add or remove RSS feeds here ──────────────────────────────────
    { type: "RSS", url: "https://cacm.acm.org/feed/",                         name: "CACM" },
    { type: "RSS", url: "https://feeds.bbci.co.uk/news/world/rss.xml",        name: "BBC" },
    { type: "RSS", url: "https://hnrss.org/frontpage",                        name: "HN" },
    // { type: "RSS", url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml", name: "NYT Tech" },
    // { type: "RSS", url: "https://feeds.reuters.com/reuters/topNews",        name: "Reuters" },
    // { type: "RSS", url: "https://www.npr.org/rss/rss.php?id=1001",         name: "NPR" },
    // ──────────────────────────────────────────────────────────────────
  ],
  // Multiple CORS proxies — tries each in order until one works
  corsProxies: [
    url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    url => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
    url => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  ],
  // rss2json.com converts RSS→JSON with proper CORS (most reliable)
  rss2jsonUrl: "https://api.rss2json.com/v1/api.json?rss_url=",
  cycle: 10,
  itemsPerPage: 5
};

// ═════════════════════════════════════════════════
// WEATHER BACKGROUND PHOTOS (Unsplash, free to use)
// Sized for vertical display
// ═════════════════════════════════════════════════
const WEATHER_PHOTOS = {
  sunny:         "https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=1080&h=1920&fit=crop&crop=center",
  'partly-cloudy': "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1080&h=1920&fit=crop&crop=center",
  cloudy:        "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=1080&h=1920&fit=crop&crop=top",
  rainy:         "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1080&h=1920&fit=crop&crop=center",
  snowy:         "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1080&h=1920&fit=crop&crop=center",
  night:         "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1080&h=1920&fit=crop&crop=center",
  fog:           "https://images.unsplash.com/photo-1487621167305-5d248087c724?w=1080&h=1920&fit=crop&crop=center",
  thunderstorm:  "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1080&h=1920&fit=crop&crop=center"
};

// Preload all images
Object.values(WEATHER_PHOTOS).forEach(url => { const img = new Image(); img.src = url; });

const WMO_ICON = {0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌦️',53:'🌦️',55:'🌧️',56:'🌧️',57:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',66:'🌧️',67:'🌧️',71:'🌨️',73:'🌨️',75:'❄️',77:'❄️',80:'🌦️',81:'🌧️',82:'⛈️',85:'🌨️',86:'❄️',95:'⛈️',96:'⛈️',99:'⛈️'};
const WMO_TEXT = {0:'Clear',1:'Mostly Clear',2:'Partly Cloudy',3:'Overcast',45:'Fog',48:'Rime Fog',51:'Light Drizzle',53:'Drizzle',55:'Heavy Drizzle',56:'Freezing Drizzle',57:'Hvy Freezing Drizzle',61:'Light Rain',63:'Rain',65:'Heavy Rain',66:'Freezing Rain',67:'Hvy Freezing Rain',71:'Light Snow',73:'Snow',75:'Heavy Snow',77:'Snow Grains',80:'Showers',81:'Showers',82:'Heavy Showers',85:'Snow Showers',86:'Heavy Snow',95:'Thunderstorm',96:'T-storm + Hail',99:'Severe T-storm'};

function getScene(code, isDay) {
  if (!isDay) return 'night';
  if (code === 45 || code === 48) return 'fog';
  if ((code>=71&&code<=77)||(code>=85&&code<=86)) return 'snowy';
  if (code>=95) return 'thunderstorm';
  if ((code>=51&&code<=67)||(code>=80&&code<=82)) return 'rainy';
  if (code===0) return 'sunny';
  if (code<=2) return 'partly-cloudy';
  return 'cloudy';
}

// ═════════════════════════════════════════════════
// APPLY WEATHER BACKGROUND
// ═════════════════════════════════════════════════
function applyBackground(scene) {
  const bg      = document.getElementById('weather-bg');
  const bgBlur  = document.getElementById('weather-bg-blur');
  const overlay = document.getElementById('weather-anim-overlay');
  const photoUrl = WEATHER_PHOTOS[scene] || WEATHER_PHOTOS.cloudy;

  // Sharp background (behind everything)
  bg.style.backgroundImage = `url('${photoUrl}')`;
  // Pre-blurred copy (sits just below the glass cards)
  bgBlur.style.backgroundImage = `url('${photoUrl}')`;

  // Apply scene class to the colour overlay
  const scenes = ['sunny','partly-cloudy','cloudy','rainy','thunderstorm','snowy','fog','night'];
  scenes.forEach(s => overlay.classList.remove('scene-' + s));
  overlay.classList.add('scene-' + scene);

  // Update location icon
  const iconMap = {sunny:'☀️','partly-cloudy':'⛅',cloudy:'☁️',rainy:'🌧️',snowy:'❄️',night:'🌙',fog:'🌫️',thunderstorm:'⛈️'};
  document.querySelector('.loc-icon').textContent = iconMap[scene] || '☁️';
}

// ═════════════════════════════════════════════════
// WEATHER EFFECTS
// ═════════════════════════════════════════════════
function renderEffects(scene) {
  const el = document.getElementById('weather-effects');
  el.innerHTML = '';
  if (scene === 'rainy' || scene === 'thunderstorm') {
    const count = scene === 'thunderstorm' ? 100 : 80;
    for (let i=0; i<count; i++) {
      const r = document.createElement('div'); r.className = 'raindrop';
      Object.assign(r.style, {
        left: Math.random()*100+'%', height: (14+Math.random()*24)+'px',
        animationDuration: (0.25+Math.random()*0.3)+'s',
        animationDelay: (-Math.random()*2)+'s',
        opacity: 0.2+Math.random()*0.4
      });
      el.appendChild(r);
    }
  }
  if (scene === 'snowy') {
    for (let i=0; i<40; i++) {
      const s = document.createElement('div'); s.className = 'snowflake';
      const sz = (3+Math.random()*5)+'px';
      Object.assign(s.style, {
        left: Math.random()*100+'%', width: sz, height: sz,
        animationDuration: (4+Math.random()*5)+'s',
        animationDelay: (-Math.random()*5)+'s',
        opacity: 0.2+Math.random()*0.45
      });
      el.appendChild(s);
    }
  }
  if (scene === 'night') {
    for (let i=0; i<30; i++) {
      const star = document.createElement('div');
      star.style.cssText = `position:absolute;width:2px;height:2px;border-radius:50%;background:#fff;
        opacity:${0.1+Math.random()*0.5};top:${Math.random()*60}%;left:${Math.random()*100}%;
        animation:pulse-dot ${2+Math.random()*3}s ease infinite;animation-delay:${-Math.random()*3}s;`;
      el.appendChild(star);
    }
  }
}

// ═════════════════════════════════════════════════
// CLOCK — uses detected timezone so it's always local
// ═════════════════════════════════════════════════
function updateClock() {
  const tz = CONFIG.weather.params.timezone;
  const now = new Date();
  // Format time in the detected timezone
  const timeParts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true
  }).formatToParts(now);
  const h = timeParts.find(p => p.type === 'hour')?.value || '--';
  const m = timeParts.find(p => p.type === 'minute')?.value || '--';
  const ampm = timeParts.find(p => p.type === 'dayPeriod')?.value || '';
  document.getElementById('clock-time').innerHTML = `${h}:${m}<span id="clock-ampm">${ampm}</span>`;

  const dateFmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, weekday: 'long', month: 'short', day: 'numeric'
  }).format(now);
  document.getElementById('clock-date').textContent = dateFmt;
}
setInterval(updateClock, 1000); updateClock();

// Calendar — also timezone-aware
function updateCalendar() {
  const tz = CONFIG.weather.params.timezone;
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, month: 'long', day: 'numeric', weekday: 'long'
  }).formatToParts(now);
  const month   = parts.find(p => p.type === 'month')?.value || '';
  const day     = parts.find(p => p.type === 'day')?.value || '';
  const weekday = parts.find(p => p.type === 'weekday')?.value || '';
  document.getElementById('cal-month').textContent = month.toUpperCase();
  document.getElementById('cal-day').textContent = day;
  document.getElementById('cal-weekday').textContent = weekday;
}
setInterval(updateCalendar, 60000); updateCalendar();

// ═════════════════════════════════════════════════
// WEATHER
// ═════════════════════════════════════════════════
async function fetchWeather() {
  try {
    const p = CONFIG.weather.params;
    const url = `${CONFIG.weather.apiUrl}?latitude=${CONFIG.location.lat}&longitude=${CONFIG.location.lon}`
      + `&current=${p.current}&daily=${p.daily}&timezone=${encodeURIComponent(p.timezone)}`
      + `&temperature_unit=${p.temperature_unit}&wind_speed_unit=${p.wind_speed_unit}`
      + `&precipitation_unit=${p.precipitation_unit}&forecast_days=${p.forecast_days}`;
    const res = await fetch(url);
    const data = await res.json();

    const code = data.current.weather_code;
    const isDay = data.current.is_day === 1;
    const temp = Math.round(data.current.temperature_2m);
    const hi = Math.round(data.daily.temperature_2m_max[0]);
    const lo = Math.round(data.daily.temperature_2m_min[0]);

    document.getElementById('w-icon').textContent = WMO_ICON[code] || '🌡️';
    document.getElementById('w-temp').innerHTML = `${temp}<span class="w-temp-unit">°F</span>`;
    document.getElementById('w-cond').textContent = WMO_TEXT[code] || 'Unknown';
    document.getElementById('w-hilo').textContent = `H:${hi}° L:${lo}°`;

    const scene = getScene(code, isDay);
    applyBackground(scene);
    renderEffects(scene);
    // Forecast
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const strip = document.getElementById('forecast-strip');
    strip.innerHTML = '';
    for (let i = 0; i < data.daily.time.length; i++) {
      const d = new Date(data.daily.time[i]+'T12:00:00');
      const label = i===0 ? 'Today' : dayNames[d.getDay()];
      const dc = data.daily.weather_code[i];
      const dhi = Math.round(data.daily.temperature_2m_max[i]);
      const precip = data.daily.precipitation_probability_max[i];
      strip.innerHTML += `<div class="glass">
        <div class="fc-day">${label}</div><div class="fc-icon">${WMO_ICON[dc]||'🌡️'}</div>
        <div class="fc-temp">${dhi}°</div>
        <div class="fc-precip">${precip>10 ? '💧'+precip+'%' : ''}</div>
      </div>`;
    }
  } catch(e) {
    console.error('Weather error:', e);
    document.getElementById('w-cond').textContent = 'Offline';
    // Fallback background
    applyBackground('cloudy');
  }
}

// ═════════════════════════════════════════════════
// NEWS
// ═════════════════════════════════════════════════
let allNews = [], newsPage = 0;

// Fetch a single RSS feed, trying rss2json first, then CORS proxies
async function fetchOneFeed(feed) {
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
          try { domain = new URL(it.link).hostname.replace('www.',''); } catch(_){}
          items.push({ title: it.title, link: it.link, pubDate: it.pubDate, source: feed.name, domain });
        });
        return items;
      }
    }
  } catch(_) { /* try next */ }

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
        try { domain = new URL(link).hostname.replace('www.',''); } catch(_){}
        items.push({ title, link, pubDate, source: feed.name, domain });
      });
      return items; // success — stop trying proxies
    } catch(_) { /* try next proxy */ }
  }

  console.warn(`All proxies failed for [${feed.name}]`);
  return items; // empty
}

async function fetchNews() {
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

function renderNewsPage() {
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

function renderDots() {
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
function updateDots() {
  document.querySelectorAll('.carousel-dot').forEach((d,i) => d.classList.toggle('active', i===newsPage));
}
function cycleNews() {
  const t = Math.ceil(allNews.length / CONFIG.itemsPerPage);
  if (t <= 1) return;
  newsPage = (newsPage+1) % t;
  renderNewsPage();
}
function timeAgo(d) {
  const s = (Date.now() - d.getTime()) / 1000;
  if (s < 0) return 'just now';
  if (s < 60)    return Math.floor(s) + 's ago';
  if (s < 3600)  return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  if (s < 2592000) return Math.floor(s / 86400) + 'd ago';   // < ~30 days
  if (s < 31536000) return Math.floor(s / 2592000) + 'mo ago'; // < 365 days
  return Math.floor(s / 31536000) + 'y ago';
}
function esc(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }

// ═════════════════════════════════════════════════
// SETTINGS PANEL — manage RSS feeds at runtime
// ═════════════════════════════════════════════════
function renderFeedList() {
  const el = document.getElementById('feed-list');
  el.innerHTML = CONFIG.feeds.map((f, i) => `
    <div class="feed-row">
      <span class="feed-name">${esc(f.name)}</span>
      <span class="feed-url" title="${esc(f.url)}">${esc(f.url)}</span>
      <button class="feed-del" onclick="removeFeed(${i})" title="Remove">&times;</button>
    </div>`).join('');
}
function addFeed() {
  const nameEl = document.getElementById('add-feed-name');
  const urlEl  = document.getElementById('add-feed-url');
  const name = nameEl.value.trim();
  const url  = urlEl.value.trim();
  if (!name || !url) return;
  CONFIG.feeds.push({ type: "RSS", url, name });
  nameEl.value = ''; urlEl.value = '';
  renderFeedList();
  fetchNews();
}
function removeFeed(i) {
  CONFIG.feeds.splice(i, 1);
  renderFeedList();
  fetchNews();
}

// ═════════════════════════════════════════════════
// AUTO-DETECT LOCATION — like iPhone auto-switching
// Uses GPS → reverse geocode for city name → updates everything
// ═════════════════════════════════════════════════
async function reverseGeocode(lat, lon) {
  // Open-Meteo has a free geocoding API (no key needed)
  try {
    const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const d = await r.json();
    const city = d.city || d.locality || d.principalSubdivision || '';
    const region = d.principalSubdivision || '';
    const country = d.countryCode || '';
    if (city && region && country === 'US') return `${city}, ${region}`;
    if (city && country) return `${city}, ${country}`;
    if (city) return city;
    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
  } catch(_) {
    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
  }
}

function applyLocation(lat, lon, name) {
  CONFIG.location = { name, lat, lon };
  // Detect timezone from the browser (matches the physical location)
  CONFIG.weather.params.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Update UI labels
  document.getElementById('loc-text').textContent = name;
  document.querySelector('.widget-weather .widget-label').textContent = name.split(',')[0];
  document.title = `DigiSign — ${name}`;
  // Refresh everything with new location
  updateClock();
  updateCalendar();
  fetchWeather();
}

async function detectLocation() {
  // Try GPS first
  if ('geolocation' in navigator) {
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false, timeout: 8000, maximumAge: 300000
        });
      });
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const name = await reverseGeocode(lat, lon);
      applyLocation(lat, lon, name);
      return;
    } catch(e) {
      console.warn('Geolocation denied/failed:', e.message);
    }
  }

  // Fallback: try IP-based geolocation (no permission needed)
  try {
    const r = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) });
    const d = await r.json();
    if (d.latitude && d.longitude) {
      const name = d.city && d.region
        ? `${d.city}, ${d.country === 'US' ? d.region : d.country_name}`
        : CONFIG.fallback.name;
      CONFIG.weather.params.timezone = d.timezone || CONFIG.weather.params.timezone;
      applyLocation(d.latitude, d.longitude, name);
      return;
    }
  } catch(_) { console.warn('IP geolocation failed'); }

  // Final fallback: use hardcoded Denver
  console.log('Using fallback location: Denver, CO');
  const fb = CONFIG.fallback;
  CONFIG.weather.params.timezone = fb.tz;
  applyLocation(fb.lat, fb.lon, fb.name);
}

// ═════════════════════════════════════════════════
// INIT
// ═════════════════════════════════════════════════
renderFeedList();
fetchNews();
setInterval(fetchNews, 5*60*1000);
setInterval(cycleNews, CONFIG.cycle*1000);
// Detect location first, which triggers fetchWeather
detectLocation();
// Re-check weather every 15 min, re-check location every hour
setInterval(fetchWeather, 15*60*1000);
setInterval(detectLocation, 60*60*1000);
