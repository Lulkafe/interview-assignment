import React from "react";
import { useEffect } from "react";
import Header from "./header";
import SearchBar from "./searchBar";
import WeatherTable from "../components/weatherTable";
import { parseWeatherData } from "../parser";

//Just test
import SampleData from "../sample/WeatherSampleResult.json";
import { SearchResult } from "../sharedTypes";


export const App = () => {

    const parsedData = parseWeatherData(SampleData);
    const testInput: SearchResult[] = [{ keyword: "Mountain View", data: parsedData}];


    return (
        <>
            <Header/>
            <h1>Test</h1>
            {/*<SearchBar/>*/}
            <WeatherTable results={testInput}/>
        </>
    )
} 

