import React, { Component } from "react";
import Card from './Card';

class Business extends React.Component {



    render() {

    return(
    <div className="business">
    <Card merchant={this.props.merchant} />
    </div>
);
    }
}

export default Business;