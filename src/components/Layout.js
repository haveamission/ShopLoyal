import Header from "./Header";
import React, { Component } from "react";
import LoginPage from "./LoginPage";
import Dummy from "./Dummy";
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
