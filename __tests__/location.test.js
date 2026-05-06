import { jest } from "@jest/globals";
import { CONFIG } from "../js/config.js";
import { reverseGeocode, applyLocation } from "../js/location.js";

describe("location.js", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <span class="loc-icon"></span>
      <span id="loc-text"></span>

      <div class="widget-weather">
        <div class="widget-label"></div>
      </div>

      <div id="clock-time"></div>
      <div id="clock-date"></div>

      <div id="cal-month"></div>
      <div id="cal-day"></div>
      <div id="cal-weekday"></div>

      <div id="w-icon"></div>
      <div id="w-temp"></div>
      <div id="w-cond"></div>
      <div id="w-hilo"></div>
      <div id="forecast-strip"></div>

      <div id="weather-bg"></div>
      <div id="weather-bg-blur"></div>
      <div id="weather-anim-overlay"></div>
      <div id="weather-effects"></div>
    `;

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: async () => ({
          current: {
            weather_code: 0,
            is_day: 1,
            temperature_2m: 72
          },
          daily: {
            temperature_2m_max: [80],
            temperature_2m_min: [60],
            time: ["2026-05-06"],
            weather_code: [0],
            precipitation_probability_max: [0]
          }
        })
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("reverseGeocode", () => {
    test("returns city and region for US location", async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          city: "Denver",
          principalSubdivision: "Colorado",
          countryCode: "US"
        })
      });

      const result = await reverseGeocode(39.7, -104.9);

      expect(result).toBe("Denver, Colorado");
    });

    test("returns city and country for non-US location", async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          city: "Paris",
          countryCode: "FR"
        })
      });

      const result = await reverseGeocode(48.8, 2.3);

      expect(result).toBe("Paris, FR");
    });

    test("falls back to coordinates on fetch failure", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await reverseGeocode(10.12, 20.34);

      expect(result).toBe("10.12, 20.34");
    });
  });

  describe("applyLocation", () => {
    test("updates CONFIG location", () => {
      applyLocation(39.7, -104.9, "Denver, Colorado");

      expect(CONFIG.location).toEqual({
        lat: 39.7,
        lon: -104.9,
        name: "Denver, Colorado"
      });
    });

    test("updates location text in DOM", () => {
      applyLocation(39.7, -104.9, "Denver, Colorado");

      expect(document.getElementById("loc-text").textContent)
        .toBe("Denver, Colorado");
    });

    test("updates weather widget label", () => {
      applyLocation(39.7, -104.9, "Denver, Colorado");

      expect(
        document.querySelector(".widget-weather .widget-label").textContent
      ).toBe("Denver");
    });

    test("updates page title", () => {
      applyLocation(39.7, -104.9, "Denver, Colorado");

      expect(document.title).toContain("Denver, Colorado");
    });
  });
});