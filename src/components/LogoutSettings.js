import React, { Component } from 'react';
import API from './API'
import axios from 'axios';
import { connect } from "react-redux";
import Loading from './Loading'
import { withKeycloak } from 'react-keycloak';

class LogoutSettings extends React.Component {
  
    render() {
if(!this.props) {
  return <Loading />
}

      return(
      <ul className="logout-settings">
  <li className="list-bottom" onClick={() => this.props.keycloak.logout()}>Log Out</li>
      </ul>
    )
  }
  }
  
export default withKeycloak(LogoutSettings);