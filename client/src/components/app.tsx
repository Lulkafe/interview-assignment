import React from "react";
import { useEffect, useReducer } from "react";
import SearchBar from "./searchBar";
import AppContext from "../context";
import WeatherTable from "../components/weatherTable";
import { stateReducer, Dispatcher, initState } from "../reducer";
import MainLogo from "../images/icon.png";


export const App = () => {

    const [state, dispatch] = useReducer(stateReducer, initState);
    const dispatcher: Dispatcher = new Dispatcher(dispatch);

    return (
        <AppContext.Provider value={{state, dispatcher}}>
            <div className="app-wrapper">
                <div className="upper-content-wrapper">
                    <img src={MainLogo} alt="Main logo" className="main-logo"/>
                    <SearchBar/>
                </div>
                {
                    state.searchResults.length > 0 && 
                    <WeatherTable results={state.searchResults}/>
                }
            </div>
        </AppContext.Provider>
    )
} 

