import React, { Component } from 'react'
import * as d3 from "d3";

class Radar extends Component {
   // see: https://medium.com/@Elijah_Meeks/interactive-applications-with-react-d3-f76f7b3ebc71
   
   // todo: set origin to height
   constructor(props){
      super(props);
      this.state = {};
      this.myRef = React.createRef();
      // "fader" scale. pow adds a nice gradient vs liner scale
      this.state.frameRate = 32; // keep this at or above 32;
      this.state.alphaScale = d3.scalePow().exponent(7).range([0,1]);
      this.state.radiusIncrement = 3; // radius increment  creates animation effect. increase to "speed up" animation
      this.state.bits = 90; // number of arcs which comprise the radar spinner. decreasing this val increases the fader resolution but is more memory intensive.
      this.state.blipCount = 10;
      this.state.strokeColorRGB = "94, 255, 137";
      this.state.maxLoops = 100;
      this.state.maxWidth = 200;
      this.state.blipOpacityDecrement = .01;
      this.state.lineWidth = 1;
      this.state.ringLineWidth = .5;
      this.state.graticuleLinewidth = .5;

   }

   componentDidMount() {

      this.setState(() => {
        const blips = this.initRadarCanvas();
        return {whatever: blips};
      },
      // callback1
      function() {
             return this.setState({rotating: true}, () => this.rotate(this.state.blips, 0, 0));
      });
  }


   componentDidUpdate() {

   }
    
  initRadarCanvas() {

      let width = this.myRef.current.parentNode.clientWidth;
    
      let height = this.myRef.current.parentNode.clientHeight;

      const edge = width > height ? height : width;
      
      const radius = edge/2;

      const blipIncrement = .002 * radius; // blip spped. will remain on radar for a max of 2x blipcincrement num of frames
      
      this.setState(
        {
          width: edge,
          height: edge/2,
          radius: radius,
          blipIncrement: blipIncrement
        },
        function() {
          return this.initRadar();
      });
   }

   initRadar() {
      let component = this; 
      const canvas = d3.select(this.myRef.current);
      const context = canvas.node().getContext("2d");

      context.lineWidth = 1;
      context.strokeStyle = "#5eff89"; // TODO: move canvas styles somewhere else

      const blips = component.generateBlipArray(
         component.state.blipCount,
         component.state.radius,
         component.state.width,
         component.state.height
      );
       
      return this.setState( 
        {blips: blips},
        function () {
          return true;
      });

   }

   generateBlipArray(blipCount, radius, width, height) {
      let blipArray = [...Array(blipCount).keys()];
      const node = this;
      
      return blipArray.map(function(i) {
        return node.radarBlip(node, radius, width, height);    
      });
   }

   radarBlip(node, radius, width, height) {
       let trajectory = Math.floor(Math.random() * 360) * this.plusOrMinus();
       let x = Math.floor(Math.random() * radius) * this.plusOrMinus(); // arb subtraction to keep point inside radius for sum reason
       let y = Math.floor(Math.random() * radius);
       let theta = (180/Math.PI) * Math.atan2(y, x);
       return {
           x0: x, // coordinates on plane 0,0
           y0: y,
           x: x + width/2,
           y: height - y,
           angle: theta > 0 ? 360 - theta : theta * -1,
           trajectory: trajectory,
           opacity: 0
       };

   }

   plusOrMinus() {
   // return 1 or -1
      return Math.random() < 0.5 ? -1 : 1;
   }

