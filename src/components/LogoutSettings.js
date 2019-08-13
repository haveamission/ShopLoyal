import React, { Component } from 'react';
import API from './API'
import axios from 'axios';
import { connect } from "react-redux";
import Loading from './Loading'
import { withKeycloak } from 'react-keycloak';

class LogoutSettings extends React.Component {

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