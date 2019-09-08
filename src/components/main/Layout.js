import React, { Component } from "react";
import Header from "./Header";
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
