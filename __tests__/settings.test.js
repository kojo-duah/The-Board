import { CONFIG } from "../js/config.js";
import { renderFeedList, addFeed, removeFeed, settingsButton } from "../js/settings.js";
import { jest } from "@jest/globals";

describe("settings.js", () => {
  let originalFeeds;

  beforeEach(() => {
    originalFeeds = [...CONFIG.feeds];

    CONFIG.feeds = [
      { type: "RSS", url: "https://example.com/feed.xml", name: "Example" }
    ];

    document.body.innerHTML = `
      <button id="settings-btn">Open</button>
      <div id="settings-overlay" class="settings-overlay"></div>
      <button id="close-settings-btn">Done</button>
      <button id="add-feed-btn">Add</button>
      <input id="add-feed-name" value="">
      <input id="add-feed-url" value="">
      <div id="feed-list"></div>
      <div id="news-items"></div>
      <div id="carousel-dots"></div>
      <div id="news-source-tag"></div>
    `;

    global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve("")
    })
  );
  jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    CONFIG.feeds = originalFeeds;
    jest.restoreAllMocks();
  });

  test("renders feed list", () => {
    renderFeedList();

    expect(document.getElementById("feed-list").innerHTML).toContain("Example");
    expect(document.getElementById("feed-list").innerHTML).toContain("https://example.com/feed.xml");
  });

  test("adds a feed when name and url are provided", async () => {
    document.getElementById("add-feed-name").value = "NPR";
    document.getElementById("add-feed-url").value = "https://example.com/npr.xml";

    await addFeed();

    expect(CONFIG.feeds).toHaveLength(2);
    expect(CONFIG.feeds[1]).toEqual({
      type: "RSS",
      url: "https://example.com/npr.xml",
      name: "NPR"
    });
  });

  test("does not add feed when name or url is missing", () => {
    document.getElementById("add-feed-name").value = "";
    document.getElementById("add-feed-url").value = "https://example.com/feed.xml";

    addFeed();

    expect(CONFIG.feeds).toHaveLength(1);
  });

  test("removes a feed", async () => {
     await removeFeed(0);

    expect(CONFIG.feeds).toHaveLength(0);
  });

  test("opens settings panel when settings button is clicked", () => {
    settingsButton();

    document.getElementById("settings-btn").click();

    expect(document.getElementById("settings-overlay").classList.contains("open")).toBe(true);
  });

  test("closes settings panel when done button is clicked", () => {
    settingsButton();

    const overlay = document.getElementById("settings-overlay");
    overlay.classList.add("open");

    document.getElementById("close-settings-btn").click();

    expect(overlay.classList.contains("open")).toBe(false);
  });

  test("closes settings panel when clicking outside panel", () => {
    settingsButton();

    const overlay = document.getElementById("settings-overlay");
    overlay.classList.add("open");

    overlay.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(overlay.classList.contains("open")).toBe(false);
  });
});