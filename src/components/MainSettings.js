import React, { Component } from 'react';
import API from './API'
import axios from 'axios';
import { connect } from "react-redux";
import Loading from './Loading'
import Toggle from 'react-toggle'
import { Link } from 'react-router-dom'
import '../styles/toggle.css';
import { withKeycloak } from 'react-keycloak';
import axiosRetry from 'axios-retry';

class MainSettings extends React.Component {

    state = {
        notificationEnabled: this.props.data.notificationEnabled,
        notificationEmailEnabled: this.props.data.notificationEmailEnabled,
      };

    handleNotification = (event) => {
        event.persist();
  console.log(event.target.checked);
  this.setState({'notificationEnabled': event.target.checked})
  let config = {
    headers: {
      Authorization: "Bearer " + this.props.keycloak.idToken,
    }
  }

  console.log("Notif CHECKED - true or false?");
  console.log(event.target.checked);
  
  var body = {
    "notificationEnabled": event.target.checked
  }
  
  axiosRetry(axios, { retries: 10 });

  axios.post(API.prodBaseUrlString + API.settings, body, config).then(
    response => console.log(response.data)
    ).then(data => this.setState({'notificationEnabled': event.target.checked})).catch(function(error) {
    console.log(error);
    })
    }
  
    handleNotificationEmail = (event) => {
        event.persist();
  console.log(event.target.checked);
  
  let config = {
    headers: {
      Authorization: "Bearer " + this.props.keycloak.idToken,
    }
  }
  
  var body = {
    "notificationEmailEnabled": event.target.checked
  }
  
  axios.post(API.prodBaseUrlString + API.settings, body, config).then(
    response => console.log(response.data)
    ).then(data => this.setState({'notificationEmailEnabled': event.target.checked})).catch(function(error) {
    console.log(error);
    })
    }
  
    render() {
      return(
      <ul className="main-settings">
      <Link to="/favmerchants/">
      <div className="fav-merchants">
      <span className="merchant-number">{this.props.data.profile.merchantCount}
      <div class="right-triangle"/>
      </span>
      <div className="fav-merchants-text">Favorite Merchants</div>
      </div>
      </Link>
  <Link to="/support/"><li>Support</li></Link>
  <li>Waitlist</li>
  <li><label>
    <Toggle
      defaultChecked={this.state.notificationEnabled}
      onChange={this.handleNotification} />
    <span className="toggle-text">Notifications</span>
  </label></li>
  <li><label>
    <Toggle
      defaultChecked={this.state.notificationEmailEnabled}
      onChange={this.handleNotificationEmail} />
    <span className="toggle-text">Email Notifications</span>
  </label></li>
  
      </ul>
    )
  }
  }

  export default withKeycloak(MainSettings);