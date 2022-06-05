import { CityInfo, GeoCoordinates, WeatherInfo } from "./sharedTypes";


export const extractGeoCoordinates = (data): GeoCoordinates => {
    return {
        lat: data.lat,
        lon: data.lon
    }
}

export const extractCityInfo = (data): CityInfo => {
    let cityInfo = {
        name: data.name,
        country: data.country
    }

    if (data.state) 
        cityInfo["state"] = data.state;

    return cityInfo;
}


export const extractWeatherData = (data): WeatherInfo => {
    return {
        name: data.name,
        country: data.sys.country,
        temp: data.main.temp,
        weather: {
            current: data.weather[0].main,
            description: data.weather[0].description
        }
    };
}
