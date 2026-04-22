// Utility functions for The Board

/**
 * Format temperature with unit
 * @param {number} temp - Temperature value
 * @param {string} unit - Temperature unit (fahrenheit, celsius)
 * @returns {string} Formatted temperature
 */
function formatTemperature(temp, unit = 'fahrenheit') {
    const symbol = unit === 'fahrenheit' ? '°F' : '°C';
    return `${Math.floor(temp)}${symbol}`;
}

/**
 * Parse weather code to description
 * @param {number} code - WMO weather code
 * @returns {string} Weather description
 */
function getWeatherDescription(code) {
    const WMO_TEXT = {
        0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Rime Fog', 51: 'Light Drizzle', 53: 'Drizzle',
        61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain', 71: 'Light Snow',
        73: 'Snow', 75: 'Heavy Snow', 95: 'Thunderstorm'
    };
    return WMO_TEXT[code] || 'Unknown';
}

/**
 * Validate location coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {boolean} True if coordinates are valid
 */
function isValidCoordinates(lat, lon) {
    return typeof lat === 'number' && typeof lon === 'number' &&
        lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

/**
 * Calculate time difference between two dates
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {number} Difference in milliseconds
 */
function getTimeDifference(date1, date2) {
    return Math.abs(date1 - date2);
}

/**
 * Check if a string is a valid URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid
 */
function isValidUrl(url) {
    if (!url || typeof url !== 'string') return false;
    try {
        const urlObj = new URL(url);
        // Check if protocol is http or https
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Convert time to 12-hour format
 * @param {number} hours - Hours in 24-hour format
 * @param {number} minutes - Minutes
 * @returns {string} Time in 12-hour format
 */
function formatTime12Hour(hours, minutes) {
    // Normalize hours to 0-23 range
    const normalizedHours = hours % 24;
    const period = normalizedHours >= 12 ? 'PM' : 'AM';
    const displayHours = normalizedHours % 12 || 12;
    const displayMinutes = String(minutes).padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${period}`;
}

export {
    formatTemperature,
    getWeatherDescription,
    isValidCoordinates,
    getTimeDifference,
    isValidUrl,
    formatTime12Hour
};
