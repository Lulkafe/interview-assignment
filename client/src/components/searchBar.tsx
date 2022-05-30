import React, { useRef } from "react";

const SearchBar = () => {

    const inputRef = useRef(null);
    const onInput = () => {
        
    }

    return (
        <div>
            <input type="text" ref={inputRef}/>
            <button>Search</button>
        </div>
    )
}

export default SearchBar;