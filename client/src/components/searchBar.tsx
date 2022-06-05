import React, { useRef, useEffect, useContext, useState } from "react";
import { AppState, CityInfo, GeoCoordinates, SearchResult } from "../sharedTypes";
import { Dispatcher } from "../reducer";
import API_URLs from "../apiInfo";
import { extractGeoCoordinates, extractWeatherData, parseGeoResults } from "../parser";
import AppContext from "../context";
import { fetchCityInfo, fetchWeatherInfo } from "../fetch";

type SuggestionTableProps = {
    results: CityInfo []
}


const SearchBar = () => {

    const { dispatcher } : { dispatcher: Dispatcher} = useContext(AppContext); 

    //Store the raw result (array) in a dic to quickly retrieve later
    //KEY: city name, VALUE: raw result 
    const [cachedGeoInfo, setCachedGeoInfo] = useState({}); 
   
    //Store the raw result (array) to show a suggestion table
    const [cityInfoToShow, setCityInfoToShow] = useState([]);

    const inputRef = useRef(null);
    const onInput = async () => {
        const userInput = inputRef.current.value.trim();
        const minInputLen = 3;
        
        //Auto-search shouldn't start if the user input is too short
        if (userInput.length < minInputLen) 
            return setCityInfoToShow([]);
        

        //If the word was already searched, just use the cached result
        if (userInput in cachedGeoInfo) 
            return setCityInfoToShow(cachedGeoInfo[userInput]);
            

        const results: CityInfo [] | null = await fetchCityInfo(userInput);

        if (!results) 
            return setCityInfoToShow([]);

        setCachedGeoInfo({ ...cachedGeoInfo, [userInput]: results });
        setCityInfoToShow(results);

    }

    const onSubmit = async (e) => {

        e.preventDefault();
        e.stopPropagation();

        const userInput = inputRef.current.value.trim();
        let cityInfo: CityInfo [] | null = null;

        inputRef.current.value = "";
        setCityInfoToShow([]);
        
        if (userInput.length === 0)
            return;
        
        if (userInput in cachedGeoInfo) {
            const result = cachedGeoInfo[userInput];

            if (result.length === 0) 
                return dispatcher.addNotFoundSearchResult(userInput);
            
            cityInfo = result;
        } else {
            cityInfo = await fetchCityInfo(userInput);
        }

        if (!cityInfo) 
            return;

        if (cityInfo.length === 0) 
            return dispatcher.addNotFoundSearchResult(userInput);
            
        const weatherData = await fetchWeatherInfo(cityInfo[0].coordinates);

        if (!weatherData)
            return;

        dispatcher.addSearchResult(userInput, weatherData);

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
            {cityInfoToShow.length > 0 &&
                <table>
                    <tbody>{
                        parseGeoResults(cityInfoToShow).map((city: CityInfo, i: number) => {
                            return (
                                <tr key={Math.random().toString(36)}>
                                    <td>
                                        {`${city.name}, `}
                                        {city.state? `${city.state}, ` : ""}
                                        {city.country}
                                    </td>
                                </tr>
                            )
                        })
                    }</tbody>
                </table>
            }
        </div>
    )
}



export default SearchBar;