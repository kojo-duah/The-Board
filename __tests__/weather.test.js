import { getScene } from "../js/weather.js";

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
});