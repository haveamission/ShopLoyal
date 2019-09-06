import React, { Component } from 'react';
import Loading from './Loading'
import { withKeycloak } from 'react-keycloak';

class LogoutSettings extends Component {

  render() {
    if (!this.props) {
      return <Loading />
    }

    return (
      <div className="logout-settings">
        <div className="logout-center" onClick={() => this.props.keycloak.logout()}>Sign Out</div>
      </div>
    )
  }
}

export default withKeycloak(LogoutSettings);