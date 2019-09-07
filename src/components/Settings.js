import React, { Component } from "react";
import API from "./API";
import LogoutSettings from "./LogoutSettings";
import MainSettings from "./MainSettings";
import { withKeycloak } from "react-keycloak";

class Settings extends Component {
  state = {
    profile: {},
    notifications: {}
  };

  configuration(data) {
    this.setState({ profile: data });
  }

  getSettings() {
    let api = new API(this.props.keycloak);
    api
      .get("settings")
      .then(response => this.loadSettings(response.data))
      .catch(function (error) {
        console.log(error);
      });
  }

  loadSettings(data) {
    this.setState({ notifications: data });
  }

  componentDidMount() {
    if (this.props.keycloak.authenticated) {
      let api = new API(this.props.keycloak);
      api
        .get("userProfileAPI")
        .then(response => this.configuration(response.data))
        .catch(function (error) {
          console.log(error);
        });

      this.getSettings();
    }
  }

  render() {
    if (
      Object.keys(this.state.profile).length === 0 ||
      Object.keys(this.state.notifications).length === 0
    ) {
      return <div />;
    }

    return (
      <div>
        <div className="settings">
          <ProfileSettings profile={this.state.profile} />
          <MainSettings data={this.state} />
          <LogoutSettings />
        </div>
      </div>
    );
  }
}

export default withKeycloak(Settings);

class ProfileSettings extends React.Component {
  render() {
    return (
      <div>
        <h3 className="profile-name">{this.props.profile.name}</h3>
        <div className="profile-email">{this.props.profile.email}</div>
      </div>
    );
  }
}