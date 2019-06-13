import React, { Component } from 'react';
import Iframe from 'react-iframe'
import Loading from './Loading'
import Back from './Back'

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

      componentDidMount() {
      }

    render() {

        return (
            <div>
                <Back />
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
  />
            </div>
          );
}
}

export default WebPage;