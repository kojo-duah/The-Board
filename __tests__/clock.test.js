import { updateClock, updateCalendar } from "../js/clock.js";
import { CONFIG } from "../js/config.js";

describe("clock.js", () => {
  beforeEach(() => {
    CONFIG.weather.params.timezone = "America/Denver";

    document.body.innerHTML = `
      <div id="clock-time"></div>
      <div id="clock-date"></div>
      <div id="cal-month"></div>
      <div id="cal-day"></div>
      <div id="cal-weekday"></div>
    `;
  });

  test("updates clock time element", () => {
    updateClock();

    expect(document.getElementById("clock-time").innerHTML).toContain(":");
  });

  test("updates clock date element", () => {
    updateClock();

    expect(document.getElementById("clock-date").textContent.length).toBeGreaterThan(0);
  });

  test("updates calendar month", () => {
    updateCalendar();

    expect(document.getElementById("cal-month").textContent.length).toBeGreaterThan(0);
  });

  test("updates calendar day", () => {
    updateCalendar();

    expect(document.getElementById("cal-day").textContent.length).toBeGreaterThan(0);
  });

  test("updates calendar weekday", () => {
    updateCalendar();

    expect(document.getElementById("cal-weekday").textContent.length).toBeGreaterThan(0);
  });
});