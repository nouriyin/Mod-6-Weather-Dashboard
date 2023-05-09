//query selector for the search/get-data button
const dataButton = document.querySelector("#get_data");
const dashboardContainer = document.querySelector("#dashboard-container")
//query selector for the search input field
const searchInput = document.querySelector("#search_input");

//query selector for the target container that will display our data
const targetContainer = document.querySelector("#target_container");

const API_KEY = "fa4c324a8ce968139a13dd15a300d316";

/*
In this particular example we are going to use the more modern async/await syntax instead of .then chaining and the node-fetch library to make the API call.
Here we are also using the open-weather API to get weather data. 
This api requires 2 separate pieces to work - a location and an api key.To get the location we are going to use the geolocation API.
*/

//This will call the geolocation API and return the location data
const getLocation = async (searchInput) => {
	const geo_api_url = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&limit=1&appid=${API_KEY}&units=imperial`;
	try {
		//use the fetch library to make the API call
		const response = await fetch(geo_api_url);

		//convert the response to json - by default it comes from the api as stringified json
		const locationData = await response.json();
console.log(locationData)
dashboardContainer.innerHTML=`<h1 class="display-5 fw-bold"> ${locationData.name} ${dayjs.unix(locationData.dt).format("MM/DD/YYYY")} </h1>
<p class="col-md-8 fs-4">Temp: ${locationData.main.temp} Wind: ${locationData.wind.speed} Humidity: ${locationData.main.humidity}</p>`
		//return the json data
		return locationData;
	} catch (error) {
		console.error(error);
	}
};

//This will call the open-weather API and return the weather data
const getForecast = async (cityName) => {
	const weather_api_url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`;
	try {
		const response = await fetch(weather_api_url);
		const weatherData = await response.json();
		console.log(weatherData);
		displayData(weatherData);
	} catch (error) {
		console.error(error);
	}
};

//this will recieve the data from the getForcast function and display it on the page
const displayData = (weatherData) => {
	//one of the easierst ways to display this day is to use a template literal to construct raw HTML and then apply it as the innerHTML of the target container
	console.log(weatherData);
	targetContainer.innerHTML = `
 Exampole Setup
  <div class="card">

    <div class="card-body">
      <h5 class="card-title">Current Weather</h5>
      <img src="https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png" alt="weather icon">
      <p class="card-text">The current temperature is ${weatherData.current.temp} degrees Farenheit</p>
      <p class="card-text">The current humidity is ${weatherData.current.humidity}%</p>
      <p class="card-text">The current wind speed is ${weatherData.current.wind_speed} mph</p>
      <p class="card-text">The current UV index is ${weatherData.current.uvi}</p>
    </div>
 `;
};

//add an event listener on the search button to get data from the search input field
dataButton.addEventListener("click", async () => {
	//asign the value of the search input field to a variable and pass it to the geolocation API.
	//since this field is declared at the top of the page we only need to apply the .value property to it
	const searchValue = searchInput.value;

	//call the getLocation function to get the location data - note you need to await the response so you can pass it to the getForecast function
	const location = await getLocation(searchValue);

	//call the getForecast function
	getForecast(searchValue);
});