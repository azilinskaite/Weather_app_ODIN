import "./style.css";

const buttonEl = document.querySelector("#weatherButton");
const inputEl = document.querySelector("#weatherLocation");
const weatherDisplayEl = document.querySelector("#weatherDisplay");

async function getWeatherData(location) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=8RFTMATNZP9SX3TYR9VKF4ALK&contentType=json`
  );
  const data = await response.json();
  return data.days[0];
}

buttonEl.addEventListener("click", handleClick);

async function handleClick(e) {
  e.preventDefault();
  let location = inputEl.value;
  const weatherData = await getWeatherData(location);
  updateDisplay(
    location,
    weatherData.datetime,
    weatherData.description,
    Math.round(((weatherData.temp - 32) * 5) / 9),
    Math.round(((weatherData.feelslike - 32) * 5) / 9),
    weatherData.precipprob
  );
}

function updateDisplay(
  location,
  todaysDate,
  weatherInfo,
  tempCelsius,
  realFeelCelsius,
  rainProbability
) {
  weatherDisplayEl.style.display = "block";
  weatherDisplayEl.innerHTML = `
        <h1 class="temperature">${tempCelsius}<span>&degC</span></h1>
        <h2 class="city">${location.toUpperCase()}</h2>
        <p class="description">${weatherInfo}</p>
        <div class="weather-details">
          <p class="realFeel">Feels like: <br/>
          ${realFeelCelsius}&#8451;</p>
          <p class="rain">Rain probability: <br/>
          ${rainProbability}%</p>
        </div>`;

  const weatherType = getWeatherType(weatherInfo, tempCelsius, rainProbability);
  setWeatherBackground(weatherType);
}

function setWeatherBackground(weatherType) {
  weatherDisplayEl.className = "";
  weatherDisplayEl.classList.add(weatherType);
}

function getWeatherType(weatherInfo, temperature, rainProbability) {
  if (rainProbability > 50) return "rainy";
  if (weatherInfo.toLowerCase().includes("cloud")) return "cloudy";
  if (weatherInfo.toLowerCase().includes("partly")) return "partlyCloudy";
  if (temperature > 20) return "sunny";
  return "default";
}

async function loadDefaultWeather() {
  const defaultCity = "Stockholm";
  inputEl.value = defaultCity;
  const weatherData = await getWeatherData(defaultCity);
  updateDisplay(
    defaultCity,
    weatherData.datetime,
    weatherData.description,
    Math.round(((weatherData.temp - 32) * 5) / 9),
    Math.round(((weatherData.feelslike - 32) * 5) / 9),
    weatherData.precipprob
  );
}

document.addEventListener("DOMContentLoaded", loadDefaultWeather);
