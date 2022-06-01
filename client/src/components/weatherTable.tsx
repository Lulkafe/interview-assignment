import React from "react";
import { SearchResult, WeatherInfo } from "../types";


export type ResultTableProps = {
    results: SearchResult []
}

export type TableRowProps = {
    result: SearchResult
}


const WeatherTable = (props: ResultTableProps) => {

    const { results }: { results: SearchResult[] } = props;

    return (
        <table>
            <tbody>
            {
                results.map((result: SearchResult) => {
                    return result.data? 
                        <TableRowWithData result={result}/> :
                        <TableRowWithoutData result={result}/>
                })
            }
            </tbody>
        </table>
    )
}


const TableRowWithData = (props: TableRowProps) => {

    const data: WeatherInfo = props.result.data;

    return (
        <tr key={Math.random().toString(36)}>
            <td>
                { data.name } <br/>
                { data.country } <br/>
                { data.weather.current }
            </td>
        </tr>
    )
}


const TableRowWithoutData = (props: TableRowProps) => {

    const { result }: { result: SearchResult } = props;

    return (
        <tr key={Math.random().toString(36)}>
            <td>
                <p>Not Found: ${result.keyword}</p>
            </td>
        </tr>
    )
}


export default WeatherTable;