if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const axios = require('axios');
const helmet = require('helmet');
const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN?.split(',');

import { Request, Response } from 'express';
import { WeatherAPISettings, GeoCodiAPISettings } from './apiSettings';
import { AxiosResponse } from 'axios';

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(cors({
    origin: ALLOWED_ORIGIN,
    methods: ['GET']
}));


app.get('/', (reqFromUser: Request, resToUser: Response) => {
    resToUser.sendStatus(200);
})


//Get data of the current weather from OpenWeather.
//Insted of the city name, the lattitude and lontidude must be given.
//Detail: https://openweathermap.org/current
app.get('/api/city/weather', async (reqFromUser: Request, resToUser: Response) => {
    const { lat, lon } = reqFromUser.query;  

    if (!lat || !lon || typeof lat !== 'number' || typeof lon !== 'number') 
        return resToUser.sendStatus(400);

    const query: string = `?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${WeatherAPISettings.units}`;
    const requestURL: string = WeatherAPISettings.URL + query;
  
    try {
        const resFromOpenAPI: AxiosResponse = await axios.get(requestURL);
        
        if (resFromOpenAPI.status !== 200) 
            return resToUser.sendStatus(resFromOpenAPI.status);
            
        resToUser.json(resFromOpenAPI.data);

    } catch(e) {
        console.error(e);
        resToUser.sendStatus(500);
    }
    
})


//Get an array of the corresponding city info 
//(e.g. Country Code, Latitude, Lontitude)
//Detail: https://openweathermap.org/api/geocoding-api
app.get('/api/city/info', async (reqFromUser: Request, resToUser: Response) => {
    const { cityName } = reqFromUser.query;  
    
    if (!cityName || typeof cityName !== 'string')
        return resToUser.sendStatus(400);

    const query: string = `?q=${cityName}&limit=${GeoCodiAPISettings.limit}&appid=${API_KEY}`;
    const requestURL: string = GeoCodiAPISettings.URL + query;
    
    try {
        const resFromOpenAPI: AxiosResponse = await axios.get(requestURL);
        
        if (resFromOpenAPI.status !== 200)
            return resToUser.sendStatus(resFromOpenAPI.status);
         
        resToUser.json(resFromOpenAPI.data);
    } catch(e) {
        console.error(e);
        resToUser.sendStatus(500);
    } 
})


if (!API_KEY)
    throw new Error("An environment variable, API_KEY is empty.")

if (!ALLOWED_ORIGIN)
    throw new Error("An environment variable, ALLOWED_ORIGIN is empty.");


server.listen(PORT, () => {
    console.log(`PORT: ${PORT}`);
    console.log(`ORIGIN: ${ALLOWED_ORIGIN}`);
    console.log(`Listening on port ${PORT}`)
})