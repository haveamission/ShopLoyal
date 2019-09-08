import React, { Component } from 'react';
import Loading from '../main/Loading'
import { withKeycloak } from 'react-keycloak';
import { SignOut } from "../../config/strings";

/**
 * This is the logout button
 * TODO - add API call to logout API
 */
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