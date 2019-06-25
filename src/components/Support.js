import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Back from './Back'

export default () => (
<div>
    <div className="settings">
    <ul className="main-settings">
    <li><span className="setting-left">Email</span> <span className="setting-right">contact@shoployal.com</span></li>
<Link to="/privacy/"><li className="list-bottom setting-left">Privacy Policy and T & C</li></Link>
    </ul>
    </div>
    </div>
  )