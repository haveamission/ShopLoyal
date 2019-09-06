import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import Loading from "./Loading";
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
    var api = new API(this.props.keycloak);
    api
      .get("settings")
      .then(response => this.loadSettings(response.data))
      .catch(function (error) {
        console.log(error);
      });
  }

  loadSettings(data) {
    console.log("settings data");
    console.log(data);
    this.setState({ notifications: data });
  }

  componentDidMount() {
    if (this.props.keycloak.authenticated) {
      var api = new API(this.props.keycloak);
      api
        .get("userProfileAPI")
        .then(response => this.configuration(response.data))
        .catch(function (error) {
          console.log(error);
        });

      this.getSettings();
    } else {
      // this.props.dispatch(push("/login"));
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

const Images = props =>
  props.images.map((image, i) => (
    <div key={i} className="fadein">
      <div
        onClick={() => props.removeImage(image.public_id)}
        className="delete"
      >
        <FontAwesomeIcon icon={faTimesCircle} size="2x" />
      </div>
      <img src={image.secure_url} alt="" />
    </div>
  ));

const Buttons = props => (
  <div className="buttons fadein">
    <div className="button">
      <label htmlFor="single">
        <FontAwesomeIcon icon={faImage} color="#3B5998" size="10x" />
      </label>
      <input type="file" id="single" onChange={props.onChange} />
    </div>
  </div>
);