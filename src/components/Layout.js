import Header from "./Header";
import React, { Component } from "react";
import BackgroundProcess from "./BackgroundProcess";

class Layout extends Component {
  render() {
    return (
      <div>
        {/*<BackgroundProcess />*/}
        <Header />
        {this.props.children}
      </div>
    );
  }
}

export default Layout;
