import React, { Component } from 'react';
import API from './API'
import axios from 'axios';
import { connect } from "react-redux";
import Loading from './Loading'
import { withKeycloak } from 'react-keycloak';

class LogoutSettings extends React.Component {

    logout =() => {
      console.log("logout");
      console.log(this);
      let config = {
        headers: {
          Authorization: "Bearer " + this.props.keycloak.idToken,
        }
      }
      
    var body = {
    "refreshToken": this.props.keycloak.idToken,
    "clientId": "wantify-app",
    "accessToken": this.props.keycloak.idToken,
    }
    
    axios.post(API.prodBaseUrlString + API.userLogout, body, config).then(
    response => console.log(response)
    ).catch(function(error) {
    console.log(error);
    })
    }
  
    render() {
      console.log("props val");
      console.log(this.props);
if(!this.props) {
  return <Loading />
}

      return(
      <ul className="logout-settings">
  <li className="list-bottom" onClick={this.logout}>Log Out</li>
      </ul>
    )
  }
  }
  
export default withKeycloak(LogoutSettings);