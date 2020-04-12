import React, { Component } from 'react'
import * as d3 from "d3";

class MeterHoriz extends Component {
   // see: https://medium.com/@Elijah_Meeks/interactive-applications-with-react-d3-f76f7b3ebc71
   constructor(props){
      super(props);
      this.myRef = React.createRef();
      this.state = {};
      console.log("props ", props);
      this.state.segmentCount = 25; // number of steps in the meter
      this.state.strokeWidth = 2;
      this.state.strokeColor = "#5eff89";
      this.state.colorScale = d3.scaleLinear().domain([0, this.state.segmentCount]).range(["#eb4034", this.state.strokeColor]);
      this.state.rX = 4; // segment corner rounding in pixels
      this.state.initialized = false;
      this.state.currentVal = 1;
      this.state.baseOpacity = .2; // opacity of "unlit" segments
      this.state.defaultHeight = 25; // in pixels. component will be set to the *smaller* height of either default height or parent element height
      this.state.updateRate = 3000; // elapsed millseconds between new val is generated
      this.state.transitionTime = 1000; // elapsed millseconds to update the entire meter. should be lower than update rate.
   }

   componentDidMount() {
    const component = this;

    const promise = new Promise(function(resolve, reject) {
      const res = component.initMeterSvg()
      resolve(res);
    })

    promise.then(function(){
      
      component.setState({initialized: true}, function(){
        component.updateIndicator(this.state.currentVal);
        
      });
    });
  }

  initMeterSvg() {
      const width = this.myRef.current.parentNode.offsetWidth;
      const segWidth = ((width - this.state.strokeWidth*2) / this.state.segmentCount) - this.state.strokeWidth;
      const height = this.myRef.current.parentNode.clientHeight;

      this.setState(
        {
          width: width,
          height: height < this.state.defaultHeight ? height : this.state.defaultHeight,
          segWidth: segWidth
        },
        function() {
          return this.initMeter();
      });
   }


  initMeter() {
    const component = this; 
    const width = component.state.width;
    const height = component.state.height;
    const segWidth = component.state.segWidth;
    const segmentCount = component.state.segmentCount;

    this.setState(
      function() {
        const segments = this.generateSegments(segWidth, height, segmentCount);
        return {segments: segments};
      },
      function() {

          return d3.select(component.myRef.current)
            .attr("width", width)
            .attr("height", height)
            .selectAll("rect")
            .data(component.state.segments)
            .enter()
            .append("rect")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("rx", component.state.rX)
            .attr("width", d => d.width)
            .attr("height", d => d.height)
            .attr("stroke", "#000000")
            .attr("stroke-width", component.state.strokeWidth)
            .attr("class", "ind-segment");

        });
    }

  generateSegmentValues(val, segmentCount) {
    const filledSegments = Math.floor(val * segmentCount);
    return [...Array(this.state.segmentCount).keys()].map( i => i < filledSegments ? 1 : 0);
  }

  updateIndicator(currentVal) {
      const component = this;
      currentVal = currentVal * ((Math.random() * .4) + .8);
      currentVal = currentVal > 1 ? 1 : currentVal;
      const segmentCount = component.state.segmentCount;

      let segments = d3.select(component.myRef.current)
        .selectAll(".ind-segment");
      
      const data = component.generateSegmentValues(currentVal, segmentCount);
      const opacity = this.state.baseOpacity;
      
      const transitionTime = this.state.transitionTime;      

      segments
          .data(data)
          .transition()
          .delay(function(d, i) { 
              // logic to set the "direction" of transition
              if (component.state.currentVal > currentVal) {
                  return (segmentCount - i)/segmentCount * transitionTime;
              } else {
                  return (i/segmentCount) * transitionTime;
              }
          })
          .attr("fill", function(d, i) {
              return d ? component.state.colorScale(i) : component.state.strokeColor;
          })
          .attr("opacity", function(d) {
              return d ? 1 : opacity;
          })
          .attr("stroke", "#000000");

        setTimeout( 
          function() {
            component.setState(
              {currentVal: currentVal},
              function() {
                component.updateIndicator(currentVal);    
              });
          }, this.state.updateRate);

  }


  generateSegments(segWidth, segHeight, segmentCount) {
      const component = this;
      return [...Array(segmentCount).keys()].map(function(i) {
          return {
              x: (segWidth * i),
              y: 0,
              width: segWidth,
              height: segHeight,
              fill: component.state.colorScale(i)
          };
      });
  }


   plusOrMinus() {
   // return 1 or -1
      return Math.random() < 0.5 ? -1 : 1;
   }
  
  blinkText(){
    if (this.state.currentVal < .3) {
      return "instrValue blinking";
    } else { 
      return "instrValue";
    }
  }

   render() {
      
         return (
          <React.Fragment>
            <h6 className="instrHeader">{this.props.label}: <span className={this.blinkText()} > {(Math.floor(this.state.currentVal  * 100) + "%")}</span></h6>
            <svg ref={this.myRef}></svg>
          </React.Fragment>
         );
      }

   // end component
   }

export default MeterHoriz; 