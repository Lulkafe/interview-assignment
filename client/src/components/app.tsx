import React from "react";
import { useEffect, useReducer } from "react";
import Header from "./header";
import SearchBar from "./searchBar";
import AppContext from "../context";
import WeatherTable from "../components/weatherTable";
import { parseWeatherData } from "../parser";
import { stateReducer, Dispatcher, initState } from "../reducer";

//Just test
import SampleData from "../sample/WeatherSampleResult.json";
import { SearchResult } from "../sharedTypes";


export const App = () => {

    const parsedData = parseWeatherData(SampleData);
    const testInput: SearchResult[] = [{ keyword: "Mountain View", data: parsedData}];

    const [state, dispatch] = useReducer(stateReducer, initState);
    const dispatcher: Dispatcher = new Dispatcher(dispatch);


    useEffect(() => {

    }, []) 


    return (
        <AppContext.Provider value={{state, dispatcher}}>
            <Header/>
            <h1>Test</h1>
            <SearchBar/>
            <WeatherTable results={testInput}/>
        </AppContext.Provider>
    )
} 

