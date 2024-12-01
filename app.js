// weather.js

// API Key
const apiKey = '84fa04ea66e8e46174de7ff98bbe972c';

// Function to fetch weather by city name
async function getWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${'84fa04ea66e8e46174de7ff98bbe972c'}&units=metric`);
        const data = await response.json();

        if (response.ok) {
            displayWeather(data); // Display weather data
            saveToLocalStorage(city); // Save city to localStorage
            getForecast(city); // Fetch extended forecast
        } else {
            alert(data.message); // Show error message if city not found
        }
    } catch (error) {
        console.error('Error fetching weather data:', error); // Log error
    }
}

// Function to fetch weather by latitude and longitude
async function getWeatherByLocation(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${'84fa04ea66e8e46174de7ff98bbe972c'}&units=metric`);
        const data = await response.json();
        if (response.ok) {
            displayWeather(data); // Display weather data for current location
        } else {
            alert(data.message); // Show error message if location not found
        }
    } catch (error) {
        console.error('Error fetching weather for location:', error); // Log error
    }
}

// Function to fetch extended weather forecast
async function getForecast(city) {
    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${'84fa04ea66e8e46174de7ff98bbe972c'}&units=metric`);
    const forecastData = await forecastResponse.json();

    if (forecastResponse.ok) {
        displayForecast(forecastData); // Display extended forecast
    }
}

// Function to display weather data
function displayWeather(data) {
    const weatherData = document.getElementById('weather-data');
    weatherData.innerHTML = `
        <h2 class="text-xl font-bold">${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
    weatherData.style.display = 'block'; // Show weather data section
}

// Function to display extended forecast data
function displayForecast(data) {
    const forecastData = document.getElementById('forecast-data');
    forecastData.innerHTML = `<h2 class="text-xl font-bold">5-Day Forecast</h2>`;
    
    data.list.forEach((item, index) => {
        if (index % 8 === 0) { // Display data for every 8th entry (3-hour intervals)
            forecastData.innerHTML += `
                <div class="weather-item">
                    <p>Date: ${item.dt_txt}</p>
                    <p>Temp: ${item.main.temp}°C</p>
                    <p>Weather: ${item.weather[0].description}</p>
                    <p>Humidity: ${item.main.humidity}%</p>
                    <p>Wind Speed: ${item.wind.speed} m/s</p>
                </div>
            `;
        }
    });
    forecastData.style.display = 'block'; // Show forecast data section
}

// Function to save city to localStorage and update the dropdown
function saveToLocalStorage(city) {
    let recentCities = JSON.parse(localStorage.getItem('recentCities')) || []; // Get recent cities from localStorage
    if (!recentCities.includes(city)) {
        recentCities.push(city); // Add new city if not already in the list
        localStorage.setItem('recentCities', JSON.stringify(recentCities)); // Save updated list to localStorage
        updateDropdown(recentCities); // Update dropdown with recent cities
    }
}

// Function to update the recent cities dropdown
function updateDropdown(recentCities) {
    const dropdown = document.getElementById('recent-cities-dropdown');
    dropdown.innerHTML = `<option value="">Select Recent City</option>`; // Clear existing options
    recentCities.forEach(city => {
        dropdown.innerHTML += `<option value="${city}">${city}</option>`; // Add recent cities to dropdown
    });
}

// Event listener for the search button
document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim(); // Get city input
    if (city) {
        getWeather(city); // Fetch weather for the entered city
    } else {
        alert('Please enter a valid city name.'); // Alert for empty input
    }
});

// Event listener for the current location button
document.getElementById('current-location-btn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude; // Get latitude
            const lon = position.coords.longitude; // Get longitude
            getWeatherByLocation(lat, lon); // Fetch weather by location
        }, (error) => {
            alert('Error getting location: ' + error.message); // Handle error
        });
    } else {
        alert('Geolocation is not supported by this browser.'); // Handle unsupported case
    }
});

// Event listener for selecting a recent city from the dropdown
document.getElementById('recent-cities-dropdown').addEventListener('change', (event) => {
    const city = event.target.value; // Get selected city
    if (city) {
        getWeather(city); // Fetch weather for selected city
    }
});