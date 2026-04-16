import { CONFIG } from "./config";
export // ═════════════════════════════════════════════════
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
