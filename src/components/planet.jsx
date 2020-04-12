import React, { Component } from 'react';
import * as d3 from "d3";
import * as topojson from "topojson-client";

class Planet extends Component {
    constructor(props){
        super(props);
        this.myRef = React.createRef();
        this.state = {};
        this.state.rotation = [0,-10,-10];
        this.state.spinIncrement = .5; // in degrees
        this.state.frameRate = 400 // in millesconds
        this.state.graticule = d3.geoGraticule10();
        this.state.sphere = {type: "Sphere"};
        this.state.strokeColor =  "#5eff89"; // green
        this.state.StrokeColorAlpha = "rgb(94, 255, 137, .6";
        this.state.StrokeColor2 = "#eb4034"; // red
        this.state.distance = Math.floor(Math.random() * 100000000000) + 100000000000;
        this.state.fontSize = 21;
        this.state.maxHeight = 300;
        this.state.formatNumber = d3.format(",");

    }

    componentDidMount() {

        const component = this;

        const promise = new Promise(
            function(resolve, reject) {
                component.initPlanet();
                resolve(true);
            }
        );

        promise.then(function(){
            component.loadMap();
            return true;
        });
    }


  initPlanet () {
    const width = this.myRef.current.parentNode.clientWidth;
    const height = this.myRef.current.parentNode.clientHeight;
    return this.setState(
        {
          width: width,
          height: height < this.state.maxHeight ? height : this.state.maxHeight
        });
    }

    loadMap() {
        const component = this;
        
        // fetch("land-50m.json")
        fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json")
        
          .then((response) => {
                // yay response
                return response.json();
        })
        .then((topo) => {
            // send data to state then render map
            component.setState(
                function() {
                    const data = topojson.feature(topo, topo.objects.land);
                    return {   
                        initialized: true,
                        data: data
                    }
                },
                function() {
                    return component.renderMap();
                }
            );
        })
        .catch((error) => {
            console.log("Error: ", error);
        });

        return true;
    }

    renderMap() {
        // todo this is a pointless function
        const component = this;
        component.spin(this.state.rotation);
        return true;
    }

    spin(rotation) {
        const component = this;
        const strokeColor = component.state.strokeColor;
        const strokeColorAlpha = component.state.StrokeColorAlpha;
        let distance = component.state.distance;
        const width = component.state.width;
        const height = component.state.height;

        const canvas = d3.select(component.myRef.current)
            .attr("width", width)
            .attr("height", height);

        const context = canvas.node().getContext("2d");

        rotation[0] = rotation[0] - component.state.spinIncrement;

        const projection = d3.geoOrthographic()
            .rotate(rotation)
            .fitExtent([[0, 0], [width, height]],  {type: "Sphere"});
        
        // todo: move to state
        const path = d3.geoPath(projection, context);

        context.clearRect(0, 0, width, height);  // todo: move extent to state
        
        context.beginPath();
        path(component.state.data);
        context.fillStyle = strokeColorAlpha;
        context.fill();

        context.beginPath();
        path(component.state.graticule);
        context.strokeStyle = strokeColor;
        context.globalAlpha = 0.4;
        context.stroke();
        context.beginPath();

        path(component.state.sphere);
        context.strokeStyle = strokeColor;
        context.stroke();

        component.setState(function() {
            distance = distance - Math.floor(Math.random() * 500);
            return {distance: distance};
        });

        return setTimeout(
          function() {
            component.spin(rotation);
          },
          component.state.frameRate
        );

    }

    render() {
        return (
            <React.Fragment>
                <h6 className="instrHeader">Target: <span className="instrValue">Earth</span></h6>
                <h6 className="instrHeader">Dist: <span  className="instrValue">{this.state.formatNumber(this.state.distance)}m</span></h6>
                <canvas ref={this.myRef}></canvas>
            </React.Fragment>
        );
    }
}   

export default Planet;

