import React, { Component } from 'react';
import { connect } from "react-redux";
import { goBack } from 'connected-react-router'

class Back extends Component {

    constructor() {
        super()
        this.goBack = this.goBack.bind(this);
    }

    goBack() {
        this.props.goBack();
    }
    render() {
        return (
            <div className="linkback" onClick={this.goBack}>
                <div className="triangle" />
            </div>
        )
    }
}

export default connect(null, { goBack })(Back);