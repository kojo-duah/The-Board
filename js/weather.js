import { CONFIG, WEATHER_PHOTOS, WMO_ICON, WMO_TEXT } from "./config.js";

export function getScene(code, isDay) {
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
export function applyBackground(scene) {
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
export function renderEffects(scene) {
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
export async function fetchWeather() {
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