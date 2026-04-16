import { CONFIG } from "./config.js";
import { fetchNews } from "./news.js";
import { esc } from "./ui.js";
export function renderFeedList() {
  const el = document.getElementById('feed-list');
  el.innerHTML = CONFIG.feeds.map((f, i) => `
    <div class="feed-row">
      <span class="feed-name">${esc(f.name)}</span>
      <span class="feed-url" title="${esc(f.url)}">${esc(f.url)}</span>
      <button class="feed-del" data-index="${i}" title="Remove">&times;</button>
    </div>`).join('');

    // attach delete listners after rendering
    attachDeleteHandlers();
    function attachDeleteHandlers() {
    const buttons = document.querySelectorAll('.feed-del');

    buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.dataset.index;
      removeFeed(index);
            });
        });
    }
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
export function settingsButton() {
    const openBtn = document.getElementById('settings-btn');
    const overlay = document.getElementById('settings-overlay');
    const closeBtn = document.getElementById('close-settings-btn');
    const addBtn = document.getElementById('add-feed-btn');

    //open panel
    openBtn.addEventListener('click', () => {
        overlay.classList.add('open');
    });

    //close panel (Done button)
    closeBtn.addEventListener('click', () => {
        overlay.classList.add('open');
    });
    
    // close when clicking outside
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            overlay.classList.remove('open');
        }
    });

    //add feed
    addBtn.addEventListener('click', () => {
        addFeed();
    });
}