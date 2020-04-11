import React, { Component } from 'react'
import {AnimateContext} from './animate-context';


class SvgButton extends Component {
   // see: https://medium.com/@Elijah_Meeks/interactive-applications-with-react-d3-f76f7b3ebc71

  // todo: new blips are not regenerated fast enough. check blip distance <> radius comparison
  constructor(props){
    super(props);
    this.myRef = React.createRef();
    this.state = {};
    this.state.width = 300;
    this.state.height = 300;
    this.state.playing = false;
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

  render() {

    return (
      <React.Fragment>
          <AnimateContext.Consumer>
            {({animate, toggleAnimate}) => (

              <img
                ref={this.myRef}
                src={this.props.src}
                height={ this.state.height }
                width={ this.state.width }
                onClick={ toggleAnimate }
              />
  
            )}
          </AnimateContext.Consumer>
      </React.Fragment>
    );
  }
}

export default SvgButton;