import React, { useRef, useContext, useState, MutableRefObject } from "react";
import { CityInfo } from "../sharedTypes";
import { Dispatcher } from "../reducer";
import { parseGeoResults } from "../parser";
import AppContext from "../context";
import { fetchCityInfo, fetchWeatherInfo } from "../fetch";
import LoopeIcon from "../images/loope.png";
import LoadingIcon from "../images/loading.gif";
import { useEffect } from "react";


const SearchBar = () => {

    const { dispatcher } : { dispatcher: Dispatcher} = useContext(AppContext); 

    //Store the raw result (array) in a dic to quickly retrieve later
    //KEY: city name, VALUE: raw result 
    const [cachedGeoInfo, setCachedGeoInfo] = useState({}); 
   
    //Store the raw result (array) to show a suggestion table
    const [cityInfoToShow, setCityInfoToShow] = useState([]);

    //Check If the suggestion table can appear
    const [canShowTable, setCanShowTable] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const sgtnTableRef = useClickOutside(() => setCanShowTable(false));
    const minToRunAutoSearch = 3;
    const onInput = async () => {
        const userInput = inputRef.current.value.trim();
        
        //Auto-search shouldn't start and no suggestion table
        //if the user input is too short
        if (userInput.length < minToRunAutoSearch) {
            setCanShowTable(false);
            return setCityInfoToShow([]);
        }

        //If the search result is already cached, just use it
        if (userInput in cachedGeoInfo) {
            setCanShowTable(true);
            return setCityInfoToShow(cachedGeoInfo[userInput]);
        }

        const results: CityInfo [] | null = await fetchCityInfo(userInput);
        setCanShowTable(true);

        if (!results) 
            return setCityInfoToShow([]);
        
        setCachedGeoInfo({ ...cachedGeoInfo, [userInput]: results });
        setCityInfoToShow(results);

    }

    const aggregateWeatherData = async (index: number = 0) => {

        const userInput = inputRef.current.value.trim();
        let cityInfos: CityInfo [] | null = null;

        inputRef.current.value = "";
        setCityInfoToShow([]);
        setCanShowTable(false);
        
        if (userInput.length === 0)
            return;
        
        if (userInput in cachedGeoInfo) {
            const result = cachedGeoInfo[userInput];

            if (result.length === 0) {
                dispatcher.addNotFoundSearchResult(userInput);
                return;
            }
            
            cityInfos = result;
        } else {
            setIsLoading(true);
            cityInfos = await fetchCityInfo(userInput);
        }

        //Unexpected case: an error
        if (!cityInfos) {
            setIsLoading(false);
            return;
        }

        //The given city does not exist
        if (cityInfos.length === 0) {
            setIsLoading(false);
            dispatcher.addNotFoundSearchResult(userInput);            
            return;
        }

        const cityInfo: CityInfo = cityInfos[index];
        let weatherData = await fetchWeatherInfo(cityInfo.coordinates);

        setIsLoading(false);

        //Unexpected case: an error
        if (!weatherData)
            return;

        //Since the OpenWeather API only receives the latitude and the lontitude,
        //its response can have a different city name, so need to prevent it
        weatherData.name = cityInfo.name;

        dispatcher.addSearchResult(userInput, weatherData);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        aggregateWeatherData();
    }


    return (
        <div className="searchbar-wrapper">
            { /* Search bar + button */}
            <form onSubmit={onSubmit} className="searchbar">
                <input type="text"
                    className="searchbar__input" 
                    ref={inputRef} 
                    placeholder="Enter a city name"
                    onInput={onInput}
                    disabled={isLoading}/>
                <button type="submit" className="searchbar__button" disabled={isLoading}>
                    {
                        isLoading?
                        <img src={LoadingIcon} alt="loading animation" className="loading-icon"/> :
                        <img src={LoopeIcon} alt="loope icon" className="loope-icon"/>
                    }
                </button>
            </form>
            { /* Show a suggestion table or Not Found message */
                canShowTable &&
                <table className="sgtn-table" ref={sgtnTableRef}>
                    <tbody>{
                        cityInfoToShow.length > 0?
                        /* Suggested items with city names */
                        parseGeoResults(cityInfoToShow).map((city: CityInfo, i: number) => {
                            return (
                                <tr key={Math.random().toString(36)}>
                                    <td onClick={ () => aggregateWeatherData(i) } 
                                        className="sgtn-table__td-w-data">
                                        {`${city.name}, `}
                                        {city.state? `${city.state}, ` : ""}
                                        {city.country}
                                    </td>
                                </tr>
                            )
                        }) 
                        : 
                        /* When nothing to show */
                        <tr>
                            <td className="sgtn-table__td-wo-data">Not Found</td>
                        </tr>
                    }</tbody>
                </table>
            }
        </div>
    )
}


const useClickOutside = (callback) => {

    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if(ref.current && !ref.current.contains(e.target))
                callback();
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }

    }, [ref])

    return ref;
}


export default SearchBar;