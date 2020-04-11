import React, { Component } from 'react';
import Spinner from "./spinner"
import Radar from "./radar"; 
import Starfield from "./starfield"; 
import MeterHoriz from "./meterHoriz";
import Cassette from "./cassette";
import Planet from "./planet";
import Shuttle from "./shuttle";
import Ekg from "./ekg";
import SvgButton from "./svgButton"

class Instrument extends Component {
    constructor(props) {
        super(props);
        this.state = {showSpinner : true};
    }

    componentDidMount() {
        this.setState({showSpinner: false});
    }

    getInstrument(name) {
        const instruments = {
            Radar : Radar,
            Starfield : Starfield,
            MeterHoriz: MeterHoriz,
            Cassette: Cassette,
            Planet: Planet,
            Shuttle: Shuttle,
            Ekg: Ekg,
            SvgButton: SvgButton
        }

        return instruments[name];

    }

    render() {
        const className = "border rounded-lg " + this.props.className;

        const InstrName = this.getInstrument(this.props.name);
        
        if (!InstrName) {
            return (<div><h1>Instrument Not Found!</h1></div>);
        } else {

            return (
                <React.Fragment>
                    {this.state.showSpinner && <Spinner name={this.props.name} />}
                    <InstrName src={this.props.src}/>
                </React.Fragment>
            );
        }
    }
}   

export default Instrument;