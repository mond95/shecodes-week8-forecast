// FUNCTION WHICH RECEIVES THE RESPONSE FROM THE API CALL DONE IN THE BELOW FUNCTION AND THEN CONSOLE LOGS THE DATA FOR THE CITY SEARCHED FOR
function refreshWeather(response) {
  // to see the whole object of the city's data
  //   console.log(response.data);

  // to see the current temperature
  //   console.log(response.data.temperature.current);

  //   bringing in the DOM elements so we can alter the inner HTML of these later
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  // can see the date looks strange - we have to parse it so google how to do this if forget - have to do new Date(VALUE) * 1000
  let date = new Date(response.data.time * 1000);

  let iconElement = document.querySelector("#icon");

  // showing the city
  cityElement.innerHTML = response.data.city;

  // getting the temperature
  temperatureElement.innerHTML = Math.round(temperature);

  // getting the date/time
  // if we use date.getDay() to get the day of the week, the problem is this will return a number from 0 - 6 i.e. '2' instead of 'Tuesday':
  //   timeElement.innerHTML = `${date.getDay()} ${date.getDate()} ${date.getMonth()} ${date.getHours()}:${date.getMinutes()}`;
  // to improve this need to create a new function which will format the date and it will receive a date
  timeElement.innerHTML = formatDate(date);

  //   getting the description
  //   console.log(response.data.condition.description);
  descriptionElement.innerHTML = response.data.condition.description;

  // getting the humidity
  // using the backticks so we can add the % symbol still
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;

  // getting the windspeed
  windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;

  //   moving the class to the image rather than the div
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon">`;

  // moving the calling of the forecast function into here, once we've got the city
  // instead of sending the city that was typed we'll send the city name from the API to prevent spelling/upper/lowercase errors
  getForecast(response.data.city);
}

// FUNCTION TO FORMAT THE DATE
function formatDate(date) {
  let day = date.getDay();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // also want to format it so if the time is less than 10 minutes then add a zero before it e.g. if it's 18:05 it would only show 18:5 so need to format this
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${days[day]} ${hours}:${minutes}`;
}

// FUNCTION TO UPDATE THE TEMPERATURE WITH AN API CALL BASED ON THE CITY THAT HAS BEEN SEARCHED
// creating a new function called searchCity which will receive a city name and based on that it will update with the corresponding temperature
// creating a separate function for this due to a concept in computer science "the separation of concerns" i.e. we want something to do only one thing and do it well
// using the she codes API documentation https://www.shecodes.io/learn/apis/weather
function searchCity(city) {
  // make an API call and update the UI
  let apiKey = "145at3bd88ddc4bf6od1483d03f4ef43";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query={${city}&key=${apiKey}&units=metric`;
  //   can test this works by console logging and seeing if the URL appears when search for a city in the console log which when you click on the URL can see the data
  //   console.log(apiUrl);
  //   making the request i.e. getting the results of this API using axios so that we can update the temperature for the searched city
  axios.get(apiUrl).then(refreshWeather);
}

// FUNCTION TO UPDATE THE CITY H1 HEADER FROM THE SEARCH
// putting the function at the top for the search button
// this wil receive an event (from the event listener done below, i.e. 'submit')
// this function will be called eery time we submit due to the event listener later
function handleSearchSubmit(event) {
  // first thing to do is to prevent the default behaviour i.e. the reloading of the page or going to the action of the form (but in this case we don't have the 'action' as we removed that from the form html tag)
  event.preventDefault();
  //   getting the value of the search input
  let searchInput = document.querySelector("#search-form-input");
  //   checking it is correrctly logging what we input in the search bar
  //   console.log(searchInput.value);

  // LATER MOVED the below up into the searchCity function so that it updates with the actual name data from the API rather than just the user's typed searched city input]
  //   THIS IS BECAUSE even if we then searched for e.g. Miami like MiAMi, that will still search for this city correctly with the API but it will display the city name correctly in the H1 without all the random uppercase etc
  //   now we want to replace the h1 header i.e. the city name with whatever we've searched for
  //   let cityElement = document.querySelector("#city");
  //   this replaces what ever is inside the h1 element with the value entered in the search bar
  //   cityElement.innerHTML = searchInput.value;
  //   sending the city that has been searched also to the function which will call the API so the temperature can be based on the searched city
  searchCity(searchInput.value);
}

// to be able to have the city name update with what we searched in the text box
// we need to have an id on the form so we can target it from javascript - id = "search-form"
let searchFormElement = document.querySelector("#search-form");
// to check we have selected the correct element
// console.log(searchFormElement);

