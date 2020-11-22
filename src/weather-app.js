let apiKey = "db8ccdf98a00dd96ce6fde5b428abba4";

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function setCurrentDate() {
  let currentDate = new Date();
  let currentDay = days[currentDate.getDay()];
  let currentHour = currentDate.getHours();
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }
  let currentMinutes = currentDate.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }

  let appDate = document.querySelector("p.today");
  appDate.innerHTML = `${currentDay}, ${currentHour}:${currentMinutes}`;
}

function convertEpochToDateTime(epochTime, returnComplete) {
  let dateTime = new Date(epochTime);
  let dateTimeDay = days[dateTime.getDay()];
  let dateTimeHour = dateTime.getHours();
  if (dateTimeHour < 10) {
    dateTimeHour = `0${dateTimeHour}`;
  }
  let dateTimeMinutes = dateTime.getMinutes();
  if (dateTimeMinutes < 10) {
    dateTimeMinutes = `0${dateTimeMinutes}`;
  }

  if (returnComplete) {
    return `${dateTimeDay}, ${dateTimeHour}:${dateTimeMinutes}`;
  } else {
    return `${dateTimeHour}:${dateTimeMinutes}`;
  }
}

function convertMetroPerSecondToKilometerPerHour(metroPerSecond) {
  return Math.round(metroPerSecond * 3.6);
}

