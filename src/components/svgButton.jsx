import React, { Component } from 'react'
import {AnimateContext} from './animate-context';


function SvgButton(props) {
  
    return (
      <React.Fragment>
          <AnimateContext.Consumer>
            {({animate, toggleAnimate}) => (
              <img
                src={props.src}
                onClick={ toggleAnimate }
              />
            )}
          </AnimateContext.Consumer>
      </React.Fragment>
    );
}

export default SvgButton;