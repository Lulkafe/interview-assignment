import React from "react";
import { useEffect, useReducer } from "react";
import Header from "./header";
import SearchBar from "./searchBar";
import AppContext from "../context";
import WeatherTable from "../components/weatherTable";
import { extractWeatherData } from "../parser";
import { stateReducer, Dispatcher, initState } from "../reducer";




export const App = () => {

    const [state, dispatch] = useReducer(stateReducer, initState);
    const dispatcher: Dispatcher = new Dispatcher(dispatch);

    return (
        <AppContext.Provider value={{state, dispatcher}}>
            <Header/>
            <SearchBar/>
            {
                state.searchResults.length > 0 && 
                <WeatherTable results={state.searchResults}/>
            }
        </AppContext.Provider>
    )
} 