   rotate(blips, currentRadius) {
      const component = this;
      const width = this.state.width;
      const height = this.state.height;
      const canvas = d3.select(this.myRef.current)
        .attr("width", width)
        .attr("height", height);
      const context = canvas.node().getContext("2d")
      const radius = component.state.radius;
      const bits = component.state.bits;
      const alphaScale = component.state.alphaScale;
      const strokeColorRGB = component.state.strokeColorRGB;

      context.clearRect(0, 0, width, height);

      context.strokeStyle = "#5eff89"; // TODO: move canvas styles somewhere else
      context.lineWidth = component.state.ringLineWidth;

      // draw ring
      const numRings = 4;
      context.strokeStyle = "#5eff89";
      for (var i = 0; i <= numRings; i++) {

        context.beginPath();
        context.arc(width/2, height, radius * (i/numRings), Math.PI, 0);
        context.stroke();
        context.closePath();
      }

      // draw graticule radials
      const segments = 9;
      for (var i = 0; i < segments; i++) {

        const originX = width/2;
        const originY = height;
        const angle = (i/segments) * -1 * Math.PI;
        const pt = pointOnCircle(originX, originY, angle, radius);
        context.strokeStyle = "#5eff89";
        context.lineWidth = component.state.graticuleLinewidth;
        context.lineCap = "round";
        context.beginPath();
        context.moveTo(originX, originY);
        context.lineTo(pt.x, pt.y);
        context.stroke();
        context.closePath();
        
      }   

      function pointOnCircle(cX, cY, angle, radius) {
        const x = cX + radius * Math.cos(angle);
        const y = cY + radius * Math.sin(angle);
        return {x:x,y:y};
      }

      // draw expanding radar circle
      context.fillStyle = "#fff"
      context.font = '18px Jura';
      context.fillText('rC: ' + currentRadius, 10, 20);
      context.fillText('r: ' + radius, 10, 40);

      for (let i = 0; i <= currentRadius; i++) {

        let alpha = i/currentRadius; 

        const opacity = alphaScale(alpha);            
         
        if (opacity < .05) { 
           // skip the drawing for invisibile slices
           continue;
        }

         context.lineWidth = component.state.lineWidth;
         context.strokeStyle = "rgba(" + strokeColorRGB + ", " + opacity + ")";
         context.beginPath();
         context.arc(width/2, height, (i/currentRadius) * currentRadius, Math.PI, 0);
         context.stroke();

      }       

      // move the blips and re-calculate angles
      blips = blips.map(function(blip) {
         blip = component.moveBlip(blip, width, height);
         // console.log(Math.floor(blip.distance));
         // console.log(Math.floor(currentRadius));
         return blip;
      })

      for (let i = 0; i < blips.length; i++) {
         // blip when the angle of the radar is within the threshold
         // of the point location
         var blip = blips[i];

         if (Math.abs(Math.floor(currentRadius-blip.distance)) < 5)  {
             // flash point w/ opacity when intersects with radar angle
             blip.opacity = 1;
         } else {
             // increment opacity down each frame
             blip.opacity = blip.opacity - component.state.blipOpacityDecrement; // todo use constanst
         }

         // draw the blip
         context.fillStyle = "rgba(" + strokeColorRGB + ", " + blip.opacity + ")";
         context.beginPath();
         context.arc(blip.x, blip.y, 3, 0, 2*Math.PI);
         context.fill();

         // remove blip once it moves off radar
         if (blip.distance > radius || blip.y0 < 0) {
             blips[i] = component.radarBlip(component, radius, width, height);
         }
      }


    // draw black inner mask 
     // context.beginPath();
     // context.arc(width/2, height/2, radius/2, 0, 2*Math.PI);
     // context.lineTo(width/2, height/2);
     // context.closePath();
     // context.fillStyle = "#000000"
     // context.fill();


      if (!component.state.rotating) {

         return component.setState({doRotate: false});

      } else {
        // radius moves slower as it approaches edge
        currentRadius = currentRadius < radius ? currentRadius += component.state.radiusIncrement : 0;

         setTimeout( function() {
            return component.rotate(blips, currentRadius);
         }, component.state.frameRate);
      }
   }

   moveBlip(blip, width, height) { // todo calculate increment dynamically and use state
      // calculate new coordinates of blip
      blip.x = blip.x + this.state.blipIncrement * Math.cos(blip.trajectory);
      blip.y = blip.y + this.state.blipIncrement * Math.sin(blip.trajectory);
      // calculate coordinates and angle in relation to center of radar
      blip.x0 = blip.x - width/2;
      blip.y0 = height - blip.y;
      blip.distance = Math.sqrt(Math.pow(blip.x0, 2) + Math.pow(blip.y0, 2));  
      return blip;
  }

  render() {
    return (
      <canvas ref={this.myRef}></canvas>
    );
  }
}

export default Radar; 