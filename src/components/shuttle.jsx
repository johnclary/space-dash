import React, { Component } from 'react'

class Shuttle extends Component {
   // see: https://medium.com/@Elijah_Meeks/interactive-applications-with-react-d3-f76f7b3ebc71

  // todo: new blips are not regenerated fast enough. check blip distance <> radius comparison
  constructor(props){
    super(props);
    this.myRef = React.createRef();
    this.state = {};
    this.state.width = 300;
    this.state.height = 300;
  }

  componentDidMount( ) {

    const currentWidth = this.myRef.current.parentNode.clientWidth;
    const currentHeight = this.myRef.current.parentNode.clientHeight;

    this.setState(
      {
        width: currentWidth < this.state.width ? currentWidth : this.state.width,
        height: currentHeight < this.state.maxHeight ? currentHeight : this.state.height,
      },
      function() {
        return true;
      });
  }

// <img src="smiley.gif" alt="Smiley face" height="42" width="42">

  render() {
    return (
      <React.Fragment>
        <img ref={this.myRef} src="shuttle.svg" alt="shuttle" style={{transform: "rotate(180deg)"}} height={ this.state.height } width={ this.state.width } />
      </React.Fragment>
    );
  }
}

export default Shuttle; 