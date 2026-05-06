import { jest } from "@jest/globals";
import { getScene, applyBackground,renderEffects,fetchWeather } from "../js/weather.js";

function setupWeatherDom() {
  document.body.innerHTML = `
    <span class="loc-icon"></span>

    <div id="weather-bg"></div>
    <div id="weather-bg-blur"></div>
    <div id="weather-anim-overlay"></div>
    <div id="weather-effects"></div>

    <div id="w-icon"></div>
    <div id="w-temp"></div>
    <div id="w-cond"></div>
    <div id="w-hilo"></div>
    <div id="forecast-strip"></div>
  `;
}
describe("getScene", () => {
  test("returns night when isDay is false", () => {
    expect(getScene(0, false)).toBe("night");
  });

  test("returns fog for fog weather codes", () => {
    expect(getScene(45, true)).toBe("fog");
    expect(getScene(48, true)).toBe("fog");
  });

  test("returns snowy for snow codes", () => {
    expect(getScene(71, true)).toBe("snowy");
    expect(getScene(75, true)).toBe("snowy");
    expect(getScene(85, true)).toBe("snowy");
  });

  test("returns thunderstorm for storm codes", () => {
    expect(getScene(95, true)).toBe("thunderstorm");
    expect(getScene(99, true)).toBe("thunderstorm");
  });

  test("returns rainy for rain codes", () => {
    expect(getScene(51, true)).toBe("rainy");
    expect(getScene(63, true)).toBe("rainy");
    expect(getScene(80, true)).toBe("rainy");
  });

  test("returns sunny for clear sky", () => {
    expect(getScene(0, true)).toBe("sunny");
  });

  test("returns partly-cloudy for low cloud codes", () => {
    expect(getScene(1, true)).toBe("partly-cloudy");
    expect(getScene(2, true)).toBe("partly-cloudy");
  });

  test("returns cloudy for overcast code", () => {
  expect(getScene(3, true)).toBe("cloudy");
});
describe("applyBackground", () => {
  beforeEach(() => {
    setupWeatherDom();
  });

  test("applies background image and scene class", () => {
    applyBackground("sunny");

    expect(document.getElementById("weather-bg").style.backgroundImage)
      .toContain("url");
    expect(document.getElementById("weather-bg-blur").style.backgroundImage)
      .toContain("url");
    expect(document.getElementById("weather-anim-overlay").classList.contains("scene-sunny"))
      .toBe(true);
    expect(document.querySelector(".loc-icon").textContent).toBe("☀️");
  });

  test("falls back to cloudy background for unknown scene", () => {
    applyBackground("unknown-scene");

    expect(document.getElementById("weather-bg").style.backgroundImage)
      .toContain("url");
    expect(document.querySelector(".loc-icon").textContent).toBe("☁️");
  });
});

describe("renderEffects", () => {
  beforeEach(() => {
    setupWeatherDom();

    jest.spyOn(Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders rainy raindrops", () => {
    renderEffects("rainy");

    expect(document.querySelectorAll(".raindrop")).toHaveLength(80);
  });

  test("renders thunderstorm raindrops", () => {
    renderEffects("thunderstorm");

    expect(document.querySelectorAll(".raindrop")).toHaveLength(100);
  });

  test("renders snowflakes", () => {
    renderEffects("snowy");

    expect(document.querySelectorAll(".snowflake")).toHaveLength(40);
  });

  test("renders night stars", () => {
    renderEffects("night");

    expect(document.getElementById("weather-effects").children).toHaveLength(30);
  });

  test("clears previous effects for normal weather", () => {
    const effects = document.getElementById("weather-effects");
    effects.innerHTML = `<div class="raindrop"></div>`;

    renderEffects("sunny");

    expect(effects.children).toHaveLength(0);
  });
});

describe("fetchWeather", () => {
  beforeEach(() => {
    setupWeatherDom();

    global.fetch = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("fetches weather and updates weather UI", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({
        current: {
          weather_code: 0,
          is_day: 1,
          temperature_2m: 72
        },
        daily: {
          temperature_2m_max: [80, 75],
          temperature_2m_min: [60, 55],
          time: ["2026-05-06", "2026-05-07"],
          weather_code: [0, 3],
          precipitation_probability_max: [0, 40]
        }
      })
    });

    await fetchWeather();

    expect(document.getElementById("w-icon").textContent).toBe("☀️");
    expect(document.getElementById("w-temp").innerHTML).toContain("72");
    expect(document.getElementById("w-cond").textContent).toBe("Clear");
    expect(document.getElementById("w-hilo").textContent).toBe("H:80° L:60°");
    expect(document.getElementById("forecast-strip").innerHTML).toContain("Today");
    expect(document.getElementById("forecast-strip").innerHTML).toContain("💧40%");
  });

  test("shows Offline and cloudy fallback on fetch failure", async () => {
    fetch.mockRejectedValueOnce(new Error("Weather API failed"));

    await fetchWeather();

    expect(document.getElementById("w-cond").textContent).toBe("Offline");
    expect(document.getElementById("weather-anim-overlay").classList.contains("scene-cloudy"))
      .toBe(true);
  });

  test("uses fallback weather icon and text for unknown code", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({
        current: {
          weather_code: 10,
          is_day: 1,
          temperature_2m: 50
        },
        daily: {
          temperature_2m_max: [55],
          temperature_2m_min: [40],
          time: ["2026-05-06"],
          weather_code: [10],
          precipitation_probability_max: [0]
        }
      })
    });

    await fetchWeather();

    expect(document.getElementById("w-icon").textContent).toBe("🌡️");
    expect(document.getElementById("w-cond").textContent).toBe("Unknown");
    expect(document.getElementById("forecast-strip").innerHTML).toContain("🌡️");
  });
});
});