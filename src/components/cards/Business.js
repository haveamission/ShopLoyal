import React, { Component } from "react";
import Card from "./Card";

class Business extends Component {
  constructor(props) {
    super(props);
    this.props.handleBusinessPop.bind(this);
  }
  componentDidMount() {
    console.log("business props");
    console.log(this.props);
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
