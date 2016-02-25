var appId = '2c7d44168922ecf28cc10c960498bcd2';
var userIp = '';
var lat = 0.0;
var lon = 0.0;
var incMetric = 1;
var incImperial = 0;

//when page loads, submit a get request for the JSON API
//When get is done, call the parseLocation function
$('document').ready(function(){
  $.getJSON("http://ip-api.com/json").done(parseLocation);
});

//get location function
function parseLocation(location) {
  //location.query will get the user ip address 
  userIp = location.query;
  //get city div, insert the location.city into it
  document.getElementById("city").innerHTML = location.city;
  //lat variable references location.lat, lon references location.lon
  lat = location.lat;
  lon = location.lon;
  console.log(lat);
  console.log(lon);
  
  //get the units-selector value, either 0 or 1 for C/F
  var unitsSelector = document.getElementById("units-selector");
  
  //if unitsSelector is 0, Imperial (F) units are selected
  if (unitsSelector.selectedIndex === incImperial) {
    //JSON get request passing in lat and lon variables
    //in the request, imperial units are selected + the appId var
    //when done with the request, call the getWeatherData function
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial"+"&APPID=" + appId).done(getWeatherData);
  } 
    //same as above, except with Metric units
  else if (unitsSelector.selectedIndex === incMetric) {
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric"+"&APPID=" + appId).done(getWeatherData);
  }
}

function getWeatherData(localWeather) {
  //API calls from api.openweathermap
  var commonWeather = localWeather.weather[0].description;
  var temperature = Math.round(localWeather.main.temp);
  var humidity = localWeather.main.humidity;
  var atmPress = localWeather.main.pressure;
  var clouds = localWeather.clouds.all;
  var windSpeed = localWeather.wind.speed;
  var windDirection = localWeather.wind.deg;
  var weatherIcon = localWeather.weather[0].icon;
  
  //get the units-selector id
  var unitsSelector = document.getElementById('units-selector');
  var tempUnits = "";
  
  //if selected index is on imperial option
  if (unitsSelector.selectedIndex === incImperial) {
    //make temperature units equal to degree F string
    tempUnits = "&deg;F";
  } else if (unitsSelector.selectedIndex === incMetric) {
    //else make equal to degree C string
    tempUnits = "&deg;C";
  }
  
  //setting document elements to the APT request variables
  document.getElementById("weather-description").innerHTML = commonWeather;
  document.getElementById("temperature").innerHTML = temperature + " " + tempUnits;
  document.getElementById("humidity").innerHTML = "Humidity: " + humidity + "%";
  document.getElementById("atm-pressure").innerHTML = "Atmospheric Pressure: " + atmPress + " hPa";
  
  //weather icon url set to api site/images/w/ icon variable from request
  var weatherIconURL = "http://openweathermap.org/img/w/" + weatherIcon + ".png";
  //set the source attribute of weather icon to be the icon url
  $('#weather-icon').attr('src',weatherIconURL);
  
  //set the wind data id to be the API wind speed call. Direction can be found by calling the getWindDirection function, passing in (wind direction / 45.0) 
  if (unitsSelector.selectedIndex === incImperial) {
  document.getElementById('wind-data').innerHTML = "Wind: " + windSpeed + " mph " + getWindDirection(windDirection/45.0);
  } 
  else if (unitsSelector.selectedIndex === incMetric) {
    document.getElementById('wind-data').innerHTML = "Wind: " + windSpeed + " m/s " + getWindDirection(windDirection/45.0);
  }
  
}

function getWindDirection(windDirection) {
  //all of the direction abbreviations
  var windRose = ["N","NE","E", "SE", "S", "SW", "W", "NW"];
  //compass direction rounded down (windDirection/45) 
  var compassDirection = Math.floor(windDirection/45.0);
  //return the direction that corresponds to the index value of windRose array
  return windRose[compassDirection];
}

//change weather display function
function changeWeatherDisplay(){
  var unitsSelector = document.getElementById("units-selector");
  
  if (unitsSelector.selectedIndex === incImperial)
  {
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial"+"&APPID=" + appId)
    .done(getWeatherData);
  }
  else if (unitsSelector.selectedIndex === incMetric)
  {
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric"+"&APPID=" + appId)
    .done(getWeatherData);
  }
}