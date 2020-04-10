import React, { Component } from 'react';
import Instrument from "./instrument";
import {AnimateContext} from './animate-context';

class App extends Component {

    handleInstrument(instrument) {
        return (
            <AnimateContext.Provider>
                <Instrument name={ instrument.name } className={instrument.className} src={instrument.src} />
            </AnimateContext.Provider>
        )
    };


    unpackComponents(components) {
        const container = this;
    
        if (components instanceof Array) {
            // expecting an array of components or arrays of arrays of components
            return components.map(

                function(component) {
                    if ("components" in component) {

                        return (
                            <React.Fragment>
                                <div className={component.className} >
                                    { container.unpackComponents(component.components) }
                                </div>  
                            </React.Fragment>
                        );
                    } else {
                        return (
                            <div className={component.className}>
                                { container.handleInstrument(component) }
                            </div>
                        )
                    };
                }
            );
        } else {
            // don't be confused. here "components" is just a single object
            if ("components" in components) {
                // this is a grouping element, so handle it as such
                return (
                    <React.Fragment>
                        <div className={components.className} >
                            { container.unpackComponents(components.components) }
                        </div>  
                    </React.Fragment>
                );
            } else {
                // this must be an Instrument (React class)
                return (
                    <div className={components.className}>
                        { container.handleInstrument(components) }
                    </div>
                )
            };
        };
            
    }

    render() {
        return (
            <React.Fragment>
                { this.unpackComponents(this.props.components) }
            </React.Fragment>
        );
    }
}

export default App;