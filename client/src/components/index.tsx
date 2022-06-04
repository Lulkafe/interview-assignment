import React from "react";
import { render } from "react-dom";
import { App } from "./app";
import "normalize.css";
import "../styles/global.sass";

const container = document.getElementById("root");
render(<App/>, container);