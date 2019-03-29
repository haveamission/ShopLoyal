import React, { Component } from 'react';
import { connect } from 'react-redux'

class App extends Component {
  componentDidMount() {
      this.props.fetchMessage('Hi!')
  }

  render() {
    return (
      <div>
        <h2>Welcome to React</h2>
        <p>
          {this.props.message}
        </p>
      </div>
    );
  }
}

export default connect(
  state => ({ message: "hi" }),
)(App);