import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const open_Street_Map_Url = 'https://nominatim.openstreetmap.org/search';
const weather_Api_Url = 'https://api.openweathermap.org/data/2.5/weather';
const weather_Api_Key = 'fb1f80246432949d44951c3025410344';

app.get('/getWeather', async (req: Request, res: Response) => {
  // Extract the city name from the query parameter
  const city_name = req.query.city as string;

  // Check if the city name is missing in the request
  if (!city_name) {
    return res.status(400).json({ error: 'City name is missing in the request' });
  }

  try {
    // Fetch coordinates using OpenStreetMap API
    console.log('here 1')
    const open_Street_Map_Response = await axios.get(open_Street_Map_Url, {
      params: {
        q: city_name,
        format: 'json',
      },
    });

    console.log('here 2')
    console.log(open_Street_Map_Response.data)

    // Check if the OpenStreetMap API returned valid data
    if (!Array.isArray(open_Street_Map_Response.data) || open_Street_Map_Response.data.length === 0) {
      return res.status(404).json({ error: 'City not found' });
    }

    // Extract latitude and longitude from OpenStreetMap response
    const { lat, lon } = open_Street_Map_Response.data[0];

    console.log(`coordinates= ${lat}, ${lon}`);

    // Fetch weather data using weather API
    const weather_Api_Response = await axios.get(weather_Api_Url, {
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
  } catch (error) {
    // Log any errors that occur during the process
    console.error('Error fetching weather data:', error);

    // Send a 500 Internal Server Error response
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

// Set up the server to listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
