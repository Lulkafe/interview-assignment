import React from "react";
import { render } from "react-dom";
import { App } from "./app";
import "normalize.css";
import "../styles/global.sass";
import "../styles/app.sass";
import "../styles/searchbar.sass";
import "../styles/weatherTable.sass"

const container = document.getElementById("root");
render(<App/>, container);