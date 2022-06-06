import { CityInfo, WeatherInfo } from "./sharedTypes";


export const parseGeoResults = (data): CityInfo[] => {

    return data.map(datum => {
        let cityInfo = {
            name: datum.name,
            country: datum.country,
            coordinates: {
                lat: datum.lat,
                lon: datum.lon
            }
        }
    
        if (datum.state) 
            cityInfo["state"] = datum.state;
    
        return cityInfo;
    });
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
