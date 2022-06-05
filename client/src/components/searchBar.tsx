import React, { useRef, useEffect, useContext, useState } from "react";
import { AppState, GeoCoordinates, SearchResult } from "../sharedTypes";
import { Dispatcher } from "../reducer";
import API_URLs from "../apiInfo";
import { extractGeoCoordinates, extractWeatherData } from "../parser";
import AppContext from "../context";

const SearchBar = () => {

    const { dispatcher } : { dispatcher: Dispatcher} = useContext(AppContext);
    const [cachedGeoInfo, setCachedGeoInfo] = useState({});
    const [cityGeoInfo, setCityGeoInfo] = useState([]);
    const inputRef = useRef(null);
    const onInput = async () => {
        const userInput = inputRef.current.value.trim();
        const minInputLen = 3;
        const query = `?cityName=${userInput}`;
        
        //Auto-search shouldn't start if the user input is too short
        if (userInput.length < minInputLen) 
            return;
        

        //If the word was already searched, just use the cached result
        if (userInput in cachedGeoInfo) 
            return setCityGeoInfo(cachedGeoInfo[userInput]);
            

        try {
            const res: Response = await fetch(API_URLs.dev.geoLoc + query);
            const results = await res.json();

            setCachedGeoInfo({ ...cachedGeoInfo, [userInput]: results });
            setCityGeoInfo(results);

        } catch (e) {
            console.error(e);
        }
    }

    const onSubmit = async (e) => {

        e.preventDefault();
        e.stopPropagation();

        const userInput = inputRef.current.value.trim();
        inputRef.current.value = "";
        
        if (userInput.length === 0)
            return;
        
        try {

            let geoInfo = null;

            if (userInput in cachedGeoInfo) {
                const result = cachedGeoInfo[userInput];

                if (result.length === 0) 
                    return dispatcher.addNotFoundSearchResult(userInput);
                
                geoInfo = result;

            } else {
                const query = `?cityName=${userInput}`;
                const resToGeoAPI: Response = await fetch(API_URLs.dev.geoLoc + query);

                geoInfo = await resToGeoAPI.json();
            }


            if (geoInfo.length === 0) 
                return dispatcher.addNotFoundSearchResult(userInput);
                
    
            const coordinates: GeoCoordinates = extractGeoCoordinates(geoInfo[0]);
            const query = `?lat=${coordinates.lat}&lon=${coordinates.lon}`;
            const resToWthAPI: Response = await fetch(API_URLs.dev.weather + query);
            const weatherData = await resToWthAPI.json();

            dispatcher.addSearchResult(userInput, extractWeatherData(weatherData));

        } catch (e) {
            console.error(e);
        }

    }


    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" 
                    ref={inputRef} 
                    placeholder="Enter a city name"
                    onInput={onInput}/>
                <button type="submit">Search</button>
            </form>
            
        </div>
    )
}


const SuggestTable = (props) => {

    return (
        <table>
            <tbody>

            </tbody>
        </table>
    )
}


export default SearchBar;