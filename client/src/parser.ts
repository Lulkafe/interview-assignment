import { CityInfo, GeoCoordinates, WeatherInfo } from "./sharedTypes";


export const extractGeoCoordinates = (data): GeoCoordinates => {
    return {
        lat: data.lat,
        lon: data.lon
    }
}

export const parseGeoResults = (data): CityInfo[] => {

    console.log(data)

    return data.map(d => {
        let cityInfo = {
            name: d.name,
            country: d.country,
            coordinates: extractGeoCoordinates(d)
        }
    
        if (d.state) 
            cityInfo["state"] = d.state;
    
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
