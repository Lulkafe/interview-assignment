export type GeoCoordinates = {
    lat: number,
    lon: number
}

export type CityInfo = {
    name: string,
    country: string,
    state?: string,
    coordinates: GeoCoordinates
}

export type WeatherInfo = {
    name: string,
    country: string,
    temp: number,
    weather: {
        current: string,
        description: string
    }
}

export type SearchResult = {
    keyword: string,
    data: null | WeatherInfo
}

export type AppState = {
    searchResults: SearchResult[]
}

export type Action = {
    type: string,
    value: any
}