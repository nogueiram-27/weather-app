let apiKey = "db8ccdf98a00dd96ce6fde5b428abba4";

function setCurrentDate() {
  let currentDate = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let currentDay = days[currentDate.getDay()];
  let currentHour = currentDate.getHours();
  let currentMinutes = currentDate.getMinutes();

  let appDate = document.querySelector("p.today");
  appDate.innerHTML = `${currentDay}, ${currentHour}:${currentMinutes}`;
}
function updateCityWeatherInfo(
  cityName,
  currentTemp,
  currentMaxTemp,
  curentMinTemp,
  currentWind,
  currentHumidity
) {
  let appCity = document.querySelector(".city-searched");
  appCity.innerHTML = cityName.toUpperCase() + "   ";

  let appCurrTemp = document.querySelector("#curr-temp");
  appCurrTemp.innerHTML = currentTemp;

  let appCurrTempMax = document.querySelector("#curr-temp-max");
  appCurrTempMax.innerHTML = currentMaxTemp;

  let appCurrTempMin = document.querySelector("#curr-temp-min");
  appCurrTempMin.innerHTML = curentMinTemp;

  let appCurrWindSpeed = document.querySelector("#curr-wind-speed");
  appCurrWindSpeed.innerHTML = currentWind + " ";

  let appCurrHumidity = document.querySelector("#curr-humidity");
  appCurrHumidity.innerHTML = currentHumidity + " ";
}

function getCityWeatherData(response) {
  console.log(response.data);
  let cityName = response.data.name;
  let currentTemp = Math.round(response.data.main.temp);
  let currentMaxTemp = Math.round(response.data.main.temp_max);
  let curentMinTemp = Math.round(response.data.main.temp_min);
  let currentWind = response.data.wind.speed;
  let currentHumidity = response.data.main.humidity;

  updateCityWeatherInfo(
    cityName,
    currentTemp,
    currentMaxTemp,
    curentMinTemp,
    currentWind,
    currentHumidity
  );
}

function getCityWeatherInfoByGeoLocation(lat, lon, tempUnit) {
  let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${tempUnit}&appid=${apiKey}`;
  console.log(weatherApiUrl);
  axios.get(weatherApiUrl).then(getCityWeatherData);
}

function getCityWeatherInfoByCityName(cityName, tempUnit) {
  let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${tempUnit}&appid=${apiKey}`;
  console.log(weatherApiUrl);
  axios.get(weatherApiUrl).then(getCityWeatherData);
}

function setCityWeatherInfo(event) {
  event.preventDefault();
  let inputCity = document.querySelector("input#input-city");
  console.log(inputCity);
  getCityWeatherInfoByCityName(inputCity.value.toLowerCase(), "metric");
}

function getCurrentPosition(position) {
  getCityWeatherInfoByGeoLocation(
    position.coords.latitude,
    position.coords.longitude,
    "metric"
  );
}

function setCurrentLocationWeatherInfo(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentPosition);
}

function convertToCelsius(temp) {
  return Math.ceil((temp - 32) * (5 / 9));
}

function convertToFahrenheit(temp) {
  return Math.ceil(temp * (9 / 5) + 32);
}

function setTempToFahrenheit(event) {
  event.preventDefault();
  let unitSelected = document.querySelector("a#convert-fahrenheit");

  if (!unitSelected.classList.contains("selected")) {
    let unitDeselected = document.querySelector("a#convert-celsius");
    unitDeselected.classList.remove("selected");
    unitSelected.classList.add("selected");

    // update current temperature
    let appCurrTemp = document.querySelector("#curr-temp");
    let currTempValue = appCurrTemp.innerText;
    appCurrTemp.innerHTML = convertToFahrenheit(currTempValue);

    let appCurrUnit = document.querySelector("#curr-temp-unit");
    appCurrUnit.innerHTML = "ºF";

    let appCurrTempMin = document.querySelector("#curr-temp-min");
    let currTempMinValue = appCurrTempMin.innerText;
    appCurrTempMin.innerHTML = convertToFahrenheit(currTempMinValue);

    let appCurrTempMax = document.querySelector("#curr-temp-max");
    let currTempMaxValue = appCurrTempMax.innerText;
    appCurrTempMax.innerHTML = convertToFahrenheit(currTempMaxValue);

    // update forecast temperature
    let appMinForecastTemp = document.querySelectorAll(".temp-min");
    appMinForecastTemp.forEach(function (item) {
      let minValue = item.innerText;
      item.innerHTML = convertToFahrenheit(minValue);
    });

    let appMaxForecastTemp = document.querySelectorAll(".temp-max");
    appMaxForecastTemp.forEach(function (item) {
      let maxValue = item.innerText;
      item.innerHTML = convertToFahrenheit(maxValue);
    });
  }
}

function setTempToCelsius(event) {
  event.preventDefault();

  let unitSelected = document.querySelector("a#convert-celsius");

  if (!unitSelected.classList.contains("selected")) {
    let unitDeselected = document.querySelector("a#convert-fahrenheit");
    unitDeselected.classList.remove("selected");
    unitSelected.classList.add("selected");

    // update current temperature
    let appCurrTemp = document.querySelector("#curr-temp");
    let currTempValue = appCurrTemp.innerText;
    appCurrTemp.innerHTML = convertToCelsius(currTempValue);

    let appCurrUnit = document.querySelector("#curr-temp-unit");
    appCurrUnit.innerHTML = "ºC";

    let appCurrTempMin = document.querySelector("#curr-temp-min");
    let currTempMinValue = appCurrTempMin.innerText;
    appCurrTempMin.innerHTML = convertToCelsius(currTempMinValue);

    let appCurrTempMax = document.querySelector("#curr-temp-max");
    let currTempMaxValue = appCurrTempMax.innerText;
    appCurrTempMax.innerHTML = convertToCelsius(currTempMaxValue);

    // update forecast temperature
    let appMinForecastTemp = document.querySelectorAll(".temp-min");
    appMinForecastTemp.forEach(function (item) {
      let minValue = item.innerText;
      item.innerHTML = convertToCelsius(minValue);
    });

    let appMaxForecastTemp = document.querySelectorAll(".temp-max");
    appMaxForecastTemp.forEach(function (item) {
      let maxValue = item.innerText;
      item.innerHTML = convertToCelsius(maxValue);
    });
  }
}

setCurrentDate();

//default City in app
getCityWeatherInfoByCityName("lisbon", "metric");

let searchCityForm = document.querySelector("form#search-city-weather");
searchCityForm.addEventListener("submit", setCityWeatherInfo);

let convertToCelsiusLink = document.querySelector("a#convert-celsius");
convertToCelsiusLink.addEventListener("click", setTempToCelsius);

let convertToFahrenheitLink = document.querySelector("a#convert-fahrenheit");
convertToFahrenheitLink.addEventListener("click", setTempToFahrenheit);

let searchLocationButton = document.querySelector("button#curr-location");
searchLocationButton.addEventListener("click", setCurrentLocationWeatherInfo);