function updateCityWeatherInfo(response) {
  // get response weather data
  let cityName = response.data.name;
  let currentTemp = Math.round(response.data.main.temp);
  let currentMaxTemp = Math.round(response.data.main.temp_max);
  let curentMinTemp = Math.round(response.data.main.temp_min);
  let curentFeelsLike = Math.round(response.data.main.feels_like);
  let currentWind = convertMetroPerSecondToKilometerPerHour(
    response.data.wind.speed
  );
  let currentHumidity = response.data.main.humidity;
  let currentPrecipitation = response.data.rain;
  if (typeof currentPrecipitation != "undefined") {
    currentPrecipitation = response.data.rain["1h"];
  } else {
    currentPrecipitation = "0";
  }
  let currentIcon = response.data.weather[0].icon;
  let currentDescription = response.data.weather[0].description;
  let lastUpd = convertEpochToDateTime(response.data.dt * 1000);

  // update current weather info
  let appCity = document.querySelector(".city-searched");
  appCity.innerHTML = cityName;

  let appCurrTemp = document.querySelector("#curr-temp");
  appCurrTemp.innerHTML = currentTemp;

  let appCurrTempMax = document.querySelector("#curr-temp-max");
  appCurrTempMax.innerHTML = currentMaxTemp;

  let appCurrTempMin = document.querySelector("#curr-temp-min");
  appCurrTempMin.innerHTML = curentMinTemp;

  let appCurrFeelsLike = document.querySelector("#feels-like");
  appCurrFeelsLike.innerHTML = curentFeelsLike;

  let appCurrWindSpeed = document.querySelector("#curr-wind-speed");
  appCurrWindSpeed.innerHTML = currentWind + " ";

  let appCurrHumidity = document.querySelector("#curr-humidity");
  appCurrHumidity.innerHTML = currentHumidity + " ";

  let appCurrPrecipitation = document.querySelector("#curr-precipitation");
  appCurrPrecipitation.innerHTML = currentPrecipitation + " ";

  let appCurrIcon = document.querySelector("#curr-weather-icon");
  appCurrIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${currentIcon}@2x.png`
  );

  appCurrIcon.setAttribute("alt", currentDescription);

  let appCurrDesc = document.querySelector("#curr-weather-desc");
  appCurrDesc.innerHTML = currentDescription;

  let appLastUpd = document.querySelector("#last-upd");
  appLastUpd.innerHTML = lastUpd;

  // set weather advice and icon
  setWeatherAdvice(response);
}

function updateForecastInfo(response) {
  let appForecast = document.querySelector("#forecast");
  appForecast.innerHTML = null;

  for (let i = 0; i < 6; i++) {
    forecast = response.data.list[i];
    appForecast.innerHTML += `
      <div class="col-2">
        <p class="next-hour">${convertEpochToDateTime(
          forecast.dt * 1000,
          false
        )}</p>
        <img 
          class="pred-icon"
          src="http://openweathermap.org/img/wn/${
            forecast.weather[0].icon
          }@2x.png" 
          alt = "http://openweathermap.org/img/wn/${
            forecast.weather[0].description
          }@2x.png"
        />
        <p class="pred-temp">
          <span class="temp-min">
            ${Math.round(forecast.main.temp_min)}
          </span>º/
          <span class="temp-max">
            ${Math.round(forecast.main.temp_max)}
          </span>º
        </p>
      </div>
  `;
  }
}

function getTempUnit() {
  let unitSelected = document.querySelector("a#convert-celsius");

  if (unitSelected.classList.contains("selected")) {
    return "metric";
  } else {
    return "imperial";
  }
}

function cleanInputCity() {
  let inputCity = document.querySelector("input#input-city");
  inputCity.value = "";
}

function setWeatherAdvice(response) {
  let currWeatherIcon = response.data.weather[0].icon;
  let adviceObject = {
    "01d": {
      "activity-description": "It's outside weather...maybe icecream?",
      "fa-icon-html": '<i class="fas fa-ice-cream"></i>',
    },

    "01n": {
      "activity-description": "Perfect for watch the stars!",
      "fa-icon-html": '<i class="fas fa-star"></i>',
    },

    "02d": {
      "activity-description": "It's outside weather...maybe a hot coffee?",
      "fa-icon-html": '<i class="fas fa-mug-hot"></i>',
    },

    "02n": {
      "activity-description": "Definitely dinnner with friends!",
      "fa-icon-html": '<i class="fas fa-glass-cheers"></i>',
    },

    "03d": {
      "activity-description": "Comeback summer!!!",
      "fa-icon-html": '<i class="fas fa-sad-tear"></i>',
    },

    "03n": {
      "activity-description": "Have we reached winter time yet?",
      "fa-icon-html": '<i class="fas fa-flushed"></i>',
    },

    "04d": {
      "activity-description": "Better return home to grab your umbrella.",
      "fa-icon-html": '<i class="fas fa-umbrella"></i>',
    },

    "04n": {
      "activity-description": "Ok, no more excuses to read that book!",
      "fa-icon-html": '<i class="fas fa-book-reader"></i>',
    },

    "09d": {
      "activity-description": "Just 5 more minutes in bed, please!",
      "fa-icon-html": '<i class="fas fa-bed"></i>',
    },

    "09n": {
      "activity-description": "Hot chocolate weather!",
      "fa-icon-html": '<i class="fas fa-mug-hot"></i>',
    },

    "10d": {
      "activity-description": "Love the smell of the rain!",
      "fa-icon-html": '<i class="fas fa-heart"></i>',
    },

    "10n": {
      "activity-description": "Ready for a cozy night!",
      "fa-icon-html": '<i class="fas fa-couch"></i>',
    },

    "11d": {
      "activity-description": "Is it ok to call sick?",
      "fa-icon-html": '<i class="fas fa-temperature-high"></i>',
    },

    "11n": {
      "activity-description": "Movie night!",
      "fa-icon-html": '<i class="fas fa-film"></i>',
    },

    "13d": {
      "activity-description": "Snowman time!",
      "fa-icon-html": '<i class="fas fa-snowman"></i>',
    },

    "13n": {
      "activity-description": "Snowman time!",
      "fa-icon-html": '<i class="fas fa-snowman"></i>',
    },

    "50d": {
      "activity-description": "Stay inside weather",
      "fa-icon-html": '<i class="fas fa-house-user"></i>',
    },

    "50n": {
      "activity-description": "Stay inside weather",
      "fa-icon-html": '<i class="fas fa-house-user"></i>',
    },
  };

  let currWeatherAdvice = document.querySelector(".weather-advice p");
  currWeatherAdvice.innerHTML = `"${adviceObject[currWeatherIcon]["activity-description"]}"`;

  let currIconAdvice = document.querySelector(".weather-advice-icon");
  currIconAdvice.innerHTML = adviceObject[currWeatherIcon]["fa-icon-html"];
}

function getCityWeatherInfoByGeoLocation(lat, lon, tempUnit) {
  let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${tempUnit}&appid=${apiKey}`;
  let predWeatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${tempUnit}&appid=${apiKey}`;
  axios
    .get(weatherApiUrl)
    .then(updateCityWeatherInfo)
    .catch(function (error) {
      if (error.response) {
        alert("Please enter a valid city!");
      } else {
        alert("Ups! Something went wrong, please try again.");
      }
    });
  axios.get(predWeatherApiUrl).then(updateForecastInfo);
}

function getCityWeatherInfoByCityName(cityName, tempUnit) {
  let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${tempUnit}&appid=${apiKey}`;
  let predWeatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${tempUnit}&appid=${apiKey}`;
  axios
    .get(weatherApiUrl)
    .then(updateCityWeatherInfo)
    .catch(function (error) {
      if (error.response) {
        alert("Please enter a valid city!");
      } else {
        alert("Ups! Something went wrong, please try again.");
      }
    });
  axios.get(predWeatherApiUrl).then(updateForecastInfo);

  cleanInputCity();
}

function setCityWeatherInfo(event) {
  event.preventDefault();
  let inputCity = document.querySelector("input#input-city");
  getCityWeatherInfoByCityName(inputCity.value.toLowerCase(), getTempUnit());
}

function getCurrentPosition(position) {
  getCityWeatherInfoByGeoLocation(
    position.coords.latitude,
    position.coords.longitude,
    getTempUnit()
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

    let appCurrFeelsLike = document.querySelector("#feels-like");
    let currFeelsLikeValue = appCurrFeelsLike.innerText;
    appCurrFeelsLike.innerHTML = convertToFahrenheit(currFeelsLikeValue);

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

    let appCurrFeelsLike = document.querySelector("#feels-like");
    let currFeelsLikeValue = appCurrFeelsLike.innerText;
    appCurrFeelsLike.innerHTML = convertToCelsius(currFeelsLikeValue);

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

let searchLocationButton = document.querySelector("button#curr-location");
searchLocationButton.addEventListener("click", setCurrentLocationWeatherInfo);

let convertToCelsiusLink = document.querySelector("a#convert-celsius");
convertToCelsiusLink.addEventListener("click", setTempToCelsius);

let convertToFahrenheitLink = document.querySelector("a#convert-fahrenheit");
convertToFahrenheitLink.addEventListener("click", setTempToFahrenheit);
