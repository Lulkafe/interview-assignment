import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import "normalize.css";
import "../styles/global.sass";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>);