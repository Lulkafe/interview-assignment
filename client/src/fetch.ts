import API_URLs from 'APIConfig';
import { CityInfo, GeoCoordinates, WeatherInfo } from "./sharedTypes";
import { extractWeatherData, parseGeoResults } from "./parser";


export const fetchCityInfo = async (cityName: string): Promise<CityInfo[] | null> => {

    try {
        const query = `?cityName=${cityName}`;
        const res: Response = await fetch(API_URLs.geoLoc + query);

        if (res.ok) 
            return parseGeoResults(await res.json());

    } catch (e) {
        console.error(e);
    }

    return null;
}


export const fetchWeatherInfo = async (coordinates: GeoCoordinates): Promise<WeatherInfo | null> => {

    try {
        const query = `?lat=${coordinates.lat}&lon=${coordinates.lon}`;
        const resToWthAPI: Response = await fetch(API_URLs.weather + query);

        if (resToWthAPI.ok)  
            return extractWeatherData(await resToWthAPI.json());
            
    } catch (e) {
        console.error(e);
    }
        
    return null;
}

//Server instance sleeps if there is no access for 15 min under a free plan
//This function just tries to wake the server up.
//The server responds with 200 (OK) for this URL.
export const pingToServer = async () => {
    await fetch(API_URLs.ping);
}