import { Dispatch, useDebugValue } from "react"
import { Action, WeatherInfo } from "./sharedTypes"
import { SearchResult } from "./sharedTypes"
import { AppState } from "./sharedTypes"


export const initState: AppState = {
    searchResults: []
}

const ACTIONS = {
    ADD: {
        RESULT: "Add a new search result"
    }
}

export class Dispatcher {
    
    private dispatch: Dispatch<object>;

    constructor(dispatch) {
        this.dispatch = dispatch;
    }

    addSearchResult (result: SearchResult) {
        const input: Action = { type: ACTIONS.ADD.RESULT, value: result };
        this.dispatch(input);
    }
}

export const stateReducer = (state: AppState, action: Action) => {
    switch(action.type) {

        case ACTIONS.ADD.RESULT:
            return {
                ...state,
                searchResults: [action.value, ...state.searchResults]
            }

        default:
            return state;
    }
}