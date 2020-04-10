import React, { Component } from 'react'
import {AnimateContext} from './animate-context';

class SvgLoader extends Component {
   // see: https://medium.com/@Elijah_Meeks/interactive-applications-with-react-d3-f76f7b3ebc71

  // todo: new blips are not regenerated fast enough. check blip distance <> radius comparison
  constructor(props){
    super(props);
    this.myRef = React.createRef();
    this.state = {};
    this.state.width = 300;
    this.state.height = 300;
    this.state.playing = false;
    this.handleClick = this.handleClick.bind(this);
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

  handleClick(e) {
    // set the animation state on click, passing to parent component (instrument)
    // will be passed down to other instruments i hope
    // nope we need a global context.
    // this.setState(function(){
    //   const playing = this.state.playing ? false : true;
    //   return {playing: playing}
    // }),
    // function(state) {
    //   this.props.setAnimationState(this.state.playing);
    // });

  }

  render() {

    let animate = this.context;

    return (
      <React.Fragment>
        <img onClick={this.handleClick} ref={this.myRef} src={this.props.src} alt={this.props.name} height={ this.state.height } width={ this.state.width } />
      </React.Fragment>
    );
  }
}

SvgLoader.contextType = AnimateContext;

export default SvgLoader; 