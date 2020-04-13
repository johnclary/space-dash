import React, { Component } from 'react'
import * as d3 from "d3";
import {AnimateContext} from './animate-context';

class Cassette extends Component {

   constructor(props){
      super(props);
      this.myRef = React.createRef();
      this.state = {initialized: false};
      this.state.animate = false; // animation triggered via context update from play button
      this.state.ticksPerReel = 8;
      this.state.increment = 2;  // degrees by which to rotate ticks each frame
      this.state.frameRate = 32;
      this.state.transitionDuration = this.state.frameRate; // must be >= frameRate
      this.state.ticks = [];
  }

  componentDidMount() {
    const component = this;
    
    const promise = new Promise(function(resolve, reject) {
      const res = component.initCassette();
      resolve(res);
    });

    promise.then(function(){
      
      component.setState({initialized: true}, function(){
        component.drawTape();
      });
    });
  }

  componentDidUpdate() {
    this.play(this.state.ticks);
  }

  initCassette () {
      const width = this.myRef.current.parentNode.clientWidth;

      this.setState(
        {
          width: width,
        },
        function() {
          return true;
      });
   }

   drawTape() {
    const component = this;
    const ticksPerReel = component.state.ticksPerReel;

    // these are hardcoded to the svg
    // todo: use static svg element with the rendered data
    // (we're modifying an svg from noun project)
    const pos = {
        r: 3,
        cx_left : 13.5,
        cy: 22.5,
        cx_right: 34,
        y_line_top: 19.5,
        y_line_bottom: 25.5,
        tick_length: 1.25,
        tick_stroke_width: .75,
        clip_rect_x: 13.5,
        clip_rect_y: 19.5,
        clip_rect_width: 34 - 13.5,
        clip_rect_height: 6,
    };

    const svg = d3.select(component.myRef.current);

      svg.append("clipPath")
        .attr("id", "clipWindow")
        .attr("class", "clip-rect")
        .attr("x", pos.clip_rect_x)
        .attr("y", pos.clip_rect_y)
        .attr("width", pos.clip_rect_width)
        .attr("height", pos.clip_rect_height)
        .attr("stroke-width", .5)
        .attr("fill", "orange");

    // left reel
    svg.append("circle")
        .attr("cx", pos.cx_left)
        .attr("cy", pos.cy)
        .attr("r", pos.r)
        .attr("stroke", "#5eff89")
        .attr("stroke-width", .5)
        .attr("fill", "none");

    // right reel
    svg.append("circle")
        .attr("cx", pos.cx_right)
        .attr("cy", pos.cy)
        .attr("r", pos.r)
        .attr("stroke", "#5eff89")
        .attr("stroke-width", .5)
        .attr("fill", "none");

    // // top line
    svg.append("line")
        .attr("x1", pos.cx_left)
        .attr("y1", pos.y_line_top)
        .attr("x2", pos.cx_right)
        .attr("y2", pos.y_line_top)
        .attr("stroke", "#5eff89")
        .attr("stroke-width", .5);

    // // bototm line
    svg.append("line")
        .attr("x1", pos.cx_left)
        .attr("y1", pos.y_line_bottom)
        .attr("x2", pos.cx_right)
        .attr("y2", pos.y_line_bottom)
        .attr("stroke", "#5eff89")
        .attr("stroke-width", .5);


    let ticksLeft = [...new Array(ticksPerReel)].map(function(tick, i){
        const rotation = (i/ticksPerReel) * 360;
        return {
            cy: pos.cy,
            x1: pos.cx_left,
            y1: pos.y_line_top,
            x2: pos.cx_left,
            y2: pos.y_line_top + pos.tick_length,
            rotation: rotation,
            transform: "rotate(" + rotation + ", " + pos.cx_left + ", " + pos.cy + ")"
        }
    });

    let ticksRight = [...new Array(ticksPerReel)].map(function(tick, i){
        const rotation = (i/ticksPerReel) * 360;
        return {
            cy: pos.cy,
            x1: pos.cx_right,
            y1: pos.y_line_top,
            x2: pos.cx_right,
            y2: pos.y_line_top + pos.tick_length,
            rotation: rotation,
            transform: "rotate(" + rotation + ", " + pos.cx_right + ", " + pos.cy + ")"
        }
    });

    const ticks = ticksLeft.concat(ticksRight);

    svg.append("g")
        .selectAll("line")
        .data(ticks)
        .enter()
        .append("line")
        .attr("class", "tape-reel-tick")
        .attr("x1", function(d) { return d.x1;})
        .attr("y1", function(d) { return d.y1;})
        .attr("x2", function(d) { return d.x2;})
        .attr("y2", function(d) { return d.y2;})
        .attr("stroke", "#5eff89")
        .attr("stroke-width", pos.tick_stroke_width)
        .attr("transform", function(d) { return d.transform;});

    svg.append("text")
        .attr("class", "tape-label")
        .attr("x", 14.5)
        .attr("y", 16.5)
        .attr("font-size", 7)
        .attr("font-weight", "bold")
        .attr("fill", "#000")
        .text("hello");

    return component.setState(
      {
        ticks: ticks
      }, function(state) {
        component.play(component.state.ticks);
    });
    
   }
   

