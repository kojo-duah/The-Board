import { jest } from "@jest/globals";
import { CONFIG } from "../js/config.js";
import {
  fetchOneFeed,
  fetchNews,
  cycleNews
} from "../js/news.js";

describe("news.js", () => {
  let originalFeeds;
  let originalItemsPerPage;

  beforeEach(() => {
    originalFeeds = [...CONFIG.feeds];
    originalItemsPerPage = CONFIG.itemsPerPage;

    CONFIG.feeds = [
      { type: "RSS", url: "https://example.com/rss.xml", name: "Example" }
    ];
    CONFIG.itemsPerPage = 2;

    document.body.innerHTML = `
      <div id="news-items"></div>
      <div id="carousel-dots"></div>
      <div id="news-source-tag"></div>
    `;

    global.fetch = jest.fn();
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    CONFIG.feeds = originalFeeds;
    CONFIG.itemsPerPage = originalItemsPerPage;
    jest.restoreAllMocks();
  });

  test("fetchOneFeed returns RSS items from rss2json response", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "ok",
        items: [
          {
            title: "Test Article",
            link: "https://example.com/article",
            pubDate: "2026-05-06"
          }
        ]
      })
    });

    const result = await fetchOneFeed(CONFIG.feeds[0]);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Test Article");
    expect(result[0].source).toBe("Example");
    expect(result[0].domain).toBe("example.com");
  });

  test("fetchOneFeed returns empty array if all fetch attempts fail", async () => {
    fetch.mockRejectedValue(new Error("Network error"));

    const result = await fetchOneFeed(CONFIG.feeds[0]);

    expect(result).toEqual([]);
  });

  test("fetchNews renders fallback message when no news items load", async () => {
    fetch.mockRejectedValue(new Error("Network error"));

    await fetchNews();

    expect(document.getElementById("news-items").innerHTML)
      .toContain("Unable to connect");
  });

  test("fetchNews renders news items from feed", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "ok",
        items: [
          {
            title: "First Article",
            link: "https://example.com/first",
            pubDate: "2026-05-06"
          },
          {
            title: "Second Article",
            link: "https://example.com/second",
            pubDate: "2026-05-05"
          }
        ]
      })
    });

    await fetchNews();

    expect(document.getElementById("news-items").innerHTML)
      .toContain("First Article");
    expect(document.getElementById("news-items").innerHTML)
      .toContain("Second Article");
  });

  test("renderDots creates carousel dots", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "ok",
        items: [
          { title: "A", link: "https://example.com/a", pubDate: "2026-05-06" },
          { title: "B", link: "https://example.com/b", pubDate: "2026-05-05" },
          { title: "C", link: "https://example.com/c", pubDate: "2026-05-04" }
        ]
      })
    });

    await fetchNews();

    expect(document.querySelectorAll(".carousel-dot").length).toBe(2);
  });

  test("cycleNews changes active news page", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "ok",
        items: [
          { title: "A", link: "https://example.com/a", pubDate: "2026-05-06" },
          { title: "B", link: "https://example.com/b", pubDate: "2026-05-05" },
          { title: "C", link: "https://example.com/c", pubDate: "2026-05-04" }
        ]
      })
    });

    await fetchNews();

    cycleNews();

    expect(document.getElementById("news-items").innerHTML).toContain("C");
  });

  test("escapes malicious news title when rendering", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "ok",
        items: [
          {
            title: "<script>alert('xss')</script>",
            link: "https://example.com/xss",
            pubDate: "2026-05-06"
          }
        ]
      })
    });

    await fetchNews();

    const html = document.getElementById("news-items").innerHTML;

    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});