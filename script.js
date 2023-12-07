//locating a button from html file to variable stored in DOM
var searchBtn = document.querySelector(".search-btn");

//adding event listener to button
searchBtn.addEventListener("click", function() {
fetchWeatherApi();
})
function fetchWeatherApi(){
    var fetchGeoURL = "./geo.json"
    fetch(fetchGeoURL)
    .then(function(response) {
        return response.json();
    }).then(function(data){
        // console.log(data);
       fetchWeatherWithLatLon(data);
    })
}
function fetchWeatherWithLatLon(data){
    for(var i = 0; i < data.length; i++) {
        var country = data[i].country;
        if(country === "US"){
            // console.log(country);
            var lon = data[i].lon;
            var lat = data[i].lat;
            // console.log(lon, lat);
        } 
    }
}