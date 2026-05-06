import { timeAgo, esc } from "../js/ui.js";

describe("esc", () => {
  test("escapes script tags", () => {
    const input = "<script>alert('xss')</script>";
    const output = esc(input);

    expect(output).not.toContain("<script>");
    expect(output).toContain("&lt;script&gt;");
  });

  test("escapes image onerror attack", () => {
    const input = '<img src=x onerror="alert(1)">';
    const output = esc(input);

    expect(output).not.toContain("<img");
    expect(output).not.toContain("onerror");
    expect(output).toContain("&lt;img");
  });

  test("keeps normal text unchanged", () => {
    expect(esc("Hello world")).toBe("Hello world");
  });

  test("escapes angle brackets", () => {
    expect(esc("<div>Test</div>")).toBe("&lt;div&gt;Test&lt;/div&gt;");
  });
});

describe("timeAgo", () => {
  test("returns just now for future dates", () => {
    const future = new Date(Date.now() + 10000);
    expect(timeAgo(future)).toBe("just now");
  });

  test("returns seconds ago", () => {
    const date = new Date(Date.now() - 30 * 1000);
    expect(timeAgo(date)).toBe("30s ago");
  });

  test("returns minutes ago", () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    expect(timeAgo(date)).toBe("5m ago");
  });

  test("returns hours ago", () => {
    const date = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(timeAgo(date)).toBe("2h ago");
  });

  test("returns days ago", () => {
    const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(timeAgo(date)).toBe("3d ago");
  });

  test("returns months ago", () => {
    const date = new Date(Date.now() - 2 * 2592000 * 1000);
    expect(timeAgo(date)).toBe("2mo ago");
  });

  test("returns years ago", () => {
    const date = new Date(Date.now() - 2 * 31536000 * 1000);
    expect(timeAgo(date)).toBe("2y ago");
  });
});