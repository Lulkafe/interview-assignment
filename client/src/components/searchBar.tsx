import React, { useRef, useEffect, useContext, useState } from "react";
import { AppState, GeoCoordinates, SearchResult } from "../sharedTypes";
import { Dispatcher } from "../reducer";
import API_URLs from "../apiInfo";

//Just test
import { parseGeoData, parseWeatherData } from "../parser";
import SampleData from "../sample/WeatherSampleResult.json";
import AppContext from "../context";

const SearchBar = () => {

    const { dispatcher } : { dispatcher: Dispatcher} = useContext(AppContext);
    const parsedData = parseWeatherData(SampleData);
    const testInput: SearchResult = { keyword: "Mountain View", data: parsedData};
    const searched = {};

    const inputRef = useRef(null);
    const onInput = async () => {
        const input = inputRef.current.value;
        const minInputLen = 3;
        const query = `?cityName=${input}`;
        
        //Auto-search shouldn't start if the user input is too short
        if (input.length < minInputLen)
            return;

        //If already searched, return the cached result
        if (input in searched) {
            console.log(searched[input]);
            return;
        }

        try {
            const res: Response = await fetch(API_URLs.dev.geoLoc + query);
            const results = await res.json();
            console.log(results);

            searched[input] = results;

        } catch (e) {
            console.error(e);
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const input = inputRef.current.value;
        
        if (input.length === 0)
            return;

        try {
            const resToGeoAPI: Response = await fetch(API_URLs.dev.geoLoc);
            const geoInfo = await resToGeoAPI.json();

            if (geoInfo.length === 0) {
                const notFound: SearchResult = {
                    keyword: input,
                    data: null
                }
                dispatcher.addSearchResult(notFound);
                return;
            }

            const coordinates: GeoCoordinates = parseGeoData(geoInfo[0]);
            const query = `?lat=${coordinates.lat}&lon=${coordinates.lon}`;
            const resToWthAPI: Response = await fetch(API_URLs.dev.weather + query);
            const weatherData = await resToWthAPI.json();

            console.log(weatherData)

        } catch (e) {
            console.error(e);
        }

        //dispatcher.addSearchResult(testInput)
    }



    return (
        <form onSubmit={onSubmit}>
            <input type="text" 
                ref={inputRef} 
                placeholder="Enter a city name"
                onInput={onInput}/>
            <button type="submit">Search</button>
        </form>
    )
}

export default SearchBar;