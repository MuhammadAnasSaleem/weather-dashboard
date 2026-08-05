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
    `https://api.open-meteo.com/v1/forecast?latitude=${cordinates.lat}&longitude=${cordinates.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weathercode,uv_index,visibility&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,weathercode&hourly=temperature_2m,weathercode&timezone=auto&forecast_days=2`,
  );
  const aqiResponse = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${cordinates.lat}&longitude=${cordinates.lon}&current=european_aqi,pm2_5&timezone=auto`,
  );
  const data = await response.json();
  const code = data.current.weathercode;
  const sunrise = data.daily.sunrise[0];
  const sunriseTime = sunrise.split("T")[1];
  const aqiData = await aqiResponse.json();
  console.log(aqiData);

  const sunset = data.daily.sunset[0];
  let sunsetTime = sunset.split("T")[1];
  const currentTime = data.current.time;
  let time = currentTime.split("T")[1];
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

  //today highlight card
  let isAM = false;
  if (Number(time.split(":")[0]) < 12) {
    isAM = true;
  }
  if (!isAM) {
    const displayHour = Number(time.split(":")[0]) - 12 || 12;
    time = displayHour + ":" + time.split(":")[1] + " PM";
  } else {
    const displayHour = Number(time.split(":")[0]) || 12;
    time = displayHour + ":" + time.split(":")[1] + " AM";
  }
  if (Number(sunsetTime.split(":")[0]) > 12) {
    const displayHour = Number(sunsetTime.split(":")[0]) - 12;
    sunsetTime = displayHour + ":" + sunsetTime.split(":")[1];
  }

  const getUvIndex = (uv) => {
    if (uv <= 2) return "Low";
    if (uv <= 5) return "Moderate";
    if (uv <= 7) return "High";
    if (uv <= 10) return "Very High";
    return "Extreme";
  };
  document.querySelector(".sunrise").textContent = `${sunriseTime} AM`;
  document.querySelector(".sunset").textContent = `${sunsetTime} PM`;
  document.querySelector(".time").textContent = `${time}`;
  document.querySelector(".uv-index").textContent = getUvIndex(
    data.current.uv_index,
  );
  // gemini code
  const uvVal = data.current.uv_index;
  const maxUv = 12;
  const circumference = 251.2;
  const offset =
    circumference - (Math.min(uvVal, maxUv) / maxUv) * circumference;
  const uvGauge = document.getElementById("uvGauge");
  const uvValue = document.getElementById("uvValue");
  if (uvGauge && uvValue) {
    uvValue.textContent = uvVal;
    uvGauge.style.strokeDashoffset = offset;
    if (uvVal <= 2) {
      uvGauge.style.stroke = "#4ade80"; // Green for safe
    } else if (uvVal <= 5) {
      uvGauge.style.stroke = "#facc15"; // Yellow for medium
    } else if (uvVal <= 7) {
      uvGauge.style.stroke = "#fb923c"; // Orange for high
    } else {
      uvGauge.style.stroke = "#ef4444"; // Red for dangerously high
    }
  }
  // gemini code
  const getAqiDescription = (aqi) => {
    if (aqi <= 20) return "Good";
    if (aqi <= 40) return "Fair";
    if (aqi <= 60) return "Moderate";
    if (aqi <= 80) return "Poor";
    if (aqi <= 100) return "Very Poor";
    return "Hazardous";
  };
  document.querySelector(".aqr-pollution").textContent =
    `Main Pollution: PM ${aqiData.current.pm2_5}`;
  document.querySelector(".aqr-number").textContent =
    aqiData.current.european_aqi;
  const aqrStatus = document.querySelector(".aqr-status");
  aqrStatus.textContent = getAqiDescription(aqiData.current.european_aqi);
  // gemini code
  const aqrMarker = document.querySelector(".aqr-bar-marker");
  if (aqrMarker) {
    aqrMarker.style.left = `${Math.min(aqiData.current.european_aqi, 100)}%`;
  }
  // gemini code


  const aqrstatusfont = (res) => {
    if (res === "Good") {
      aqrStatus.style.color = "#4ade80";
    }
    if (res === "Fair") {
      aqrStatus.style.color = "#4ade80";
    }
    if (res === "Moderate") {
      aqrStatus.style.color = "#facc15";
    }
    if (res === "Poor") {
      aqrStatus.style.color = "#fb923c";
    }
    if (res === "Very Poor") {
      aqrStatus.style.color = "#ef4444";
    }
    if (res === "Hazardous") {
      aqrStatus.style.color = "#ef4444";
    }
  };
  const getAqiMessage = (aqi) => {
    if (aqi <= 20) return "Air is fresh and healthy";
    if (aqi <= 40) return "Air quality is acceptable";
    if (aqi <= 60) return "Sensitive groups may be affected";
    if (aqi <= 80) return "Everyone may experience health effects";
    if (aqi <= 100) return "Health alert for everyone";
    return "Hazardous, avoid outdoor activities";
  };
  document.querySelector(".aqr-description").textContent = getAqiMessage(
    aqiData.current.european_aqi,
  );

  aqrstatusfont(getAqiDescription(aqiData.current.european_aqi));
};

form.addEventListener("submit", getWeather);
