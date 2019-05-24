import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Page from './Page'

export default () => (
    <Page>
    <div className="settings">
    <ul className="main-settings">
    <li><span className="setting-left">Email</span> <span className="setting-right">support@shoployal.com</span></li>
    <li><span className="setting-left">Phone</span> <span className="setting-right">844-926-8439</span></li>
<Link to="/privacy/"><li className="list-bottom setting-left">Privacy Policy and T & C</li></Link>
    </ul>
    </div>
    </Page>
  )