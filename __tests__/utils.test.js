import {
  formatTemperature,
  getWeatherDescription,
  isValidCoordinates,
  getTimeDifference,
  isValidUrl,
  formatTime12Hour
} from "../js/utils.js";

describe("formatTemperature", () => {
  test("formats fahrenheit correctly", () => {
    expect(formatTemperature(72, "fahrenheit")).toBe("72°F");
  });

  test("formats celsius correctly", () => {
    expect(formatTemperature(21, "celsius")).toBe("21°C");
  });

  test("rounds down temperature", () => {
    expect(formatTemperature(72.9, "fahrenheit")).toBe("72°F");
  });
});

describe("getWeatherDescription", () => {
  test("returns correct description for known code", () => {
    expect(getWeatherDescription(0)).toBe("Clear");
  });

  test("returns Unknown for unknown code", () => {
    expect(getWeatherDescription(999)).toBe("Unknown");
  });
});

describe("isValidCoordinates", () => {
  test("returns true for valid coordinates", () => {
    expect(isValidCoordinates(39.7385, -104.9849)).toBe(true);
  });

  test("returns false for invalid latitude", () => {
    expect(isValidCoordinates(100, -104.9849)).toBe(false);
  });

  test("returns false for invalid longitude", () => {
    expect(isValidCoordinates(39.7385, -200)).toBe(false);
  });

  test("returns false for non-number values", () => {
    expect(isValidCoordinates("39", -104.9849)).toBe(false);
  });
});

describe("getTimeDifference", () => {
  test("returns difference in milliseconds", () => {
    const date1 = new Date("2024-01-01T00:00:00");
    const date2 = new Date("2024-01-01T00:00:10");
    expect(getTimeDifference(date1, date2)).toBe(10000);
  });
});

describe("isValidUrl", () => {
  test("returns true for valid https url", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
  });

  test("returns true for valid http url", () => {
    expect(isValidUrl("http://example.com")).toBe(true);
  });

  test("returns false for invalid url", () => {
    expect(isValidUrl("not-a-url")).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(isValidUrl("")).toBe(false);
  });
});

describe("formatTime12Hour", () => {
  test("formats morning time correctly", () => {
    expect(formatTime12Hour(9, 5)).toBe("9:05 AM");
  });

  test("formats noon correctly", () => {
    expect(formatTime12Hour(12, 0)).toBe("12:00 PM");
  });

  test("formats midnight correctly", () => {
    expect(formatTime12Hour(0, 0)).toBe("12:00 AM");
  });

  test("formats evening time correctly", () => {
    expect(formatTime12Hour(18, 30)).toBe("6:30 PM");
  });
});