export const CONFIG = {
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
export const WEATHER_PHOTOS = {
  sunny:         "https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=1080&h=1920&fit=crop&crop=center",
  'partly-cloudy': "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1080&h=1920&fit=crop&crop=center",
  cloudy:        "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=1080&h=1920&fit=crop&crop=top",
  rainy:         "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1080&h=1920&fit=crop&crop=center",
  snowy:         "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1080&h=1920&fit=crop&crop=center",
  night:         "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1080&h=1920&fit=crop&crop=center",
  fog:           "https://images.unsplash.com/photo-1487621167305-5d248087c724?w=1080&h=1920&fit=crop&crop=center",
  thunderstorm:  "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1080&h=1920&fit=crop&crop=center"
};
export const WMO_ICON = {0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌦️',53:'🌦️',55:'🌧️',56:'🌧️',57:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',66:'🌧️',67:'🌧️',71:'🌨️',73:'🌨️',75:'❄️',77:'❄️',80:'🌦️',81:'🌧️',82:'⛈️',85:'🌨️',86:'❄️',95:'⛈️',96:'⛈️',99:'⛈️'};
export const WMO_TEXT = {0:'Clear',1:'Mostly Clear',2:'Partly Cloudy',3:'Overcast',45:'Fog',48:'Rime Fog',51:'Light Drizzle',53:'Drizzle',55:'Heavy Drizzle',56:'Freezing Drizzle',57:'Hvy Freezing Drizzle',61:'Light Rain',63:'Rain',65:'Heavy Rain',66:'Freezing Rain',67:'Hvy Freezing Rain',71:'Light Snow',73:'Snow',75:'Heavy Snow',77:'Snow Grains',80:'Showers',81:'Showers',82:'Heavy Showers',85:'Snow Showers',86:'Heavy Snow',95:'Thunderstorm',96:'T-storm + Hail',99:'Severe T-storm'};
