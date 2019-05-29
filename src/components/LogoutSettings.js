import React, { Component } from 'react';
import API from './API'
import axios from 'axios';
import { connect } from "react-redux";
import Loading from './Loading'

class LogoutSettings extends React.Component {

    logout =() => {
      console.log("logout");
      console.log(this);
      let config = {
        headers: {
          Authorization: "Bearer " + this.props.oidc.user.access_token,
        }
      }
      
    var body = {
    "refreshToken": this.props.oidc.user.access_token,
    "clientId": "wantify-app",
    "accessToken": this.props.oidc.user.access_token,
    }
    
    axios.post(API.localBaseUrlString + API.userLogout, body, config).then(
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

  const mapStateToProps = (state) => {
    return {
      oidc: state.oidc
    };
  };
  
export default connect(mapStateToProps)(LogoutSettings);