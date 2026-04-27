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
// HTML-escapes a string so user/RSS content can be safely inserted with .innerHTML.
// Pure string replacement — no DOM required — so this also works in Node/Jest.
export function esc(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
