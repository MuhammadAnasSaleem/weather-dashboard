const toggleButtons = document.querySelectorAll(".chart-toggle .toggle-btn");

toggleButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    toggleButtons.forEach((b) => b.classList.remove("toggle-active"));
    btn.classList.add("toggle-active");
    if (btn.textContent === "Daily") {
      dailyRender(weatherData);
    } else {
      hourlyRender(weatherData);
    }
  });
});

// app logic
let weatherData = null;
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
const getTommorowImage = (code) => {
  if (code === 0 || code === 1) return "./assets/tommorow-sunny.png";
  if (code === 2 || code === 3) return "./assets/tommorow-cloudy.png";
  if (code >= 61 && code <= 65) return "./assets/tomorow-rainy.png";
  if (code >= 95) return "./assets/tommorow-windy.png";
  return "./assets/tommorow-cloudy.png";
};
const getUvIndex = (uv) => {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
};
const getAqiDescription = (aqi) => {
  if (aqi <= 20) return "Good";
  if (aqi <= 40) return "Fair";
  if (aqi <= 60) return "Moderate";
  if (aqi <= 80) return "Poor";
  if (aqi <= 100) return "Very Poor";
  return "Hazardous";
};
const getAqiMessage = (aqi) => {
  if (aqi <= 20) return "Air is fresh and healthy";
  if (aqi <= 40) return "Air quality is acceptable";
  if (aqi <= 60) return "Sensitive groups may be affected";
  if (aqi <= 80) return "Everyone may experience health effects";
  if (aqi <= 100) return "Health alert for everyone";
  return "Hazardous, avoid outdoor activities";
};
const getDailyIcon = (code) => {
  if (code === 0 || code === 1)
    return "./assets/afternoon-removebg-preview.png";
  return "./assets/evening-removebg-preview.png";
};

const dailyRender = (data) => {
  const chartData = document.querySelector(".chart-data");
  chartData.innerHTML = ``;
  const dates = data.daily.time;
  dates.forEach((day, index) => {
    const date = day.split("-")[2];
    const temp = data.daily.temperature_2m_max[index];
    const code = data.daily.weathercode[index];
    const card = document.createElement("div");
    card.classList.add("chart-data-items");
    card.style.animationDelay = `${index * 0.05}s`;
    card.innerHTML = `
    <p class="chart-data-time">${date}</p>
                <img class="chart-data-img" src="${getDailyIcon(code)}" alt="Night">
                <p class="chart-data-temp">${temp}°C</p>
    `;
    chartData.appendChild(card);
    console.log(date, temp);
  });
};
const getHourlyIcon = (hour) => {
  if (hour >= 5 && hour < 7) return "./assets/sunrise-removebg-preview.png";
  if (hour >= 7 && hour < 12) return "./assets/afternoon-removebg-preview.png";
  if (hour >= 12 && hour < 17) return "./assets/evening-removebg-preview.png";
  if (hour >= 17 && hour < 20) return "./assets/night-removebg-preview.png";
  if (hour >= 20 && hour < 24) return "./assets/midnight-removebg-preview.png";
  return "./assets/midnight-removebg-preview.png";
};

const hourlyRender = (data) => {
  const chartData = document.querySelector(".chart-data");
  chartData.innerHTML = ``;
  const currentHour = Number(data.current.time.split("T")[1].split(":")[0]);
  console.log(currentHour);
  const hours = [
    currentHour,
    currentHour + 2,
    currentHour + 4,
    currentHour + 6,
    currentHour + 8,
  ];
  hours.forEach((hour, index) => {
    let rawHour = Number(data.hourly.time[hour].split("T")[1].split(":")[0]);
    let displayTime;
    let isAM = false;
    if (rawHour < 12) {
      isAM = true;
    }
    if (!isAM) {
      const displayHour = rawHour - 12 || 12;
      displayTime = displayHour + "PM";
      // time = displayHour + ":" + time.split(":")[1] + " PM";
    } else {
      const displayHour = rawHour || 12;
      displayTime = displayHour + "AM";
    }
    const temp = data.hourly.temperature_2m[hour];
    const code = data.hourly.weathercode[hour];
    const card = document.createElement("div");
    card.classList.add("chart-data-items");
    card.style.animationDelay = `${index * 0.05}s`;
    card.innerHTML = `
    <p class="chart-data-time">${displayTime}</p>
                <img class="chart-data-img" src="${getHourlyIcon(rawHour)}" alt="Night">
                <p class="chart-data-temp">${temp}°C</p>
    `;
    chartData.appendChild(card);

    console.log(rawHour, temp, code);
  });
};
//getting response
const getCordinates = async (city) => {
  if (city != "") {
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
  } else {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            console.log("location granted", pos);
            resolve(pos);
          },
          (err) => {
            console.log("location denied", err);
            reject(err);
          },
        );
      });
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      );
      const data = await response.json();
      console.log(data, "reversecall");

      const cityName = data.address.city.split(" ")[0];
      const country = data.address.country;
      console.log(cityName);

      return {
        lat,
        lon,
        cityName,
        country,
      };
    } catch {
      console.log("catch working");

      return {
        lat: 24.85,
        lon: 66.99,
        cityName: "karaci",
        country: "Pakistan1",
      };
    }
  }
};

const getWeather = async (event) => {
  if (event) event.preventDefault();
  let city = searchBar.value;

  const cordinates = await getCordinates(city);
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${cordinates.lat}&longitude=${cordinates.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weathercode,uv_index,visibility&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,weathercode&hourly=temperature_2m,weathercode&timezone=auto&forecast_days=5&past_days=0`,
  );
  const aqiResponse = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${cordinates.lat}&longitude=${cordinates.lon}&current=european_aqi,pm2_5&timezone=auto`,
  );
  const data = await response.json();
  weatherData = data;
  hourlyRender(weatherData);
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

  document.querySelector(".aqr-description").textContent = getAqiMessage(
    aqiData.current.european_aqi,
  );

  aqrstatusfont(getAqiDescription(aqiData.current.european_aqi));

  document.querySelector(".tomorrow-location").textContent =
    `${cordinates.cityName} ,${cordinates.country}`;
  document.querySelector(".tomorrow-temp").textContent =
    data.daily.temperature_2m_max[0] + "°C";
  document.querySelector(".tomorrow-condition").textContent =
    getWeatherDescription(data.daily.weathercode[0]);
  document.querySelector(".tomorrow-card").style.backgroundImage =
    `url(${getTommorowImage(data.daily.weathercode[0])})`;
  // console.log(data.dai);

  searchBar.value = "";
};
getWeather();
form.addEventListener("submit", getWeather);

// ── Mobile Sidebar Toggle ──
const hamburgerBtn = document.getElementById("hamburgerBtn");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

const openSidebar = () => {
  sidebar.classList.add("open");
  sidebarOverlay.classList.add("active");
  hamburgerBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  hamburgerBtn.setAttribute("aria-expanded", "true");
};

const closeSidebar = () => {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("active");
  hamburgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  hamburgerBtn.setAttribute("aria-expanded", "false");
};

hamburgerBtn.addEventListener("click", () => {
  if (sidebar.classList.contains("open")) {
    closeSidebar();
  } else {
    openSidebar();
  }
});

sidebarOverlay.addEventListener("click", closeSidebar);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && sidebar.classList.contains("open")) {
    closeSidebar();
  }
});

// Close sidebar when a nav item is clicked (mobile UX)
document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  });
});
// this is for directly jumping to searchbar
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== searchBar) {
    e.preventDefault();
    searchBar.focus();
  }
});
