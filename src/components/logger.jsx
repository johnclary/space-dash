import React, { Component } from 'react'
import * as d3 from "d3";

class Logger extends Component {

   constructor(props){
      super(props);
      this.state = {};
      this.myRef = React.createRef();
      this.state.animate = false;
      this.state.maxHeight = 300;
      this.state.fontSize = 16;
      this.state.fillStyle = "green";
      this.state.maxUpdateTime = 5000; // max milliseconds before new log is printed
      this.state.minUpdateTime = 750; // max milliseconds before new log is printed
      this.state.strokeGreen = "#5eff89";
      this.state.strokeRed = "#eb4034";
   }

   componentDidMount() {
    const component = this;

    const promise = new Promise(
        function(resolve, reject) {
            component.setUp();
            resolve(true);
        }
    );

    promise.then(function() {
        component.animate(component.state.data);
        return true;
    });
  }
    
  setUp() {

      const width = this.myRef.current.parentNode.clientWidth;
      
      let height = this.myRef.current.parentNode.clientWidth;
      
      height = height < this.state.maxHeight ? height : this.state.maxHeight;

      const canvas = d3.select(this.myRef.current)
        .attr("width", width)
        .attr("height", height);

      const rowCount = Math.floor(height/this.state.fontSize);

      const data = this.generateLogs(rowCount);

      return this.setState(
        {
          width: width,
          height: height,
          data: data,
          rowCount: height/this.state.fontSize,
          ready: true
        },
        function() {
          return true;
      });
   }

  generateLogs(rowCount) {
    const component = this;
    return [...Array(rowCount).keys()].map(function(){
      const str = component.getLog();

      return str.split("");
    });
  }

  updateLogs(logs) {
    const str = this.getLog();
    logs.shift();
    logs.push(str.split(""));
    return logs
  }

  writeLetter(context, char, x, y) {
    context.fillText(char, x, y);
  }


  getLog() {
    const metrics = [
      "Oxygen regenerators",
      "Rarefied Protease Inhibitors",
      "Fuel convolvers",
      "Aft Ion refractors",
      "Forward Ion refractors",
      "Aft Solar Shields",
      "Forward Solar Shields",
      "Dioxide Sifters",
      "Orthagonic trim",
      "Thermite Spectrometer",
      "Solenoid Decouplers",
      "Diazapam Conflators",
      "Thulium Reconstitutors",
      "Hyper Array Trajectory",
      "Gallium Thrusters",
      "Load Re-balancers",
      "Hyperclonic deflectors",
      "Copernicium Inductors",
      "Radon Inductors",
      "Astatine Fabrictors",
      "Sim-grav rotators",
    ];

    const modifiers = [
      false, // will calculate a number val
      false,
      false,
      false,
      false,
      false,
      ": Unstable (!)",
      ": Offline (!)",
      ": Restarting...",
      ": Stable",
      ": Recalculating...",
      ": Normal",
      ": Normal",
      ": Repositioning...",
      ": Acquiring...",
    ];

    // randomly pick a modifier
    const x = Math.floor(Math.random() *  metrics.length);
    const y = Math.floor(Math.random() *  modifiers.length);
    
    // random hex
    const code = "[" + (Math.random()*0xF<<0).toString(16) + "x" + (Math.random()*0xF<<0).toString(16) + "]";
    let val = modifiers[y]

    if (!val) {
      // show exclamation point for low vals
      val = Math.floor(Math.random() *  100);
      val = val > 20 ? ": " + val + "%" : ": " + val + "% (!)";
    }    

    return code + " " + metrics[x] + val;
  }


  animate(logs) {
    const component = this;
    const fontSize = component.state.fontSize;
    const canvas = d3.select(component.myRef.current);
    const context = canvas.node().getContext("2d");
    context.clearRect(0, 0, component.state.width, component.state.height);
    context.font = fontSize + "px Jura";
    context.fillStyle = component.state.strokeGreen;
    
    const delay = 15;

    logs.map(function(entry, i) {
      i = i + 1;
      let xOffset = 0;
      entry.map(function(char, z){

       const charWidth = context.measureText(char).width; 
 
       if (i < component.state.rowCount -  1) {
          component.writeLetter(context, char, xOffset, i * fontSize);
          xOffset += charWidth;
       } else {
          setTimeout(function(){
            context.fillStyle = component.state.strokeRed;
            component.writeLetter(context, char, xOffset, i * fontSize);
            xOffset += charWidth;
         }, z * delay)       
       }
       
      })
    });

    setTimeout(function(){
      logs = component.updateLogs(logs);
      component.animate(logs);
    }, Math.random() * (component.state.maxUpdateTime - component.state.minUpdateTime) + component.state.minUpdateTime);
  }
  
  render() {
    return (
      <canvas ref={this.myRef}></canvas>
    );
  }
}

export default Logger; 