// const express = require("express");
// const bodyParser = require("body-parser");
const axios = require("axios");
const { Client } = require("@line/bot-sdk");

// const app = express();
// app.use(bodyParser.json());

const LINE_CONFIG = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};

const lineClient = new Client(LINE_CONFIG);

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

async function getWeather(city = "Tokyo") {
    const response = await axios.get(WEATHER_API_URL, {
        params: {
            q: city,
            appid: WEATHER_API_KEY,
            units: "metric",
        },
    });

    const weather = response.data;
    const temp = weather.main.temp;
    const description = weather.weather[0].description;
    const icon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;

    return {
        type: 'flex',
        altText: 'Today’s Weather',
        contents: {
          type: 'bubble',
          header: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: `Weather in ${weather.name}`,
                weight: 'bold',
                size: 'xl',
              },
            ],
          },
          hero: {
            type: 'image',
            url: icon,
            size: 'full',
            aspectRatio: '1:1',
            aspectMode: 'cover',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: `Temperature: ${temp}°C`,
                size: 'md',
              },
              {
                type: 'text',
                text: `Condition: ${description}`,
                size: 'md',
              },
            ],
          },
        },
      };
}

async function main() { 
    const weatherMessage = await getWeather('Tokyo');
    await lineClient.pushMessage(userId, weatherMessage);
}

main();
