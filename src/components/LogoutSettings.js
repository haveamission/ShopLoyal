import React, { Component } from 'react';
import Loading from './Loading'
import { withKeycloak } from 'react-keycloak';
import { SignOut } from "../config/strings";

class LogoutSettings extends Component {

  render() {
    if (!this.props) {
      return <Loading />
    }

    return (
      <div className="logout-settings">
        <div className="logout-center" onClick={() => this.props.keycloak.logout()}>{SignOut}</div>
      </div>
    )
  }
}

export default withKeycloak(LogoutSettings);