//locating a button from html file to variable stored in DOM
var searchBtn = document.querySelector(".search-btn");
var apiKey = "45d530864ca0ff65bba0b74830f6c217";
//locating the modal section from HTML
var modal = document.querySelector(".modal");

//rerenders the items from local storage and displays as a button if
//any saved city found
reRenderedLocalStorage();

//adding a feature to search weather for entered city when pressed 'enter key'
var inputTextArea = document.querySelector(".city-input");
inputTextArea.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});

//adding event listener to button
searchBtn.addEventListener("click", function () {
  var enteredCity = document.querySelector(".city-input");
  //if the user click search button without entering a city
  //modal will be active which asks the user to enter a city name or
  //select from the saved list
  if (enteredCity.value === "") {
    modal.classList.add("is-active");
    return;
  }
  //if city entered calls the function to fetch the weather API using
  //the value entered by the user
  fetchWeatherApi(enteredCity.value);

  //emptying the input text area
  enteredCity.value = "";
});

//the modal display closes when the user click on th cross button
//or anywhere outside the modal display box
modal.addEventListener("click", function (event) {
  if (
    //finding the the html using class selector
    event.target.matches(".modal-background") ||
    event.target.matches(".modal-close")
  ) {
    var modal = document.querySelector(".modal");
    //this hides the modal and displays main weather UI
    modal.classList.remove("is-active");
  }
});

//this will access the save value in the local storage and
//prevents to store same city again
function toDisplaySearchedCity(cityEntered) {
  var city = [];
  //using JSON.parse to convert the string to array of string
  //if any item is found otherwise will be empty array
  city = JSON.parse(localStorage.getItem("city")) || [];
  //using some() method to locate the saved city that matches the user
  //entered city and returns boolean
  var findEnteredCityInArr = city.some(function (item) {
    return item === cityEntered;
  });
  //if found in the local storage then does not save again
  if (findEnteredCityInArr) {
    return;
  }
  //shows the searched city as a button in UI and add to the array
  //of city in local storage
  createCityBtn(cityEntered);
  city.push(cityEntered);
  //using JSON.stringify to save as a string to the local storage
  localStorage.setItem("city", JSON.stringify(city));
}

//the save city in the local storage is seen as the button in UI
//when the page is refreshed or until the item is deleted from the
//local storage
function reRenderedLocalStorage() {
  var city = [];
  //getting from the local storage as string of an array
  city = JSON.parse(localStorage.getItem("city")) || [];

  //creating a button according to the length of the stored item in
  //local storage
  for (var i = 0; i < city.length; i++) {
    createCityBtn(city[i]);
  }
}

//creating a button according to the city entered by the user
function createCityBtn(cityName) {
  var savedCity = document.querySelector(".saved-city");
  var btnEl = document.createElement("button");
  btnEl.setAttribute(
    "class",
    "button is-link is-light is-small is-fullwidth mb-2"
  );
  btnEl.textContent = cityName;
  savedCity.append(btnEl);

  //event listener when clicked on the button named with saved city
  //to call the function to fetch weather API and displays on the screen
  btnEl.addEventListener("click", function () {
    var displayCity = document.querySelector(".city");
    displayCity.textContent = cityName;
    fetchWeatherApi(cityName);
  });
}

//function to fetch weather API and Geo API
function fetchWeatherApi(city) {
  var fetchGeoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city},US&appid=${apiKey}`;

  //fetching geo API to find out the latitude, longitude and name of the city
  fetch(fetchGeoURL)
    .then(function (response) {
      //converting the response returned by the API to javascript object which is a promise
      return response.json();
    })
    .then(function (data) {
      //alert user as a modal if the city name is not entered
      if (data.length === 0) {
        modal.classList.add("is-active");
        return;
      }
      //calling a function which give the lat, lon and name of the entered city in the API
      var latAndLon = fetchWeatherWithLatLon(data);
      var cityName = latAndLon.name;
      var lat = latAndLon.lat;
      var lon = latAndLon.lon;

      //display the city named stored in API
      toDisplaySearchedCity(cityName);
      var displayCity = document.querySelector(".city");
      displayCity.textContent = cityName;

      //fetching weather API to pass the data to display in UI
      var fetchWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

      fetch(fetchWeatherURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          //the data from the weather API passed to another function
          displayWeatherData(data);
        });
    });
}

//this gives the latitude, longitude and name of the city entered from the
//geo API
function fetchWeatherWithLatLon(geoInfo) {
  for (var i = 0; i < geoInfo.length; i++) {
    var country = geoInfo[i].country;

    //to return the city from USA
    if (country === "US") {
      return {
        name: geoInfo[i].name,
        lon: geoInfo[i].lon,
        lat: geoInfo[i].lat,
      };
    }
  }
}

//this display the data from the API to UI
function displayWeatherData(data) {
  var text = document.querySelector(".text");
  text.classList.add("is-hidden");
  var rightSide = document.querySelector(".right-side");
  rightSide.classList.remove("is-hidden");
  //using dayjs().format to show current day in UI on the top box
  var currentDate = dayjs().format("MM/DD/YYYY");

  //calling tempWindHumidity function with three argument to display in UI
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

//this function has three parameter and shows the temp
// wind, humidity, date and img of the weather in UI
function tempWindHumidity(day, date, data) {
  //using string interpolation to add the variable
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
