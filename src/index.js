import React from 'react';
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import App from "./components/app";


const components = [
    {
        className: "container-fluid",
        components : [
            {
                // grouping elements should never have a named defined, and must always
                // contain an array at key `components`
                className: "row",
                components : [
                    {
                        name : "Starfield", // must match react component class to be rendered
                        className: "col-9",
                    },
                    {
                        className: "col-3",
                        components : [
                            {
                                className: "row",
                                components : [
                                    {
                                        name : "Radar", // rmust match react component class to be rendered
                                        className: "col",
                                    },
                                ],
                            },
                            {
                                className: "row",
                                components : [
                                    {
                                        name : "MeterHoriz", // rmust match react component class to be rendered
                                        className: "col",
                                    },
                                ],
                            },
                            {
                                className: "row",
                                components : [
                                    {
                                        name : "MeterHoriz", // rmust match react component class to be rendered
                                        className: "col",
                                    },
                                ],
                            },
                            {
                                className: "row",
                                components : [
                                    {
                                        name : "MeterHoriz", // rmust match react component class to be rendered
                                        className: "col",
                                    },
                                ],
                            },
                            {
                                className: "row",
                                components : [
                                    {
                                        name : "MeterHoriz", // rmust match react component class to be rendered
                                        className: "col",
                                    },
                                ],
                            },
                            {
                                className: "row",
                                components : [
                                    {
                                        name : "MeterHoriz", // rmust match react component class to be rendered
                                        className: "col",
                                    },
                                ],
                            },
                            {
                                className: "row",
                                components : [
                                    {
                                        name : "Ekg", // rmust match react component class to be rendered
                                        className: "col",
                                    },
                                ],
                            }
                        ],
                    },
                ],
            },
            {
                className: "row",
                components : [
                    {
                        name : "Cassette", // rmust match react component class to be rendered
                        className: "col-3"
                    },
                    {
                        className: "col-3",
                        components: [
                            {
                                className: "row",
                                components : [
                                    {
                                        name : "SvgButton", // must match react component class to be rendered
                                        className: "col-6",
                                        src: "notes2.svg"
                                    },
                                     {
                                        name : "SvgButton", // must match react component class to be rendered
                                        className: "col-6",
                                        src: "playpause.svg"
                                    },
                                ]
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

ReactDOM.render(
  <App components={components} />,
  document.getElementById("root")
);