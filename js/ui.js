export function timeAgo(d) {
  const s = (Date.now() - d.getTime()) / 1000;
  if (s < 0) return 'just now';
  if (s < 60)    return Math.floor(s) + 's ago';
  if (s < 3600)  return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  if (s < 2592000) return Math.floor(s / 86400) + 'd ago';   // < ~30 days
  if (s < 31536000) return Math.floor(s / 2592000) + 'mo ago'; // < 365 days
  return Math.floor(s / 31536000) + 'y ago';
}
export function esc(str) { 
    const d = document.createElement('div'); 
    d.textContent = str; 
    return d.innerHTML; 
}