// adding an event listener - whenever we submit this form which happens when we click on the search button or press enter on the keyboard
// then we will call this function handleSearchSubmit which we will create at the top of the code
searchFormElement.addEventListener("submit", handleSearchSubmit);

// when we reload, this will have london by default
searchCity("London");

// FORECAST

// function to format the date from the API
function formatDay(timestamp) {
  // we have to multiply by 1000 as the time stamp is in milliseconds
  let date = new Date(timestamp * 1000);

  let days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

  // remember that getDay() will be a value between 0 and 6
  return days[date.getDay()];
}

// function to get the forecast data from the API
function getForecast(city) {
  let apiKey = "145at3bd88ddc4bf6od1483d03f4ef43";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  // console.log(apiUrl);
  // to get the information/data object from the URL above into our code, we have to use axios just like with the other API call
  // below says get the results of the URL and once done then call the displayForecast (which we made earlier)
  axios(apiUrl).then(displayForecast);
}

/* if we used the previous technique of adding id selectors to everything and all the days for the forecast section,
that would have way too many id's and become very cumbersome selecting everything.
So we are going to use a more advanced technique here. We are instead going to inject
all this code from javascript itself. For this we have to learn something called the Javascript templating - the ability to 
inject really long HTML from our javascript */

// let forecast = document.querySelector("#forecast");

// can't use the double quotes "" as that only lets you put one line in so have to use the back tick syntax ``:
/* doing the below creates just the one day forecast - we could copy and paste it lots of times like we originally did in the 
but this creates a lot of hard to maintain code and we don't want to repeat ourselves (DRY - don't repeat yourself) so ideally we
want to inject this once and then go through a loop to inject this 5 times so we get the forecast for the 5 days */
// forecast.innerHTML = `
//           <div class="weather-forecast-day">
//             <div class="weather-forecast-date">Tue</div>
//             <div class="weather-forecast-icon">🌤️</div>
//             <div class="weather-forecast-temperatures">
//               <div class="weather-forecast-temperature">
//                 <strong>15º</strong>
//               </div>
//               <div class="weather-forecast-temperature">9º</div>
//             </div>
//           </div>
// `;

// instead we will move this into a function so it is easier to maintain
function displayForecast(response) {
  console.log(response);

  // we want to have a loop that adds to it (not just replaces it) but every time it is called it is different
  // i.e. monday, then tuesday, then wednesday etc
  // the loop lets us loop through an array and then this array of days or of data will have 5 items

  // first creating a new array called days
  // this will have dummy data for now but will fix this later when integrating the API
  // let days = ["Tue", "Wed", "Thu", "Fri", "Sat"];
  // instead of the above array, we will now be using the array from the API which the daily data is stored in

  // found that if I didn't do it like the below where i set it as an empty string and straight away just did forecastElement.innerHTML+= all that js html template
  // then because I moved the getForecast function call inside the refreshWeather call, it meant every time i searched for a city, it would add 5 more of the divs with each call
  // e.g. searching for a place showed 10 forecast divs, doing it again showed 15 divs etc
  // so doing the below with the empty string resets this every time!
  let forecastHtml = "";

  // days.forEach(function (day) {
  // replacing the above with the array from the API which the daily data is stored in:
  // day below refers to the item of that array for that iteration
  // just having day as an argument below would make it so 7 days are displayed instead of 5
  // so we can pass in an index argument so that we can use an if statement with this!
  response.data.daily.forEach(function (day, index) {
    // make sure that you use '+=' for the innerHTML this time not just = so that it will add things from that iteration of the loop
    // to the previous iteration rather than just replacing it, so you get the 5 days not just the last day of the iteration!
    // i.e. concatenating a string

    // to get the day, we have the 'time' value in the API but it's not in a nice format so we have to create another fuction to format this first called 'formatDay'

    if (index > 0 && index <= 5) {
      forecastHtml =
        forecastHtml +
        `
            <div class="weather-forecast-day">
              <div class="weather-forecast-date">${formatDay(day.time)}</div>
              <div>
              <img src="${
                day.condition.icon_url
              }" class="weather-forecast-icon"/>
              </div>
              <div class="weather-forecast-temperatures">
                <div class="weather-forecast-temperature">
                  <strong>${Math.round(day.temperature.maximum)}º</strong>
                </div>
                <div class="weather-forecast-temperature">${Math.round(
                  day.temperature.minimum
                )}º</div>
              </div>
            </div>
  `;

      let forecastElement = document.querySelector("#forecast");
      forecastElement.innerHTML = forecastHtml;
    }
  });
}
