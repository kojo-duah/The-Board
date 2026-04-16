import { CONFIG } from "./config";
import { renderFeedList, settingsButton } from "./settings";
import { fetchNews, cycleNews } from "./news";
import { detectLocation } from "./location";
import { fetchWeather } from "./weather";
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
    fetchWeather();
    setInterval(fetchWeather, 15 * 60 * 1000);
}
document.addEventListener('DOMContentLoaded', init);