import React, { Component } from 'react'
import * as d3 from "d3";

class Logger extends Component {

   constructor(props){
      super(props);
      this.state = {};
      this.myRef = React.createRef();
      this.state.animate = false;
      this.state.maxHeight = 250;
      this.state.fontSize = 19;
      this.state.fillStyle = "green";
      this.state.maxUpdateTime = 5000; // max milliseconds before new log is printed
      this.state.minUpdateTime = 750; // max milliseconds before new log is printed
      this.state.strokeGreen = "#5eff89";
      this.state.strokeRed = "#eb4034";
      this.state.strokeBlue = "#7773ff";
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
      return component.getLog();
    });
  }

  updateLogs(logs) {
    const log = this.getLog();
    logs.shift();
    logs.push(log);
    return logs
  }

  writeLetter(context, char, x, y) {
    context.fillText(char, x, y);
  }


  getLog() {
    const metrics = [
      "oxygen regenerators: ",
      "protease inhibitors: ",
      "fuel convolvers: ",
      "aft ion refractors: ",
      "double-angel + vape ",
      "double-angel + vape ",
      "double-angel + vape ",
      "double-angel + vape ",
      "double-angel + vape ",
      "forward ion refractors: ",
      "aft solar shields: ",
      "forward solar shields: ",
      "dioxide sifters: ",
      "orthagonic trim: ",
      "thermite spectrometer: ",
      "solenoid decouplers: ",
      "diazapam conflators: ",
      "thulium reconstitutor: ",
      "hyper array trajectory: ",
      "gallium thruster: ",
      "load re-balancers: ",
      "hyperclonic deflectors: ",
      "copernicium inductor: ",
      "radon inductors: ",
      "astatine fabrictors: ",
      "sim-grav rotators: ",
    ];

    const modifiers = [
      false, // will calculate a number and status
      false,
      false,
      false,
      false,
      false,
      ["unstable", "bad"],
      ["offline", "bad"],
      ["restarting", "in_progress"],
      ["stable", "ok"],
      ["stable", "ok"],
      ["stable", "ok"],
      ["stable", "ok"],
      ["recalculating", "in_progress"],
      ["normal", "ok"],
      ["normal", "ok"],
      ["normal", "ok"],
      ["normal", "ok"],
      ["repositioning", "in_progress"],
      ["acquiring", "in_progress"],
    ];

    // randomly pick a modifier
    const x = Math.floor(Math.random() *  metrics.length);
    const y = Math.floor(Math.random() *  modifiers.length);
    
    // random hex
    // const code = "[" + (Math.random()*0xF<<0).toString(16) + "x" + (Math.random()*0xF<<0).toString(16).toUpperCase() + "]";
    const code = "";
    let val = modifiers[y]

    if (!val) {
      // show exclamation point for low vals
      val = Math.floor(Math.random() *  100);
      val = val > 20 ? [val + "%", "ok"] : [val + "%", "bad"];
    }    

    return [code + " " + metrics[x], val];
  }


  animate(logs) {
    const component = this;
    const fontSize = component.state.fontSize;
    const canvas = d3.select(component.myRef.current);
    const context = canvas.node().getContext("2d");
    context.clearRect(0, 0, component.state.width, component.state.height);
    
    const delay = 15;

    logs.map(function(log, i) {
      i = i + 1;
      
      let xOffset = 0;

      if (i < component.state.rowCount - 1) {
      // print all but the last line all at once
        context.fillStyle = component.state.strokeGreen;
        log[0].split("").map( function(char) {
          context.font = fontSize + "px Jura";
          const charWidth = context.measureText(char).width; 
          component.writeLetter(context, char, xOffset, i * fontSize);
          xOffset += charWidth;
        });
        
        // special color the status part of line
        if (log[1][1] === "ok") {
          context.fillStyle = component.state.strokeGreen;
        } else if (log[1][1] === "in_progress") {
          context.fillStyle = component.state.strokeBlue;
        } else {
          context.fillStyle = component.state.strokeRed;
        }

        log[1][0].split("").map( function(char) {
          // make the status part of the line bold, too
          context.font = "bold " + fontSize + "px Jura";
          const charWidth = context.measureText(char).width; 
          component.writeLetter(context, char, xOffset, i * fontSize);
          xOffset += charWidth;
        });

      } else {

        context.fillStyle = component.state.strokeGreen;
        
        let counter = 0;

        log[0].split("").map( function(char) {
          counter++;
          context.font = fontSize + "px Jura";
          const charWidth = context.measureText(char).width; 
        
          setTimeout(
            function(){
              context.fillStyle = component.state.strokeGreen;
              component.writeLetter(context, char, xOffset, i * fontSize);
              xOffset += charWidth;
            },
            counter * delay
          );    

        });

        log[1][0].split("").map( function(char) {
          counter++;
          
          context.font = "bold " + fontSize + "px Jura";
          
          const charWidth = context.measureText(char).width; 

          setTimeout(
            function(){
              if (log[1][1] === "ok") {
                context.fillStyle = component.state.strokeGreen;
              } else if (log[1][1] === "in_progress") {
                context.fillStyle = component.state.strokeBlue;
              } else {
                context.fillStyle = component.state.strokeRed;
              }
              component.writeLetter(context, char, xOffset, i * fontSize);
              xOffset += charWidth;
            },
            counter * delay
          );      
       });
      }

    }); 


    setTimeout(function() {
        logs = component.updateLogs(logs);
        component.animate(logs);
      },
        Math.random() * (component.state.maxUpdateTime - component.state.minUpdateTime) + component.state.minUpdateTime
    );
  }

  render() {
    return (
      <canvas ref={this.myRef}></canvas>
    );
  }
}

export default Logger; 