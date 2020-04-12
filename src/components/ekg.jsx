import React, { Component } from 'react'
import * as d3 from "d3";

class Ekg extends Component {

   constructor(props){
      super(props);
      this.state = {};
      this.myRef = React.createRef();
      this.state.maxHeight = 100;
      this.state.heartBeat = [.2, -.2, .2, -.8, .8, -.2, .2, -.1]; 
      this.state.bits = 52; // number of vertexes in line. make it a factor of the length of the heartbeat + spacing
      this.state.beatSpacing = [...Array(5).keys()].map(x => 0); // number of bits separating each heartbeat
      this.state.ekg = this.state.heartBeat.concat(this.state.beatSpacing);
      this.state.frameRate = 90;
      this.state.shiftIncrement = .5 // pixels shifted per frame
      this.state.strokeStyle = "#5eff89";
   }

   componentDidMount() {
    const component = this;

    const promise = new Promise(
        function(resolve, reject) {
            component.setDimensions();
            resolve(true);
        }
    );

    promise.then(function() {
        component.setUp();
        return true;
    }).then(function(){
      component.animate(component.state.data);
    });
  }
    
  setDimensions() {

      const width = this.myRef.current.parentNode.clientWidth;
      
      let height = this.myRef.current.parentNode.clientWidth;
      
      height = height < this.state.maxHeight ? height : this.state.maxHeight;

      return this.setState(
        {
          width: width,
          height: height,
          ready: true
        },
        function() {
          return true;
      });
   }

  setUp() {
    const component = this;
    const bits = component.state.bits;
    const width = component.state.width;
    const height = component.state.height;
    
    const canvas = d3.select(this.myRef.current)
      .attr("width", width)
      .attr("height", height);

    const context = canvas.node().getContext("2d");

    const xScale = d3.scaleLinear()
      .domain([0, bits]) // input
      .range([0, width]); // output

    const yScale = d3.scaleLinear()
      .domain([-1, 1]) 
      .range([0, height]);

    const line = d3.line()
        .x(function(d, i) { return xScale(i); })
        .y(function(d) { return yScale(d); })
        .curve(d3.curveMonotoneX)
        .context(context);
    
    const data = component.generateData(bits);

    return component.setState({
      xScale: xScale,
      yScale: yScale,
      line: line,
      data: data,
      animate: true,
    }, function() {
      return true;
    });

  }

  animate(data) {
    const component = this;

    if (!component.state.animate) {
      return false;
    }
    const canvas = d3.select(component.myRef.current);
    const context = canvas.node().getContext("2d");
    
    context.clearRect(0, 0, component.state.width, component.state.height);

    data = component.shiftData(data);

    context.beginPath();
    component.state.line(data);
    context.lineWidth = 1.5;
    context.strokeStyle = component.state.strokeStyle;
    context.stroke();

    setTimeout( function()
      {
        return component.animate(data);
      }, 
      component.state.frameRate
    );

  }
  
  generateData(bits) {
    const ekg = this.state.ekg;
    return [...Array(bits).keys()].map( function(x, i) {
      return ekg[i % ekg.length]; // todo, render mulitple ekgs per line
    });
  }

  shiftData(data) {
    data.push(data.shift())
    return data;
  }

  render() {
    return (
      <canvas ref={this.myRef}></canvas>
    );
  }
}

export default Ekg; 