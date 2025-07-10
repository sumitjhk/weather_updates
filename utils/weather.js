// utils/weather.js
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = `http://api.weatherstack.com/current?access_key=${API_KEY}&query=`;

const getWeather = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}${city}`);
    const data = response.data;

    if (data.success === false) {
      return `❌ API Error: ${data.error.info}`;
    }

    if (!data.current) {
      return `❌ Could not find weather data for "${city}".`;
    }

    return `📍 ${data.location.name}, ${data.location.country}\n` +
           `🌡️ Temperature: ${data.current.temperature}°C\n` +
           `🌥️ Weather: ${data.current.weather_descriptions[0]}\n` +
           `💨 Wind: ${data.current.wind_speed} km/h`;

  } catch (error) {
    console.error("Weather fetch error:", error.message);
    return "❌ Failed to fetch weather data. Please try again later.";
  }
};

module.exports = getWeather;
