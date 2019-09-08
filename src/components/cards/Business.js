import React, { Component } from "react";
import Card from "./Card";

/**
* Wrapper with map card specific styling
**/
class Business extends Component {
  constructor(props) {
    super(props);
    this.props.handleBusinessPop.bind(this);
  }

  render() {
    return (
      <div
        className={"business " + this.props.className}
        onAnimationEnd={this.props.handleBusinessPop}
      >
        <Card merchant={this.props.merchant} />
      </div>
    );
  }
}

export default Business;
