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
  };
};
const getWeather = async (event) => {
  event.preventDefault();
  let city = searchBar.value;
  const cordinates = await getCordinates(city);
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${cordinates.lat}&longitude=${cordinates.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weathercode,uv_index&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,weathercode&hourly=temperature_2m,weathercode&timezone=Asia/Karachi&forecast_days=2`,
  );
  const data = await response.json();
  console.log(data, "getweather");
  // getting response end here

  // document.querySelector(".weather-temp").textContent =
  //   data.current.temperature_2m + "°C";
  // document.querySelector(".feels-like").textContent =
  //   "Feels like " + data.current.apparent_temperature + "°C";

  // console.log(data.current.temperature_2m);
};

form.addEventListener("submit", getWeather);