  play(ticks) {
    const component = this;

    if (this.context.animate === false) {
      return;
    }

    const advancedTicks = component.advance(ticks, this.state.increment);
   
    d3.select(component.myRef.current)
      .selectAll(".tape-reel-tick")
      .data(ticks)
      .attr("transform", function(d) {return d.transform;}); 

    return setTimeout(
      function() {
        component.play(advancedTicks)
      },
      component.state.frameRate
    );

  }

  advance(ticks, increment) {
      // increate rotation angle of each tick
      return ticks.map(function(tick) {
          tick.rotation = tick.rotation < 360 - increment ? tick.rotation + increment : 0;
          tick.transform = "rotate(" + tick.rotation + ", " + tick.x1 + ", " + tick.cy + ")";
          return tick;
      })
  }

  render() {
    return (
      <svg ref={this.myRef} className="tape" viewBox="0 7.6 48 32.9" x="0" y="0">
        <defs>
          <clipPath id="clipWindow" clipPathUnits="userSpaceOnUse">
            <rect x="13.5" y="19.5" width="20.5" height="6" stroke-width="3" />
            </clipPath>
        </defs>
        <circle clip-path="url(#clipWindow)" className="tape" cx="13.5" cy="22.5" r="2" fill="none" stroke="#5eff89" stroke-width="10" opacity=".5"></circle>
        <circle clip-path="url(#clipWindow)" className="tape" cx="34" cy="22.5" r="4" fill="none" stroke="#5eff89" stroke-width="1.5" opacity=".5"></circle>
        <path  fill="#5eff89" d="M46.68,7.52H1.32A1.32,1.32,0,0,0,0,8.83V39.17a1.32,1.32,0,0,0,1.32,1.31H7.66l1.57-7.69a.31.31,0,0,1,.3-.24H38.47a.31.31,0,0,1,.3.24l1.57,7.69h6.34A1.32,1.32,0,0,0,48,39.17V8.83A1.32,1.32,0,0,0,46.68,7.52Zm-.92,24H2.24v-1H45.76Zm0-3.85H2.24V11.89a2,2,0,0,1,1.94-2H43.82a2,2,0,0,1,1.94,2Z"/>
        <path fill="#5eff89" d="M9.78,33.16l-1.5,7.32H39.72l-1.5-7.32Zm2.68,6.72a1.22,1.22,0,1,1,1.22-1.22A1.22,1.22,0,0,1,12.46,39.88ZM24,36.08A1.09,1.09,0,1,1,25.09,35,1.09,1.09,0,0,1,24,36.08Zm11.54,3.8a1.22,1.22,0,1,1,1.22-1.22A1.22,1.22,0,0,1,35.54,39.88Z"/>
        <rect fill="#5eff89" height="5.86" rx="0.85" ry="0.85" width="34.92" x="6.54" y="11.19"/>
        <path fill="#5eff89" d="M41.29,18.22l-1.57,4.35h1.63c.09-.27.15-.55.27-.82h.91l.27.82h1.65l-1.56-4.35Zm.57,2.51.19-.64.18.64Z"/>
      </svg>
    );
  }
}
   
Cassette.contextType = AnimateContext;


export default Cassette; 