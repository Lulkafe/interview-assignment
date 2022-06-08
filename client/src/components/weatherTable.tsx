import React from "react";
import { SearchResult, WeatherInfo } from "../sharedTypes";


type ResultTableProps = {
    results: SearchResult []
}

type TableRowProps = {
    result: SearchResult
}


const WeatherTable = (props: ResultTableProps) => {

    const { results }: { results: SearchResult[] } = props;
    const getKey = () => Math.random().toString(36);

    return (
        <table className="wthr-table">
            <tbody>
            {
                results.map((result: SearchResult) => {
                    return result.data? 
                        <TableRowWithData result={result} key={getKey()}/> :
                        <TableRowWithoutData result={result} key={getKey()}/>
                })
            }
            </tbody>
        </table>
    )
}


const TableRowWithData = (props: TableRowProps) => {

    const data: WeatherInfo = props.result.data;

    return (
        <tr className="wthr-table__tr">
            <td className="wthr-table__td">
                { `${data.name}, ${data.country}` }
                <br/>
                <span className="wthr-table-td__current-wthr">
                    { data.weather.current }
                </span>
                &nbsp; 
                <span className="wthr-table-td__temp">
                    🌡️{ Math.round(data.temp) }&#8451;
                </span>
            </td>
        </tr>
    )
}


const TableRowWithoutData = (props: TableRowProps) => {

    const { result }: { result: SearchResult } = props;

    return (
        <tr>
            <td className="wthr-table__td wthr-table__not-found-td">
                <span>
                    Not Found: "{result.keyword}"
                </span>
            </td>
        </tr>
    )
}


export default WeatherTable;