import React, { Component } from 'react';
import FBImg from '../resources/img/icon-facebook-white.png';
import GoogleImg from '../resources/img/icon-googleplus-white.png';
import { Link } from 'react-router-dom'
import Page from './Page'

const LoginPage = () => (
    <Page>
    <div className="loginpage">
<h2 className="login-header">Log In to Your Account</h2>
<div className="loginbuttongroup">
<div className="googlered loginbutton">Log In with Google<img className="login-img" src={GoogleImg} /></div>
<div className="facebookblue loginbutton">Log In with Facebook<img className="login-img" src={FBImg} /></div>
</div>
<Link to="/signup/"><div className="bottomtext">Don't have an account? Sign Up</div></Link>
</div>
</Page>
);

export default LoginPage;