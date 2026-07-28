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

const getWeather = async (event) => {
  event.preventDefault();
  const response = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=24.85&longitude=66.99&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weathercode,uv_index&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,weathercode&hourly=temperature_2m,weathercode&timezone=Asia/Karachi&forecast_days=2",
  );
  const data = await response.json();
  console.log(data);

  document.querySelector(".weather-temp").textContent =
    data.current.temperature_2m + "°C";
  document.querySelector(".feels-like").textContent =
    "Feels like " + data.current.apparent_temperature + "°C";

  console.log(searchBar.value);
};

form.addEventListener("submit", getWeather);
