const toggleButtons = document.querySelectorAll(".chart-toggle .toggle-btn");

toggleButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    toggleButtons.forEach((b) => b.classList.remove("toggle-active"));
    btn.classList.add("toggle-active");
  });
});

// app logic

let searchBar = document.querySelector(".search-field");
let form = document.querySelector(".search-bar");
// weather discription
const getWeatherDescription = (code) => {
  if (code === 0) return "Clear Sky";
  if (code === 1) return "Mostly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if (code === 51) return "Light Drizzle";
  if (code === 53) return "Drizzle";
  if (code === 55) return "Heavy Drizzle";
  if (code === 61) return "Light Rain";
  if (code === 63) return "Rainy";
  if (code === 65) return "Heavy Rain";
  if (code === 71) return "Light Snow";
  if (code === 73) return "Snowy";
  if (code === 75) return "Heavy Snow";
  if (code === 77) return "Snow Grains";
  if (code === 80) return "Light Showers";
  if (code === 81) return "Rain Showers";
  if (code === 82) return "Heavy Showers";
  if (code === 85 || code === 86) return "Snow Showers";
  if (code === 95) return "Thunderstorm";
  if (code === 96 || code === 99) return "Thunderstorm with Hail";
  return "Cloudy";
};
// weather card background function
const getWeatherImage = (code, time, sunrise, sunset) => {
  isNight = time < sunrise || time > sunset;
  console.log("image code working");
  if (code === 0 || code === 1)
    return isNight ? "./assets/clear-night.png" : "./assets/sunny.png";
  if (code === 2 || code === 3)
    return isNight ? "./assets/cloudy-night.png" : "./assets/cloudy.png";
  if (code >= 61 && code <= 65) return "./assets/rainy.png";
  if (code >= 71 && code <= 77) return "./assets/snowy.png";
  if (code >= 95) return "./assets/rainy.png";
  return "./assets/cloudy.png";
};
//getting response
const getCordinates = async (city) => {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`,
  );
  const data = await response.json();
  let cityName = data.results[0].name;
  let country = data.results[0].country;
  console.log(cityName, country);

  console.log(data, "getcordinates");
  return {
    lat: data.results[0].latitude,
    lon: data.results[0].longitude,
    cityName,
    country,
  };
};

const getWeather = async (event) => {
  event.preventDefault();
  let city = searchBar.value;
  const cordinates = await getCordinates(city);
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${cordinates.lat}&longitude=${cordinates.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weathercode,uv_index,visibility&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,weathercode&hourly=temperature_2m,weathercode&timezone=Asia/Karachi&forecast_days=2`,
  );
  const data = await response.json();
  const code = data.current.weathercode;
  const sunrise = data.daily.sunrise[0];
  const sunset = data.daily.sunset[0];
  const currentTime = data.current.time;
  console.log(code);

  console.log(data, "getweather");
  // getting response end here

  //weather box
  document.querySelector(".location-name").textContent =
    `${cordinates.cityName} ,${cordinates.country}`;
  document.querySelector(".weather-label").textContent =
    `Today ${getWeatherDescription(code)}`;
  document.querySelector(".weather-condition").textContent =
    getWeatherDescription(code);
  document.querySelector(".weather-temp").textContent =
    data.current.temperature_2m + "°C";
  document.querySelector(".feels-like").textContent =
    "Feels like " + data.current.apparent_temperature + "°C";
  document.querySelector(".wind").textContent =
    `${data.current.wind_speed_10m} km/h`;
  document.querySelector(".humidity").textContent =
    `${data.current.relative_humidity_2m} %`;
  document.querySelector(".visibility").textContent =
    `${(data.current.visibility / 1000).toFixed(1)} km`;

  document.querySelector(".weather-card").style.backgroundImage =
    `url(${getWeatherImage(code, currentTime, sunrise, sunset)})`;
  //weather box end here
};

form.addEventListener("submit", getWeather);
