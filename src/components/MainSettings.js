import React, { Component } from 'react';
import API from './API'
import axios from 'axios';
import { connect } from "react-redux";
import Loading from './Loading'
import Support from './Support'
import Toggle from 'react-toggle'
import { Link } from 'react-router-dom'
import '../styles/toggle.css';
import { withKeycloak } from 'react-keycloak';
import axiosRetry from 'axios-retry';
import Sidebar from "react-sidebar";

class MainSettings extends React.Component {

    state = {
        notificationEnabled: this.props.data.notificationEnabled,
        notificationEmailEnabled: this.props.data.notificationEmailEnabled,
        open: false,
      };

    handleNotification = (event) => {
        event.persist();
  //console.log(event.target.checked);
  this.setState({'notificationEnabled': event.target.checked})

  var body = {
    "notificationEnabled": event.target.checked
  }

  var api = new API(this.props.keycloak);
  api.setRetry(3);
  api.post("settings", {"body": body}).then(
    response => console.log(response.data))
    .then(data => this.setState({'notificationEnabled': event.target.checked}))
    .catch(function(error) {
      //console.log(error);
      })
    }
  
    handleNotificationEmail = (event) => {
        event.persist();

  
  var body = {
    "notificationEmailEnabled": event.target.checked
  }
  var api = new API(this.props.keycloak);
  api.post("settings", {"body": body}).then(
    response => console.log(response.data))
    .then(data => this.setState({'notificationEmailEnabled': event.target.checked}))
    .catch(function(error) {
      //console.log(error);
      })
    }

    constructor(props) {
      super(props);
      this.onSetOpen = this.onSetOpen.bind(this);
    }
    onSetOpen(open) {
      console.log("clicked");
      this.setState({ open });
    }
  
    render() {
      return(
      <ul className="main-settings">
            <Sidebar
        sidebar={<Support onSetOpen={this.onSetOpen} />}
        open={this.state.open}
        onSetOpen={this.onSetOpen}
        rootClassName={"sb-root"}
        sidebarClassName={"sb-sb"}
        contentClassName={"sb-content"}
        overlayClassName={"sb-overlay"}
        styles={{
          content: {boxShadow: "none"},
          sidebar: {boxShadow: "none", width: "50%"},
          dragHandle: {boxShadow: "none"}
,         root: {boxShadow: "none"},
          overlay: {width: "50%", borderRadius: "0px 0px 0px 30px", left: "auto", backgroundColor: "rgba(221, 221, 221, .9)"}
         }}
        pullRight={true}
        defaultSidebarWidth={100}
      >
      <span/>
      </Sidebar>
      
      <Link to="/favmerchants/">
      <div className="fav-merchants">
      <span className="merchant-number">{this.props.data.profile.merchantCount}
      </span>
      <div className="fav-merchants-text">Favorite Merchants<div className="right-arrow"/></div>
      </div>
      </Link>

  {/*<li>Waitlist</li>*/}
  <li><label>
    <span className="toggle-text">Notifications</span>
    <Toggle
            icons={{
              checked: null,
              unchecked: null,
            }}
    className='toggle-shoployal'
      defaultChecked={this.state.notificationEnabled}
      onChange={this.handleNotification} />
  </label></li>
  <li><label>
    <span className="toggle-text">Email Notifications</span>
    <Toggle
        icons={{
          checked: null,
          unchecked: null,
        }}
    className='toggle-shoployal'
      defaultChecked={this.state.notificationEmailEnabled}
      onChange={this.handleNotificationEmail} />
  </label></li>
  
  <li className="support-button"><span onClick={() => this.onSetOpen(true)} className="setting-link">Support</span></li>
  <Link to="/tutorial/"><li><span className="setting-link">Tutorial</span></li></Link>
      </ul>
    )
  }
  }

  export default withKeycloak(MainSettings);