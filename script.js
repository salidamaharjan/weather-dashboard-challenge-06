//locating a button from html file to variable stored in DOM
var searchBtn = document.querySelector(".search-btn");
var apiKey = "45d530864ca0ff65bba0b74830f6c217";

//adding event listener to button
searchBtn.addEventListener("click", function () {
  var enteredCity = document.querySelector(".city-input");
  var displayCity = document.querySelector(".city");

  displayCity.textContent = enteredCity.value;
  console.log(enteredCity.value);
  fetchWeatherApi(enteredCity.value);
  // displayDate.textContent = date;
});
function fetchWeatherApi(city) {
  // var fetchGeoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city},US&appid=${apiKey}`;
  var fetchGeoURL = "./geo.json";
  fetch(fetchGeoURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var latAndLon = fetchWeatherWithLatLon(data);
      var lat = latAndLon.lat;
      var lon = latAndLon.lon;
      // var fetchWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
      var fetchWeatherURL = "./weather.json";
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
      return { lon: geoInfo[i].lon, lat: geoInfo[i].lat };
      // console.log(lon, lat);
    }
  }
}
function displayWeatherData(data) {
  console.log(data.list[0]);
  console.log(data.list[0].main.temp);
  console.log(data.list[0].main.humidity);
  console.log(data.list[0].wind.speed);
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
    data.list.find(function(item){
      var day3Date = dayjs().add(2, "day").format("YYYY-MM-DD");
      return item.dt_txt.startsWith(day3Date);
    })
  );
  tempWindHumidity(
    ".day-4",
    dayjs().add(3, "day").format("MM/DD/YYYY"),
    data.list.find(function(item){
      var day4Date = dayjs().add(3, "day").format("YYYY-MM-DD");
      return item.dt_txt.startsWith(day4Date);
    })
  );
  tempWindHumidity(
    ".day-5",
    dayjs().add(4, "day").format("MM/DD/YYYY"),
    data.list.find(function(item){
      var day5Date = dayjs().add(4, "day").format("YYYY-MM-DD");
      return item.dt_txt.startsWith(day5Date);
    })
  );
  tempWindHumidity(
    ".day-6",
    dayjs().add(5, "day").format("MM/DD/YYYY"),
    data.list.find(function(item){
      var day6Date = dayjs().add(5, "day").format("YYYY-MM-DD");
      return item.dt_txt.startsWith(day6Date);
    })
  );
}

function tempWindHumidity(day, date, data) {
  var day1Temp = document.querySelector(`${day} .temp span`);
  var day1Wind = document.querySelector(`${day} .wind span`);
  var day1Humidity = document.querySelector(`${day} .humidity span`);
  var dateEl = document.querySelector(`${day} .date`);
  dateEl.textContent = date;
  day1Temp.textContent = data.main.temp;
  day1Wind.textContent = data.wind.speed;
  day1Humidity.textContent = data.main.humidity;
}
