import { CONFIG, WEATHER_PHOTOS, WMO_ICON, WMO_TEXT } from "./config";

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