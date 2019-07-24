import React, { Component } from 'react';
import FBImg from '../resources/img/icon-facebook-purple.png';
import GoogleImg from '../resources/img/icon-googleplus-purple.png';
import { Link } from 'react-router-dom'
import { push } from 'connected-react-router'
import { withKeycloak } from 'react-keycloak';
import { connect } from 'react-redux'
import {idprovider} from '../actions/idprovider';
import {bindActionCreators} from 'redux'
import video from '../resources/video/SL-SplashBG.mp4';
import logo from '../resources/img/combinedShape@3x.png';
import logotitle from '../resources/img/slLogoFinal@3x.png'

//var ref;

class LoginPage extends React.Component {

  componentDidMount() {
  }

  // TODO: Replace this method of saving the information with JWT from Keycloak when you have time

  onFBLoginButtonClick() {
    this.props.keycloak.login({idpHint: 'facebook', cordovaOptions: { zoom: "no", hardwareback: "yes" }})
    this.props.idprovider("facebook");
  }

  onGoogleLoginButtonClick() {
    this.props.keycloak.login({idpHint: 'google', cordovaOptions: { zoom: "no", hardwareback: "yes" }})
    this.props.idprovider("google");
  }
      
      render(){
          return(
    <div className="loginpage">
    <img className="login-logo-img" src={logo} />
    <img className="login-logo-img login-logo-img-title" src={logotitle} />
<div className="login-overlay">
<video id="background-video" preload="auto" autoPlay loop muted playsinline onplaying="this.controls=false">
    {/*<source src={video} type='video/mp4' />*/}
</video>
<div className="loginbuttongroup">
{/*<div className="googlered loginbutton" onClick={() => this.props.keycloak.login()}>Log In with Keycloak<img className="login-img" src={GoogleImg} /></div>*/}
<div className="loginbutton fblogin" onClick={() => this.onFBLoginButtonClick()}>Sign In with Facebook<img className="login-img" src={FBImg} /></div>
<div className="loginbutton googlelogin" onClick={() => this.onGoogleLoginButtonClick()}>Sign In with Google<img className="login-img" src={GoogleImg} /></div>
</div>
</div>
</div>
);
      }
    }

    const mapStateToProps = (state) => {
        return {
          idprovider: state.idprovider
        };
      };

      function mapDispatchToProps(dispatch) {
        let actions =  bindActionCreators({ idprovider }, dispatch);
        return { ...actions, dispatch };
      }
      
      export default connect(mapStateToProps, mapDispatchToProps)(withKeycloak(LoginPage));