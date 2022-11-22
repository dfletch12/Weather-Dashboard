const dropdownElementList = document.querySelectorAll('.dropdown-toggle')
const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl))
var cityHistory = [];
var key= '0e9a6ce0cacba1e8a3ea86addd259f81'
var cityInput= $("#cityInput")

function storeCityHistory() {
    localStorage.setItem("cityList",JSON.stringify(cityHistory));
}

function cityHistoryList (){
    $("#cityHistory").empty();
    cityHistory.forEach(function(city){
        $("#cityHistory").append($('<li><button class="dropdown-item cityBtn" data-city="${city}">${city}</button></li>'));
    })
}

// get forecast
function getForecast(cityInput,key){
    preventDefault()

    $(document).ready(function() {
        $('#submit').click(function() {
          const city = $('#cityInput').val();
          $('cityInput').val("");
      
          let request = new XMLHttpRequest();
          const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${key}`;
      
          request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
              const response = JSON.parse(this.responseText);
              getElements(response);
            }
          };
      
          request.open("GET", url, true);
          request.send();
      
         function getElements(response) {
            console.log(response)
            $('.showHumidity').text(`The humidity in ${city} is ${response.main.humidity}%`);
            $('.showTemp').text(`The temperature in Kelvins is ${response.main.temp} degrees.`);
          }
        });
      });
}

function displayWeather() {
    var city= $(this).attr("data-city");
}

$('#cityHistory').click(".cityBtn", displayWeather);
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}