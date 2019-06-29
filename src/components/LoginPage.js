import React, { Component } from 'react';
import FBImg from '../resources/img/icon-facebook-white.png';
import GoogleImg from '../resources/img/icon-googleplus-white.png';
import { Link } from 'react-router-dom'
import { push } from 'connected-react-router'
import { withKeycloak } from 'react-keycloak';
import { connect } from 'react-redux'
import {idprovider} from '../actions/idprovider';
import {bindActionCreators} from 'redux'

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
<h2 className="login-header">Log In to Your Account</h2>
<div className="loginbuttongroup">
{/*<div className="googlered loginbutton" onClick={() => this.props.keycloak.login()}>Log In with Keycloak<img className="login-img" src={GoogleImg} /></div>*/}
<div className="googlered loginbutton" onClick={() => this.onGoogleLoginButtonClick()}>Log In with Google<img className="login-img" src={GoogleImg} /></div>
<div className="facebookblue loginbutton" onClick={() => this.onFBLoginButtonClick()}>Log In with Facebook<img className="login-img" src={FBImg} /></div>
</div>
{/*<Link to="/signup/"><div className="bottomtext">Don't have an account? Sign Up</div></Link>*/}
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