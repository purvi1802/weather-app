"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const open_Street_Map_Url = 'https://nominatim.openstreetmap.org/search';
const weather_Api_Url = 'https://api.openweathermap.org/data/2.5/weather';
const weather_Api_Key = 'fb1f80246432949d44951c3025410344';
app.get('/getWeather', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract the city name from the query parameter
    const city_name = req.query.city;
    // Check if the city name is missing in the request
    if (!city_name) {
        return res.status(400).json({ error: 'City name is missing in the request' });
    }
    try {
        // Fetch coordinates using OpenStreetMap API
        console.log('here 1');
        const open_Street_Map_Response = yield axios_1.default.get(open_Street_Map_Url, {
            params: {
                q: city_name,
                format: 'json',
            },
        });
        console.log('here 2');
        console.log(open_Street_Map_Response.data);
        // Check if the OpenStreetMap API returned valid data
        if (!Array.isArray(open_Street_Map_Response.data) || open_Street_Map_Response.data.length === 0) {
            return res.status(404).json({ error: 'City not found' });
        }
        // Extract latitude and longitude from OpenStreetMap response
        const { lat, lon } = open_Street_Map_Response.data[0];
        console.log(`coordinates= ${lat}, ${lon}`);
        // Fetch weather data using weather API
        const weather_Api_Response = yield axios_1.default.get(weather_Api_Url, {
            params: {
                // add required parameters for weather API
                lat,
                lon,
                appid: weather_Api_Key,
            },
        });
        // Check if the weather API request was successful
        if (weather_Api_Response.status !== 200) {
            return res.status(weather_Api_Response.status).json({ error: 'Error fetching weather data from OpenWeatherMap API' });
        }
        // Extract weather data from the response
        const weather_data = weather_Api_Response.data;
        // Send the weather data as a JSON response
        return res.json({ weather: weather_data });
    }
    catch (error) {
        // Log any errors that occur during the process
        console.error('Error fetching weather data:', error);
        // Send a 500 Internal Server Error response
        return res.status(500).json({ error: 'Something went wrong' });
    }
}));
// Set up the server to listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
