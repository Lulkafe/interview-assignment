import { GeoCoordinates, WeatherInfo } from "./types";


export const parseGeoData = (data): GeoCoordinates => {
    return {
        lat: data.lat,
        lon: data.lon
    }
}

export const parseWeatherData = (data): WeatherInfo => {
    return {
        name: data.name,
        country: data.sys.country,
        temp: {
            max: data.main.temp_max,
            min: data.main.temp_min
        },
        weather: {
            current: data.weather[0].main,
            description: data.weather[0].description
        }
    };
}
