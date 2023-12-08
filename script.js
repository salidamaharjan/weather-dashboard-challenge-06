//locating a button from html file to variable stored in DOM
var searchBtn = document.querySelector(".search-btn");

//adding event listener to button
searchBtn.addEventListener("click", function () {
  fetchWeatherApi();
});
function fetchWeatherApi() {
  var fetchGeoURL = `./geo.json`;
  fetch(fetchGeoURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var latAndLon = fetchWeatherWithLatLon(data);
      var lat = latAndLon.lat;
      var lon = latAndLon.lon;
      var fetchWeatherURL = "./weather.json";
      fetch(fetchWeatherURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
        });
    });
}
function fetchWeatherWithLatLon(geoInfo) {
  var latAndLon = {};
  for (var i = 0; i < geoInfo.length; i++) {
    var country = geoInfo[i].country;
    if (country === "US") {
      // console.log(country);
      return (latAndLon = { lon: geoInfo[i].lon, lat: geoInfo[i].lat });
      // console.log(lon, lat);
    }
  }
}
