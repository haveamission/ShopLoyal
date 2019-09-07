import React, { Component } from 'react';
import Loading from './Loading'

class WebPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }
  hideSpinner = () => {
    this.setState({
      isLoading: false
    });
  };

  render() {

    return (
      <div>
        {this.state.isLoading ? (
          <Loading />
        ) : null}
        <iframe
          src={this.props.url}
          width="100%"
          height="700"
          onLoad={this.hideSpinner}
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          title={this.props.title}
        />
      </div>
    );
  }
}

export default WebPage;