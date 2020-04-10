import React, { Component } from 'react';

class Spinner extends Component {

    render() {

        return (
            <div className="text-center" id="loader">
                <h1>Loading {this.props.name}</h1>
                <div className="d-flex justify-content-center">
                    <div className="spinner-grow" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }
}   

export default Spinner;