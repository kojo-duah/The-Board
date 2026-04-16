import { CONFIG } from "./config";

export // ═════════════════════════════════════════════════
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