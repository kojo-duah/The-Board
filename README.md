# DigiSign

A browser-based digital signage dashboard — clock, calendar, live weather, and a configurable RSS news feed — all on one screen. Built as Project 2 for **CS 3250 at MSU Denver**.

**Live demo:** https://kojo-duah.github.io/The-Board/

## What it does

- **Auto-detects location** (GPS with IP-based fallback) and switches the timezone, weather, and city label to match — like an iPhone when you change time zones.
- **Weather** via [Open-Meteo](https://open-meteo.com/) — no API key, current conditions + 5-day forecast.
- **Clock & calendar** pinned to the detected timezone.
- **RSS news feed** with a settings panel to add, remove, or swap sources at runtime. Falls back through multiple CORS proxies so feeds keep working.
- **Runs anywhere a browser runs** — desktop, phone, smart TV, Raspberry Pi kiosk. No install, no build step.

## Quick start

Just open `index.html` in a browser, or visit the [live site](https://kojo-duah.github.io/The-Board/).

For local development with a proper dev server (recommended, because some APIs behave better over http://):

```bash
# clone and serve
git clone https://github.com/kojo-duah/The-Board.git
cd The-Board
python3 -m http.server 8080
# open http://localhost:8080
```

When prompted, allow the page to use your location for the most accurate weather.

## Project layout

```
index.html        # entry point — wires up the UI
styles.css        # layout + widget styling (frosted glass look)
js/
  app.js          # bootstrap — kicks off location → weather → clock
  config.js       # tunables: refresh intervals, fallback city, feed list
  location.js     # GPS + reverse geocode + IP fallback
  weather.js      # Open-Meteo fetch + forecast rendering
  clock.js        # tick clock and calendar
  news.js         # RSS fetch through proxy fallback chain
  settings.js     # gear-icon panel for managing feeds
  ui.js           # shared helpers (HTML escape, time-ago)
  utils.js        # pure helpers (temp formatting, URL validation, etc.)
__tests__/        # Jest unit tests
```

## Scripts

```bash
npm install        # one-time
npm run lint       # ESLint
npm run test       # Jest (jsdom env)
npm run docs       # generate JSDoc → docs/
npm run check      # lint + test + docs (what CI runs)
```

## Deployment

`main` auto-deploys to GitHub Pages via `.github/workflows/deploy.yml`. Every push to `main` publishes a new version to https://kojo-duah.github.io/The-Board/. CI (`.github/workflows/ci.yml`) runs `npm run check` on every push and pull request.

## Contributing

1. Create a branch off `main`.
2. Make your change — keep modules small and single-purpose.
3. Run `npm run check` locally before pushing.
4. Open a pull request. CI must be green before merging.

## Team

Project 2 for **CS 3250 — Software Engineering Principles**, MSU Denver.

Built by the team:
- [Joel (kojo-duah)](https://github.com/kojo-duah)
- [Lifu (lifeoflifu)](https://github.com/lifeoflifu)
- and teammates

## License

ISC
