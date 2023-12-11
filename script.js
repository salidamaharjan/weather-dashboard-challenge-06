//locating a button from html file to variable stored in DOM
var searchBtn = document.querySelector(".search-btn");
var apiKey = "45d530864ca0ff65bba0b74830f6c217";

reRenderedLocalStorage();

//adding event listener to button
searchBtn.addEventListener("click", function () {
  var enteredCity = document.querySelector(".city-input");

  if (enteredCity.value === "") {
    var modal = document.querySelector(".modal");
    modal.classList.add("is-active");
    return;
  }
  console.log(enteredCity.value);
  fetchWeatherApi(enteredCity.value);

  enteredCity.value = "";
});
var modal = document.querySelector(".modal");
modal.addEventListener("click", function (event) {
  if (
    event.target.matches(".modal-background") ||
    event.target.matches(".modal-close")
  ) {
    var modal = document.querySelector(".modal");
    modal.classList.remove("is-active");
  }
});

function toDisplaySearchedCity(cityEntered) {
  var city = [];
  city = JSON.parse(localStorage.getItem("city")) || [];
  var findEnteredCityInArr = city.some(function (item) {
    return item === cityEntered;
  });
  if (findEnteredCityInArr) {
    return;
  }
  createCityBtn(cityEntered);
  city.push(cityEntered);
  localStorage.setItem("city", JSON.stringify(city));
}

function reRenderedLocalStorage() {
  var city = [];
  city = JSON.parse(localStorage.getItem("city")) || [];
  console.log(city);
  for (var i = 0; i < city.length; i++) {
    createCityBtn(city[i]);
  }
}
function createCityBtn(cityName) {
  var savedCity = document.querySelector(".saved-city");
  var btnEl = document.createElement("button");
  btnEl.setAttribute(
    "class",
    "button is-link is-light is-small is-fullwidth mb-2"
  );
  btnEl.textContent = cityName;
  savedCity.append(btnEl);
  btnEl.addEventListener("click", function () {
    var displayCity = document.querySelector(".city");
    displayCity.textContent = cityName;
    fetchWeatherApi(cityName);
  });
}
function fetchWeatherApi(city) {
  var fetchGeoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city},US&appid=${apiKey}`;
  // var fetchGeoURL = "./geo.json";
  fetch(fetchGeoURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var latAndLon = fetchWeatherWithLatLon(data);
      console.log("what is data = ", data);
      console.log("lat and long ", latAndLon);
      var cityName = latAndLon.name;
      var lat = latAndLon.lat;
      var lon = latAndLon.lon;
      toDisplaySearchedCity(cityName);
      var displayCity = document.querySelector(".city");
      displayCity.textContent = cityName;
      var fetchWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
      // var fetchWeatherURL = "./weather.json";
      fetch(fetchWeatherURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          displayWeatherData(data);
        });
    });
}
function fetchWeatherWithLatLon(geoInfo) {
  for (var i = 0; i < geoInfo.length; i++) {
    var country = geoInfo[i].country;
    if (country === "US") {
      // console.log(country);
      return {
        name: geoInfo[i].name,
        lon: geoInfo[i].lon,
        lat: geoInfo[i].lat,
      };
      // console.log(lon, lat);
    }
  }
}
function displayWeatherData(data) {
  console.log(data.list[0]);
  console.log(data.list[0].main.temp);
  console.log(data.list[0].main.humidity);
  console.log(data.list[0].wind.speed);

  var text = document.querySelector(".text");
  text.classList.add("is-hidden");
  var rightSide = document.querySelector(".right-side");
  rightSide.classList.remove("is-hidden");
  var currentDate = dayjs().format("MM/DD/YYYY");
  tempWindHumidity(".day-1", currentDate, data.list[0]);

  tempWindHumidity(
    ".day-2",
    dayjs().add(1, "day").format("MM/DD/YYYY"),
    data.list.find(function (item) {
      var day2Date = dayjs().add(1, "day").format("YYYY-MM-DD");
      return item.dt_txt.startsWith(day2Date);
    })
  );
  tempWindHumidity(
    ".day-3",
    dayjs().add(2, "day").format("MM/DD/YYYY"),
    data.list.find(function (item) {
      var day3Date = dayjs().add(2, "day").format("YYYY-MM-DD");
      return item.dt_txt.startsWith(day3Date);
    })
  );
  tempWindHumidity(
    ".day-4",
    dayjs().add(3, "day").format("MM/DD/YYYY"),
    data.list.find(function (item) {
      var day4Date = dayjs().add(3, "day").format("YYYY-MM-DD");
      return item.dt_txt.startsWith(day4Date);
    })
  );
  tempWindHumidity(
    ".day-5",
    dayjs().add(4, "day").format("MM/DD/YYYY"),
    data.list.find(function (item) {
      var day5Date = dayjs().add(4, "day").format("YYYY-MM-DD");
      return item.dt_txt.startsWith(day5Date);
    })
  );
  tempWindHumidity(
    ".day-6",
    dayjs().add(5, "day").format("MM/DD/YYYY"),
    data.list.find(function (item) {
      var day6Date = dayjs().add(5, "day").format("YYYY-MM-DD");
      return item.dt_txt.startsWith(day6Date);
    })
  );
}

function tempWindHumidity(day, date, data) {
  var dayTemp = document.querySelector(`${day} .temp span`);
  var dayWind = document.querySelector(`${day} .wind span`);
  var dayHumidity = document.querySelector(`${day} .humidity span`);
  var dateEl = document.querySelector(`${day} .date`);
  var dayImgEl = document.querySelector(`${day} .sym`);
  dateEl.textContent = date;
  dayTemp.textContent = data.main.temp;
  dayWind.textContent = data.wind.speed;
  dayHumidity.textContent = data.main.humidity;
  var daySym = data.weather[0].icon;
  dayImgEl.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${daySym}@2x.png`
  );
}
