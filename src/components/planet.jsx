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
        this.state.initDistance = Math.floor(Math.random() * 100000000000) + 100000000000;
        this.state.fontSize = 21;
        this.state.maxHeight = 300;

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
        component.spin(this.state.rotation, this.state.initDistance);
        return true;
    }

    spin(rotation, distance) {
        const component = this;
        const strokeColor = component.state.strokeColor;
        const strokeColorAlpha = component.state.StrokeColorAlpha;

        const width = component.state.width;
        const height = component.state.height;

        const canvas = d3.select(component.myRef.current)
            .attr("width", width)
            .attr("height", height);

        const context = canvas.node().getContext("2d");

        rotation[0] = rotation[0] - component.state.spinIncrement;

        const projection = d3.geoOrthographic()
            .rotate(rotation)
            .fitExtent([[5, 50], [width - 5, height - 5]],  {type: "Sphere"});
        
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
        component.renderLabels(context, distance);

        return setTimeout(
          function() {
            component.spin(rotation, distance - 1);
          },
          component.state.frameRate
        );

    }
    
    renderLabels(context, distance) {
        context.font = this.state.fontSize + "px Jura";
        context.fillStyle = this.state.strokeColor;
        context.fillText("Target: ", 5, this.state.fontSize + 5);
        context.fillStyle = this.state.StrokeColor2;
        context.fillText("Earth ", this.state.fontSize * 4, this.state.fontSize + 5);

        const dist = d3.format(",")(distance);
        context.fillStyle = this.state.StrokeColor;
        context.fillText("Dist: ", 5, (this.state.fontSize * 2) + 5);
        context.fillStyle = this.state.StrokeColor2;
        context.fillText(dist + "m", this.state.fontSize * 4, (this.state.fontSize * 2) + 5);

    }

    render() {
        return (
            <canvas ref={this.myRef}></canvas>
        );
    }
}   

export default Planet;

