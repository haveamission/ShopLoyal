import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class Dummy extends Component {
    render() {
        console.log(localStorage);
        return (
            <div>
                <div>Dummy Component</div>
                <div></div>
            </div>
        )
    }
}
export default Dummy