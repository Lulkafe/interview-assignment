export type GeoCoordinates = {
    lat: number,
    lon: number
}

export type WeatherInfo = {
    name: string,
    country: string,
    temp: {
        max: number,
        min: number
    },
    weather: {
        current: string,
        description: string
    }
}

export type SearchResult = {
    keyword: string,
    data: null | WeatherInfo
}

export type ResultTableProps = {
    results: SearchResult []
}