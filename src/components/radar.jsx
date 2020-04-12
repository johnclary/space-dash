import React, { Component } from 'react'
import * as d3 from "d3";

class Radar extends Component {

   constructor(props){
      super(props);
      this.state = {};
      this.myRef = React.createRef();
      // "fader" scale. pow adds a nice gradient vs liner scale
      this.state.frameRate = 64; // keep this at or above 32;
      this.state.alphaScale = d3.scalePow().exponent(7).range([0,1]);
      this.state.radiusIncrement = 3; // radius increment  creates animation effect. increase to "speed up" animation
      this.state.bits = 90; // number of arcs which comprise the radar spinner. decreasing this val increases the fader resolution but is more memory intensive.
      this.state.blipCount = 10;
      this.state.blipRadius = 3;
      this.state.strokeColorRgbGreen = "94, 255, 137";
      this.state.strokeColorRgbRed = "235, 64, 52";
      this.state.maxLoops = 100;
      this.state.maxWidth = 300;
      this.state.blipOpacityDecrement = .03;
      this.state.lineWidth = 1;
      this.state.ringLineWidth = .5;
      this.state.graticuleLinewidth = .5;
      this.state.tracking = 0;

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
    
  initRadarCanvas() {

      let width = this.myRef.current.parentNode.clientWidth;
    
      let height = this.myRef.current.parentNode.clientHeight;

      const edge = width > height ? height : width;
      
      const radius = edge/2;

      const blipIncrement = .003 * radius; // blip spped. will remain on radar for a max of 2x blipcincrement num of frames
      
      this.setState(
        {
          width: edge,
          height: edge/1.5,
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
    // ensure new blips are near the outer edge of radar
    let x = Math.floor(Math.random() * radius - (radius * .9) + radius * .9) * this.plusOrMinus();
    let y = Math.floor(Math.random() * radius - (radius * .9) + radius * .9);
    let mX = Math.random() * this.plusOrMinus();
    let mY = Math.random() * this.state.blipIncrement * -1;
    let m = (mY/mX);
    
    let b = y - (m * x);
    let xInt = b/m * -1; 

     // logic to set slope account for movement toward origin
    // e.g we want to flag points moving toward top left quad as positive slop
    if (mY < 0 && m > 0) {
      m = m * -1;
    } else if ( mX < 0 && mY > 0) {
      m = m * -1;
    }



    return {
       x0: x, // coordinates on plane 0,0
       y0: y,
       x: x + width/2,
       y: height - y,
       opacity: 0,
       mX: mX,
       mY: mY,
       m: m,
       b: b,
       xInt: xInt,
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
      const strokeColorRgbGreen = component.state.strokeColorRgbGreen;
      const strokeColorRgbRed= component.state.strokeColorRgbRed;

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

      for (let i = 0; i <= currentRadius; i++) {

        let alpha = i/currentRadius; 

        const opacity = alphaScale(alpha);            
         
        if (opacity < .05) { 
           // skip the drawing for invisibile slices
           continue;
        }

         context.lineWidth = component.state.lineWidth;
         context.strokeStyle = "rgba(" + strokeColorRgbGreen + ", " + opacity + ")";
         context.beginPath();
         context.arc(width/2, height, (i/currentRadius) * currentRadius, Math.PI, 0);
         context.stroke();

      }       

      // move the blips and re-calculate angles
      blips = blips.map(function(blip) {
         blip = component.moveBlip(blip, width, height);
         return blip;
      })

      let tracking = 0;
      for (let i = 0; i < blips.length; i++) {
         // blip when the angle of the radar is within the threshold
         // of the point location
         var blip = blips[i];

         // regenerate blip once it moves off radar
         if (blip.distance > radius || blip.y0 < 0) {
             blips[i] = component.radarBlip(component, radius, width, height);
         }

         if (Math.abs(Math.floor(currentRadius-blip.distance)) < 5)  {
             // flash point w/ opacity when intersects with radar angle
             blip.opacity = 1;
         } else {
             // increment opacity down each frame
             blip.opacity = blip.opacity - component.state.blipOpacityDecrement; // todo use constanst
         }

         
         let blipRadius;
         // draw the blip. highlighting tracking in red
        if (blip.b > -35 && blip.b < 35 && blip.xInt < 35 && blip.xInt > -35 && blip.m < 0) {
          context.fillStyle = "rgba(" + strokeColorRgbRed + ", " + blip.opacity + ")";
          blipRadius = component.state.blipRadius * 1.25;
          tracking++;
        } else {
          context.fillStyle = "rgba(" + strokeColorRgbGreen + ", " + blip.opacity + ")";
          blipRadius = component.state.blipRadius;
        }

         context.beginPath();
         context.arc(blip.x, blip.y, blipRadius, 0, 2*Math.PI);
         context.fill();
      }

      component.setState({tracking: tracking});
    // draw black inner mask 
     // context.beginPath();
     // context.arc(width/2, height, radius/4, 0, 2*Math.PI);
     // context.lineTo(width/2, height);
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

   moveBlip(blip, width, height) {
      // calculate coordinates in relation to center of radar
      blip.x0 = blip.x0 + blip.mX;
      blip.y0 = blip.y0 + blip.mY;
      blip.distance = Math.sqrt(Math.pow(blip.x0, 2) + Math.pow(blip.y0, 2));  

      // calculate new coordinates of blip
      blip.x = blip.x0 + width/2;
      blip.y = height - blip.y0;
      
      return blip;
  }

  blinkText(){
    if (this.state.tracking > 0) {
      return "instrValue blinking";
    } else { 
      return "instrValue";
    }
  }

  render() {
    return (
      <React.Fragment>
        <h6 className="instrHeader">Tracking: <span className={this.blinkText()} > {this.state.tracking}</span></h6>
        <canvas ref={this.myRef}></canvas>
      </React.Fragment>
    );
  }
}

export default Radar; 