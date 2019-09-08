import React, { Component } from "react";
import FBImg from "../../resources/img/icon-facebook-purple.png";
import GoogleImg from "../../resources/img/icon-googleplus-purple.png";
import { push } from "connected-react-router";
import { withKeycloak } from "react-keycloak";
import { connect } from "react-redux";
import { idprovider } from "../../redux/actions/idprovider";
import { bindActionCreators } from "redux";
import video from "../../resources/video/SL-SplashBG.mp4";
import logo from "../../resources/img/combinedShape@3x.png";
import logotitle from "../../resources/img/slLogoFinal@3x.png";
import { saveMessageTotalNum } from "../../redux/actions/total_messages";

class LoginPage extends Component {
  componentDidMount() {
    // Processes potential deeplink upon arriving to login page - maybe better to put into a separate initialization component?
    this.props.saveMessageTotalNum(0);
    if (window.IonicDeeplink) {
      let self = this;
      window.IonicDeeplink.onDeepLink(function (data) {
        self.processDeeplink(data, self);
      });
    }
  }

  processDeeplink(deeplink, self) {
    self.props.dispatch(push(deeplink.host + deeplink.path));
  }

  // TODO: Replace this method of saving the information with JWT from Keycloak when time permits

  onFBLoginButtonClick() {
    this.props.keycloak.login({
      idpHint: "facebook",
      cordovaOptions: { zoom: "no", hardwareback: "yes" }
    });
    this.props.idprovider("facebook");
  }

  onGoogleLoginButtonClick() {
    this.props.keycloak.login({
      idpHint: "google",
      cordovaOptions: { zoom: "no", hardwareback: "yes" }
    });
    this.props.idprovider("google");
  }

  onEmailLoginButtonClick() {
    this.props.keycloak.login({
      idpHint: "default",
      cordovaOptions: { zoom: "no", hardwareback: "yes" }
    });
  }

  render() {
    return (
      <div className="loginpage">
        <img className="login-logo-img" src={logo} />
        <img className="login-logo-img login-logo-img-title" src={logotitle} />
        <div className="login-overlay">
          <video
            id="background-video"
            preload="auto"
            autoPlay
            loop
            muted
            playsinline
            webkit-playsinline
            onplaying="this.controls=false"
          >
          </video>
          <div className="loginbuttongroup">
            <div
              className="loginbutton fblogin slide-down-fast"
              onClick={() => this.onFBLoginButtonClick()}
            >
              Sign In with Facebook
              <img className="login-img" src={FBImg} />
            </div>
            <div
              className="loginbutton googlelogin slide-down-fast"
              onClick={() => this.onGoogleLoginButtonClick()}
            >
              Sign In with Google
              <img className="login-img" src={GoogleImg} />
            </div>

            <div
              className="loginbutton slide-down-fast"
              onClick={() => this.onEmailLoginButtonClick()}
            >
              Sign In with Email
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    idprovider: state.idprovider
  };
};

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators(
    { idprovider, saveMessageTotalNum },
    dispatch
  );
  return { ...actions, dispatch };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withKeycloak(LoginPage));
