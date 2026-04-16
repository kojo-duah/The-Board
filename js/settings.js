export function renderFeedList() {
  const el = document.getElementById('feed-list');
  el.innerHTML = CONFIG.feeds.map((f, i) => `
    <div class="feed-row">
      <span class="feed-name">${esc(f.name)}</span>
      <span class="feed-url" title="${esc(f.url)}">${esc(f.url)}</span>
      <button class="feed-del" onclick="removeFeed(${i})" title="Remove">&times;</button>
    </div>`).join('');
}
export function addFeed() {
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
export function removeFeed(i) {
  CONFIG.feeds.splice(i, 1);
  renderFeedList();
  fetchNews();
}