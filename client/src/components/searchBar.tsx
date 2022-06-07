import React, { useRef, useContext, useState } from "react";
import { CityInfo } from "../sharedTypes";
import { Dispatcher } from "../reducer";
import { parseGeoResults } from "../parser";
import AppContext from "../context";
import { fetchCityInfo, fetchWeatherInfo } from "../fetch";
import LoopeIcon from "../images/loope.png";


const SearchBar = () => {

    const { dispatcher } : { dispatcher: Dispatcher} = useContext(AppContext); 

    //Store the raw result (array) in a dic to quickly retrieve later
    //KEY: city name, VALUE: raw result 
    const [cachedGeoInfo, setCachedGeoInfo] = useState({}); 
   
    //Store the raw result (array) to show a suggestion table
    const [cityInfoToShow, setCityInfoToShow] = useState([]);

    const inputRef = useRef(null);
    const minLenToRunAuto = 3;

    const onInput = async () => {
        const userInput = inputRef.current.value.trim();
        
        //Auto-search shouldn't start if the user input is too short
        if (userInput.length < minLenToRunAuto) 
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

    const aggregateWeatherData = async (index: number = 0) => {

        const userInput = inputRef.current.value.trim();
        let cityInfos: CityInfo [] | null = null;

        inputRef.current.value = "";
        setCityInfoToShow([]);
        
        if (userInput.length === 0)
            return;
        
        if (userInput in cachedGeoInfo) {
            const result = cachedGeoInfo[userInput];

            if (result.length === 0) 
                return dispatcher.addNotFoundSearchResult(userInput);
            
            cityInfos = result;
        } else {
            cityInfos = await fetchCityInfo(userInput);
        }

        //Unexpected case: an error
        if (!cityInfos) 
            return;

        if (cityInfos.length === 0) 
            return dispatcher.addNotFoundSearchResult(userInput);            

        const cityInfo: CityInfo = cityInfos[index];
        let weatherData = await fetchWeatherInfo(cityInfo.coordinates);


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
            <form onSubmit={onSubmit} className="searchbar">
                <input type="text"
                    className="searchbar__input" 
                    ref={inputRef} 
                    placeholder="Enter a city name"
                    onInput={onInput}/>
                <button type="submit" className="searchbar__button">
                    <img src={LoopeIcon} alt="loope icon" className="loope-icon"/>
                </button>
            </form>
            { 
                /* Show a suggestion table */
                cityInfoToShow.length > 0 &&
                <table className="sgtn-table">
                    <tbody>{
                        parseGeoResults(cityInfoToShow).map((city: CityInfo, i: number) => {
                            return (
                                <tr key={Math.random().toString(36)}>
                                    <td onClick={ () => aggregateWeatherData(i) } 
                                        className="sgtn-table__td">
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
            {
                /* Show Not Found message only when auto-search runs and found nothing */
                inputRef.current?.value?.length >= minLenToRunAuto && 
                cityInfoToShow.length === 0 &&
                <p className="sgtn-table__not-found-msg">Not Found</p>
            }   
        </div>
    )
}


export default SearchBar;