import { CONFIG } from "./config.js";
import { renderFeedList, settingsButton } from "./settings.js";
import { fetchNews, cycleNews } from "./news.js";
import { detectLocation } from "./location.js";
import { fetchWeather } from "./weather.js";
function init() {
    //Settings
    renderFeedList();
    settingsButton();

    //News
    fetchNews();
    setInterval(fetchNews, 5* 60 * 1000);
    setInterval(cycleNews, CONFIG.cycle * 1000);

    //Location
    detectLocation();
    setInterval(detectLocation, 60 * 60 * 1000);

    //Weather
    setInterval(fetchWeather, 15 * 60 * 1000);
}
document.addEventListener('DOMContentLoaded', init);