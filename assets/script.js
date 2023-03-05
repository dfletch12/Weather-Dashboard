var cityInput = document.getElementById('cityInput');
var searchBtn = document.getElementById('search');
var currentCity = document.getElementById('currentCity');
var temp = document.getElementById('temp');
var wind = document.getElementById('wind');
var humidity = document.getElementById('humidity');
var listEl = document.getElementById('list');
var icon = document.getElementById('icon');
var clearBtn = document.getElementById('clear');

var listItem;
var apiKey = "0e9a6ce0cacba1e8a3ea86addd259f81";
var citys = [];
var cityLon, cityLat;
icon.style.display = "none";

// search on click
searchBtn.addEventListener('click', search);

// search on enter
cityInput.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    searchBtn.click();
  }
})
// search function
function search() {
  var cityName = cityInput.value;
  if (cityName == "") {
    return;
  }
      // clearBtn removes display none class from clear button
  clearBtn.classList.remove("d-none");
  listItem = document.createElement("button");
  listItem.setAttribute('id', cityName);
  listItem.classList.add("btns", "bg-info", "list-group-item", "list-group-item-action");
  listItem.textContent = cityName;
  listEl.appendChild(listItem);
  cityInput.value = "";
  getCityName(cityName);
  // add x button to each list item and remove item on click
    var xBtn = document.createElement('button');
    xBtn.classList.add("btns", "btn", "btn-danger", "btn-sm", "float-right");
    xBtn.textContent = "X";
    listItem.appendChild(xBtn);
    xBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      listItem.remove();
      citys.splice(i, 1);
      localStorage.setItem('citys', JSON.stringify(citys));
      clearBtn.classList.add("d-none");
    })
}
// if city is not valid alert
function getCityName(name) {
  if (!name) {
    alert('Please Enter a city');
    return;
  }
  citys.push(name);
  cityCoords(name);

}
// changes city name to coordinates
function cityCoords(city) {
  fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + apiKey, {

  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data == "") {
        alert('Please Enter a valid city');
        citys.pop();
        return;
      }
      localStorage.setItem('citys', JSON.stringify(citys));
      cityLon = data[0].lon;
      cityLat = data[0].lat;
      currentWeather();
    });

}
// fetches weather data
function currentWeather() {
  fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + cityLat + '&lon=' + cityLon + '&appid=' + apiKey + '&units=imperial', {

  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var weaatherIcon = data.weather[0].icon;
      var weatherIconUrl = "https://openweathermap.org/img/wn/" + weaatherIcon + "@2x.png";
      icon.src = weatherIconUrl;
      icon.style.display = "block";
      currentCity.textContent = data.name + " " + new Date(data.dt * 1000).toLocaleString();
      temp.textContent = "Temp: " + data.main.temp + ' °F';
      wind.textContent = "Wind: " + data.wind.speed + ' mph';
      humidity.textContent = "Humidity: " + data.main.humidity + ' %';
      fiveDayForcast();
    });
}
// fetches 5 day forcast
function fiveDayForcast() {
  fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + cityLat + '&lon=' + cityLon + '&appid=' + apiKey + '&units=imperial', {

  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (let i = 1; i <= 5; i++) {
        
        var futureTemps = document.getElementById('future-temps-' + i);
        var futureWind = document.getElementById('future-wind-' + i);
        var futureDates = document.getElementById('future-days-' + i);
        var futureHumidity = document.getElementById('future-humidity-' + i);
        var iconElement = document.getElementById('icon-' + i);
        var dayHourCount = (i * 8) - 1; 
        var icon = data.list[dayHourCount].weather[0].icon;
        var weatherIconUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        iconElement.src = weatherIconUrl;
        futureDates.textContent = new Date(data.list[dayHourCount].dt * 1000).toDateString();
        futureTemps.textContent = "Temp: " + data.list[dayHourCount].main.temp + " °F";
        futureWind.textContent = "Wind: " + data.list[dayHourCount].wind.speed + " mph";
        futureHumidity.textContent = "Humidity: " + data.list[dayHourCount].main.humidity + " %";


      }
    });
}

// If recent search is clicked get city name

listEl.addEventListener('click', function (event) {
  var targetcity = event.target.id;
  getCityName(targetcity);
})

// Pull from localStorage

window.onload = function () {
  var newCitys = JSON.parse(localStorage.getItem('citys'))

  if (newCitys == null) {
    return;
  }
  for (let i = 0; i < newCitys.length; i++) {
    var listItems = document.createElement('button');
    listItems.classList.add("btns", "list-group-item", "list-group-item-action");
    listItems.textContent = newCitys[i];
    listItems.setAttribute('id', newCitys[i]);
    listEl.appendChild(listItems);
  }
}

// clear localStorage 

clearBtn.addEventListener('click', () => {
  localStorage.clear();
  window.location.reload();
})